'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe2, Trophy, X } from 'lucide-react'
import type { GameStatus } from '@/hooks/use-game-state'
import type { CountryData, GuessResult } from '@/lib/game-logic'
import { useLanguage } from '@/hooks/use-language'

const MONO = 'JetBrains Mono, monospace'
const HEADING = 'Space Grotesk, Inter, sans-serif'

function circleColor(pct: number): string {
  if (pct >= 100) return '#4CAF50'
  if (pct >= 81) return '#FF6B35'
  if (pct >= 51) return '#C9A84C'
  if (pct >= 21) return '#2D6A4F'
  return '#1B3A4B'
}

function useCountdown(): string {
  const [label, setLabel] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setLabel(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return label
}

interface Props {
  status: GameStatus
  target: CountryData
  guesses: GuessResult[]
  attemptsUsed: number
  finalScore?: number
  timeElapsedSec?: number
  maxAttemptsDisplay?: number
  dailyDayNumber?: number
  onClose: () => void
}

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function GameResultModal({
  status,
  target,
  guesses,
  attemptsUsed,
  finalScore = 0,
  timeElapsedSec = 0,
  maxAttemptsDisplay = 6,
  dailyDayNumber = 47,
  onClose,
}: Props) {
  const router = useRouter()
  const { language } = useLanguage()
  const countdown = useCountdown()
  const [copied, setCopied] = useState(false)
  const [countryFact, setCountryFact] = useState('')
  const [countryFactLoading, setCountryFactLoading] = useState(false)

  const won = status === 'won'
  const attemptsLabel =
    Number.isFinite(maxAttemptsDisplay) && maxAttemptsDisplay > 0 && maxAttemptsDisplay !== Number.POSITIVE_INFINITY
      ? `${attemptsUsed}/${maxAttemptsDisplay}`
      : `${attemptsUsed} ${language === 'es' ? 'intentos' : 'attempts'}`

  const shareText = [
    `GeoBlind #${dailyDayNumber} 🌍`,
    guesses
      .map(g => {
        const color = circleColor(g.proximityPct)
        if (color === '#4CAF50') return '🟢'
        if (color === '#FF6B35') return '🟠'
        if (color === '#C9A84C') return '🟡'
        if (color === '#2D6A4F') return '🟤'
        return '🔵'
      })
      .join(''),
    won
      ? language === 'es'
        ? `Lo consegui en ${attemptsLabel}`
        : `Got it in ${attemptsLabel}`
      : language === 'es'
        ? 'No lo consegui hoy'
        : "Didn't get it today",
    language === 'es' ? 'Juega en geoblind.vercel.app' : 'Play at geoblind.vercel.app',
  ].join('\n')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // no-op
    }
  }, [shareText])

  useEffect(() => {
    const fallbackFact =
      language === 'es'
        ? `${target.name} destaca por su diversidad geografica y su influencia regional.`
        : `${target.name} stands out for its geographic diversity and regional influence.`

    const ac = new AbortController()

    async function loadCountryFact(): Promise<void> {
      setCountryFactLoading(true)
      try {
        const response = await fetch('/api/groq/country-fact', {
          method: 'POST',
          signal: ac.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            countryName: target.name,
            continent: target.continent,
            language,
            nonce: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          }),
        })

        const data = (await response.json()) as { fact?: string }
        if (!response.ok || !data.fact) {
          throw new Error('country-fact-error')
        }

        setCountryFact(data.fact)
      } catch {
        setCountryFact(fallbackFact)
      } finally {
        setCountryFactLoading(false)
      }
    }

    void loadCountryFact()
    return () => ac.abort()
  }, [target.name, target.continent, language, status])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={won ? (language === 'es' ? 'Resultado: ganaste' : 'Result: you won') : (language === 'es' ? 'Resultado: perdiste' : 'Result: you lost')}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#0D1B2A',
          borderRadius: 20,
          border: '1px solid rgba(0, 212, 255, 0.2)',
          boxShadow: won ? '0 0 60px rgba(76, 175, 80, 0.15)' : '0 0 60px rgba(244, 67, 54, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onClose}
          aria-label={language === 'es' ? 'Cerrar' : 'Close'}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: '#8BA4B0',
          }}
          className="hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>

        <div style={{ padding: '32px 32px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: won ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
                border: `2px solid ${won ? 'rgba(76,175,80,0.4)' : 'rgba(244,67,54,0.4)'}`,
              }}
            >
              {won ? <Globe2 size={36} color="#4CAF50" /> : <Trophy size={36} color="#F44336" />}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: HEADING, fontSize: 32, fontWeight: 700, color: '#E8F4F8', margin: 0, lineHeight: 1.2 }}>
              {won ? (language === 'es' ? 'Lo conseguiste!' : 'You got it!') : (language === 'es' ? 'Casi lo tienes!' : 'So close!')}
            </h2>
            <p style={{ color: '#8BA4B0', fontSize: 15, marginTop: 6 }}>
              {won
                ? language === 'es'
                  ? 'Encontraste el pais misterioso'
                  : 'You found the mystery country'
                : language === 'es'
                  ? 'El pais misterioso era...'
                  : 'The mystery country was...'}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '16px 20px',
              background: 'rgba(0, 212, 255, 0.06)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: 14,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">
              {target.flag_emoji}
            </span>
            <span style={{ fontFamily: HEADING, fontSize: 26, fontWeight: 700, color: '#00D4FF' }}>{target.name}</span>
          </div>

          <div
            style={{
              padding: '14px 16px',
              background: won ? 'rgba(76, 175, 80, 0.08)' : 'rgba(201, 168, 76, 0.08)',
              border: won ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: 12,
              marginBottom: 20,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true">
              💡
            </span>
            <div style={{ margin: 0 }}>
              <p
                style={{
                  fontSize: 11,
                  margin: '0 0 4px 0',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: won ? '#7EDC9D' : '#D3B66A',
                  fontFamily: MONO,
                }}
              >
                {language === 'es' ? 'Dato IA del pais' : 'AI country fact'}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: won ? '#BFEFD1' : '#C9A84C',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {countryFactLoading
                  ? language === 'es'
                    ? 'Generando dato interesante...'
                    : 'Generating interesting fact...'
                  : countryFact}
              </p>
            </div>
          </div>

          {won && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: language === 'es' ? 'Intentos' : 'Attempts', value: attemptsLabel },
                { label: language === 'es' ? 'Tiempo' : 'Time', value: formatTime(timeElapsedSec) },
                { label: language === 'es' ? 'Puntuacion' : 'Score', value: finalScore.toLocaleString() },
                { label: language === 'es' ? 'Racha' : 'Streak', value: '—' },
              ].map(stat => (
                <div
                  key={stat.label}
                  style={{
                    background: 'rgba(27, 58, 75, 0.5)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: '#8BA4B0', fontSize: 12, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: '#00D4FF', margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              background: 'rgba(27, 58, 75, 0.4)',
              border: '1px solid rgba(27, 58, 75, 0.8)',
              borderRadius: 12,
              padding: '16px',
              marginBottom: 20,
            }}
          >
            <p style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#E8F4F8', margin: '0 0 8px' }}>GeoBlind #{dailyDayNumber} 🌍</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }} aria-label="Resultados de intentos">
              {guesses.map((g, i) => (
                <div
                  key={i}
                  title={`Intento ${i + 1}: ${g.proximityPct}% de proximidad`}
                  style={{ width: 20, height: 20, borderRadius: '50%', background: circleColor(g.proximityPct), flexShrink: 0 }}
                />
              ))}
            </div>
            <button
              onClick={handleCopy}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 8,
                border: `1px solid ${copied ? '#4CAF50' : 'rgba(0,212,255,0.5)'}`,
                background: copied ? 'rgba(76,175,80,0.12)' : 'transparent',
                color: copied ? '#4CAF50' : '#00D4FF',
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
            >
              {copied ? 'Copiado!' : 'Copiar resultado'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => router.push('/game?mode=infinite')}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                background: '#00D4FF',
                color: '#0A0E1A',
                fontFamily: HEADING,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="hover:opacity-90"
            >
              {won ? 'Jugar modo infinito →' : 'Intentar de nuevo'}
            </button>
            <button
              onClick={() => router.push('/ranking')}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid rgba(0,212,255,0.5)',
                background: 'transparent',
                color: '#00D4FF',
                fontFamily: HEADING,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="hover:bg-primary/10"
            >
              Ver ranking
            </button>
          </div>

          <p style={{ textAlign: 'center', color: '#8BA4B0', fontSize: 13, margin: 0 }}>
            Proximo reto en: <span style={{ fontFamily: MONO, color: '#E8F4F8' }}>{countdown}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
