import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })
const spaceGrotesk = localFont({
  src: [
    {
      path: '../fonts/SpaceGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/SpaceGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/SpaceGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-space-grotesk',
})

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
      <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
