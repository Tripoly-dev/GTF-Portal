'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'
import { formatDate, money as fmtPrice } from '@/lib/format'
import StatusBadge from '@/components/ui/StatusBadge'

const C = {
  bg:       'var(--bg)',
  ink:      'var(--ink)',
  inkMid:   'var(--ink-mid)',
  inkLight: 'var(--ink-light)',
  rule:     'var(--rule)',
  ruleDk:   'var(--rule)',
  nav:      'var(--forest)',
  navFg:    'var(--paper)',
  accent:   'var(--brand)',
  accentDk: 'var(--teal-dark)',
  gold:     'var(--warn)',
  cardBg:   '#ffffff',
}
const font = 'var(--font-sans)'
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
const fmtDate = (d: string) => formatDate(d, 'short', '')

type Quote = {
  id: string; client_name: string; package_name: string; departure_date: string
  total_price: number; currency?: string; status: string; created_at: string
  adults: number; region: string; markup_amount?: number
}

function getUpcomingDepartures() {
  const today = new Date()
  const thirtyDays = new Date(today)
  thirtyDays.setDate(today.getDate() + 30)
  const upcoming: { day: string; mon: string; pkg: string; nights: string; region: string; status: string }[] = []
  PACKAGES.forEach(p => {
    p.departures.forEach(dep => {
      const d = new Date(dep.date)
      if (d >= today && d <= thirtyDays) {
        upcoming.push({ day: d.getDate().toString(), mon: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(), pkg: p.name, nights: `${p.nights}N/${p.days}D`, region: p.region.toUpperCase(), status: dep.status })
      }
    })
  })
  return upcoming.sort((a, b) => parseInt(a.day) - parseInt(b.day)).slice(0, 6)
}


// ── COMMISSION CALC — FY / Quarter / Month ────────────────────────────────────
type CommPeriod = 'month' | 'lastMonth' | 'quarter' | 'fy'
function calcCommissionForPeriod(quotes: Quote[], period: CommPeriod) {
  const now = new Date()
  let start: Date
  let end: Date | null = null
  if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
  } else if (period === 'lastMonth') {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    end = new Date(now.getFullYear(), now.getMonth(), 1)
  } else if (period === 'quarter') {
    const q = Math.floor(now.getMonth() / 3)
    start = new Date(now.getFullYear(), q * 3, 1)
  } else {
    // Indian FY: April 1 to March 31
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
    start = new Date(fyStart, 3, 1) // April 1
  }
  const filtered = quotes.filter(q => {
    const d = new Date(q.created_at)
    return d >= start && (!end || d < end)
  })
  return { total: filtered.reduce((s, q) => s + (q.markup_amount || 0), 0), count: filtered.length }
}

