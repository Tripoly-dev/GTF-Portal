'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'

// ── DESIGN TOKENS (from zip Modernist design system) ─────────────────────────
const C = {
  bg:       '#F4F8F7',  // warm cream background
  ink:      '#18161a',  // near-black text
  inkMid:   '#494540',  // secondary text
  inkLight: '#6b655c',  // tertiary / muted text
  rule:     '#d6d0c5',  // dividers
  ruleDk:   '#c4bdb4',  // stronger dividers
  nav:      '#241f2b',  // dark nav/card background
  navFg:    '#efebe3',  // nav foreground
  accent:   '#9e2233',  // red accent
  accentDk: '#85182a',  // red accent hover
  gold:     '#6f5320',  // link / secondary accent (warm brown)
  cardBg:   '#ffffff',  // white card surface
}

const font = '"Archivo", system-ui, sans-serif'

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtPrice(amount: number, currency = 'INR') {
  if (currency === 'USD') return `$${Math.round(amount).toLocaleString('en-US')}`
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

// ── QUOTE ROW TYPE ────────────────────────────────────────────────────────────
type Quote = {
  id: string
  client_name: string
  package_name: string
  departure_date: string
  total_price: number
  currency?: string
  status: string
  created_at: string
  adults: number
  region: string
  markup_amount?: number
}

// ── DEPARTURE WINDOW — next 30 days from packages ────────────────────────────
function getUpcomingDepartures() {
  const today = new Date()
  const thirtyDays = new Date(today)
  thirtyDays.setDate(today.getDate() + 30)

  const upcoming: { day: string; mon: string; pkg: string; nights: string; region: string; status: string }[] = []

  PACKAGES.forEach(p => {
    p.departures.forEach(dep => {
      const d = new Date(dep.date)
      if (d >= today && d <= thirtyDays) {
        upcoming.push({
          day: d.getDate().toString(),
          mon: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
          pkg: p.name,
          nights: `${p.nights}N/${p.days}D`,
          region: p.region.toUpperCase(),
          status: dep.status,
        })
      }
    })
  })

  return upcoming.sort((a, b) => parseInt(a.day) - parseInt(b.day)).slice(0, 6)
}

// ── STATUS PILL STYLES ────────────────────────────────────────────────────────
const pillStyle = (status: string): React.CSSProperties => {
  if (status === 'fast-filling') return { background: '#78350f', color: '#fef3c7' }
  if (status === 'sold-out')     return { background: '#7f1d1d', color: '#fee2e2' }
  if (status === 'draft')        return { background: C.ruleDk, color: C.ink }
  if (status === 'sent')         return { background: '#1e3a5f', color: '#bfdbfe' }
  return { background: '#14532d', color: '#bbf7d0' } // available / active
}
const pillLabel = (status: string) => {
  if (status === 'fast-filling') return 'FAST FILLING'
  if (status === 'sold-out')     return 'SOLD OUT'
  if (status === 'draft')        return 'DRAFT'
  if (status === 'sent')         return 'SENT'
  return 'AVAILABLE'
}

// ── COMMISSION CALCULATION ────────────────────────────────────────────────────
function calcCommission(quotes: Quote[]) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonth = quotes.filter(q => new Date(q.created_at) >= startOfMonth)
  const total = thisMonth.reduce((s, q) => s + (q.markup_amount || 0), 0)
  return { total, count: thisMonth.length }
}

