'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  Globe, 
  Moon, 
  Sun, 
  User,
  Menu,
  X
} from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage } from '@/hooks/use-language'
import { useAuthUser } from '@/hooks/use-auth-user'

interface NavbarProps {
  showModeTabs?: boolean
  showLoginButton?: boolean
  showBackButton?: boolean
}

const modes = [
  { id: 'daily', color: '#10B981', translationKey: 'dailyMode' as const },
  { id: 'infinite', color: '#3B82F6', translationKey: 'infiniteMode' as const },
  { id: 'region', color: '#8B5CF6', translationKey: 'regionMode' as const },
]

export default function Navbar({ 
  showModeTabs = true, 
  showLoginButton = true, 
  showBackButton = false 
}: NavbarProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuthUser()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogin = () => {
    router.push('/auth')
  }

  return (
    <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Link 
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-4"
            >
              <X className="w-5 h-5" />
              {t('back')}
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </Link>
        </div>

        {/* Mode Tabs - Center */}
        {showModeTabs && (
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            {modes.map((mode) => (
              <Link
                key={mode.id}
                href={mode.id === 'region' ? '/game?mode=region' : `/game?mode=${mode.id}`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 bg-card/50 border border-border/40 hover:bg-card/80"
                style={{ borderColor: mode.color + '40' }}
              >
                {t(mode.translationKey)}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side - Theme Toggle and Login */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-card/50 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* Auth - Desktop */}
          {showLoginButton && (
            authLoading ? (
              <div className="hidden md:block w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <Link
                href="/profile"
                className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 items-center justify-center text-primary-foreground text-sm font-bold transition-transform hover:scale-105"
                title={user.email ?? 'Perfil'}
              >
                {user.email?.slice(0, 2).toUpperCase() ?? 'U'}
              </Link>
            ) : (
              <button 
                onClick={handleLogin}
                className="hidden md:flex px-4 py-2 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors font-medium text-sm items-center gap-2"
              >
                <User className="w-4 h-4" />
                {t('signIn')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Mobile Mode Tabs */}
            {showModeTabs && (
              <div className="flex flex-col gap-2">
                {modes.map((mode) => (
                  <Link
                    key={mode.id}
                    href={mode.id === 'region' ? '/game?mode=region' : `/game?mode=${mode.id}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-card/50 bg-card/30 border border-border/40"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t(mode.translationKey)}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Mobile Auth */}
            {showLoginButton && (
              authLoading ? (
                <div className="w-full h-10 rounded-lg bg-muted animate-pulse" />
              ) : user ? (
                <Link
                  href="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {user.email ?? 'Perfil'}
                </Link>
              ) : (
                <button 
                  onClick={() => {
                    handleLogin()
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t('signIn')}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
