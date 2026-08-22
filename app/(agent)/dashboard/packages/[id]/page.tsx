'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES, Package, DepartureSlot } from '@/data/packages'

// ── CURRENCY HELPERS ─────────────────────────────────────────────────────────
const fmtCurrency = (n: number, currency: string) => {
  if (currency === 'USD') return '$' + Math.round(n).toLocaleString('en-US')
  if (currency === 'EUR') return '€' + Math.round(n).toLocaleString('en-IN')
  return '₹' + Math.round(n).toLocaleString('en-IN')
}
const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  'available':    { background: '#D1FAE5', color: '#065F46' },
  'fast-filling': { background: '#FEF3C7', color: '#92400E' },
  'sold-out':     { background: '#FEE2E2', color: '#991B1B' },
}
const STATUS_LABEL: Record<string, string> = {
  'available': 'AVAILABLE', 'fast-filling': 'FAST FILLING', 'sold-out': 'SOLD OUT',
}

const EX_CITIES = ['Mumbai', 'Delhi', 'Ahmedabad', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune']

// ── TABLER ICONS (SVG) ────────────────────────────────────────────────────────
const Icon = ({ path, size = 20, color = 'var(--teal)' }: { path: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)
const ICONS = {
  duration:   'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2M12 6v6l4 2',
  group:      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  hotel:      'M3 21h18M3 7v14M21 7v14M6 3h12a2 2 0 0 1 2 2v2H4V5a2 2 0 0 1 2-2M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  meals:      'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
  manager:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  flightOn:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17',
  flightOff:  'M3 3l18 18M10.5 10.677A5 5 0 0 0 17 17M20 17.8l1.4 1.4a2 2 0 0 1-2.58 2.04A19.8 19.8 0 0 1 10.16 18M4.15 12A19.79 19.79 0 0 1 1.08 3.33 2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81',
}

// ── SAVE PROPOSAL MODAL ───────────────────────────────────────────────────────
function SaveProposalModal({ pkg, summary, onClose, onSave }: {
  pkg: Package
  summary: {
    totalPrice: number; adults: number; childrenWithBed: number; childrenWithoutBed: number;
    roomType: string; departureDate: string; addOnsTotal: number; selectedAddOnLabels: string[]
    currency: string
  }
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [form, setForm] = useState({
    client_name: '', client_type: 'repeat', trip_name: pkg.name,
    estimated_booking_date: '', flights_booked: false, notes: '',
    markup_type: 'percentage', markup_value: 0, ex_city: 'Mumbai',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const markupAmount = form.markup_type === 'percentage'
    ? (summary.totalPrice * Number(form.markup_value)) / 100
    : Number(form.markup_value)
  const finalTotal = summary.totalPrice + markupAmount
  const cur = summary.currency
  const f = (n: number) => fmtCurrency(n, cur)

  const handleSave = async () => {
    if (!form.client_name.trim()) { alert('Client name is required'); return }
    setSaving(true)
    await onSave({ ...form, markup_value: Number(form.markup_value), markup_amount: markupAmount, final_total: finalTotal })
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 580, maxHeight: '92vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--ink)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', marginBottom: 4 }}>SAVE PROPOSAL</div>
            <h2 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{pkg.name}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {fmtDate(summary.departureDate)} · {summary.adults} adult{summary.adults > 1 ? 's' : ''}
              {summary.childrenWithBed > 0 ? ` · ${summary.childrenWithBed} child w/ bed` : ''}
              {summary.childrenWithoutBed > 0 ? ` · ${summary.childrenWithoutBed} child w/o bed` : ''}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--teal-lt)', border: '1px solid var(--rule)', padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>PRICE SUMMARY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
              <span>Package ({summary.adults} adult{summary.adults > 1 ? 's' : ''} · {summary.roomType})</span>
              <span>{f(summary.totalPrice - summary.addOnsTotal)}</span>
            </div>
            {summary.addOnsTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
                <span>Add-ons</span><span>+ {f(summary.addOnsTotal)}</span>
              </div>
            )}
            {markupAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--orange)', marginBottom: 6 }}>
                <span>Your markup ({form.markup_type === 'percentage' ? `${form.markup_value}%` : 'fixed'})</span>
                <span>+ {f(markupAmount)}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--rule)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Client quote total</span>
              <span className="font-tight" style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)' }}>{f(finalTotal)}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 4, textAlign: 'right' }}>
              {f(Math.round(finalTotal / summary.adults))} per adult
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>YOUR MARKUP (OPTIONAL)</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="number" min="0" className="input-field" style={{ maxWidth: 100 }}
                value={form.markup_value} onChange={e => setForm(f => ({ ...f, markup_value: Number(e.target.value) }))} />
              <select className="input-field" style={{ maxWidth: 160 }} value={form.markup_type} onChange={set('markup_type')}>
                <option value="percentage">% Percentage</option>
                <option value="fixed">{cur === 'USD' ? '$' : cur === 'EUR' ? '€' : '₹'} Fixed Amount</option>
              </select>
              {markupAmount > 0 && <span style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 700, whiteSpace: 'nowrap' }}>= +{f(markupAmount)}</span>}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>CLIENT DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CLIENT NAME *</label>
                <input className="input-field" required placeholder="Full name" value={form.client_name} onChange={set('client_name')} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CLIENT TYPE</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['repeat', 'walk-in', 'referred', 'corporate', 'family/friend', 'community'].map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, client_type: t }))} style={{
                      padding: '5px 12px', border: `1.5px solid ${form.client_type === t ? 'var(--teal)' : 'var(--rule)'}`,
                      background: form.client_type === t ? 'var(--teal)' : 'white',
                      color: form.client_type === t ? '#fff' : 'var(--ink-mid)',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
                    }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>PROPOSAL DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>TRIP NAME</label>
                <input className="input-field" value={form.trip_name} onChange={set('trip_name')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>DEPARTURE CITY</label>
                  <select className="input-field" value={form.ex_city} onChange={set('ex_city')}>
                    {EX_CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>EST. BOOKING DATE</label>
                  <input type="date" className="input-field" value={form.estimated_booking_date} onChange={set('estimated_booking_date')} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>FLIGHTS BOOKED?</label>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['Yes', 'No'].map(v => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: 'var(--ink-mid)' }}>
                      <input type="radio" name="flights" checked={form.flights_booked === (v === 'Yes')} onChange={() => setForm(f => ({ ...f, flights_booked: v === 'Yes' }))} style={{ accentColor: 'var(--teal)' }} />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>NOTES (INTERNAL)</label>
                <textarea className="input-field" rows={2} placeholder="Internal notes..." value={form.notes} onChange={set('notes')} style={{ resize: 'none' }} />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-teal" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14, marginTop: 4 }}>
            {saving ? 'SAVING PROPOSAL...' : `SAVE PROPOSAL — ${f(finalTotal)} →`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DAY-WISE ITINERARY — TIMELINE STYLE ──────────────────────────────────────
function DayItinerary({ itinerary }: { itinerary: import('@/data/packages').ItineraryDay[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {itinerary.map((item, i) => (
        <div key={item.day} style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {/* Timeline line */}
          {i < itinerary.length - 1 && (
            <div style={{ position: 'absolute', left: 19, top: 48, bottom: 0, width: 2, background: 'var(--rule)', zIndex: 0 }} />
          )}
          {/* Day circle */}
          <div style={{ flexShrink: 0, width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--teal)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0 }}>
              <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.06em' }}>DAY</span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 800 }}>{String(item.day).padStart(2, '0')}</span>
            </div>
          </div>
          {/* Content */}
          <div style={{ flex: 1, paddingLeft: 14, paddingBottom: 24, paddingTop: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 6 }}>{item.title}</div>
            <p style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: 8 }}>{item.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {item.hotel && item.hotel.trim() && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ink-mid)', background: 'var(--bg)', padding: '3px 8px', border: '1px solid var(--rule)', borderRadius: 3 }}>
                  🏨 {item.hotel}
                </span>
              )}
              {item.meals && item.meals.length > 0 && item.meals.map((m, mi) => (
                <span key={mi} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--teal)', background: 'var(--teal-lt)', padding: '3px 8px', border: '1px solid rgba(10,110,94,0.15)', borderRadius: 3 }}>
                  🍽 {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── FLIGHTS TAB ───────────────────────────────────────────────────────────────
function FlightsTab({ pkg, selectedDepartureDate }: { pkg: Package; selectedDepartureDate: string }) {
  const flightInfo = pkg.flights
  if (!flightInfo || !flightInfo.included) return null

  const [activeDep, setActiveDep] = useState(selectedDepartureDate || flightInfo.departurewise[0]?.departureDate || '')
  useEffect(() => { if (selectedDepartureDate) setActiveDep(selectedDepartureDate) }, [selectedDepartureDate])

  const depData = flightInfo.departurewise.find(d => d.departureDate === activeDep) || flightInfo.departurewise[0]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em' }}>FLIGHT DETAILS</div>
        <span style={{ fontSize: 11, padding: '3px 10px', background: 'var(--teal-lt)', color: 'var(--teal)', fontWeight: 700, border: '1px solid var(--rule)' }}>✈ Ex {flightInfo.exCity}</span>
      </div>

      {flightInfo.departurewise.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {flightInfo.departurewise.map(d => (
            <button key={d.departureDate} onClick={() => setActiveDep(d.departureDate)} style={{
              padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              border: `1.5px solid ${activeDep === d.departureDate ? 'var(--teal)' : 'var(--rule)'}`,
              background: activeDep === d.departureDate ? 'var(--teal)' : 'white',
              color: activeDep === d.departureDate ? '#fff' : 'var(--ink-mid)',
            }}>
              {new Date(d.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </button>
          ))}
        </div>
      )}

      {depData && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['FLIGHT', 'AIRLINE', 'SECTOR', 'DATE', 'DEPARTS', 'ARRIVES'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-light)', borderBottom: '1px solid var(--rule)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {depData.segments.map((seg, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--teal)', fontSize: 12 }}>{seg.flightNo}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ink-mid)' }}>{seg.airline}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ink)' }}>{seg.sector}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>{seg.depDate || ''}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ink-mid)', fontWeight: 600 }}>{seg.depTime}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ink-mid)', fontWeight: 600 }}>{seg.arrTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ fontSize: 11, color: 'var(--ink-light)', fontStyle: 'italic', marginTop: 12 }}>* Flight schedule subject to change. Seats subject to availability at time of booking.</p>
    </div>
  )
}

// ── QUOTE BUILDER PANEL ───────────────────────────────────────────────────────
function QuotePanel({ pkg, onSave, onDepartureChange }: { pkg: Package; onSave: (data: any) => void; onDepartureChange: (date: string) => void }) {
  const [departureDate, setDepartureDate] = useState(pkg.departures.find(d => d.status !== 'sold-out')?.date || '')
  const [adults, setAdults] = useState(2)
  const [roomType, setRoomType] = useState<'double' | 'single' | 'triple'>('double')
  const [childrenWithBed, setChildrenWithBed] = useState(0)
  const [childrenWithoutBed, setChildrenWithoutBed] = useState(0)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)

  const cur = pkg.currency
  const f = (n: number) => fmtCurrency(n, cur)

  const byMonth = pkg.departures.reduce<Record<string, DepartureSlot[]>>((acc, d) => {
    const m = d.date.slice(0, 7)
    if (!acc[m]) acc[m] = []
    acc[m].push(d)
    return acc
  }, {})
  const monthKeys = Object.keys(byMonth)
  const [activeMonth, setActiveMonth] = useState('')
  useEffect(() => { if (monthKeys.length) setActiveMonth(monthKeys[0]) }, [pkg.id])
  useEffect(() => { onDepartureChange(departureDate) }, [departureDate])

  const roomSupplement = roomType === 'single'
    ? (pkg.singlePrice ? pkg.singlePrice - pkg.basePrice : pkg.singleSupplement)
    : roomType === 'triple' ? -pkg.tripleReduction : 0
  const pricePerAdult = pkg.basePrice + (roomType === 'single' ? (pkg.singlePrice ? pkg.singlePrice - pkg.basePrice : pkg.singleSupplement) : roomType === 'triple' ? -pkg.tripleReduction : 0)
  const adultTotal = pkg.basePrice * adults + (roomType === 'single' ? (pkg.singlePrice ? (pkg.singlePrice - pkg.basePrice) * adults : pkg.singleSupplement * adults) : roomType === 'triple' ? -pkg.tripleReduction * adults : 0)
  const cwbTotal = (pkg.childWithBedPrice || 0) * childrenWithBed
  const cwobTotal = (pkg.childWithoutBedPrice || 0) * childrenWithoutBed
  const addOnsTotal = pkg.addOns.filter(a => selectedAddOns.includes(a.id)).reduce((s, a) => s + a.price * (adults + childrenWithBed + childrenWithoutBed), 0)
  const totalPrice = adultTotal + cwbTotal + cwobTotal + addOnsTotal
  const tacTotal = pkg.tacAdult * adults + pkg.tacChild * (childrenWithBed + childrenWithoutBed)

  const toggleAddOn = (id: string) => setSelectedAddOns(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const selectedDep = pkg.departures.find(d => d.date === departureDate)
  const hasChildren = pkg.hasPrice && (pkg.childWithBedPrice !== undefined || pkg.childWithoutBedPrice !== undefined)
  const totalPax = adults + childrenWithBed + childrenWithoutBed

  // Pill counter component
  const PillCounter = ({ label, subLabel, value, onDec, onInc, min = 0, max = 45 }: { label: string; subLabel?: string; value: number; onDec: () => void; onInc: () => void; min?: number; max?: number }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
        {subLabel && <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 1 }}>{subLabel}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--rule)', borderRadius: 24, overflow: 'hidden', background: 'white' }}>
        <button onClick={onDec} disabled={value <= min} style={{ width: 36, height: 36, background: 'none', border: 'none', fontSize: 18, cursor: value <= min ? 'not-allowed' : 'pointer', color: value <= min ? 'var(--ink-light)' : 'var(--ink)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', minWidth: 28, textAlign: 'center' }}>{value}</span>
        <button onClick={onInc} disabled={value >= max} style={{ width: 36, height: 36, background: 'none', border: 'none', fontSize: 18, cursor: value >= max ? 'not-allowed' : 'pointer', color: value >= max ? 'var(--ink-light)' : 'var(--ink)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
    </div>
  )

  return (
    <>
      <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden', position: 'sticky', top: 20 }}>

        {/* 1. Top Price Block — calmer, more breathing room, lighter green */}
        <div style={{ background: 'var(--teal)', padding: '26px 22px 20px' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.16em', fontWeight: 600, marginBottom: 8 }}>QUOTE BUILDER</div>
          <div className="font-tight" style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 16 }}>{f(totalPrice)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>{adults} Adult{adults > 1 ? 's' : ''} · {f(pricePerAdult)} each</span>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{f(adultTotal)}</span>
            </div>
            {childrenWithBed > 0 && pkg.childWithBedPrice && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>{childrenWithBed} Child w/ bed · {f(pkg.childWithBedPrice)}</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{f(cwbTotal)}</span>
              </div>
            )}
            {childrenWithoutBed > 0 && pkg.childWithoutBedPrice && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>{childrenWithoutBed} Child w/o bed · {f(pkg.childWithoutBedPrice)}</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{f(cwobTotal)}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 2. Select Departure — stronger selected state, subtle month context */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 12 }}>SELECT DEPARTURE</div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 0, borderBottom: '1px solid var(--rule)', marginBottom: 10 }}>
              {monthKeys.map(m => (
                <button key={m} onClick={() => setActiveMonth(m)} style={{
                  padding: '6px 12px', background: 'none', border: 'none',
                  borderBottom: activeMonth === m ? '2px solid var(--teal)' : '2px solid transparent',
                  marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: 11, fontWeight: activeMonth === m ? 700 : 400,
                  color: activeMonth === m ? 'var(--teal)' : 'var(--ink-light)',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}>
                  {new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                  <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--ink-light)', fontWeight: 400 }}>({byMonth[m]?.length})</span>
                </button>
              ))}
            </div>
            {activeMonth && byMonth[activeMonth] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {byMonth[activeMonth].map(slot => (
                  <button key={slot.date} onClick={() => { if (slot.status !== 'sold-out') setDepartureDate(slot.date) }}
                    disabled={slot.status === 'sold-out'}
                    style={{
                      padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: departureDate === slot.date ? '2px solid var(--teal)' : '1px solid var(--rule)',
                      background: departureDate === slot.date ? 'var(--teal-lt)' : 'white',
                      cursor: slot.status === 'sold-out' ? 'not-allowed' : 'pointer',
                      opacity: slot.status === 'sold-out' ? 0.45 : 1,
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 13, fontWeight: departureDate === slot.date ? 700 : 500, color: departureDate === slot.date ? 'var(--teal)' : 'var(--ink-mid)' }}>
                      {new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ ...STATUS_STYLE[slot.status], padding: '2px 7px', fontSize: 9, fontWeight: 600, borderRadius: 2, letterSpacing: '0.04em' }}>
                      {STATUS_LABEL[slot.status]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Passengers — lighter backgrounds, consistent row height, refined steppers */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 10 }}>PASSENGERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

              {/* Adults row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid rgba(10,110,94,0.25)', background: 'rgba(10,110,94,0.04)', borderRadius: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(10,110,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Adults</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 400, marginTop: 1 }}>{f(pkg.basePrice)} per adult</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(10,110,94,0.3)', borderRadius: 20, overflow: 'hidden', background: '#fff' }}>
                  <button onClick={() => setAdults(a => Math.max(1, a - 1))} style={{ width: 28, height: 28, background: 'none', border: 'none', fontSize: 15, cursor: adults <= 1 ? 'not-allowed' : 'pointer', color: 'var(--teal)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', minWidth: 20, textAlign: 'center' }}>{adults}</span>
                  <button onClick={() => setAdults(a => Math.min(45, a + 1))} style={{ width: 28, height: 28, background: 'none', border: 'none', fontSize: 15, cursor: adults >= 45 ? 'not-allowed' : 'pointer', color: 'var(--teal)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>

              {/* Children rows */}
              {hasChildren && (
                <>
                  {pkg.childWithBedPrice !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${childrenWithBed > 0 ? 'rgba(232,97,58,0.3)' : 'var(--rule)'}`, background: childrenWithBed > 0 ? 'rgba(232,97,58,0.04)' : '#fff', borderRadius: 4, transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: childrenWithBed > 0 ? 'rgba(232,97,58,0.08)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={childrenWithBed > 0 ? 'var(--orange)' : 'var(--ink-light)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><line x1="12" y1="11" x2="12" y2="14"/><line x1="10" y1="13" x2="14" y2="13"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Child — With Bed</div>
                          <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 400, marginTop: 1 }}>Age 2–11 · {f(pkg.childWithBedPrice)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${childrenWithBed > 0 ? 'rgba(232,97,58,0.3)' : 'var(--rule)'}`, borderRadius: 20, overflow: 'hidden', background: '#fff' }}>
                        <button onClick={() => setChildrenWithBed(c => Math.max(0, c - 1))} style={{ width: 28, height: 28, background: 'none', border: 'none', fontSize: 15, cursor: childrenWithBed <= 0 ? 'not-allowed' : 'pointer', color: 'var(--orange)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', minWidth: 20, textAlign: 'center' }}>{childrenWithBed}</span>
                        <button onClick={() => setChildrenWithBed(c => c + 1)} style={{ width: 28, height: 28, background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', color: 'var(--orange)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </div>
                  )}
                  {pkg.childWithoutBedPrice !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${childrenWithoutBed > 0 ? 'rgba(2,132,199,0.3)' : 'var(--rule)'}`, background: childrenWithoutBed > 0 ? 'rgba(2,132,199,0.04)' : '#fff', borderRadius: 4, transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: childrenWithoutBed > 0 ? 'rgba(2,132,199,0.08)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={childrenWithoutBed > 0 ? '#0284c7' : 'var(--ink-light)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Child — Without Bed</div>
                          <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 400, marginTop: 1 }}>Age 2–11 · {f(pkg.childWithoutBedPrice)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${childrenWithoutBed > 0 ? 'rgba(2,132,199,0.3)' : 'var(--rule)'}`, borderRadius: 20, overflow: 'hidden', background: '#fff' }}>
                        <button onClick={() => setChildrenWithoutBed(c => Math.max(0, c - 1))} style={{ width: 28, height: 28, background: 'none', border: 'none', fontSize: 15, cursor: childrenWithoutBed <= 0 ? 'not-allowed' : 'pointer', color: '#0284c7', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', minWidth: 20, textAlign: 'center' }}>{childrenWithoutBed}</span>
                        <button onClick={() => setChildrenWithoutBed(c => c + 1)} style={{ width: 28, height: 28, background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', color: '#0284c7', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 4. Room Type — cleaner active state, tighter spacing, right-aligned price impact */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 10 }}>ROOM TYPE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { id: 'double', label: 'Double / Twin', note: 'Base price' },
                { id: 'single', label: 'Single Room', note: pkg.singlePrice ? `${f(pkg.singlePrice)} / person` : `+${f(pkg.singleSupplement)}` },
                { id: 'triple', label: 'Triple Sharing', note: `−${f(pkg.tripleReduction)}` },
              ].map(r => (
                <button key={r.id} onClick={() => setRoomType(r.id as any)} style={{
                  padding: '9px 12px', border: roomType === r.id ? '1.5px solid var(--teal)' : '1px solid var(--rule)',
                  background: roomType === r.id ? 'var(--teal-lt)' : 'white',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 12, fontWeight: roomType === r.id ? 700 : 500, color: roomType === r.id ? 'var(--teal)' : 'var(--ink-mid)' }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 400 }}>{r.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Optional Add-ons — quieter, tighter */}
          {pkg.addOns.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.12em', marginBottom: 8 }}>OPTIONAL ADD-ONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pkg.addOns.map(a => (
                  <label key={a.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                    border: `1px solid ${selectedAddOns.includes(a.id) ? 'var(--rule)' : 'var(--rule)'}`,
                    background: selectedAddOns.includes(a.id) ? 'var(--teal-lt)' : 'var(--bg)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    <input type="checkbox" checked={selectedAddOns.includes(a.id)} onChange={() => toggleAddOn(a.id)} style={{ accentColor: 'var(--teal)', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-mid)', fontWeight: 500 }}>{a.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>+{fmt(a.price)}/pp</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 6. Price Breakdown — cleaner box, stronger total hierarchy */}
          <div style={{ border: '1px solid var(--rule)', padding: '14px 16px', background: '#fff' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 10 }}>PRICE BREAKDOWN (NET)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)', fontWeight: 400 }}>
                <span>{f(pkg.basePrice)} × {adults} adult{adults > 1 ? 's' : ''}{roomType !== 'double' ? ` (${roomType})` : ''}</span>
                <span>{f(adultTotal)}</span>
              </div>
              {childrenWithBed > 0 && pkg.childWithBedPrice && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)', fontWeight: 400 }}>
                  <span>{f(pkg.childWithBedPrice)} × {childrenWithBed} child w/ bed</span>
                  <span>{f(cwbTotal)}</span>
                </div>
              )}
              {childrenWithoutBed > 0 && pkg.childWithoutBedPrice && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)', fontWeight: 400 }}>
                  <span>{f(pkg.childWithoutBedPrice)} × {childrenWithoutBed} child w/o bed</span>
                  <span>{f(cwobTotal)}</span>
                </div>
              )}
              {addOnsTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)', fontWeight: 400 }}>
                  <span>Add-ons</span><span>+{fmt(addOnsTotal)}</span>
                </div>
              )}
              {tacTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-light)', fontWeight: 400, marginTop: 2 }}>
                  <span>Agent Royalty (TAC)</span><span>{f(tacTotal)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="font-tight" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Net total</span>
                <span className="font-tight" style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal)' }}>{f(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* 7. Primary button — more space above, quieter helper text */}
          {pkg.hasPrice ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
              <button onClick={() => setShowModal(true)} className="btn-orange" style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700 }}>
                SAVE AS PROPOSAL →
              </button>
              <p style={{ fontSize: 10, color: 'var(--ink-light)', textAlign: 'center', fontWeight: 400 }}>Markup adjustable in the next step</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
              <a href={`https://wa.me/918928872400?text=${encodeURIComponent(`Hi GTF Team, I'd like to request pricing for ${pkg.name} (${pkg.nights}N/${pkg.days}D). Please share the nett rate and TAC so I can create a quote for my client.`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '15px', background: 'var(--orange)', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', boxSizing: 'border-box' }}>
                REQUEST PRICING →
              </a>
              <p style={{ fontSize: 10, color: 'var(--ink-light)', textAlign: 'center', fontWeight: 400 }}>Pricing not yet available — contact GTF team</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <SaveProposalModal
          pkg={pkg}
          summary={{ totalPrice, adults, childrenWithBed, childrenWithoutBed, roomType, departureDate, addOnsTotal, selectedAddOnLabels: pkg.addOns.filter(a => selectedAddOns.includes(a.id)).map(a => a.label), currency: pkg.currency }}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            setShowModal(false)
            await onSave({ ...data, totalPrice, adults, childrenWithBed, childrenWithoutBed, roomType, departureDate, addOnsTotal, selectedAddOns: pkg.addOns.filter(a => selectedAddOns.includes(a.id)), adultTotal, cwbTotal, cwobTotal })
          }}
        />
      )}
    </>
  )
}

