export const runtime = 'nodejs'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

Font.register({
  family: 'NotoSans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notosans/v36/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d41P6zHtY.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/notosans/v36/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A-Rd41P6zHtY.woff', fontWeight: 700 },
  ]
})

const C = {
  navy: '#06316D',
  blue: '#0d8ab1',
  skyBlue: '#2e97bc',
  grey: '#757575',
  lightGrey: '#e8e6e6',
  white: '#ffffff',
  green: '#16a34a',
}

const FONT = 'NotoSans'

const s = StyleSheet.create({
  page: { fontFamily: FONT, fontSize: 10, color: C.navy, backgroundColor: C.white },

  // Cover
  coverHero: { position: 'relative', width: '100%', height: 420 },
  coverImg: { position: 'absolute', top: 0, left: 0, width: '100%', height: 420, objectFit: 'cover' as any },
  coverOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: 420, backgroundColor: C.navy, opacity: 0.78 },
  coverHeroContent: { position: 'absolute', top: 0, left: 0, width: '100%', height: 420, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  coverRef: { fontSize: 9, color: C.skyBlue, letterSpacing: 2, fontWeight: 700 },
  coverPkgName: { fontSize: 36, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 6 },
  coverTagline: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginBottom: 0 },
  coverMetaRow: { display: 'flex', flexDirection: 'row', gap: 32 },
  coverMetaItem: { display: 'flex', flexDirection: 'column', gap: 3 },
  coverMetaLabel: { fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, fontWeight: 700 },
  coverMetaValue: { fontSize: 12, color: C.white, fontWeight: 700 },

  // Cover bottom strip
  coverStrip: { backgroundColor: C.lightGrey, padding: '18px 52px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverStripLeft: { display: 'flex', flexDirection: 'column', gap: 3 },
  coverClientLabel: { fontSize: 8, color: C.grey, letterSpacing: 1.5, fontWeight: 700 },
  coverClientName: { fontSize: 18, fontWeight: 700, color: C.navy },
  coverStripRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 },
  coverPrice: { fontSize: 22, fontWeight: 700, color: C.navy },
  coverPriceLabel: { fontSize: 8, color: C.grey, letterSpacing: 1 },

  // Page layout
  contentPage: { paddingBottom: 60 },
  pageBody: { padding: '32px 44px' },
  pageHeader: { backgroundColor: C.navy, padding: '14px 44px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageHeaderTitle: { fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: 1 },
  pageHeaderRef: { fontSize: 9, color: C.skyBlue },

  // Section label
  sectionLabel: { fontSize: 8, fontWeight: 700, color: C.blue, letterSpacing: 2, marginBottom: 14 },

  // Advisor page
  advisorGrid: { display: 'flex', flexDirection: 'row', gap: 32, marginBottom: 24 },
  advisorBox: { flex: 1, backgroundColor: C.lightGrey, padding: '18px 20px' },
  advisorRole: { fontSize: 8, fontWeight: 700, color: C.grey, letterSpacing: 1.5, marginBottom: 8 },
  advisorName: { fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4 },
  advisorAgency: { fontSize: 11, color: C.blue, marginBottom: 10 },
  advisorContact: { fontSize: 9, color: C.grey, marginBottom: 3 },
  advisorLogo: { width: 80, height: 40, objectFit: 'contain' as any, marginBottom: 10 },
  disclaimer: { fontSize: 8.5, color: C.grey, lineHeight: 1.6, borderLeft: `2px solid ${C.lightGrey}`, paddingLeft: 12 },

  // Highlights
  highlightsGrid: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  highlightItem: { width: '47%', display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  highlightDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.blue, marginTop: 4, flexShrink: 0 },
  highlightText: { fontSize: 9.5, color: C.grey, flex: 1, lineHeight: 1.4 },
  expectItem: { display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 6 },
  expectDash: { fontSize: 9.5, color: C.blue, fontWeight: 700, flexShrink: 0 },
  expectText: { fontSize: 9.5, color: C.grey, flex: 1, lineHeight: 1.4 },
  mealsRow: { display: 'flex', flexDirection: 'row', gap: 0, borderTop: `1px solid ${C.lightGrey}`, borderLeft: `1px solid ${C.lightGrey}`, marginTop: 16 },
  mealsCell: { flex: 1, padding: '10px 12px', borderRight: `1px solid ${C.lightGrey}`, borderBottom: `1px solid ${C.lightGrey}` },
  mealsCellLabel: { fontSize: 7.5, fontWeight: 700, color: C.grey, letterSpacing: 1, marginBottom: 4 },
  mealsCellValue: { fontSize: 9.5, color: C.navy, fontWeight: 700 },

  // Chapter divider
  chapterPage: { position: 'relative', width: '100%', height: '100%' },
  chapterImg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' as any },
  chapterOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: C.navy, opacity: 0.7 },
  chapterContent: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px' },
  chapterNum: { fontSize: 72, fontWeight: 700, color: 'rgba(255,255,255,0.08)', lineHeight: 1, marginBottom: -24 },
  chapterLabel: { fontSize: 9, fontWeight: 700, color: C.skyBlue, letterSpacing: 3, marginBottom: 12 },
  chapterCity: { fontSize: 42, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 8 },
  chapterNights: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

  // Day pages
  dayHeader: { display: 'flex', flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'flex-start' },
  dayCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dayCircleText: { color: C.white, fontSize: 12, fontWeight: 700 },
  dayMeta: { display: 'flex', flexDirection: 'column', gap: 2 },
  dayDate: { fontSize: 9, color: C.grey, letterSpacing: 1 },
  dayTitle: { fontSize: 15, fontWeight: 700, color: C.navy, lineHeight: 1.2 },
  dayDesc: { fontSize: 9.5, color: C.grey, lineHeight: 1.6, marginBottom: 10 },
  dayChipsRow: { display: 'flex', flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  dayChip: { fontSize: 8, color: C.blue, backgroundColor: '#E6F4F1', paddingHorizontal: 8, paddingVertical: 3 },
  dayChipGrey: { fontSize: 8, color: C.grey, backgroundColor: C.lightGrey, paddingHorizontal: 8, paddingVertical: 3 },
  dayDivider: { borderBottom: `1px solid ${C.lightGrey}`, marginVertical: 14 },

  // Hotels
  hotelRow: { display: 'flex', flexDirection: 'row', gap: 0, marginBottom: 14, border: `1px solid ${C.lightGrey}` },
  hotelImg: { width: 130, height: 90, objectFit: 'cover' as any, flexShrink: 0 },
  hotelInfo: { flex: 1, padding: '10px 14px' },
  hotelCity: { fontSize: 8, fontWeight: 700, color: C.grey, letterSpacing: 1.5, marginBottom: 4 },
  hotelName: { fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 5 },
  hotelMetaRow: { display: 'flex', flexDirection: 'row', gap: 16 },
  hotelMetaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  hotelMetaLabel: { fontSize: 7.5, color: C.grey, fontWeight: 700, letterSpacing: 0.5 },
  hotelMetaValue: { fontSize: 9, color: C.navy, fontWeight: 700 },
  hotelMealBadge: { fontSize: 8, color: C.white, backgroundColor: C.blue, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start' },

  // Inclusions
  inclRow: { display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 7 },
  inclDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.blue, marginTop: 4, flexShrink: 0 },
  exclDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#9e2233', marginTop: 4, flexShrink: 0 },
  inclText: { fontSize: 9.5, color: C.grey, flex: 1, lineHeight: 1.4 },

  // Pricing
  pricingTable: { border: `1px solid ${C.lightGrey}` },
  pricingRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.lightGrey}` },
  pricingLabel: { fontSize: 10, color: C.grey },
  pricingValue: { fontSize: 10, fontWeight: 700, color: C.navy },
  pricingTotal: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: C.navy },
  pricingTotalLabel: { fontSize: 12, fontWeight: 700, color: C.white },
  pricingTotalValue: { fontSize: 16, fontWeight: 700, color: C.white },
  agentFooter: { marginTop: 20, padding: '14px 16px', backgroundColor: C.lightGrey },
  agentFooterName: { fontSize: 10, fontWeight: 700, color: C.navy, marginBottom: 3 },
  agentFooterContact: { fontSize: 9, color: C.grey },

  // T&C
  tcTitle: { fontSize: 10, fontWeight: 700, color: C.navy, marginBottom: 6, marginTop: 12 },
  tcText: { fontSize: 8.5, color: C.grey, lineHeight: 1.6 },

  // Footer
  footer: { position: 'absolute', bottom: 18, left: 44, right: 44, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.lightGrey}`, paddingTop: 6 },
  footerLeft: { fontSize: 7, color: C.grey },
  footerRight: { fontSize: 7, color: C.grey },
})

