'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, MapPin, Compass, Thermometer, Sun, Moon, LogIn, ChevronDown } from 'lucide-react'
import { use, useState, useEffect } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage } from '@/hooks/use-language'

const modes = [
  { id: 'diario', label: { es: 'Diario', en: 'Daily' }, color: '#00D4FF' },
  { id: 'infinito', label: { es: 'Infinito', en: 'Infinite' }, color: '#A855F7' },
  { id: 'region', label: { es: 'Región', en: 'Region' }, color: '#22C55E' },
  { id: 'contrarreloj', label: { es: 'Contrarreloj', en: 'Timed' }, color: '#F59E0B' },
  { id: 'dificil', label: { es: 'Difícil', en: 'Hard' }, color: '#EF4444' }
]

const translations = {
  es: {
    title: 'Adivina el País Misterioso',
    subtitle: 'Un nuevo reto de geografía cada día. Recibe pistas de distancia, dirección y temperatura. ¿Puedes adivinar en menos intentos?',
    playNow: 'Jugar Ahora',
    readRules: 'Leer Reglas',
    login: 'Iniciar sesión',
    howItWorks: '¿Cómo Funciona?',
    howItWorksSubtitle: 'Recibe pistas estratégicas para adivinar el país del día',
    distanceHint: 'Pista de Distancia',
    distanceHintDesc: 'Descubre a cuántos km de distancia está el país misterioso',
    directionHint: 'Pista de Dirección',
    directionHintDesc: 'Sabe en qué dirección se encuentra: norte, sur, este u oeste',
    temperatureHint: 'Pista de Temperatura',
    temperatureHintDesc: 'Recibe el rango de temperatura para narrowdown tu búsqueda',
    joinMillions: 'Únete a Millones de Jugadores',
    joinMillionsSubtitle: 'Todos los días, un nuevo país. Todos los días, un nuevo reto. ¿Cuántos aciertos puedes conseguir?',
    startNow: 'Comenzar Ahora',
    footerTitle: 'GeoBlind',
    footerDesc: 'El juego de geografía diario que desafía tu conocimiento del mundo.',
    game: 'Juego',
    play: 'Jugar Ahora',
    howToPlay: 'Cómo Jugar',
    globalRanking: 'Ranking Global',
    account: 'Cuenta',
    signIn: 'Iniciar Sesión',
    myProfile: 'Mi Perfil',
    settings: 'Configuración',
    more: 'Más',
    aboutUs: 'Sobre Nosotros',
    contact: 'Contacto',
    copyright: '© 2024 GeoBlind. Un juego de geografía diario. Hecho con'
  },
  en: {
    title: 'Guess the Mystery Country',
    subtitle: 'A new geography challenge every day. Get distance, direction and temperature clues. Can you guess in fewer attempts?',
    playNow: 'Play Now',
    readRules: 'Read Rules',
    login: 'Sign In',
    howItWorks: 'How It Works?',
    howItWorksSubtitle: 'Get strategic clues to guess the country of the day',
    distanceHint: 'Distance Clue',
    distanceHintDesc: 'Discover how many km away the mystery country is',
    directionHint: 'Direction Clue',
    directionHintDesc: 'Know where it is located: north, south, east or west',
    temperatureHint: 'Temperature Clue',
    temperatureHintDesc: 'Get the temperature range to narrow down your search',
    joinMillions: 'Join Millions of Players',
    joinMillionsSubtitle: 'Every day, a new country. Every day, a new challenge. How many correct answers can you get?',
    startNow: 'Start Now',
    footerTitle: 'GeoBlind',
    footerDesc: 'The daily geography game that challenges your world knowledge.',
    game: 'Game',
    play: 'Play Now',
    howToPlay: 'How to Play',
    globalRanking: 'Global Ranking',
    account: 'Account',
    signIn: 'Sign In',
    myProfile: 'My Profile',
    settings: 'Settings',
    more: 'More',
    aboutUs: 'About Us',
    contact: 'Contact',
    copyright: '© 2024 GeoBlind. A daily geography game. Made with'
  }
}

export default function Home({
  params,
  searchParams,
}: {
  params: Promise<Record<string, never>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  use(params)
  use(searchParams)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage, t: gameTranslations, getLanguageFlag, getLanguageName } = useLanguage()
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

  const t = translations[language as keyof typeof translations]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </div>

          {/* Mode Tabs - Center */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className="px-4 py-2 rounded-full font-medium text-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: mode.color,
                  color: '#0A0E1A'
                }}
              >
                {mode.label[language as keyof typeof mode.label]}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative language-dropdown">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                title="Language selector"
                className="p-2 hover:bg-card rounded-lg transition-colors text-foreground flex items-center gap-1"
              >
                <span className="text-lg">??</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 top-full mt-1 p-2 rounded-lg border border-border/40 bg-card shadow-lg z-50">
                  <button
                    onClick={() => changeLanguage('es')}
                    className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors ${
                      language === 'es' ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    {getLanguageFlag('es')} {getLanguageName('es')}
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
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
            <button 
              onClick={handleLogin}
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                {t.title}
              </h1>
              <p className="text-xl text-foreground/70">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/game?mode=daily"
                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
              >
                {t.playNow}
              </Link>
              <Link 
                href="/rules"
                className="px-8 py-3 border border-border rounded-lg text-foreground hover:bg-card transition-colors font-semibold"
              >
                {t.readRules}
              </Link>
            </div>

            <div className="pt-6 border-t border-border/40">
              <p className="text-sm text-foreground/70 font-mono">
                <span className="text-primary font-semibold">🌍 12,847</span> jugadores hoy · 
                <span className="text-primary font-semibold"> 🔥 4.2</span> intentos promedio · 
                <span className="text-primary font-semibold"> 🏆 231</span> países disponibles
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-96 h-96 rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-ocean to-earth-teal/20 animate-spin-slow" style={{
              animation: 'spin 30s linear infinite'
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-96 h-96 text-primary/20" />
              </div>
              <div className="absolute inset-0 rounded-full" style={{
                boxShadow: '0 0 80px rgba(0, 212, 255, 0.3)'
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t.howItWorks}</h2>
          <p className="text-lg text-foreground/60">{t.howItWorksSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: t.distanceHint,
              description: t.distanceHintDesc
            },
            {
              icon: Compass,
              title: t.directionHint,
              description: t.directionHintDesc
            },
            {
              icon: Thermometer,
              title: t.temperatureHint,
              description: t.temperatureHintDesc
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-xl border border-border/40 bg-card/50 hover:border-border/60 hover:bg-card/80 transition-all"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="bg-gradient-to-r from-ocean/20 to-earth-teal/20 rounded-2xl border border-border/40 p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">{t.joinMillions}</h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            {t.joinMillionsSubtitle}
          </p>
          <Link
            href="/game?mode=daily"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t.startNow}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg text-foreground">{t.footerTitle}</span>
              </div>
              <p className="text-foreground/60 text-sm">
                {t.footerDesc}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t.game}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/game" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.play}
                  </Link>
                </li>
                <li>
                  <Link href="/rules" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.howToPlay}
                  </Link>
                </li>
                <li>
                  <Link href="/ranking" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.globalRanking}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t.account}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.signIn}
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.myProfile}
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.settings}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t.more}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                    {t.contact}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8 text-center text-foreground/60 text-sm">
            <p>{t.copyright} <span className="text-red-500">red</span></p>
          </div>
        </div>
      </footer>
    </main>
  )
}
