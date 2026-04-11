'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe } from 'lucide-react'

const MONO = 'JetBrains Mono, monospace'
const HEADING = 'Space Grotesk, Inter, sans-serif'

const MODES = [
  { id: 'diario',       label: 'Diario',       color: '#00D4FF' },
  { id: 'infinito',     label: 'Infinito',     color: '#A855F7' },
  { id: 'region',       label: 'Región',       color: '#22C55E' },
  { id: 'contrarreloj', label: 'Contrarreloj', color: '#F59E0B' },
  { id: 'dificil',      label: 'Difícil',      color: '#EF4444' },
]

const mockRanking = [
  { pos: 1, username: 'GeoMaster',     score: 15420, games: 89,  winRate: 94, currentStreak: 23, bestStreak: 31 },
  { pos: 2, username: 'Cartógrafo',    score: 14850, games: 102, winRate: 88, currentStreak: 7,  bestStreak: 28 },
  { pos: 3, username: 'Explorador',    score: 13200, games: 76,  winRate: 91, currentStreak: 15, bestStreak: 22 },
  { pos: 4, username: 'MapaViva',      score: 11750, games: 134, winRate: 79, currentStreak: 4,  bestStreak: 19 },
  { pos: 5, username: 'TerraIncognita', score: 10300, games: 58, winRate: 86, currentStreak: 11, bestStreak: 15 },
  { pos: 6, username: 'Meridiano',     score: 9870,  games: 91,  winRate: 82, currentStreak: 0,  bestStreak: 17 },
  { pos: 7, username: 'Latitud0',      score: 8540,  games: 67,  winRate: 75, currentStreak: 3,  bestStreak: 12 },
  { pos: 8, username: 'BrújolaRota',   score: 7920,  games: 145, winRate: 71, currentStreak: 1,  bestStreak: 9  },
]

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
const PODIUM_COLORS: Record<number, { border: string; glow: string; bg: string }> = {
  1: { border: '#FFD700', glow: 'rgba(255,215,0,0.2)',  bg: 'rgba(255,215,0,0.06)'  },
  2: { border: '#C0C0C0', glow: 'rgba(192,192,192,0.1)', bg: 'rgba(192,192,192,0.04)' },
  3: { border: '#CD7F32', glow: 'rgba(205,127,50,0.1)',  bg: 'rgba(205,127,50,0.04)' },
}

