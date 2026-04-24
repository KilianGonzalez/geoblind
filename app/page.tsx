'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Globe, 
  Target, 
  Trophy, 
  Play, 
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/use-language'

export default function HomePage() {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <Navbar showModeTabs={false} showLoginButton={true} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div 
              className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30 hover:rotate-12"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Globe className={`w-12 h-12 text-primary-foreground transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            GeoBlind
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            El juego de geografía diario que desafía tu conocimiento del mundo mientras te diviertes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/game?mode=daily">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-primary/20">
                <Play className="w-5 h-5 mr-2" />
                Jugar Ahora
              </Button>
            </Link>
            <Link href="/rules">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold hover:bg-card/50 hover:scale-105 transition-all duration-300">
                Cómo Jugar
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Precisión Geográfica</h3>
            <p className="text-foreground/60">
              Adivina países basándote en pistas de distancia y dirección
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Sistema de Puntos</h3>
            <p className="text-foreground/60">
              Gana puntos y compite en el ranking global
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Desafíos Diarios</h3>
            <p className="text-foreground/60">
              Nuevo país cada día para mantener tu conocimiento activo
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Oráculo IA</h3>
            <p className="text-foreground/60">
              Consulta pistas estratégicas generadas por Groq durante la partida.
            </p>
          </div>
        </div>

        {/* Game Modes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Modos de Juego</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl border border-border/40 bg-gradient-to-br from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Modo Diario</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Un nuevo país cada día. ¡Perfecto para jugar diariamente!
              </p>
              <Link href="/game?mode=daily">
                <Button className="w-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 hover:shadow-md" variant="outline">
                  Jugar Modo Diario
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-border/40 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Modo Infinito</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Juga sin límites y mejora tu conocimiento geográfico.
              </p>
              <Link href="/game?mode=infinite">
                <Button className="w-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 hover:shadow-md" variant="outline">
                  Jugar Modo Infinito
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-border/40 bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Modo Región</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Enfócate en continentes específicos para dominar cada región.
              </p>
              <Link href="/game?mode=region">
                <Button className="w-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 hover:shadow-md" variant="outline">
                  Jugar Modo Región
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-border/40 bg-gradient-to-br from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Contrarreloj</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Adivina tantos países como puedas antes de que se acabe el tiempo.
              </p>
              <Link href="/game?mode=timed">
                <Button className="w-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 hover:shadow-md" variant="outline">
                  Jugar Contrarreloj
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-border/40 bg-gradient-to-br from-red-500/10 to-red-500/5 hover:from-red-500/20 hover:to-red-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Modo Difícil</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Solo para expertos. Menos intentos y pistas más vagas.
              </p>
              <Link href="/game?mode=hard">
                <Button className="w-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 hover:shadow-md" variant="outline">
                  Jugar Modo Difícil
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Únete a la Comunidad</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">195+</div>
              <p className="text-foreground/60">Países para descubrir</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-foreground/60">Jugadores activos</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <p className="text-foreground/60">Partidas jugadas</p>
            </div>
          </div>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            ¿Estás listo para desafiar tu conocimiento geográfico? 
            Únete a miles de jugadores que ya están explorando el mundo con GeoBlind.
          </p>
          <Link href="/game?mode=daily">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-primary/20">
              Empezar a Jugar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
