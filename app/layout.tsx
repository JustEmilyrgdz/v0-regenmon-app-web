import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'

import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Regenmon - Tu Mascota Virtual',
  description: 'Crea y cuida a tu Regenmon, una mascota virtual estilo Tamagotchi con estetica retro pixel art.',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${pressStart2P.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
