'use client'

import { useEffect, useRef } from 'react'
import type { GuessResult } from '@/lib/game-logic'

function proximityBg(pct: number): string {
  if (pct >= 100) return 'rgba(76, 175, 80, 0.5)'
  if (pct >= 81) return 'rgba(255, 107, 53, 0.4)'
  if (pct >= 51) return 'rgba(201, 168, 76, 0.3)'
  if (pct >= 21) return 'rgba(45, 106, 79, 0.5)'
  return 'rgba(27, 58, 75, 0.8)'
}

function proximityBorder(pct: number): string {
  if (pct >= 100) return '#4CAF50'
  if (pct >= 81) return '#FF6B35'
  if (pct >= 51) return '#C9A84C'
  if (pct >= 21) return '#2D6A4F'
  return '#1B3A4B'
}

interface GuessCardProps {
  result: GuessResult
  isNew?: boolean
  showDirection?: boolean
  showColorHints?: boolean
}

export default function GuessCard({
  result,
  isNew = false,
  showDirection = true,
  showColorHints = true,
}: GuessCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { country, distance, direction, proximityPct, isCorrect } = result

  const bgColor = showColorHints ? proximityBg(proximityPct) : 'rgba(27, 58, 75, 0.8)'
  const borderColor = showColorHints ? proximityBorder(proximityPct) : 'rgba(0, 212, 255, 0.25)'
  const isFar = proximityPct < 20 && !isCorrect

  useEffect(() => {
    if (!isNew || !cardRef.current) return
    const el = cardRef.current
    el.style.opacity = '0'
    el.style.transform = 'translateY(12px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    if (isFar) {
      setTimeout(() => {
        el.style.transition = 'transform 50ms ease-in-out'
        const shake = ['-4px', '4px', '-3px', '3px', '-1px', '0']
        shake.forEach((val, i) => {
          setTimeout(() => {
            if (el) el.style.transform = `translateX(${val})`
          }, i * 50)
        })
      }, 320)
    }
  }, [isNew, isFar])

  return (
    <div
      ref={cardRef}
      role="listitem"
      className="relative overflow-hidden"
      style={{
        height: 68,
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        background: bgColor,
        padding: '10px 14px',
        boxShadow: isCorrect ? `0 0 16px ${borderColor}60` : undefined,
      }}
    >
      {isCorrect && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px #4CAF5080`,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
      )}

      <div className="flex items-center gap-3 h-full">
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none" aria-hidden="true">
              {country.flag_emoji}
            </span>
            <span className="font-bold text-sm text-foreground truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {country.name}
            </span>
          </div>
          <span className="text-xs text-muted-foreground truncate mt-0.5">{country.continent}</span>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[90px]">
          <span
            className="text-sm font-bold text-foreground tabular-nums"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {distance.toLocaleString('es-ES')} km
          </span>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${showColorHints ? proximityPct : 100}%`,
                background: showColorHints
                  ? 'linear-gradient(to right, #1E6091, #C9A84C, #FF6B35, #4CAF50)'
                  : 'rgba(255,255,255,0.18)',
                backgroundSize: showColorHints ? '400%' : undefined,
                backgroundPosition: showColorHints ? `${100 - proximityPct}% center` : undefined,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[40px]">
          {isCorrect ? (
            <>
              <span className="text-2xl leading-none" aria-label="Correcto">
                OK
              </span>
              <span
                className="text-xs font-bold mt-0.5"
                style={{ color: '#4CAF50', fontFamily: 'JetBrains Mono, monospace' }}
              >
                Correcto!
              </span>
            </>
          ) : (
            <>
              <span
                className="text-xl leading-none font-bold"
                style={{ color: '#00D4FF' }}
                aria-label={showDirection ? `Direccion: ${direction.label}` : 'Direccion oculta'}
              >
                {showDirection ? direction.arrow : '--'}
              </span>
              <span
                className="text-xs text-muted-foreground mt-0.5"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {showDirection ? direction.label : 'Oculta'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
