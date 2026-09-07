export const runtime = 'nodejs'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path } from '@react-pdf/renderer'

// ── FONTS ─────────────────────────────────────────────────────────────────────
const BASE = 'https://gtf-portal-six.vercel.app/fonts'

Font.register({
  family: 'Archivo',
  fonts: [
    { src: `${BASE}/archivo-latin-400-normal.woff`, fontWeight: 400, fontStyle: 'normal' },
    { src: `${BASE}/archivo-latin-400-italic.woff`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${BASE}/archivo-latin-700-normal.woff`, fontWeight: 700, fontStyle: 'normal' },
    { src: `${BASE}/archivo-latin-800-normal.woff`, fontWeight: 800, fontStyle: 'normal' },
  ]
})

Font.register({
  family: 'NotoSans',
  fonts: [
    { src: `${BASE}/noto-sans-latin-400-normal.woff`, fontWeight: 400, fontStyle: 'normal' },
    { src: `${BASE}/noto-sans-latin-400-italic.woff`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${BASE}/noto-sans-latin-700-normal.woff`, fontWeight: 700, fontStyle: 'normal' },
  ]
})

// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  navy:      '#06316D',   // deep navy — headings, dark text
  blue:      '#0d8ab1',   // mid blue — accents, day numbers, teal blocks
  skyBlue:   '#2e97bc',   // sky blue — metadata on dark
  grey:      '#757575',   // body text, labels
  lightGrey: '#e8e6e6',   // dividers, light backgrounds
  white:     '#ffffff',
  green:     '#28a078',   // "Included" confirmation text
  dark:      '#1a1a2e',   // near-black for headings (Premium style)
  red:       '#9e2233',
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmtPrice(n: number, currency = 'INR') {
  if (!n && n !== 0) return currency === 'INR' ? 'Rs.0' : '0'
  const formatted = Math.round(n).toLocaleString('en-IN')
  if (currency === 'USD') return `USD ${formatted}`
  if (currency === 'EUR') return `EUR ${formatted}`
  return `Rs. ${formatted}`
}

function fmtDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Only JPEG/PNG — react-pdf cannot render WebP or AVIF
function isSafeImage(url: string) {
  return /\.(jpg|jpeg|png)$/i.test(url)
}

// Hotel gallery — all safe images per hotel
const HOTEL_GALLERY: Record<string, string[]> = {
  // GRAND TURKIYE
  'Wyndham Istanbul Old City Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ISTANBUL/WYNDHAM%20ISTANBUL%20OLD%20CITY%20HOTEL/OUTSIDE%20VIEW.avif',
  ],
  'Mercure Hotel Kızılay': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/LOBBY.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDE%20ENTRY.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/RESTAURANT.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/STANDARD%20ROOM.jpg',
  ],
  'Aleria Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/RESTAURANT.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/STANDARD%20ROOM.jpg',
  ],
  'Ring Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/DOUBLE%20ROOM.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/RESTAURANT.jpg',
  ],
  'Adempira Thermal Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/LOBBY.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/DELUXE%20ROOM.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/RESTAURANT.jpg',
  ],
  'Odelia Resort Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/LOBBY.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/STANDARD%20ROOM.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/RESTAURANT.jpg',
  ],
  // MYSTICAL EGYPT
  'Novotel 6 October Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/DINING.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/STANDARD%20ROOM.jpg',
  ],
  'Semiramis / Commodore': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/NILE%20CRUISE/SEMIRAMIS%20CRUISE/CRUISE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/NILE%20CRUISE/SEMIRAMIS%20CRUISE/INSIDE.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/NILE%20CRUISE/SEMIRAMIS%20CRUISE/ROOM%20VIEW.jpg',
  ],
  'Pharaoh Azur Hurgada': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/DINING.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/STANDARD%20POOL%20VIEW%20ROOM.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/STANDARD%20ROOM.jpg',
  ],
  // SOUTH AFRICAN SPLENDOUR
  'Cresta Grande Cape Town': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/DINING.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/STANDARD%20DOUBLE%20ROOM.jpg',
  ],
  'Diaz Hotel & Resort': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/OUTSIDE.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/DINING.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/STANDARD%20DOUBLE%20ROOM.jpg',
  ],
  'The Catalyst Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/DINING.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/STANDARD%20DOUBLE%20ROOM.jpg',
  ],
  // MAURITIAN PARADISE
  'Pearle Beach Resort & Spa': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20VIEW.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/BUDGET%20ROOM.jpg',
  ],
  // VIETNAM ESCAPES
  'Muong Thanh Saigon Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-0.jpg',
  ],
  'Grand Gold Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-4.jpg',
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-5.jpg',
  ],
  'Gloud Hotel': [
    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-6.jpg',
  ],
}

