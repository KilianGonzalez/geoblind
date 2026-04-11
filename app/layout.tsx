import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeWrapper } from '@/components/ThemeWrapper'
import './globals.css'

const inter = Inter({ subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'GeoBlind — El juego de geografía diario',
  description: 'Adivina el país misterioso cada día. Recibe pistas de distancia, dirección y temperatura. ¿Puedes adivinar en menos intentos?',
  generator: 'v0.app',
  openGraph: {
    title: 'GeoBlind — El juego de geografía diario',
    description: 'Un reto de geografía nuevo cada día',
    url: 'https://geoblind.com',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
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
      <body className={`${inter.className} antialiased`}>
        <ThemeWrapper>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeWrapper>
      </body>
    </html>
  )
}
