'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Globe, 
  Award,
  BarChart3,
  ArrowLeft,
  Settings,
  LogOut,
  Mail,
  Clock,
  XCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

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

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<GameStats[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      setUser(user)

      // Fetch profile data (simulated for now)
      const mockProfile: UserProfile = {
        id: user.id,
        username: user.user_metadata?.username || 'Jugador',
        email: user.email || '',
        created_at: user.created_at,
        total_games: 156,
        total_wins: 89,
        current_streak: 7,
        best_streak: 23,
        average_attempts: 3.2,
        favorite_mode: 'daily',
        total_score: 45680
      }

      const mockStats: GameStats[] = [
        {
          mode: 'Diario',
          games: 89,
          wins: 67,
          win_rate: 75.3,
          avg_attempts: 2.8,
          best_score: 1200
        },
        {
          mode: 'Infinito',
          games: 45,
          wins: 22,
          win_rate: 48.9,
          avg_attempts: 3.5,
          best_score: 800
        },
        {
          mode: 'Región',
          games: 12,
          wins: 8,
          win_rate: 66.7,
          avg_attempts: 3.1,
          best_score: 600
        },
        {
          mode: 'Contrarreloj',
          games: 8,
          wins: 5,
          win_rate: 62.5,
          avg_attempts: 2.9,
          best_score: 1500
        },
        {
          mode: 'Difícil',
          games: 2,
          wins: 1,
          win_rate: 50.0,
          avg_attempts: 4.0,
          best_score: 400
        }
      ]

      setProfile(mockProfile)
      setStats(mockStats)
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <h2 className="text-xl font-semibold text-foreground mb-2">No se encontró el perfil</h2>
          <Link href="/auth" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  const winRate = profile.total_games > 0 ? (profile.total_wins / profile.total_games * 100).toFixed(1) : '0'

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </div>

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

      {/* Profile Content */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 p-8 rounded-2xl border border-border/40 bg-card/50">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-3xl font-bold text-primary-foreground">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">{profile.username}</h1>
              <div className="flex items-center gap-2 text-foreground/70 mb-4 justify-center md:justify-start">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60 justify-center md:justify-start">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Se unió el {new Date(profile.created_at).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
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

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Logros
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Primera Victoria', icon: '1', color: 'bg-green-500', unlocked: true },
              { name: 'Racha de 7', icon: '7', color: 'bg-orange-500', unlocked: true },
              { name: 'Perfecto', icon: '100%', color: 'bg-purple-500', unlocked: true },
              { name: 'Explorador', icon: '50', color: 'bg-blue-500', unlocked: true },
              { name: 'Maestro', icon: '100', color: 'bg-red-500', unlocked: false },
              { name: 'Legendario', icon: '200', color: 'bg-yellow-500', unlocked: false },
            ].map((achievement, i) => (
              <div 
                key={i}
                className={`p-4 rounded-xl border text-center transition-all ${
                  achievement.unlocked 
                    ? 'border-primary/40 bg-card/50 hover:border-primary/60' 
                    : 'border-border/20 bg-card/20 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold ${
                  achievement.unlocked ? achievement.color : 'bg-gray-500'
                }`}>
                  {achievement.icon}
                </div>
                <p className="text-xs text-foreground/70">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Game Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Estadísticas por Modo
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-xl border border-border/40 bg-card/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{stat.mode}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    stat.win_rate >= 70 ? 'bg-green-500/20 text-green-400' :
                    stat.win_rate >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
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
                    <span className="text-foreground/70">Mejor puntuación</span>
                    <span className="font-mono text-primary">{stat.best_score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-500" />
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            {[
              { type: 'win', mode: 'Diario', attempts: 3, score: 800, time: '2 horas' },
              { type: 'loss', mode: 'Infinito', attempts: 6, score: 0, time: '5 horas' },
              { type: 'win', mode: 'Diario', attempts: 2, score: 1000, time: '1 día' },
              { type: 'win', mode: 'Región', attempts: 4, score: 600, time: '1 día' },
              { type: 'win', mode: 'Diario', attempts: 1, score: 1200, time: '2 días' },
            ].map((activity, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/40 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {activity.type === 'win' ? <Trophy className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.type === 'win' ? 'Victoria' : 'Derrota'} - {activity.mode}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {activity.attempts} intentos · {activity.score} puntos
                    </p>
                  </div>
                </div>
                <span className="text-sm text-foreground/50">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
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
