'use client'
import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'

const COLORS = {
  navy: '#06316D', blue: '#0d8ab1', skyBlue: '#2e97bc',
  grey: '#757575', lightGrey: '#e8e6e6', white: '#ffffff',
}

const fmtPrice = (n: number, currency = 'INR') => {
  if (currency === 'USD') return `$${n?.toLocaleString('en-US') || 0}`
  if (currency === 'EUR') return `€${n?.toLocaleString('en-IN') || 0}`
  return `₹${n?.toLocaleString('en-IN') || 0}`
}

const fmtDate = (d: string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  created: { bg: '#E6F4F1', color: COLORS.navy },
  sent: { bg: '#FEF3C7', color: '#92400E' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
}

// ── HOTEL GALLERY (reuse from Quote Studio) ───────────────────────────────────
const HOTEL_IMAGES: Record<string, string> = {
  'Cairo': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Nile Cruise': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/NILE%20CRUISE/SEMIRAMIS%20CRUISE/CRUISE%20VIEW.jpg',
  'Hurghada': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/OUTSIDE%20VIEW.jpg',
  'Cape Town': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg',
  'Garden Route': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/OUTSIDE.jpg',
  'Johannesburg': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Mauritius': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg',
  'Istanbul': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ISTANBUL/WYNDHAM%20ISTANBUL%20OLD%20CITY%20HOTEL/OUTSIDE%20VIEW.avif',
  'Ankara': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg',
  'Cappadocia': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg',
  'Antalya': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Pamukkale': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Kusadasi': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg',
  'Ho Chi Minh City': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/HO%20CHI%20MINH/MUONG%20THANH%20SAIGON/OUTSIDE.webp',
  'Da Nang': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/DA%20NANG/GRAND%20GOLD%20HOTEL/OUTSIDE%20VIEW.webp',
  'Hanoi': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/HANOI/GLOUD%20HOTEL/OUTSIDE.jpg',
}

const HOTEL_GALLERY: Record<string, string[]> = {
  'Novotel 6 October Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/DINING.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/STANDARD%20ROOM.jpg'],
  'Cresta Grande Cape Town': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/DINING.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/STANDARD%20DOUBLE%20ROOM.jpg'],
  'Pearle Beach Resort & Spa': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/BUDGET%20ROOM.jpg'],
  'Grand Gold Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/DA%20NANG/GRAND%20GOLD%20HOTEL/OUTSIDE%20VIEW.webp','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/DA%20NANG/GRAND%20GOLD%20HOTEL/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/DA%20NANG/GRAND%20GOLD%20HOTEL/SUPERIOR%20DOUBLE%20ROOM.jpg'],
}

function normalizeHotelName(name: string) { return name.replace(/\s*\/?\s*or similar$/i, '').trim() }

