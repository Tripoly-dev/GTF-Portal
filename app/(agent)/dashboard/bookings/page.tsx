'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtPrice = (n: number) => n ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Pending',   bg: '#FEF3C7', color: '#92400E' },
  confirmed: { label: 'Confirmed', bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#991B1B' },
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

  useEffect(() => {
    fetch('/api/bookings/list')
      .then(r => r.json())
      .then(d => setBookings(d.bookings || []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>MY BOOKINGS</div>
            <h1 className="font-tight" style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', margin: 0 }}>Booking Requests</h1>
          </div>
          <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>← Dashboard</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total', n: counts.all, color: 'var(--teal)' },
            { label: 'Pending', n: counts.pending, color: '#92400E' },
            { label: 'Confirmed', n: counts.confirmed, color: '#065F46' },
            { label: 'Cancelled', n: counts.cancelled, color: '#991B1B' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', border: '1px solid var(--rule)', borderRadius: 12, padding: '20px 24px' }}>
              <div className="font-tight" style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', border: '1.5px solid var(--rule)', borderRadius: 6, background: filter === f ? 'var(--ink)' : 'white', color: filter === f ? '#fff' : 'var(--ink-mid)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize' }}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', border: '1px solid var(--rule)', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No bookings yet</div>
              <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>Convert a sent proposal to a booking to get started.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg)' }}>
                  {['Package', 'Departure', 'Passengers', 'Total', 'Deposit', 'Status', 'Created', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const st = STATUS[b.status] || STATUS.pending
                  const pax = (b.adults || 0) + (b.children_with_bed || 0) + (b.children_without_bed || 0)
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--rule)', background: i % 2 === 0 ? 'white' : 'var(--bg)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{b.package_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Ref: {b.id.slice(0, 8).toUpperCase()}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{fmtDate(b.departure_date)}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{pax} pax</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{fmtPrice(b.total_price)}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{fmtPrice(b.deposit_amount)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4, background: st.bg, color: st.color, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--ink-light)' }}>{fmtDate(b.created_at)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link href={`/dashboard/bookings/${b.id}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', textDecoration: 'none' }}>View →</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
