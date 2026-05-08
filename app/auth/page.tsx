'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, Mail, User2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ButtonGroup } from '@/components/ui/button-group'
import { useLanguage } from '@/hooks/use-language'

function formatRegisterError(message: string): string {
  if (message.includes('Database error saving new user')) {
    return 'El registro falla en Supabase porque el trigger que crea perfiles no coincide con la tabla actual. Ejecuta el SQL de `supabase/fixes/2026-04-20-fix-signup-profile-trigger.sql` y vuelve a intentarlo.'
  }

  if (message.toLowerCase().includes('email signups are disabled')) {
    return 'El registro por correo esta desactivado en Supabase. Ve a Authentication > Providers > Email y activa "Enable Email provider" y "Enable Email signups".'
  }

  return message
}

export default function AuthPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        setMessage(t('loginSuccess'))
        setTimeout(() => {
          window.location.href = '/game'
        }, 1500)
      }
    } catch {
      setError(t('loginError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            username: registerForm.username,
          },
        },
      })

      if (error) {
        setError(formatRegisterError(error.message))
      } else if (data.user) {
        if (!data.session) {
          const { error: loginAfterSignupError } = await supabase.auth.signInWithPassword({
            email: registerForm.email,
            password: registerForm.password,
          })

          if (loginAfterSignupError) {
            setError(loginAfterSignupError.message)
            return
          }
        }

        setMessage(t('registerSuccess'))
        setTimeout(() => {
          window.location.href = '/game'
        }, 1500)
      }
    } catch {
      setError(t('registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article
            className="reveal-up relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-sky-500/10 via-card to-cyan-500/10 px-5 py-10 sm:px-8 lg:px-10 lg:py-12"
            style={{ ['--delay' as string]: '50ms' }}
          >
            <div className="float-soft pointer-events-none absolute -left-14 top-8 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="float-soft pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/45 px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </Link>
              <h1 className="mt-8 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Accede a GeoBlind y guarda tu progreso real.
              </h1>
              <p className="mt-4 max-w-lg text-sm text-foreground/75 sm:text-base">
                Inicia sesion o crea cuenta para mantener estadisticas, rachas y posicion en ranking.
              </p>
              <div className="mt-7 space-y-3 text-sm text-foreground/80">
                <p className="inline-flex items-center gap-2 rounded-lg border border-border/45 bg-background/45 px-3 py-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Acceso con correo y password
                </p>
                <p className="inline-flex items-center gap-2 rounded-lg border border-border/45 bg-background/45 px-3 py-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Sesion persistente en web y movil
                </p>
              </div>
            </div>
          </article>

          <article className="reveal-up rounded-3xl border border-border/45 bg-card/55 p-5 sm:p-6 lg:p-7" style={{ ['--delay' as string]: '120ms' }}>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">GeoBlind</h2>
              <p className="mt-2 text-sm text-foreground/70">El juego de geografia diario</p>
            </div>

            <ButtonGroup className="mb-6 w-full">
              <Button
                variant={activeTab === 'login' ? 'default' : 'outline'}
                onClick={() => setActiveTab('login')}
                className="flex-1"
              >
                {t('signIn')}
              </Button>
              <Button
                variant={activeTab === 'register' ? 'default' : 'outline'}
                onClick={() => setActiveTab('register')}
                className="flex-1"
              >
                {t('signUp')}
              </Button>
            </ButtonGroup>

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="********"
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('signingIn') : t('signIn')}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">{t('username')}</Label>
                  <div className="relative">
                    <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="jugador123"
                      value={registerForm.username}
                      onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerForm.email}
                      onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="********"
                      value={registerForm.password}
                      onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('signingUp') : t('createAccount')}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {message && (
              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-3">
                <p className="text-sm text-primary">{message}</p>
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}
