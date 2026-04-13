'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ButtonGroup } from '@/components/ui/button-group'
import { useLanguage } from '@/hooks/use-language'

export default function AuthPage() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/game')
      }
    } catch (err) {
      setError(t('loginError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: { username: registerForm.username }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/game')
      }
    } catch (err) {
      setError(t('registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link 
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">GeoBlind</h1>
          <p className="text-muted-foreground">{language === 'es' ? 'El juego de geografía diario' : 'The daily geography game'}</p>
        </div>

        <ButtonGroup className="w-full mb-6">
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
              <Input
                id="login-email"
                type="email"
                placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">{t('password')}</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username">{t('username')}</Label>
              <Input
                id="register-username"
                type="text"
                placeholder={language === 'es' ? 'jugador123' : 'player123'}
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">{t('email')}</Label>
              <Input
                id="register-email"
                type="email"
                placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">{t('password')}</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('signingUp') : t('createAccount')}
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
