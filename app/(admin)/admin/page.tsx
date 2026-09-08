'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'

type Agent = {
  id: string; full_name: string; agency_name: string; city: string
  mobile: string; email: string; iata_number: string | null
  how_did_you_hear: string | null; status: 'pending' | 'approved' | 'rejected' | 'suspended'
  created_at: string
}

type Booking = {
  id: string; package_name: string; departure_date: string
  total_price: number; status: string; created_at: string
  adults: number; children_with_bed: number; children_without_bed: number
  deposit_amount: number; agent?: { full_name: string; agency_name: string; email: string }
}

type Departure = {
  id: string; package_id: string; departure_date: string
  status: string; total_seats: number; booked_seats: number
  package_name?: string; region?: string
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtPrice = (n: number) => n ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—'

const BOOKING_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Pending',   bg: '#FEF3C7', color: '#92400E' },
  confirmed: { label: 'Confirmed', bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#991B1B' },
}

const DEP_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  available:      { label: 'Available',    bg: '#D1FAE5', color: '#065F46' },
  'fast-filling': { label: 'Fast Filling', bg: '#FEF3C7', color: '#92400E' },
  'sold-out':     { label: 'Sold Out',     bg: '#FEE2E2', color: '#991B1B' },
}

type Section = 'agents' | 'bookings' | 'departures'

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('agents')

  // Agents
  const [agents, setAgents] = useState<Agent[]>([])
  const [agentFilter, setAgentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [agentSearch, setAgentSearch] = useState('')
  const [updatingAgent, setUpdatingAgent] = useState<string | null>(null)

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('pending')
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null)

  // Departures
  const [departures, setDepartures] = useState<Departure[]>([])
  const [depSearch, setDepSearch] = useState('')
  const [updatingDep, setUpdatingDep] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  const [loading, setLoading] = useState(true)

  // Fetch agents
  const fetchAgents = async () => {
    const res = await fetch('/api/admin/agents')
    if (res.status === 401 || res.status === 403) { router.push('/login'); return }
    const data = await res.json()
    setAgents(data.agents || [])
    setLoading(false)
  }

  // Fetch bookings
  const fetchBookings = async () => {
    const res = await fetch('/api/admin/bookings')
    if (res.ok) { const data = await res.json(); setBookings(data.bookings || []) }
  }

  // Fetch departures
  const fetchDepartures = async () => {
    const all: Departure[] = []
    for (const pkg of PACKAGES) {
      const res = await fetch(`/api/departures/${pkg.id}`)
      if (res.ok) {
        const data = await res.json()
        all.push(...(data.departures || []).map((d: Departure) => ({ ...d, package_name: pkg.name, region: pkg.region })))
      }
    }
    setDepartures(all.sort((a, b) => a.departure_date.localeCompare(b.departure_date)))
  }

  useEffect(() => {
    fetchAgents()
    fetchBookings()
    fetchDepartures()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleAgentAction = async (agentId: string, action: 'approved' | 'rejected' | 'suspended') => {
    setUpdatingAgent(agentId)
    const res = await fetch(`/api/admin/agents/${agentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    })
    if (res.ok) setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: action } : a))
    setUpdatingAgent(null)
  }

  const handleBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    setUpdatingBooking(id)
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    setUpdatingBooking(null)
  }

  const handleDepStatus = async (id: string, status: string) => {
    setUpdatingDep(id)
    await fetch(`/api/departures/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setDepartures(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    setUpdatingDep(null)
  }

  const seedDepartures = async () => {
    setSeeding(true); setSeedMsg('')
    const res = await fetch('/api/admin/seed-departures', { method: 'POST' })
    const data = await res.json()
    setSeedMsg(res.ok ? `✓ ${data.message}` : `Error: ${data.error}`)
    if (res.ok) fetchDepartures()
    setSeeding(false)
  }

  // Counts
  const agentCounts = {
    all: agents.length,
    pending: agents.filter(a => a.status === 'pending').length,
    approved: agents.filter(a => a.status === 'approved').length,
    rejected: agents.filter(a => a.status === 'rejected').length,
  }
  const bookingCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filteredAgents = agents.filter(a => {
    const mf = agentFilter === 'all' || a.status === agentFilter
    const ms = !agentSearch || [a.full_name, a.agency_name, a.email, a.city].some(f => f?.toLowerCase().includes(agentSearch.toLowerCase()))
    return mf && ms
  })

  const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter)
  const filteredDeps = depSearch ? departures.filter(d => d.package_name?.toLowerCase().includes(depSearch.toLowerCase()) || d.departure_date?.includes(depSearch)) : departures

  const navItems: { id: Section; icon: string; label: string; badge?: number }[] = [
    { id: 'agents',     icon: '👥', label: 'Agents',     badge: agentCounts.pending },
    { id: 'bookings',   icon: '🎫', label: 'Bookings',   badge: bookingCounts.pending },
    { id: 'departures', icon: '✈️', label: 'Departures', badge: undefined },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{ width: 240, background: 'var(--ink)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF" style={{ height: 28, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>GTF <span style={{ fontWeight: 300 }}>Admin</span></span>
          </Link>
          <div style={{ marginTop: 12, padding: '4px 10px', background: 'rgba(232,97,58,0.2)', border: '1px solid rgba(232,97,58,0.4)', display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--orange)' }}>ADMIN PANEL</div>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', background: section === item.id ? 'rgba(10,123,108,0.2)' : 'transparent',
              borderLeft: `2px solid ${section === item.id ? 'var(--teal)' : 'transparent'}`,
              border: 'none', color: section === item.id ? '#fff' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: section === item.id ? 600 : 400, cursor: 'pointer',
              textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
            }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--orange)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 12 }}>
            <span>←</span> View Portal
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'DM Sans', sans-serif" }}>
            <span>→</span> Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── AGENTS SECTION ── */}
        {section === 'agents' && (
          <>
            <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', margin: 0 }}>Agent Management</h1>
                <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2, marginBottom: 0 }}>Review and approve partner registrations</p>
              </div>
              {agentCounts.pending > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: 'var(--orange-lt)', border: '1px solid rgba(232,97,58,0.3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>{agentCounts.pending} pending approval{agentCounts.pending !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            <div style={{ padding: '32px 40px' }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Total Agents', n: agentCounts.all, color: 'var(--teal)' },
                  { label: 'Pending', n: agentCounts.pending, color: 'var(--orange)' },
                  { label: 'Approved', n: agentCounts.approved, color: '#065F46' },
                  { label: 'Rejected', n: agentCounts.rejected, color: '#991B1B' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'white', border: '1px solid var(--rule)', padding: '24px' }}>
                    <div className="font-tight" style={{ fontSize: 40, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
                <input placeholder="Search by name, agency, email or city..." value={agentSearch} onChange={e => setAgentSearch(e.target.value)} className="input-field" style={{ maxWidth: 320 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                    <button key={f} onClick={() => setAgentFilter(f)} style={{ padding: '8px 18px', border: '1.5px solid var(--rule)', background: agentFilter === f ? 'var(--ink)' : 'white', color: agentFilter === f ? '#fff' : 'var(--ink-mid)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize' }}>
                      {f} ({agentCounts[f]})
                    </button>
                  ))}
                </div>
              </div>
              {/* Table */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-light)' }}>Loading agents...</div>
              ) : filteredAgents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', border: '1px solid var(--rule)' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>👥</div>
                  <div className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{agentFilter === 'pending' ? 'No pending applications' : 'No agents found'}</div>
                </div>
              ) : (
                <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 140px 180px', padding: '12px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--rule)', gap: 16 }}>
                    {['Agent / Agency', 'Contact', 'City', 'IATA#', 'Applied', 'Action'].map(h => (
                      <div key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</div>
                    ))}
                  </div>
                  {filteredAgents.map((agent, i) => (
                    <div key={agent.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 140px 180px', padding: '16px 20px', borderBottom: i < filteredAgents.length - 1 ? '1px solid var(--rule)' : 'none', gap: 16, alignItems: 'center', background: agent.status === 'pending' ? '#FFFBF5' : 'white' }}>
                      <div>
                        <div className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>{agent.full_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{agent.agency_name}</div>
                        {agent.how_did_you_hear && <div style={{ fontSize: 10, color: 'var(--teal)', marginTop: 3 }}>via {agent.how_did_you_hear}</div>}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--ink-mid)', marginBottom: 2 }}>{agent.email}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{agent.mobile}</div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{agent.city}</div>
                      <div style={{ fontSize: 12, color: agent.iata_number ? 'var(--ink)' : 'var(--ink-light)' }}>{agent.iata_number || '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{fmtDate(agent.created_at)}</div>
                      <div>
                        {agent.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleAgentAction(agent.id, 'approved')} disabled={updatingAgent === agent.id} style={{ padding: '7px 14px', background: 'var(--teal)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: updatingAgent === agent.id ? 0.6 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                              {updatingAgent === agent.id ? '...' : 'APPROVE'}
                            </button>
                            <button onClick={() => handleAgentAction(agent.id, 'rejected')} disabled={updatingAgent === agent.id} style={{ padding: '7px 14px', background: 'transparent', color: '#991B1B', border: '1px solid #FECACA', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                              REJECT
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', letterSpacing: '0.06em', background: agent.status === 'approved' ? '#D1FAE5' : '#FEE2E2', color: agent.status === 'approved' ? '#065F46' : '#991B1B' }}>{agent.status.toUpperCase()}</span>
                            {agent.status === 'approved' && <button onClick={() => handleAgentAction(agent.id, 'rejected')} style={{ fontSize: 10, color: 'var(--ink-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>revoke</button>}
                            {agent.status === 'rejected' && <button onClick={() => handleAgentAction(agent.id, 'approved')} style={{ fontSize: 10, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>approve</button>}
                            {agent.status === 'approved' && <button onClick={() => handleAgentAction(agent.id, 'suspended')} style={{ fontSize: 10, color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>suspend</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── BOOKINGS SECTION ── */}
        {section === 'bookings' && (
          <>
            <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '20px 40px' }}>
              <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', margin: 0 }}>All Bookings</h1>
              <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2, marginBottom: 0 }}>Confirm or cancel booking requests from agents</p>
            </div>
            <div style={{ padding: '32px 40px' }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Total', n: bookingCounts.all, color: 'var(--teal)' },
                  { label: 'Pending', n: bookingCounts.pending, color: '#92400E' },
                  { label: 'Confirmed', n: bookingCounts.confirmed, color: '#065F46' },
                  { label: 'Cancelled', n: bookingCounts.cancelled, color: '#991B1B' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'white', border: '1px solid var(--rule)', padding: '20px 24px' }}>
                    <div className="font-tight" style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              {/* Filter */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} style={{ padding: '8px 16px', border: '1.5px solid var(--rule)', borderRadius: 6, background: bookingFilter === f ? 'var(--ink)' : 'white', color: bookingFilter === f ? '#fff' : 'var(--ink-mid)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize' }}>
                    {f} ({bookingCounts[f]})
                  </button>
                ))}
              </div>
              {/* Table */}
              <div style={{ background: 'white', border: '1px solid var(--rule)', borderRadius: 12, overflow: 'hidden' }}>
                {filteredBookings.length === 0 ? (
                  <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-light)', fontSize: 14 }}>No bookings found</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg)' }}>
                        {['Ref', 'Agent', 'Package', 'Departure', 'Pax', 'Total', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b, i) => {
                        const st = BOOKING_STATUS[b.status] || BOOKING_STATUS.pending
                        const pax = (b.adults || 0) + (b.children_with_bed || 0) + (b.children_without_bed || 0)
                        const isUpdating = updatingBooking === b.id
                        return (
                          <tr key={b.id} style={{ borderBottom: '1px solid var(--rule)', background: i % 2 === 0 ? 'white' : 'var(--bg)' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <Link href={`/admin/bookings/${b.id}`} style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none' }}>{b.id.slice(0, 8).toUpperCase()}</Link>
                              <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{fmtDate(b.created_at)}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{b.agent?.full_name || '—'}</div>
                              <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{b.agent?.agency_name || '—'}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{b.package_name}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>{fmtDate(b.departure_date)}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{pax}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{fmtPrice(b.total_price)}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4, background: st.bg, color: st.color, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              {b.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button onClick={() => handleBookingStatus(b.id, 'confirmed')} disabled={isUpdating} style={{ padding: '6px 12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                                    {isUpdating ? '...' : 'Confirm'}
                                  </button>
                                  <button onClick={() => handleBookingStatus(b.id, 'cancelled')} disabled={isUpdating} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <Link href={`/admin/bookings/${b.id}`} style={{ fontSize: 12, color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>View →</Link>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── DEPARTURES SECTION ── */}
        {section === 'departures' && (
          <>
            <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', margin: 0 }}>Departure Management</h1>
                <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2, marginBottom: 0 }}>Manage availability and seat counts per departure</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {seedMsg && <span style={{ fontSize: 12, color: seedMsg.startsWith('✓') ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{seedMsg}</span>}
                <button onClick={seedDepartures} disabled={seeding} style={{ padding: '10px 18px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: seeding ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                  {seeding ? 'Seeding...' : '⚡ Seed All Departures'}
                </button>
              </div>
            </div>
            <div style={{ padding: '32px 40px' }}>
              <div style={{ marginBottom: 20 }}>
                <input value={depSearch} onChange={e => setDepSearch(e.target.value)} placeholder="Search by package name or date..." style={{ padding: '10px 16px', border: '1.5px solid var(--rule)', borderRadius: 8, fontSize: 13, width: 320, fontFamily: "'DM Sans', sans-serif" }} />
              </div>
              <div style={{ background: 'white', border: '1px solid var(--rule)', borderRadius: 12, overflow: 'hidden' }}>
                {filteredDeps.length === 0 ? (
                  <div style={{ padding: 60, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>✈️</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No departures found</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>Click "Seed All Departures" to populate from packages data.</div>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg)' }}>
                        {['Package', 'Region', 'Departure Date', 'Booked / Total', 'Status', 'Override'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeps.map((d, i) => {
                        const st = DEP_STATUS[d.status] || DEP_STATUS.available
                        const pct = Math.round(((d.booked_seats || 0) / (d.total_seats || 30)) * 100)
                        return (
                          <tr key={d.id} style={{ borderBottom: '1px solid var(--rule)', background: i % 2 === 0 ? 'white' : 'var(--bg)' }}>
                            <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{d.package_name}</td>
                            <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--ink-light)', textTransform: 'capitalize' }}>{d.region}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{new Date(d.departure_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{d.booked_seats || 0} / {d.total_seats || 30}</span>
                                <div style={{ flex: 1, height: 6, background: 'var(--rule)', borderRadius: 3, minWidth: 60 }}>
                                  <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? '#ef4444' : pct >= 33 ? '#f59e0b' : '#16a34a' }} />
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{pct}%</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4, background: st.bg, color: st.color, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <select value={d.status} disabled={updatingDep === d.id} onChange={e => handleDepStatus(d.id, e.target.value)} style={{ padding: '6px 10px', border: '1.5px solid var(--rule)', borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', background: 'white' }}>
                                <option value="available">Available</option>
                                <option value="fast-filling">Fast Filling</option>
                                <option value="sold-out">Sold Out</option>
                              </select>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
