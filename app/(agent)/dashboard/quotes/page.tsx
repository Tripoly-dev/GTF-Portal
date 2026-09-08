'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Quote = {
  id: string
  quote_number: number
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
  status: 'draft' | 'created' | 'sent' | 'cancelled'
  markup_amount: number
  add_ons: any[]
  created_at: string
  estimated_booking_date: string
  notes: string
}

const NAVY = '#12213c'
const TEAL = '#0f6d5c'
const AMBER = '#c98a12'
const RED = '#c0392b'
const GREY = '#8a8a8a'

const STATUS_COLORS: Record<string, string> = {
  draft: GREY,
  created: '#2f5fa8',
  sent: AMBER,
  cancelled: RED,
}

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const ICONS: Record<string, React.ReactNode> = {
  total: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  ),
  created: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  ),
  sent: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  ),
  cancelled: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'created' | 'sent' | 'cancelled'>('all')
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
    created: quotes.filter(q => q.status === 'created').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    cancelled: quotes.filter(q => q.status === 'cancelled').length,
  }

  const stats = [
    { key: 'all', label: 'TOTAL QUOTES', value: counts.all, color: NAVY, icon: ICONS.total },
    { key: 'created', label: 'CREATED', value: counts.created, color: '#2f5fa8', icon: ICONS.created },
    { key: 'sent', label: 'SENT', value: counts.sent, color: AMBER, icon: ICONS.sent },
    { key: 'cancelled', label: 'CANCELLED', value: counts.cancelled, color: RED, icon: ICONS.cancelled },
  ]

  const tabs: { id: typeof filter; label: string }[] = [
    { id: 'all', label: `All (${counts.all})` },
    { id: 'created', label: `Created (${counts.created})` },
    { id: 'sent', label: `Sent (${counts.sent})` },
    { id: 'cancelled', label: `Cancelled (${counts.cancelled})` },
  ]

  return (
    <div style={{ padding: '40px 32px 80px', background: '#f3f2f2', minHeight: '100vh', fontFamily: "'Archivo', sans-serif" }}>
      <style>{`
        .qrow { transition: background .15s ease, box-shadow .15s ease; }
        .qrow:hover { background: #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
        .chev { transition: transform .2s ease; }
        .stat:hover .stat-bar { width: 100%; }
        .stat-bar { transition: width .25s ease; }
        .actbtn { transition: background .15s ease, border-color .15s ease, color .15s ease; }
        .actbtn-primary:hover { background: #1a3357; }
        .actbtn-outline:hover { border-color: ${NAVY}; color: ${NAVY}; }
        .actbtn-teal:hover { background: ${TEAL}; color: #fff; }
      `}</style>

      <div style={{ maxWidth: 1360, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 34, color: NAVY, letterSpacing: '-0.01em' }}>My Quotes</h1>
            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>All your saved proposals and quote requests</p>
          </div>
          <Link href="/dashboard/packages" style={{
            display: 'flex', alignItems: 'center', gap: 8, background: TEAL, color: '#fff',
            border: 'none', padding: '14px 22px', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em',
            textDecoration: 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M12 5v14M5 12h14" /></svg>
            NEW QUOTE
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', border: '1px solid #e3e1df', marginBottom: 28, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
          {stats.map((s, i) => (
            <div key={s.key} className="stat" style={{ padding: '26px 28px', borderRight: i < stats.length - 1 ? '1px solid #e3e1df' : 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: s.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <div style={{ width: 34, height: 34, background: `${s.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#8a8a8a' }}>{s.label}</div>
              <div className="stat-bar" style={{ position: 'absolute', left: 0, bottom: 0, height: 3, width: 28, background: s.color }} />
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 0, border: '1px solid #d8d6d3', width: 'fit-content', marginBottom: 24 }}>
          {tabs.map((t, i) => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              border: 'none', borderRight: i < tabs.length - 1 ? '1px solid #d8d6d3' : 'none',
              padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: filter === t.id ? NAVY : '#fff', color: filter === t.id ? '#fff' : '#333',
              fontFamily: "'Archivo', sans-serif",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ border: '1px solid #e3e1df', background: '#fbfbfa' }}>
          {loading ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', color: '#9a9a9a', fontSize: 14 }}>Loading quotes...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', color: '#9a9a9a' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No quotes in this category yet.</div>
            </div>
          ) : (
            filtered.map(q => {
              const statusColor = STATUS_COLORS[q.status] || STATUS_COLORS.created
              const isOpen = expanded === q.id
              return (
                <div key={q.id} className="qrow" style={{ borderBottom: '1px solid #e3e1df', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: statusColor }} />
                  <div onClick={() => setExpanded(isOpen ? null : q.id)} style={{ display: 'flex', alignItems: 'center', padding: '22px 28px 22px 32px', gap: 24, cursor: 'pointer' }}>

                    <div style={{ flex: 1.6, minWidth: 220 }}>
                      <div style={{ fontSize: 11, color: '#9a9a9a', fontWeight: 600, letterSpacing: '0.04em' }}>PROPOSAL NO: <span style={{ color: '#333', fontWeight: 800 }}>{q.quote_number || '—'}</span></div>
                      <div style={{ fontSize: 19, fontWeight: 800, color: NAVY, margin: '4px 0 4px' }}>{q.trip_name}</div>
                      <div style={{ fontSize: 13, color: '#555' }}>Client: <strong>{q.client_name}</strong> · {q.client_type}</div>
                      <div style={{ fontSize: 12, color: '#9a9a9a', marginTop: 2 }}>{q.package_name} · {q.region?.toUpperCase()}</div>
                    </div>

                    <div style={{ flex: 1, minWidth: 110 }}>
                      <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>DEPARTURE</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#222', marginTop: 4 }}>{fmtDate(q.departure_date)}</div>
                    </div>

                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>PAX</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#222', marginTop: 4 }}>{q.adults} adults · {q.room_type}</div>
                    </div>

                    <div style={{ flex: 1, minWidth: 130 }}>
                      <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>QUOTE TOTAL</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: TEAL, marginTop: 4 }}>{fmt(q.total_price)}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 120, justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, background: statusColor, display: 'inline-block' }} />
                        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', color: statusColor }}>{q.status.toUpperCase()}</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setExpanded(isOpen ? null : q.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                        <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth={2.5} style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}><path d="M6 9l6 6 6-6" /></svg>
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ margin: '0 32px 20px', paddingTop: 18, borderTop: '1px solid #e3e1df' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))', gap: 20, marginBottom: 18 }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>CREATED</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginTop: 4 }}>{fmtDate(q.created_at)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>EST. BOOKING DATE</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginTop: 4 }}>{q.estimated_booking_date ? fmtDate(q.estimated_booking_date) : '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>FLIGHTS BOOKED</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginTop: 4 }}>{q.flights_booked ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: '#9a9a9a', fontWeight: 700, letterSpacing: '0.08em' }}>ADD-ONS</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginTop: 4 }}>{q.add_ons?.length > 0 ? q.add_ons.map((a: any) => a.label).join(', ') : 'None'}</div>
                        </div>
                      </div>
                      {q.notes && (
                        <div style={{ marginBottom: 18, padding: '12px 16px', background: '#f3f2f2', border: '1px solid #e3e1df' }}>
                          <div style={{ fontSize: 10, color: '#9a9a9a', letterSpacing: '0.08em', marginBottom: 4 }}>NOTES</div>
                          <div style={{ fontSize: 13, color: '#333' }}>{q.notes}</div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <Link href={`/dashboard/quotes/${q.id}`} className="actbtn actbtn-primary" style={{
                          display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: NAVY, color: '#fff',
                          fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '10px 18px', textDecoration: 'none',
                        }}>
                          VIEW PROPOSAL
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </Link>
                        <Link href={`/dashboard/packages/${q.package_id}`} className="actbtn actbtn-outline" style={{
                          border: '1px solid #d3d1ce', background: '#fff', color: '#333',
                          fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '10px 18px', textDecoration: 'none',
                        }}>
                          DUPLICATE QUOTE
                        </Link>
                        <a href={`/api/quotes/pdf?id=${q.id}`} target="_blank" rel="noopener noreferrer" className="actbtn actbtn-teal" style={{
                          border: `1px solid ${TEAL}`, background: '#fff', color: TEAL,
                          fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '10px 18px', textDecoration: 'none',
                        }}>
                          DOWNLOAD PDF
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
