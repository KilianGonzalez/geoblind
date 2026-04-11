'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Globe, Search, Flag } from 'lucide-react'
import { useGameState } from '@/hooks/use-game-state'
import GuessCard from '@/components/GuessCard'
import GlobeDynamic from '@/components/globe-dynamic'

const DAY_NUMBER = 47

const MODE_LABELS: Record<string, string> = {
  diario: 'MODO DIARIO',
  infinito: 'MODO INFINITO',
  region: 'MODO REGIÓN',
  contrarreloj: 'CONTRARRELOJ',
  dificil: 'MODO DIFÍCIL',
}

export default function GamePage() {
  const { state, submitGuess, updateSearch, navigateResults, clearSearch, giveUp } = useGameState()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showConfirmGiveUp, setShowConfirmGiveUp] = useState(false)
  const [newGuessIndex, setNewGuessIndex] = useState<number | null>(null)

  const handleSubmit = useCallback((name: string) => {
    if (!name.trim() || state.gameStatus !== 'playing') return
    const prevLen = state.guesses.length
    submitGuess(name)
    setNewGuessIndex(prevLen)
    clearSearch()
    if (inputRef.current) inputRef.current.value = ''
  }, [state.gameStatus, state.guesses.length, submitGuess, clearSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); navigateResults('down') }
    else if (e.key === 'ArrowUp') { e.preventDefault(); navigateResults('up') }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (state.selectedIndex >= 0 && state.searchResults[state.selectedIndex]) {
        handleSubmit(state.searchResults[state.selectedIndex].name)
      } else if (state.searchQuery.trim()) {
        handleSubmit(state.searchQuery.trim())
      }
    } else if (e.key === 'Escape') {
      clearSearch()
    }
  }, [state.selectedIndex, state.searchResults, state.searchQuery, navigateResults, handleSubmit, clearSearch])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const attemptsLeft = state.maxAttempts - state.attemptsUsed
  const isPlaying = state.gameStatus === 'playing'

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#0A0E1A' }}>
      {/* ── Navbar ─────────────────────────────────────────────── */}
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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Globe className="w-6 h-6 text-primary" />
          <span className="font-bold text-base text-foreground">GeoBlind</span>
        </Link>

        {/* Mode tabs */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Modos de juego">
          {[
            { id: 'diario',       label: 'Diario',        color: '#00D4FF' },
            { id: 'infinito',     label: 'Infinito',      color: '#A855F7' },
            { id: 'region',       label: 'Región',        color: '#22C55E' },
            { id: 'contrarreloj', label: 'Contrarreloj',  color: '#F59E0B' },
            { id: 'dificil',      label: 'Difícil',       color: '#EF4444' },
          ].map(m => (
            <button
              key={m.id}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: state.mode === m.id ? m.color : 'transparent',
                color: state.mode === m.id ? '#0A0E1A' : '#8BA4B0',
                border: `1px solid ${state.mode === m.id ? m.color : 'transparent'}`,
              }}
              aria-current={state.mode === m.id ? 'page' : undefined}
            >
              {m.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors" title="Idioma">
            <span className="text-lg">🌐</span>
          </button>
          <span className="text-sm font-semibold text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>ES</span>
        </div>
      </header>

      {/* ── Main Two-Column Layout ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── LEFT PANEL ──────────────────────────────────────────── */}
        <div
          className="flex flex-col flex-shrink-0 overflow-y-auto w-full lg:w-[40%]"
          style={{ maxHeight: 'calc(100dvh - 56px)' }}
        >
          <div
            className="flex flex-col gap-4 p-5"
            style={{ minHeight: '100%' }}
          >
            {/* Mode badge + day */}
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
                {MODE_LABELS[state.mode]} &middot; Día {DAY_NUMBER}
              </span>
            </div>

            {/* Attempt dots */}
            <div
              className="flex flex-col gap-2 p-4 rounded-xl"
              style={{ background: '#0D1B2A', border: '1px solid rgba(27,58,75,0.8)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">
                  Intento {state.attemptsUsed} / {state.maxAttempts}
                </span>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {attemptsLeft} restantes
                </span>
              </div>
              <div className="flex gap-2 mt-1" role="list" aria-label="Intentos usados">
                {Array.from({ length: state.maxAttempts }).map((_, i) => {
                  const used = i < state.attemptsUsed
                  const current = i === state.attemptsUsed && isPlaying
                  return (
                    <div
                      key={i}
                      role="listitem"
                      aria-label={used ? 'Intento usado' : current ? 'Intento actual' : 'Intento disponible'}
                      className="flex-1 h-1.5 rounded-full"
                      style={{
                        background: used ? '#00D4FF' : 'rgba(27,58,75,0.8)',
                        border: current ? '1px solid #00D4FF' : 'none',
                        animation: current ? 'pulse-glow 1.5s ease-in-out infinite' : undefined,
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Search input */}
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
                  onChange={e => updateSearch(e.target.value)}
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

              {/* Autocomplete dropdown */}
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
                      key={c.name}
                      role="option"
                      aria-selected={i === state.selectedIndex}
                      onMouseDown={() => handleSubmit(c.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        background: i === state.selectedIndex ? 'rgba(0,212,255,0.15)' : 'transparent',
                        borderBottom: i < state.searchResults.length - 1 ? '1px solid rgba(27,58,75,0.4)' : 'none',
                      }}
                    >
                      <span className="text-xl leading-none" aria-hidden="true">{c.flag}</span>
                      <span className="font-semibold text-sm text-foreground flex-1">{c.name}</span>
                      <span className="text-xs text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {c.continent}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guess history */}
            <div className="flex flex-col gap-2 flex-1" role="list" aria-label="Historial de intentos">
              {state.guesses.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 py-10 text-center gap-2">
                  <p className="text-foreground/60 text-sm">Empieza escribiendo un país arriba</p>
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Te daremos pistas de distancia y dirección
                  </p>
                </div>
              )}
              {state.guesses.map((g, i) => (
                <GuessCard
                  key={g.country.name}
                  result={g}
                  isNew={i === newGuessIndex}
                />
              ))}
            </div>

            {/* Status message when game ends */}
            {state.gameStatus !== 'playing' && (
              <div
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-center"
                style={{
                  background: state.gameStatus === 'won' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                  border: `1px solid ${state.gameStatus === 'won' ? '#4CAF5040' : '#F4433640'}`,
                }}
              >
                <p className="font-bold text-foreground">
                  {state.gameStatus === 'won'
                    ? `Correcto en ${state.attemptsUsed} intento${state.attemptsUsed !== 1 ? 's' : ''}!`
                    : `El país era ${state.targetCountry.flag} ${state.targetCountry.name}`}
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  Siguiente reto en 24 horas
                </p>
              </div>
            )}

            {/* Give up button */}
            {isPlaying && (
              <div className="flex justify-center pt-1">
                {!showConfirmGiveUp ? (
                  <button
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
                      onClick={() => { giveUp(); setShowConfirmGiveUp(false) }}
                      className="text-xs font-bold transition-colors"
                      style={{ color: '#F44336', fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      Sí, rendirse
                    </button>
                    <button
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
          </div>
        </div>

        {/* ── RIGHT PANEL — Globe ──────────────────────────────────── */}
        <div
          className="relative flex-1 min-h-0"
          style={{
            minHeight: 280,
            borderTop: '1px solid rgba(27,58,75,0.6)',
          }}
        >
          <div className="lg:hidden" style={{ height: 280 }}>
            <GlobeDynamic guesses={state.guesses} />
          </div>
          <div className="hidden lg:block" style={{ height: 'calc(100dvh - 56px)', borderLeft: '1px solid rgba(27,58,75,0.6)', borderTop: 'none' }}>
            <GlobeDynamic guesses={state.guesses} />
          </div>
        </div>
      </div>
    </div>
  )
}
