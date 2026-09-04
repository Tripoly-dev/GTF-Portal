import {
  Document, Page, Text, View, StyleSheet, Image
} from '@react-pdf/renderer'

// Use built-in PDF fonts — no external font loading needed
const FONT = 'Helvetica'
const FONT_BOLD = 'Helvetica-Bold'

const C = {
  teal: '#0a6e5e',
  ink: '#18161a',
  inkMid: '#494540',
  inkLight: '#6b655c',
  rule: '#d6d0c5',
  bg: '#F4F8F7',
  white: '#ffffff',
  accent: '#9e2233',
}

const s = StyleSheet.create({
  page: { fontFamily: FONT, fontSize: 10, color: C.ink, backgroundColor: C.white },
  // Cover
  cover: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' },
  coverTop: { backgroundColor: C.teal, padding: '48px 52px 36px', flex: 1 },
  coverLogo: { width: 120, height: 48, objectFit: 'contain', marginBottom: 32 },
  coverPreparedFor: { fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  coverClientName: { fontSize: 36, fontWeight: 700, color: C.white, marginBottom: 40, lineHeight: 1.1 },
  coverPreparedBy: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  coverAgencyName: { fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 6 },
  coverAgentName: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  coverContact: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 3 },
  coverBottom: { backgroundColor: C.white, padding: '28px 52px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverPkgName: { fontSize: 20, fontWeight: 700, color: C.teal },
  coverPkgMeta: { fontSize: 11, color: C.inkLight, marginTop: 4 },
  coverPrice: { fontSize: 26, fontWeight: 700, color: C.ink, textAlign: 'right' },
  coverPriceLabel: { fontSize: 9, color: C.inkLight, textAlign: 'right', marginTop: 3, letterSpacing: 1 },
  // Content pages
  contentPage: { padding: '36px 44px 36px' },
  sectionLabel: { fontSize: 8, fontWeight: 700, color: C.teal, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 },
  // Summary box
  summaryBox: { backgroundColor: C.bg, padding: '16px 20px', marginBottom: 20, borderLeft: `3px solid ${C.teal}` },
  summaryRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 9, color: C.inkLight },
  summaryValue: { fontSize: 9, fontWeight: 700, color: C.ink },
  summaryTotal: { borderTop: `1px solid ${C.rule}`, paddingTop: 8, marginTop: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  summaryTotalLabel: { fontSize: 11, fontWeight: 700, color: C.ink },
  summaryTotalValue: { fontSize: 14, fontWeight: 700, color: C.teal },
  // Itinerary
  dayRow: { display: 'flex', flexDirection: 'row', gap: 12, marginBottom: 18 },
  dayCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dayNum: { color: C.white, fontSize: 11, fontWeight: 700 },
  dayContent: { flex: 1 },
  dayTitle: { fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 4 },
  dayDesc: { fontSize: 9, color: C.inkMid, lineHeight: 1.5, marginBottom: 5 },
  dayChip: { fontSize: 8, color: C.teal, backgroundColor: '#E6F4F1', paddingHorizontal: 6, paddingVertical: 2, marginRight: 4 },
  // Hotels
  hotelRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.rule}` },
  hotelCity: { fontSize: 10, fontWeight: 700, color: C.ink, marginBottom: 2 },
  hotelName: { fontSize: 9, color: C.inkMid },
  hotelNights: { fontSize: 9, color: C.inkLight },
  hotelMeal: { fontSize: 8, color: C.teal, backgroundColor: '#E6F4F1', paddingHorizontal: 6, paddingVertical: 2 },
  // Inclusions
  inclItem: { display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 6 },
  inclBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal, marginTop: 2, flexShrink: 0 },
  inclText: { fontSize: 9, color: C.inkMid, flex: 1, lineHeight: 1.4 },
  exclBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent, marginTop: 2, flexShrink: 0 },
  // Footer
  footer: { position: 'absolute', bottom: 20, left: 44, right: 44, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.rule}`, paddingTop: 8 },
  footerText: { fontSize: 7, color: C.inkLight },
  footerBrand: { fontSize: 7, color: C.teal },
  // Page header
  pageHeader: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${C.rule}` },
  pageHeaderTitle: { fontSize: 14, fontWeight: 700, color: C.teal },
  pageHeaderMeta: { fontSize: 8, color: C.inkLight },
})

function fmtPrice(n: number, currency: string) {
  if (currency === 'USD') return `$${n.toLocaleString('en-US')}`
  if (currency === 'EUR') return `€${n.toLocaleString('en-IN')}`
  return `₹${n.toLocaleString('en-IN')}`
}

function fmtDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ProposalPDF({ quote, agent, pkg }: {
  quote: any
  agent: any
  pkg: any
}) {
  const clientTotal = fmtPrice(quote.total_price, quote.currency || 'INR')
  const perAdult = fmtPrice(Math.round(quote.total_price / quote.adults), quote.currency || 'INR')

  return (
    <Document title={`${quote.trip_name} — ${agent.agency_name}`} author="GTF Holidays">

      {/* PAGE 1: Cover */}
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          <View style={s.coverTop}>
            {/* Agent logo or agency name */}
            {agent.logo_url ? (
              <Image src={agent.logo_url} style={s.coverLogo} />
            ) : (
              <Text style={{ ...s.coverAgencyName, marginBottom: 32 }}>{agent.agency_name}</Text>
            )}
            <Text style={s.coverPreparedFor}>Specially prepared for</Text>
            <Text style={s.coverClientName}>{quote.client_name}</Text>
            <Text style={s.coverPreparedBy}>Specially prepared by</Text>
            <Text style={s.coverAgencyName}>{agent.agency_name}</Text>
            <Text style={s.coverAgentName}>{agent.full_name}</Text>
            {agent.mobile && <Text style={s.coverContact}>📞 {agent.whatsapp_number || agent.mobile}</Text>}
            {agent.email && <Text style={s.coverContact}>✉ {agent.email}</Text>}
            {agent.agency_website && <Text style={s.coverContact}>🌐 {agent.agency_website}</Text>}
            {agent.agency_address && <Text style={{ ...s.coverContact, marginTop: 6 }}>{agent.agency_address}</Text>}
          </View>
          <View style={s.coverBottom}>
            <View>
              <Text style={s.coverPkgName}>{quote.trip_name}</Text>
              <Text style={s.coverPkgMeta}>
                {quote.adults} Adult{quote.adults > 1 ? 's' : ''}
                {quote.children_with_bed > 0 ? ` · ${quote.children_with_bed} Child w/ bed` : ''}
                {' · '}{quote.nights}N/{quote.days}D
                {quote.departure_date ? ` · Departing ${fmtDate(quote.departure_date)}` : ''}
              </Text>
            </View>
            <View>
              <Text style={s.coverPrice}>{clientTotal}</Text>
              <Text style={s.coverPriceLabel}>TOTAL INCL. TAXES · {perAdult}/ADULT</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2: Price Breakdown + Itinerary */}
      <Page size="A4" style={s.page}>
        <View style={s.contentPage}>
          {/* Header */}
          <View style={s.pageHeader}>
            <Text style={s.pageHeaderTitle}>{quote.trip_name}</Text>
            <Text style={s.pageHeaderMeta}>{agent.agency_name} · Ref: {quote.id?.slice(0, 8).toUpperCase()}</Text>
          </View>

          {/* Price Summary */}
          <Text style={s.sectionLabel}>Price Summary</Text>
          <View style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>{quote.adults} Adult{quote.adults > 1 ? 's' : ''} · {quote.room_type} room</Text>
              <Text style={s.summaryValue}>{fmtPrice(quote.base_price * quote.adults, quote.currency || 'INR')}</Text>
            </View>
            {quote.add_ons_total > 0 && (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Add-ons</Text>
                <Text style={s.summaryValue}>+ {fmtPrice(quote.add_ons_total, quote.currency || 'INR')}</Text>
              </View>
            )}
            {quote.markup_amount > 0 && (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Service charge</Text>
                <Text style={s.summaryValue}>+ {fmtPrice(quote.markup_amount, quote.currency || 'INR')}</Text>
              </View>
            )}
            <View style={s.summaryTotal}>
              <Text style={s.summaryTotalLabel}>Total Price (incl. all taxes)</Text>
              <Text style={s.summaryTotalValue}>{clientTotal}</Text>
            </View>
          </View>

          {/* Itinerary */}
          <Text style={s.sectionLabel}>Day-wise Itinerary</Text>
          {pkg?.itinerary?.slice(0, 6).map((day: any, i: number) => (
            <View key={i} style={s.dayRow} wrap={false}>
              <View style={s.dayCircle}>
                <Text style={s.dayNum}>{String(day.day).padStart(2, '0')}</Text>
              </View>
              <View style={s.dayContent}>
                <Text style={s.dayTitle}>{day.title}</Text>
                <Text style={s.dayDesc}>{day.description?.slice(0, 220)}{day.description?.length > 220 ? '...' : ''}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  {day.hotel && <Text style={s.dayChip}>🏨 {day.hotel}</Text>}
                  {day.meals?.map((m: string, j: number) => <Text key={j} style={s.dayChip}>🍽 {m}</Text>)}
                </View>
              </View>
            </View>
          ))}
          {pkg?.itinerary?.length > 6 && (
            <Text style={{ fontSize: 9, color: C.inkLight, fontStyle: 'italic', marginBottom: 8 }}>
              + {pkg.itinerary.length - 6} more days — see full itinerary in the package brochure.
            </Text>
          )}
        </View>
        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{quote.trip_name} · {agent.agency_name}</Text>
          <Text style={s.footerBrand}>Powered by GTF Holidays</Text>
        </View>
      </Page>

      {/* PAGE 3: Hotels + Inclusions/Exclusions */}
      <Page size="A4" style={s.page}>
        <View style={s.contentPage}>
          <View style={s.pageHeader}>
            <Text style={s.pageHeaderTitle}>{quote.trip_name}</Text>
            <Text style={s.pageHeaderMeta}>{agent.agency_name} · Ref: {quote.id?.slice(0, 8).toUpperCase()}</Text>
          </View>

          {/* Hotels */}
          {pkg?.hotels?.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={s.sectionLabel}>Accommodation</Text>
              {pkg.hotels.map((h: any, i: number) => (
                <View key={i} style={s.hotelRow} wrap={false}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.hotelCity}>{h.city}</Text>
                    <Text style={s.hotelName}>{h.name} · {'★'.repeat(h.stars)}</Text>
                    <Text style={s.hotelNights}>{h.nights} night{h.nights > 1 ? 's' : ''} · {h.roomType}</Text>
                  </View>
                  <Text style={s.hotelMeal}>{h.meal}</Text>
                </View>
              ))}
              <Text style={{ fontSize: 8, color: C.inkLight, marginTop: 8, fontStyle: 'italic' }}>
                * Hotels or equivalent. Subject to availability at time of booking.
              </Text>
            </View>
          )}

          {/* Inclusions */}
          {pkg?.inclusions?.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={s.sectionLabel}>What's Included</Text>
              {pkg.inclusions.map((item: string, i: number) => (
                <View key={i} style={s.inclItem}>
                  <View style={s.inclBullet} />
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Exclusions */}
          {pkg?.exclusions?.length > 0 && (
            <View>
              <Text style={s.sectionLabel}>Not Included</Text>
              {pkg.exclusions.map((item: string, i: number) => (
                <View key={i} style={s.inclItem}>
                  <View style={s.exclBullet} />
                  <Text style={s.inclText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={s.footer} fixed>
          <Text style={s.footerText}>This is a preliminary proposal. Prices subject to availability.</Text>
          <Text style={s.footerBrand}>Powered by GTF Holidays</Text>
        </View>
      </Page>

    </Document>
  )
}
