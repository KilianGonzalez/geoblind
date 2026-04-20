'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getFallbackGameModeConfig, getGameModeConfig, type GameModeConfig } from '@/lib/services/game-modes'
import { getProfileIdByUserId } from '@/lib/services/profiles'
import type { Country, GameMode } from '@/lib/types'
import { getAllCountries, getCountriesByContinent, searchCountries } from '@/lib/services/countries'
import { getCountryById } from '@/lib/services/countries'
import {
  createGameSession,
  saveGuess,
  closeGameSession,
  getCompletedDailySessionForProfile,
  getSessionById,
  getGuessesForSessionWithCountries,
} from '@/lib/services/game-sessions'
import {
  buildGuessResult,
  calculateDistance,
  calculateDirection,
  calculateProximity,
  calculateScore,
  getDailyCountry,
  type GuessResult,
} from '@/lib/game-logic'

export type GameStatus = 'playing' | 'won' | 'lost'

export interface GameUiState {
  mode: GameMode
  targetCountry: Country | null
  allCountries: Country[]
  guesses: GuessResult[]
  gameStatus: GameStatus
  attemptsUsed: number
  maxAttempts: number
  timeElapsed: number
  timeLeftSec: number | null
  searchQuery: string
  searchResults: Country[]
  selectedIndex: number
  sessionId: string | null
  isLoading: boolean
  error: string | null
  finalScore: number
  showColorHints: boolean
  showDirection: boolean
}

const initialState: GameUiState = {
  mode: 'daily',
  targetCountry: null,
  allCountries: [],
  guesses: [],
  gameStatus: 'playing',
  attemptsUsed: 0,
  maxAttempts: 6,
  timeElapsed: 0,
  timeLeftSec: null,
  searchQuery: '',
  searchResults: [],
  selectedIndex: -1,
  sessionId: null,
  isLoading: true,
  error: null,
  finalScore: 0,
  showColorHints: true,
  showDirection: true,
}

function dailyStorageKey(): string {
  const d = new Date()
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return `geoblind_daily_session_${key}`
}

async function fetchProfileId(): Promise<string | undefined> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return undefined

  try {
    return await getProfileIdByUserId(user.id)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const message = error instanceof Error ? error.message : 'No se pudo resolver el perfil'
      console.log('[fetchProfileId]', message)
    }
    return undefined
  }
}

export function parseGameModeParam(raw: string | null | undefined): GameMode {
  const v = (raw ?? 'daily').toLowerCase()
  const map: Record<string, GameMode> = {
    daily: 'daily',
    diario: 'daily',
    infinite: 'infinite',
    infinito: 'infinite',
    region: 'region',
    timed: 'timed',
    contrarreloj: 'timed',
    hard: 'hard',
    dificil: 'hard',
  }
  return map[v] ?? 'daily'
}

export interface UseGameStateOptions {
  onGuessesChange?: (guesses: GuessResult[]) => void
}