export default function DashboardPage() {
  const [agent, setAgent] = useState<{ name: string; agency: string } | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'sent' | 'expired'>('all')
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
  }, [])

  const regions = [
    { name: 'Europe', count: 10, href: '/dashboard/packages?region=europe', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80' },
    { name: 'Africa', count: 2,  href: '/dashboard/packages?region=africa', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80' },
    { name: 'Asia',   count: 5,  href: '/dashboard/packages?region=asia',   img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
  ]

  const departures = getUpcomingDepartures()
  const comm = calcCommission(quotes)

  const tabFiltered = quotes.filter(q => {
    if (activeTab === 'all') return true
    if (activeTab === 'draft') return q.status === 'draft'
    if (activeTab === 'sent')  return q.status === 'sent'
    if (activeTab === 'expired') {
      const dep = new Date(q.departure_date)
      return dep < new Date()
    }
    return true
  })

  const tabs: { id: 'all' | 'draft' | 'sent' | 'expired'; label: string }[] = [
    { id: 'all',     label: 'All' },
    { id: 'draft',   label: 'Draft' },
    { id: 'sent',    label: 'Sent' },
    { id: 'expired', label: 'Expired' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F4F8F7', color: C.ink, fontFamily: font }}>
      <main style={{ maxWidth: 1560, margin: '0 auto', padding: '0 40px 88px' }}>

        {/* ── GREETING ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, padding: '44px 0 22px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: C.gold, marginBottom: 14 }}>
              PARTNER DESK · WEEK {Math.ceil(new Date().getDate() / 7) + (new Date().getMonth() * 4)}, FY{String(new Date().getFullYear()).slice(-2)}
            </div>
            <h1 style={{ fontSize: 52, lineHeight: 1.02, letterSpacing: '-0.03em', margin: '0 0 12px', fontWeight: 800, fontFamily: font }}>
              {getGreeting()},<br />{agent?.name || 'Demo Agent'}.
            </h1>
            <p style={{ margin: 0, fontSize: 15.5, color: C.inkMid, maxWidth: 560, lineHeight: 1.5 }}>
              {quotes.length > 0
                ? `${quotes.filter(q => q.status === 'draft').length} saved quotes on your desk and ${departures.length} departure${departures.length !== 1 ? 's' : ''} ahead in the next 30 days.`
                : 'Browse packages and start building quotes for your clients.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/dashboard/packages" style={{
              border: `2px solid ${C.ink}`, background: 'transparent', color: C.ink,
              fontSize: 13.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '13px 20px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
              fontFamily: font, transition: 'all 0.15s',
            }}>
              Browse Packages
            </Link>
          </div>
        </div>

        {/* ── DIVIDER ────────────────────────────────────────────────────────── */}
        <div style={{ height: 2, background: C.ink, marginBottom: 0 }} />

        {/* ── QUOTES + COMMISSION GRID ───────────────────────────────────────── */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.62fr 1fr', gap: 0, borderBottom: `2px solid rgba(24,22,26,0.35)` }}>

          {/* Saved Quotes */}
          <div style={{ padding: '28px 40px 32px 0', borderRight: `2px solid rgba(24,22,26,0.35)` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0, fontFamily: font }}>My saved quotes</h2>
              <Link href="/dashboard/quotes" style={{ fontSize: 12.5, color: C.inkLight, letterSpacing: '0.02em', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, border: `1px solid ${C.ink}`, width: 'max-content', marginBottom: 16 }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  padding: '8px 15px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: font,
                  background: activeTab === t.id ? C.ink : 'transparent',
                  color: activeTab === t.id ? C.navFg : C.ink,
                  border: 'none', borderRight: `1px solid ${C.ink}`,
                }}>
                  {t.label} <span style={{ opacity: 0.6 }}>
                    {t.id === 'all' ? quotes.length :
                     t.id === 'draft' ? quotes.filter(q => q.status === 'draft').length :
                     t.id === 'sent'  ? quotes.filter(q => q.status === 'sent').length :
                     quotes.filter(q => new Date(q.departure_date) < new Date()).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Quote rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: `1px solid ${C.rule}` }}>
              {loading ? (
                <div style={{ padding: '32px 0', color: C.inkLight, fontSize: 13 }}>Loading quotes...</div>
              ) : tabFiltered.length === 0 ? (
                <div style={{ padding: '32px 8px', color: C.inkLight, fontSize: 13 }}>
                  No quotes yet. <Link href="/dashboard/packages" style={{ color: C.accent, fontWeight: 600, textDecoration: 'none' }}>Browse packages to get started.</Link>
                </div>
              ) : tabFiltered.slice(0, 5).map(q => (
                <Link key={q.id} href="/dashboard/quotes" style={{
                  display: 'grid', gridTemplateColumns: 'minmax(150px,1.4fr) minmax(170px,1.5fr) auto auto',
                  alignItems: 'center', gap: 24, padding: '18px 8px',
                  borderBottom: `1px solid ${C.rule}`, cursor: 'pointer',
                  background: 'transparent', textDecoration: 'none',
                  transition: 'background 0.15s', color: 'inherit',
                }}>
                  <div>
                    <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', color: C.ink }}>{q.client_name}</div>
                    <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>
                      {q.adults} pax · {q.region?.toUpperCase() || ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{q.package_name}</div>
                    <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>
                      Departs {fmtDate(q.departure_date)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink }}>
                      {fmtPrice(q.total_price, q.currency)}
                    </div>
                    <div style={{ ...pillStyle(q.status), fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginTop: 4, padding: '2px 6px', textTransform: 'uppercase', display: 'inline-block' }}>
                      {pillLabel(q.status)}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gold, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    Resume <span style={{ fontSize: 15 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Commission + Departures */}
          <div style={{ padding: '28px 0 32px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Commission card */}
            <div style={{ background: C.nav, color: C.navFg, padding: '26px 26px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(239,236,229,0.6)' }}>COMMISSION EARNED</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#d9b877' }}>THIS MONTH</div>
              </div>
              <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.035em', margin: '18px 0 4px', fontFamily: font }}>
                {comm.total > 0 ? `₹${Math.round(comm.total).toLocaleString('en-IN')}` : '₹0'}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(239,236,229,0.55)', marginBottom: 20 }}>
                {comm.count} quote{comm.count !== 1 ? 's' : ''} created this month
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'rgba(239,236,229,0.18)' }}>
                {[
                  { label: 'TOTAL QUOTES', value: quotes.length.toString() },
                  { label: 'DRAFT', value: quotes.filter(q => q.status === 'draft').length.toString() },
                  { label: 'SENT', value: quotes.filter(q => q.status === 'sent').length.toString() },
                ].map(b => (
                  <div key={b.label} style={{ background: C.nav, padding: '11px 0 2px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(239,236,229,0.5)' }}>{b.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 5, color: C.navFg }}>{b.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 30-day departures */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: font }}>Departures</div>
                <div style={{ fontSize: 11.5, color: C.inkLight, letterSpacing: '0.04em' }}>30-DAY WINDOW</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.rule}` }}>
                {departures.length === 0 ? (
                  <div style={{ padding: '16px 0', color: C.inkLight, fontSize: 13 }}>No departures in the next 30 days.</div>
                ) : departures.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${C.rule}` }}>
                    <div style={{ width: 52, flexShrink: 0 }}>
                      <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: C.ink }}>{d.day}</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: C.inkLight }}>{d.mon}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: C.ink }}>{d.pkg}</div>
                      <div style={{ fontSize: 11.5, color: C.inkLight, marginTop: 2 }}>{d.region} · {d.nights}</div>
                    </div>
                    <div style={{
                      ...pillStyle(d.status),
                      fontSize: 9.5, fontWeight: 800, letterSpacing: '0.08em',
                      padding: '3px 7px', flexShrink: 0, whiteSpace: 'nowrap', textTransform: 'uppercase',
                    }}>
                      {pillLabel(d.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLORE BY REGION ──────────────────────────────────────────────── */}
        <section style={{ padding: '34px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: font }}>Explore by region</h2>
              <div style={{ fontSize: 13, color: C.inkLight }}>17 packages across three regions. Pick a region to see its packages.</div>
            </div>
            <Link href="/dashboard/packages" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, textDecoration: 'none' }}>
              All 17 packages →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: C.ink }}>
            {regions.map(r => (
              <Link key={r.name} href={r.href} style={{ position: 'relative', height: 300, display: 'block', overflow: 'hidden', background: '#e4dfd5', textDecoration: 'none' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 132, left: 0, overflow: 'hidden' }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', filter: 'grayscale(20%)' }} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 132, boxSizing: 'border-box', padding: '18px 24px', background: '#241f2b', color: '#efebe3', overflow: 'hidden' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: font, color: '#efebe3' }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, letterSpacing: '0.08em', color: 'rgba(239,236,229,0.65)', marginTop: 7 }}>{r.count} PACKAGES</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
