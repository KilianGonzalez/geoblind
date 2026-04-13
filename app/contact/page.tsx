'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail,
  MessageSquare,
  Send,
  Twitter,
  Instagram,
  Github,
  MapPin,
  Clock,
  HelpCircle,
  Bug,
  Lightbulb,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/use-language'

export default function ContactPage() {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactReasons = [
    { value: 'general', label: language === 'es' ? 'Consulta general' : 'General Inquiry', icon: MessageSquare },
    { value: 'bug', label: language === 'es' ? 'Reportar un error' : 'Report a Bug', icon: Bug },
    { value: 'suggestion', label: language === 'es' ? 'Sugerencia' : 'Suggestion', icon: Lightbulb },
    { value: 'partnership', label: language === 'es' ? 'Colaboración' : 'Partnership', icon: Heart },
    { value: 'support', label: language === 'es' ? 'Soporte técnico' : 'Technical Support', icon: HelpCircle }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <Send className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {language === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!'}
          </h2>
          <p className="text-foreground/70 mb-6">
            {language === 'es' 
              ? 'Gracias por contactarnos. Te responderemos lo antes posible.'
              : 'Thank you for contacting us. We will respond as soon as possible.'
            }
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            {language === 'es' ? 'Volver al inicio' : 'Back to Home'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <Navbar showBackButton={true} showModeTabs={false} showLoginButton={false} />

      {/* Contact Content */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === 'es' ? 'Contacto' : 'Contact'}
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {language === 'es' 
              ? '¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para escucharte'
              : 'Have questions, suggestions, or need help? We are here to listen.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="p-8 rounded-2xl border border-border/40 bg-card/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Envíanos un Mensaje</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Motivo del contacto</Label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border/40 bg-background text-foreground"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona un motivo</option>
                    {contactReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos más sobre tu consulta..."
                    rows={6}
                    className="w-full p-3 rounded-lg border border-border/40 bg-background text-foreground resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="p-8 rounded-2xl border border-border/40 bg-card/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Información de Contacto</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-foreground/70">contacto@geoblind.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tiempo de respuesta</p>
                    <p className="text-foreground/70">24-48 horas laborables</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <MapPin className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ubicación</p>
                    <p className="text-foreground/70">Equipo remoto global</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="p-8 rounded-2xl border border-border/40 bg-card/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Síguenos</h2>
              
              <p className="text-foreground/70 mb-6">
                Únete a nuestra comunidad y mantente al día de las novedades
              </p>
              
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-foreground" />
                </a>
                <a 
                  href="#" 
                  className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-foreground" />
                </a>
                <a 
                  href="#" 
                  className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-foreground" />
                </a>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
              <h3 className="text-xl font-bold text-foreground mb-4">¿Necesitas ayuda rápida?</h3>
              <p className="text-foreground/70 mb-4">
                Revisa nuestras preguntas frecuentes para encontrar respuestas inmediatas.
              </p>
              <Link href="/rules" className="inline-flex items-center gap-2 text-primary hover:underline">
                <HelpCircle className="w-4 h-4" />
                Ver Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Motivos Comunes de Contacto</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactReasons.map((reason, i) => (
              <div key={i} className="p-6 rounded-xl border border-border/40 bg-card/50">
                <reason.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{reason.label}</h3>
                <p className="text-foreground/70 text-sm">
                  {reason.value === 'general' && 'Consultas generales sobre el juego, características o funcionamiento.'}
                  {reason.value === 'bug' && '¿Algo no funciona como debería? Repórtanos errores y problemas.'}
                  {reason.value === 'suggestion' && '¿Tienes ideas para mejorar GeoBlind? ¡Queremos escucharlas!'}
                  {reason.value === 'partnership' && 'Interesado en colaboraciones, patrocinios o alianzas estratégicas.'}
                  {reason.value === 'support' && '¿Problemas técnicos con tu cuenta o el juego? Estamos para ayudarte.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
