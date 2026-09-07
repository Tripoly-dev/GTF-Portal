'use client'
import { useState } from 'react'

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'NEFT/RTGS']

function inputStyle(error?: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '10px 12px', border: `1.5px solid ${error ? '#ef4444' : 'var(--rule)'}`,
    borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box', background: 'white', color: 'var(--ink)',
    transition: 'border-color 0.15s',
  }
}

function labelStyle(): React.CSSProperties {
  return { fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }
}

type Passenger = {
  name: string
  passport_number: string
  doi: string
  doe: string
  passport_file: File | null
  passport_url: string
  uploading: boolean
  upload_error: string
}

function makePassenger(): Passenger {
  return { name: '', passport_number: '', doi: '', doe: '', passport_file: null, passport_url: '', uploading: false, upload_error: '' }
}

type Props = {
  quote: any
  pkg: any
  onClose: () => void
  onSuccess: () => void
}

export default function BookingModal({ quote, pkg, onClose, onSuccess }: Props) {
  const totalPax = (quote.adults || 1) + (quote.children_with_bed || 0) + (quote.children_without_bed || 0)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [passengers, setPassengers] = useState<Passenger[]>(
    Array(totalPax).fill(null).map(() => makePassenger())
  )

  const [payment, setPayment] = useState({
    deposit_amount: '',
    deposit_due_date: '',
    balance_due_date: '',
    payment_mode: '',
    notes: '',
  })

  const balanceAmount = Math.max(0, (quote.total_price || 0) - (Number(payment.deposit_amount) || 0))

  // ── Upload passport ────────────────────────────────────────────────────────
  const uploadPassport = async (idx: number, file: File) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, uploading: true, upload_error: '' } : p))
    try {
      const fd = new FormData()
      fd.append('passport', file)
      fd.append('booking_id', quote.id)
      fd.append('passenger_name', passengers[idx].name || `passenger-${idx + 1}`)
      const res = await fetch('/api/bookings/upload-passport', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, passport_url: data.url, passport_file: file, uploading: false } : p))
      } else {
        setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, uploading: false, upload_error: data.error || 'Upload failed' } : p))
      }
    } catch {
      setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, uploading: false, upload_error: 'Upload failed' } : p))
    }
  }

  const updatePassenger = (idx: number, field: keyof Passenger, value: any) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  // ── Validate steps ─────────────────────────────────────────────────────────
  const validateStep1 = () => {
    for (const p of passengers) {
      if (!p.name.trim()) { setError('All passenger names are required'); return false }
      if (!p.passport_number.trim()) { setError('All passport numbers are required'); return false }
      if (!p.doi) { setError('Date of Issue is required for all passengers'); return false }
      if (!p.doe) { setError('Date of Expiry is required for all passengers'); return false }
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    if (!payment.deposit_amount || Number(payment.deposit_amount) <= 0) { setError('Deposit amount is required'); return false }
    if (!payment.deposit_due_date) { setError('Deposit due date is required'); return false }
    if (!payment.balance_due_date) { setError('Balance due date is required'); return false }
    if (!payment.payment_mode) { setError('Payment mode is required'); return false }
    setError('')
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => s + 1)
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const passengersData = passengers.map(p => ({
        name: p.name.trim(),
        passport_number: p.passport_number.trim(),
        doi: p.doi,
        doe: p.doe,
        passport_url: p.passport_url || null,
      }))

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: quote.id,
          package_id: quote.package_id,
          package_name: quote.package_name,
          departure_date: quote.departure_date,
          adults: quote.adults,
          children_with_bed: quote.children_with_bed || 0,
          children_without_bed: quote.children_without_bed || 0,
          total_price: quote.total_price,
          passengers: passengersData,
          deposit_amount: Number(payment.deposit_amount),
          deposit_due_date: payment.deposit_due_date,
          balance_amount: balanceAmount,
          balance_due_date: payment.balance_due_date,
          payment_mode: payment.payment_mode,
          notes: payment.notes || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        onSuccess()
      } else {
        setError(data.error || 'Failed to create booking')
      }
    } catch {
      setError('A network error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const STEPS = ['Passengers', 'Payment', 'Review']

  const paxLabel = (i: number) => {
    if (i < (quote.adults || 1)) return `Adult ${i + 1}`
    const cwb = quote.children_with_bed || 0
    const childIdx = i - (quote.adults || 1)
    if (childIdx < cwb) return `Child ${childIdx + 1} (with bed)`
    return `Child ${childIdx - cwb + 1} (without bed)`
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 640, maxHeight: '92vh', overflowY: 'auto', borderRadius: 16, boxShadow: '0 32px 80px rgba(7,26,23,0.25)' }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>Convert to Booking</div>
            <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>{quote.trip_name} · Proposal No: {quote.quote_number}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--ink-light)', lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', padding: '20px 28px 0', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? 'var(--teal)' : step === i + 1 ? 'var(--teal)' : 'var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= i + 1 ? '#fff' : 'var(--ink-light)', fontSize: 13, fontWeight: 700, marginBottom: 6, transition: 'all 0.2s' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: step >= i + 1 ? 'var(--teal)' : 'var(--ink-light)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{s.toUpperCase()}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height: 2, flex: 1, background: step > i + 1 ? 'var(--teal)' : 'var(--rule)', marginBottom: 24, transition: 'all 0.2s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '16px 28px 0', padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#991B1B' }}>{error}</div>
        )}

        <div style={{ padding: '24px 28px 28px' }}>

          {/* ── STEP 1: PASSENGERS ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>
                Enter details for all <strong style={{ color: 'var(--ink)' }}>{totalPax} passenger{totalPax > 1 ? 's' : ''}</strong> exactly as per passport.
              </div>
              {passengers.map((p, idx) => (
                <div key={idx} style={{ background: 'var(--bg)', borderRadius: 10, padding: '20px', marginBottom: 16, border: '1px solid var(--rule)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: 16 }}>{paxLabel(idx).toUpperCase()}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle()}>FULL NAME (AS PER PASSPORT)</label>
                      <input style={inputStyle(!!(!p.name && error))} value={p.name} onChange={e => updatePassenger(idx, 'name', e.target.value)} placeholder="e.g. KAUSHIK CHAUHAN" />
                    </div>
                    <div>
                      <label style={labelStyle()}>PASSPORT NUMBER</label>
                      <input style={inputStyle(!!(!p.passport_number && error))} value={p.passport_number} onChange={e => updatePassenger(idx, 'passport_number', e.target.value.toUpperCase())} placeholder="e.g. P1234567" />
                    </div>
                    <div>
                      <label style={labelStyle()}>DATE OF ISSUE</label>
                      <input type="date" style={inputStyle(!!(!p.doi && error))} value={p.doi} onChange={e => updatePassenger(idx, 'doi', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle()}>DATE OF EXPIRY</label>
                      <input type="date" style={inputStyle(!!(!p.doe && error))} value={p.doe} onChange={e => updatePassenger(idx, 'doe', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle()}>PASSPORT COPY (JPG/PNG/PDF · MAX 2MB)</label>
                      {p.passport_url ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#d1fae5', borderRadius: 6, border: '1px solid #6ee7b7' }}>
                          <span style={{ fontSize: 16 }}>✓</span>
                          <span style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>Passport uploaded successfully</span>
                          <button onClick={() => updatePassenger(idx, 'passport_url', '')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#065f46', textDecoration: 'underline' }}>Remove</button>
                        </div>
                      ) : (
                        <div>
                          <input type="file" accept=".jpg,.jpeg,.png,.pdf" id={`passport-${idx}`} style={{ display: 'none' }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadPassport(idx, f) }} />
                          <label htmlFor={`passport-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', border: '2px dashed var(--rule)', borderRadius: 6, cursor: p.uploading ? 'not-allowed' : 'pointer', fontSize: 13, color: 'var(--ink-light)', background: 'white', transition: 'all 0.15s' }}>
                            {p.uploading ? '⏳ Uploading...' : '📎 Click to upload passport'}
                          </label>
                          {p.upload_error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{p.upload_error}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--teal-lt)', borderRadius: 10, padding: '16px 20px', border: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Total Package Amount</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal)', fontFamily: "'DM Sans', sans-serif" }}>₹{(quote.total_price || 0).toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle()}>DEPOSIT AMOUNT (₹)</label>
                  <input type="number" style={inputStyle()} value={payment.deposit_amount} onChange={e => setPayment(p => ({ ...p, deposit_amount: e.target.value }))} placeholder="e.g. 50000" />
                </div>
                <div>
                  <label style={labelStyle()}>DEPOSIT DUE DATE</label>
                  <input type="date" style={inputStyle()} value={payment.deposit_due_date} onChange={e => setPayment(p => ({ ...p, deposit_due_date: e.target.value }))} />
                </div>
              </div>

              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '14px 16px', border: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Balance Amount</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#9e2233' }}>₹{balanceAmount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle()}>BALANCE DUE DATE</label>
                  <input type="date" style={inputStyle()} value={payment.balance_due_date} onChange={e => setPayment(p => ({ ...p, balance_due_date: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle()}>PAYMENT MODE</label>
                  <select style={inputStyle()} value={payment.payment_mode} onChange={e => setPayment(p => ({ ...p, payment_mode: e.target.value }))}>
                    <option value="">Select mode</option>
                    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle()}>INTERNAL NOTES (OPTIONAL)</label>
                <textarea style={{ ...inputStyle(), resize: 'none' } as any} rows={3} value={payment.notes} onChange={e => setPayment(p => ({ ...p, notes: e.target.value }))} placeholder="Any special requests or notes..." />
              </div>
            </div>
          )}

          {/* ── STEP 3: REVIEW ── */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>Review all details before submitting the booking request.</div>

              {/* Package summary */}
              <div style={{ background: 'var(--teal-lt)', borderRadius: 10, padding: '16px 20px', marginBottom: 16, border: '1px solid var(--rule)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: 10 }}>PACKAGE DETAILS</div>
                {[
                  { l: 'Package', v: quote.trip_name },
                  { l: 'Client', v: quote.client_name },
                  { l: 'Departure', v: new Date(quote.departure_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { l: 'Passengers', v: `${quote.adults} Adult${quote.adults > 1 ? 's' : ''}${(quote.children_with_bed || 0) + (quote.children_without_bed || 0) > 0 ? ` + ${(quote.children_with_bed || 0) + (quote.children_without_bed || 0)} Children` : ''}` },
                  { l: 'Total Amount', v: `₹${(quote.total_price || 0).toLocaleString('en-IN')}` },
                ].map(({ l, v }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Passengers summary */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.1em', marginBottom: 10 }}>PASSENGERS</div>
                {passengers.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rule)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{paxLabel(i)} · Passport: {p.passport_number}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-light)' }}>
                      <div>DOI: {p.doi}</div>
                      <div>DOE: {p.doe}</div>
                      {p.passport_url && <div style={{ color: '#16a34a', fontWeight: 600 }}>✓ Passport uploaded</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment summary */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.1em', marginBottom: 10 }}>PAYMENT SCHEDULE</div>
                {[
                  { l: 'Deposit', v: `₹${Number(payment.deposit_amount).toLocaleString('en-IN')} due by ${payment.deposit_due_date}` },
                  { l: 'Balance', v: `₹${balanceAmount.toLocaleString('en-IN')} due by ${payment.balance_due_date}` },
                  { l: 'Payment Mode', v: payment.payment_mode },
                ].map(({ l, v }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--rule)' }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: '14px 16px', background: '#FEF3C7', borderRadius: 8, border: '1px solid #FDE68A', fontSize: 12, color: '#92400E' }}>
                ⚠ Once submitted, this booking will be sent to GTF team for confirmation. The proposal status will change to "Booking".
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '13px', background: 'none', border: '1.5px solid var(--rule)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)', fontFamily: "'DM Sans', sans-serif" }}>
                ← Back
              </button>
            )}
            {step < STEPS.length ? (
              <button onClick={handleNext} className="btn-teal" style={{ flex: 2, justifyContent: 'center' }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-teal" style={{ flex: 2, justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? '⏳ Submitting...' : '✓ Submit Booking Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
