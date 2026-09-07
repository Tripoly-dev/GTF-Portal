'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
const fmtPrice = (n: number) => n ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Awaiting Confirmation', bg: '#FEF3C7', color: '#92400E' },
  confirmed: { label: 'Confirmed',             bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Cancelled',             bg: '#FEE2E2', color: '#991B1B' },
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking, setBooking] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(d => { setBooking(d.booking); setAgent(d.agent) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Loading booking...</div>
  if (!booking) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Booking not found</div>

  const st = STATUS[booking.status] || STATUS.pending
  const passengers = booking.passengers || []
  const pax = (booking.adults || 0) + (booking.children_with_bed || 0) + (booking.children_without_bed || 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-light)', marginBottom: 24 }}>
          <Link href="/dashboard" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/bookings" style={{ color: 'var(--teal)', textDecoration: 'none' }}>My Bookings</Link>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{booking.package_name}</span>
        </div>

        {/* Header */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '28px 32px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>BOOKING REF: {booking.id.slice(0, 8).toUpperCase()}</div>
              <h1 className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>{booking.package_name}</h1>
              <div style={{ display: 'flex', gap: 28 }}>
                {[
                  { l: 'DEPARTURE', v: fmtDate(booking.departure_date) },
                  { l: 'PASSENGERS', v: `${pax} pax` },
                  { l: 'TOTAL', v: fmtPrice(booking.total_price) },
                  { l: 'SUBMITTED', v: fmtDate(booking.created_at) },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 9, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 6, background: st.bg, color: st.color, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{st.label.toUpperCase()}</span>
          </div>
          {booking.confirmed_at && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: '#D1FAE5', borderRadius: 6, fontSize: 12, color: '#065F46', fontWeight: 600 }}>
              ✓ Confirmed on {fmtDate(booking.confirmed_at)}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Passengers */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '24px 28px' }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>PASSENGER DETAILS</div>
            {passengers.map((p: any, i: number) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--rule)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { l: 'Passport No', v: p.passport_number },
                        { l: 'Date of Issue', v: fmtDate(p.doi) },
                        { l: 'Date of Expiry', v: fmtDate(p.doe) },
                      ].map(({ l, v }) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 2 }}>{l.toUpperCase()}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {p.passport_url && (
                    <a href={p.passport_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', textDecoration: 'none', border: '1px solid var(--teal)', padding: '6px 12px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                      📄 View Passport
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '24px' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>PAYMENT SCHEDULE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'Total Amount', v: fmtPrice(booking.total_price), bold: true },
                  { l: 'Deposit', v: fmtPrice(booking.deposit_amount) },
                  { l: 'Deposit Due', v: fmtDate(booking.deposit_due_date) },
                  { l: 'Balance', v: fmtPrice(booking.balance_amount), color: '#9e2233' },
                  { l: 'Balance Due', v: fmtDate(booking.balance_due_date) },
                  { l: 'Payment Mode', v: booking.payment_mode || '—' },
                ].map(({ l, v, bold, color }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: bold ? 800 : 600, color: color || 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {booking.notes && (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '20px 24px' }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>NOTES</div>
                <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.6, margin: 0 }}>{booking.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
