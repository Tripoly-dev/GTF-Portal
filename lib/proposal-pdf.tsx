export const runtime = 'nodejs'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path, Circle, Rect } from '@react-pdf/renderer'

// ── FONTS ─────────────────────────────────────────────────────────────────────
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: 'https://gtf-portal-six.vercel.app/fonts/noto-sans-latin-400-normal.woff', fontWeight: 400, fontStyle: 'normal' },
    { src: 'https://gtf-portal-six.vercel.app/fonts/noto-sans-latin-400-italic.woff', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://gtf-portal-six.vercel.app/fonts/noto-sans-latin-700-normal.woff', fontWeight: 700, fontStyle: 'normal' },
    { src: 'https://gtf-portal-six.vercel.app/fonts/noto-sans-latin-700-italic.woff', fontWeight: 700, fontStyle: 'italic' },
  ]
})

Font.register({
  family: 'Playfair',
  fonts: [
    { src: 'https://gtf-portal-six.vercel.app/fonts/playfair-display-latin-400-normal.woff', fontWeight: 400, fontStyle: 'normal' },
    { src: 'https://gtf-portal-six.vercel.app/fonts/playfair-display-latin-400-italic.woff', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://gtf-portal-six.vercel.app/fonts/playfair-display-latin-700-normal.woff', fontWeight: 700, fontStyle: 'normal' },
    { src: 'https://gtf-portal-six.vercel.app/fonts/playfair-display-latin-700-italic.woff', fontWeight: 700, fontStyle: 'italic' },
  ]
})

// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  navy:      '#06316D',
  blue:      '#0d8ab1',
  skyBlue:   '#2e97bc',
  grey:      '#757575',
  lightGrey: '#e8e6e6',
  white:     '#ffffff',
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

function starStr(n: number) {
  return Array(Math.min(n || 4, 5)).fill('*').join('')
}

// Only use JPEG/PNG images in PDF — react-pdf cannot render WebP or AVIF
const SAFE_HOTEL_IMAGES: Record<string, string> = {
  'Cairo':           'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Hurghada':        'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/OUTSIDE%20VIEW.jpg',
  'Cape Town':       'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg',
  'Garden Route':    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/OUTSIDE.jpg',
  'Johannesburg':    'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Mauritius':       'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg',
  'Ho Chi Minh City':'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/HO%20CHI%20MINH/MUONG%20THANH%20SAIGON/OUTSIDE.webp',
  'Da Nang':         'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-4.jpg',
  'Hanoi':           'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-5.jpg',
  'Cappadocia':      'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg',
  'Antalya':         'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Pamukkale':       'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Ankara':          'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg',
  'Kusadasi':        'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg',
}

function getHotelImage(city: string, fallback: string): string {
  const match = Object.entries(SAFE_HOTEL_IMAGES).find(([k]) => city?.includes(k))
  return match ? match[1] : fallback
}

// City-specific chapter images (JPEG/PNG only)
const CITY_CHAPTER_IMAGES: Record<string, string> = {
  'Ho Chi Minh City': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-0.jpg',
  'Da Nang':          'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-4.jpg',
  'Hanoi':            'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/VIETNAM%20ESCAPES/VIETNAM%20ESCAPES-5.jpg',
  'Cape Town':        'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-0.jpg',
  'Garden Route':     'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-3.jpg',
  'Johannesburg':     'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-4.jpg',
  'Cairo':            'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MYSTICAL%20EGYPT/MYSTICAL%20EGYPT-0.jpg',
  'Hurghada':         'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MYSTICAL%20EGYPT/MYSTICAL%20EGYPT-1.jpg',
  'Mauritius':        'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MAURITIAN%20PARADISE/MAURITIAN%20PARADISE-1.jpg',
  'Istanbul':         'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-1.jpg',
  'Cappadocia':       'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-5.jpg',
  'Antalya':          'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-6.png',
}

function getChapterImage(city: string, fallback: string): string {
  const match = Object.entries(CITY_CHAPTER_IMAGES).find(([k]) => city?.includes(k))
  return match ? match[1] : fallback
}

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
function IconPhone() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill={C.blue} />
    </Svg>
  )
}

