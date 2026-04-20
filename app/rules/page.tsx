'use client'

import Link from 'next/link'
import { 
  Globe, 
  Target, 
  Trophy, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Info,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/use-language'

export default function RulesPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <Navbar showBackButton={true} showModeTabs={false} showLoginButton={false} />

      <section className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cómo Jugar
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Aprende las reglas y conviértete en un maestro de la geografía
          </p>
        </div>

        {/* Objective */}
        <div className="p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Objetivo del Juego</h2>
              <p className="text-foreground/70 leading-relaxed">
                El objetivo de GeoBlind es adivinar el país misterioso usando las pistas de distancia, 
                dirección y características geográficas que te proporcionamos después de cada intento. 
                ¡Tienes un número limitado de intentos para encontrar la respuesta correcta!
              </p>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Modos de Juego
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Modo Diario</h3>
              </div>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Un nuevo país cada día</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>6 intentos para adivinar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ranking diario y global</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Modo Infinito</h3>
              </div>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Juga sin límite de países</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>8 intentos por país</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Acumula puntos y experiencia</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Modo Región</h3>
              </div>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Enfócate en un continente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>7 intentos por país</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Domina cada región</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Contrarreloj</h3>
              </div>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>90 segundos para cada país</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Intentos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Mayor puntuación por rapidez</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Modo Difícil</h3>
              </div>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Solo 4 intentos por país</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Pistas de distancia más vagas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Puntos extra por dificultad</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            Cómo Jugar Paso a Paso
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Elige un Modo</h3>
                <p className="text-foreground/70">
                  Selecciona entre Diario, Infinito o Región según tu preferencia.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Escribe un País</h3>
                <p className="text-foreground/70">
                  Comienza a escribir el nombre de un país en el campo de búsqueda.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Analiza las Pistas</h3>
                <p className="text-foreground/70">
                  Después de cada intento, verás la distancia, dirección y características del país correcto.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Adivina y Gana</h3>
                <p className="text-foreground/70">
                  Usa las pistas para acercarte cada vez más al país correcto antes de que se acaben los intentos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            Sistema de Puntuación
          </h2>
          <div className="p-6 rounded-xl border border-border/40 bg-card/30">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Puntos por Intento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-foreground font-medium">1er intento</span>
                    <span className="text-green-500 font-bold">1000 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="text-foreground font-medium">2do intento</span>
                    <span className="text-blue-500 font-bold">800 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-foreground font-medium">3er intento</span>
                    <span className="text-yellow-500 font-bold">600 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <span className="text-foreground font-medium">4to intento</span>
                    <span className="text-orange-500 font-bold">400 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-foreground font-medium">5to intento</span>
                    <span className="text-red-500 font-bold">200 pts</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-4">Bonificaciones</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Star className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-foreground font-medium">Racha de victorias</span>
                      <p className="text-foreground/60 text-sm">+100 pts por cada día consecutivo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Shield className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-foreground font-medium">Perfecto</span>
                      <p className="text-foreground/60 text-sm">+500 pts si adivinas al 1er intento</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Info className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-foreground font-medium">Explorador</span>
                      <p className="text-foreground/60 text-sm">+200 pts por países nuevos descubiertos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            Consejos y Estrategias
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <h3 className="font-semibold text-foreground mb-3 text-green-500">Para Principiantes</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li>• Empieza con países grandes y conocidos</li>
                <li>• Fíjate en las direcciones cardinales</li>
                <li>• Usa la distancia como tu principal pista</li>
                <li>• No temas equivocarte, cada intento ayuda</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <h3 className="font-semibold text-foreground mb-3 text-blue-500">Para Expertos</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li>• Memoriza las distancias entre países clave</li>
                <li>• Desarrolla un sistema de eliminación</li>
                <li>• Practica el modo región para dominar áreas</li>
                <li>• Mantén tu racha diaria para bonus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            ¿Listos para el Desafío?
          </h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            Ahora que conoces las reglas, es hora de poner a prueba tu conocimiento geográfico. 
            ¡El mundo te espera!
          </p>
          <Link href="/game?mode=daily">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold">
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