// ── HOTEL IMAGES ──────────────────────────────────────────────────────────────
const HOTEL_IMAGES: Record<string, string> = {
  'Paris':        'https://static.wixstatic.com/media/226760_aaf73d04b8b845e488c4736ee77ba918~mv2.jpg',
  'Amsterdam':    'https://static.wixstatic.com/media/226760_707548668df94335af359cb5fad6fc5c~mv2.jpg',
  'Rome':         'https://static.wixstatic.com/media/226760_9cbf836a8b9e4896844bfd57f3ef8213~mv2.jpg',
  'Venice / Mestre': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&q=80',
  'Florence Area':'https://images.unsplash.com/photo-1543429257-3eb0b9c580b4?w=400&q=80',
  'Zurich':       'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&q=80',
  'Interlaken':   'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
  'Brussels':     'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400&q=80',
  'Frankfurt':    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80',
  'Prague':       'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&q=80',
  'Vienna':       'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=80',
  'London':       'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
  'Milan':        'https://images.unsplash.com/photo-1478005405000-f02f57bb0769?w=400&q=80',
  'Lucerne':      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'Budapest':     'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80',
  'Munich':       'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400&q=80',
  'Cairo':        'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=80',
  'Nile Cruise':  'https://images.unsplash.com/photo-1569519024219-3e272822ab04?w=400&q=80',
  'Cairo–Aswan Sleeper Train': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6c?w=400&q=80',
  'Hurghada':     'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=400&q=80',
  'Cape Town':    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=400&q=80',
  'Garden Route': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
  'Sun City':     'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80',
  'Johannesburg': 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=400&q=80',
  'Mauritius':    'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=400&q=80',
  'Narita':       'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&q=80',
  'Tokyo':        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
  'Nagoya':       'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80',
  'Hiroshima':    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80',
  'Osaka':        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
  'Kansai':       'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&q=80',
  'Istanbul':     'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
  'Ankara':       'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&q=80',
  'Cappadocia':   'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&q=80',
  'Antalya':      'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=400&q=80',
  'Pamukkale':    'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=400&q=80',
  'Kusadasi':     'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&q=80',
  'Ho Chi Minh City': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80',
  'Da Nang':      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80',
  'Hanoi':        'https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?w=400&q=80',
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const pkg = PACKAGES.find(p => p.id === id)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(pkg?.departures.find(d => d.status !== 'sold-out')?.date || '')

  if (!pkg) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Package not found. <Link href="/dashboard/packages" style={{ color: 'var(--teal)' }}>Back to packages</Link></p>
    </div>
  )

  const flightsIncluded = pkg.flights?.included === true
  const similarPkgs = PACKAGES.filter(p => p.id !== pkg.id).sort((a, b) => {
    if (a.region === pkg.region && b.region !== pkg.region) return -1
    if (b.region === pkg.region && a.region !== pkg.region) return 1
    return 0
  }).slice(0, 3)

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/quotes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.id, package_name: pkg.name, region: pkg.region,
          departure_date: data.departureDate, adults: data.adults,
          children_with_bed: data.childrenWithBed, children_without_bed: data.childrenWithoutBed,
          room_type: data.roomType, base_price: pkg.basePrice, currency: pkg.currency,
          markup_type: data.markup_type, markup_value: data.markup_value,
          markup_amount: data.markup_amount, add_ons: data.selectedAddOns || [],
          add_ons_total: data.addOnsTotal || 0, total_price: data.final_total,
          client_name: data.client_name, client_type: data.client_type,
          trip_name: data.trip_name, estimated_booking_date: data.estimated_booking_date,
          flights_booked: data.flights_booked, notes: data.notes,
        }),
      })
      if (res.ok) { setSaved(true); setTimeout(() => router.push('/dashboard/quotes'), 1500) }
    } catch (e) { console.error(e) }
  }

  if (saved) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--teal-lt)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>
      <h2 className="font-tight" style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)' }}>Proposal Saved!</h2>
      <p style={{ color: 'var(--ink-light)' }}>Redirecting to My Quotes...</p>
    </div>
  )

  const pkgInfoItems = [
    { icon: ICONS.duration, label: 'DURATION', value: `${pkg.nights}N / ${pkg.days}D` },
    { icon: ICONS.group, label: 'GROUP SIZE', value: '25–45' },
    { icon: ICONS.hotel, label: 'HOTELS', value: `${pkg.starRating}★ Selected` },
    { icon: ICONS.meals, label: 'MEALS', value: 'As per itinerary' },
    { icon: ICONS.manager, label: 'TOUR MANAGER', value: 'Included' },
    {
      icon: flightsIncluded ? ICONS.flightOn : ICONS.flightOff,
      label: 'FLIGHTS',
      value: flightsIncluded ? `Included · Ex ${pkg.flights!.exCity}` : 'Land only',
      valueColor: flightsIncluded ? '#7fe8cc' : 'rgba(255,255,255,0.6)',
    },
  ]

  const hasInclusionsTab = pkg.region !== 'europe' && pkg.inclusions.length > 0
  const TABS = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'itinerary', label: 'ITINERARY' },
    ...(flightsIncluded ? [{ id: 'flights', label: 'FLIGHTS' }] : []),
    { id: 'hotels', label: 'HOTELS' },
    ...(hasInclusionsTab ? [{ id: 'inclusions', label: 'INCLUSIONS' }] : []),
    ...(hasInclusionsTab && pkg.exclusions.length > 0 ? [{ id: 'exclusions', label: 'EXCLUSIONS' }] : []),
  ] as { id: string; label: string }[]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '10px 24px' }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ink-light)', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/packages" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Packages</Link>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pkg.name}</span>
        </div>
      </div>

      {/* ── FULL-BLEED GALLERY ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 420, background: '#071a17', overflow: 'hidden' }}>
        {/* Main image */}
        <img src={pkg.gallery[galleryIdx]} alt={pkg.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'opacity 0.3s' }} />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.92) 0%, rgba(7,26,23,0.3) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,26,23,0.4) 0%, transparent 60%)' }} />

        {/* Tag */}
        {pkg.tag && <div style={{ position: 'absolute', top: 20, left: 24, padding: '4px 12px', background: 'var(--orange)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', zIndex: 2 }}>{pkg.tag}</div>}

        {/* Thumbnail strip — vertical, right side */}
        <div style={{ position: 'absolute', right: 16, top: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
          {pkg.gallery.map((img, i) => (
            <div key={i} onClick={() => setGalleryIdx(i)} style={{
              width: 64, flex: 1, maxHeight: 70, overflow: 'hidden', cursor: 'pointer',
              border: `2px solid ${galleryIdx === i ? '#fff' : 'rgba(255,255,255,0.2)'}`,
              opacity: galleryIdx === i ? 1 : 0.6, transition: 'all 0.2s', borderRadius: 2,
            }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Package info — bottom overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 90, padding: '24px 24px 20px', zIndex: 2 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 6 }}>{pkg.region.toUpperCase()}</div>
          <h1 className="font-tight" style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>{pkg.name}</h1>
          {pkg.tagline && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 14, lineHeight: 1.4 }}>{pkg.tagline}</p>}
          {/* Info strip */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {pkgInfoItems.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon path={h.icon} size={14} color="rgba(255,255,255,0.5)" />
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.06em' }}>{h.label}</div>
                  <div style={{ fontSize: 12, color: (h as any).valueColor || 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{h.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* TAB BAR */}
            <div style={{ background: 'white', borderBottom: '2px solid var(--rule)', display: 'flex', marginBottom: 0, position: 'sticky', top: 0, zIndex: 10 }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
                  padding: '14px 20px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--teal)' : 'transparent'}`,
                  marginBottom: -2, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  color: activeTab === tab.id ? 'var(--teal)' : 'var(--ink-light)',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>
                  {tab.label}
                </button>
              ))}
              {/* Traveler tags pushed right */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px', gap: 6 }}>
                {pkg.travelerTypes.slice(0, 3).map(t => (
                  <span key={t} style={{ padding: '3px 8px', background: 'var(--teal-lt)', fontSize: 10, color: 'var(--teal)', fontWeight: 600, borderRadius: 2 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* TAB CONTENT */}
            <div style={{ background: 'white', border: '1px solid var(--rule)', borderTop: 'none', padding: '24px 28px', marginBottom: 20 }}>

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div>
                  {pkg.tagline && (
                    <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic', borderLeft: '3px solid var(--teal)', paddingLeft: 16 }}>{pkg.tagline}</p>
                  )}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>★ TRIP HIGHLIGHTS</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {pkg.highlights.map((h, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 5 }} />
                            <span style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ITINERARY TAB */}
              {activeTab === 'itinerary' && (
                <div>
                  {pkg.itinerary && pkg.itinerary.length > 0 ? (
                    <DayItinerary itinerary={pkg.itinerary} />
                  ) : (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-light)', fontSize: 13 }}>
                      Detailed day-wise itinerary available in the PDF brochure below.
                    </div>
                  )}
                  {pkg.workdriveUrl && (
                    <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: 'var(--bg)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 12, fontWeight: 600, textDecoration: 'none', marginTop: 20 }}>
                      📄 VIEW DETAILED ITINERARY (PDF) ↗
                    </a>
                  )}
                </div>
              )}

              {/* FLIGHTS TAB */}
              {activeTab === 'flights' && flightsIncluded && (
                <FlightsTab pkg={pkg} selectedDepartureDate={selectedDepartureDate} />
              )}

              {/* HOTELS TAB */}
              {activeTab === 'hotels' && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>ACCOMMODATION</div>
                  {pkg.hotels.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {pkg.hotels.map((h, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 140px 1fr 120px 120px', gap: 14, padding: '14px 0', borderBottom: i < pkg.hotels.length - 1 ? '1px solid var(--rule)' : 'none', alignItems: 'center' }}>
                            <div style={{ width: 80, height: 60, overflow: 'hidden' }}>
                              <img src={HOTEL_IMAGES[h.city] || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80'} alt={h.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 3 }}>CITY</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{h.city}</div>
                              <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{h.nights} night{h.nights > 1 ? 's' : ''}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)', marginBottom: 3 }}>{h.name}</div>
                              <div style={{ display: 'flex', gap: 1 }}>
                                {'★'.repeat(h.stars).split('').map((_, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 11 }}>★</span>)}
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{h.roomType}</div>
                            <div style={{ fontSize: 11, padding: '4px 10px', background: 'var(--teal-lt)', color: 'var(--teal)', fontWeight: 600, textAlign: 'center' }}>{h.meal}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-light)', fontStyle: 'italic' }}>* Hotels or equivalent. Subject to availability at time of booking.</p>
                    </>
                  ) : (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-light)', fontSize: 13 }}>Hotel details available in the PDF brochure.</div>
                  )}
                </div>
              )}

              {/* INCLUSIONS TAB */}
              {activeTab === 'inclusions' && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 20 }}>WHAT'S INCLUDED</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pkg.inclusions.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontSize: 11, color: '#065f46' }}>✓</span>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXCLUSIONS TAB */}
              {activeTab === 'exclusions' && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 20 }}>WHAT'S NOT INCLUDED</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pkg.exclusions.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontSize: 11, color: '#991b1b' }}>✕</span>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Similar Packages */}
            {similarPkgs.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>SIMILAR PACKAGES</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {similarPkgs.map(sp => (
                    <Link key={sp.id} href={`/dashboard/packages/${sp.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ border: '1px solid var(--rule)', overflow: 'hidden', background: 'white', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }} className="pkg-card">
                        <div style={{ height: 160, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                          <img src={sp.img} alt={sp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.7) 0%, transparent 50%)' }} />
                          <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 3 }}>{sp.region.toUpperCase()} · {sp.nights}N/{sp.days}D</div>
                          </div>
                          {sp.tag && <div style={{ position: 'absolute', top: 10, left: 10, padding: '2px 7px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>{sp.tag}</div>}
                        </div>
                        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>{sp.name}</div>
                          <div>
                            <div className="font-tight" style={{ fontSize: 15, fontWeight: 800, color: 'var(--teal)', marginBottom: 8 }}>
                              {fmtCurrency(sp.basePrice, sp.currency)}
                            </div>
                            <div style={{ padding: '8px 0', background: 'var(--teal)', color: '#fff', fontSize: 10, fontWeight: 700, textAlign: 'center', letterSpacing: '0.06em' }}>
                              VIEW PACKAGE →
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Quote panel */}
          <QuotePanel pkg={pkg} onSave={handleSave} onDepartureChange={setSelectedDepartureDate} />
        </div>
      </div>
    </div>
  )
}
