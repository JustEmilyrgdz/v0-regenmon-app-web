import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { PrivyProvider } from '@/components/privy-provider'

import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Regenmon: Petroleum Edition',
  description: 'Plataforma de mascota virtual petrolera con economia $OIL, chat IA y estetica retro pixel art.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
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
      <body className={`${pressStart2P.variable} ${pressStart2P.className} font-sans antialiased`} suppressHydrationWarning>
        <PrivyProvider>
          {children}
        </PrivyProvider>
      </body>
    </html>
  )
}
