'use client'
import type { Payment } from './types'

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export default function PaymentSummaryStrip({ totalPrice, payments }: { totalPrice: number; payments: Payment[] }) {
  const paid = payments.filter(p => p.confirmed).reduce((s, p) => s + (p.amount || 0), 0)
  const balance = Math.max(0, (totalPrice || 0) - paid)

  const stats = [
    { label: 'TOTAL AMOUNT', value: fmt(totalPrice || 0), color: 'var(--ink)' },
    { label: 'AMOUNT PAID', value: fmt(paid), color: 'var(--ok)' },
    { label: 'BALANCE REMAINING', value: fmt(balance), color: balance > 0 ? 'var(--brand)' : 'var(--ok)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '18px 22px' }}>
          <div className="font-tight" style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.04em', marginTop: 6 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
