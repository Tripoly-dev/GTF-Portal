import type { Metadata } from 'next'
import { Newsreader, Schibsted_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const display = Newsreader({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-display-raw', display: 'swap' })
const sans = Schibsted_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-sans-raw', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-mono-raw', display: 'swap' })

export const metadata: Metadata = {
  title: 'GTF Connect — B2B Travel Platform by GTF Holidays',
  description: 'The exclusive B2B travel portal for professional tour operators and travel agencies. Access Group Series Departures, White Label Solutions, and Bespoke Holidays across 5 continents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
