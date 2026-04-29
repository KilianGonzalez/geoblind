import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeWrapper } from '@/components/ThemeWrapper'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'GeoBlind - juego de geografia diario',
  description: 'Adivina el pais misterioso cada dia con pistas de distancia, direccion y estrategia.',
  generator: 'v0.app',
  openGraph: {
    title: 'GeoBlind - juego de geografia diario',
    description: 'Un reto de geografia nuevo cada dia',
    url: 'https://geoblind.com',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/geoblind-logo.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeWrapper>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeWrapper>
      </body>
    </html>
  )
}
