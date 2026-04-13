'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function Footer() {
  const { language, t } = useLanguage()

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
              {language === 'es' 
                ? 'El juego de geografía diario que desafía tu conocimiento del mundo.'
                : 'The daily geography game that challenges your world knowledge.'
              }
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === 'es' ? 'Juego' : 'Game'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/game" className="text-foreground/60 hover:text-primary transition-colors">
                  {language === 'es' ? 'Jugar Ahora' : 'Play Now'}
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('howToPlay')}
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-foreground/60 hover:text-primary transition-colors">
                  {language === 'es' ? 'Ranking Global' : 'Global Ranking'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === 'es' ? 'Cuenta' : 'Account'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('signIn')}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-foreground/60 hover:text-primary transition-colors">
                  {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-foreground/60 hover:text-primary transition-colors">
                  {language === 'es' ? 'Configuración' : 'Settings'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === 'es' ? 'Más' : 'More'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">
                  {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                  {language === 'es' ? 'Contacto' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 text-center text-foreground/60 text-sm">
          <p>
            {language === 'es' 
              ? '© 2024 GeoBlind. Un juego de geografía diario. Hecho con'
              : '© 2024 GeoBlind. A daily geography game. Made with'
            }{' '}
            <span className="text-red-500">red</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
