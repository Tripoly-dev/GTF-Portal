'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PaymentSummaryStrip from '@/components/bookings/PaymentSummaryStrip'
import PaymentHistoryTable from '@/components/bookings/PaymentHistoryTable'
import RecordPaymentModal from '@/components/bookings/RecordPaymentModal'
import type { Payment } from '@/components/bookings/types'

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
const fmtPrice = (n: number) => n ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Awaiting Confirmation', bg: '#FEF3C7', color: '#92400E' },
  confirmed: { label: 'Confirmed',             bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Cancelled',             bg: '#FEE2E2', color: '#991B1B' },
}

export default function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [balanceDueDate, setBalanceDueDate] = useState('')
  const [savingDueDate, setSavingDueDate] = useState(false)

  const fetchPayments = () => {
    fetch(`/api/bookings/${id}/payments`)
      .then(r => r.json())
      .then(d => setPayments(d.payments || []))
  }

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => { if (r.status === 403) { router.push('/login'); return r.json() } return r.json() })
      .then(d => { setBooking(d.booking); setAgent(d.agent); setBalanceDueDate(d.booking?.balance_due_date?.slice(0, 10) || '') })
      .finally(() => setLoading(false))
    fetchPayments()
  }, [id])

  const updateStatus = async (status: 'confirmed' | 'cancelled') => {
    setUpdating(true)
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (res.ok) setBooking(data.booking)
    setUpdating(false)
  }

  const handleDeletePayment = async (payment: Payment) => {
    if (!confirm('Delete this payment record?')) return
    const res = await fetch(`/api/bookings/${id}/payments/${payment.id}`, { method: 'DELETE' })
    if (res.ok) setPayments(prev => prev.filter(p => p.id !== payment.id))
  }

  const handleConfirmPayment = async (payment: Payment) => {
    setConfirmingId(payment.id)
    const res = await fetch(`/api/bookings/${id}/payments/${payment.id}/confirm`, { method: 'PUT' })
    const data = await res.json()
    if (res.ok) setPayments(prev => prev.map(p => p.id === payment.id ? data.payment : p))
    setConfirmingId(null)
  }

  const handleSaveDueDate = async () => {
    setSavingDueDate(true)
    const res = await fetch(`/api/bookings/${id}/balance-due-date`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance_due_date: balanceDueDate }),
    })
    const data = await res.json()
    if (res.ok) setBooking(data.booking)
    else alert(data.error || 'Failed to update balance due date')
    setSavingDueDate(false)
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Loading...</div>
  if (!booking) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Booking not found</div>

  const st = STATUS[booking.status] || STATUS.pending
  const passengers = booking.passengers || []
  const pax = (booking.adults || 0) + (booking.children_with_bed || 0) + (booking.children_without_bed || 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-light)', marginBottom: 24 }}>
          <Link href="/admin" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Admin</Link>
          <span>→</span>
          <Link href="/admin/bookings" style={{ color: 'var(--teal)', textDecoration: 'none' }}>All Bookings</Link>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{booking.id.slice(0, 8).toUpperCase()}</span>
        </div>

        {/* Header */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '28px 32px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>BOOKING REF: {booking.id.slice(0, 8).toUpperCase()}</div>
              <h1 className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>{booking.package_name}</h1>
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                {[
                  { l: 'AGENT', v: agent?.full_name || '—' },
                  { l: 'AGENCY', v: agent?.agency_name || '—' },
                  { l: 'EMAIL', v: agent?.email || '—' },
                  { l: 'DEPARTURE', v: fmtDate(booking.departure_date) },
                  { l: 'PASSENGERS', v: `${pax} pax` },
                  { l: 'TOTAL', v: fmtPrice(booking.total_price) },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 9, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 6, background: st.bg, color: st.color, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</span>
              {booking.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => updateStatus('confirmed')} disabled={updating} style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: updating ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                    {updating ? '...' : '✓ Confirm Booking'}
                  </button>
                  <button onClick={() => updateStatus('cancelled')} disabled={updating} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: updating ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                  </button>
                </div>
              )}
              {booking.confirmed_at && (
                <div style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>Confirmed: {fmtDate(booking.confirmed_at)}</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Passengers */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '24px 28px' }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>PASSENGER DETAILS</div>
            {passengers.map((p: any, i: number) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--rule)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{p.name}</div>
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

          {/* Payment + Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '24px' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>PAYMENT SCHEDULE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { l: 'Total Amount', v: fmtPrice(booking.total_price), bold: true },
                  { l: 'Deposit', v: fmtPrice(booking.deposit_amount) },
                  { l: 'Deposit Due', v: fmtDate(booking.deposit_due_date) },
                  { l: 'Balance', v: fmtPrice(booking.balance_amount), color: '#9e2233' },
                  { l: 'Payment Mode', v: booking.payment_mode || '—' },
                ].map(({ l, v, bold, color }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: bold ? 800 : 600, color: color || 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-light)', flexShrink: 0 }}>Balance Due</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="date" value={balanceDueDate} onChange={e => setBalanceDueDate(e.target.value)} style={{
                      fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', border: '1px solid var(--rule)', borderRadius: 6,
                      padding: '5px 8px', fontFamily: "'DM Sans', sans-serif",
                    }} />
                    {balanceDueDate !== (booking.balance_due_date?.slice(0, 10) || '') && (
                      <button onClick={handleSaveDueDate} disabled={savingDueDate} style={{
                        padding: '5px 10px', borderRadius: 6, border: 'none', background: 'var(--teal)', color: '#fff',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: savingDueDate ? 0.6 : 1,
                      }}>
                        {savingDueDate ? '...' : 'SAVE'}
                      </button>
                    )}
                  </div>
                </div>
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

        {/* Payments */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div className="eyebrow">PAYMENTS</div>
            <button onClick={() => { setEditingPayment(null); setShowRecordModal(true) }} className="btn-teal">
              + RECORD PAYMENT
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <PaymentSummaryStrip totalPrice={booking.total_price} payments={payments} />
          </div>

          <PaymentHistoryTable
            payments={payments}
            isAdmin={true}
            confirmingId={confirmingId}
            onEdit={p => { setEditingPayment(p); setShowRecordModal(true) }}
            onDelete={handleDeletePayment}
            onConfirm={handleConfirmPayment}
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
