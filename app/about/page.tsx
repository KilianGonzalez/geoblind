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
  const { language } = useLanguage()
  
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
            {language === 'es' ? 'Sobre GeoBlind' : 'About GeoBlind'}
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {language === 'es' 
              ? 'El juego de geografía diario que desafía tu conocimiento del mundo mientras te diviertes'
              : 'The daily geography game that challenges your world knowledge while having fun'
            }
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16 p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra Misión</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Crear la forma más entretenida y educativa de aprender geografía. Creemos que el conocimiento 
              del mundo que nos rodea es fundamental, y hemos diseñado GeoBlind para hacer que aprender 
              sobre países, capitales y culturas sea una experiencia diaria emocionante y gratificante.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Impacto Global</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-foreground/70">Jugadores activos</div>
            </div>
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">50M+</div>
              <div className="text-foreground/70">Partidas jugadas</div>
            </div>
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">195</div>
              <div className="text-foreground/70">Países disponibles</div>
            </div>
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">150+</div>
              <div className="text-foreground/70">Países con jugadores</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Características Únicas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/50">
              <Target className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Sistema de Pistas Inteligente</h3>
              <p className="text-foreground/70">
                Distancia, dirección y temperatura para guiarte hacia la respuesta correcta.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/50">
              <Gamepad2 className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Múltiples Modos de Juego</h3>
              <p className="text-foreground/70">
                Diario, infinito, por región, contrarreloj y modo difícil para todos los gustos.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/50">
              <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Sistema de Rankings</h3>
              <p className="text-foreground/70">
                Compite con jugadores de todo el mundo y sube en la tabla de posiciones.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/50">
              <Sparkles className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Diseño Moderno</h3>
              <p className="text-foreground/70">
                Interfaz elegante y responsive con tema oscuro/claro y animaciones suaves.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/50">
              <Zap className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Jugabilidad Rápida</h3>
              <p className="text-foreground/70">
                Partidas rápidas de 5-10 minutos perfectas para un descanso mental.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/50">
              <Shield className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">100% Gratuito</h3>
              <p className="text-foreground/70">
                Sin anuncios molestos, sin compras obligatorias. Solo diversión pura.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Nuestra Historia</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">2023 - La Idea</h3>
                <p className="text-foreground/70">
                  GeoBlind nació de una simple idea: hacer que aprender geografía sea tan divertido 
                  como un videojuego. Nuestro fundador, apasionado por los viajes y la cultura, 
                  quería crear una forma diaria de mantener agudo el conocimiento geográfico.
                </p>
              </div>
              
              <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">2024 - El Lanzamiento</h3>
                <p className="text-foreground/70">
                  Después de meses de desarrollo y pruebas, lanzamos GeoBlind con 24 países y 
                  un único modo de juego. La respuesta de la comunidad fue increíble, superando 
                  todas nuestras expectativas.
                </p>
              </div>
              
              <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">2025 - El Crecimiento</h3>
                <p className="text-foreground/70">
                  Hoy somos una comunidad global de más de un millón de jugadores, con 195 países, 
                  múltiples modos de juego y funciones sociales. Pero seguimos siendo el mismo 
                  proyecto apasionado que busca hacer del aprendizaje una aventura diaria.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-ocean to-earth-teal/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="w-48 h-48 text-primary/20" />
                </div>
                <div className="absolute inset-0 rounded-full" style={{
                  boxShadow: '0 0 80px rgba(0, 212, 255, 0.3)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Nuestro Equipo</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <h3 className="font-semibold text-foreground mb-1">Juan Developer</h3>
              <p className="text-foreground/70 text-sm mb-2">Fundador & Lead Developer</p>
              <p className="text-foreground/60 text-sm">
                Apasionado por la geografía y los juegos educativos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                MD
              </div>
              <h3 className="font-semibold text-foreground mb-1">María Designer</h3>
              <p className="text-foreground/70 text-sm mb-2">UX/UI Designer</p>
              <p className="text-foreground/60 text-sm">
                Creando experiencias visuales increíbles
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                CG
              </div>
              <h3 className="font-semibold text-foreground mb-1">Carlos Geo</h3>
              <p className="text-foreground/70 text-sm mb-2">Content Specialist</p>
              <p className="text-foreground/60 text-sm">
                Experto en geografía y datos culturales
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Pasión</h3>
              <p className="text-foreground/70 text-sm">
                Amamos lo que hacemos y se nota en cada detalle
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Comunidad</h3>
              <p className="text-foreground/70 text-sm">
                Construimos juntos una experiencia mejor cada día
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Calidad</h3>
              <p className="text-foreground/70 text-sm">
                Nos esforzamos por la excelencia en todo
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-border/40 bg-card/50 text-center">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Innovación</h3>
              <p className="text-foreground/70 text-sm">
                Siempre buscando nuevas formas de aprender
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Conecta Con Nosotros</h2>
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl border border-border/40 bg-card/50 text-center">
              <p className="text-foreground/70 mb-6">
                ¿Tienes ideas, sugerencias o simplemente quieres saludar? ¡Nos encantaría saber de ti!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors justify-center">
                  <Mail className="w-4 h-4" />
                  Envíanos un mensaje
                </Link>
                <div className="flex gap-2">
                  <a href="#" className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors">
                    <Twitter className="w-5 h-5 text-foreground" />
                  </a>
                  <a href="#" className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors">
                    <Instagram className="w-5 h-5 text-foreground" />
                  </a>
                  <a href="#" className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors">
                    <Github className="w-5 h-5 text-foreground" />
                  </a>
                </div>
              </div>
              
              <div className="text-sm text-foreground/60">
                <p>contacto@geoblind.com</p>
                <p>Respuesta en 24-48 horas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/game"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Globe className="w-5 h-5" />
            Únete a la Aventura
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