function fmtPrice(n: number, currency = 'INR') {
  if (!n) return currency === 'INR' ? '\u20B90' : '0'
  const formatted = Math.round(n).toLocaleString('en-IN')
  if (currency === 'USD') return `$${formatted}`
  if (currency === 'EUR') return `\u20AC${formatted}`
  return `\u20B9${formatted}`
}

function fmtDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function PageFooter({ quote, agent }: { quote: any; agent: any }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>{quote.trip_name} | Proposal No: {quote.quote_number || 'N/A'}</Text>
      <Text style={s.footerRight}>{agent.agency_name} | {agent.email}</Text>
    </View>
  )
}

function PageHeaderBar({ title, quoteNumber }: { title: string; quoteNumber: string }) {
  return (
    <View style={s.pageHeader}>
      <Text style={s.pageHeaderTitle}>{title.toUpperCase()}</Text>
      <Text style={s.pageHeaderRef}>Proposal No: {quoteNumber}</Text>
    </View>
  )
}

export function ProposalPDF({ quote, agent, pkg }: { quote: any; agent: any; pkg: any }) {
  const cur = quote.currency || 'INR'
  const quoteNum = String(quote.quote_number || 'N/A')
  const heroImage = pkg?.gallery?.[0] || pkg?.img || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=85'

  // Group itinerary by destination for chapter dividers
  const destinations: { name: string; nights: number; days: any[]; image: string }[] = []
  if (pkg?.hotels) {
    let dayIdx = 0
    pkg.hotels.forEach((h: any) => {
      const days = pkg.itinerary?.slice(dayIdx, dayIdx + h.nights) || []
      destinations.push({ name: h.city, nights: h.nights, days, image: '' })
      dayIdx += h.nights
    })
    if (dayIdx < (pkg.itinerary?.length || 0)) {
      destinations[destinations.length - 1]?.days.push(...(pkg.itinerary?.slice(dayIdx) || []))
    }
  }
  const allDays = pkg?.itinerary || []

  return (
    <Document title={`${quote.trip_name} — Proposal No: ${quoteNum}`} author={agent.agency_name}>

      {/* ── PAGE 1: COVER ── */}
      <Page size="A4" style={s.page}>
        <View style={s.coverHero}>
          <Image src={heroImage} style={s.coverImg} />
          <View style={s.coverOverlay} />
          <View style={s.coverHeroContent}>
            <View>
              <Text style={s.coverRef}>TAILORED ITINERARY  |  PROPOSAL NO: {quoteNum}</Text>
            </View>
            <View>
              <Text style={s.coverPkgName}>{quote.trip_name}</Text>
              {pkg?.tagline && <Text style={s.coverTagline}>{pkg.tagline}</Text>}
            </View>
            <View style={s.coverMetaRow}>
              {[
                { l: 'TRAVEL DATES', v: fmtDate(quote.departure_date) },
                { l: 'DURATION', v: pkg ? `${pkg.nights} Nights / ${pkg.days} Days` : '' },
                { l: 'PREPARED FOR', v: quote.client_name },
                { l: 'PARTY', v: `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}` },
              ].filter(x => x.v).map(({ l, v }) => (
                <View key={l} style={s.coverMetaItem}>
                  <Text style={s.coverMetaLabel}>{l}</Text>
                  <Text style={s.coverMetaValue}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={s.coverStrip}>
          <View style={s.coverStripLeft}>
            <Text style={s.coverClientLabel}>SPECIALLY PREPARED FOR</Text>
            <Text style={s.coverClientName}>{quote.client_name}</Text>
          </View>
          <View style={s.coverStripRight}>
            <Text style={s.coverPrice}>{fmtPrice(quote.total_price, cur)}</Text>
            <Text style={s.coverPriceLabel}>TOTAL INCL. ALL TAXES  |  {fmtPrice(Math.round(quote.total_price / (quote.adults || 1)), cur)} PER ADULT</Text>
          </View>
        </View>
      </Page>

      {/* ── PAGE 2: YOUR ADVISOR ── */}
      <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
        <PageHeaderBar title="Your Advisor" quoteNumber={quoteNum} />
        <View style={s.pageBody}>
          <Text style={s.sectionLabel}>PREPARED WITH CARE</Text>
          <View style={s.advisorGrid}>
            <View style={s.advisorBox}>
              <Text style={s.advisorRole}>PREPARED FOR</Text>
              <Text style={s.advisorName}>{quote.client_name}</Text>
            </View>
            <View style={s.advisorBox}>
              <Text style={s.advisorRole}>PREPARED BY</Text>
              {agent.logo_url && <Image src={agent.logo_url} style={s.advisorLogo} />}
              <Text style={s.advisorName}>{agent.full_name}</Text>
              <Text style={s.advisorAgency}>{agent.agency_name}</Text>
              {agent.whatsapp_number && <Text style={s.advisorContact}>Tel: {agent.whatsapp_number}</Text>}
              {agent.email && <Text style={s.advisorContact}>Email: {agent.email}</Text>}
              {agent.agency_website && <Text style={s.advisorContact}>Web: {agent.agency_website}</Text>}
              {agent.agency_address && <Text style={s.advisorContact}>{agent.agency_address}</Text>}
            </View>
          </View>
          <Text style={s.disclaimer}>
            This itinerary is a preliminary proposal. Please review it carefully and inform us of any changes or discrepancies.
            Currently, no services are being held and all services and prices are subject to availability and potential currency fluctuations.
            A deposit for a booking constitutes acceptance of these Terms & Conditions.
          </Text>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ── PAGE 3: THE EXPERIENCE ── */}
      <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
        <PageHeaderBar title="The Experience" quoteNumber={quoteNum} />
        <View style={s.pageBody}>
          {pkg?.highlights?.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={s.sectionLabel}>HIGHLIGHTS</Text>
              <View style={s.highlightsGrid}>
                {pkg.highlights.map((h: string, i: number) => (
                  <View key={i} style={s.highlightItem}>
                    <View style={s.highlightDot} />
                    <Text style={s.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* What to Expect */}
          {pkg?.whatToExpect?.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={s.sectionLabel}>WHAT TO EXPECT</Text>
              {pkg.whatToExpect.map((e: string, i: number) => (
                <View key={i} style={s.expectItem}>
                  <Text style={s.expectDash}>—</Text>
                  <Text style={s.expectText}>{e}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Meals / Guide / Group size summary */}
          <View style={s.mealsRow}>
            {[
              { l: 'MEALS', v: pkg?.meals || 'As per itinerary' },
              { l: 'GUIDE LANGUAGE', v: pkg?.guideLanguage || 'English, Hindi' },
              { l: 'TOUR MANAGER', v: pkg?.tourManager || 'Included' },
              { l: 'GROUP SIZE', v: pkg?.groupSize || 'Up to 30' },
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

      {/* ── ITINERARY PAGES (grouped by destination) ── */}
      {destinations.length > 0 ? destinations.map((dest, di) => (
        <React.Fragment key={di}>
          {/* Chapter Divider */}
          <Page size="A4" style={s.page}>
            <View style={s.chapterPage}>
              <Image src={heroImage} style={s.chapterImg} />
              <View style={s.chapterOverlay} />
              <View style={s.chapterContent}>
                <Text style={s.chapterNum}>{String(di + 1).padStart(2, '0')}</Text>
                <Text style={s.chapterLabel}>CHAPTER {String(di + 1).padStart(2, '0')}</Text>
                <Text style={s.chapterCity}>{dest.name}</Text>
                <Text style={s.chapterNights}>{dest.nights} Night{dest.nights > 1 ? 's' : ''}</Text>
              </View>
            </View>
          </Page>

          {/* Day pages for this destination */}
          {dest.days.map((day: any, di2: number) => (
            <Page key={di2} size="A4" style={{ ...s.page, ...s.contentPage }}>
              <PageHeaderBar title={dest.name} quoteNumber={quoteNum} />
              <View style={s.pageBody}>
                <View style={s.dayHeader}>
                  <View style={s.dayCircle}>
                    <Text style={s.dayCircleText}>{String(day.day || di2 + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={s.dayMeta}>
                    <Text style={s.dayDate}>DAY {day.day || di2 + 1}</Text>
                    <Text style={s.dayTitle}>{day.title}</Text>
                  </View>
                </View>
                <Text style={s.dayDesc}>{day.description}</Text>
                <View style={s.dayChipsRow}>
                  {day.hotel && <Text style={s.dayChip}>Hotel: {day.hotel}</Text>}
                  {day.meals?.map((m: string, j: number) => <Text key={j} style={s.dayChipGrey}>{m}</Text>)}
                </View>
              </View>
              <PageFooter quote={quote} agent={agent} />
            </Page>
          ))}
        </React.Fragment>
      )) : (
        // Fallback: no hotel grouping — show all days on one page
        <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
          <PageHeaderBar title="Itinerary" quoteNumber={quoteNum} />
          <View style={s.pageBody}>
            {allDays.map((day: any, i: number) => (
              <View key={i} wrap={false}>
                <View style={s.dayHeader}>
                  <View style={s.dayCircle}>
                    <Text style={s.dayCircleText}>{String(day.day || i + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={s.dayMeta}>
                    <Text style={s.dayDate}>DAY {day.day || i + 1}</Text>
                    <Text style={s.dayTitle}>{day.title}</Text>
                  </View>
                </View>
                <Text style={s.dayDesc}>{day.description}</Text>
                {i < allDays.length - 1 && <View style={s.dayDivider} />}
              </View>
            ))}
          </View>
          <PageFooter quote={quote} agent={agent} />
        </Page>
      )}

      {/* ── ACCOMMODATION PAGE ── */}
      {pkg?.hotels?.length > 0 && (
        <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
          <PageHeaderBar title="Accommodation" quoteNumber={quoteNum} />
          <View style={s.pageBody}>
            <Text style={s.sectionLabel}>HOTELS & STAYS</Text>
            {pkg.hotels.map((h: any, i: number) => {
              const hotelImg = Object.entries({
                'Cairo': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg',
                'Cape Town': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg',
                'Mauritius': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg',
                'Istanbul': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ISTANBUL/WYNDHAM%20ISTANBUL%20OLD%20CITY%20HOTEL/OUTSIDE%20VIEW.avif',
                'Da Nang': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/DA%20NANG/GRAND%20GOLD%20HOTEL/OUTSIDE%20VIEW.webp',
              }).find(([city]) => h.city?.includes(city))?.[1] || heroImage

              return (
                <View key={i} style={s.hotelRow} wrap={false}>
                  <Image src={hotelImg} style={s.hotelImg} />
                  <View style={s.hotelInfo}>
                    <Text style={s.hotelCity}>{h.city?.toUpperCase()}</Text>
                    <Text style={s.hotelName}>{h.name}</Text>
                    <View style={s.hotelMetaRow}>
                      {[{ l: 'STARS', v: '★'.repeat(h.stars || 4) }, { l: 'NIGHTS', v: `${h.nights}N` }, { l: 'ROOM', v: h.roomType || 'Standard' }].map(({ l, v }) => (
                        <View key={l} style={s.hotelMetaItem}>
                          <Text style={s.hotelMetaLabel}>{l}</Text>
                          <Text style={s.hotelMetaValue}>{v}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={s.hotelMealBadge}>{h.meal}</Text>
                  </View>
                </View>
              )
            })}
            <Text style={{ fontSize: 8, color: C.grey, fontStyle: 'italic', marginTop: 8 }}>* Hotels or equivalent. Subject to availability at time of booking.</Text>
          </View>
          <PageFooter quote={quote} agent={agent} />
        </Page>
      )}

      {/* ── INCLUSIONS & EXCLUSIONS ── */}
      <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
        <PageHeaderBar title="Inclusions & Exclusions" quoteNumber={quoteNum} />
        <View style={s.pageBody}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.sectionLabel}>WHAT'S INCLUDED</Text>
              {pkg?.inclusions?.map((item: string, i: number) => (
                <View key={i} style={s.inclRow}>
                  <View style={s.inclDot} />
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...s.sectionLabel, color: '#9e2233' }}>NOT INCLUDED</Text>
              {pkg?.exclusions?.map((item: string, i: number) => (
                <View key={i} style={s.inclRow}>
                  <View style={s.exclDot} />
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ── PRICING SUMMARY ── */}
      <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
        <PageHeaderBar title="Pricing Summary" quoteNumber={quoteNum} />
        <View style={s.pageBody}>
          <Text style={s.sectionLabel}>PRICE BREAKDOWN</Text>
          <View style={s.pricingTable}>
            <View style={s.pricingRow}>
              <Text style={s.pricingLabel}>{quote.adults} Adult{quote.adults > 1 ? 's' : ''} x {fmtPrice(quote.base_price, cur)} ({quote.room_type} room)</Text>
              <Text style={s.pricingValue}>{fmtPrice((quote.base_price || 0) * (quote.adults || 1), cur)}</Text>
            </View>
            {(quote.add_ons_total || 0) > 0 && (
              <View style={s.pricingRow}>
                <Text style={s.pricingLabel}>Optional Add-ons</Text>
                <Text style={s.pricingValue}>+ {fmtPrice(quote.add_ons_total, cur)}</Text>
              </View>
            )}
            {(quote.markup_amount || 0) > 0 && (
              <View style={s.pricingRow}>
                <Text style={s.pricingLabel}>Service Charges</Text>
                <Text style={s.pricingValue}>+ {fmtPrice(quote.markup_amount, cur)}</Text>
              </View>
            )}
            <View style={s.pricingTotal}>
              <Text style={s.pricingTotalLabel}>Total (Incl. All Taxes)</Text>
              <Text style={s.pricingTotalValue}>{fmtPrice(quote.total_price, cur)}</Text>
            </View>
          </View>

          <View style={s.agentFooter}>
            <Text style={s.agentFooterName}>{agent.full_name} | {agent.agency_name}</Text>
            {agent.whatsapp_number && <Text style={s.agentFooterContact}>Tel: {agent.whatsapp_number}</Text>}
            {agent.email && <Text style={s.agentFooterContact}>Email: {agent.email}</Text>}
          </View>

          <Text style={{ ...s.tcText, marginTop: 20 }}>
            This is a preliminary proposal. All prices are subject to availability and may change without notice. A deposit constitutes acceptance of our Terms & Conditions.
          </Text>
        </View>
        <PageFooter quote={quote} agent={agent} />
      </Page>

      {/* ── T&C PAGE (condensed) ── */}
      <Page size="A4" style={{ ...s.page, ...s.contentPage }}>
        <PageHeaderBar title="Terms & Conditions" quoteNumber={quoteNum} />
        <View style={s.pageBody}>
          {[
            { t: 'PRICING & AVAILABILITY', c: 'All prices are based on current rates and subject to availability. Prices may change due to currency fluctuations, fuel surcharges, or government taxes. A deposit does not guarantee confirmation — services remain on request until confirmed in writing.' },
            { t: 'AIRFARES', c: 'Any airfares included are based on current rates and are 100% non-refundable once ticketed. Seat availability cannot be guaranteed. Passengers must provide full name, date of birth, and passport details at the time of booking.' },
            { t: 'HOTELS', c: 'Hotels are subject to availability and may be substituted with equivalent properties. Hotel locations may be outside city centres. Room sizes and configurations are approximate.' },
            { t: 'TOUR OPERATIONS', c: 'Tours operate subject to minimum passenger numbers. Itineraries, sightseeing order, hotels, and transportation may be modified due to weather, local conditions, safety concerns, or force majeure events.' },
            { t: 'CANCELLATION', c: 'Cancellation charges apply as per the cancellation policy communicated at the time of booking. No refunds for unused services, missed flights, or voluntary departure from the tour.' },
            { t: 'ACCEPTANCE', c: 'By making payment or accepting a booking confirmation, guests acknowledge they have read, understood, and accepted these Terms & Conditions in their entirety.' },
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
