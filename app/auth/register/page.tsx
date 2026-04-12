'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
  { label: 'Una letra mayuscula', test: (p) => /[A-Z]/.test(p) },
  { label: 'Una letra minuscula', test: (p) => /[a-z]/.test(p) },
  { label: 'Un numero', test: (p) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrength = useMemo(() => {
    const passed = passwordRequirements.filter((req) => req.test(password)).length
    return {
      score: passed,
      percentage: (passed / passwordRequirements.length) * 100,
      label: passed === 0 ? '' : passed <= 2 ? 'Debil' : passed === 3 ? 'Media' : 'Fuerte',
      color: passed <= 2 ? '#F44336' : passed === 3 ? '#FF9800' : '#4CAF50',
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    if (passwordStrength.score < 4) {
      setError('La contrasena no cumple todos los requisitos')
      return
    }

    if (!acceptTerms) {
      setError('Debes aceptar los terminos y condiciones')
      return
    }

    setIsLoading(true)

    const result = await register(email, username, password)

    if (result.success) {
      router.push('/profile')
    } else {
      setError(result.error || 'Error al crear la cuenta')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0A0E1A' }}>
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            background: '#0D1B2A',
            border: '1px solid rgba(27, 58, 75, 0.6)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Crea tu cuenta</h1>
            <p className="text-muted-foreground">
              Unete a miles de jugadores alrededor del mundo
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="flex items-center gap-3 p-4 rounded-lg mb-6"
              style={{
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{
                    background: '#0A0E1A',
                    border: '1px solid rgba(27, 58, 75, 0.8)',
                  }}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Nombre de usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="geoblinder123"
                  required
                  minLength={3}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{
                    background: '#0A0E1A',
                    border: '1px solid rgba(27, 58, 75, 0.8)',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{
                    background: '#0A0E1A',
                    border: '1px solid rgba(27, 58, 75, 0.8)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Fortaleza:</span>
                    <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(27, 58, 75, 0.8)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength.percentage}%`,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        {req.test(password) ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span
                          className={req.test(password) ? 'text-green-500' : 'text-muted-foreground'}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirmar contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{
                    background: '#0A0E1A',
                    border: '1px solid rgba(27, 58, 75, 0.8)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Las contrasenas no coinciden</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border accent-primary"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Acepto los{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  terminos y condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  politica de privacidad
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isLoading ? 'rgba(0, 212, 255, 0.5)' : '#00D4FF',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">o continua con</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-foreground hover:bg-secondary/50 transition-colors"
              style={{
                background: '#1B3A4B',
                border: '1px solid rgba(27, 58, 75, 0.8)',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-foreground hover:bg-secondary/50 transition-colors"
              style={{
                background: '#1B3A4B',
                border: '1px solid rgba(27, 58, 75, 0.8)',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
