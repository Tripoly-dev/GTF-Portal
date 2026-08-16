'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Quote = {
  id: string
  package_id: string
  package_name: string
  region: string
  departure_date: string
  adults: number
  room_type: string
  total_price: number
  client_name: string
  client_type: string
  trip_name: string
  flights_booked: boolean
  status: 'draft' | 'sent' | 'confirmed'
  markup_amount: number
  add_ons: any[]
  created_at: string
  estimated_booking_date: string
  notes: string
}

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_COLORS = {
  draft: { bg: '#FEF3C7', color: '#92400E' },
  sent: { bg: '#DBEAFE', color: '#1E40AF' },
  confirmed: { bg: '#D1FAE5', color: '#065F46' },
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'confirmed'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/quotes/list')
      .then(r => r.json())
      .then(d => { setQuotes(d.quotes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = quotes.filter(q => filter === 'all' || q.status === filter)

  const counts = {
    all: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    confirmed: quotes.filter(q => q.status === 'confirmed').length,
  }

  return (
    <div style={{ padding: '32px 40px', background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 className="font-tight" style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 6 }}>My Quotes</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-light)' }}>All your saved proposals and quote requests</p>
        </div>
        <Link href="/dashboard/packages" className="btn-teal" style={{ whiteSpace: 'nowrap' }}>
          + NEW QUOTE
        </Link>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Quotes', n: counts.all, color: 'var(--teal)' },
          { label: 'Draft', n: counts.draft, color: '#92400E' },
          { label: 'Sent', n: counts.sent, color: '#1E40AF' },
          { label: 'Confirmed', n: counts.confirmed, color: '#065F46' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--rule)', padding: '18px 20px' }}>
            <div className="font-tight" style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.06em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {(['all', 'draft', 'sent', 'confirmed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', border: '1.5px solid var(--rule)',
            background: filter === f ? 'var(--ink)' : 'white',
            color: filter === f ? '#fff' : 'var(--ink-mid)',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
          }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Quotes list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-light)' }}>Loading quotes...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <h3 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No quotes yet</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 24 }}>Create your first quote by browsing available packages</p>
          <Link href="/dashboard/packages" className="btn-teal">BROWSE PACKAGES</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(q => (
            <div key={q.id} style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>

              {/* Quote row */}
              <div style={{
                padding: '18px 24px', display: 'grid',
                gridTemplateColumns: '1fr 160px 120px 140px 120px 80px',
                gap: 16, alignItems: 'center', cursor: 'pointer',
              }} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>

                {/* Package + client */}
                <div>
                  <div className="font-tight" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 3, letterSpacing: '-0.01em' }}>{q.trip_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Client: <strong style={{ color: 'var(--ink-mid)' }}>{q.client_name}</strong> · {q.client_type}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{q.package_name} · {q.region.toUpperCase()}</div>
                </div>

                {/* Departure */}
                <div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.06em', marginBottom: 3 }}>DEPARTURE</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)' }}>{fmtDate(q.departure_date)}</div>
                </div>

                {/* Pax */}
                <div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.06em', marginBottom: 3 }}>PAX</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)' }}>{q.adults} adults · {q.room_type}</div>
                </div>

                {/* Total */}
                <div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.06em', marginBottom: 3 }}>QUOTE TOTAL</div>
                  <div className="font-tight" style={{ fontSize: 16, fontWeight: 800, color: 'var(--teal)' }}>{fmt(q.total_price)}</div>
                  {q.markup_amount > 0 && <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>incl. {fmt(q.markup_amount)} markup</div>}
                </div>

                {/* Status */}
                <div>
                  <span style={{ ...STATUS_COLORS[q.status], padding: '4px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 4 }}>
                    {q.status.toUpperCase()}
                  </span>
                </div>

                {/* Expand */}
                <div style={{ fontSize: 18, color: 'var(--ink-light)', textAlign: 'right', transition: 'transform 0.2s', transform: expanded === q.id ? 'rotate(180deg)' : 'none' }}>
                  ↓
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === q.id && (
                <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--rule)', paddingTop: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: 6 }}>CREATED</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{fmtDate(q.created_at)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: 6 }}>EST. BOOKING DATE</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{q.estimated_booking_date ? fmtDate(q.estimated_booking_date) : '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: 6 }}>FLIGHTS BOOKED</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{q.flights_booked ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: 6 }}>ADD-ONS</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{q.add_ons?.length > 0 ? q.add_ons.map((a: any) => a.label).join(', ') : 'None'}</div>
                    </div>
                  </div>
                  {q.notes && (
                    <div style={{ marginTop: 14, padding: '12px 16px', background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                      <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: 4 }}>NOTES</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{q.notes}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <Link href={`/dashboard/packages/${q.package_id}`}
                      style={{ padding: '8px 18px', background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none' }}>
                      DUPLICATE QUOTE
                    </Link>
                    <a href={`mailto:sales@gtfholidays.com?subject=Quote Ref: ${q.trip_name} (${q.client_name})&body=Hi GTF Team,%0D%0A%0D%0APlease find details for the following quote:%0D%0A%0D%0AClient: ${q.client_name}%0D%0APackage: ${q.package_name}%0D%0ADeparture: ${fmtDate(q.departure_date)}%0D%0APax: ${q.adults} adults (${q.room_type})%0D%0ATotal: ${fmt(q.total_price)}%0D%0A%0D%0ARegards`}
                      style={{ padding: '8px 18px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none' }}>
                      EMAIL TO GTF
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