function Initials({ name, size = 40, color }: { name: string; size?: number; color: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div style={{
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
    }}>
      {initials}
    </div>
  )
}

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'modo'>('global')
  const [activeMode, setActiveMode] = useState('diario')

  // Mock: current user is not logged in
  const isLoggedIn = false

  const top3 = mockRanking.slice(0, 3)
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]]

  return (
    <div style={{ minHeight: '100dvh', background: '#0A0E1A' }}>
      {/* Navbar */}
      <header style={{
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
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E8F4F8', textDecoration: 'none' }}>
          <Globe size={22} color="#00D4FF" />
          <span style={{ fontWeight: 700, fontSize: 15 }}>GeoBlind</span>
        </Link>
        <nav style={{ display: 'flex', gap: 6 }} aria-label="Modos de juego">
          {MODES.map(m => (
            <Link
              key={m.id}
              href={`/game?mode=${m.id}`}
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
        <div style={{ width: 80 }} />
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 80px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: HEADING,
            fontSize: 40,
            fontWeight: 700,
            color: '#E8F4F8',
            margin: '0 0 6px',
            lineHeight: 1.15,
          }}>
            Ranking Global
          </h1>
          <p style={{ color: '#8BA4B0', fontSize: 16, margin: 0 }}>
            Los mejores jugadores de GeoBlind
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(27,58,75,0.6)', marginTop: 28 }}>
            {(['global', 'modo'] as const).map(tab => (
              <button
                key={tab}
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

        {/* Mode filter (Por modo tab) */}
        {activeTab === 'modo' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {MODES.map(m => {
              const active = activeMode === m.id
              return (
                <button
                  key={m.id}
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

        {/* Podium */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 40,
        }}>
          {podiumOrder.map((player, idx) => {
            const isFirst = player.pos === 1
            const pc = PODIUM_COLORS[player.pos]
            return (
              <div
                key={player.username}
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
                  {MEDALS[player.pos]}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <Initials name={player.username} size={isFirst ? 56 : 44} color={pc.border} />
                </div>
                <p style={{
                  fontFamily: HEADING,
                  fontWeight: 700,
                  fontSize: isFirst ? 16 : 14,
                  color: '#E8F4F8',
                  margin: '0 0 4px',
                }}>
                  {player.username}
                </p>
                <p style={{
                  fontFamily: MONO,
                  fontSize: isFirst ? 20 : 16,
                  fontWeight: 700,
                  color: pc.border,
                  margin: '0 0 4px',
                }}>
                  {player.score.toLocaleString()}
                </p>
                <p style={{ fontSize: 12, color: '#8BA4B0', margin: 0 }}>
                  {player.winRate}% victorias
                </p>
              </div>
            )
          })}
        </div>

        {/* Leaderboard table */}
        <div style={{
          background: '#0D1B2A',
          border: '1px solid rgba(27,58,75,0.8)',
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '52px 1fr 120px 80px 100px 110px 110px',
            padding: '12px 20px',
            background: 'rgba(27,58,75,0.4)',
            borderBottom: '1px solid rgba(27,58,75,0.8)',
          }}>
            {['Pos.', 'Jugador', 'Puntuación', 'Partidas', '% Victoria', 'Racha actual', 'Mejor racha'].map(col => (
              <span key={col} style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#8BA4B0',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {mockRanking.map((player, i) => {
            const blurred = !isLoggedIn && i >= 3
            const isCurrentUser = false // no logged in user
            return (
              <div
                key={player.username}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr 120px 80px 100px 110px 110px',
                  padding: '0 20px',
                  height: 56,
                  alignItems: 'center',
                  background: isCurrentUser
                    ? 'rgba(0,212,255,0.08)'
                    : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: isCurrentUser ? '3px solid #00D4FF' : '3px solid transparent',
                  filter: blurred ? 'blur(4px)' : 'none',
                  userSelect: blurred ? 'none' : 'auto',
                  transition: 'background 150ms',
                }}
                className={blurred ? '' : 'ranking-row'}
              >
                {/* Position */}
                <span style={{
                  fontFamily: MONO,
                  fontSize: 15,
                  color: player.pos <= 3 ? 'transparent' : '#8BA4B0',
                  textShadow: player.pos <= 3 ? 'none' : undefined,
                }}>
                  {player.pos <= 3 ? MEDALS[player.pos] : player.pos}
                </span>

                {/* Player */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Initials name={player.username} size={32} color={
                    player.pos === 1 ? '#FFD700' : player.pos === 2 ? '#C0C0C0' : player.pos === 3 ? '#CD7F32' : '#1B3A4B'
                  } />
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#E8F4F8' }}>
                    {player.username}
                  </span>
                  {isCurrentUser && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'rgba(0,212,255,0.15)',
                      border: '1px solid rgba(0,212,255,0.4)',
                      color: '#00D4FF',
                      fontSize: 10,
                      fontWeight: 700,
                    }}>
                      Tú
                    </span>
                  )}
                </div>

                {/* Score */}
                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#00D4FF' }}>
                  {player.score.toLocaleString()}
                </span>

                {/* Games */}
                <span style={{ fontFamily: MONO, fontSize: 13, color: '#8BA4B0' }}>
                  {player.games}
                </span>

                {/* Win rate */}
                <span style={{ fontFamily: MONO, fontSize: 13, color: '#8BA4B0' }}>
                  {player.winRate}%
                </span>

                {/* Current streak */}
                <span style={{ fontFamily: MONO, fontSize: 13, color: player.currentStreak > 0 ? '#E8F4F8' : '#8BA4B0' }}>
                  {player.currentStreak > 0 ? `${player.currentStreak} 🔥` : '—'}
                </span>

                {/* Best streak */}
                <span style={{ fontFamily: MONO, fontSize: 13, color: '#8BA4B0' }}>
                  {player.bestStreak}
                </span>
              </div>
            )
          })}

          {/* Not logged in overlay */}
          {!isLoggedIn && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(13,27,42,0.92) 35%, rgba(13,27,42,0.98) 100%)',
            }}>
              <div style={{
                textAlign: 'center',
                padding: '28px 32px',
                background: '#0D1B2A',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 16,
                maxWidth: 360,
              }}>
                <p style={{
                  fontFamily: HEADING,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#E8F4F8',
                  margin: '0 0 16px',
                }}>
                  Regístrate para ver tu posición en el ranking
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button style={{
                    padding: '10px 22px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#00D4FF',
                    color: '#0A0E1A',
                    fontFamily: HEADING,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}>
                    Crear cuenta
                  </button>
                  <button style={{
                    padding: '10px 22px',
                    borderRadius: 10,
                    border: '1px solid rgba(0,212,255,0.5)',
                    background: 'transparent',
                    color: '#00D4FF',
                    fontFamily: HEADING,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}>
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Load more */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button style={{
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
