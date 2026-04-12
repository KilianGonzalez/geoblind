'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Globe,
  User,
  Trophy,
  Flame,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Edit2,
  Check,
  X,
  Loader2,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

type TabId = 'stats' | 'achievements' | 'settings'

export default function ProfilePage() {
  const router = useRouter()
  const { user, stats, achievements, isLoading, isAuthenticated, logout, updateProfile, updatePassword } = useAuth()

  const [activeTab, setActiveTab] = useState<TabId>('stats')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setNewUsername(user.username)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSaveUsername = async () => {
    if (!newUsername.trim() || newUsername === user?.username) {
      setIsEditingUsername(false)
      return
    }

    setIsSaving(true)
    await updateProfile({ username: newUsername })
    setIsSaving(false)
    setIsEditingUsername(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    setIsSaving(true)

    const result = await updatePassword(currentPassword, newPassword)

    if (result.success) {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess(false)
      }, 2000)
    } else {
      setPasswordError(result.error || 'Error al cambiar contrasena')
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0E1A' }}>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    )
  }

  if (!user) {
    return null
  }

  const tabs: { id: TabId; label: string; icon: typeof Trophy }[] = [
    { id: 'stats', label: 'Estadisticas', icon: BarChart3 },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ]

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0

  return (
    <main className="min-h-screen" style={{ background: '#0A0E1A' }}>
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/game"
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Jugar
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Cerrar sesion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: '#0D1B2A',
            border: '1px solid rgba(27, 58, 75, 0.6)',
          }}
        >
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #1E6091 100%)',
                color: '#0A0E1A',
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="px-3 py-1 rounded-lg text-xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      style={{
                        background: '#0A0E1A',
                        border: '1px solid rgba(27, 58, 75, 0.8)',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveUsername}
                      disabled={isSaving}
                      className="p-1 text-green-500 hover:text-green-400"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false)
                        setNewUsername(user.username)
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <p className="text-muted-foreground text-xs mt-1">
                Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {stats.currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">Racha</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {stats.gamesWon}
                </div>
                <div className="text-xs text-muted-foreground">Victorias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {winRate}%
                </div>
                <div className="text-xs text-muted-foreground">Aciertos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 p-1 rounded-xl mb-6"
          style={{
            background: '#0D1B2A',
            border: '1px solid rgba(27, 58, 75, 0.6)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all"
              style={{
                background: activeTab === tab.id ? '#00D4FF' : 'transparent',
                color: activeTab === tab.id ? '#0A0E1A' : '#8BA4B0',
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Target, label: 'Partidas', value: stats.gamesPlayed, color: '#00D4FF' },
                { icon: Trophy, label: 'Victorias', value: stats.gamesWon, color: '#4CAF50' },
                { icon: Flame, label: 'Racha maxima', value: stats.maxStreak, color: '#FF9800' },
                { icon: BarChart3, label: 'Promedio', value: stats.averageAttempts.toFixed(1), color: '#A855F7' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{
                    background: '#0D1B2A',
                    border: '1px solid rgba(27, 58, 75, 0.6)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: stat.color, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Win Rate Bar */}
            <div
              className="p-6 rounded-xl"
              style={{
                background: '#0D1B2A',
                border: '1px solid rgba(27, 58, 75, 0.6)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Tasa de aciertos</span>
                <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {winRate}%
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ background: 'rgba(27, 58, 75, 0.8)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${winRate}%`,
                    background: 'linear-gradient(90deg, #00D4FF 0%, #4CAF50 100%)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{stats.gamesWon} victorias</span>
                <span>{stats.gamesPlayed - stats.gamesWon} derrotas</span>
              </div>
            </div>

            {/* Total Score */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(30, 96, 145, 0.1) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
              }}
            >
              <div className="text-sm text-muted-foreground mb-1">Puntuacion Total</div>
              <div
                className="text-5xl font-bold text-primary"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {stats.totalScore.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 rounded-xl flex items-center gap-4 transition-all"
                style={{
                  background: achievement.unlockedAt ? '#0D1B2A' : 'rgba(13, 27, 42, 0.5)',
                  border: `1px solid ${achievement.unlockedAt ? 'rgba(0, 212, 255, 0.3)' : 'rgba(27, 58, 75, 0.4)'}`,
                  opacity: achievement.unlockedAt ? 1 : 0.6,
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: achievement.unlockedAt
                      ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(30, 96, 145, 0.2) 100%)'
                      : 'rgba(27, 58, 75, 0.5)',
                    filter: achievement.unlockedAt ? 'none' : 'grayscale(1)',
                  }}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-primary mt-1">
                      Desbloqueado el {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
                {achievement.unlockedAt && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Change Password */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: '#0D1B2A',
                border: '1px solid rgba(27, 58, 75, 0.6)',
              }}
            >
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Cambiar contrasena</div>
                    <div className="text-sm text-muted-foreground">Actualiza tu contrasena de acceso</div>
                  </div>
                </div>
                <ChevronRight
                  className="w-5 h-5 text-muted-foreground transition-transform"
                  style={{ transform: showPasswordForm ? 'rotate(90deg)' : 'none' }}
                />
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="p-4 pt-0 space-y-4">
                  {passwordError && (
                    <div
                      className="p-3 rounded-lg text-sm text-destructive"
                      style={{
                        background: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                      }}
                    >
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div
                      className="p-3 rounded-lg text-sm text-green-500"
                      style={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                      }}
                    >
                      Contrasena actualizada correctamente
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Contrasena actual</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      style={{
                        background: '#0A0E1A',
                        border: '1px solid rgba(27, 58, 75, 0.8)',
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Nueva contrasena</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      style={{
                        background: '#0A0E1A',
                        border: '1px solid rgba(27, 58, 75, 0.8)',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-2 rounded-lg font-semibold text-primary-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: '#00D4FF' }}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-xl text-left hover:bg-destructive/10 transition-colors"
              style={{
                background: '#0D1B2A',
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              <LogOut className="w-5 h-5 text-destructive" />
              <div>
                <div className="font-medium text-destructive">Cerrar sesion</div>
                <div className="text-sm text-muted-foreground">Salir de tu cuenta</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
