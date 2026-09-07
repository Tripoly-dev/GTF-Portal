'use client'
import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'

const f = (n: number, cur = 'INR') => {
  if (!n) return '₹0'
  if (cur === 'USD') return `$${Math.round(n).toLocaleString('en-US')}`
  if (cur === 'EUR') return `€${Math.round(n).toLocaleString('en-IN')}`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

const fmtDate = (d: string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  created:   { label: 'Created',   bg: 'var(--teal-lt)',  color: 'var(--teal)' },
  sent:      { label: 'Sent',      bg: '#FEF3C7',         color: '#92400E' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2',         color: '#991B1B' },
  draft:     { label: 'Draft',     bg: 'var(--bg)',       color: 'var(--ink-light)' },
}

// ── HOTEL IMAGES ──────────────────────────────────────────────────────────────
const HOTEL_IMAGES: Record<string, string> = {
  'Cairo': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Nile Cruise': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/NILE%20CRUISE/SEMIRAMIS%20CRUISE/CRUISE%20VIEW.jpg',
  'Hurghada': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/OUTSIDE%20VIEW.jpg',
  'Cape Town': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg',
  'Garden Route': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/OUTSIDE.jpg',
  'Johannesburg': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Mauritius': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg',
  'Ankara': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg',
  'Cappadocia': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg',
  'Antalya': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Pamukkale': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Kusadasi': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg',
  'Hanoi': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/HANOI/GLOUD%20HOTEL/OUTSIDE.jpg',
}

const HOTEL_GALLERY: Record<string, string[]> = {
  'Novotel 6 October Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/DINING.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/STANDARD%20ROOM.jpg'],
  'Cresta Grande Cape Town': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/DINING.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/STANDARD%20DOUBLE%20ROOM.jpg'],
  'Pearle Beach Resort & Spa': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/BUDGET%20ROOM.jpg'],
  'Mercure Hotel Kızılay': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDE%20ENTRY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/STANDARD%20ROOM.jpg'],
  'Aleria Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/RESTAURANT.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/STANDARD%20ROOM.jpg'],
  'Ring Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/DOUBLE%20ROOM.jpg'],
  'Adempira Thermal Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/DELUXE%20ROOM.jpg'],
  'Odelia Resort Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/STANDARD%20ROOM.jpg'],
}

function normalizeHotelName(name: string) { return name.replace(/\s*\/?\s*or similar$/i, '').trim() }

