'use client'
import type { Payment } from './types'
import { money as fmt } from '@/lib/format'


export default function PaymentSummaryStrip({ totalPrice, payments }: { totalPrice: number; payments: Payment[] }) {
  const paid = payments.filter(p => p.confirmed).reduce((s, p) => s + (p.amount || 0), 0)
  const balance = Math.max(0, (totalPrice || 0) - paid)

  const stats = [
    { label: 'Total amount', value: fmt(totalPrice || 0), color: 'var(--ink)' },
    { label: 'Amount paid', value: fmt(paid), color: 'var(--ok)' },
    { label: 'Balance remaining', value: fmt(balance), color: balance > 0 ? 'var(--brand)' : 'var(--ok)' },
  ]

  return (
    <div className="rg-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '18px 22px' }}>
          <div className="font-tight" style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.04em', marginTop: 6 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
