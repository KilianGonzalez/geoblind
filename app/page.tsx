'use client'

import Link from 'next/link'
import { Globe, Zap, Trophy, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
              Características
            </a>
            <a href="#stats" className="text-foreground/70 hover:text-foreground transition-colors">
              Estadísticas
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
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

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/40">
              <div>
                <div className="text-2xl font-bold text-primary">1M+</div>
                <p className="text-sm text-foreground/60">Jugadores</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">50M+</div>
                <p className="text-sm text-foreground/60">Intentos</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">100%</div>
                <p className="text-sm text-foreground/60">Gratuito</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-ocean to-earth-teal/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-32 h-32 text-primary/30 animate-pulse-glow" />
            </div>
            <div className="absolute top-8 right-8 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-earth-teal/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">¿Cómo Funciona?</h2>
          <p className="text-lg text-foreground/60">Recibe pistas estratégicas para adivinar el país del día</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Pista de Distancia',
              description: 'Descubre a cuántos km de distancia está el país misterioso'
            },
            {
              icon: BarChart3,
              title: 'Pista de Dirección',
              description: 'Sabe en qué dirección se encuentra: norte, sur, este u oeste'
            },
            {
              icon: Trophy,
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
      <section id="stats" className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="bg-gradient-to-r from-ocean/20 to-earth-teal/20 rounded-2xl border border-border/40 p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Únete a Millones de Jugadores</h2>
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
      <footer className="border-t border-border/40 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>© 2024 GeoBlind. Un juego de geografía diario. Hecho con ❤️</p>
        </div>
      </footer>
    </main>
  )
}
