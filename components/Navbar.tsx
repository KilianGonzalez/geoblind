'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, Sun, Moon, LogIn, ChevronDown, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage } from '@/hooks/use-language'

const modes = [
  { id: 'diario', label: { es: 'Diario', en: 'Daily' }, color: '#00D4FF' },
  { id: 'infinito', label: { es: 'Infinito', en: 'Infinite' }, color: '#A855F7' },
  { id: 'region', label: { es: 'Región', en: 'Region' }, color: '#22C55E' },
  { id: 'contrarreloj', label: { es: 'Contrarreloj', en: 'Timed' }, color: '#F59E0B' },
  { id: 'dificil', label: { es: 'Difícil', en: 'Hard' }, color: '#EF4444' }
]

interface NavbarProps {
  showModeTabs?: boolean
  showLoginButton?: boolean
  showBackButton?: boolean
}

export default function Navbar({ 
  showModeTabs = true, 
  showLoginButton = true, 
  showBackButton = false 
}: NavbarProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage, t, getLanguageFlag, getLanguageName } = useLanguage()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false)
      }
    }

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageDropdown])

  const handleLanguageChange = (lang: 'es' | 'en') => {
    changeLanguage(lang)
    setShowLanguageDropdown(false)
  }

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
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </Link>
          )}
          <Globe className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl text-foreground">GeoBlind</span>
        </div>

        {/* Mode Tabs - Center */}
        {showModeTabs && (
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className="px-4 py-2 rounded-full font-medium text-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: mode.color,
                  color: '#0A0E1A'
                }}
                onClick={() => {
                  const q = mode.id === 'region' ? '?mode=region&continent=Europa' : `?mode=${mode.id}`
                  router.push(`/game${q}`)
                }}
              >
                {mode.label[language as keyof typeof mode.label]}
              </button>
            ))}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative language-dropdown">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              title="Language selector"
              className="p-2 hover:bg-card rounded-lg transition-colors text-foreground flex items-center gap-1"
            >
              <span className="text-lg">{getLanguageFlag(language)}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-1 p-2 rounded-lg border border-border/40 bg-card shadow-lg z-50">
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors ${
                    language === 'es' ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {getLanguageFlag('es')} {getLanguageName('es')}
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors ${
                    language === 'en' ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {getLanguageFlag('en')} {getLanguageName('en')}
                </button>
              </div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-card rounded-lg transition-colors text-foreground"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          
          {/* Login Button */}
          {showLoginButton && (
            <button 
              onClick={handleLogin}
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('signIn')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
