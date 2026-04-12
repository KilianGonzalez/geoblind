'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Globe, Search, Flag } from 'lucide-react'
import { useGameState, parseGameModeParam } from '@/hooks/use-game-state'
import { useAuthUser } from '@/hooks/use-auth-user'
import GuessCard from '@/components/GuessCard'
import GlobeDynamic from '@/components/globe-dynamic'
import GameResultModal from '@/components/game-result-modal'
import { countryToCountryData } from '@/lib/game-logic'
import type { Country } from '@/lib/types'
import type { GuessResult } from '@/lib/game-logic'
import { Skeleton } from '@/components/ui/skeleton'

const MODE_LABELS: Record<string, string> = {
  daily: 'MODO DIARIO',
  infinite: 'MODO INFINITO',
  region: 'MODO REGIÓN',
  timed: 'CONTRARRELOJ',
  hard: 'MODO DIFÍCIL',
}

const MODE_TABS: { id: string; label: string; color: string }[] = [
  { id: 'daily', label: 'Diario', color: '#00D4FF' },
  { id: 'infinite', label: 'Infinito', color: '#A855F7' },
  { id: 'region', label: 'Región', color: '#22C55E' },
  { id: 'timed', label: 'Contrarreloj', color: '#F59E0B' },
  { id: 'hard', label: 'Difícil', color: '#EF4444' },
]

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d.getTime() - start.getTime()) / 86400000)
}

function guessSortDesc(a: GuessResult, b: GuessResult): number {
  return b.attemptNumber - a.attemptNumber
}

function GameNavbar({
  activeMode,
  user,
  authLoading,
}: {
  activeMode: string
  user: ReturnType<typeof useAuthUser>['user']
  authLoading: boolean
}) {
  const router = useRouter()
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-5"
      style={{
        height: 56,
        borderBottom: '1px solid rgba(27,58,75,0.7)',
        background: 'rgba(13,27,42,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
        <Globe className="w-6 h-6 text-primary" />
        <span className="font-bold text-base text-foreground">GeoBlind</span>
      </Link>

      <nav className="hidden md:flex items-center gap-1" aria-label="Modos de juego">
        {MODE_TABS.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              const q = m.id === 'region' ? '?mode=region&continent=Europa' : `?mode=${m.id}`
              router.push(`/game${q}`)
            }}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background: activeMode === m.id ? m.color : 'transparent',
              color: activeMode === m.id ? '#0A0E1A' : '#8BA4B0',
              border: `1px solid ${activeMode === m.id ? m.color : 'transparent'}`,
            }}
            aria-current={activeMode === m.id ? 'page' : undefined}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Idioma">
          <span className="text-lg">🌐</span>
        </button>
        <span className="text-sm font-semibold text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          ES
        </span>
        {authLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <Link
            href="/ranking"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: 'rgba(0,212,255,0.15)',
              border: '1px solid rgba(0,212,255,0.4)',
              color: '#00D4FF',
            }}
            title={user.email ?? 'Cuenta'}
          >
            {(user.email?.charAt(0) ?? '?').toUpperCase()}
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}

