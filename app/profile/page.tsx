'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Clock,
  LogOut,
  Mail,
  Settings,
  Target,
  Trophy,
  User,
  XCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import BrandLogo from '@/components/brand-logo'

interface UserProfile {
  id: string
  username: string
  email: string
  created_at: string
  total_games: number
  total_wins: number
  current_streak: number
  best_streak: number
  average_attempts: number
  favorite_mode: string
  total_score: number
}

interface GameStats {
  mode: string
  games: number
  wins: number
  win_rate: number
  avg_attempts: number
  best_score: number
}

interface GameActivity {
  id: string
  mode: string
  won: boolean
  attempts: number
  score: number
  played_at: string
}

interface SessionRow {
  id: string
  won: boolean
  attempts_used: number
  score: number | null
  played_at: string
  game_modes:
    | { slug?: string | null; label?: string | null }
    | { slug?: string | null; label?: string | null }[]
    | null
}

interface Achievement {
  name: string
  icon: string
  color: string
  unlocked: boolean
}

const MODE_LABELS: Record<string, string> = {
  daily: 'Diario',
  infinite: 'Infinito',
  region: 'Region',
  timed: 'Contrarreloj',
  hard: 'Dificil',
}

function modeLabelFromSession(modeData: SessionRow['game_modes']): string {
  const mode = Array.isArray(modeData) ? modeData[0] : modeData
  const slug = String(mode?.slug ?? '')
  const modeName = String(mode?.label ?? slug)
  return MODE_LABELS[slug] ?? (modeName || 'Desconocido')
}

function relativeTimeFromNow(dateIso: string): string {
  const diffMs = new Date(dateIso).getTime() - Date.now()
  const absSeconds = Math.abs(Math.round(diffMs / 1000))
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

  if (absSeconds < 60) return rtf.format(Math.round(diffMs / 1000), 'second')
  if (absSeconds < 3600) return rtf.format(Math.round(diffMs / (60 * 1000)), 'minute')
  if (absSeconds < 86400) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), 'hour')
  return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), 'day')
}

