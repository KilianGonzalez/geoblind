'use client'

import Link from 'next/link'
import { 
  Globe, 
  Users, 
  Target, 
  Trophy, 
  Heart,
  Mail,
  Github,
  Twitter,
  Instagram,
  Sparkles,
  Zap,
  Shield,
  Gamepad2
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/use-language'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <Navbar showBackButton={true} showModeTabs={false} showLoginButton={false} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Globe className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sobre GeoBlind
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            El juego de geografía diario que desafía tu conocimiento del mundo mientras te diviertes
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16 p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra Misión</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Crear la forma más entretenida y educativa de aprender geografía. Creemos que el conocimiento 
              del mundo que nos rodea es fundamental, y hemos diseñado GeoBlind para hacer que aprender 
              sobre países, capitales y culturas sea una experiencia divertida y adictiva.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Precisión Geográfica</h3>
            <p className="text-foreground/60">
              Adivina países basándote en pistas de distancia, dirección y características geográficas
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Sistema de Puntos</h3>
            <p className="text-foreground/60">
              Gana puntos por cada acierto y compite en el ranking global con otros jugadores
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Desafíos Diarios</h3>
            <p className="text-foreground/60">
              Nuevo país cada día para mantener tu conocimiento fresco y desafiante
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Comunidad</h3>
            <p className="text-foreground/60">
              Únete a una comunidad de apasionados por la geografía de todo el mundo
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 p-8 rounded-2xl border border-border/40">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Números que Inspiran</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
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
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Cómo Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Elige un Modo</h3>
              <p className="text-foreground/60">
                Selecciona entre Diario, Infinito o Región según tu preferencia
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Usa las Pistas</h3>
              <p className="text-foreground/60">
                Analiza la distancia, dirección y características geográficas
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Adivina y Gana</h3>
              <p className="text-foreground/60">
                Haz tu intento y suma puntos para el ranking global
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Educación Divertida</h3>
                <p className="text-foreground/60 text-sm">
                  Creemos que aprender debe ser entretenido y motivador
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Accesibilidad</h3>
                <p className="text-foreground/60 text-sm">
                  Geografía para todos, sin importar el nivel de conocimiento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Comunidad</h3>
                <p className="text-foreground/60 text-sm">
                  Fomentamos el aprendizaje colaborativo y la conexión global
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
          <Gamepad2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            ¿Listo para tu primer desafío?
          </h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            Únete a miles de jugadores que ya están mejorando su conocimiento geográfico 
            mientras se divierten con GeoBlind.
          </p>
          <Link 
            href="/game?mode=daily" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Globe className="w-5 h-5" />
            Jugar Ahora
          </Link>
          <p className="mt-4 text-foreground/60 text-sm">
            ¿Listo para explorar el mundo desde tu pantalla?
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
