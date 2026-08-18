import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GTF Connect — B2B Travel Platform by GTF Holidays',
  description: 'The exclusive B2B travel portal for professional tour operators and travel agencies. Access Group Series Departures, White Label Solutions, and Bespoke Holidays across 5 continents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
