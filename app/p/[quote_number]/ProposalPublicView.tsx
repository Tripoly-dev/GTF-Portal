'use client'
import { useState, useEffect } from 'react'
import type { Package } from '@/data/packages'
import { hotelImages, normalizeHotelName } from '@/data/hotel-images'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

function RotatingHotelImage({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (images.length < 2) return
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 3500)
    return () => clearInterval(t)
  }, [images.length])
  if (!images.length) return null
  return (
    <div style={{ position: 'relative', width: 160, height: 120, flexShrink: 0, overflow: 'hidden' }}>
      {images.map((src, i) => (
        <img key={src} src={src} alt={alt} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          opacity: i === idx ? 1 : 0, transition: 'opacity 0.6s ease',
        }} />
      ))}
    </div>
  )
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
  id: string; trip_name: string; client_name: string; departure_date: string; adults: number
  children_with_bed: number; children_without_bed: number
  base_price: number; child_with_bed_price: number; child_without_bed_price: number
  total_price: number; currency: string
}
type Agent = {
  full_name: string; agency_name: string; logo_url: string | null
  mobile: string; email: string; whatsapp_number: string | null
}

const TABS = ['Overview', 'Itinerary', 'Hotels', 'Inclusions', 'Exclusions'] as const

export default function ProposalPublicView({ quote, agent, pkg }: { quote: Quote; agent: Agent; pkg: Package }) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Overview')

  const cur = quote.currency || 'INR'
  const totalChildren = (quote.children_with_bed || 0) + (quote.children_without_bed || 0)
  const paxStr = `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}${totalChildren > 0 ? ` + ${totalChildren} Child${totalChildren > 1 ? 'ren' : ''}` : ''}`
  const durationStr = `${pkg.nights}N/${pkg.days}D`
  const heroImg = pkg.gallery?.[0] || pkg.img || ''

  const whatsappHref = agent.whatsapp_number
    ? `https://wa.me/${agent.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I have a query about my travel proposal.')}`
    : null

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'DM Sans', Arial, sans-serif", color: 'var(--ink)' }}>
      <style>{`
        .pp-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .pp-panel { position: sticky; top: 84px; }
        .pp-tabs { display: flex; gap: 0; overflow-x: auto; }
        @media (max-width: 860px) {
          .pp-grid { grid-template-columns: 1fr; }
          .pp-panel { position: static; }
        }
      `}</style>

      {/* Top bar — agent branding only */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--rule)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {agent.logo_url && <img src={agent.logo_url} alt={agent.agency_name} style={{ height: 32, width: 'auto', objectFit: 'contain' }} />}
        <span className="font-tight" style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{agent.agency_name}</span>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
        {heroImg && <img src={heroImg} alt={pkg.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.92) 0%, rgba(7,26,23,0.25) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px' }}>
          <h1 style={{ margin: '0 0 12px', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', lineHeight: 1.05 }}>{quote.trip_name}</h1>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { l: 'CLIENT', v: quote.client_name },
              { l: 'DEPARTURE', v: fmtDate(quote.departure_date) },
              { l: 'PASSENGERS', v: paxStr },
              { l: 'DURATION', v: durationStr },
            ].filter(x => x.v).map(({ l, v }) => (
              <div key={l}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky tabs */}
      <div className="pp-tabs" style={{ background: 'var(--ink)', position: 'sticky', top: 0, zIndex: 50 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '16px 22px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', fontFamily: "'DM Sans', sans-serif",
            color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
            borderBottom: `2px solid ${activeTab === tab ? 'var(--teal)' : 'transparent'}`,
          }}>{tab.toUpperCase()}</button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        <div className="pp-grid">

          {/* Tab content */}
          <div>
            {activeTab === 'Overview' && (
              <div>
                {pkg.tagline && (
                  <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic', borderLeft: '3px solid var(--teal)', paddingLeft: 16, fontFamily: "'Playfair Display', serif" }}>{pkg.tagline}</p>
                )}
                {pkg.highlights?.length > 0 && (
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>★ HIGHLIGHTS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {pkg.highlights.map((h, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 7 }} />
                          <span style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Itinerary' && (
              <div>
                {pkg.itinerary?.map((day, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                    <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                      {String(day.day).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 18, color: 'var(--ink)', marginBottom: 6 }}>{day.title}</div>
                      <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.7, marginBottom: 10 }}>{day.description}</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {day.meals?.map((m, j) => (
                          <span key={j} style={{ fontSize: 11.5, fontWeight: 700, color: '#065F46', background: '#d1fae5', padding: '4px 10px', borderRadius: 4 }}>✓ {m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Hotels' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pkg.hotels?.map((h, i) => {
                  const images = hotelImages(h.name, h.city)
                  return (
                    <div key={i} style={{ border: '1px solid var(--rule)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
                      <RotatingHotelImage images={images} alt={h.name} />
                      <div style={{ flex: 1, minWidth: 200, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                          <div className="font-tight" style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>{normalizeHotelName(h.name)}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{h.city} · {h.nights}N · {h.roomType || 'Standard'}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', background: 'var(--teal-lt)', padding: '5px 12px', borderRadius: 4, whiteSpace: 'nowrap' }}>{h.meal}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'Inclusions' && (
              <div>
                {pkg.inclusions?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span style={{ color: '#065F46', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Exclusions' && (
              <div>
                {pkg.exclusions?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span style={{ color: '#991B1B', fontWeight: 700, flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="pp-panel">
            <div style={{ border: '1px solid var(--rule)', borderRadius: 8, padding: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 17, color: 'var(--ink)', marginBottom: 4 }}>{quote.trip_name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-light)', marginBottom: 16 }}>{fmtDate(quote.departure_date)}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-light)' }}>{quote.adults} Adult{quote.adults > 1 ? 's' : ''}</span>
                  <span style={{ fontWeight: 600 }}>{fmtPrice(quote.adults * (quote.base_price || 0), cur)}</span>
                </div>
                {quote.children_with_bed > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--ink-light)' }}>{quote.children_with_bed} Child w/ Bed</span>
                    <span style={{ fontWeight: 600 }}>{fmtPrice(quote.children_with_bed * (quote.child_with_bed_price || 0), cur)}</span>
                  </div>
                )}
                {quote.children_without_bed > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--ink-light)' }}>{quote.children_without_bed} Child w/o Bed</span>
                    <span style={{ fontWeight: 600 }}>{fmtPrice(quote.children_without_bed * (quote.child_without_bed_price || 0), cur)}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="font-tight" style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>Total</span>
                <span className="font-tight" style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>{fmtPrice(quote.total_price || 0, cur)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 6, fontFamily: "'DM Sans', sans-serif" }}>
                    <WhatsAppIcon size={15} color="#fff" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
