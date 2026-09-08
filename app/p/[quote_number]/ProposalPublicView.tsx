'use client'
import { useState } from 'react'
import type { Package } from '@/data/packages'

const C = {
  navy: '#06316D',
  teal: '#0d8ab1',
  grey: '#757575',
  green: '#28a078',
  divider: '#e8e6e6',
}

const fmtPrice = (n: number, cur = 'INR') => {
  if (!n) return cur === 'USD' ? '$0' : cur === 'EUR' ? '€0' : '₹0'
  const amt = Math.round(n).toLocaleString('en-IN')
  if (cur === 'USD') return `$${amt}`
  if (cur === 'EUR') return `€${amt}`
  return `₹${amt}`
}

const fmtDate = (d: string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

type Quote = {
  id: string; trip_name: string; departure_date: string; adults: number
  children_with_bed: number; children_without_bed: number
  base_price: number; child_with_bed_price: number; child_without_bed_price: number
  total_price: number; currency: string
}
type Agent = {
  full_name: string; agency_name: string; logo_url: string | null
  mobile: string; email: string; whatsapp_number: string | null
}

const TABS = ['Itinerary', 'Hotels', 'Inclusions'] as const

export default function ProposalPublicView({ quote, agent, pkg }: { quote: Quote; agent: Agent; pkg: Package }) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Itinerary')

  const cur = quote.currency || 'INR'
  const totalChildren = (quote.children_with_bed || 0) + (quote.children_without_bed || 0)
  const paxStr = `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}${totalChildren > 0 ? ` + ${totalChildren} Child${totalChildren > 1 ? 'ren' : ''}` : ''}`
  const heroImg = pkg.gallery?.[0] || pkg.img || ''

  const whatsappHref = agent.whatsapp_number
    ? `https://wa.me/${agent.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I have a query about my travel proposal.')}`
    : null

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'NotoSans', Arial, sans-serif", color: C.navy }}>
      <style>{`
        @font-face { font-family: 'Archivo'; src: url('/fonts/archivo-latin-400-normal.woff') format('woff'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'Archivo'; src: url('/fonts/archivo-latin-700-normal.woff') format('woff'); font-weight: 700; font-style: normal; }
        @font-face { font-family: 'Archivo'; src: url('/fonts/archivo-latin-800-normal.woff') format('woff'); font-weight: 800; font-style: normal; }
        @font-face { font-family: 'Playfair Display'; src: url('/fonts/playfair-display-latin-400-normal.woff') format('woff'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'Playfair Display'; src: url('/fonts/playfair-display-latin-700-normal.woff') format('woff'); font-weight: 700; font-style: normal; }
        @font-face { font-family: 'NotoSans'; src: url('/fonts/noto-sans-latin-400-normal.woff') format('woff'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'NotoSans'; src: url('/fonts/noto-sans-latin-700-normal.woff') format('woff'); font-weight: 700; font-style: normal; }

        .pp-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .pp-panel { position: sticky; top: 84px; }
        .pp-tabs { display: flex; gap: 0; overflow-x: auto; }
        @media (max-width: 860px) {
          .pp-grid { grid-template-columns: 1fr; }
          .pp-panel { position: static; }
        }
      `}</style>

      {/* Top bar — agent branding only */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${C.divider}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {agent.logo_url && <img src={agent.logo_url} alt={agent.agency_name} style={{ height: 32, width: 'auto', objectFit: 'contain' }} />}
        <span style={{ fontFamily: "'Archivo', Arial, sans-serif", fontWeight: 700, fontSize: 15, color: C.navy }}>{agent.agency_name}</span>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
        {heroImg && <img src={heroImg} alt={pkg.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,35,0.88) 0%, rgba(6,15,35,0.2) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px' }}>
          <h1 style={{ margin: '0 0 12px', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', lineHeight: 1.05 }}>{quote.trip_name}</h1>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{fmtDate(quote.departure_date)}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{paxStr}</span>
          </div>
        </div>
      </div>

      {/* Sticky tabs */}
      <div className="pp-tabs" style={{ background: C.navy, position: 'sticky', top: 0, zIndex: 50 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: "'Archivo', Arial, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
            color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
            borderBottom: `2px solid ${activeTab === tab ? C.teal : 'transparent'}`,
          }}>{tab.toUpperCase()}</button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        <div className="pp-grid">

          {/* Tab content */}
          <div>
            {activeTab === 'Itinerary' && (
              <div>
                {pkg.itinerary?.map((day, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                    <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo', Arial, sans-serif", fontWeight: 700, fontSize: 13 }}>
                      {String(day.day).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 18, color: C.navy, marginBottom: 6 }}>{day.title}</div>
                      <p style={{ fontSize: 14, color: C.grey, lineHeight: 1.7, marginBottom: 10 }}>{day.description}</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {day.meals?.map((m, j) => (
                          <span key={j} style={{ fontSize: 11.5, fontWeight: 700, color: C.green, background: 'rgba(40,160,120,0.1)', padding: '4px 10px', borderRadius: 4 }}>✓ {m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Hotels' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pkg.hotels?.map((h, i) => (
                  <div key={i} style={{ border: `1px solid ${C.divider}`, borderRadius: 8, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Archivo', Arial, sans-serif", fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 4 }}>{h.name.replace(/\s*\/?\s*or similar$/i, '')}</div>
                      <div style={{ fontSize: 12, color: C.grey }}>{h.city} · {h.nights}N · {h.roomType || 'Standard'}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, background: 'rgba(13,138,177,0.1)', padding: '5px 12px', borderRadius: 4, whiteSpace: 'nowrap' }}>{h.meal}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Inclusions' && (
              <div>
                {pkg.inclusions?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: C.grey, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="pp-panel">
            <div style={{ border: `1px solid ${C.divider}`, borderRadius: 8, padding: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 4 }}>{quote.trip_name}</div>
              <div style={{ fontSize: 12.5, color: C.grey, marginBottom: 16 }}>{fmtDate(quote.departure_date)}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: C.grey }}>{quote.adults} Adult{quote.adults > 1 ? 's' : ''}</span>
                  <span style={{ fontWeight: 600 }}>{fmtPrice(quote.adults * (quote.base_price || 0), cur)}</span>
                </div>
                {quote.children_with_bed > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: C.grey }}>{quote.children_with_bed} Child w/ Bed</span>
                    <span style={{ fontWeight: 600 }}>{fmtPrice(quote.children_with_bed * (quote.child_with_bed_price || 0), cur)}</span>
                  </div>
                )}
                {quote.children_without_bed > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: C.grey }}>{quote.children_without_bed} Child w/o Bed</span>
                    <span style={{ fontWeight: 600 }}>{fmtPrice(quote.children_without_bed * (quote.child_without_bed_price || 0), cur)}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Archivo', Arial, sans-serif", fontWeight: 700, fontSize: 13, color: C.navy }}>Total</span>
                <span style={{ fontFamily: "'Archivo', Arial, sans-serif", fontWeight: 800, fontSize: 22, color: C.navy }}>{fmtPrice(quote.total_price || 0, cur)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 6, fontFamily: "'Archivo', Arial, sans-serif" }}>
                    💬 WhatsApp
                  </a>
                )}
                <a href={`mailto:${agent.email}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', background: 'none', border: `1.5px solid ${C.navy}`, color: C.navy, fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 6, fontFamily: "'Archivo', Arial, sans-serif" }}>
                  ✉️ Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 24px', borderTop: `1px solid ${C.divider}` }}>
        <span style={{ fontSize: 11.5, color: C.grey }}>Powered by GTF Connect</span>
      </div>
    </div>
  )
}
