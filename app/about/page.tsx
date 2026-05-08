'use client'

import Link from 'next/link'
import { ArrowRight, Compass, Globe, Shield, Sparkles, Target, Trophy, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'

const pillars = [
  {
    title: 'Feedback util',
    description: 'Cada intento devuelve distancia, direccion y proximidad para iterar con criterio.',
    icon: Target,
    tone: 'from-cyan-500/20 to-cyan-500/5 border-cyan-400/35',
  },
  {
    title: 'Juego diario',
    description: 'Un nuevo reto cada dia para mantener ritmo y compararte en ranking.',
    icon: Trophy,
    tone: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/35',
  },
  {
    title: 'Comunidad global',
    description: 'Jugadores de distintas regiones con progreso real y estadisticas guardadas.',
    icon: Users,
    tone: 'from-violet-500/20 to-violet-500/5 border-violet-400/35',
  },
]

const values = [
  {
    title: 'Aprendizaje aplicado',
    description: 'Disenamos mecanicas para convertir intuicion geografica en decisiones concretas.',
    icon: Compass,
  },
  {
    title: 'Accesibilidad',
    description: 'Interfaz clara, tipografia legible y controles adaptados para movil y escritorio.',
    icon: Shield,
  },
  {
    title: 'Iteracion continua',
    description: 'Mejoramos el producto con feedback de usuarios y metricas de uso reales.',
    icon: Sparkles,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackButton showModeTabs={false} showLoginButton={false} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section
          className="reveal-up relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-sky-500/10 via-card to-cyan-500/10 px-5 py-12 sm:px-8 lg:px-12"
          style={{ ['--delay' as string]: '40ms' }}
        >
          <div className="float-soft pointer-events-none absolute -left-16 top-8 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
          <div
            className="float-soft pointer-events-none absolute -right-14 bottom-2 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
            style={{ animationDelay: '240ms' }}
          />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Globe className="h-3.5 w-3.5" />
              Sobre el proyecto
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              GeoBlind nace para entrenar geografia con datos reales y ritmo de juego.
            </h1>
            <p className="mt-5 max-w-2xl text-sm text-foreground/75 sm:text-base lg:text-lg">
              Combinamos una interfaz clara, pistas accionables y modos con objetivos distintos para que aprender
              geografia sea constante, medible y entretenido.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/game?mode=daily">
                <Button className="rounded-full px-6">
                  Empezar partida
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/rules">
                <Button variant="outline" className="rounded-full px-6">
                  Ver reglas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <article
                key={pillar.title}
                className={`reveal-up rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.22)] ${pillar.tone}`}
                style={{ ['--delay' as string]: `${120 + idx * 70}ms` }}
              >
                <div className="mb-3 inline-flex rounded-lg border border-border/50 bg-background/55 p-2">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold">{pillar.title}</h2>
                <p className="mt-2 text-sm text-foreground/75">{pillar.description}</p>
              </article>
            )
          })}
        </section>

        <section className="reveal-up mt-12 rounded-2xl border border-border/45 bg-card/45 p-5 sm:p-7" style={{ ['--delay' as string]: '290ms' }}>
          <h2 className="text-2xl font-bold">Como trabajamos</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="rounded-xl border border-border/45 bg-background/45 p-4">
                  <div className="mb-3 inline-flex rounded-lg border border-border/50 bg-card/70 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{value.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
