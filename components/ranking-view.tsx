'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import type { GameMode, RankingEntry } from '@/lib/types'
import { useAuthUser } from '@/hooks/use-auth-user'
import { Skeleton } from '@/components/ui/skeleton'

const MONO = 'JetBrains Mono, monospace'
const HEADING = 'Space Grotesk, Inter, sans-serif'

const MODES: { id: GameMode; label: string; color: string }[] = [
  { id: 'daily', label: 'Diario', color: '#00D4FF' },
  { id: 'infinite', label: 'Infinito', color: '#A855F7' },
  { id: 'region', label: 'Región', color: '#22C55E' },
  { id: 'timed', label: 'Contrarreloj', color: '#F59E0B' },
  { id: 'hard', label: 'Difícil', color: '#EF4444' },
]

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
const PODIUM_COLORS: Record<number, { border: string; glow: string; bg: string }> = {
  1: { border: '#FFD700', glow: 'rgba(255,215,0,0.2)', bg: 'rgba(255,215,0,0.06)' },
  2: { border: '#C0C0C0', glow: 'rgba(192,192,192,0.1)', bg: 'rgba(192,192,192,0.04)' },
  3: { border: '#CD7F32', glow: 'rgba(205,127,50,0.1)', bg: 'rgba(205,127,50,0.04)' },
}

function Initials({ name, size = 40, color }: { name: string; size?: number; color: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(13,27,42,0.8)',
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: size * 0.35,
        fontWeight: 700,
        color,
        fontFamily: HEADING,
      }}
    >
      {initials}
    </div>
  )
}

export interface RankingViewProps {
  globalRankings: RankingEntry[]
  rankingsByMode: Partial<Record<GameMode, RankingEntry[]>>
  isLoggedIn: boolean
  currentProfileId: string | null
}

