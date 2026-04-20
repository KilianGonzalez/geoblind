'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Send, 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Heart, 
  HelpCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/use-language'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    reason: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '', reason: 'general' })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactReasons = [
    { value: 'general', label: 'Consulta general', icon: MessageSquare },
    { value: 'bug', label: 'Reportar un error', icon: Bug },
    { value: 'suggestion', label: 'Sugerencia', icon: Lightbulb },
    { value: 'partnership', label: 'Colaboración', icon: Heart },
    { value: 'support', label: 'Soporte técnico', icon: HelpCircle }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
        <Navbar showBackButton={true} showModeTabs={false} showLoginButton={false} />
        
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t('messageSent')}
            </h2>
            <p className="text-foreground/70 mb-6">
              {t('messageSentDesc')}
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Volver al inicio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <Navbar showBackButton={true} showModeTabs={false} showLoginButton={false} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contacto
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para escucharte
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="reason">Motivo de contacto</Label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {contactReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Breve descripción del motivo"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe detalladamente tu consulta o sugerencia..."
                    required
                    rows={6}
                    className="mt-2 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('sendMessage')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  ¿Cómo podemos ayudarte?
                </h3>
                <div className="space-y-4">
                  {contactReasons.map((reason) => {
                    const Icon = reason.icon
                    return (
                      <div key={reason.value} className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/30">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{reason.label}</h4>
                          <p className="text-sm text-foreground/60">
                            {reason.value === 'general' && 'Preguntas generales sobre el juego, características o funcionamiento.'}
                            {reason.value === 'bug' && '¿Algo no funciona como debería? Repórtanos errores y problemas.'}
                            {reason.value === 'suggestion' && '¿Tienes ideas para mejorar GeoBlind? ¡Queremos escucharlas!'}
                            {reason.value === 'partnership' && 'Interesado en colaboraciones, patrocinios o alianzas estratégicas.'}
                            {reason.value === 'support' && '¿Problemas técnicos con tu cuenta o el juego? Estamos para ayudarte.'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
                <h4 className="font-semibold text-foreground mb-3">Tiempo de respuesta</h4>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Nos comprometemos a responder tu mensaje dentro de las 24-48 horas hábiles. 
                  Para consultas técnicas urgentes, intentaremos responderte lo antes posible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