export function useGameState(options: UseGameStateOptions = {}) {
  const { onGuessesChange } = options
  const [state, setState] = useState<GameUiState>(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const timeElapsedRef = useRef(0)
  useEffect(() => {
    timeElapsedRef.current = state.timeElapsed
  }, [state.timeElapsed])

  const restoreCompletedSession = useCallback(
    async (
      session: import('@/lib/types').GameSessionRow,
      allCountries: Country[],
      config: GameModeConfig
    ) => {
      const target = await getCountryById(session.country_id)
      if (!target) throw new Error('No se encontró el país objetivo.')
      const guesses = await getGuessesForSessionWithCountries(session.id, target)
      const gameStatus: GameStatus = session.won ? 'won' : 'lost'
      const maxAttempts = config.max_attempts == null ? Number.POSITIVE_INFINITY : config.max_attempts
      setState({
        ...initialState,
        mode: session.game_mode,
        targetCountry: target,
        allCountries,
        guesses,
        gameStatus,
        attemptsUsed: session.attempts_used,
        maxAttempts,
        timeElapsed: session.time_elapsed_sec,
        timeLeftSec: null,
        sessionId: session.id,
        isLoading: false,
        error: null,
        finalScore: session.score,
        showColorHints: config.show_color_hints,
        showDirection: config.show_direction,
      })
      onGuessesChange?.(guesses)
    },
    [onGuessesChange]
  )

  const initGame = useCallback(
    async (mode: GameMode, regionContinent?: string | null, opts?: { signal?: AbortSignal }) => {
      const signal = opts?.signal
      setState(s => ({
        ...initialState,
        mode,
        isLoading: true,
        error: null,
        allCountries: s.allCountries,
      }))

      try {
        const list = await getAllCountries()
        if (list.length === 0) {
          throw new Error('No hay países en la base de datos.')
        }
        if (signal?.aborted) return
        const config = await getGameModeConfig(mode).catch(() => getFallbackGameModeConfig(mode))
        if (signal?.aborted) return
        const profileId = await fetchProfileId()
        if (signal?.aborted) return

        if (mode === 'daily') {
          if (profileId) {
            const existing = await getCompletedDailySessionForProfile({ profileId, gameMode: 'daily' })
            if (signal?.aborted) return
            if (existing) {
              await restoreCompletedSession(existing, list, config)
              return
            }
          } else if (typeof window !== 'undefined') {
            const sid = localStorage.getItem(dailyStorageKey())
            if (sid) {
              const existing = await getSessionById(sid)
              if (signal?.aborted) return
              if (existing?.completed && existing.game_mode === 'daily') {
                const day = new Date(existing.played_at).toDateString()
                if (day === new Date().toDateString()) {
                  await restoreCompletedSession(existing, list, config)
                  return
                }
              }
            }
          }
        }

        let pool = list
        if (mode === 'region') {
          const cont = regionContinent?.trim()
          if (cont) {
            pool = await getCountriesByContinent(cont)
            if (pool.length === 0) pool = list
          }
        }
        if (signal?.aborted) return
        const target = getDailyCountry(pool, new Date())
        const session = await createGameSession({
          gameMode: mode,
          countryId: target.id,
          isAnonymous: !profileId,
          profileId,
        })
        if (signal?.aborted) return

        if (mode === 'daily' && !profileId && typeof window !== 'undefined') {
          localStorage.setItem(dailyStorageKey(), session.id)
        }

        const maxAttempts = config.max_attempts == null ? Number.POSITIVE_INFINITY : config.max_attempts

        setState({
          mode,
          targetCountry: target,
          allCountries: list,
          guesses: [],
          gameStatus: 'playing',
          attemptsUsed: 0,
          maxAttempts,
          timeElapsed: 0,
          timeLeftSec: config.time_limit_sec,
          searchQuery: '',
          searchResults: [],
          selectedIndex: -1,
          sessionId: session.id,
          isLoading: false,
          error: null,
          finalScore: 0,
          showColorHints: config.show_color_hints,
          showDirection: config.show_direction,
        })
        onGuessesChange?.([])
      } catch (err) {
        if (opts?.signal?.aborted) return
        const message = err instanceof Error ? err.message : 'Error al iniciar la partida'
        if (process.env.NODE_ENV === 'development') {
          console.log('[initGame]', message)
        }
        setState(s => ({
          ...initialState,
          mode,
          isLoading: false,
          error: message,
        }))
      }
    },
    [restoreCompletedSession, onGuessesChange]
  )

  useEffect(() => {
    if (state.gameStatus !== 'playing') return
    const id = window.setInterval(() => {
      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev
        const nextElapsed = prev.timeElapsed + 1
        if (prev.mode === 'timed' && prev.timeLeftSec != null) {
          const left = prev.timeLeftSec - 1
          if (left <= 0) {
            return { ...prev, timeElapsed: nextElapsed, timeLeftSec: 0, gameStatus: 'lost' }
          }
          return { ...prev, timeElapsed: nextElapsed, timeLeftSec: left }
        }
        return { ...prev, timeElapsed: nextElapsed }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [state.gameStatus, state.mode])

  const closeLostTimedSession = useRef(false)
  useEffect(() => {
    if (state.mode !== 'timed' || state.gameStatus !== 'lost' || state.timeLeftSec !== 0) {
      closeLostTimedSession.current = false
      return
    }
    if (closeLostTimedSession.current) return
    closeLostTimedSession.current = true
    const sessionId = state.sessionId
    const attempts = state.attemptsUsed
    const elapsed = state.timeElapsed
    void (async () => {
      if (!sessionId) return
      try {
        await closeGameSession({
          sessionId,
          won: false,
          attemptsUsed: attempts,
          timeElapsedSec: elapsed,
          score: 0,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cerrar sesión'
        if (process.env.NODE_ENV === 'development') {
          console.log('[timed loss]', message)
        }
      }
    })()
  }, [state.mode, state.gameStatus, state.timeLeftSec, state.sessionId, state.attemptsUsed, state.timeElapsed])

  const submitGuess = useCallback(
    async (country: Country) => {
      const snap = stateRef.current
      if (snap.gameStatus !== 'playing' || !snap.targetCountry || !snap.sessionId) return
      if (snap.guesses.some(g => g.country.id === country.id)) return

      const attemptNumber = snap.attemptsUsed + 1
      
      // Calculate values explicitly before saving
      const distanceKm = calculateDistance(
        snap.targetCountry.lat,
        snap.targetCountry.lng,
        country.lat,
        country.lng
      )
      const direction = calculateDirection(
        snap.targetCountry.lat,
        snap.targetCountry.lng,
        country.lat,
        country.lng
      )
      const proximityPct = calculateProximity(distanceKm)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Guess values:', { distanceKm, direction, proximityPct })
      }
      
      const result = buildGuessResult({
        guessed: country,
        target: snap.targetCountry,
        attemptNumber,
      })

      try {
        await saveGuess({
          sessionId: snap.sessionId,
          countryId: country.id,
          attemptNumber,
          distanceKm,
          direction,
          proximityPct,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudo guardar el intento'
        if (process.env.NODE_ENV === 'development') {
          console.log('[submitGuess]', message)
        }
        setState(prev => ({ ...prev, error: message }))
        return
      }

      const newGuesses = [...snap.guesses, result]
      const won = result.isCorrect
      const finiteMax = Number.isFinite(snap.maxAttempts)
      const lostByAttempts = finiteMax && attemptNumber >= snap.maxAttempts && !won
      const nextStatus: GameStatus = won ? 'won' : lostByAttempts ? 'lost' : 'playing'
      const elapsed = timeElapsedRef.current
      const score = calculateScore(attemptNumber, elapsed, won)

      setState(prev => ({
        ...prev,
        guesses: newGuesses,
        attemptsUsed: attemptNumber,
        gameStatus: nextStatus,
        searchQuery: '',
        searchResults: [],
        selectedIndex: -1,
        finalScore: won ? score : prev.finalScore,
      }))
      onGuessesChange?.(newGuesses)

      if (nextStatus !== 'playing') {
        try {
          await closeGameSession({
            sessionId: snap.sessionId,
            won,
            attemptsUsed: attemptNumber,
            timeElapsedSec: elapsed,
            score: won ? score : 0,
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error al cerrar la partida'
          if (process.env.NODE_ENV === 'development') {
            console.log('[submitGuess close]', message)
          }
          setState(prev => ({ ...prev, error: message }))
        }
      }
    },
    [onGuessesChange]
  )

  const updateSearch = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, selectedIndex: -1 }))
    const q = query.trim()
    if (!q) {
      setState(prev => ({ ...prev, searchResults: [] }))
      return
    }
    try {
      const results = await searchCountries(q)
      setState(prev => ({ ...prev, searchResults: results, selectedIndex: -1 }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error en la búsqueda'
      if (process.env.NODE_ENV === 'development') {
        console.log('[updateSearch]', message)
      }
      setState(prev => ({ ...prev, error: message, searchResults: [] }))
    }
  }, [])

  const navigateResults = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      const max = prev.searchResults.length - 1
      if (max < 0) return prev
      let next = prev.selectedIndex + (direction === 'down' ? 1 : -1)
      next = Math.max(-1, Math.min(max, next))
      return { ...prev, selectedIndex: next }
    })
  }, [])

  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchQuery: '', searchResults: [], selectedIndex: -1 }))
  }, [])

  const giveUp = useCallback(async () => {
    const snap = stateRef.current
    if (snap.gameStatus !== 'playing' || !snap.sessionId) return
    const elapsed = timeElapsedRef.current
    try {
      await closeGameSession({
        sessionId: snap.sessionId,
        won: false,
        attemptsUsed: snap.attemptsUsed,
        timeElapsedSec: elapsed,
        score: 0,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al rendirse'
      if (process.env.NODE_ENV === 'development') {
        console.log('[giveUp]', message)
      }
      setState(prev => ({ ...prev, error: message }))
      return
    }
    setState(prev => ({ ...prev, gameStatus: 'lost', finalScore: 0 }))
  }, [])

  const resetGame = useCallback(async () => {
    const mode = stateRef.current.mode
    const continent =
      mode === 'region' && typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('continent')
        : null
    await initGame(mode, continent, {})
  }, [initGame])

  return {
    state,
    initGame,
    submitGuess,
    updateSearch,
    navigateResults,
    clearSearch,
    giveUp,
    resetGame,
  }
}