// ── HOTEL CARD WITH CAROUSEL ──────────────────────────────────────────────────
function HotelCard({ h }: { h: any }) {
  const norm = normalizeHotelName(h.name)
  const gallery = HOTEL_GALLERY[norm] || []
  const fallback = HOTEL_IMAGES[h.city] || ''
  const images = gallery.length > 0 ? gallery : (fallback ? [fallback] : [])
  const [idx, setIdx] = useState(0)
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pauRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = (dir: number) => {
    setIdx(p => (p + dir + images.length) % images.length)
    if (intRef.current) clearInterval(intRef.current)
    if (pauRef.current) clearTimeout(pauRef.current)
    pauRef.current = setTimeout(startAuto, 8000)
  }
  const startAuto = () => {
    if (images.length < 2) return
    if (intRef.current) clearInterval(intRef.current)
    intRef.current = setInterval(() => setIdx(p => (p + 1) % images.length), 4000)
  }
  useEffect(() => { startAuto(); return () => { if (intRef.current) clearInterval(intRef.current) } }, [])

  return (
    <div style={{ border: '1px solid var(--rule)', background: 'white', overflow: 'hidden', marginBottom: 12, borderRadius: 8 }}>
      {images.length > 0 && (
        <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
          <img src={images[idx]} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }} />
          {images.length > 1 && <>
            <button onClick={() => go(-1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>‹</button>
            <button onClick={() => go(1)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>›</button>
            <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 3 }}>{idx + 1}/{images.length}</div>
          </>}
        </div>
      )}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{h.name}</div>
            <div style={{ display: 'flex', gap: 1, marginBottom: 10 }}>{'★'.repeat(h.stars || 4).split('').map((_, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>)}</div>
          </div>
          <span style={{ fontSize: 11, padding: '5px 12px', background: 'var(--teal-lt)', color: 'var(--teal)', fontWeight: 700, borderRadius: 4, whiteSpace: 'nowrap' }}>{h.meal}</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[{ l: 'CITY', v: h.city }, { l: 'NIGHTS', v: `${h.nights}N` }, { l: 'ROOM', v: h.roomType || 'Standard' }].map(({ l, v }) => (
            <div key={l}>
              <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── MODALS ────────────────────────────────────────────────────────────────────
const HELP_CATEGORIES = [
  'Price Match Help','Group Airfare Needed','Activity Not Available','Group Hotel Price Needed',
  'Need Changes in the Quote','Need to Talk to Expert','Visa Issue','Cruise Not Available',
  'Preferred Hotel Not Available','Price Not Available','Group Quote Request','Product Issue',
]

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', borderRadius: 12, boxShadow: '0 24px 64px rgba(7,26,23,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', fontFamily: "'Playfair Display', serif" }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-light)', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

function HelpModal({ quoteId, onClose }: { quoteId: string; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const toggle = (c: string) => setSelected(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const submit = async () => {
    setSaving(true)
    await fetch('/api/help-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote_id: quoteId, categories: selected, comments }) })
    setSaving(false); setDone(true)
  }
  return (
    <Modal title="Help Request" onClose={onClose}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>Request Submitted</div>
          <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>Our team will get back to you shortly.</div>
          <button onClick={onClose} className="btn-teal" style={{ padding: '10px 24px' }}>Close</button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 16 }}>Select one or more topics:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {HELP_CATEGORIES.map(c => (
              <button key={c} onClick={() => toggle(c)} style={{ padding: '10px 12px', border: `1.5px solid ${selected.includes(c) ? 'var(--teal)' : 'var(--rule)'}`, background: selected.includes(c) ? 'var(--teal-lt)' : 'white', color: selected.includes(c) ? 'var(--teal)' : 'var(--ink-mid)', fontSize: 12, fontWeight: selected.includes(c) ? 700 : 400, cursor: 'pointer', textAlign: 'left', borderRadius: 6, transition: 'all 0.15s' }}>{c}</button>
            ))}
          </div>
          <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--rule)', fontSize: 13, resize: 'none', boxSizing: 'border-box', borderRadius: 6, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }} placeholder="Additional details..." />
          <button onClick={submit} disabled={!selected.length || saving} className="btn-teal" style={{ width: '100%', justifyContent: 'center', opacity: selected.length ? 1 : 0.5 }}>{saving ? 'Submitting...' : 'Submit Request'}</button>
        </>
      )}
    </Modal>
  )
}

function CallbackModal({ quoteId, onClose }: { quoteId: string; onClose: () => void }) {
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const submit = async () => {
    setSaving(true)
    await fetch('/api/callback-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote_id: quoteId, comments }) })
    setSaving(false); setDone(true)
  }
  return (
    <Modal title="Get a Callback" onClose={onClose}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📞</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>Callback Requested</div>
          <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>Our team will call you back shortly.</div>
          <button onClick={onClose} className="btn-teal" style={{ padding: '10px 24px' }}>Close</button>
        </div>
      ) : (
        <>
          <textarea value={comments} onChange={e => setComments(e.target.value)} rows={4} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--rule)', fontSize: 13, resize: 'none', boxSizing: 'border-box', borderRadius: 6, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }} placeholder="Describe your query..." />
          <button onClick={submit} disabled={saving} className="btn-teal" style={{ width: '100%', justifyContent: 'center' }}>{saving ? 'Submitting...' : 'Request Callback'}</button>
        </>
      )}
    </Modal>
  )
}

function MarkupModal({ quote, pkg, onClose, onSaved }: { quote: any; pkg: any; onClose: () => void; onSaved: (q: any) => void }) {
  const [type, setType] = useState(quote.markup_type || 'fixed')
  const [val, setVal] = useState(quote.markup_value || 0)
  const [saving, setSaving] = useState(false)
  const base = (quote.base_price || 0) * (quote.adults || 1) + (quote.add_ons_total || 0)
  const markupAmt = type === 'percent' ? Math.round(base * Number(val) / 100) : Number(val)
  const total = base + markupAmt
  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/quotes/${quote.id}/markup`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markup_type: type, markup_value: val, markup_amount: markupAmt, total_price: total }) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) { onSaved(data.quote); onClose() }
  }
  return (
    <Modal title="Update Markup" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MARKUP TYPE</label>
          <select value={type} onChange={e => setType(e.target.value)} className="input-field">
            <option value="fixed">Fixed Amount (₹)</option>
            <option value="percent">Percentage (%)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MARKUP {type === 'percent' ? 'PERCENTAGE' : 'AMOUNT'}</label>
          <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className="input-field" />
        </div>
        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, border: '1px solid var(--rule)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Additional markup</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)' }}>{f(markupAmt)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--rule)', paddingTop: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--ink)' }}>New client total</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif" }}>{f(total)}</span>
          </div>
        </div>
        <button onClick={save} disabled={saving} className="btn-teal" style={{ justifyContent: 'center' }}>{saving ? 'Updating...' : 'Update Markup'}</button>
      </div>
    </Modal>
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
    setForm(prev => ({ ...prev, [k]: e.target.value }))
  const basePrice = pkg?.basePrice || 0
  const markupAmt = form.markup_type === 'percent' ? Math.round(basePrice * form.adults * Number(form.markup_value) / 100) : Number(form.markup_value)
  const total = basePrice * form.adults + markupAmt

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/quotes/${quote.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, markup_amount: markupAmt, total_price: total }) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) { onSaved(data.quote); onClose() }
  }

  const STEPS = ['Passengers', 'Departure', 'Markup & Notes', 'Review']

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', borderRadius: 12, boxShadow: '0 24px 64px rgba(7,26,23,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', fontFamily: "'Playfair Display', serif" }}>Edit Proposal</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-light)' }}>✕</button>
        </div>
        {/* Step tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)' }}>
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => setStep(i + 1)} style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', borderBottom: `2px solid ${step === i + 1 ? 'var(--teal)' : 'transparent'}`, marginBottom: -1, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: step === i + 1 ? 'var(--teal)' : 'var(--ink-light)', letterSpacing: '0.06em' }}>
              {i + 1}. {s.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ padding: 28 }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CLIENT NAME</label><input className="input-field" value={form.client_name} onChange={set('client_name')} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>TRIP NAME</label><input className="input-field" value={form.trip_name} onChange={set('trip_name')} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ADULTS</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--rule)', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => setForm(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} style={{ width: 36, height: 44, background: 'var(--bg)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--teal)' }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{form.adults}</span>
                    <button onClick={() => setForm(p => ({ ...p, adults: Math.min(45, p.adults + 1) }))} style={{ width: 36, height: 44, background: 'var(--bg)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--teal)' }}>+</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ROOM TYPE</label>
                  <select className="input-field" value={form.room_type} onChange={set('room_type')}>
                    <option value="double">Double / Twin</option>
                    <option value="single">Single Room</option>
                    <option value="triple">Triple Sharing</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CHILD WITH BED</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--rule)', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => setForm(p => ({ ...p, children_with_bed: Math.max(0, p.children_with_bed - 1) }))} style={{ width: 36, height: 44, background: 'var(--bg)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--orange)' }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{form.children_with_bed}</span>
                    <button onClick={() => setForm(p => ({ ...p, children_with_bed: p.children_with_bed + 1 }))} style={{ width: 36, height: 44, background: 'var(--bg)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--orange)' }}>+</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CHILD WITHOUT BED</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--rule)', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => setForm(p => ({ ...p, children_without_bed: Math.max(0, p.children_without_bed - 1) }))} style={{ width: 36, height: 44, background: 'var(--bg)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--orange)' }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{form.children_without_bed}</span>
                    <button onClick={() => setForm(p => ({ ...p, children_without_bed: p.children_without_bed + 1 }))} style={{ width: 36, height: 44, background: 'var(--bg)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--orange)' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>DEPARTURE DATE</label>
              <select className="input-field" value={form.departure_date} onChange={set('departure_date')}>
                <option value="">Select departure</option>
                {pkg?.departures?.filter((d: any) => d.status !== 'sold-out').map((d: any) => (
                  <option key={d.date} value={d.date}>{new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</option>
                ))}
              </select>
            </div>
          )}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MARKUP TYPE</label>
                <select className="input-field" value={form.markup_type} onChange={set('markup_type')}>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MARKUP VALUE</label>
                <input type="number" className="input-field" value={form.markup_value} onChange={set('markup_value')} />
              </div>
              <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, border: '1px solid var(--rule)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Base ({form.adults} adults)</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{f(basePrice * form.adults)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Additional markup</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>+ {f(markupAmt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--rule)', paddingTop: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{f(total)}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>INTERNAL NOTES</label>
                <textarea className="input-field" rows={3} value={form.notes} onChange={set('notes')} style={{ resize: 'none' }} placeholder="Visible only to you" />
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 16 }}>Review changes before saving</div>
              {[
                { l: 'Client Name', v: form.client_name },
                { l: 'Trip Name', v: form.trip_name },
                { l: 'Adults', v: String(form.adults) },
                { l: 'Room Type', v: form.room_type },
                { l: 'Child w/ Bed', v: String(form.children_with_bed) },
                { l: 'Child w/o Bed', v: String(form.children_without_bed) },
                { l: 'Departure', v: fmtDate(form.departure_date) },
                { l: 'Total', v: f(total) },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>}
            {step < STEPS.length
              ? <button onClick={() => setStep(s => s + 1)} className="btn-teal" style={{ flex: 1, justifyContent: 'center' }}>Next →</button>
              : <button onClick={save} disabled={saving} className="btn-teal" style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Saving...' : 'Save Changes'}</button>}
          </div>
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

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: 'var(--ink-light)' }}>Loading proposal...</div>
    </div>
  )

  if (!quote) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 700 }}>Proposal not found</div>
      <Link href="/dashboard/quotes" style={{ color: 'var(--teal)', fontSize: 13 }}>← Back to My Quotes</Link>
    </div>
  )

  const cur = quote.currency || 'INR'
  const status = quote.status || 'created'
  const statusStyle = STATUS[status] || STATUS.created
  const totalChildren = (quote.children_with_bed || 0) + (quote.children_without_bed || 0)

  // Earnings = TAC + additional markup
  const tacEarnings = pkg ? (pkg.tacAdult || 0) * (quote.adults || 0) + (pkg.tacChild || 0) * totalChildren : 0
  const totalEarnings = tacEarnings + (quote.markup_amount || 0)
  const netPrice = (quote.total_price || 0) - totalEarnings

  // Pax string
  const paxStr = `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}${totalChildren > 0 ? ` + ${totalChildren} Child${totalChildren > 1 ? 'ren' : ''}` : ''}`

  // WhatsApp message
  const whatsappMsg = () => {
    const msg = `Hi! Please find the travel proposal for *${quote.trip_name}*.\n\n` +
      `Destination: ${pkg?.name || quote.package_name}\n` +
      `Departure: ${fmtDate(quote.departure_date)}\n` +
      `Passengers: ${paxStr}\n` +
      `Total: ${f(quote.total_price, cur)}\n\n` +
      `I will share the PDF proposal separately.\nLooking forward to your confirmation!`
    return `https://wa.me/?text=${encodeURIComponent(msg)}`
  }

  // Hero image
  const heroImg = pkg?.gallery?.[0] || pkg?.img || ''

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'exclusions', label: 'Exclusions' },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── HERO BANNER — full width ── */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        {heroImg && <img src={heroImg} alt={pkg?.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.92) 0%, rgba(7,26,23,0.25) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,26,23,0.4) 0%, transparent 60%)' }} />

        {/* Breadcrumb inside hero */}
        <div style={{ position: 'absolute', top: 20, left: 32, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/quotes" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>My Quotes</Link>
          <span>→</span>
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>{quote.trip_name}</span>
        </div>

        {/* Proposal No + Status top right */}
        <div style={{ position: 'absolute', top: 20, right: 32, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '5px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 4, backdropFilter: 'blur(8px)' }}>PROPOSAL NO: {quote.quote_number}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '5px 12px', background: statusStyle.bg, color: statusStyle.color, borderRadius: 4 }}>{statusStyle.label.toUpperCase()}</span>
        </div>

        {/* Bottom content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px 28px' }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>{(quote.region || '').toUpperCase()}</div>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: '#fff', margin: '0 0 18px', lineHeight: 1.05, fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.02em' }}>
            {quote.trip_name}
          </h1>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[
              { l: 'CLIENT', v: quote.client_name },
              { l: 'DEPARTURE', v: fmtDate(quote.departure_date) },
              { l: 'PASSENGERS', v: paxStr },
              { l: 'DURATION', v: pkg ? `${pkg.nights}N/${pkg.days}D` : '' },
            ].filter(x => x.v).map(({ l, v }) => (
              <div key={l}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.42)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1560, margin: '0 auto', padding: '24px 32px 64px', display: 'grid', gridTemplateColumns: '220px 1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT: Vertical tab nav ── */}
        <div style={{ position: 'sticky', top: 20 }}>
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', overflow: 'hidden' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                width: '100%', padding: '14px 20px', background: activeTab === tab.id ? 'var(--teal-lt)' : 'white',
                border: 'none', borderLeft: `3px solid ${activeTab === tab.id ? 'var(--teal)' : 'transparent'}`,
                borderBottom: '1px solid var(--rule)', cursor: 'pointer',
                fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? 'var(--teal)' : 'var(--ink-mid)',
                textAlign: 'left', transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>
                  {tab.id === 'overview' ? '📋' : tab.id === 'itinerary' ? '🗺️' : tab.id === 'hotels' ? '🏨' : tab.id === 'inclusions' ? '✅' : '❌'}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTER: Tab content ── */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '28px 32px', minHeight: 400 }}>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {pkg?.tagline && (
                <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic', borderLeft: '3px solid var(--teal)', paddingLeft: 16, fontFamily: "'Playfair Display', serif" }}>{pkg.tagline}</p>
              )}
              {pkg?.highlights && pkg.highlights.length > 0 && (
                <div>
                  <div className="eyebrow" style={{ marginBottom: 16 }}>★ HIGHLIGHTS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {pkg.highlights.map((h: string, i: number) => (
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

          {/* ITINERARY */}
          {activeTab === 'itinerary' && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>DAY-WISE ITINERARY</div>
              {pkg?.itinerary?.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>{String(item.day || i + 1).padStart(2, '0')}</div>
                    {i < (pkg?.itinerary?.length || 0) - 1 && <div style={{ width: 1, flex: 1, background: 'var(--rule)', marginTop: 4 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{item.title}</div>
                    <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: 10 }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {item.hotel && <span style={{ fontSize: 11, color: 'var(--teal)', background: 'var(--teal-lt)', padding: '3px 10px', borderRadius: 4 }}>🏨 {item.hotel}</span>}
                      {item.meals?.map((m: string, j: number) => <span key={j} style={{ fontSize: 11, color: 'var(--ink-mid)', background: 'var(--bg)', padding: '3px 10px', borderRadius: 4 }}>🍽 {m}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HOTELS */}
          {activeTab === 'hotels' && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>ACCOMMODATION</div>
              {pkg?.hotels?.map((h: any, i: number) => <HotelCard key={i} h={h} />)}
            </div>
          )}

          {/* INCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>WHAT'S INCLUDED</div>
              {pkg?.inclusions?.map((item: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, color: '#065f46' }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* EXCLUSIONS */}
          {activeTab === 'exclusions' && (
            <div>
              <div className="eyebrow" style={{ color: 'var(--orange)', marginBottom: 20 }}>NOT INCLUDED</div>
              {pkg?.exclusions?.map((item: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, color: '#991b1b' }}>✕</span>
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Price + Actions ── */}
        <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Price card */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', overflow: 'hidden' }}>
            {/* Price header */}
            <div style={{ background: 'var(--teal)', padding: '20px 20px 16px' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.16em', fontWeight: 600, marginBottom: 6 }}>TOTAL PRICE</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{f(quote.total_price || 0, cur)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{f(Math.round((quote.total_price || 0) / (quote.adults || 1)), cur)} per adult · {paxStr}</div>
            </div>

            {/* Price breakdown */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Net price</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{f(netPrice, cur)}</span>
                </div>
                {tacEarnings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>TAC (agent commission)</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>+{f(tacEarnings, cur)}</span>
                  </div>
                )}
                {(quote.markup_amount || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Additional markup</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>+{f(quote.markup_amount, cur)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Your total earnings</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#16a34a' }}>+{f(totalEarnings, cur)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href={`/api/quotes/pdf?id=${quote.id}`} target="_blank" rel="noopener noreferrer"
              className="btn-teal" style={{ justifyContent: 'center', textDecoration: 'none' }}>
              📄 Download PDF
            </a>

            <a href={whatsappMsg()} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 20px', background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 8, fontFamily: "'DM Sans', sans-serif" }}>
              💬 Share on WhatsApp
            </a>

            {quote.status !== 'sent' && (
              <button onClick={markAsSent} disabled={markingAsSent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', background: 'none', border: '1.5px solid var(--teal)', color: 'var(--teal)', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 8, fontFamily: "'DM Sans', sans-serif" }}>
                {markingAsSent ? 'Updating...' : '✓ Mark as Sent'}
              </button>
            )}

            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: '✏️ Edit Proposal', action: () => setShowEdit(true) },
                { label: '💰 Update Markup', action: () => setShowMarkup(true) },
                { label: '❓ Help Request', action: () => setShowHelp(true) },
                { label: '📞 Get a Callback', action: () => setShowCallback(true) },
                { label: '✉️ Mail (Coming Soon)', action: () => {}, disabled: true },
              ].map(({ label, action, disabled }) => (
                <button key={label} onClick={action} disabled={disabled} style={{ padding: '10px 14px', background: 'none', border: '1px solid var(--rule)', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 500, color: disabled ? 'var(--ink-light)' : 'var(--ink-mid)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif", opacity: disabled ? 0.5 : 1 }}
                  onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.color = 'var(--teal)' } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; (e.currentTarget as HTMLElement).style.color = disabled ? 'var(--ink-light)' : 'var(--ink-mid)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEdit && pkg && <EditWizard quote={quote} pkg={pkg} onClose={() => setShowEdit(false)} onSaved={q => setQuote(q)} />}
      {showHelp && <HelpModal quoteId={quote.id} onClose={() => setShowHelp(false)} />}
      {showCallback && <CallbackModal quoteId={quote.id} onClose={() => setShowCallback(false)} />}
      {showMarkup && pkg && <MarkupModal quote={quote} pkg={pkg} onClose={() => setShowMarkup(false)} onSaved={q => setQuote(q)} />}
    </div>
  )
}