export default function RankingView({
  globalRankings,
  rankingsByMode,
  isLoggedIn,
  currentProfileId,
}: RankingViewProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'modo'>('global')
  const [activeMode, setActiveMode] = useState<GameMode>('daily')
  const { user, loading: authLoading } = useAuthUser()

  const tableData: RankingEntry[] =
    activeTab === 'global' ? globalRankings : rankingsByMode[activeMode] ?? []

  const isEmpty = tableData.length === 0

  const top3 = tableData.slice(0, 3)
  let podiumOrder: RankingEntry[] = []
  if (top3.length >= 3) podiumOrder = [top3[1], top3[0], top3[2]]
  else if (top3.length === 2) podiumOrder = [top3[1], top3[0]]
  else podiumOrder = [...top3]

  const showBlurOverlay = !isLoggedIn

  return (
    <div style={{ minHeight: '100dvh', background: '#0A0E1A' }}>
      <header
        style={{
          height: 56,
          borderBottom: '1px solid rgba(27,58,75,0.7)',
          background: 'rgba(13,27,42,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E8F4F8', textDecoration: 'none' }}>
          <Globe size={22} color="#00D4FF" />
          <span style={{ fontWeight: 700, fontSize: 15 }}>GeoBlind</span>
        </Link>
        <nav style={{ display: 'flex', gap: 6 }} aria-label="Modos de juego">
          {MODES.map(m => (
            <Link
              key={m.id}
              href={m.id === 'region' ? '/game?mode=region' : `/game?mode=${m.id}`}
              style={{
                padding: '5px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: '#8BA4B0',
                textDecoration: 'none',
                border: '1px solid transparent',
                transition: 'color 150ms',
              }}
            >
              {m.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 80, justifyContent: 'flex-end' }}>
          {authLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0,212,255,0.15)',
                border: '1px solid rgba(0,212,255,0.4)',
                color: '#00D4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
              title={user.email ?? ''}
            >
              {(user.email?.charAt(0) ?? '?').toUpperCase()}
            </span>
          ) : (
            <Link href="/login" style={{ color: '#8BA4B0', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Entrar
            </Link>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: HEADING,
              fontSize: 40,
              fontWeight: 700,
              color: '#E8F4F8',
              margin: '0 0 6px',
              lineHeight: 1.15,
            }}
          >
            Ranking Global
          </h1>
          <p style={{ color: '#8BA4B0', fontSize: 16, margin: 0 }}>Los mejores jugadores de GeoBlind</p>

          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(27,58,75,0.6)', marginTop: 28 }}>
            {(['global', 'modo'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab ? '#00D4FF' : 'transparent'}`,
                  color: activeTab === tab ? '#E8F4F8' : '#8BA4B0',
                  fontFamily: HEADING,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: -1,
                  transition: 'color 200ms, border-color 200ms',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'global' ? 'Global' : 'Por modo'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'modo' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {MODES.map(m => {
              const active = activeMode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMode(m.id)}
                  style={{
                    padding: '6px 18px',
                    borderRadius: 999,
                    border: `1px solid ${m.color}`,
                    background: active ? m.color : 'transparent',
                    color: active ? '#0A0E1A' : m.color,
                    fontFamily: HEADING,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        )}

        {isEmpty ? (
          <p
            style={{
              textAlign: 'center',
              color: '#8BA4B0',
              fontSize: 16,
              fontFamily: HEADING,
              margin: '48px 0',
            }}
          >
            Aún no hay jugadores en el ranking. ¡Sé el primero!
          </p>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 40,
              }}
            >
              {podiumOrder.map((player, idx) => {
                const pos = player.rank
                const isFirst = pos === 1
                const pc = PODIUM_COLORS[pos] ?? PODIUM_COLORS[2]
                return (
                  <div
                    key={`${player.profileId}-${pos}`}
                    style={{
                      flex: isFirst ? '0 0 220px' : '0 0 180px',
                      background: pc.bg,
                      border: `1px solid ${pc.border}40`,
                      borderRadius: 16,
                      padding: isFirst ? '28px 20px' : '20px 16px',
                      textAlign: 'center',
                      boxShadow: isFirst ? `0 0 40px ${pc.glow}` : `0 0 20px ${pc.glow}`,
                      position: 'relative',
                      marginBottom: idx === 0 ? 24 : idx === 2 ? 40 : 0,
                    }}
                  >
                    <div style={{ fontSize: isFirst ? 28 : 22, marginBottom: 12 }} aria-hidden="true">
                      {MEDALS[pos] ?? pos}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                      <Initials name={player.username} size={isFirst ? 56 : 44} color={pc.border} />
                    </div>
                    <p
                      style={{
                        fontFamily: HEADING,
                        fontWeight: 700,
                        fontSize: isFirst ? 16 : 14,
                        color: '#E8F4F8',
                        margin: '0 0 4px',
                      }}
                    >
                      {player.username}
                    </p>
                    <p
                      style={{
                        fontFamily: MONO,
                        fontSize: isFirst ? 20 : 16,
                        fontWeight: 700,
                        color: pc.border,
                        margin: '0 0 4px',
                      }}
                    >
                      {player.totalScore.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 12, color: '#8BA4B0', margin: 0 }}>{player.winRate}% victorias</p>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                background: '#0D1B2A',
                border: '1px solid rgba(27,58,75,0.8)',
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr 120px 80px 100px 110px 110px',
                  padding: '12px 20px',
                  background: 'rgba(27,58,75,0.4)',
                  borderBottom: '1px solid rgba(27,58,75,0.8)',
                }}
              >
                {['Pos.', 'Jugador', 'Puntuación', 'Partidas', '% Victoria', 'Racha actual', 'Mejor racha'].map(col => (
                  <span
                    key={col}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#8BA4B0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {tableData.map((player, i) => {
                const blurred = showBlurOverlay && i >= 3
                const isCurrentUser = currentProfileId != null && player.profileId === currentProfileId
                const pos = player.rank
                return (
                  <div
                    key={player.profileId}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '52px 1fr 120px 80px 100px 110px 110px',
                      padding: '0 20px',
                      height: 56,
                      alignItems: 'center',
                      background: isCurrentUser
                        ? 'rgba(0,212,255,0.08)'
                        : i % 2 === 0
                          ? 'transparent'
                          : 'rgba(255,255,255,0.02)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      borderLeft: isCurrentUser ? '3px solid #00D4FF' : '3px solid transparent',
                      filter: blurred ? 'blur(4px)' : 'none',
                      userSelect: blurred ? 'none' : 'auto',
                      transition: 'background 150ms',
                    }}
                    className={blurred ? '' : 'ranking-row'}
                  >
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 15,
                        color: pos <= 3 ? '#8BA4B0' : '#8BA4B0',
                      }}
                    >
                      {pos <= 3 ? MEDALS[pos] ?? pos : pos}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Initials
                        name={player.username}
                        size={32}
                        color={
                          pos === 1 ? '#FFD700' : pos === 2 ? '#C0C0C0' : pos === 3 ? '#CD7F32' : '#1B3A4B'
                        }
                      />
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#E8F4F8' }}>{player.username}</span>
                      {isCurrentUser && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(0,212,255,0.15)',
                            border: '1px solid rgba(0,212,255,0.4)',
                            color: '#00D4FF',
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          Tú
                        </span>
                      )}
                    </div>

                    <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#00D4FF' }}>
                      {player.totalScore.toLocaleString()}
                    </span>

                    <span style={{ fontFamily: MONO, fontSize: 13, color: '#8BA4B0' }}>{player.gamesPlayed}</span>

                    <span style={{ fontFamily: MONO, fontSize: 13, color: '#8BA4B0' }}>{player.winRate}%</span>

                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 13,
                        color: player.currentStreak > 0 ? '#E8F4F8' : '#8BA4B0',
                      }}
                    >
                      {player.currentStreak > 0 ? `${player.currentStreak} 🔥` : '—'}
                    </span>

                    <span style={{ fontFamily: MONO, fontSize: 13, color: '#8BA4B0' }}>{player.bestStreak}</span>
                  </div>
                )
              })}

              {showBlurOverlay && !isEmpty && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(13,27,42,0.92) 35%, rgba(13,27,42,0.98) 100%)',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '28px 32px',
                      background: '#0D1B2A',
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: 16,
                      maxWidth: 360,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: HEADING,
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#E8F4F8',
                        margin: '0 0 16px',
                      }}
                    >
                      Regístrate para ver tu posición en el ranking
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <Link
                        href="/login"
                        style={{
                          padding: '10px 22px',
                          borderRadius: 10,
                          border: 'none',
                          background: '#00D4FF',
                          color: '#0A0E1A',
                          fontFamily: HEADING,
                          fontSize: 14,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Crear cuenta
                      </Link>
                      <Link
                        href="/login"
                        style={{
                          padding: '10px 22px',
                          borderRadius: 10,
                          border: '1px solid rgba(0,212,255,0.5)',
                          background: 'transparent',
                          color: '#00D4FF',
                          fontFamily: HEADING,
                          fontSize: 14,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Iniciar sesión
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            type="button"
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              border: '1px solid rgba(27,58,75,0.8)',
              background: 'transparent',
              color: '#8BA4B0',
              fontFamily: HEADING,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 150ms, border-color 150ms',
            }}
            className="hover:text-foreground hover:border-border"
          >
            Cargar más
          </button>
        </div>
      </main>

      <style>{`
        .ranking-row:hover {
          background: rgba(0, 212, 255, 0.05) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  )
}
