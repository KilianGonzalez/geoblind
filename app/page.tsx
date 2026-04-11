'use client'

import Link from 'next/link'
import { Globe, MapPin, Compass, Thermometer, Sun, Moon, LogIn } from 'lucide-react'
import { useState } from 'react'

const modes = [
  { id: 'diario', label: 'Diario', color: '#00D4FF' },
  { id: 'infinito', label: 'Infinito', color: '#A855F7' },
  { id: 'region', label: 'Región', color: '#22C55E' },
  { id: 'contrarreloj', label: 'Contrarreloj', color: '#F59E0B' },
  { id: 'dificil', label: 'Difícil', color: '#EF4444' }
]

export default function Home() {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('es')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', newTheme)
    }
  }

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
                {mode.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              title="Language selector"
              className="p-2 hover:bg-card rounded-lg transition-colors text-foreground"
            >
              <span className="text-lg">🌐</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-card rounded-lg transition-colors text-foreground"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors font-medium text-sm flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Iniciar sesión</span>
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
                Adivina el País Misterioso
              </h1>
              <p className="text-xl text-foreground/70">
                Un nuevo reto de geografía cada día. Recibe pistas de distancia, dirección y temperatura. ¿Puedes adivinar en menos intentos?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/game"
                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
              >
                Jugar Ahora
              </Link>
              <button className="px-8 py-3 border border-border rounded-lg text-foreground hover:bg-card transition-colors font-semibold">
                Leer Reglas
              </button>
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
          <h2 className="text-4xl font-bold text-foreground mb-4">¿Cómo Funciona?</h2>
          <p className="text-lg text-foreground/60">Recibe pistas estratégicas para adivinar el país del día</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: 'Pista de Distancia',
              description: 'Descubre a cuántos km de distancia está el país misterioso'
            },
            {
              icon: Compass,
              title: 'Pista de Dirección',
              description: 'Sabe en qué dirección se encuentra: norte, sur, este u oeste'
            },
            {
              icon: Thermometer,
              title: 'Pista de Temperatura',
              description: 'Recibe el rango de temperatura para narrowdown tu búsqueda'
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
          <h2 className="text-3xl font-bold text-foreground mb-6">Únete a Millones de Jugadores</h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Todos los días, un nuevo país. Todos los días, un nuevo reto. ¿Cuántos aciertos puedes conseguir?
          </p>
          <Link
            href="/game"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Comenzar Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>© 2024 GeoBlind. Un juego de geografía diario. Hecho con ❤️</p>
        </div>
      </footer>
    </main>
  )
}
