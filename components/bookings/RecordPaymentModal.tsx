'use client'
import { useState } from 'react'
import { PAYMENT_MODES, type Payment } from './types'

function inputStyle(): React.CSSProperties {
  return {
    width: '100%', padding: '10px 12px', border: '1.5px solid var(--rule)',
    borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box', background: 'white', color: 'var(--ink)',
  }
}
function labelStyle(): React.CSSProperties {
  return { fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }
}

type Props = {
  bookingId: string
  payment?: Payment
  onClose: () => void
  onSaved: (payment: Payment) => void
}

export default function RecordPaymentModal({ bookingId, payment, onClose, onSaved }: Props) {
  const isEdit = !!payment
  const [amount, setAmount] = useState(payment ? String(payment.amount) : '')
  const [paymentDate, setPaymentDate] = useState(payment?.payment_date?.slice(0, 10) || new Date().toISOString().slice(0, 10))
  const [paymentMode, setPaymentMode] = useState(payment?.payment_mode || '')
  const [referenceNumber, setReferenceNumber] = useState(payment?.reference_number || '')
  const [remarks, setRemarks] = useState(payment?.remarks || '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) { setError('Amount must be greater than 0'); return }
    if (!paymentDate) { setError('Payment date is required'); return }
    if (!paymentMode) { setError('Payment mode is required'); return }
    setError('')
    setSubmitting(true)
    try {
      const url = isEdit
        ? `/api/bookings/${bookingId}/payments/${payment!.id}`
        : `/api/bookings/${bookingId}/payments`
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          payment_date: paymentDate,
          payment_mode: paymentMode,
          reference_number: referenceNumber || null,
          remarks: remarks || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        onSaved(data.payment)
      } else {
        setError(data.error || 'Failed to save payment')
      }
    } catch {
      setError('A network error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', borderRadius: 12, boxShadow: '0 24px 64px rgba(7,26,23,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', fontFamily: "'Playfair Display', serif" }}>{isEdit ? 'Edit Payment' : 'Record Payment'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-light)', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#991B1B' }}>{error}</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle()}>AMOUNT (₹)</label>
              <input type="number" min="1" style={inputStyle()} value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 50000" />
            </div>
            <div>
              <label style={labelStyle()}>PAYMENT DATE</label>
              <input type="date" style={inputStyle()} value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle()}>PAYMENT MODE</label>
              <select style={inputStyle()} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                <option value="">Select mode</option>
                {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle()}>REFERENCE NUMBER (OPTIONAL)</label>
              <input style={inputStyle()} value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} placeholder="Transaction / UTR / cheque no." />
            </div>
            <div>
              <label style={labelStyle()}>REMARKS (OPTIONAL)</label>
              <textarea rows={3} style={{ ...inputStyle(), resize: 'none' }} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any additional notes..." />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting} className="btn-teal" style={{ width: '100%', justifyContent: 'center', marginTop: 24, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