// City chapter images (JPEG/PNG only)
const CITY_IMAGES: Record<string, string> = {
  'Ho Chi Minh': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-0.jpg',
  'Da Nang':     'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-4.jpg',
  'Hanoi':       'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-5.jpg',
  'Cape Town':   'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-0.jpg',
  'Garden Route':'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-3.jpg',
  'Sun City':    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-4.jpg',
  'Johannesburg':'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-4.jpg',
  'Cairo':       'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MYSTICAL%20EGYPT/MYSTICAL%20EGYPT-0.jpg',
  'Hurghada':    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MYSTICAL%20EGYPT/MYSTICAL%20EGYPT-1.jpg',
  'Mauritius':   'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MAURITIAN%20PARADISE/MAURITIAN%20PARADISE-1.jpg',
  'Istanbul':    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-1.jpg',
  'Cappadocia':  'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-5.jpg',
  'Antalya':     'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-6.png',
  'Pamukkale':   'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-1.jpg',
  'Kusadasi':    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-1.jpg',
  'Ankara':      'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-1.jpg',
}

function getCityImage(city: string, fallback: string) {
  const match = Object.entries(CITY_IMAGES).find(([k]) => city?.includes(k))
  return match ? match[1] : fallback
}

function getHotelImages(hotelName: string, fallback: string): string[] {
  const name = hotelName.replace(/\s*\/?\s*or similar$/i, '').trim()
  const match = Object.entries(HOTEL_GALLERY).find(([k]) => name.includes(k) || k.includes(name.split(' ')[0]))
  if (match) {
    return match[1].filter(isSafeImage)
  }
  return isSafeImage(fallback) ? [fallback] : []
}

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
function IconCheck({ color = C.blue }: { color?: string }) {
  return (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={color} />
    </Svg>
  )
}
function IconClose() {
  return (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={C.red} />
    </Svg>
  )
}
function IconBed({ color = C.grey }: { color?: string }) {
  return (
    <Svg width="11" height="11" viewBox="0 0 24 24">
      <Path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill={color} />
    </Svg>
  )
}
function IconFork({ color = C.grey }: { color?: string }) {
  return (
    <Svg width="11" height="11" viewBox="0 0 24 24">
      <Path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-6.67-15.03-6.17-15.03 0h15.03zM1.02 17h15v2h-15z" fill={color} />
    </Svg>
  )
}
function IconPhone() {
  return (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill={C.blue} />
    </Svg>
  )
}
function IconEmail() {
  return (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={C.blue} />
    </Svg>
  )
}
function IconWeb() {
  return (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill={C.blue} />
    </Svg>
  )
}
function IconStar() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F59E0B" />
    </Svg>
  )
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page:       { fontFamily: 'NotoSans', fontSize: 10, color: C.dark, backgroundColor: C.white },
  pageBody:   { padding: '36px 48px', paddingBottom: 70 },

  // Footer
  footer:     { position: 'absolute', bottom: 20, left: 48, right: 48, borderTop: `1px solid ${C.lightGrey}`, paddingTop: 7, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontFamily: 'NotoSans', fontSize: 7, color: C.grey },

  // ── COVER ──
  coverHero:    { position: 'relative', width: '100%', height: 500 },
  coverImg:     { position: 'absolute', top: 0, left: 0, width: '100%', height: 500, objectFit: 'cover' as any },
  coverOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: 500, backgroundColor: 'rgba(0,0,0,0.25)' },
  coverLabel:   { fontFamily: 'NotoSans', fontSize: 8, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, fontWeight: 700 },
  coverStrip:   { backgroundColor: C.blue, padding: '32px 48px 28px' },
  coverRef:     { fontFamily: 'NotoSans', fontSize: 8, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 10 },
  coverTitle:   { fontFamily: 'Archivo', fontSize: 44, fontWeight: 800, color: C.white, lineHeight: 1.05, marginBottom: 6 },
  coverTagline: { fontFamily: 'NotoSans', fontSize: 13, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', marginBottom: 24 },
  coverMetaRow: { display: 'flex', flexDirection: 'row', gap: 40, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16 },
  coverMetaLabel: { fontFamily: 'NotoSans', fontSize: 7.5, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 },
  coverMetaValue: { fontFamily: 'Archivo', fontSize: 13, color: C.white, fontWeight: 700 },

  // ── ADVISOR ──
  advisorEyebrow: { fontFamily: 'NotoSans', fontSize: 8, color: C.blue, fontWeight: 700, letterSpacing: 2, marginBottom: 6 },
  advisorHeading: { fontFamily: 'Archivo', fontSize: 36, fontWeight: 800, color: C.dark, marginBottom: 24, lineHeight: 1.1 },
  advisorRule:    { borderBottom: `1px solid ${C.lightGrey}`, marginBottom: 20 },
  advisorGrid:    { display: 'flex', flexDirection: 'row', gap: 0, marginBottom: 28 },
  advisorCol:     { flex: 1 },
  advisorLabel:   { fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 },
  advisorName:    { fontFamily: 'Archivo', fontSize: 18, fontWeight: 700, color: C.dark, marginBottom: 4 },
  advisorAgency:  { fontFamily: 'NotoSans', fontSize: 10, color: C.grey, marginBottom: 12 },
  advisorLogo:    { width: 100, height: 40, objectFit: 'contain' as any, marginBottom: 10 },
  advisorContact: { display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 5 },
  advisorContactText: { fontFamily: 'NotoSans', fontSize: 9, color: C.grey },
  disclaimer:     { fontFamily: 'NotoSans', fontSize: 8.5, color: C.grey, lineHeight: 1.7, borderTop: `1px solid ${C.lightGrey}`, paddingTop: 16 },

  // ── EXPERIENCE ──
  expEyebrow:  { fontFamily: 'NotoSans', fontSize: 8, color: C.blue, fontWeight: 700, letterSpacing: 2, marginBottom: 8 },
  expHeading:  { fontFamily: 'Archivo', fontSize: 32, fontWeight: 800, color: C.dark, marginBottom: 20, lineHeight: 1.1 },
  hlItem:      { display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 10, width: '47%' },
  hlText:      { fontFamily: 'NotoSans', fontSize: 9.5, color: C.dark, flex: 1, lineHeight: 1.5 },
  wteHeading:  { fontFamily: 'Archivo', fontSize: 24, fontWeight: 800, color: C.dark, marginBottom: 14, marginTop: 20 },
  wteItem:     { display: 'flex', flexDirection: 'row', gap: 6, marginBottom: 6 },
  wteDash:     { fontFamily: 'NotoSans', fontSize: 9.5, color: C.blue, fontWeight: 700, flexShrink: 0 },
  wteText:     { fontFamily: 'NotoSans', fontSize: 9.5, color: C.grey, flex: 1, lineHeight: 1.4 },
  mealsTable:  { borderTop: `1px solid ${C.lightGrey}`, marginTop: 20 },
  mealRow:     { display: 'flex', flexDirection: 'row', borderBottom: `1px solid ${C.lightGrey}`, padding: '8px 0' },
  mealLabel:   { fontFamily: 'Archivo', fontSize: 9.5, fontWeight: 700, color: C.dark, width: 120 },
  mealValue:   { fontFamily: 'NotoSans', fontSize: 9.5, color: C.grey, flex: 1 },

  // ── CHAPTER ──
  chapterHero:    { position: 'relative', width: '100%', height: 500 },
  chapterImg:     { position: 'absolute', top: 0, left: 0, width: '100%', height: 500, objectFit: 'cover' as any },
  chapterOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: 500, backgroundColor: 'rgba(0,0,0,0.2)' },
  chapterStrip:   { backgroundColor: C.blue, padding: '28px 48px 24px' },
  chapterLabel:   { fontFamily: 'NotoSans', fontSize: 8, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, fontWeight: 700, marginBottom: 8 },
  chapterCity:    { fontFamily: 'Archivo', fontSize: 42, fontWeight: 800, color: C.white, lineHeight: 1.05, marginBottom: 6 },
  chapterNights:  { fontFamily: 'NotoSans', fontSize: 12, color: 'rgba(255,255,255,0.65)' },

  // ── DAY PAGES ──
  dayItem:     { display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.lightGrey}` },
  dayNumCol:   { width: 60, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  dayNum:      { fontFamily: 'Archivo', fontSize: 52, fontWeight: 800, color: C.blue, lineHeight: 1, marginBottom: 2 },
  dayWeekday:  { fontFamily: 'NotoSans', fontSize: 8, color: C.grey, fontWeight: 700, letterSpacing: 1 },
  dayDateStr:  { fontFamily: 'NotoSans', fontSize: 8, color: C.grey },
  dayContent:  { flex: 1 },
  dayTitle:    { fontFamily: 'Archivo', fontSize: 14, fontWeight: 800, color: C.dark, marginBottom: 8, lineHeight: 1.2 },
  dayDesc:     { fontFamily: 'NotoSans', fontSize: 9.5, color: C.grey, lineHeight: 1.65, marginBottom: 10 },
  dayIcons:    { display: 'flex', flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' },
  dayIconItem: { display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' },
  dayIconLabel:{ fontFamily: 'NotoSans', fontSize: 9, color: C.dark },
  dayIncluded: { fontFamily: 'NotoSans', fontSize: 9, color: C.green },

  // ── HOTELS ──
  hotelCityBar:  { backgroundColor: C.blue, padding: '10px 20px', marginBottom: 0 },
  hotelCityText: { fontFamily: 'Archivo', fontSize: 16, fontWeight: 800, color: C.white },
  hotelCityMeta: { fontFamily: 'NotoSans', fontSize: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  hotelCard:     { display: 'flex', flexDirection: 'row', border: `1px solid ${C.lightGrey}`, marginBottom: 16 },
  hotelImgCol:   { width: 180, flexShrink: 0 },
  hotelImg:      { width: 180, objectFit: 'cover' as any },
  hotelInfo:     { flex: 1, padding: '14px 18px' },
  hotelName:     { fontFamily: 'Archivo', fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 6 },
  hotelStars:    { display: 'flex', flexDirection: 'row', gap: 2, marginBottom: 10 },
  hotelMetaRow:  { display: 'flex', flexDirection: 'row', gap: 24, marginBottom: 10 },
  hotelMetaLabel:{ fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 },
  hotelMetaValue:{ fontFamily: 'Archivo', fontSize: 9.5, color: C.dark, fontWeight: 700 },
  hotelMealBadge:{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: C.blue, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  hotelMealText: { fontFamily: 'NotoSans', fontSize: 8, color: C.white },

  // ── INCLUSIONS ──
  inclEyebrow:  { fontFamily: 'NotoSans', fontSize: 8, color: C.blue, fontWeight: 700, letterSpacing: 2, marginBottom: 8 },
  inclHeading:  { fontFamily: 'Archivo', fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 20 },
  inclItem:     { display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  inclText:     { fontFamily: 'NotoSans', fontSize: 9.5, color: C.grey, flex: 1, lineHeight: 1.4 },

  // ── PRICING ──
  pricingEyebrow: { fontFamily: 'NotoSans', fontSize: 8, color: C.blue, fontWeight: 700, letterSpacing: 2, marginBottom: 8 },
  pricingHeading: { fontFamily: 'Archivo', fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 20 },
  pricingTable:   { border: `1px solid ${C.lightGrey}`, marginBottom: 24 },
  pricingRow:     { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '11px 18px', borderBottom: `1px solid ${C.lightGrey}` },
  pricingLabel:   { fontFamily: 'NotoSans', fontSize: 10, color: C.grey },
  pricingValue:   { fontFamily: 'Archivo', fontSize: 10, fontWeight: 700, color: C.dark },
  pricingTotal:   { backgroundColor: C.blue, padding: '14px 18px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pricingTotLabel:{ fontFamily: 'Archivo', fontSize: 13, fontWeight: 700, color: C.white },
  pricingTotValue:{ fontFamily: 'Archivo', fontSize: 18, fontWeight: 800, color: C.white },
  agentBox:       { backgroundColor: C.lightGrey, padding: '14px 18px', marginBottom: 16 },
  agentName:      { fontFamily: 'Archivo', fontSize: 10, fontWeight: 700, color: C.dark, marginBottom: 4 },
  agentLine:      { fontFamily: 'NotoSans', fontSize: 9, color: C.grey },

  // ── T&C ──
  tcEyebrow: { fontFamily: 'NotoSans', fontSize: 8, color: C.blue, fontWeight: 700, letterSpacing: 2, marginBottom: 8 },
  tcHeading:  { fontFamily: 'Archivo', fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 20 },
  tcTitle:    { fontFamily: 'Archivo', fontSize: 10, fontWeight: 700, color: C.dark, marginBottom: 5, marginTop: 14 },
  tcText:     { fontFamily: 'NotoSans', fontSize: 8.5, color: C.grey, lineHeight: 1.6 },
})

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Footer({ quote, agent }: { quote: any; agent: any }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{quote.trip_name}  |  Proposal No: {quote.quote_number || 'N/A'}</Text>
      <Text style={s.footerText}>{agent.agency_name}  |  {agent.email}</Text>
    </View>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function ProposalPDF({ quote, agent, pkg }: { quote: any; agent: any; pkg: any }) {
  const cur = quote.currency || 'INR'
  const qNum = String(quote.quote_number || 'N/A')

  // Safe hero image (JPEG/PNG only)
  const heroImage = (() => {
    const imgs = pkg?.gallery || []
    return imgs.find((u: string) => isSafeImage(u)) || pkg?.img || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=85'
  })()

  // Build destination chapters
  const destinations: { city: string; nights: number; days: any[] }[] = []
  if (pkg?.hotels?.length) {
    let di = 0
    pkg.hotels.forEach((h: any) => {
      const days = (pkg.itinerary || []).slice(di, di + h.nights)
      destinations.push({ city: h.city, nights: h.nights, days })
      di += h.nights
    })
    const remaining = (pkg.itinerary || []).slice(destinations.reduce((a: number, d: any) => a + d.nights, 0))
    if (remaining.length && destinations.length) {
      destinations[destinations.length - 1].days.push(...remaining)
    }
  }
  const allDays = pkg?.itinerary || []
  const totalChildren = (quote.children_with_bed || 0) + (quote.children_without_bed || 0)

  return (
    <Document title={`${quote.trip_name} — Proposal No: ${qNum}`} author={agent.agency_name}>

      {/* ════ COVER ════ */}
      <Page size="A4" style={s.page}>
        {/* Hero image — top portion */}
        <View style={s.coverHero}>
          <Image src={heroImage} style={s.coverImg} />
          <View style={s.coverOverlay} />
          {/* Label overlay top-left */}
          <View style={{ position: 'absolute', top: 28, left: 48 }}>
            <Text style={s.coverLabel}>TAILORED ITINERARY</Text>
          </View>
        </View>

        {/* Teal strip — bottom */}
        <View style={s.coverStrip}>
          <Text style={s.coverRef}>TAILORED ITINERARY  ·  PROPOSAL NO: {qNum}</Text>
          <Text style={s.coverTitle}>{quote.trip_name}</Text>
          {pkg?.tagline && <Text style={s.coverTagline}>{pkg.tagline}</Text>}
          <View style={s.coverMetaRow}>
            {[
              { l: 'TRAVEL DATES', v: fmtDate(quote.departure_date) },
              { l: 'DURATION', v: pkg ? `${pkg.nights} Nights · ${pkg.days} Days` : '' },
              { l: 'PREPARED FOR', v: quote.client_name },
              { l: 'PARTY', v: `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}${totalChildren > 0 ? ` + ${totalChildren} Child${totalChildren > 1 ? 'ren' : ''}` : ''}` },
            ].filter(x => x.v).map(({ l, v }) => (
              <View key={l}>
                <Text style={s.coverMetaLabel}>{l}</Text>
                <Text style={s.coverMetaValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* ════ YOUR ADVISOR ════ */}
      <Page size="A4" style={s.page}>
        <View style={[s.pageBody, { paddingTop: 48 }]}>
          <Text style={s.advisorEyebrow}>YOUR ADVISOR</Text>
          <Text style={s.advisorHeading}>Prepared With Care</Text>
          <View style={s.advisorRule} />
          <View style={s.advisorGrid}>
            {/* Prepared For */}
            <View style={s.advisorCol}>
              <Text style={s.advisorLabel}>PREPARED FOR</Text>
              <Text style={s.advisorName}>{quote.client_name}</Text>
            </View>
            {/* Prepared By */}
            <View style={s.advisorCol}>
              <Text style={s.advisorLabel}>PREPARED BY</Text>
              {agent.logo_url && <Image src={agent.logo_url} style={s.advisorLogo} />}
              <Text style={s.advisorName}>{agent.full_name}</Text>
              <Text style={s.advisorAgency}>{agent.agency_name}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
                {agent.whatsapp_number && (
                  <View style={s.advisorContact}>
                    <IconPhone /><Text style={s.advisorContactText}>{agent.whatsapp_number}</Text>
                  </View>
                )}
                {agent.email && (
                  <View style={s.advisorContact}>
                    <IconEmail /><Text style={s.advisorContactText}>{agent.email}</Text>
                  </View>
                )}
                {agent.agency_website && (
                  <View style={s.advisorContact}>
                    <IconWeb /><Text style={s.advisorContactText}>{agent.agency_website}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={s.advisorRule} />
          <Text style={s.disclaimer}>
            This itinerary is a preliminary proposal. Please review it carefully and inform us of any changes or discrepancies.{'\n\n'}
            Currently, no services are being held and all services and prices are subject to availability and potential currency fluctuations. A deposit for a booking constitutes acceptance of these Terms & Conditions. Please note that paying the deposit does not guarantee confirmation. Services remain On Request at the time of booking, and if the original services are unavailable, alternatives may be offered with potential price adjustments.{'\n\n'}
            Any airfares included in this quote are based on current rates and are 100% non-refundable once ticketed. To comply with regulations, we require a copy of your passport showing your full name, date of birth, and gender at time of booking.
          </Text>
        </View>
        <Footer quote={quote} agent={agent} />
      </Page>

      {/* ════ THE EXPERIENCE ════ */}
      <Page size="A4" style={s.page}>
        <View style={s.pageBody}>
          <Text style={s.expEyebrow}>THE EXPERIENCE</Text>
          <Text style={s.expHeading}>Highlights</Text>
          {/* 2-col highlights grid */}
          {pkg?.highlights?.length > 0 && (
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {pkg.highlights.map((h: string, i: number) => (
                <View key={i} style={s.hlItem}>
                  <View style={{ marginTop: 2 }}><IconCheck /></View>
                  <Text style={s.hlText}>{h}</Text>
                </View>
              ))}
            </View>
          )}

          {/* What to Expect */}
          <Text style={s.wteHeading}>What to Expect</Text>
          {pkg?.whatToExpect?.length > 0 ? (
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {pkg.whatToExpect.map((e: string, i: number) => (
                <View key={i} style={[s.wteItem, { width: '47%' }]}>
                  <Text style={s.wteDash}>—</Text>
                  <Text style={s.wteText}>{e}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={s.wteText}>Please refer to the full package details for what to expect on this tour.</Text>
          )}

          {/* Meals table */}
          <View style={s.mealsTable}>
            {[
              { l: 'Meals', v: pkg?.meals || 'As per itinerary' },
              { l: 'Guide Languages', v: pkg?.guideLanguage || 'English, Hindi' },
              { l: 'Tour Manager', v: pkg?.tourManager || 'Included' },
              { l: 'Max. Group Size', v: pkg?.groupSize || '30' },
            ].map(({ l, v }) => (
              <View key={l} style={s.mealRow}>
                <Text style={s.mealLabel}>{l}</Text>
                <Text style={s.mealValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
        <Footer quote={quote} agent={agent} />
      </Page>

      {/* ════ ITINERARY — Chapter + Days ════ */}
      {(destinations.length > 0 ? destinations : [{ city: '', nights: 0, days: allDays }]).map((dest, di) => (
        <React.Fragment key={di}>

          {/* Chapter divider */}
          {dest.city && (
            <Page size="A4" style={s.page}>
              <View style={s.chapterHero}>
                <Image src={getCityImage(dest.city, heroImage)} style={s.chapterImg} />
                <View style={s.chapterOverlay} />
              </View>
              <View style={s.chapterStrip}>
                <Text style={s.chapterLabel}>CHAPTER {String(di + 1).padStart(2, '0')}</Text>
                <Text style={s.chapterCity}>{dest.city}</Text>
                <Text style={s.chapterNights}>{dest.nights} Night{dest.nights > 1 ? 's' : ''}</Text>
              </View>
            </Page>
          )}

          {/* Day pages — multiple days per page */}
          {(() => {
            const days = dest.days
            const pages: any[][] = []
            // Group days: ~2 per page based on description length
            let current: any[] = []
            let currentChars = 0
            days.forEach((day: any) => {
              const chars = (day.description || '').length
              if (current.length >= 2 || (current.length >= 1 && currentChars + chars > 1200)) {
                pages.push(current)
                current = [day]
                currentChars = chars
              } else {
                current.push(day)
                currentChars += chars
              }
            })
            if (current.length) pages.push(current)

            return pages.map((pageDays, pi) => (
              <Page key={pi} size="A4" style={s.page}>
                <View style={s.pageBody}>
                  {pageDays.map((day: any, dj: number) => {
                    const isLast = dj === pageDays.length - 1
                    return (
                      <View key={dj} style={[s.dayItem, isLast ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : {}]} wrap={false}>
                        {/* Left: large day number */}
                        <View style={s.dayNumCol}>
                          <Text style={s.dayNum}>{String(day.day || (di * 10 + dj + 1)).padStart(2, '0')}</Text>
                          <Text style={s.dayWeekday}>{day.weekday || ''}</Text>
                          <Text style={s.dayDateStr}>{day.date || ''}</Text>
                        </View>
                        {/* Right: content */}
                        <View style={s.dayContent}>
                          <Text style={s.dayTitle}>{day.title}</Text>
                          <Text style={s.dayDesc}>{day.description}</Text>
                          <View style={s.dayIcons}>
                            {day.hotel && (
                              <View style={s.dayIconItem}>
                                <IconBed />
                                <Text style={s.dayIconLabel}>{day.hotel}</Text>
                              </View>
                            )}
                            {day.meals?.map((m: string, j: number) => (
                              <View key={j} style={s.dayIconItem}>
                                <IconFork />
                                <View>
                                  <Text style={s.dayIconLabel}>{m}</Text>
                                  <Text style={s.dayIncluded}>Included</Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>
                <Footer quote={quote} agent={agent} />
              </Page>
            ))
          })()}
        </React.Fragment>
      ))}

      {/* ════ HOTELS ════ */}
      {pkg?.hotels?.length > 0 && (() => {
        let cumNights = 0
        return pkg.hotels.map((h: any, hi: number) => {
          const checkIn = quote.departure_date
            ? new Date(new Date(quote.departure_date).getTime() + cumNights * 86400000)
            : null
          const checkOut = checkIn
            ? new Date(checkIn.getTime() + h.nights * 86400000)
            : null
          cumNights += h.nights

          const fd = (d: Date | null) => d
            ? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
            : ''

          const images = getHotelImages(h.name, heroImage)
          const stars = Math.min(h.stars || 4, 5)

          return (
            <Page key={hi} size="A4" style={s.page}>
              <View style={s.hotelCityBar}>
                <Text style={s.hotelCityText}>{h.city}</Text>
                <Text style={s.hotelCityMeta}>{h.nights} night{h.nights > 1 ? 's' : ''}</Text>
              </View>
              <View style={[s.pageBody, { paddingTop: 24 }]}>
                <View style={s.hotelCard}>
                  {/* Stacked images left */}
                  <View style={s.hotelImgCol}>
                    {images.length > 0 ? images.map((url: string, ii: number) => (
                      <Image key={ii} src={url} style={[s.hotelImg, { height: Math.min(140, 420 / images.length), marginBottom: ii < images.length - 1 ? 6 : 0 }]} />
                    )) : null}
                  </View>
                  {/* Hotel info right */}
                  <View style={s.hotelInfo}>
                    <Text style={s.hotelName}>{h.name}</Text>
                    <View style={s.hotelStars}>
                      {Array(stars).fill(null).map((_: any, si: number) => <IconStar key={si} />)}
                    </View>

                    {/* Check-in / Check-out with N nights bridge */}
                    {checkIn && (
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.hotelMetaLabel}>CHECK-IN</Text>
                          <Text style={s.hotelMetaValue}>{fd(checkIn)}</Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingTop: 14 }}>
                          <Text style={{ fontFamily: 'NotoSans', fontSize: 8, color: C.grey }}>{h.nights}N</Text>
                          <View style={{ width: 28, borderTop: `1px solid ${C.lightGrey}`, marginTop: 3 }} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.hotelMetaLabel}>CHECK-OUT</Text>
                          <Text style={s.hotelMetaValue}>{fd(checkOut)}</Text>
                        </View>
                      </View>
                    )}

                    <View style={{ marginBottom: 12 }}>
                      <Text style={s.hotelMetaLabel}>ROOM TYPE</Text>
                      <Text style={s.hotelMetaValue}>{h.roomType || 'Standard Room'}</Text>
                    </View>

                    <View style={s.hotelMealBadge}>
                      <IconFork color={C.white} />
                      <Text style={s.hotelMealText}>{h.meal}</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontFamily: 'NotoSans', fontSize: 8, color: C.grey, fontStyle: 'italic' }}>
                  * Hotels or equivalent. Subject to availability at time of booking.
                </Text>
              </View>
              <Footer quote={quote} agent={agent} />
            </Page>
          )
        })
      })()}

      {/* ════ INCLUSIONS & EXCLUSIONS ════ */}
      <Page size="A4" style={s.page}>
        <View style={s.pageBody}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 40 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.inclEyebrow}>INCLUSIONS</Text>
              <Text style={s.inclHeading}>What's{'\n'}Included</Text>
              {pkg?.inclusions?.map((item: string, i: number) => (
                <View key={i} style={s.inclItem}>
                  <View style={{ marginTop: 2 }}><IconCheck /></View>
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.inclEyebrow, { color: C.red }]}>EXCLUSIONS</Text>
              <Text style={[s.inclHeading, { color: C.red }]}>Not{'\n'}Included</Text>
              {pkg?.exclusions?.map((item: string, i: number) => (
                <View key={i} style={s.inclItem}>
                  <View style={{ marginTop: 2 }}><IconClose /></View>
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Footer quote={quote} agent={agent} />
      </Page>

      {/* ════ PRICING SUMMARY ════ */}
      <Page size="A4" style={s.page}>
        <View style={s.pageBody}>
          <Text style={s.pricingEyebrow}>INVESTMENT</Text>
          <Text style={s.pricingHeading}>Your Journey,{'\n'}Priced</Text>
          <View style={s.pricingTable}>
            <View style={s.pricingRow}>
              <Text style={s.pricingLabel}>{quote.adults} Adult{quote.adults > 1 ? 's' : ''} x {fmtPrice(quote.base_price, cur)} ({quote.room_type} room)</Text>
              <Text style={s.pricingValue}>{fmtPrice((quote.base_price || 0) * (quote.adults || 1), cur)}</Text>
            </View>
            {(quote.children_with_bed || 0) > 0 && (quote.child_with_bed_price || 0) > 0 && (
              <View style={s.pricingRow}>
                <Text style={s.pricingLabel}>{quote.children_with_bed} Child{quote.children_with_bed > 1 ? 'ren' : ''} (with bed) x {fmtPrice(quote.child_with_bed_price, cur)}</Text>
                <Text style={s.pricingValue}>{fmtPrice((quote.child_with_bed_price || 0) * (quote.children_with_bed || 0), cur)}</Text>
              </View>
            )}
            {(quote.children_without_bed || 0) > 0 && (quote.child_without_bed_price || 0) > 0 && (
              <View style={s.pricingRow}>
                <Text style={s.pricingLabel}>{quote.children_without_bed} Child{quote.children_without_bed > 1 ? 'ren' : ''} (without bed) x {fmtPrice(quote.child_without_bed_price, cur)}</Text>
                <Text style={s.pricingValue}>{fmtPrice((quote.child_without_bed_price || 0) * (quote.children_without_bed || 0), cur)}</Text>
              </View>
            )}
            {(quote.add_ons_total || 0) > 0 && (
              <View style={s.pricingRow}>
                <Text style={s.pricingLabel}>Optional Add-ons</Text>
                <Text style={s.pricingValue}>+ {fmtPrice(quote.add_ons_total, cur)}</Text>
              </View>
            )}
            <View style={s.pricingTotal}>
              <Text style={s.pricingTotLabel}>Total (Incl. All Taxes)</Text>
              <Text style={s.pricingTotValue}>{fmtPrice(quote.total_price, cur)}</Text>
            </View>
          </View>
          <View style={s.agentBox}>
            <Text style={s.agentName}>{agent.full_name}  |  {agent.agency_name}</Text>
            {agent.whatsapp_number && <Text style={s.agentLine}>Tel: {agent.whatsapp_number}</Text>}
            {agent.email && <Text style={s.agentLine}>Email: {agent.email}</Text>}
          </View>
          <Text style={{ fontFamily: 'NotoSans', fontSize: 8, color: C.grey, lineHeight: 1.5 }}>
            This is a preliminary proposal. All prices are subject to availability and may change without notice. A deposit constitutes acceptance of our Terms and Conditions.
          </Text>
        </View>
        <Footer quote={quote} agent={agent} />
      </Page>

      {/* ════ T&C ════ */}
      <Page size="A4" style={s.page}>
        <View style={s.pageBody}>
          <Text style={s.tcEyebrow}>FINE PRINT</Text>
          <Text style={s.tcHeading}>Terms &{'\n'}Conditions</Text>
          {[
            { t: 'Pricing & Availability', c: 'All prices are based on current rates and subject to availability. Prices may change due to currency fluctuations, fuel surcharges, or government taxes. A deposit does not guarantee confirmation — services remain on request until confirmed in writing.' },
            { t: 'Airfares', c: 'Any airfares included are based on current rates and are 100% non-refundable once ticketed. Seat availability cannot be guaranteed. Passengers must provide full name, date of birth, and passport details at the time of booking.' },
            { t: 'Hotels', c: 'Hotels are subject to availability and may be substituted with equivalent properties. Hotel locations may be outside city centres. Room sizes and configurations are approximate.' },
            { t: 'Tour Operations', c: 'Tours operate subject to minimum passenger numbers. Itineraries, sightseeing order, hotels, and transportation may be modified due to weather, local conditions, safety concerns, or force majeure events.' },
            { t: 'Cancellation', c: 'Cancellation charges apply as per the cancellation policy communicated at the time of booking. No refunds for unused services, missed flights, or voluntary departure from the tour.' },
            { t: 'Acceptance', c: 'By making payment or accepting a booking confirmation, guests acknowledge they have read, understood, and accepted these Terms and Conditions in their entirety.' },
          ].map(({ t, c }) => (
            <View key={t} wrap={false}>
              <Text style={s.tcTitle}>{t}</Text>
              <Text style={s.tcText}>{c}</Text>
            </View>
          ))}
        </View>
        <Footer quote={quote} agent={agent} />
      </Page>

    </Document>
  )
}