function IconEmail() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={C.blue} />
    </Svg>
  )
}

function IconWeb() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill={C.blue} />
    </Svg>
  )
}

function IconLocation() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={C.blue} />
    </Svg>
  )
}

function IconBed() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill={C.grey} />
    </Svg>
  )
}

function IconMeals() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-6.67-15.03-6.17-15.03 0h15.03zM1.02 17h15v2h-15z" fill={C.grey} />
    </Svg>
  )
}

function IconCheck() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={C.blue} />
    </Svg>
  )
}

function IconClose() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24">
      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={C.red} />
    </Svg>
  )
}

function IconStar() {
  return (
    <Svg width="8" height="8" viewBox="0 0 24 24">
      <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F59E0B" />
    </Svg>
  )
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page:           { fontFamily: 'NotoSans', fontSize: 10, color: C.navy, backgroundColor: C.white },
  contentPage:    { paddingBottom: 60 },
  pageBody:       { padding: '32px 44px' },

  // Page header bar
  pageHeader:     { backgroundColor: C.navy, padding: '16px 44px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageHeaderTitle:{ fontFamily: 'Playfair', fontSize: 14, fontWeight: 700, color: C.white },
  pageHeaderRef:  { fontFamily: 'NotoSans', fontSize: 8, color: C.skyBlue },

  // Section label
  sectionLabel:   { fontFamily: 'NotoSans', fontSize: 7.5, fontWeight: 700, color: C.blue, letterSpacing: 2, marginBottom: 14 },

  // Cover
  coverHero:      { position: 'relative', width: '100%', height: 430 },
  coverImg:       { position: 'absolute', top: 0, left: 0, width: '100%', height: 430, objectFit: 'cover' as any },
  coverOverlay:   { position: 'absolute', top: 0, left: 0, width: '100%', height: 430, backgroundColor: C.navy, opacity: 0.72 },
  coverContent:   { position: 'absolute', top: 0, left: 0, width: '100%', height: 430, padding: '44px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  coverRef:       { fontFamily: 'NotoSans', fontSize: 8, color: C.skyBlue, letterSpacing: 2, fontWeight: 700 },
  coverTitle:     { fontFamily: 'Playfair', fontSize: 40, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 8 },
  coverTagline:   { fontFamily: 'Playfair', fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', marginBottom: 0 },
  coverMetaRow:   { display: 'flex', flexDirection: 'row', gap: 36 },
  coverMetaLabel: { fontFamily: 'NotoSans', fontSize: 7.5, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, fontWeight: 700, marginBottom: 3 },
  coverMetaValue: { fontFamily: 'NotoSans', fontSize: 12, color: C.white, fontWeight: 700 },

  // Cover strip
  coverStrip:     { backgroundColor: C.lightGrey, padding: '20px 52px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverClientLabel:{ fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey, letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 },
  coverClientName: { fontFamily: 'Playfair', fontSize: 20, fontWeight: 700, color: C.navy },
  coverPrice:     { fontFamily: 'NotoSans', fontSize: 24, fontWeight: 700, color: C.navy },
  coverPriceLabel:{ fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey, letterSpacing: 0.5, marginTop: 3 },

  // Advisor
  advisorGrid:    { display: 'flex', flexDirection: 'row', gap: 24, marginBottom: 24 },
  advisorBox:     { flex: 1, backgroundColor: C.lightGrey, padding: '18px 20px' },
  advisorRole:    { fontFamily: 'NotoSans', fontSize: 7.5, fontWeight: 700, color: C.grey, letterSpacing: 1.5, marginBottom: 10 },
  advisorName:    { fontFamily: 'Playfair', fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 3 },
  advisorAgency:  { fontFamily: 'NotoSans', fontSize: 10, color: C.blue, marginBottom: 10 },
  advisorContactRow:{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 4 },
  advisorContactText:{ fontFamily: 'NotoSans', fontSize: 8.5, color: C.grey },
  advisorLogo:    { width: 90, height: 36, objectFit: 'contain' as any, marginBottom: 10 },
  disclaimer:     { fontFamily: 'NotoSans', fontSize: 8, color: C.grey, lineHeight: 1.6, borderLeft: `2px solid ${C.lightGrey}`, paddingLeft: 12 },

  // Experience / Highlights
  highlightsGrid: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  highlightItem:  { width: '47%', display: 'flex', flexDirection: 'row', gap: 7, alignItems: 'flex-start' },
  highlightText:  { fontFamily: 'NotoSans', fontSize: 9, color: C.grey, flex: 1, lineHeight: 1.4 },
  mealsTable:     { display: 'flex', flexDirection: 'row', borderTop: `1px solid ${C.lightGrey}`, borderLeft: `1px solid ${C.lightGrey}`, marginTop: 16 },
  mealsCell:      { flex: 1, padding: '10px 12px', borderRight: `1px solid ${C.lightGrey}`, borderBottom: `1px solid ${C.lightGrey}` },
  mealsCellLabel: { fontFamily: 'NotoSans', fontSize: 7, fontWeight: 700, color: C.grey, letterSpacing: 1, marginBottom: 4 },
  mealsCellValue: { fontFamily: 'NotoSans', fontSize: 9, color: C.navy, fontWeight: 700 },

  // Chapter divider
  chapterPage:    { position: 'relative', width: '100%', height: '100%' },
  chapterImg:     { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' as any },
  chapterOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: C.navy, opacity: 0.68 },
  chapterContent: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px' },
  chapterBigNum:  { fontFamily: 'Playfair', fontSize: 96, fontWeight: 700, color: 'rgba(255,255,255,0.06)', lineHeight: 1, marginBottom: -28 },
  chapterLabel:   { fontFamily: 'NotoSans', fontSize: 8, fontWeight: 700, color: C.skyBlue, letterSpacing: 3, marginBottom: 14 },
  chapterCity:    { fontFamily: 'Playfair', fontSize: 48, fontWeight: 700, color: C.white, lineHeight: 1.0, marginBottom: 10 },
  chapterNights:  { fontFamily: 'NotoSans', fontSize: 13, color: 'rgba(255,255,255,0.55)' },

  // Day pages
  dayBox:         { display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 0 },
  dayCircle:      { width: 44, height: 44, borderRadius: 22, backgroundColor: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dayCircleText:  { fontFamily: 'NotoSans', fontSize: 13, fontWeight: 700, color: C.white },
  dayMeta:        { flex: 1, paddingTop: 2 },
  dayLabel:       { fontFamily: 'NotoSans', fontSize: 8, color: C.grey, letterSpacing: 1, marginBottom: 4 },
  dayTitle:       { fontFamily: 'Playfair', fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.2, marginBottom: 10 },
  dayDesc:        { fontFamily: 'NotoSans', fontSize: 9.5, color: C.grey, lineHeight: 1.65, marginBottom: 12 },
  dayFooterRow:   { display: 'flex', flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  dayChip:        { display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: '#E8F4F8', paddingHorizontal: 8, paddingVertical: 3 },
  dayChipText:    { fontFamily: 'NotoSans', fontSize: 7.5, color: C.blue },
  dayMealChip:    { display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: C.lightGrey, paddingHorizontal: 8, paddingVertical: 3 },
  dayMealText:    { fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey },

  // Hotels
  hotelCard:      { display: 'flex', flexDirection: 'row', marginBottom: 14, border: `1px solid ${C.lightGrey}` },
  hotelImg:       { width: 140, height: 96, objectFit: 'cover' as any, flexShrink: 0 },
  hotelBody:      { flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  hotelCity:      { fontFamily: 'NotoSans', fontSize: 7.5, fontWeight: 700, color: C.grey, letterSpacing: 1.5, marginBottom: 4 },
  hotelName:      { fontFamily: 'Playfair', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6 },
  hotelStarsRow:  { display: 'flex', flexDirection: 'row', gap: 2, marginBottom: 8 },
  hotelMetaRow:   { display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 8 },
  hotelMetaLabel: { fontFamily: 'NotoSans', fontSize: 7, color: C.grey, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 },
  hotelMetaValue: { fontFamily: 'NotoSans', fontSize: 9, color: C.navy, fontWeight: 700 },
  hotelMealBadge: { display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-start', backgroundColor: C.blue, paddingHorizontal: 8, paddingVertical: 3 },
  hotelMealText:  { fontFamily: 'NotoSans', fontSize: 7.5, color: C.white },

  // Inclusions
  inclRow:        { display: 'flex', flexDirection: 'row', gap: 7, marginBottom: 7, alignItems: 'flex-start' },
  inclText:       { fontFamily: 'NotoSans', fontSize: 9, color: C.grey, flex: 1, lineHeight: 1.4 },

  // Pricing
  pricingTable:   { border: `1px solid ${C.lightGrey}`, marginBottom: 20 },
  pricingRow:     { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.lightGrey}` },
  pricingLabel:   { fontFamily: 'NotoSans', fontSize: 9.5, color: C.grey },
  pricingValue:   { fontFamily: 'NotoSans', fontSize: 9.5, fontWeight: 700, color: C.navy },
  pricingTotal:   { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: C.navy },
  pricingTotLabel:{ fontFamily: 'Playfair', fontSize: 13, color: C.white },
  pricingTotValue:{ fontFamily: 'NotoSans', fontSize: 15, fontWeight: 700, color: C.white },
  agentFooter:    { backgroundColor: C.lightGrey, padding: '14px 18px', marginBottom: 16 },
  agentFooterName:{ fontFamily: 'NotoSans', fontSize: 9.5, fontWeight: 700, color: C.navy, marginBottom: 4 },
  agentFooterLine:{ fontFamily: 'NotoSans', fontSize: 8.5, color: C.grey },

  // T&C
  tcTitle:        { fontFamily: 'NotoSans', fontSize: 9.5, fontWeight: 700, color: C.navy, marginBottom: 5, marginTop: 14 },
  tcText:         { fontFamily: 'NotoSans', fontSize: 8, color: C.grey, lineHeight: 1.6 },

  // Footer
  footer:         { position: 'absolute', bottom: 18, left: 44, right: 44, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.lightGrey}`, paddingTop: 7 },
  footerLeft:     { fontFamily: 'NotoSans', fontSize: 7, color: C.grey },
  footerRight:    { fontFamily: 'NotoSans', fontSize: 7, color: C.grey },
})

// ── PAGE COMPONENTS ───────────────────────────────────────────────────────────
function PageFooter({ quote, agent }: { quote: any; agent: any }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>{quote.trip_name}  |  Proposal No: {quote.quote_number || 'N/A'}</Text>
      <Text style={s.footerRight}>{agent.agency_name}  |  {agent.email}</Text>
    </View>
  )
}

function PageHeader({ title, quoteNumber }: { title: string; quoteNumber: string }) {
  return (
    <View style={s.pageHeader}>
      <Text style={s.pageHeaderTitle}>{title}</Text>
      <Text style={s.pageHeaderRef}>Proposal No: {quoteNumber}</Text>
    </View>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function ProposalPDF({ quote, agent, pkg }: { quote: any; agent: any; pkg: any }) {
  const cur = quote.currency || 'INR'
  const qNum = String(quote.quote_number || 'N/A')

  // Pick hero image — must be JPEG or PNG (not WebP/AVIF)
  const heroImage = (() => {
    const imgs = pkg?.gallery || []
    const safe = imgs.find((u: string) => /\.(jpg|jpeg|png)$/i.test(u))
    return safe || pkg?.img || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=85'
  })()

  // Build destination chapters from hotels
  const destinations: { city: string; nights: number; days: any[] }[] = []
  if (pkg?.hotels?.length) {
    let di = 0
    pkg.hotels.forEach((h: any) => {
      const days = (pkg.itinerary || []).slice(di, di + h.nights)
      destinations.push({ city: h.city, nights: h.nights, days })
      di += h.nights
    })
    // Any remaining days go to last destination
    const remaining = (pkg.itinerary || []).slice(destinations.reduce((a: number, d: any) => a + d.nights, 0))
    if (remaining.length && destinations.length) {
      destinations[destinations.length - 1].days.push(...remaining)
    }
  }

  const allDays = pkg?.itinerary || []

  return (
    <Document title={`${quote.trip_name} — Proposal No: ${qNum}`} author={agent.agency_name}>

      {/* ════ PAGE 1 — COVER ════ */}
      <Page size="A4" style={s.page}>
        <View style={s.coverHero}>
          <Image src={heroImage} style={s.coverImg} />
          <View style={s.coverOverlay} />
          <View style={s.coverContent}>
            <Text style={s.coverRef}>TAILORED ITINERARY  |  PROPOSAL NO: {qNum}</Text>
            <View>
              <Text style={s.coverTitle}>{quote.trip_name}</Text>
              {pkg?.tagline && <Text style={s.coverTagline}>{pkg.tagline}</Text>}
            </View>
            <View style={s.coverMetaRow}>
              {[
                { l: 'TRAVEL DATES', v: fmtDate(quote.departure_date) },
                { l: 'DURATION',     v: pkg ? `${pkg.nights} Nights / ${pkg.days} Days` : '' },
                { l: 'PREPARED FOR', v: quote.client_name },
                { l: 'PARTY',        v: `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}` + ((quote.children_with_bed || 0) + (quote.children_without_bed || 0) > 0 ? ` + ${(quote.children_with_bed || 0) + (quote.children_without_bed || 0)} Child${((quote.children_with_bed || 0) + (quote.children_without_bed || 0)) > 1 ? 'ren' : ''}` : '') },
              ].filter(x => x.v).map(({ l, v }) => (
                <View key={l}>
                  <Text style={s.coverMetaLabel}>{l}</Text>
                  <Text style={s.coverMetaValue}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={s.coverStrip}>
          <View>
            <Text style={s.coverClientLabel}>SPECIALLY PREPARED FOR</Text>
            <Text style={s.coverClientName}>{quote.client_name}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.coverPrice}>{fmtPrice(quote.total_price, cur)}</Text>
            <Text style={s.coverPriceLabel}>TOTAL INCL. ALL TAXES  |  {fmtPrice(Math.round(quote.total_price / Math.max(quote.adults || 1, 1)), cur)} PER ADULT</Text>
          </View>
        </View>
      </Page>

      {/* ════ PAGE 2 — YOUR ADVISOR ════ */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader title="Your Advisor" quoteNumber={qNum} />
        <View style={s.pageBody}>
          <Text style={s.sectionLabel}>PREPARED WITH CARE</Text>
          <View style={s.advisorGrid}>
            <View style={s.advisorBox}>
              <Text style={s.advisorRole}>PREPARED FOR</Text>
              <Text style={s.advisorName}>{quote.client_name}</Text>
            </View>
            <View style={s.advisorBox}>
              <Text style={s.advisorRole}>PREPARED BY</Text>
              {agent.logo_url
                ? <Image src={agent.logo_url} style={s.advisorLogo} />
                : <Text style={[s.advisorAgency, { marginBottom: 2 }]}>{agent.agency_name}</Text>}
              <Text style={s.advisorName}>{agent.full_name}</Text>
              <Text style={[s.advisorAgency, { marginBottom: 10 }]}>{agent.agency_name}</Text>
              {agent.whatsapp_number && (
                <View style={s.advisorContactRow}>
                  <IconPhone />
                  <Text style={s.advisorContactText}>{agent.whatsapp_number}</Text>
                </View>
              )}
              {agent.email && (
                <View style={s.advisorContactRow}>
                  <IconEmail />
                  <Text style={s.advisorContactText}>{agent.email}</Text>
                </View>
              )}
              {agent.agency_website && (
                <View style={s.advisorContactRow}>
                  <IconWeb />
                  <Text style={s.advisorContactText}>{agent.agency_website}</Text>
                </View>
              )}
              {agent.agency_address && (
                <View style={s.advisorContactRow}>
                  <IconLocation />
                  <Text style={s.advisorContactText}>{agent.agency_address}</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={s.disclaimer}>
            This itinerary is a preliminary proposal. Please review it carefully and inform us of any changes or discrepancies.
            Currently, no services are being held and all services and prices are subject to availability and potential currency fluctuations.
            A deposit for a booking constitutes acceptance of these Terms and Conditions.
          </Text>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ════ PAGE 3 — THE EXPERIENCE ════ */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader title="The Experience" quoteNumber={qNum} />
        <View style={s.pageBody}>
          {pkg?.highlights?.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={s.sectionLabel}>HIGHLIGHTS</Text>
              <View style={s.highlightsGrid}>
                {pkg.highlights.map((h: string, i: number) => (
                  <View key={i} style={s.highlightItem}>
                    <View style={{ marginTop: 3 }}><IconCheck /></View>
                    <Text style={s.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View style={s.mealsTable}>
            {[
              { l: 'MEALS',          v: pkg?.meals || 'As per itinerary' },
              { l: 'GUIDE LANGUAGE', v: pkg?.guideLanguage || 'English, Hindi' },
              { l: 'TOUR MANAGER',   v: pkg?.tourManager || 'Included' },
              { l: 'GROUP SIZE',     v: pkg?.groupSize || 'Up to 30' },
            ].map(({ l, v }) => (
              <View key={l} style={s.mealsCell}>
                <Text style={s.mealsCellLabel}>{l}</Text>
                <Text style={s.mealsCellValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ════ ITINERARY — Chapter Dividers + Day Pages ════ */}
      {(destinations.length > 0 ? destinations : [{ city: '', nights: 0, days: allDays }]).map((dest, di) => (
        <React.Fragment key={di}>
          {/* Chapter Divider */}
          {dest.city && (
            <Page size="A4" style={s.page}>
              <View style={s.chapterPage}>
                <Image src={getChapterImage(dest.city, heroImage)} style={s.chapterImg} />
                <View style={s.chapterOverlay} />
                <View style={s.chapterContent}>
                  <Text style={s.chapterBigNum}>{String(di + 1).padStart(2, '0')}</Text>
                  <Text style={s.chapterLabel}>CHAPTER {String(di + 1).padStart(2, '0')}</Text>
                  <Text style={s.chapterCity}>{dest.city}</Text>
                  <Text style={s.chapterNights}>{dest.nights} Night{dest.nights > 1 ? 's' : ''}</Text>
                </View>
              </View>
            </Page>
          )}

          {/* Day Pages */}
          {dest.days.map((day: any, d2: number) => (
            <Page key={d2} size="A4" style={[s.page, s.contentPage]}>
              <PageHeader title={dest.city || 'Itinerary'} quoteNumber={qNum} />
              <View style={s.pageBody}>
                <View style={s.dayBox}>
                  <View style={s.dayCircle}>
                    <Text style={s.dayCircleText}>{String(day.day || d2 + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={s.dayMeta}>
                    <Text style={s.dayLabel}>DAY {day.day || d2 + 1}</Text>
                    <Text style={s.dayTitle}>{day.title}</Text>
                    <Text style={s.dayDesc}>{day.description}</Text>
                    <View style={s.dayFooterRow}>
                      {day.hotel && (
                        <View style={s.dayChip}>
                          <IconBed />
                          <Text style={s.dayChipText}>{day.hotel}</Text>
                        </View>
                      )}
                      {day.meals?.map((m: string, j: number) => (
                        <View key={j} style={s.dayMealChip}>
                          <IconMeals />
                          <Text style={s.dayMealText}>{m}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              <PageFooter quote={quote} agent={agent} />
            </Page>
          ))}
        </React.Fragment>
      ))}

      {/* ════ ACCOMMODATION ════ */}
      {pkg?.hotels?.length > 0 && (
        <Page size="A4" style={[s.page, s.contentPage]}>
          <PageHeader title="Accommodation" quoteNumber={qNum} />
          <View style={s.pageBody}>
            <Text style={s.sectionLabel}>HOTELS & STAYS</Text>
            {pkg.hotels.map((h: any, i: number) => {
              const imgUrl = getHotelImage(h.city, heroImage)
              const stars = Math.min(h.stars || 4, 5)
              return (
                <View key={i} style={s.hotelCard} wrap={false}>
                  <Image src={imgUrl} style={s.hotelImg} />
                  <View style={s.hotelBody}>
                    <Text style={s.hotelCity}>{(h.city || '').toUpperCase()}</Text>
                    <Text style={s.hotelName}>{h.name}</Text>
                    <View style={s.hotelStarsRow}>
                      {Array(stars).fill(null).map((_, si) => <IconStar key={si} />)}
                    </View>
                    <View style={s.hotelMetaRow}>
                      {[{ l: 'NIGHTS', v: `${h.nights}N` }, { l: 'ROOM TYPE', v: h.roomType || 'Standard' }].map(({ l, v }) => (
                        <View key={l}>
                          <Text style={s.hotelMetaLabel}>{l}</Text>
                          <Text style={s.hotelMetaValue}>{v}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={s.hotelMealBadge}>
                      <IconMeals />
                      <Text style={s.hotelMealText}>{h.meal}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
            <Text style={{ fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey, fontStyle: 'italic', marginTop: 6 }}>
              * Hotels or equivalent. Subject to availability at time of booking.
            </Text>
          </View>
          <PageFooter quote={quote} agent={agent} />
        </Page>
      )}

      {/* ════ INCLUSIONS & EXCLUSIONS ════ */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader title="Inclusions & Exclusions" quoteNumber={qNum} />
        <View style={s.pageBody}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.sectionLabel}>WHAT'S INCLUDED</Text>
              {pkg?.inclusions?.map((item: string, i: number) => (
                <View key={i} style={s.inclRow}>
                  <View style={{ marginTop: 2 }}><IconCheck /></View>
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.sectionLabel, { color: C.red }]}>NOT INCLUDED</Text>
              {pkg?.exclusions?.map((item: string, i: number) => (
                <View key={i} style={s.inclRow}>
                  <View style={{ marginTop: 2 }}><IconClose /></View>
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ════ PRICING SUMMARY ════ */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader title="Pricing Summary" quoteNumber={qNum} />
        <View style={s.pageBody}>
          <Text style={s.sectionLabel}>PRICE BREAKDOWN</Text>
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
          <View style={s.agentFooter}>
            <Text style={s.agentFooterName}>{agent.full_name}  |  {agent.agency_name}</Text>
            {agent.whatsapp_number && <Text style={s.agentFooterLine}>Tel: {agent.whatsapp_number}</Text>}
            {agent.email && <Text style={s.agentFooterLine}>Email: {agent.email}</Text>}
          </View>
          <Text style={{ fontFamily: 'NotoSans', fontSize: 7.5, color: C.grey, lineHeight: 1.5 }}>
            This is a preliminary proposal. All prices are subject to availability and may change without notice. A deposit constitutes acceptance of our Terms and Conditions.
          </Text>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ════ T&C ════ */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader title="Terms & Conditions" quoteNumber={qNum} />
        <View style={s.pageBody}>
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
        <PageFooter quote={quote} agent={agent} />
      </Page>

    </Document>
  )
}
