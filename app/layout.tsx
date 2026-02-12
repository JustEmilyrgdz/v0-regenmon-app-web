import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { OilTowerBg } from '@/components/oil-tower-bg'

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
  themeColor: '#000000',
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
      <head>
        <link
          href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${pressStart2P.variable} ${pressStart2P.className} font-sans antialiased`}>
        <OilTowerBg />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
