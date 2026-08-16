'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES, Package } from '@/data/packages'

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

// ── SAVE PROPOSAL MODAL ───────────────────────────────────────────────────────
function SaveProposalModal({
  pkg, summary, onClose, onSave,
}: {
  pkg: Package
  summary: { totalPrice: number; adults: number; roomType: string; departureDate: string; addOnsTotal: number; selectedAddOns: string[] }
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [form, setForm] = useState({
    client_name: '', client_type: 'repeat', trip_name: pkg.name,
    estimated_booking_date: '', flights_booked: false, notes: '',
    markup_type: 'percentage', markup_value: 0,
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  // Calculate markup
  const markupAmount = form.markup_type === 'percentage'
    ? (summary.totalPrice * form.markup_value) / 100
    : Number(form.markup_value)
  const finalTotal = summary.totalPrice + markupAmount

  const handleSave = async () => {
    if (!form.client_name.trim()) { alert('Client name is required'); return }
    setSaving(true)
    await onSave({
      ...form,
      markup_value: Number(form.markup_value),
      markup_amount: markupAmount,
      final_total: finalTotal,
    })
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Save Proposal</h2>
            <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 4 }}>{pkg.name} · {fmtDate(summary.departureDate)}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink-light)' }}>✕</button>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Price summary */}
          <div style={{ background: 'var(--teal-lt)', border: '1px solid var(--rule)', padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>PRICE SUMMARY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
              <span>{summary.adults} adult{summary.adults > 1 ? 's' : ''} × {summary.roomType} room</span>
              <span>{fmt(summary.totalPrice - summary.addOnsTotal)}</span>
            </div>
            {summary.addOnsTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
                <span>Add-ons ({summary.selectedAddOns.join(', ')})</span>
                <span>{fmt(summary.addOnsTotal)}</span>
              </div>
            )}
            {markupAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
                <span>Your markup ({form.markup_type === 'percentage' ? `${form.markup_value}%` : 'fixed'})</span>
                <span>+ {fmt(markupAmount)}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--rule)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span className="font-tight" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Total for client</span>
              <span className="font-tight" style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)' }}>{fmt(finalTotal)}</span>
            </div>
          </div>

          {/* Client details */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>CLIENT DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CLIENT NAME *</label>
                <input className="input-field" required placeholder="Full name of the client" value={form.client_name} onChange={set('client_name')} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CLIENT TYPE</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['repeat', 'walk-in', 'referred', 'corporate', 'family/friend', 'community'].map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, client_type: t }))} style={{
                      padding: '6px 14px', border: '1.5px solid var(--rule)',
                      background: form.client_type === t ? 'var(--teal)' : 'white',
                      color: form.client_type === t ? '#fff' : 'var(--ink-mid)',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
                      transition: 'all 0.15s',
                    }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Proposal details */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>PROPOSAL DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>TRIP NAME</label>
                <input className="input-field" placeholder="Name for this proposal" value={form.trip_name} onChange={set('trip_name')} />
                <p style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 4 }}>This name is shared with the client</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>EST. BOOKING DATE</label>
                  <input type="date" className="input-field" value={form.estimated_booking_date} onChange={set('estimated_booking_date')} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>FLIGHTS BOOKED?</label>
                  <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
                    {['Yes', 'No'].map(v => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: 'var(--ink-mid)' }}>
                        <input type="radio" name="flights" value={v} checked={form.flights_booked === (v === 'Yes')} onChange={() => setForm(f => ({ ...f, flights_booked: v === 'Yes' }))} />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Markup */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>YOUR MARKUP</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="number" min="0" placeholder="0"
                className="input-field" style={{ maxWidth: 120 }}
                value={form.markup_value || ''}
                onChange={e => setForm(f => ({ ...f, markup_value: Number(e.target.value) }))}
              />
              <select className="input-field" style={{ maxWidth: 160 }} value={form.markup_type} onChange={set('markup_type')}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
              {markupAmount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--teal)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  = +{fmt(markupAmount)}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>NOTES (INTERNAL)</label>
            <textarea className="input-field" rows={2} placeholder="Any internal notes about this proposal..." value={form.notes} onChange={set('notes')} style={{ resize: 'none' }} />
          </div>

          {/* Final price */}
          <div style={{ background: 'var(--ink)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 4 }}>FINAL QUOTE FOR CLIENT</div>
              <div className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{fmt(finalTotal)}</div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-teal" style={{ whiteSpace: 'nowrap' }}>
              {saving ? 'SAVING...' : 'SAVE PROPOSAL →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── QUOTE BUILDER PAGE ────────────────────────────────────────────────────────
export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const pkg = PACKAGES.find(p => p.id === id)

  const [departureDate, setDepartureDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [roomType, setRoomType] = useState<'double' | 'single' | 'triple'>('double')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (pkg?.departures.length) setDepartureDate(pkg.departures[0])
  }, [pkg])

  if (!pkg) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Package not found. <Link href="/dashboard/packages" style={{ color: 'var(--teal)' }}>Back to packages</Link></p>
    </div>
  )

  // ── PRICE CALCULATION ──────────────────────────────────────────────────────
  const roomSupplement = roomType === 'single' ? pkg.singleSupplement : roomType === 'triple' ? -pkg.tripleReduction : 0
  const pricePerPerson = pkg.basePrice + roomSupplement
  const landTotal = pricePerPerson * adults
  const addOnsTotal = pkg.addOns.filter(a => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.price * adults, 0)
  const totalPrice = landTotal + addOnsTotal
  const pricePerPersonFinal = totalPrice / adults

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSave = async (proposalData: any) => {
    try {
      const res = await fetch('/api/quotes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.id,
          package_name: pkg.name,
          region: pkg.region,
          departure_date: departureDate,
          adults,
          room_type: roomType,
          base_price: pkg.basePrice,
          markup_type: proposalData.markup_type,
          markup_value: proposalData.markup_value,
          markup_amount: proposalData.markup_amount,
          add_ons: pkg.addOns.filter(a => selectedAddOns.includes(a.id)),
          add_ons_total: addOnsTotal,
          total_price: totalPrice + proposalData.markup_amount,
          client_name: proposalData.client_name,
          client_type: proposalData.client_type,
          trip_name: proposalData.trip_name,
          estimated_booking_date: proposalData.estimated_booking_date,
          flights_booked: proposalData.flights_booked,
          notes: proposalData.notes,
        }),
      })
      if (res.ok) {
        setShowModal(false)
        setSaved(true)
        setTimeout(() => router.push('/dashboard/quotes'), 1500)
      }
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  if (saved) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--teal-lt)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>
      <h2 className="font-tight" style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)' }}>Proposal Saved!</h2>
      <p style={{ color: 'var(--ink-light)' }}>Redirecting to My Quotes...</p>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '14px 40px' }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ink-light)', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/packages" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Packages</Link>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pkg.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

        {/* Left — Package info */}
        <div>
          {/* Hero image */}
          <div style={{ position: 'relative', height: 320, overflow: 'hidden', marginBottom: 28 }}>
            <img src={pkg.img} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.8) 0%, transparent 60%)' }} />
            {pkg.tag && <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 10px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>{pkg.tag}</div>}
            <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>{pkg.region.toUpperCase()}</div>
              <h1 className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{pkg.name}</h1>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{pkg.nights} Nights · {pkg.days} Days</div>
            </div>
          </div>

          {/* Package highlights */}
          <div style={{ background: 'white', border: '1px solid var(--rule)', padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>PACKAGE HIGHLIGHTS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '🌍', label: 'Duration', value: `${pkg.nights} Nights / ${pkg.days} Days` },
                { icon: '👥', label: 'Group Size', value: '25–45 passengers' },
                { icon: '🏨', label: 'Hotels', value: 'Carefully selected / Equivalent' },
                { icon: '🍽', label: 'Meals', value: 'As per itinerary' },
                { icon: '🎯', label: 'Tour Manager', value: 'Included on departure' },
                { icon: '✈', label: 'Flights', value: 'Not included (land only)' },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 2 }}>{h.label.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-mid)', fontWeight: 500 }}>{h.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View itinerary */}
          {pkg.workdriveUrl && (
            <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--paper)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em' }}>
              📄 VIEW DETAILED ITINERARY (PDF) ↗
            </a>
          )}
        </div>

        {/* Right — Quote Builder */}
        <div style={{ position: 'sticky', top: 20 }}>
          <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: 6 }}>QUOTE BUILDER</div>
              <div className="font-tight" style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{fmt(totalPrice)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                {fmt(pricePerPersonFinal)} per person · {adults} adult{adults > 1 ? 's' : ''}
              </div>
            </div>

            <div style={{ padding: '24px' }}>

              {/* Departure date */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>DEPARTURE DATE</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
                  {pkg.departures.map(d => (
                    <button key={d} onClick={() => setDepartureDate(d)} style={{
                      padding: '10px 14px', border: `1.5px solid ${departureDate === d ? 'var(--teal)' : 'var(--rule)'}`,
                      background: departureDate === d ? 'var(--teal-lt)' : 'white',
                      color: departureDate === d ? 'var(--teal)' : 'var(--ink-mid)',
                      fontSize: 12, fontWeight: departureDate === d ? 700 : 500,
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.15s',
                    }}>
                      {fmtDate(d)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adults */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>NUMBER OF ADULTS</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button onClick={() => setAdults(a => Math.max(1, a - 1))}
                    style={{ width: 36, height: 36, border: '1.5px solid var(--rule)', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>−</button>
                  <span className="font-tight" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', minWidth: 32, textAlign: 'center' }}>{adults}</span>
                  <button onClick={() => setAdults(a => Math.min(45, a + 1))}
                    style={{ width: 36, height: 36, border: '1.5px solid var(--rule)', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>+</button>
                  <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Max 45</span>
                </div>
              </div>

              {/* Room type */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>ROOM TYPE</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { id: 'double', label: 'Double / Twin Sharing', note: 'Base price', extra: 0 },
                    { id: 'single', label: 'Single Room', note: `+${fmt(pkg.singleSupplement)} supplement`, extra: pkg.singleSupplement },
                    { id: 'triple', label: 'Triple Sharing', note: `−${fmt(pkg.tripleReduction)} reduction`, extra: -pkg.tripleReduction },
                  ].map(r => (
                    <button key={r.id} onClick={() => setRoomType(r.id as any)} style={{
                      padding: '10px 14px', border: `1.5px solid ${roomType === r.id ? 'var(--teal)' : 'var(--rule)'}`,
                      background: roomType === r.id ? 'var(--teal-lt)' : 'white',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: roomType === r.id ? 'var(--teal)' : 'var(--ink-mid)' }}>{r.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 500 }}>{r.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              {pkg.addOns.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>OPTIONAL ADD-ONS</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.addOns.map(a => (
                      <label key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', border: `1.5px solid ${selectedAddOns.includes(a.id) ? 'var(--teal)' : 'var(--rule)'}`, background: selectedAddOns.includes(a.id) ? 'var(--teal-lt)' : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>
                        <input type="checkbox" checked={selectedAddOns.includes(a.id)} onChange={() => toggleAddOn(a.id)} style={{ marginTop: 2, accentColor: 'var(--teal)' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{a.label}</span>
                            <span style={{ color: 'var(--teal)' }}>+{fmt(a.price)}/pp</span>
                          </div>
                          {a.note && <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{a.note}</div>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 10 }}>PRICE BREAKDOWN</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)' }}>
                    <span>Base ({fmt(pricePerPerson)} × {adults})</span>
                    <span>{fmt(landTotal)}</span>
                  </div>
                  {addOnsTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mid)' }}>
                      <span>Add-ons</span>
                      <span>+{fmt(addOnsTotal)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 8, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <span className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Total (land only)</span>
                    <span className="font-tight" style={{ fontSize: 16, fontWeight: 800, color: 'var(--teal)' }}>{fmt(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button onClick={() => setShowModal(true)} className="btn-orange" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 13 }}>
                SAVE AS PROPOSAL →
              </button>
              <p style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
                You can add your markup in the next step
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <SaveProposalModal
          pkg={pkg}
          summary={{ totalPrice, adults, roomType, departureDate, addOnsTotal, selectedAddOns: pkg.addOns.filter(a => selectedAddOns.includes(a.id)).map(a => a.label) }}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
