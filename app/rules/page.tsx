'use client'

import Link from 'next/link'
import { ArrowRight, Compass, Globe, Lightbulb, Shield, Target, Timer, Trophy } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'

const modes = [
  {
    title: 'Diario',
    description: '1 pais al dia, 6 intentos y comparacion con ranking global.',
    icon: Target,
    tone: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/35',
  },
  {
    title: 'Infinito',
    description: 'Rondas continuas para practicar lectura espacial sin limite diario.',
    icon: Trophy,
    tone: 'from-cyan-500/20 to-cyan-500/5 border-cyan-400/35',
  },
  {
    title: 'Region',
    description: 'Entrena por continente para especializarte en zonas concretas.',
    icon: Globe,
    tone: 'from-violet-500/20 to-violet-500/5 border-violet-400/35',
  },
  {
    title: 'Contrarreloj',
    description: 'Tiempo limitado por ronda y mayor presion en cada decision.',
    icon: Timer,
    tone: 'from-amber-500/20 to-amber-500/5 border-amber-400/35',
  },
  {
    title: 'Dificil',
    description: 'Menos ayudas y menos margen de error para jugadores avanzados.',
    icon: Shield,
    tone: 'from-rose-500/20 to-rose-500/5 border-rose-400/35',
  },
]

const steps = [
  'Elige un modo y escribe un pais inicial.',
  'Analiza distancia, direccion y proximidad del intento.',
  'Ajusta tu hipotesis y repite hasta acertar.',
  'Guarda puntuacion y compite en ranking.',
]

const tips = [
  'Empieza por paises de referencia para acotar regiones rapido.',
  'Usa direccion y distancia juntas: por separado suelen enganar.',
  'Si dudas entre dos zonas, prueba fronteras o paises bisagra.',
  'Reserva las pistas IA para romper bloqueos, no en cada intento.',
]

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackButton showModeTabs={false} showLoginButton={false} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section
          className="reveal-up relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-sky-500/10 via-card to-cyan-500/10 px-5 py-12 sm:px-8 lg:px-12"
          style={{ ['--delay' as string]: '40ms' }}
        >
          <div className="float-soft pointer-events-none absolute -left-14 top-8 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="float-soft pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Compass className="h-3.5 w-3.5" />
              Guia de juego
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Reglas claras, progreso medible.</h1>
            <p className="mt-5 max-w-2xl text-sm text-foreground/75 sm:text-base lg:text-lg">
              GeoBlind premia decisiones bien razonadas. Cada intento devuelve feedback objetivo para que mejores
              partida a partida en movil, tablet y escritorio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/game?mode=daily">
                <Button className="rounded-full px-6">
                  Jugar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modes.map((mode, idx) => {
            const Icon = mode.icon
            return (
              <article
                key={mode.title}
                className={`reveal-up rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] ${mode.tone}`}
                style={{ ['--delay' as string]: `${130 + idx * 65}ms` }}
              >
                <div className="mb-3 inline-flex rounded-lg border border-border/50 bg-background/55 p-2">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <h2 className="text-lg font-semibold">{mode.title}</h2>
                <p className="mt-2 text-sm text-foreground/75">{mode.description}</p>
              </article>
            )
          })}
        </section>

        <section className="reveal-up mt-12 grid gap-4 lg:grid-cols-2" style={{ ['--delay' as string]: '300ms' }}>
          <article className="rounded-2xl border border-border/45 bg-card/45 p-5 sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-2xl font-bold">
              <Target className="h-5 w-5 text-primary" />
              Paso a paso
            </h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, idx) => (
                <li key={step} className="flex items-start gap-3 rounded-xl border border-border/45 bg-background/45 p-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-foreground/80">{step}</p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-border/45 bg-card/45 p-5 sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-2xl font-bold">
              <Lightbulb className="h-5 w-5 text-primary" />
              Estrategia
            </h2>
            <ul className="mt-4 space-y-3">
              {tips.map(tip => (
                <li key={tip} className="rounded-xl border border-border/45 bg-background/45 p-3 text-sm text-foreground/80">
                  {tip}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}
