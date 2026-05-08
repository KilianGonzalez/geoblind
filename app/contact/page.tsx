'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bug, CheckCircle, Heart, HelpCircle, Mail, MessageSquare, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const reasons = [
  { value: 'general', label: 'Consulta general', description: 'Preguntas sobre reglas, modos o funcionamiento.', icon: MessageSquare },
  { value: 'bug', label: 'Reportar error', description: 'Comportamientos inesperados, fallos visuales o bugs.', icon: Bug },
  { value: 'suggestion', label: 'Sugerencia', description: 'Ideas para mejorar experiencia, contenido o UX.', icon: Sparkles },
  { value: 'partnership', label: 'Colaboracion', description: 'Propuestas de partnership, comunidad o integraciones.', icon: Heart },
  { value: 'support', label: 'Soporte tecnico', description: 'Problemas de cuenta o acceso que requieren ayuda.', icon: HelpCircle },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    reason: 'general',
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ reason: 'general', name: '', email: '', subject: '', message: '' })
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const selectedReason = reasons.find(item => item.value === formData.reason) ?? reasons[0]

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackButton showModeTabs={false} showLoginButton={false} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section
          className="reveal-up relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-sky-500/10 via-card to-cyan-500/10 px-5 py-12 sm:px-8 lg:px-12"
          style={{ ['--delay' as string]: '40ms' }}
        >
          <div className="float-soft pointer-events-none absolute -left-16 top-8 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="float-soft pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Mail className="h-3.5 w-3.5" />
              Contacto
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Habla con el equipo de GeoBlind.</h1>
            <p className="mt-5 max-w-2xl text-sm text-foreground/75 sm:text-base lg:text-lg">
              Envia consultas, errores o sugerencias desde una sola pantalla adaptada para cualquier dispositivo.
            </p>
          </div>
        </section>

        {isSubmitted && (
          <section className="reveal-up mt-6 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-4 sm:p-5" style={{ ['--delay' as string]: '90ms' }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 text-emerald-200">
                <CheckCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Mensaje enviado. Te responderemos en 24-48h habiles.</p>
              </div>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Volver al inicio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
          <article className="reveal-up rounded-2xl border border-border/45 bg-card/45 p-5 sm:p-6" style={{ ['--delay' as string]: '140ms' }}>
            <h2 className="text-2xl font-bold">Enviar mensaje</h2>
            <p className="mt-2 text-sm text-foreground/70">Cuanto mas contexto incluyas, mas rapido podremos ayudarte.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={onChange}
                  className="w-full rounded-lg border border-border/55 bg-background/70 px-3 py-2.5 text-sm text-foreground outline-none ring-primary/35 focus:ring-2"
                >
                  {reasons.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" value={formData.name} onChange={onChange} placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={onChange}
                  placeholder="Resumen breve del mensaje"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={7}
                  value={formData.message}
                  onChange={onChange}
                  placeholder="Explica el contexto y los pasos para reproducir el problema, si aplica."
                  className="resize-y"
                  required
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </article>

          <aside className="reveal-up space-y-4" style={{ ['--delay' as string]: '210ms' }}>
            <article className="rounded-2xl border border-border/45 bg-card/45 p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Tipo seleccionado</h3>
              <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div className="inline-flex items-center gap-2 text-primary">
                  <selectedReason.icon className="h-4 w-4" />
                  <span className="font-semibold">{selectedReason.label}</span>
                </div>
                <p className="mt-2 text-sm text-foreground/75">{selectedReason.description}</p>
              </div>
            </article>

            <article className="rounded-2xl border border-border/45 bg-card/45 p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Buenas practicas</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/75">
                <li className="rounded-lg border border-border/45 bg-background/45 p-3">Indica dispositivo y navegador cuando reportes errores.</li>
                <li className="rounded-lg border border-border/45 bg-background/45 p-3">Si un fallo ocurre en partida, describe modo y paso exacto.</li>
                <li className="rounded-lg border border-border/45 bg-background/45 p-3">Para sugerencias, cuenta el beneficio esperado para usuarios.</li>
              </ul>
            </article>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
