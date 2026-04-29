'use client'

import Link from 'next/link'
import BrandLogo from '@/components/brand-logo'
import { useLanguage } from '@/hooks/use-language'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      className="mt-16 border-t border-border/50 bg-card/20 py-12 backdrop-blur reveal-up"
      style={{ ['--delay' as string]: '120ms' }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <BrandLogo className="mb-4" size={28} />
            <p className="text-sm text-foreground/65">
              Juego diario de geografia para descubrir patrones, distancia y direccion con datos reales.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Juego</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/game" className="text-foreground/65 transition-colors hover:text-primary">Jugar ahora</Link></li>
              <li><Link href="/rules" className="text-foreground/65 transition-colors hover:text-primary">{t('howToPlay')}</Link></li>
              <li><Link href="/ranking" className="text-foreground/65 transition-colors hover:text-primary">Ranking global</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Cuenta</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth" className="text-foreground/65 transition-colors hover:text-primary">{t('signIn')}</Link></li>
              <li><Link href="/profile" className="text-foreground/65 transition-colors hover:text-primary">Mi perfil</Link></li>
              <li><Link href="/settings" className="text-foreground/65 transition-colors hover:text-primary">Configuracion</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Mas</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-foreground/65 transition-colors hover:text-primary">Sobre nosotros</Link></li>
              <li><Link href="/contact" className="text-foreground/65 transition-colors hover:text-primary">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-sm text-foreground/55">
          {'\u00A9'} {new Date().getFullYear()} GeoBlind.
        </div>
      </div>
    </footer>
  )
}
