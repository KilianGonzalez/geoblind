'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Globe, Search, Flag, Sun, Moon } from 'lucide-react'
import { useGameState, parseGameModeParam } from '@/hooks/use-game-state'
import { useAuthUser } from '@/hooks/use-auth-user'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage } from '@/hooks/use-language'
import GuessCard from '@/components/GuessCard'
import GlobeDynamic from '@/components/globe-dynamic'
import GameResultModal from '@/components/game-result-modal'
import { countryToCountryData } from '@/lib/game-logic'
import type { Country } from '@/lib/types'
import type { GuessResult } from '@/lib/game-logic'
import { Skeleton } from '@/components/ui/skeleton'

const MODE_TABS: { id: string; color: string }[] = [
  { id: 'daily', color: '#00D4FF' },
  { id: 'infinite', color: '#A855F7' },
  { id: 'region', color: '#22C55E' },
  { id: 'timed', color: '#F59E0B' },
  { id: 'hard', color: '#EF4444' },
]

const getModeLabels = () => ({
  daily: 'MODO DIARIO',
  infinite: 'MODO INFINITO',
  region: 'MODO REGIÓN',
  timed: 'CONTRARRELOJ',
  hard: 'MODO DIFÍCIL',
})

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
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  const modeLabels = {
    daily: t('daily'),
    infinite: t('infinite'),
    region: t('region'),
    timed: t('timed'),
    hard: t('hard')
  }

  return (
    <header className="flex items-center justify-between flex-shrink-0 px-5 h-14 border-b border-border/40 bg-card/95 backdrop-blur-md sticky top-0 z-50">
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
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeMode === m.id
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{
              backgroundColor: activeMode === m.id ? m.color : 'transparent',
              border: `1px solid ${activeMode === m.id ? m.color : 'transparent'}`,
            }}
            aria-current={activeMode === m.id ? 'page' : undefined}
          >
            {modeLabels[m.id as keyof typeof modeLabels]}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* User Menu */}
        {authLoading ? (
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground text-xs font-bold">
            {user.email?.slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <Link
            href="/auth"
            className="px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-card transition-colors"
          >
            Iniciar Sesión
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
  const { language, t } = useLanguage()
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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <GameNavbar activeMode={modeParam} user={user} authLoading={authLoading} />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <div
          className="flex flex-col flex-shrink-0 overflow-y-auto w-full lg:w-[40%]"
          style={{ maxHeight: 'calc(100dvh - 56px)' }}
        >
          <div className="flex flex-col gap-4 p-5 min-h-full">
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
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-primary/10 border border-primary/40 text-primary font-mono"
                  >
                    {getModeLabels()[state.mode] ?? state.mode} · {t('day')} {dayNum}
                  </span>
                </div>

                {state.mode === 'timed' && state.timeLeftSec != null && isPlaying && (
                  <p
                    className="text-center text-sm font-bold tabular-nums font-mono text-yellow-500"
                  >
                    {t('time')}: {state.timeLeftSec}s
                  </p>
                )}

                <div
                  className="flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      {t('attempt')} {state.attemptsUsed}
                      {Number.isFinite(state.maxAttempts) ? ` / ${state.maxAttempts}` : ' / ' + String.fromCharCode(8734)}
                    </span>
                    <span
                      className="text-xs text-muted-foreground font-mono"
                    >
                      {attemptsLeft != null ? `${attemptsLeft} ${t('attemptsLeft')}` : t('withoutLimit')}
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
                      placeholder={t('writeCountry')}
                      disabled={!isPlaying}
                      autoComplete="off"
                      value={state.searchQuery}
                      onChange={e => void updateSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-12 pr-10 h-13 text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none bg-background border rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <span
                      className="absolute right-4 text-xs text-muted-foreground pointer-events-none select-none font-mono"
                      aria-hidden="true"
                    >
                      ↵
                    </span>
                  </div>

                  {state.searchResults.length > 0 && (
                    <div
                      className="absolute left-0 right-0 mt-2 overflow-hidden z-30 bg-card border border-border/40 rounded-xl shadow-lg"
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
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            i === state.selectedIndex ? 'bg-primary/10' : 'hover:bg-card/50'
                          } ${i < state.searchResults.length - 1 ? 'border-b border-border/20' : ''}`}
                        >
                          <span className="text-xl leading-none" aria-hidden="true">
                            {c.flag_emoji}
                          </span>
                          <span className="font-semibold text-sm text-foreground flex-1">{c.name}</span>
                          <span
                            className="text-xs text-muted-foreground font-mono"
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
                      <p className="text-foreground/60 text-sm">{t('startWriting')}</p>
                      <p className="text-muted-foreground text-xs font-mono">
                        {t('hintsInfo')}
                      </p>
                    </div>
                  )}
                  {sortedGuesses.map(g => (
                    <GuessCard
                      key={`${g.attemptNumber}-${g.country.id}`}
                      result={g}
                      isNew={flashAttempt != null && g.attemptNumber === flashAttempt}
                      showDirection={state.showDirection}
                      showColorHints={state.showColorHints}
                    />
                  ))}
                </div>

                {state.gameStatus !== 'playing' && modalDismissed && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setModalDismissed(false)}
                      className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        state.gameStatus === 'won' 
                          ? 'bg-green-500/10 border border-green-500/40 text-green-400' 
                          : 'bg-red-500/10 border border-red-500/40 text-red-400'
                      }`}
                    >
                      {t('seeResult')}
                    </button>
                  </div>
                )}

                {isPlaying && (
                  <div className="flex justify-center pt-1">
                    {!showConfirmGiveUp ? (
                      <button
                        type="button"
                        onClick={() => setShowConfirmGiveUp(true)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground/60 transition-colors font-mono"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {t('giveUp')}
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-mono">
                          {t('sure')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            void giveUp()
                            setShowConfirmGiveUp(false)
                          }}
                          className="text-xs font-bold text-red-500 transition-colors font-mono"
                        >
                          {t('yesGiveUp')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirmGiveUp(false)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                        >
                          {t('cancel')}
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
