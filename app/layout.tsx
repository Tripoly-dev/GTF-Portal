import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GTF Connect — B2B Travel Platform by GTF Holidays',
  description: 'The exclusive B2B travel portal for professional tour operators and travel agencies. Access Group Series Departures, White Label Solutions, and Bespoke Holidays across 5 continents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
