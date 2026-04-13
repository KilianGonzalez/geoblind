'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Bell,
  Globe,
  Volume2,
  Moon,
  Sun,
  Palette,
  Shield,
  Database,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Monitor,
  Sparkles,
  Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface UserSettings {
  username: string
  email: string
  notifications: {
    daily_reminder: boolean
    weekly_stats: boolean
    achievement_unlocked: boolean
    leaderboard_changes: boolean
  }
  preferences: {
    theme: 'dark' | 'light' | 'system'
    language: 'es' | 'en'
    sound_effects: boolean
    animations: boolean
    show_hints: boolean
    auto_submit: boolean
  }
  privacy: {
    profile_public: boolean
    show_in_leaderboard: boolean
    share_results: boolean
  }
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<UserSettings>({
    username: '',
    email: '',
    notifications: {
      daily_reminder: true,
      weekly_stats: true,
      achievement_unlocked: true,
      leaderboard_changes: false
    },
    preferences: {
      theme: 'dark',
      language: 'es',
      sound_effects: true,
      animations: true,
      show_hints: true,
      auto_submit: false
    },
    privacy: {
      profile_public: true,
      show_in_leaderboard: true,
      share_results: false
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
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
      
      // Load user settings (simulated for now)
      setSettings(prev => ({
        ...prev,
        username: user.user_metadata?.username || 'Jugador',
        email: user.email || ''
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user metadata
      if (user) {
        await supabase.auth.updateUser({
          data: { username: settings.username }
        })
      }
      
      // Show success message (you could use a toast here)
      console.log('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.new !== passwordForm.confirm) {
      console.error('Passwords do not match')
      return
    }

    try {
      await supabase.auth.updateUser({
        password: passwordForm.new
      })
      
      setPasswordForm({ current: '', new: '', confirm: '' })
      console.log('Password updated successfully')
    } catch (error) {
      console.error('Error updating password:', error)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await supabase.auth.admin.deleteUser(user.id)
        router.push('/')
      } catch (error) {
        console.error('Error deleting account:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </header>

      {/* Settings Content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            Perfil
          </h2>
          <div className="p-6 rounded-xl border border-border/40 bg-card/50 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  value={settings.username}
                  onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Jugador123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  disabled
                  className="opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-500" />
            Notificaciones
          </h2>
          <div className="p-6 rounded-xl border border-border/40 bg-card/50 space-y-4">
            {[
              { key: 'daily_reminder', label: 'Recordatorio diario', description: 'Recuérdame jugar cada día' },
              { key: 'weekly_stats', label: 'Estadísticas semanales', description: 'Resumen de mi progreso semanal' },
              { key: 'achievement_unlocked', label: 'Logros desbloqueados', description: 'Notificarme cuando consiga un logro' },
              { key: 'leaderboard_changes', label: 'Cambios en el ranking', description: 'Alertarme de cambios importantes' },
            ].map((notification, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{notification.label}</p>
                  <p className="text-sm text-foreground/60">{notification.description}</p>
                </div>
                <Switch
                  checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [notification.key]: checked
                      }
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6 text-green-500" />
            Preferencias
          </h2>
          <div className="p-6 rounded-xl border border-border/40 bg-card/50 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex gap-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Claro' },
                    { value: 'dark', icon: Moon, label: 'Oscuro' },
                    { value: 'system', icon: Monitor, label: 'Sistema' }
                  ].map((theme) => (
                    <Button
                      key={theme.value}
                      variant={settings.preferences.theme === theme.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: theme.value as 'dark' | 'light' | 'system' }
                      }))}
                      className="flex items-center gap-2"
                    >
                      <theme.icon className="w-4 h-4" />
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Idioma</Label>
                <select 
                  value={settings.preferences.language}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value as 'es' | 'en' }
                  }))}
                  className="w-full p-2 rounded-lg border border-border/40 bg-background text-foreground"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'sound_effects', label: 'Efectos de sonido', icon: Volume2 },
                { key: 'animations', label: 'Animaciones', icon: Sparkles },
                { key: 'show_hints', label: 'Mostrar pistas automáticas', icon: Eye },
                { key: 'auto_submit', label: 'Enviar respuesta automáticamente', icon: Zap },
              ].map((preference, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <preference.icon className="w-4 h-4 text-foreground/60" />
                    <span className="font-medium text-foreground">{preference.label}</span>
                  </div>
                  <Switch
                    checked={settings.preferences[preference.key as keyof typeof settings.preferences]}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          [preference.key]: checked as boolean
                        }
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" />
            Privacidad
          </h2>
          <div className="p-6 rounded-xl border border-border/40 bg-card/50 space-y-4">
            {[
              { key: 'profile_public', label: 'Perfil público', description: 'Permitir que otros vean mi perfil' },
              { key: 'show_in_leaderboard', label: 'Mostrar en ranking', description: 'Aparecer en las tablas de posiciones' },
              { key: 'share_results', label: 'Compartir resultados', description: 'Permitir compartir mis partidas' },
            ].map((privacy, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{privacy.label}</p>
                  <p className="text-sm text-foreground/60">{privacy.description}</p>
                </div>
                <Switch
                  checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        [privacy.key]: checked
                      }
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Seguridad
          </h2>
          <div className="p-6 rounded-xl border border-border/40 bg-card/50">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="Nueva contraseña"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Actualizar contraseña
              </Button>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-500" />
            Zona de Peligro
          </h2>
          <div className="p-6 rounded-xl border border-red-500/40 bg-red-500/10">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Eliminar cuenta</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Eliminar permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar mi cuenta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
