'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES, Package, DepartureSlot } from '@/data/packages'

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
const fmtMonth = (d: string) => new Date(d + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  'available':    { background: '#D1FAE5', color: '#065F46' },
  'fast-filling': { background: '#FEF3C7', color: '#92400E' },
  'sold-out':     { background: '#FEE2E2', color: '#991B1B' },
}
const STATUS_LABEL: Record<string, string> = {
  'available': 'AVAILABLE', 'fast-filling': 'FAST FILLING', 'sold-out': 'SOLD OUT',
}

const EX_CITIES = ['Mumbai', 'Delhi', 'Ahmedabad', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune']

// ── SAVE PROPOSAL MODAL ───────────────────────────────────────────────────────
function SaveProposalModal({ pkg, summary, onClose, onSave }: {
  pkg: Package
  summary: { totalPrice: number; adults: number; roomType: string; departureDate: string; addOnsTotal: number; selectedAddOnLabels: string[] }
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [form, setForm] = useState({
    client_name: '', client_type: 'repeat', trip_name: pkg.name,
    estimated_booking_date: '', flights_booked: false, notes: '',
    markup_type: 'percentage', markup_value: 4, ex_city: 'Mumbai',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const markupAmount = form.markup_type === 'percentage'
    ? (summary.totalPrice * Number(form.markup_value)) / 100
    : Number(form.markup_value)
  const finalTotal = summary.totalPrice + markupAmount

  const handleSave = async () => {
    if (!form.client_name.trim()) { alert('Client name is required'); return }
    setSaving(true)
    await onSave({ ...form, markup_value: Number(form.markup_value), markup_amount: markupAmount, final_total: finalTotal })
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 580, maxHeight: '92vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ background: 'var(--ink)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', marginBottom: 4 }}>SAVE PROPOSAL</div>
            <h2 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{pkg.name}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{fmtDate(summary.departureDate)} · {summary.adults} adults · {summary.roomType}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Price summary */}
          <div style={{ background: 'var(--teal-lt)', border: '1px solid var(--rule)', padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>PRICE SUMMARY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
              <span>Land package ({summary.adults} pax · {summary.roomType})</span>
              <span>{fmt(summary.totalPrice - summary.addOnsTotal)}</span>
            </div>
            {summary.addOnsTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
                <span>Add-ons</span><span>+ {fmt(summary.addOnsTotal)}</span>
              </div>
            )}
            {markupAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--orange)', marginBottom: 6 }}>
                <span>Your markup ({form.markup_type === 'percentage' ? `${form.markup_value}%` : 'fixed'})</span>
                <span>+ {fmt(markupAmount)}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--rule)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Client quote total</span>
              <span className="font-tight" style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)' }}>{fmt(finalTotal)}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 4, textAlign: 'right' }}>
              {fmt(Math.round(finalTotal / summary.adults))} per person
            </div>
          </div>

          {/* Markup */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>YOUR MARKUP</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="number" min="0" className="input-field" style={{ maxWidth: 100 }}
                value={form.markup_value} onChange={e => setForm(f => ({ ...f, markup_value: Number(e.target.value) }))} />
              <select className="input-field" style={{ maxWidth: 160 }} value={form.markup_type} onChange={set('markup_type')}>
                <option value="percentage">% Percentage</option>
                <option value="fixed">₹ Fixed Amount</option>
              </select>
              {markupAmount > 0 && <span style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 700, whiteSpace: 'nowrap' }}>= +{fmt(markupAmount)}</span>}
            </div>
          </div>

          {/* Client details */}
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

          {/* Proposal details */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>PROPOSAL DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>TRIP NAME</label>
                <input className="input-field" value={form.trip_name} onChange={set('trip_name')} />
                <p style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 4 }}>Shared with client in all correspondence</p>
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

          {/* Save button */}
          <button onClick={handleSave} disabled={saving} className="btn-teal" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14, marginTop: 4 }}>
            {saving ? 'SAVING PROPOSAL...' : `SAVE PROPOSAL — ${fmt(finalTotal)} →`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── QUOTE BUILDER PANEL ───────────────────────────────────────────────────────
function QuotePanel({ pkg, onSave }: { pkg: Package; onSave: (data: any) => void }) {
  const [departureDate, setDepartureDate] = useState(pkg.departures.find(d => d.status !== 'sold-out')?.date || '')
  const [adults, setAdults] = useState(2)
  const [roomType, setRoomType] = useState<'double' | 'single' | 'triple'>('double')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)

  // Group departures by month
  const byMonth = pkg.departures.reduce<Record<string, DepartureSlot[]>>((acc, d) => {
    const m = d.date.slice(0, 7)
    if (!acc[m]) acc[m] = []
    acc[m].push(d)
    return acc
  }, {})

  const monthKeys = Object.keys(byMonth)
  const [activeMonth, setActiveMonth] = useState('')
  useEffect(() => { if (monthKeys.length) setActiveMonth(monthKeys[0]) }, [pkg.id])

  const roomSupplement = roomType === 'single' ? pkg.singleSupplement : roomType === 'triple' ? -pkg.tripleReduction : 0
  const pricePerPerson = pkg.basePrice + roomSupplement
  const landTotal = pricePerPerson * adults
  const addOnsTotal = pkg.addOns.filter(a => selectedAddOns.includes(a.id)).reduce((s, a) => s + a.price * adults, 0)
  const totalPrice = landTotal + addOnsTotal
  const defaultMarkup = totalPrice * 0.04
  const clientTotal = totalPrice + defaultMarkup

  const toggleAddOn = (id: string) => setSelectedAddOns(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const selectedDep = pkg.departures.find(d => d.date === departureDate)

  return (
    <>
      <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden', position: 'sticky', top: 20 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', fontWeight: 700 }}>QUOTE BUILDER</div>
            <div style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>4% MARKUP</div>
          </div>
          <div className="font-tight" style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>{fmt(clientTotal)}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
            {fmt(Math.round(clientTotal / adults))} per person · {adults} adult{adults > 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Departure — month tabs + date grid */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 10 }}>SELECT DEPARTURE</div>
            {/* Month tab strip */}
            <div style={{ display: 'flex', overflowX: 'auto', gap: 0, borderBottom: '2px solid var(--rule)', marginBottom: 12 }}>
              {monthKeys.map(m => (
                <button key={m} onClick={() => setActiveMonth(m)} style={{
                  padding: '7px 14px', background: 'none', border: 'none',
                  borderBottom: activeMonth === m ? '2px solid var(--teal)' : '2px solid transparent',
                  marginBottom: -2, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: 12, fontWeight: activeMonth === m ? 700 : 500,
                  color: activeMonth === m ? 'var(--teal)' : 'var(--ink-light)',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}>
                  {new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                  <span style={{ marginLeft: 5, fontSize: 10, color: 'var(--ink-light)', fontWeight: 400 }}>({byMonth[m]?.length})</span>
                </button>
              ))}
            </div>
            {/* Dates for active month */}
            {activeMonth && byMonth[activeMonth] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {byMonth[activeMonth].map(slot => (
                  <button key={slot.date} onClick={() => { if (slot.status !== 'sold-out') setDepartureDate(slot.date) }}
                    disabled={slot.status === 'sold-out'}
                    style={{
                      padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: departureDate === slot.date ? '1.5px solid var(--teal)' : '1.5px solid var(--rule)',
                      background: departureDate === slot.date ? 'var(--teal-lt)' : 'white',
                      cursor: slot.status === 'sold-out' ? 'not-allowed' : 'pointer',
                      opacity: slot.status === 'sold-out' ? 0.5 : 1,
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 13, fontWeight: departureDate === slot.date ? 700 : 500, color: departureDate === slot.date ? 'var(--teal)' : 'var(--ink-mid)' }}>
                      {new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ ...STATUS_STYLE[slot.status], padding: '2px 8px', fontSize: 9, fontWeight: 700, borderRadius: 3 }}>
                      {STATUS_LABEL[slot.status]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Adults */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 10 }}>NUMBER OF ADULTS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => setAdults(a => Math.max(1, a - 1))} style={{ width: 34, height: 34, border: '1.5px solid var(--rule)', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>−</button>
              <span className="font-tight" style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', minWidth: 28, textAlign: 'center' }}>{adults}</span>
              <button onClick={() => setAdults(a => Math.min(45, a + 1))} style={{ width: 34, height: 34, border: '1.5px solid var(--rule)', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>+</button>
              <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>Max 45 pax</span>
            </div>
          </div>

          {/* Room type */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 10 }}>ROOM TYPE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'double', label: 'Double / Twin', note: 'Base price' },
                { id: 'single', label: 'Single Room', note: `+${fmt(pkg.singleSupplement)} supplement` },
                { id: 'triple', label: 'Triple Sharing', note: `−${fmt(pkg.tripleReduction)} reduction` },
              ].map(r => (
                <button key={r.id} onClick={() => setRoomType(r.id as any)} style={{
                  padding: '9px 12px', border: `1.5px solid ${roomType === r.id ? 'var(--teal)' : 'var(--rule)'}`,
                  background: roomType === r.id ? 'var(--teal-lt)' : 'white',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: roomType === r.id ? 'var(--teal)' : 'var(--ink-mid)' }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{r.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {pkg.addOns.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: 10 }}>OPTIONAL ADD-ONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {pkg.addOns.map(a => (
                  <label key={a.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 12px',
                    border: `1.5px solid ${selectedAddOns.includes(a.id) ? 'var(--teal)' : 'var(--rule)'}`,
                    background: selectedAddOns.includes(a.id) ? 'var(--teal-lt)' : 'white',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    <input type="checkbox" checked={selectedAddOns.includes(a.id)} onChange={() => toggleAddOn(a.id)} style={{ marginTop: 2, accentColor: 'var(--teal)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>
                        <span>{a.label}</span>
                        <span style={{ color: 'var(--teal)' }}>+{fmt(a.price)}/pp</span>
                      </div>
                      {a.note && <div style={{ fontSize: 10, color: 'var(--ink-light)', marginTop: 2 }}>{a.note}</div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div style={{ background: 'var(--teal-lt)', border: '1px solid var(--rule)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>PRICE BREAKDOWN (NET)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)' }}>
                <span>{fmt(pricePerPerson)} × {adults} pax</span><span>{fmt(landTotal)}</span>
              </div>
              {addOnsTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)' }}>
                  <span>Add-ons</span><span>+{fmt(addOnsTotal)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--orange)' }}>
                <span>Default markup (4%)</span><span>+{fmt(defaultMarkup)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="font-tight" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Client total</span>
                <span className="font-tight" style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)' }}>{fmt(clientTotal)}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setShowModal(true)} className="btn-orange" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700 }}>
            SAVE AS PROPOSAL →
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--teal-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--teal)', fontWeight: 800 }}>i</div>
            <p style={{ fontSize: 11, color: 'var(--ink-light)' }}>Markup is adjustable in the next step</p>
          </div>
        </div>
      </div>

      {showModal && (
        <SaveProposalModal
          pkg={pkg}
          summary={{ totalPrice, adults, roomType, departureDate, addOnsTotal, selectedAddOnLabels: pkg.addOns.filter(a => selectedAddOns.includes(a.id)).map(a => a.label) }}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            setShowModal(false)
            await onSave({ ...data, totalPrice, adults, roomType, departureDate, addOnsTotal, selectedAddOns: pkg.addOns.filter(a => selectedAddOns.includes(a.id)), pricePerPerson, landTotal })
          }}
        />
      )}
    </>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const pkg = PACKAGES.find(p => p.id === id)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [saved, setSaved] = useState(false)

  if (!pkg) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Package not found. <Link href="/dashboard/packages" style={{ color: 'var(--teal)' }}>Back to packages</Link></p>
    </div>
  )

  const similarPkgs = PACKAGES.filter(p => p.region === pkg.region && p.id !== pkg.id && p.tag !== 'COMING SOON').slice(0, 4)

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/quotes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.id, package_name: pkg.name, region: pkg.region,
          departure_date: data.departureDate, adults: data.adults, room_type: data.roomType,
          base_price: pkg.basePrice, markup_type: data.markup_type,
          markup_value: data.markup_value, markup_amount: data.markup_amount,
          add_ons: data.selectedAddOns || [], add_ons_total: data.addOnsTotal || 0,
          total_price: data.final_total,
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

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '12px 32px' }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ink-light)', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/packages" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Packages</Link>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pkg.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Gallery */}
            <div style={{ marginBottom: 24 }}>
              {/* Main image */}
              <div style={{ position: 'relative', height: 340, overflow: 'hidden', marginBottom: 8 }}>
                <img src={pkg.gallery[galleryIdx]} alt={pkg.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.75) 0%, transparent 55%)' }} />
                {pkg.tag && <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', background: 'var(--orange)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>{pkg.tag}</div>}
                <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>{pkg.region.toUpperCase()}</div>
                  <h1 className="font-tight" style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>{pkg.name}</h1>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{pkg.nights} Nights · {pkg.days} Days</span>
                    <div>{'★'.repeat(pkg.starRating).split('').map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>)}</div>
                  </div>
                </div>
              </div>
              {/* Thumbnail strip */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pkg.gallery.length}, 1fr)`, gap: 6 }}>
                {pkg.gallery.map((img, i) => (
                  <div key={i} onClick={() => setGalleryIdx(i)} style={{
                    height: 60, overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${galleryIdx === i ? 'var(--teal)' : 'transparent'}`,
                    opacity: galleryIdx === i ? 1 : 0.65, transition: 'all 0.2s',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Package info grid */}
            <div style={{ background: 'white', border: '1px solid var(--rule)', padding: '22px 26px', marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>PACKAGE HIGHLIGHTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { icon: '🌍', label: 'Duration', value: `${pkg.nights}N / ${pkg.days}D` },
                  { icon: '👥', label: 'Group Size', value: '25–45 passengers' },
                  { icon: '🏨', label: 'Hotels', value: `${pkg.starRating}★ Selected / Equivalent` },
                  { icon: '🍽', label: 'Meals', value: 'As per itinerary' },
                  { icon: '🎯', label: 'Tour Manager', value: 'Included' },
                  { icon: '✈', label: 'Flights', value: 'Land only (not included)' },
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 2 }}>{h.label.toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)', fontWeight: 500 }}>{h.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Tags */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--rule)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {pkg.travelerTypes.map(t => (
                  <span key={t} style={{ padding: '4px 10px', background: 'var(--teal-lt)', border: '1px solid var(--rule)', fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>{t}</span>
                ))}
                {pkg.themes.map(t => (
                  <span key={t} style={{ padding: '4px 10px', background: 'var(--orange-lt)', border: '1px solid rgba(232,97,58,0.2)', fontSize: 11, color: 'var(--orange)', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Hotels section */}
            {pkg.hotels.length > 0 && (
              <div style={{ background: 'white', border: '1px solid var(--rule)', padding: '22px 26px', marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>ACCOMMODATION</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {pkg.hotels.map((h, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 120px', gap: 16, padding: '14px 0', borderBottom: i < pkg.hotels.length - 1 ? '1px solid var(--rule)' : 'none', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 3 }}>CITY</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{h.city}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{h.nights} night{h.nights > 1 ? 's' : ''}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)' }}>{h.name}</div>
                        <div style={{ display: 'flex', gap: 1, marginTop: 3 }}>
                          {'★'.repeat(h.stars).split('').map((_, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 11 }}>★</span>)}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{h.roomType}</div>
                      <div style={{ fontSize: 11, padding: '3px 8px', background: 'var(--teal-lt)', color: 'var(--teal)', fontWeight: 600, textAlign: 'center' }}>{h.meal}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-light)', fontStyle: 'italic' }}>
                  * Hotels or equivalent. Subject to availability at time of booking.
                </div>
              </div>
            )}

            {/* View itinerary */}
            {pkg.workdriveUrl && (
              <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 24px', background: 'var(--paper)', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em', marginBottom: 32 }}>
                📄 VIEW DETAILED ITINERARY (PDF) ↗
              </a>
            )}

            {/* Similar packages */}
            {similarPkgs.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>SIMILAR PACKAGES</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {similarPkgs.map(sp => (
                    <Link key={sp.id} href={`/dashboard/packages/${sp.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ border: '1px solid var(--rule)', overflow: 'hidden', background: 'white', transition: 'all 0.2s' }} className="pkg-card">
                        <div style={{ height: 100, overflow: 'hidden' }}>
                          <img src={sp.img} alt={sp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                        </div>
                        <div style={{ padding: '10px 12px' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.2 }}>{sp.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>{sp.nights}N · {sp.days}D</div>
                          <div className="font-tight" style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)', marginTop: 4 }}>₹{sp.basePrice.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Quote panel */}
          <QuotePanel pkg={pkg} onSave={handleSave} />
        </div>
      </div>
    </div>
  )
}
