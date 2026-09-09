'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'
import PaymentSummaryStrip from '@/components/bookings/PaymentSummaryStrip'
import PaymentHistoryTable from '@/components/bookings/PaymentHistoryTable'
import RecordPaymentModal from '@/components/bookings/RecordPaymentModal'
import type { Payment } from '@/components/bookings/types'

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
const fmtPrice = (n: number) => n ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Awaiting Confirmation', bg: '#92400E', color: '#fff' },
  confirmed: { label: 'Confirmed',             bg: '#0A7B6C', color: '#fff' },
  cancelled: { label: 'Cancelled',             bg: '#991B1B', color: '#fff' },
}

const ICONS = {
  calendar: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="4" width="18" height="18" rx="1" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  ),
  users: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  send: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
  ),
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking, setBooking] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  const fetchPayments = () => {
    fetch(`/api/bookings/${id}/payments`)
      .then(r => r.json())
      .then(d => setPayments(d.payments || []))
  }

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(d => { setBooking(d.booking); setAgent(d.agent) })
      .finally(() => setLoading(false))
    fetchPayments()
    fetch('/api/auth/me').then(r => r.json()).then(d => setCurrentUserId(d.agent?.id)).catch(() => {})
  }, [id])

  const handleDeletePayment = async (payment: Payment) => {
    if (!confirm('Delete this payment record?')) return
    const res = await fetch(`/api/bookings/${id}/payments/${payment.id}`, { method: 'DELETE' })
    if (res.ok) setPayments(prev => prev.filter(p => p.id !== payment.id))
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Loading booking...</div>
  if (!booking) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Booking not found</div>

  const st = STATUS[booking.status] || STATUS.pending
  const passengers = booking.passengers || []
  const pkg = PACKAGES.find(p => p.id === booking.package_id) || null
  const heroImg = pkg?.gallery?.[0] || pkg?.img || ''

  const paxParts = [`${booking.adults || 0} Adult${(booking.adults || 0) !== 1 ? 's' : ''}`]
  if (booking.children_with_bed > 0) paxParts.push(`${booking.children_with_bed} Child w/ Bed`)
  if (booking.children_without_bed > 0) paxParts.push(`${booking.children_without_bed} Child w/o Bed`)
  const paxStr = paxParts.join(' + ')

  const depositPct = booking.total_price ? Math.min(100, Math.round((booking.deposit_amount || 0) / booking.total_price * 100)) : 0

  const meta = [
    { l: 'DEPARTURE', v: fmtDate(booking.departure_date), icon: ICONS.calendar },
    { l: 'PASSENGERS', v: paxStr, icon: ICONS.users },
    { l: 'TOTAL', v: fmtPrice(booking.total_price), icon: <span style={{ fontSize: 11, fontWeight: 800 }}>₹</span> },
    { l: 'SUBMITTED', v: fmtDate(booking.created_at), icon: ICONS.send },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-light)', marginBottom: 24 }}>
          <Link href="/dashboard" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/bookings" style={{ color: 'var(--teal)', textDecoration: 'none' }}>My Bookings</Link>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{booking.package_name}</span>
        </div>

        {/* Hero card */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--rule)', boxShadow: '0 2px 10px rgba(7,26,23,0.06)', overflow: 'hidden', marginBottom: 24, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: st.bg, zIndex: 1 }} />
          {heroImg && (
            <div style={{ height: 340, overflow: 'hidden' }}>
              <img src={heroImg} alt={booking.package_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>BOOKING REF: {booking.id.slice(0, 8).toUpperCase()}</div>
                <h1 className="font-tight" style={{ fontSize: 30, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', margin: 0 }}>{booking.package_name}</h1>
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800,
                padding: '9px 18px', borderRadius: 20, background: st.bg, color: st.color,
                letterSpacing: '0.08em', whiteSpace: 'nowrap', boxShadow: `0 3px 10px ${st.bg}55`,
              }}>
                {booking.status === 'confirmed' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>}
                {st.label.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 32, marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--rule)', flexWrap: 'wrap' }}>
              {meta.map(({ l, v, icon }) => (
                <div key={l} style={{ flex: '1 1 140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--ink-light)', fontWeight: 700, letterSpacing: '0.1em' }}>
                    <span style={{ color: 'var(--teal)', display: 'flex' }}>{icon}</span>{l}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>

            {booking.confirmed_at && (
              <div style={{ marginTop: 22, padding: '12px 18px', background: 'var(--teal-lt)', borderLeft: '3px solid var(--teal)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth={2.5}><path d="M20 6 9 17l-5-5" /></svg>
                <span style={{ fontSize: 13, color: 'var(--teal-dark)', fontWeight: 700 }}>Confirmed on {fmtDate(booking.confirmed_at)}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Passengers */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--rule)', boxShadow: '0 2px 10px rgba(7,26,23,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="eyebrow">PASSENGER DETAILS</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-light)' }}>{paxStr}</span>
            </div>
            {passengers.map((p: any, i: number) => {
              const initials = (p.name || '').trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
              return (
                <div key={i} style={{ padding: '20px 28px', borderBottom: i < passengers.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 6, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{initials || '—'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
                        <div className="font-tight" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>{p.name}</div>
                        {p.passport_url && (
                          <a href={p.passport_url} target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: 'var(--ink-mid)',
                            textDecoration: 'none', border: '1px solid var(--rule)', borderRadius: 8, padding: '8px 13px', whiteSpace: 'nowrap',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; (e.currentTarget as HTMLElement).style.background = 'var(--teal-lt)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-mid)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
                            VIEW PASSPORT
                          </a>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {[
                          { l: 'Passport No', v: p.passport_number },
                          { l: 'Date of Issue', v: fmtDate(p.doi) },
                          { l: 'Date of Expiry', v: fmtDate(p.doe) },
                        ].map(({ l, v }) => (
                          <div key={l}>
                            <div style={{ fontSize: 9.5, color: 'var(--ink-light)', fontWeight: 700, letterSpacing: '0.08em' }}>{l.toUpperCase()}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-mid)', marginTop: 3 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--rule)', boxShadow: '0 2px 10px rgba(7,26,23,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--rule)' }}>
                <span className="eyebrow">PAYMENT SCHEDULE</span>
              </div>
              <div style={{ padding: '6px 28px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Total Amount</span>
                  <span className="font-tight" style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{fmtPrice(booking.total_price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Deposit Paid</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)' }}>{fmtPrice(booking.deposit_amount)}</span>
                </div>

                <div style={{ margin: '16px 0' }}>
                  <div style={{ height: 6, background: 'var(--rule)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${depositPct}%`, background: 'var(--teal)', borderRadius: 3, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-light)' }}>
                    <span>DEPOSIT RECEIVED</span>
                    <span>{depositPct}%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Deposit Due</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-mid)' }}>{fmtDate(booking.deposit_due_date)}</span>
                </div>
                <div style={{ background: '#FEF2F0', margin: '0 -28px', padding: '14px 28px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 14, borderBottom: '1px solid #fbe0db' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-mid)' }}>Balance Due</span>
                    <span className="font-tight" style={{ fontSize: 16, fontWeight: 800, color: '#9e2233' }}>{fmtPrice(booking.balance_amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0' }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Due Date</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#9e2233' }}>{fmtDate(booking.balance_due_date)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>Payment Mode</span>
                  <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.05em', background: 'var(--teal-lt)', color: 'var(--teal-dark)', borderRadius: 12, padding: '4px 12px' }}>{booking.payment_mode || '—'}</span>
                </div>
              </div>
            </div>
            {booking.notes && (
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--rule)', boxShadow: '0 2px 10px rgba(7,26,23,0.05)', padding: '20px 24px' }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>NOTES</div>
                <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.6, margin: 0 }}>{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payments */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div className="eyebrow">PAYMENTS</div>
            <button onClick={() => { setEditingPayment(null); setShowRecordModal(true) }} className="btn-teal">
              + RECORD PAYMENT
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <PaymentSummaryStrip totalPrice={booking.total_price} payments={payments} />
          </div>

          <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 16 }}>
            Balance Due: <span style={{ fontWeight: 700, color: 'var(--ink-mid)' }}>{fmtDate(booking.balance_due_date)}</span>
          </div>

          <PaymentHistoryTable
            payments={payments}
            isAdmin={false}
            currentUserId={currentUserId}
            onEdit={p => { setEditingPayment(p); setShowRecordModal(true) }}
            onDelete={handleDeletePayment}
          />
        </div>
      </div>

      {showRecordModal && (
        <RecordPaymentModal
          bookingId={id}
          payment={editingPayment || undefined}
          onClose={() => { setShowRecordModal(false); setEditingPayment(null) }}
          onSaved={() => { setShowRecordModal(false); setEditingPayment(null); fetchPayments() }}
        />
      )}
    </div>
  )
}