function buildAchievements(profile: UserProfile): Achievement[] {
  return [
    { name: 'Primera Victoria', icon: '1', color: 'bg-green-500', unlocked: profile.total_wins >= 1 },
    { name: 'Racha de 7', icon: '7', color: 'bg-orange-500', unlocked: profile.best_streak >= 7 },
    { name: 'Precision 70%', icon: '70%', color: 'bg-purple-500', unlocked: profile.total_games > 0 && (profile.total_wins / profile.total_games) * 100 >= 70 },
    { name: 'Explorador', icon: '50', color: 'bg-blue-500', unlocked: profile.total_games >= 50 },
    { name: 'Maestro', icon: '100', color: 'bg-red-500', unlocked: profile.total_games >= 100 },
    { name: 'Legendario', icon: '200', color: 'bg-yellow-500', unlocked: profile.total_games >= 200 },
  ]
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<GameStats[]>([])
  const [recentActivity, setRecentActivity] = useState<GameActivity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    void fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/auth')
        return
      }

      setUser(authUser)

      const [profileRes, sessionsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, created_at')
          .eq('id', authUser.id)
          .maybeSingle(),
        supabase
          .from('game_sessions')
          .select(`
            id,
            won,
            attempts_used,
            score,
            played_at,
            game_modes ( slug, label )
          `)
          .eq('profile_id', authUser.id)
          .eq('completed', true)
          .order('played_at', { ascending: false }),
      ])

      if (profileRes.error) throw new Error(profileRes.error.message)
      if (sessionsRes.error) throw new Error(sessionsRes.error.message)

      const profileRow = profileRes.data
      const sessions = (sessionsRes.data ?? []) as SessionRow[]

      const totalGames = sessions.length
      const totalWins = sessions.filter(s => s.won).length
      const totalScore = sessions.reduce((sum, s) => sum + Number(s.score ?? 0), 0)
      const averageAttempts =
        totalGames > 0
          ? sessions.reduce((sum, s) => sum + Number(s.attempts_used ?? 0), 0) / totalGames
          : 0

      let currentStreak = 0
      for (const s of sessions) {
        if (!s.won) break
        currentStreak += 1
      }

      let bestStreak = 0
      let running = 0
      for (const s of [...sessions].reverse()) {
        if (s.won) {
          running += 1
          if (running > bestStreak) bestStreak = running
        } else {
          running = 0
        }
      }

      const modeMap = new Map<string, { games: number; wins: number; attempts: number; bestScore: number }>()
      for (const s of sessions) {
        const mode = modeLabelFromSession(s.game_modes)
        const current = modeMap.get(mode) ?? { games: 0, wins: 0, attempts: 0, bestScore: 0 }
        current.games += 1
        current.wins += s.won ? 1 : 0
        current.attempts += Number(s.attempts_used ?? 0)
        current.bestScore = Math.max(current.bestScore, Number(s.score ?? 0))
        modeMap.set(mode, current)
      }

      const modeStats: GameStats[] = [...modeMap.entries()]
        .map(([mode, data]) => ({
          mode,
          games: data.games,
          wins: data.wins,
          win_rate: data.games > 0 ? Number(((data.wins / data.games) * 100).toFixed(1)) : 0,
          avg_attempts: data.games > 0 ? Number((data.attempts / data.games).toFixed(1)) : 0,
          best_score: data.bestScore,
        }))
        .sort((a, b) => b.games - a.games)

      const computedProfile: UserProfile = {
        id: authUser.id,
        username:
          String(profileRow?.username ?? '').trim() ||
          String(authUser.user_metadata?.username ?? '').trim() ||
          String(authUser.email ?? '').split('@')[0] ||
          '(sin username)',
        email: authUser.email ?? '',
        created_at: String(profileRow?.created_at ?? authUser.created_at),
        total_games: totalGames,
        total_wins: totalWins,
        current_streak: currentStreak,
        best_streak: bestStreak,
        average_attempts: Number(averageAttempts.toFixed(1)),
        favorite_mode: modeStats[0]?.mode ?? 'Sin partidas',
        total_score: Math.round(totalScore),
      }

      const activity: GameActivity[] = sessions.slice(0, 5).map(s => ({
        id: s.id,
        mode: modeLabelFromSession(s.game_modes),
        won: s.won,
        attempts: Number(s.attempts_used ?? 0),
        score: Math.round(Number(s.score ?? 0)),
        played_at: s.played_at,
      }))

      setProfile(computedProfile)
      setStats(modeStats)
      setRecentActivity(activity)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No se encontro el perfil</h2>
          <Link href="/auth" className="text-primary hover:underline">
            Iniciar sesion
          </Link>
        </div>
      </div>
    )
  }

  const winRate = profile.total_games > 0 ? ((profile.total_wins / profile.total_games) * 100).toFixed(1) : '0'
  const achievements = buildAchievements(profile)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>

          <BrandLogo size={32} />

          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 p-8 rounded-2xl border border-border/40 bg-card/50">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-3xl font-bold text-primary-foreground">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">{profile.username}</h1>
              <div className="flex items-center gap-2 text-foreground/70 mb-4 justify-center md:justify-start">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60 justify-center md:justify-start">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Se unio el{' '}
                  {new Date(profile.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{profile.total_games}</div>
                <div className="text-xs text-foreground/70">Partidas</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{winRate}%</div>
                <div className="text-xs text-foreground/70">Acierto</div>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-400">{profile.current_streak}</div>
                <div className="text-xs text-foreground/70">Racha</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">{profile.total_score.toLocaleString()}</div>
                <div className="text-xs text-foreground/70">Puntos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Logros
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, i) => (
              <div
                key={`${achievement.name}-${i}`}
                className={`p-4 rounded-xl border text-center transition-all ${
                  achievement.unlocked
                    ? 'border-primary/40 bg-card/50 hover:border-primary/60'
                    : 'border-border/20 bg-card/20 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold ${
                    achievement.unlocked ? achievement.color : 'bg-gray-500'
                  }`}
                >
                  {achievement.icon}
                </div>
                <p className="text-xs text-foreground/70">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Estadisticas por Modo
          </h2>
          {stats.length === 0 ? (
            <div className="p-6 rounded-xl border border-border/40 bg-card/30 text-sm text-foreground/70">
              Todavia no hay partidas completadas para mostrar estadisticas.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map(stat => (
                <div key={stat.mode} className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{stat.mode}</h3>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        stat.win_rate >= 70
                          ? 'bg-green-500/20 text-green-400'
                          : stat.win_rate >= 50
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {stat.win_rate}%
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Partidas</span>
                      <span className="font-mono text-foreground">{stat.games}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Victorias</span>
                      <span className="font-mono text-green-400">{stat.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Intentos promedio</span>
                      <span className="font-mono text-foreground">{stat.avg_attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Mejor puntuacion</span>
                      <span className="font-mono text-primary">{stat.best_score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-500" />
            Actividad Reciente
          </h2>
          {recentActivity.length === 0 ? (
            <div className="p-6 rounded-xl border border-border/40 bg-card/30 text-sm text-foreground/70">
              Todavia no hay actividad reciente.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="p-4 rounded-lg border border-border/40 bg-card/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {activity.won ? <Trophy className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {activity.won ? 'Victoria' : 'Derrota'} - {activity.mode}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {activity.attempts} intentos - {activity.score} puntos
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-foreground/50">{relativeTimeFromNow(activity.played_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/game" className="flex-1">
            <Button className="w-full flex items-center gap-2">
              <Target className="w-4 h-4" />
              Jugar Ahora
            </Button>
          </Link>
          <Link href="/ranking" className="flex-1">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Award className="w-4 h-4" />
              Ver Ranking
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