// ── HOTEL CARD WITH CAROUSEL ──────────────────────────────────────────────────
function HotelCard({ h }: { h: any }) {
  const gallery = HOTEL_GALLERY[normalizeHotelName(h.name)] || []
  const fallback = HOTEL_IMAGES[h.city] || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80'
  const images = gallery.length > 0 ? gallery : [fallback]
  const hasMultiple = images.length > 1
  const [idx, setIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = (dir: number) => {
    setIdx(p => (p + dir + images.length) % images.length)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (pauseRef.current) clearTimeout(pauseRef.current)
    pauseRef.current = setTimeout(startAuto, 8000)
  }

  const startAuto = () => {
    if (!hasMultiple) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setIdx(p => (p + 1) % images.length), 4000)
  }

  useEffect(() => { startAuto(); return () => { if (intervalRef.current) clearInterval(intervalRef.current); if (pauseRef.current) clearTimeout(pauseRef.current) } }, [])

  return (
    <div style={{ display: 'flex', border: `1px solid ${COLORS.lightGrey}`, overflow: 'hidden', background: COLORS.white, marginBottom: 12 }}>
      <div style={{ position: 'relative', width: 420, minWidth: 420, height: 300, flexShrink: 0 }}>
        <img src={images[idx]} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }} />
        {hasMultiple && <>
          <button onClick={() => go(-1)} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>‹</button>
          <button onClick={() => go(1)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>›</button>
          <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5, zIndex: 2 }}>
            {images.map((_, d) => <div key={d} onClick={() => setIdx(d)} style={{ width: 6, height: 6, borderRadius: '50%', background: d === idx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} />)}
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 3 }}>{idx + 1}/{images.length}</div>
        </>}
      </div>
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>{h.name}</div>
            <div style={{ display: 'flex', gap: 1 }}>{'★'.repeat(h.stars).split('').map((_, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 12 }}>★</span>)}</div>
          </div>
          <div style={{ fontSize: 12, padding: '5px 12px', background: '#E6F4F1', color: COLORS.blue, fontWeight: 600, whiteSpace: 'nowrap' }}>{h.meal}</div>
        </div>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginTop: 4 }}>
          {[{ l: 'CITY', v: h.city }, { l: 'DURATION', v: `${h.nights} night${h.nights > 1 ? 's' : ''}` }, { l: 'ROOM TYPE', v: h.roomType }].map(({ l, v }) => (
            <div key={l}>
              <div style={{ fontSize: 10, color: COLORS.grey, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.navy }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── EDIT WIZARD ────────────────────────────────────────────────────────────────
function EditWizard({ quote, pkg, onClose, onSaved }: { quote: any; pkg: any; onClose: () => void; onSaved: (q: any) => void }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    adults: quote.adults || 2,
    children_with_bed: quote.children_with_bed || 0,
    children_without_bed: quote.children_without_bed || 0,
    room_type: quote.room_type || 'double',
    departure_date: quote.departure_date || '',
    markup_type: quote.markup_type || 'fixed',
    markup_value: quote.markup_value || 0,
    notes: quote.notes || '',
    client_name: quote.client_name || '',
    trip_name: quote.trip_name || '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const basePrice = pkg?.basePrice || 0
  const markupAmount = form.markup_type === 'percent'
    ? Math.round(basePrice * form.adults * Number(form.markup_value) / 100)
    : Number(form.markup_value)
  const totalPrice = basePrice * form.adults + markupAmount

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, markup_amount: markupAmount, total_price: totalPrice }),
      })
      const data = await res.json()
      if (res.ok) { onSaved(data.quote); onClose() }
    } finally { setSaving(false) }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.lightGrey}`, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 11, fontWeight: 600 as const, color: COLORS.grey, letterSpacing: '0.08em', display: 'block' as const, marginBottom: 8 }

  const steps = ['Passengers', 'Departure', 'Markup & Notes', 'Review']

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,49,109,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: COLORS.white, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(6,49,109,0.3)' }}>
        {/* Header */}
        <div style={{ background: COLORS.navy, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>Edit Proposal</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.lightGrey}` }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '12px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: step === i + 1 ? COLORS.blue : COLORS.grey, borderBottom: step === i + 1 ? `2px solid ${COLORS.blue}` : '2px solid transparent', cursor: 'pointer' }} onClick={() => setStep(i + 1)}>{i + 1}. {s}</div>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          {/* Step 1 — Passengers */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelStyle}>CLIENT NAME</label>
                <input style={inputStyle} value={form.client_name} onChange={set('client_name')} />
              </div>
              <div>
                <label style={labelStyle}>TRIP NAME</label>
                <input style={inputStyle} value={form.trip_name} onChange={set('trip_name')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>ADULTS</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${COLORS.lightGrey}`, padding: '8px 12px' }}>
                    <button onClick={() => setForm(f => ({ ...f, adults: Math.max(1, f.adults - 1) }))} style={{ background: COLORS.navy, color: '#fff', border: 'none', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: COLORS.navy }}>{form.adults}</span>
                    <button onClick={() => setForm(f => ({ ...f, adults: Math.min(45, f.adults + 1) }))} style={{ background: COLORS.navy, color: '#fff', border: 'none', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>ROOM TYPE</label>
                  <select style={inputStyle} value={form.room_type} onChange={set('room_type')}>
                    <option value="double">Double / Twin</option>
                    <option value="single">Single Room</option>
                    <option value="triple">Triple Sharing</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>CHILD WITH BED</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${COLORS.lightGrey}`, padding: '8px 12px' }}>
                    <button onClick={() => setForm(f => ({ ...f, children_with_bed: Math.max(0, f.children_with_bed - 1) }))} style={{ background: COLORS.lightGrey, border: 'none', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{form.children_with_bed}</span>
                    <button onClick={() => setForm(f => ({ ...f, children_with_bed: f.children_with_bed + 1 }))} style={{ background: COLORS.lightGrey, border: 'none', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>CHILD WITHOUT BED</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${COLORS.lightGrey}`, padding: '8px 12px' }}>
                    <button onClick={() => setForm(f => ({ ...f, children_without_bed: Math.max(0, f.children_without_bed - 1) }))} style={{ background: COLORS.lightGrey, border: 'none', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{form.children_without_bed}</span>
                    <button onClick={() => setForm(f => ({ ...f, children_without_bed: f.children_without_bed + 1 }))} style={{ background: COLORS.lightGrey, border: 'none', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Departure */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelStyle}>DEPARTURE DATE</label>
                <select style={inputStyle} value={form.departure_date} onChange={set('departure_date')}>
                  <option value="">Select departure</option>
                  {pkg?.departures?.filter((d: any) => d.status !== 'sold-out').map((d: any) => (
                    <option key={d.date} value={d.date}>{new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3 — Markup & Notes */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelStyle}>MARKUP TYPE</label>
                <select style={inputStyle} value={form.markup_type} onChange={set('markup_type')}>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>MARKUP {form.markup_type === 'percent' ? 'PERCENTAGE' : 'AMOUNT'}</label>
                <input style={inputStyle} type="number" value={form.markup_value} onChange={set('markup_value')} placeholder={form.markup_type === 'percent' ? '3.5' : '5000'} />
              </div>
              <div style={{ background: COLORS.lightGrey, padding: 16 }}>
                <div style={{ fontSize: 12, color: COLORS.grey, marginBottom: 8 }}>MARKUP PREVIEW</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: COLORS.grey }}>Base ({form.adults} adults)</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{fmtPrice(basePrice * form.adults)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: COLORS.grey }}>Markup</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.blue }}>+ {fmtPrice(markupAmount)}</span>
                </div>
                <div style={{ borderTop: `1px solid ${COLORS.grey}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy }}>{fmtPrice(totalPrice)}</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>INTERNAL NOTES</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: 'none' }} value={form.notes} onChange={set('notes')} placeholder="Notes visible only to you" />
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, color: COLORS.grey, marginBottom: 8 }}>Review all changes before saving</div>
              {[
                { l: 'Client Name', v: form.client_name },
                { l: 'Trip Name', v: form.trip_name },
                { l: 'Adults', v: String(form.adults) },
                { l: 'Room Type', v: form.room_type },
                { l: 'Child w/ Bed', v: String(form.children_with_bed) },
                { l: 'Child w/o Bed', v: String(form.children_without_bed) },
                { l: 'Departure', v: fmtDate(form.departure_date) },
                { l: 'Markup', v: form.markup_type === 'percent' ? `${form.markup_value}%` : fmtPrice(Number(form.markup_value)) },
                { l: 'Total Price', v: fmtPrice(totalPrice) },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${COLORS.lightGrey}` }}>
                  <span style={{ fontSize: 13, color: COLORS.grey }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '12px', border: `1px solid ${COLORS.lightGrey}`, background: COLORS.white, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: COLORS.grey }}>← Back</button>
              : <div style={{ flex: 1 }} />}
            {step < steps.length
              ? <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: '12px', background: COLORS.navy, color: COLORS.white, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Next →</button>
              : <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: COLORS.blue, color: COLORS.white, border: 'none', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── HELP REQUEST MODAL ────────────────────────────────────────────────────────
const HELP_CATEGORIES = [
  'Price Match Help', 'Group Airfare Needed', 'Activity Not Available', 'Group Hotel Price Needed',
  'Need Changes in the Quote', 'Need to Talk to Expert', 'Visa Issue', 'Cruise Not Available',
  'Preferred Hotel Not Available', 'Price Not Available', 'Group Quote Request', 'Product Issue',
]

function HelpRequestModal({ quoteId, onClose }: { quoteId: string; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const toggle = (c: string) => setSelected(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])

  const handleSubmit = async () => {
    if (!selected.length) return
    setSaving(true)
    await fetch('/api/help-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote_id: quoteId, categories: selected, comments }) })
    setSaving(false)
    setDone(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,49,109,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: COLORS.white, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ background: COLORS.navy, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>Help Request</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>Request Submitted</div>
              <div style={{ fontSize: 13, color: COLORS.grey, marginBottom: 24 }}>Our team will get back to you shortly.</div>
              <button onClick={onClose} style={{ padding: '10px 24px', background: COLORS.navy, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Close</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: COLORS.grey, marginBottom: 16 }}>Select one or more topics:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {HELP_CATEGORIES.map(c => (
                  <button key={c} onClick={() => toggle(c)} style={{ padding: '10px 12px', border: `1.5px solid ${selected.includes(c) ? COLORS.blue : COLORS.lightGrey}`, background: selected.includes(c) ? '#E6F4F1' : COLORS.white, color: selected.includes(c) ? COLORS.blue : COLORS.grey, fontSize: 12, fontWeight: selected.includes(c) ? 700 : 400, cursor: 'pointer', textAlign: 'left' }}>{c}</button>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.grey, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ADDITIONAL COMMENTS</label>
                <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.lightGrey}`, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} placeholder="Any additional details..." />
              </div>
              <button onClick={handleSubmit} disabled={!selected.length || saving} style={{ width: '100%', padding: '14px', background: selected.length ? COLORS.navy : COLORS.lightGrey, color: selected.length ? COLORS.white : COLORS.grey, border: 'none', fontSize: 13, fontWeight: 700, cursor: selected.length ? 'pointer' : 'not-allowed' }}>{saving ? 'Submitting...' : 'Submit Request'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CALLBACK MODAL ────────────────────────────────────────────────────────────
function CallbackModal({ quoteId, onClose }: { quoteId: string; onClose: () => void }) {
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    await fetch('/api/callback-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote_id: quoteId, comments }) })
    setSaving(false)
    setDone(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,49,109,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: COLORS.white, width: '100%', maxWidth: 440 }}>
        <div style={{ background: COLORS.navy, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>Get a Call Back</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>Request Received</div>
              <div style={{ fontSize: 13, color: COLORS.grey, marginBottom: 20 }}>Our team will call you back shortly.</div>
              <button onClick={onClose} style={{ padding: '10px 24px', background: COLORS.navy, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Close</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: COLORS.grey, marginBottom: 16 }}>Tell us what you need help with:</div>
              <textarea value={comments} onChange={e => setComments(e.target.value)} rows={4} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.lightGrey}`, fontSize: 13, resize: 'none', boxSizing: 'border-box', marginBottom: 20 }} placeholder="Describe your issue or query..." />
              <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '14px', background: COLORS.navy, color: COLORS.white, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Submitting...' : 'Request Callback'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── UPDATE MARKUP MODAL ───────────────────────────────────────────────────────
function UpdateMarkupModal({ quote, pkg, onClose, onSaved }: { quote: any; pkg: any; onClose: () => void; onSaved: (q: any) => void }) {
  const [markupType, setMarkupType] = useState(quote.markup_type || 'fixed')
  const [markupValue, setMarkupValue] = useState(quote.markup_value || 0)
  const [saving, setSaving] = useState(false)

  const base = (quote.base_price || 0) * (quote.adults || 1)
  const markupAmount = markupType === 'percent' ? Math.round(base * Number(markupValue) / 100) : Number(markupValue)
  const total = base + markupAmount

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/quotes/${quote.id}/markup`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markup_type: markupType, markup_value: markupValue, markup_amount: markupAmount, total_price: total }) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) { onSaved(data.quote); onClose() }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,49,109,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: COLORS.white, width: '100%', maxWidth: 400 }}>
        <div style={{ background: COLORS.navy, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>Update Markup</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.grey, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MARKUP TYPE</label>
            <select value={markupType} onChange={e => setMarkupType(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.lightGrey}`, fontSize: 14, boxSizing: 'border-box' as const }}>
              <option value="fixed">Fixed Amount (₹)</option>
              <option value="percent">Percentage (%)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.grey, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MARKUP {markupType === 'percent' ? 'PERCENTAGE' : 'AMOUNT'}</label>
            <input type="number" value={markupValue} onChange={e => setMarkupValue(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.lightGrey}`, fontSize: 14, boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ background: COLORS.lightGrey, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.grey }}>Markup earnings</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{fmtPrice(markupAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: COLORS.grey }}>New client total</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy }}>{fmtPrice(total)}</span>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ padding: '14px', background: COLORS.navy, color: COLORS.white, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Updating...' : 'Update Markup'}</button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEdit, setShowEdit] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showCallback, setShowCallback] = useState(false)
  const [showMarkup, setShowMarkup] = useState(false)
  const [markingAsSent, setMarkingAsSent] = useState(false)

  const pkg = quote ? PACKAGES.find(p => p.id === quote.package_id) || null : null

  useEffect(() => {
    fetch(`/api/quotes/${id}`)
      .then(r => r.json())
      .then(d => { setQuote(d.quote); setAgent(d.agent) })
      .finally(() => setLoading(false))
  }, [id])

  const markAsSent = async () => {
    setMarkingAsSent(true)
    const res = await fetch(`/api/quotes/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'sent' }) })
    const data = await res.json()
    if (res.ok) setQuote(data.quote)
    setMarkingAsSent(false)
  }

  const whatsappMsg = () => {
    if (!quote || !pkg) return ''
    const msg = `Hi! Please find the travel proposal for *${quote.trip_name}*.\n\n` +
      `Destination: ${pkg.name}\n` +
      `Departure: ${fmtDate(quote.departure_date)}\n` +
      `Passengers: ${quote.adults} Adult${quote.adults > 1 ? 's' : ''}\n` +
      `Total: ${fmtPrice(quote.total_price, quote.currency)}\n\n` +
      `Please find the PDF proposal attached.\nLooking forward to your confirmation!`
    return `https://wa.me/?text=${encodeURIComponent(msg)}`
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: COLORS.grey }}>Loading proposal...</div>
    </div>
  )

  if (!quote) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 16, color: COLORS.navy, fontWeight: 700 }}>Proposal not found</div>
      <Link href="/dashboard/quotes" style={{ color: COLORS.blue, fontSize: 13 }}>← Back to My Quotes</Link>
    </div>
  )

  const cur = quote.currency || 'INR'
  const f = (n: number) => fmtPrice(n, cur)
  const netPrice = (quote.base_price || 0) * (quote.adults || 1) + (quote.add_ons_total || 0)
  const status = quote.status || 'created'
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.created

  const TABS = ['overview', 'itinerary', 'hotels', 'inclusions', 'exclusions']

  const ActionBtn = ({ onClick, bg, color, border, children }: any) => (
    <button onClick={onClick} style={{ width: '100%', padding: '12px 16px', background: bg || COLORS.white, color: color || COLORS.navy, border: border || `1px solid ${COLORS.lightGrey}`, fontSize: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'left' as const, letterSpacing: '0.04em', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      {children}
    </button>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1560, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: COLORS.grey }}>
        <Link href="/dashboard" style={{ color: COLORS.blue, textDecoration: 'none' }}>Dashboard</Link>
        <span>→</span>
        <Link href="/dashboard/quotes" style={{ color: COLORS.blue, textDecoration: 'none' }}>My Quotes</Link>
        <span>→</span>
        <span style={{ color: COLORS.navy, fontWeight: 600 }}>{quote.trip_name}</span>
      </div>

      <div style={{ maxWidth: 1560, margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Header */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.lightGrey}`, marginBottom: 20, overflow: 'hidden' }}>
            <div style={{ background: COLORS.navy, padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: COLORS.skyBlue, fontWeight: 700, letterSpacing: '0.14em' }}>
                  PROPOSAL NO: {quote.quote_number || quote.id?.slice(0, 8).toUpperCase()}
                </div>
                <div style={{ padding: '4px 12px', background: statusStyle.bg, color: statusStyle.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  {status}
                </div>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: "'Playfair Display', Georgia, serif" }}>
                {quote.trip_name}
              </h1>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { l: 'CLIENT', v: quote.client_name },
                  { l: 'DEPARTURE', v: fmtDate(quote.departure_date) },
                  { l: 'PASSENGERS', v: `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}` },
                  { l: 'DURATION', v: pkg ? `${pkg.nights}N/${pkg.days}D` : '' },
                  { l: 'REGION', v: (quote.region || '').toUpperCase() },
                ].map(({ l, v }) => v ? (
                  <div key={l}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{v}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.lightGrey}` }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.lightGrey}` }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? COLORS.blue : 'transparent'}`, marginBottom: -1, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: activeTab === tab ? COLORS.blue : COLORS.grey, textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif" }}>
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  {pkg?.tagline && (
                    <p style={{ fontSize: 15, color: COLORS.grey, lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic', borderLeft: `3px solid ${COLORS.blue}`, paddingLeft: 16 }}>{pkg.tagline}</p>
                  )}
                  {pkg?.highlights && pkg.highlights.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, color: COLORS.blue, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 16 }}>HIGHLIGHTS</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {pkg.highlights.map((h: string, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.blue, flexShrink: 0, marginTop: 7 }} />
                            <span style={{ fontSize: 14, color: COLORS.grey, lineHeight: 1.5 }}>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ITINERARY */}
              {activeTab === 'itinerary' && (
                <div>
                  <div style={{ fontSize: 10, color: COLORS.blue, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 20 }}>DAY-WISE ITINERARY</div>
                  {pkg?.itinerary?.map((item: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontSize: 12, fontWeight: 700 }}>
                          {String(item.day || i + 1).padStart(2, '0')}
                        </div>
                        {i < (pkg?.itinerary?.length || 0) - 1 && <div style={{ width: 1, flex: 1, background: COLORS.lightGrey, marginTop: 4 }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 16 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</div>
                        <p style={{ fontSize: 14, color: COLORS.grey, lineHeight: 1.6, marginBottom: 10 }}>{item.description}</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {item.hotel && <span style={{ fontSize: 11, color: COLORS.blue, background: '#E6F4F1', padding: '3px 10px' }}>Hotel: {item.hotel}</span>}
                          {item.meals?.map((m: string, j: number) => <span key={j} style={{ fontSize: 11, color: COLORS.grey, background: COLORS.lightGrey, padding: '3px 10px' }}>{m}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HOTELS */}
              {activeTab === 'hotels' && (
                <div>
                  <div style={{ fontSize: 10, color: COLORS.blue, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 16 }}>ACCOMMODATION</div>
                  {pkg?.hotels?.map((h: any, i: number) => <HotelCard key={i} h={h} />)}
                  <p style={{ fontSize: 11, color: COLORS.grey, fontStyle: 'italic', marginTop: 12 }}>* Hotels or equivalent. Subject to availability at time of booking.</p>
                </div>
              )}

              {/* INCLUSIONS */}
              {activeTab === 'inclusions' && (
                <div>
                  <div style={{ fontSize: 10, color: COLORS.blue, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 20 }}>WHAT'S INCLUDED</div>
                  {pkg?.inclusions?.map((item: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: COLORS.blue, flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 14, color: COLORS.grey, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* EXCLUSIONS */}
              {activeTab === 'exclusions' && (
                <div>
                  <div style={{ fontSize: 10, color: '#9e2233', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 20 }}>NOT INCLUDED</div>
                  {pkg?.exclusions?.map((item: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#9e2233', flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 14, color: COLORS.grey, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (sticky) ── */}
        <div style={{ position: 'sticky', top: 20 }}>
          {/* Price Block */}
          <div style={{ background: COLORS.navy, padding: '24px 22px', marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.16em', marginBottom: 8 }}>QUOTE BUILDER</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.white, marginBottom: 6, letterSpacing: '-0.03em' }}>{f(quote.total_price || 0)}</div>
            <div style={{ fontSize: 12, color: COLORS.skyBlue, marginBottom: 16 }}>{f(Math.round((quote.total_price || 0) / (quote.adults || 1)))} per adult</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Net price</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{f(netPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Your earnings</span>
                <span style={{ fontSize: 12, color: '#86efac', fontWeight: 700 }}>+ {f(quote.markup_amount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.lightGrey}`, padding: '16px 16px 10px' }}>
            <a href={`/api/quotes/pdf?id=${quote.id}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 16px', background: COLORS.navy, color: COLORS.white, fontSize: 12, fontWeight: 700, textDecoration: 'none', marginBottom: 6, letterSpacing: '0.04em', boxSizing: 'border-box' as const }}>
              📄 DOWNLOAD PDF
            </a>

            <a href={whatsappMsg()} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 16px', background: '#25D366', color: COLORS.white, fontSize: 12, fontWeight: 700, textDecoration: 'none', marginBottom: 6, letterSpacing: '0.04em', boxSizing: 'border-box' as const }}>
              💬 SHARE WHATSAPP
            </a>

            {status !== 'sent' && (
              <ActionBtn onClick={markAsSent} color={COLORS.blue} border={`1.5px solid ${COLORS.blue}`}>
                {markingAsSent ? 'Updating...' : '✓ MARK AS SENT'}
              </ActionBtn>
            )}

            <div style={{ borderTop: `1px solid ${COLORS.lightGrey}`, margin: '10px 0' }} />

            <ActionBtn onClick={() => setShowMarkup(true)}>✏ UPDATE MARKUP</ActionBtn>
            <ActionBtn onClick={() => setShowEdit(true)}>📋 EDIT PROPOSAL</ActionBtn>

            <div style={{ borderTop: `1px solid ${COLORS.lightGrey}`, margin: '10px 0' }} />

            <ActionBtn onClick={() => setShowHelp(true)}>❓ HELP REQUEST</ActionBtn>
            <ActionBtn onClick={() => setShowCallback(true)}>📞 GET A CALLBACK</ActionBtn>

            <div style={{ borderTop: `1px solid ${COLORS.lightGrey}`, margin: '10px 0' }} />

            <ActionBtn onClick={() => {}} color={COLORS.lightGrey} border={`1px solid ${COLORS.lightGrey}`} style={{ cursor: 'not-allowed' }}>
              ✉ MAIL (COMING SOON)
            </ActionBtn>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEdit && pkg && <EditWizard quote={quote} pkg={pkg} onClose={() => setShowEdit(false)} onSaved={q => setQuote(q)} />}
      {showHelp && <HelpRequestModal quoteId={quote.id} onClose={() => setShowHelp(false)} />}
      {showCallback && <CallbackModal quoteId={quote.id} onClose={() => setShowCallback(false)} />}
      {showMarkup && pkg && <UpdateMarkupModal quote={quote} pkg={pkg} onClose={() => setShowMarkup(false)} onSaved={q => setQuote(q)} />}
    </div>
  )
}