function GameInner() {
  const searchParams = useSearchParams()
  const modeParam = parseGameModeParam(searchParams.get('mode'))
  const regionContinent = searchParams.get('continent')

  const [globeGuesses, setGlobeGuesses] = useState<GuessResult[]>([])
  const { user, loading: authLoading } = useAuthUser()
  const { state, initGame, submitGuess, updateSearch, navigateResults, clearSearch, giveUp } = useGameState({
    onGuessesChange: setGlobeGuesses,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const [showConfirmGiveUp, setShowConfirmGiveUp] = useState(false)
  const [flashAttempt, setFlashAttempt] = useState<number | null>(null)
  const [modalDismissed, setModalDismissed] = useState(false)
  useEffect(() => {
    const ac = new AbortController()
    void initGame(modeParam, regionContinent, { signal: ac.signal })
    return () => ac.abort()
  }, [modeParam, regionContinent, initGame])

  const trySubmit = useCallback(
    (nameOrCountry: string | Country) => {
      if (state.gameStatus !== 'playing') return
      let country: Country | undefined
      if (typeof nameOrCountry === 'string') {
        const q = nameOrCountry.trim().toLowerCase()
        country = state.allCountries.find(c => c.name.toLowerCase() === q)
        if (!country) return
      } else {
        country = nameOrCountry
      }
      setFlashAttempt(state.attemptsUsed + 1)
      void submitGuess(country)
      clearSearch()
      if (inputRef.current) inputRef.current.value = ''
    },
    [state.gameStatus, state.attemptsUsed, state.allCountries, submitGuess, clearSearch]
  )

  useEffect(() => {
    if (flashAttempt == null) return
    const t = window.setTimeout(() => setFlashAttempt(null), 700)
    return () => window.clearTimeout(t)
  }, [flashAttempt])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        navigateResults('down')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        navigateResults('up')
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (state.selectedIndex >= 0 && state.searchResults[state.selectedIndex]) {
          trySubmit(state.searchResults[state.selectedIndex])
        } else if (state.searchQuery.trim()) {
          trySubmit(state.searchQuery.trim())
        }
      } else if (e.key === 'Escape') {
        clearSearch()
      }
    },
    [state.selectedIndex, state.searchResults, state.searchQuery, navigateResults, trySubmit, clearSearch]
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [modeParam])

  useEffect(() => {
    setModalDismissed(false)
  }, [state.sessionId])

  const sortedGuesses = [...state.guesses].sort(guessSortDesc)
  const attemptsLeft =
    Number.isFinite(state.maxAttempts) ? state.maxAttempts - state.attemptsUsed : null
  const isPlaying = state.gameStatus === 'playing'
  const dayNum = dayOfYear(new Date())

  const dotCount = Number.isFinite(state.maxAttempts)
    ? state.maxAttempts
    : Math.min(Math.max(state.attemptsUsed + (isPlaying ? 1 : 0), 6), 24)

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0A0E1A' }}>
      <GameNavbar activeMode={modeParam} user={user} authLoading={authLoading} />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <div
          className="flex flex-col flex-shrink-0 overflow-y-auto w-full lg:w-[40%]"
          style={{ maxHeight: 'calc(100dvh - 56px)' }}
        >
          <div className="flex flex-col gap-4 p-5" style={{ minHeight: '100%' }}>
            {state.isLoading ? (
              <div className="flex flex-col gap-3 py-6">
                <Skeleton className="h-8 w-48 rounded-full" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-[52px] w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : state.error && !state.targetCountry ? (
              <p className="text-sm text-destructive">{state.error}</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-widest"
                    style={{
                      background: 'rgba(0,212,255,0.12)',
                      border: '1px solid rgba(0,212,255,0.4)',
                      color: '#00D4FF',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {MODE_LABELS[state.mode] ?? state.mode} &middot; Día {dayNum}
                  </span>
                </div>

                {state.mode === 'timed' && state.timeLeftSec != null && isPlaying && (
                  <p
                    className="text-center text-sm font-bold tabular-nums"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#F59E0B' }}
                  >
                    Tiempo: {state.timeLeftSec}s
                  </p>
                )}

                <div
                  className="flex flex-col gap-2 p-4 rounded-xl"
                  style={{ background: '#0D1B2A', border: '1px solid rgba(27,58,75,0.8)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      Intento {state.attemptsUsed}
                      {Number.isFinite(state.maxAttempts) ? ` / ${state.maxAttempts}` : ' / ∞'}
                    </span>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {attemptsLeft != null ? `${attemptsLeft} restantes` : 'Sin límite'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap" role="list" aria-label="Intentos usados">
                    {Array.from({ length: dotCount }).map((_, i) => {
                      const used = i < state.attemptsUsed
                      const current = i === state.attemptsUsed && isPlaying
                      return (
                        <div
                          key={i}
                          role="listitem"
                          aria-label={used ? 'Intento usado' : current ? 'Intento actual' : 'Intento disponible'}
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            flexShrink: 0,
                            background: used ? '#00D4FF' : 'transparent',
                            border: `2px solid ${used ? '#00D4FF' : current ? '#00D4FF' : 'rgba(0,212,255,0.3)'}`,
                            animation: current ? 'pulse-glow 1.2s ease-in-out infinite' : undefined,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="relative" role="search">
                  <label htmlFor="country-search" className="sr-only">
                    ¿Cuál es el país misterioso?
                  </label>
                  <div className="relative flex items-center">
                    <Search
                      className="absolute left-4 w-5 h-5 pointer-events-none"
                      style={{ color: '#00D4FF' }}
                      aria-hidden="true"
                    />
                    <input
                      id="country-search"
                      ref={inputRef}
                      type="text"
                      placeholder="Escribe un país..."
                      disabled={!isPlaying}
                      autoComplete="off"
                      value={state.searchQuery}
                      onChange={e => void updateSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-12 pr-10 text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                      style={{
                        height: 52,
                        background: '#0D1B2A',
                        border: '1px solid',
                        borderColor: state.searchQuery ? '#00D4FF' : 'rgba(27,58,75,0.8)',
                        borderRadius: 12,
                        fontSize: 15,
                        boxShadow: state.searchQuery ? '0 0 0 3px rgba(0,212,255,0.15)' : undefined,
                        fontFamily: 'Inter, sans-serif',
                        transition: 'border-color 200ms, box-shadow 200ms',
                      }}
                    />
                    <span
                      className="absolute right-4 text-xs text-muted-foreground pointer-events-none select-none"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      aria-hidden="true"
                    >
                      ↵
                    </span>
                  </div>

                  {state.searchResults.length > 0 && (
                    <div
                      className="absolute left-0 right-0 mt-2 overflow-hidden z-30"
                      style={{
                        background: '#0D1B2A',
                        border: '1px solid rgba(27,58,75,0.9)',
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                      role="listbox"
                      aria-label="Sugerencias de países"
                    >
                      {state.searchResults.map((c, i) => (
                        <button
                          key={c.id}
                          type="button"
                          role="option"
                          aria-selected={i === state.selectedIndex}
                          onMouseDown={() => trySubmit(c)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                          style={{
                            background: i === state.selectedIndex ? 'rgba(0,212,255,0.15)' : 'transparent',
                            borderBottom:
                              i < state.searchResults.length - 1 ? '1px solid rgba(27,58,75,0.4)' : 'none',
                          }}
                        >
                          <span className="text-xl leading-none" aria-hidden="true">
                            {c.flag_emoji}
                          </span>
                          <span className="font-semibold text-sm text-foreground flex-1">{c.name}</span>
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            {c.continent}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {state.error && state.targetCountry && (
                  <p className="text-xs text-destructive">{state.error}</p>
                )}

                <div className="flex flex-col gap-2 flex-1" role="list" aria-label="Historial de intentos">
                  {sortedGuesses.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 py-10 text-center gap-2">
                      <p className="text-foreground/60 text-sm">Empieza escribiendo un país arriba</p>
                      <p className="text-muted-foreground text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Te daremos pistas de distancia y dirección
                      </p>
                    </div>
                  )}
                  {sortedGuesses.map(g => (
                    <GuessCard
                      key={`${g.attemptNumber}-${g.country.id}`}
                      result={g}
                      isNew={flashAttempt != null && g.attemptNumber === flashAttempt}
                    />
                  ))}
                </div>

                {state.gameStatus !== 'playing' && modalDismissed && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setModalDismissed(false)}
                      className="px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
                      style={{
                        background: state.gameStatus === 'won' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
                        border: `1px solid ${state.gameStatus === 'won' ? '#4CAF5040' : '#F4433640'}`,
                        color: '#E8F4F8',
                      }}
                    >
                      Ver resultado
                    </button>
                  </div>
                )}

                {isPlaying && (
                  <div className="flex justify-center pt-1">
                    {!showConfirmGiveUp ? (
                      <button
                        type="button"
                        onClick={() => setShowConfirmGiveUp(true)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground/60 transition-colors"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        Rendirse
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          ¿Seguro?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            void giveUp()
                            setShowConfirmGiveUp(false)
                          }}
                          className="text-xs font-bold transition-colors"
                          style={{ color: '#F44336', fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          Sí, rendirse
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirmGiveUp(false)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            borderLeft: '1px solid rgba(27,58,75,0.6)',
          }}
        >
          <GlobeDynamic guesses={globeGuesses} />
        </div>
      </div>

      {state.targetCountry && state.gameStatus !== 'playing' && !modalDismissed && (
        <GameResultModal
          status={state.gameStatus}
          target={countryToCountryData(state.targetCountry)}
          guesses={state.guesses}
          attemptsUsed={state.attemptsUsed}
          finalScore={state.finalScore}
          timeElapsedSec={state.timeElapsed}
          maxAttemptsDisplay={Number.isFinite(state.maxAttempts) ? state.maxAttempts : Number.POSITIVE_INFINITY}
          dailyDayNumber={dayNum}
          onClose={() => setModalDismissed(true)}
        />
      )}
    </div>
  )
}

function GameFallback() {
  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#0A0E1A' }}>
      <div className="h-14 border-b border-white/10 flex items-center px-5">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="p-5 flex flex-col gap-4">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-[52px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function GameClient() {
  return (
    <Suspense fallback={<GameFallback />}>
      <GameInner />
    </Suspense>
  )
}
