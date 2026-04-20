'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border/40 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground">GeoBlind</span>
            </div>
            <p className="text-foreground/60 text-sm">
              El juego de geografía diario que desafía tu conocimiento del mundo.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Juego
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/game" className="text-foreground/60 hover:text-primary transition-colors">
                  Jugar Ahora
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('howToPlay')}
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-foreground/60 hover:text-primary transition-colors">
                  Ranking Global
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Cuenta
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('signIn')}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-foreground/60 hover:text-primary transition-colors">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-foreground/60 hover:text-primary transition-colors">
                  Configuración
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Más
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 text-center text-foreground/60 text-sm">
          <p>
            © 2024 GeoBlind. Un juego de geografía diario. Hecho con{' '}
            <span className="text-red-500">red</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