// ── REGION CARD with premium hover (Ken Burns + frosted drawer + marquee) ─────
function RegionCard({ region, quotes }: { region: { name: string; count: number; href: string; img: string; key: string }; quotes: Quote[] }) {
  const [hovered, setHovered] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Get top packages for this region
  const regionKey = region.name.toLowerCase() as 'europe' | 'africa' | 'asia'
  const pkgs = PACKAGES.filter(p => p.region === regionKey).slice(0, 3)

  return (
    <Link
      href={region.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ position: 'relative', height: 340, display: 'block', overflow: 'hidden', background: '#1a1a1a', textDecoration: 'none', cursor: 'pointer' }}
    >
      {/* Ken Burns image */}
      <img
        ref={imgRef}
        src={region.img}
        alt={region.name}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          filter: hovered ? 'grayscale(0%) brightness(1.0)' : 'grayscale(0%) brightness(0.88)',
          transform: hovered ? 'scale(1.08) translateX(1%)' : 'scale(1) translateX(0%)',
          transition: 'transform 0.7s cubic-bezier(.22,1,.36,1), filter 0.5s ease',
        }}
      />

      {/* Soft gradient overlay — always visible, lets image show through */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(7,26,23,0.72) 0%, rgba(7,26,23,0.1) 45%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Region name + count — always visible text overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 24px 22px',
        opacity: hovered ? 0 : 1,
        transform: hovered ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--font-display)', color: '#fff' }}>{region.name}</div>
        <div style={{ fontSize: 12, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.65)', marginTop: 7, fontFamily: font }}>{region.count} PACKAGES</div>
      </div>

      {/* Frosted glass drawer — slides up on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(7,26,23,0.86)',
        padding: '18px 24px 22px',
        transform: hovered ? 'translateY(0%)' : 'translateY(100%)',
        transition: 'transform 0.45s cubic-bezier(.22,1,.36,1)',
        zIndex: 2,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.72)', marginBottom: 10, fontFamily: font }}>
          {region.name} — Featured Departures
        </div>
        {pkgs.map((p, i) => {
          const next = p.departures.find(d => d.status !== 'sold-out')
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < pkgs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--paper)', fontFamily: font }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>{p.nights}N · {p.region.toUpperCase()}</div>
              </div>
              {next && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  {new Date(next.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              )}
            </div>
          )
        })}
        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: font }}>
          View all {region.count} packages →
        </div>
      </div>
    </Link>
  )
}

type Booking = {
  id: string; client_name: string | null; package_name: string; departure_date: string
  total_price: number; status: string; created_at: string
  adults: number; children_with_bed: number; children_without_bed: number
  deposit_amount: number; payment_mode: string
}

export default function DashboardPage() {
  const [agent, setAgent] = useState<{ name: string; agency: string } | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'sent' | 'bookings' | 'cancelled'>('all')
  const [commPeriod, setCommPeriod] = useState<CommPeriod>('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('gtf_agent')
    if (stored) setAgent(JSON.parse(stored))
    else setAgent({ name: 'Demo Agent', agency: 'Demo Travel Agency' })
  }, [])

  useEffect(() => {
    fetch('/api/quotes/list', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setQuotes(d.quotes || []); setLoading(false) })
      .catch(() => setLoading(false))
    fetch('/api/bookings/list', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setBookings(d.bookings || []))
      .catch(() => {})
  }, [])

  const regions = [
    { key: 'europe', name: 'Europe', count: 9,  href: '/dashboard/packages?region=europe', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=90' },
    { key: 'africa', name: 'Africa', count: 2,  href: '/dashboard/packages?region=africa', img: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-0.jpg' },
    { key: 'asia',   name: 'Asia',   count: 5,  href: '/dashboard/packages?region=asia',   img: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/JAPAN%20AUTOMN%20DISCOVERY/JAPAN%20AUTOMN%20DISCOVERY-0.png' },
  ]

  const departures = getUpcomingDepartures()
  const comm = calcCommissionForPeriod(quotes, commPeriod)

  const tabFiltered = quotes.filter(q => {
    if (activeTab === 'all') return true
    if (activeTab === 'draft') return q.status === 'draft' || q.status === 'created'
    if (activeTab === 'sent') return q.status === 'sent'
    if (activeTab === 'cancelled') return q.status === 'cancelled'
    return true
  })

  const tabs = [
    { id: 'all' as const,       label: 'All',       count: quotes.length },
    { id: 'draft' as const,     label: 'Draft',     count: quotes.filter(q => q.status === 'draft' || q.status === 'created').length },
    { id: 'sent' as const,      label: 'Sent',      count: quotes.filter(q => q.status === 'sent').length },
    { id: 'bookings' as const,  label: 'Bookings',  count: bookings.length },
    { id: 'cancelled' as const, label: 'Cancelled', count: quotes.filter(q => q.status === 'cancelled').length },
  ]

  const commTabs: { id: CommPeriod; label: string }[] = [
    { id: 'month', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'quarter', label: `Q${Math.floor(new Date().getMonth() / 3) + 1}` },
    { id: 'fy', label: `FY${String(new Date().getFullYear()).slice(-2)}` },
  ]

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: C.ink, fontFamily: font }}>
        <main style={{ maxWidth: 1560, margin: '0 auto', padding: '0 clamp(18px, 5vw, 40px) clamp(53px, 9vw, 88px)' }}>

          {/* ── GREETING ─────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, padding: '44px 0 22px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 720 }}>
              <h1 className="font-display" style={{ fontSize: 40, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 12px', fontWeight: 500 }}>
                {getGreeting()},<br />{agent?.name || 'Demo Agent'}.
              </h1>
              <p style={{ margin: 0, fontSize: 16, color: C.inkMid, maxWidth: 560, lineHeight: 1.5 }}>
                {quotes.length > 0
                  ? `${quotes.filter(q => q.status === 'draft').length} saved quotes on your desk and ${departures.length} departure${departures.length !== 1 ? 's' : ''} ahead in the next 30 days.`
                  : 'Browse packages and start building quotes for your clients.'}
              </p>
            </div>
            <Link href="/dashboard/packages" style={{
              border: `2px solid ${C.ink}`, background: 'transparent', color: C.ink,
              fontSize: 14, fontWeight: 700, 
              padding: '13px 20px', textDecoration: 'none', display: 'inline-block',
              fontFamily: font, transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease', borderRadius: 8,
            }}>
              Browse Packages
            </Link>
          </div>

          <div style={{ height: 2, background: C.ink }} />

          {/* ── QUOTES + COMMISSION ───────────────────────────────────────────── */}
          <section className="rg-stack" style={{ display: 'grid', gridTemplateColumns: '1.62fr 1fr', gap: 0, borderBottom: `2px solid rgba(7,26,23,0.35)` }}>

            {/* Saved Quotes */}
            <div style={{ padding: '28px clamp(18px, 5vw, 40px) 32px 0', borderRight: `2px solid rgba(7,26,23,0.35)` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0, fontFamily: font }}>My saved quotes</h2>
                <Link href="/dashboard/quotes" style={{ fontSize: 13, color: C.inkLight, letterSpacing: '0.02em', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ display: 'flex', gap: 0, border: `1px solid ${C.ink}`, width: 'max-content', marginBottom: 16 }}>
                {tabs.map((t, ti) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                    padding: '8px 15px', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: font,
                    background: activeTab === t.id ? C.ink : 'transparent',
                    color: activeTab === t.id ? C.navFg : C.ink,
                    border: 'none', borderRight: ti < tabs.length - 1 ? `1px solid ${C.ink}` : 'none',
                  }}>
                    {t.label} <span style={{ opacity: 0.6 }}>{t.count}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'bookings' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: `1px solid ${C.rule}` }}>
                  {bookings.length === 0 ? (
                    <div style={{ padding: '32px 8px', color: C.inkLight, fontSize: 13 }}>
                      No bookings yet. Convert a sent proposal to get started.
                    </div>
                  ) : bookings.slice(0, 5).map(b => {
                    const pax = (b.adults || 0) + (b.children_with_bed || 0) + (b.children_without_bed || 0)
                    return (
                      <Link key={b.id} href={`/dashboard/bookings/${b.id}`} style={{
                        display: 'grid', gridTemplateColumns: 'minmax(150px,1.4fr) minmax(170px,1.5fr) 140px 80px',
                        alignItems: 'center', gap: 24, padding: '18px 8px',
                        borderBottom: `1px solid ${C.rule}`, cursor: 'pointer',
                        background: 'transparent', textDecoration: 'none', color: 'inherit', transition: 'background 0.15s',
                      }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: C.ink }}>{b.client_name || '—'}</div>
                          <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>{b.package_name} · {pax} pax</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Departs {fmtDate(b.departure_date)}</div>
                          <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>Deposit: {b.deposit_amount ? fmtPrice(b.deposit_amount) : '—'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink }}>{fmtPrice(b.total_price)}</div>
                          <div style={{ marginTop: 4 }}><StatusBadge status={b.status} /></div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                          View <span style={{ fontSize: 15 }}>→</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: `1px solid ${C.rule}` }}>
                  {loading ? (
                    <div style={{ padding: '32px 0', color: C.inkLight, fontSize: 13 }}>Loading quotes...</div>
                  ) : tabFiltered.length === 0 ? (
                    <div style={{ padding: '32px 8px', color: C.inkLight, fontSize: 13 }}>
                      No quotes yet. <Link href="/dashboard/packages" style={{ color: C.accent, fontWeight: 600, textDecoration: 'none' }}>Browse packages to get started.</Link>
                    </div>
                  ) : tabFiltered.slice(0, 5).map(q => (
                    <Link key={q.id} href={`/dashboard/quotes/${q.id}`} style={{
                      display: 'grid', gridTemplateColumns: 'minmax(150px,1.4fr) minmax(170px,1.5fr) 140px 80px',
                      alignItems: 'center', gap: 24, padding: '18px 8px',
                      borderBottom: `1px solid ${C.rule}`, cursor: 'pointer',
                      background: 'transparent', textDecoration: 'none',
                      transition: 'background 0.15s', color: 'inherit',
                    }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: C.ink }}>{q.client_name}</div>
                        <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>{q.adults} pax · {q.region?.toUpperCase() || ''}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{q.package_name}</div>
                        <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>Departs {fmtDate(q.departure_date)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink }}>{fmtPrice(q.total_price, q.currency)}</div>
                        <div style={{ marginTop: 4 }}><StatusBadge status={q.status} /></div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        Resume <span style={{ fontSize: 15 }}>→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Commission + Departures */}
            <div style={{ padding: '28px 0 32px clamp(18px, 5vw, 40px)', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Commission card — with FY/Quarter/Month tabs */}
              <div style={{ background: C.nav, color: C.navFg, padding: '26px 26px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.72)' }}>Commission earned</div>
                  {/* Period tabs */}
                  <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                    {commTabs.map(t => (
                      <button key={t.id} onClick={() => setCommPeriod(t.id)} style={{
                        padding: '5px 11px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                        cursor: 'pointer', fontFamily: font, border: 'none',
                        background: commPeriod === t.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: commPeriod === t.id ? 'var(--paper)' : 'rgba(255,255,255,0.72)',
                        borderRight: '1px solid rgba(255,255,255,0.15)',
                        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease',
                      }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.035em', margin: '4px 0', fontFamily: font }}>
                  {fmtPrice(comm.total)}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 20 }}>
                  {comm.count} quote{comm.count !== 1 ? 's' : ''} · {commPeriod === 'fy' ? `FY${String(new Date().getFullYear()).slice(-2)}` : commPeriod === 'quarter' ? `Q${Math.floor(new Date().getMonth() / 3) + 1}` : commPeriod === 'lastMonth' ? 'Last Month' : 'This Month'}
                </div>
                {/* Breakdown grid — gap:0 + border-right to avoid vertical line artifact */}
                <div className="rg-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                  {[
                    { label: 'Total quotes', value: quotes.length.toString() },
                    { label: 'DRAFT', value: quotes.filter(q => q.status === 'draft').length.toString() },
                    { label: 'SENT', value: quotes.filter(q => q.status === 'sent').length.toString() },
                  ].map((b, i) => (
                    <div key={b.label} style={{ background: 'rgba(255,255,255,0.05)', padding: '11px 12px 8px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.72)' }}>{b.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 5, color: C.navFg }}>{b.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── EXPLORE BY REGION ────────────────────────────────────────────── */}
          <section style={{ padding: '34px 0 40px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 6px', fontFamily: font }}>Explore by region</h2>
                <div style={{ fontSize: 13, color: C.inkLight }}>17 packages across three regions. Hover to preview departures.</div>
              </div>
              <Link href="/dashboard/packages" style={{ fontSize: 12, fontWeight: 700, color: C.gold, textDecoration: 'none' }}>
                All 17 packages →
              </Link>
            </div>
            <div className="rg-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: 'rgba(7,26,23,0.15)' }}>
              {regions.map(r => <RegionCard key={r.key} region={r} quotes={quotes} />)}
            </div>
          </section>

        </main>
      </div>
    </>
  )
}
