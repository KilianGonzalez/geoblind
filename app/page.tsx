'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Compass,
  Flag,
  Play,
  Shield,
  Timer,
  Trophy,
} from 'lucide-react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import BrandLogo from '@/components/brand-logo'
import { Button } from '@/components/ui/button'

const gameModes = [
  {
    title: 'Diario',
    text: 'Un objetivo por dia para comparar tu progreso con el resto.',
    href: '/game?mode=daily',
    tone: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/35',
    icon: Flag,
  },
  {
    title: 'Infinito',
    text: 'Encadena rondas para afinar lectura de distancia y direccion.',
    href: '/game?mode=infinite',
    tone: 'from-cyan-500/20 to-cyan-500/5 border-cyan-400/35',
    icon: Compass,
  },
  {
    title: 'Region',
    text: 'Practica continente por continente para especializarte.',
    href: '/game?mode=region',
    tone: 'from-violet-500/20 to-violet-500/5 border-violet-400/35',
    icon: Shield,
  },
  {
    title: 'Contrarreloj',
    text: 'Decisiones rapidas con tiempo limitado y presion real.',
    href: '/game?mode=timed',
    tone: 'from-amber-500/20 to-amber-500/5 border-amber-400/35',
    icon: Timer,
  },
  {
    title: 'Dificil',
    text: 'Menos ayudas visuales para quien ya domina el sistema.',
    href: '/game?mode=hard',
    tone: 'from-rose-500/20 to-rose-500/5 border-rose-400/35',
    icon: Trophy,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showModeTabs={false} showLoginButton />

      <main className="mx-auto max-w-7xl px-4 pb-8 pt-8 md:pt-12">
        <section className="reveal-up relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-sky-500/10 via-card to-cyan-500/10 px-5 py-14 md:px-12 md:py-16" style={{ ['--delay' as string]: '60ms' }}>
          <div className="float-soft pointer-events-none absolute -left-16 top-6 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="float-soft pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" style={{ animationDelay: '260ms' }} />

          <div className="relative z-10">
            <BrandLogo size={56} className="mb-8" />
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-foreground md:text-6xl">
              Entrena geografia con una interfaz mas clara y una pista IA util.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-foreground/75 md:text-lg">
              GeoBlind combina lectura espacial, memoria y estrategia. En cada partida recibes feedback real de tus intentos y puedes pedir orientacion al oraculo sin revelar la respuesta.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-cyan-100/90">Feedback de distancia real</span>
              <span className="rounded-full border border-emerald-300/35 bg-emerald-500/10 px-3 py-1 text-emerald-100/90">Pistas IA separadas</span>
              <span className="rounded-full border border-violet-300/35 bg-violet-500/10 px-3 py-1 text-violet-100/90">Historial y ranking reales</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/game?mode=daily">
                <Button size="lg" className="rounded-full px-7 shadow-[0_0_32px_rgba(53,224,255,0.15)]">
                  <Play className="mr-2 h-4 w-4" />
                  Jugar ahora
                </Button>
              </Link>
              <Link href="/rules">
                <Button size="lg" variant="outline" className="rounded-full px-7">
                  Ver reglas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="reveal-up rounded-2xl border border-border/50 bg-card/40 p-5 transition-all hover:border-primary/35 hover:bg-card/60 hover:shadow-[0_10px_35px_rgba(0,0,0,0.2)]" style={{ ['--delay' as string]: '140ms' }}>
            <Compass className="mb-3 h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Feedback geografico</h2>
            <p className="mt-2 text-sm text-foreground/70">Distancia, direccion y proximidad para corregir cada intento de forma objetiva.</p>
          </article>
          <article className="reveal-up rounded-2xl border border-border/50 bg-card/40 p-5 transition-all hover:border-primary/35 hover:bg-card/60 hover:shadow-[0_10px_35px_rgba(0,0,0,0.2)]" style={{ ['--delay' as string]: '210ms' }}>
            <Bot className="mb-3 h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Pistas IA separadas</h2>
            <p className="mt-2 text-sm text-foreground/70">Panel de preguntas estrategicas independiente para no mezclarlo con las respuestas.</p>
          </article>
          <article className="reveal-up rounded-2xl border border-border/50 bg-card/40 p-5 transition-all hover:border-primary/35 hover:bg-card/60 hover:shadow-[0_10px_35px_rgba(0,0,0,0.2)]" style={{ ['--delay' as string]: '280ms' }}>
            <Trophy className="mb-3 h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Perfil y ranking reales</h2>
            <p className="mt-2 text-sm text-foreground/70">Sin datos inventados: estadisticas y actividad proceden de tus sesiones guardadas.</p>
          </article>
        </section>

        <section className="reveal-up mt-12" style={{ ['--delay' as string]: '320ms' }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Modos de juego</h2>
            <Link href="/game?mode=daily" className="inline-flex items-center text-sm text-primary hover:underline">
              Abrir tablero
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {gameModes.map((mode, idx) => {
              const Icon = mode.icon
              return (
                <article
                  key={mode.title}
                  className={`reveal-up rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-1 hover:shadow-[0_12px_34px_rgba(0,0,0,0.25)] ${mode.tone}`}
                  style={{ ['--delay' as string]: `${360 + idx * 70}ms` }}
                >
                  <div className="mb-3 inline-flex rounded-lg border border-border/50 bg-background/60 p-2">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{mode.title}</h3>
                  <p className="mt-2 min-h-20 text-sm text-foreground/75">{mode.text}</p>
                  <Link href={mode.href}>
                    <Button variant="outline" className="mt-4 w-full">
                      Jugar
                    </Button>
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
