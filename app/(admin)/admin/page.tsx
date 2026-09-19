'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'
import { formatDate, moneyOrDash as fmtPrice } from '@/lib/format'
import Logo from '@/components/ui/Logo'
import StatusBadge from '@/components/ui/StatusBadge'

type Agent = {
  id: string; full_name: string; agency_name: string; city: string
  mobile: string; email: string; iata_number: string | null
  how_did_you_hear: string | null; status: 'pending' | 'approved' | 'rejected' | 'suspended'
  created_at: string
  agency_address?: string | null; whatsapp_number?: string | null
  agency_website?: string | null; logo_url?: string | null
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
  active?: boolean
  package_name?: string; region?: string
}

const fmtDate = (d: string) => formatDate(d, 'short')

const BOOKING_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Pending',   bg: 'var(--warn-lt)', color: 'var(--warn)' },
  confirmed: { label: 'Confirmed', bg: 'var(--ok-bg)', color: 'var(--ok)' },
  cancelled: { label: 'Cancelled', bg: 'var(--danger-bg)', color: 'var(--danger)' },
}

const DEP_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  available:      { label: 'Available',    bg: 'var(--ok-bg)', color: 'var(--ok)' },
  'fast-filling': { label: 'Fast Filling', bg: 'var(--warn-lt)', color: 'var(--warn)' },
  'sold-out':     { label: 'Sold Out',     bg: 'var(--danger-bg)', color: 'var(--danger)' },
}

function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      style={{
        width: 38, height: 22, borderRadius: 11, border: 'none', padding: 2,
        background: checked ? 'var(--teal)' : 'var(--rule)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'background 0.15s', flexShrink: 0,
      }}
    >
      <span style={{
        display: 'block', width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transform: checked ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </button>
  )
}

type Section = 'agents' | 'bookings' | 'departures'

const HEARD_OPTIONS = ['Travel Exhibition (IITM / TTF / TAAI)', 'Referred by another agent', 'Social Media', 'GTF Sales Team', 'Google Search', 'Other']

function AgentDetailModal({ agent, onClose, onSaved }: { agent: Agent; onClose: () => void; onSaved: (a: Agent) => void }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [f, setF] = useState({
    full_name: agent.full_name, agency_name: agent.agency_name,
    agency_address: agent.agency_address || '', city: agent.city, mobile: agent.mobile,
    whatsapp_number: agent.whatsapp_number || '', agency_website: agent.agency_website || '',
    iata_number: agent.iata_number || '', how_did_you_hear: agent.how_did_you_hear || '',
  })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }))

  const pickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setError('Logo must be PNG, JPG or WEBP'); return }
    if (file.size > 500 * 1024) { setError('Logo must be under 500KB'); return }
    setError('')
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      let logo_url: string | undefined
      if (logoFile) {
        const fd = new FormData()
        fd.append('logo', logoFile)
        fd.append('email', agent.email)
        const up = await fetch('/api/auth/upload-logo', { method: 'POST', body: fd })
        const upData = await up.json()
        if (!up.ok) { setError(upData.error || 'Logo upload failed'); return }
        logo_url = upData.url
      }
      const res = await fetch(`/api/admin/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, logo_url }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to save changes'); return }
      onSaved(data.agent)
      setEditing(false)
      setLogoFile(null)
      setLogoPreview(null)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const site = agent.agency_website
  const view: [string, React.ReactNode][] = [
    ['Full name', agent.full_name],
    ['Agency', agent.agency_name],
    ['Agency address', agent.agency_address || '—'],
    ['City', agent.city],
    ['Mobile', agent.mobile],
    ['WhatsApp', agent.whatsapp_number || '—'],
    ['Email (login)', agent.email],
    ['Website', site
      ? <a href={/^https?:\/\//i.test(site) ? site : `https://${site}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>{site}</a>
      : '—'],
    ['IATA / TAFI no.', agent.iata_number || '—'],
    ['Heard about us via', agent.how_did_you_hear || '—'],
    ['Status', agent.status.toUpperCase()],
    ['Applied on', fmtDate(agent.created_at)],
  ]
  const edit: [string, keyof typeof f, boolean][] = [
    ['Full name *', 'full_name', false], ['Agency *', 'agency_name', false],
    ['Agency address *', 'agency_address', true], ['City *', 'city', false],
    ['Mobile *', 'mobile', false], ['WhatsApp *', 'whatsapp_number', false],
    ['Website', 'agency_website', false], ['IATA / TAFI no.', 'iata_number', false],
    ['Heard about us via *', 'how_did_you_hear', false],
  ]
  const shownLogo = logoPreview || agent.logo_url
  const btn = { padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' } as const

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(7,26,23,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--rule)' }}>
          <div className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{editing ? 'Edit agent details' : 'Agent details'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {!editing && <button onClick={() => setEditing(true)} style={{ ...btn, padding: '6px 14px', background: 'var(--teal)', color: '#fff', border: 'none' }}>Edit</button>}
            <button type="button" aria-label="Close" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-light)' }}>×</button>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          {shownLogo && (
            <div style={{ marginBottom: 20, padding: 16, border: '1px solid var(--rule)', background: 'var(--bg)', textAlign: 'center' }}>
              <img src={shownLogo} alt={`${agent.agency_name} logo`} style={{ maxHeight: 70, maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          )}
          {editing ? (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{agent.logo_url ? 'Replace logo' : 'Upload logo'} (PNG/JPG/WEBP, max 500KB)</label>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickLogo} style={{ fontSize: 12 }} />
              </div>
              {edit.map(([label, key, multi]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{label.toUpperCase()}</label>
                  {multi
                    ? <textarea className="input-field" rows={2} value={f[key]} onChange={set(key)} style={{ resize: 'none' }} />
                    : key === 'how_did_you_hear'
                      ? (
                        <select className="input-field" value={f[key]} onChange={set(key)}>
                          <option value="">Select an option</option>
                          {HEARD_OPTIONS.map(o => <option key={o}>{o}</option>)}
                          {f[key] && !HEARD_OPTIONS.includes(f[key]) && <option>{f[key]}</option>}
                        </select>
                      )
                      : <input className="input-field" value={f[key]} onChange={set(key)} />}
                </div>
              ))}
              <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 14 }}>Email is the agent&apos;s login and can&apos;t be changed here.</div>
              {error && <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', border: '1px solid var(--danger-bg)', color: 'var(--danger)', fontSize: 12, marginBottom: 14 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={save} disabled={saving} style={{ ...btn, background: 'var(--teal)', color: '#fff', border: 'none', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save changes'}</button>
                <button onClick={() => { setEditing(false); setError(''); setLogoFile(null); setLogoPreview(null) }} disabled={saving} style={{ ...btn, background: 'white', color: 'var(--ink-mid)', border: '1px solid var(--rule)' }}>Cancel</button>
              </div>
            </>
          ) : (
            view.map(([k, v]) => (
              <div key={k} className="rg-stack" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--rule)', fontSize: 13 }}>
                <div style={{ color: 'var(--ink-light)', fontWeight: 600, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', paddingTop: 2 }}>{k}</div>
                <div style={{ color: 'var(--ink)', wordBreak: 'break-word' }}>{v}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('agents')

  // Agents
  const [agents, setAgents] = useState<Agent[]>([])
  const [agentFilter, setAgentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [agentSearch, setAgentSearch] = useState('')
  const [updatingAgent, setUpdatingAgent] = useState<string | null>(null)
  const [viewAgent, setViewAgent] = useState<Agent | null>(null)

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

  // Package visibility (package_id -> active). Missing = inactive by default.
  const [packageActive, setPackageActive] = useState<Record<string, boolean>>({})
  const [updatingPkg, setUpdatingPkg] = useState<string | null>(null)

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

  // Fetch package visibility
  const fetchPackageVisibility = async () => {
    const res = await fetch('/api/packages/visibility')
    if (res.ok) {
      const data = await res.json()
      const map: Record<string, boolean> = {}
      for (const id of data.activePackageIds || []) map[id] = true
      setPackageActive(map)
    }
  }

  useEffect(() => {
    fetchAgents()
    fetchBookings()
    fetchDepartures()
    fetchPackageVisibility()
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
    else { const d = await res.json().catch(() => ({})); alert(d.error || 'Failed to update agent status') }
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

  const handleDepActive = async (id: string, active: boolean) => {
    setUpdatingDep(id)
    try {
      const res = await fetch(`/api/departures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      const data = await res.json()
      if (res.ok) {
        setDepartures(prev => prev.map(d => d.id === id ? { ...d, active } : d))
      } else {
        alert(data.error || 'Failed to update')
      }
    } catch {
      alert('Network error')
    }
    setUpdatingDep(null)
  }

  const handlePackageActive = async (packageId: string, active: boolean) => {
    setUpdatingPkg(packageId)
    try {
      const res = await fetch(`/api/admin/packages/${packageId}/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      const data = await res.json()
      if (res.ok) {
        setPackageActive(prev => ({ ...prev, [packageId]: active }))
      } else {
        alert(data.error || 'Failed to update')
      }
    } catch {
      alert('Network error')
    }
    setUpdatingPkg(null)
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
    <div className="admin-shell" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar */}
      <div className="admin-side" style={{ width: 240, background: 'var(--ink)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="admin-side-head" style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Logo tone="light" size={22} suffix="Admin" />
          </Link>
          <div style={{ marginTop: 12, padding: '4px 10px', background: 'rgba(127,212,196,0.15)', border: '1px solid rgba(127,212,196,0.4)', display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#7FD4C4' }}>ADMIN PANEL</div>
        </div>

        <nav className="admin-nav" style={{ padding: '16px 0', flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)} className="admin-nav-btn" style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', background: section === item.id ? 'rgba(10,123,108,0.2)' : 'transparent',
              borderLeft: `2px solid ${section === item.id ? 'var(--teal)' : 'transparent'}`,
              border: 'none', color: section === item.id ? '#fff' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: section === item.id ? 600 : 400, cursor: 'pointer',
              textAlign: 'left', fontFamily: 'var(--font-sans)',
            }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--warn)', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-side-foot" style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.62)', fontSize: 13, marginBottom: 12 }}>
            <span>←</span> View Portal
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.62)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)' }}>
            <span>→</span> Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {viewAgent && <AgentDetailModal key={viewAgent.id} agent={viewAgent} onClose={() => setViewAgent(null)} onSaved={a => { setAgents(prev => prev.map(x => x.id === a.id ? { ...x, ...a } : x)); setViewAgent(a) }} />}

        {/* ── AGENTS SECTION ── */}
        {section === 'agents' && (
          <>
            <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '20px clamp(18px, 5vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 className="font-display" style={{ fontSize: 24, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.015em', margin: 0 }}>Agent Management</h1>
                <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2, marginBottom: 0 }}>Review and approve partner registrations</p>
              </div>
              {agentCounts.pending > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: 'var(--warn-lt)', border: '1px solid rgba(107,78,0,0.3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>{agentCounts.pending} pending approval{agentCounts.pending !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            <div style={{ padding: '32px clamp(18px, 5vw, 40px)' }}>
              {/* Stats */}
              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Total Agents', n: agentCounts.all, color: 'var(--teal)' },
                  { label: 'Pending', n: agentCounts.pending, color: 'var(--warn)' },
                  { label: 'Approved', n: agentCounts.approved, color: 'var(--ok)' },
                  { label: 'Rejected', n: agentCounts.rejected, color: 'var(--danger)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'white', border: '1px solid var(--rule)', padding: '24px' }}>
                    <div className="font-tight" style={{ fontSize: 40, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
                <input placeholder="Search by name, agency, email or city..." value={agentSearch} onChange={e => setAgentSearch(e.target.value)} className="input-field" style={{ maxWidth: 320 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                    <button key={f} onClick={() => setAgentFilter(f)} style={{ padding: '8px 18px', border: '1.5px solid var(--rule)', background: agentFilter === f ? 'var(--ink)' : 'white', color: agentFilter === f ? '#fff' : 'var(--ink-mid)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>
                      {f} ({agentCounts[f]})
                    </button>
                  ))}
                </div>
              </div>
              {/* Table */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: 'clamp(48px, 9vw, 80px) 0', color: 'var(--ink-light)' }}>Loading agents...</div>
              ) : filteredAgents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'clamp(48px, 9vw, 80px) 0', background: 'white', border: '1px solid var(--rule)' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>👥</div>
                  <div className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{agentFilter === 'pending' ? 'No pending applications' : 'No agents found'}</div>
                </div>
              ) : (
                <div className="rg-scroll-x" style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 140px 180px', padding: '12px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--rule)', gap: 16 }}>
                    {['Agent / Agency', 'Contact', 'City', 'IATA#', 'Applied', 'Action'].map(h => (
                      <div key={h} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>{h.toUpperCase()}</div>
                    ))}
                  </div>
                  {filteredAgents.map((agent, i) => (
                    <div key={agent.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 140px 180px', padding: '16px 20px', borderBottom: i < filteredAgents.length - 1 ? '1px solid var(--rule)' : 'none', gap: 16, alignItems: 'center', background: agent.status === 'pending' ? 'var(--warn-lt)' : 'white' }}>
                      <div>
                        <button onClick={() => setViewAgent(agent)} className="font-tight" title="View full details" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 3, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', textDecoration: 'underline', textDecorationColor: 'var(--rule)', textUnderlineOffset: 3 }}>{agent.full_name}</button>
                        <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{agent.agency_name}</div>
                        <button onClick={() => setViewAgent(agent)} style={{ display: 'block', marginTop: 4, fontSize: 13, fontWeight: 700, color: 'var(--teal)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>View details →</button>
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
                            <button onClick={() => handleAgentAction(agent.id, 'approved')} disabled={updatingAgent === agent.id} style={{ padding: '7px 14px', background: 'var(--teal)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: updatingAgent === agent.id ? 0.6 : 1, fontFamily: 'var(--font-sans)' }}>
                              {updatingAgent === agent.id ? '...' : 'Approve'}
                            </button>
                            <button onClick={() => handleAgentAction(agent.id, 'rejected')} disabled={updatingAgent === agent.id} style={{ padding: '7px 14px', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger-bg)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', letterSpacing: '0.04em', background: agent.status === 'approved' ? 'var(--ok-bg)' : 'var(--danger-bg)', color: agent.status === 'approved' ? 'var(--ok)' : 'var(--danger)' }}>{agent.status.toUpperCase()}</span>
                            {agent.status === 'approved' && <button onClick={() => handleAgentAction(agent.id, 'rejected')} style={{ fontSize: 12, color: 'var(--ink-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>revoke</button>}
                            {agent.status === 'rejected' && <button onClick={() => handleAgentAction(agent.id, 'approved')} style={{ fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>approve</button>}
                            {agent.status === 'approved' && <button onClick={() => handleAgentAction(agent.id, 'suspended')} style={{ fontSize: 12, color: 'var(--warn)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>suspend</button>}
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
            <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '20px clamp(18px, 5vw, 40px)' }}>
              <h1 className="font-display" style={{ fontSize: 24, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.015em', margin: 0 }}>All Bookings</h1>
              <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2, marginBottom: 0 }}>Confirm or cancel booking requests from agents</p>
            </div>
            <div style={{ padding: '32px clamp(18px, 5vw, 40px)' }}>
              {/* Stats */}
              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Total', n: bookingCounts.all, color: 'var(--teal)' },
                  { label: 'Pending', n: bookingCounts.pending, color: 'var(--warn)' },
                  { label: 'Confirmed', n: bookingCounts.confirmed, color: 'var(--ok)' },
                  { label: 'Cancelled', n: bookingCounts.cancelled, color: 'var(--danger)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'white', border: '1px solid var(--rule)', padding: '20px 24px' }}>
                    <div className="font-tight" style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              {/* Filter */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} style={{ padding: '8px 16px', border: '1.5px solid var(--rule)', borderRadius: 6, background: bookingFilter === f ? 'var(--ink)' : 'white', color: bookingFilter === f ? '#fff' : 'var(--ink-mid)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>
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
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>{h.toUpperCase()}</th>
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
                              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{fmtDate(b.created_at)}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{b.agent?.full_name || '—'}</div>
                              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{b.agent?.agency_name || '—'}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{b.package_name}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>{fmtDate(b.departure_date)}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{pax}</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{fmtPrice(b.total_price)}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <StatusBadge status={b.status}>{st.label}</StatusBadge>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              {b.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button onClick={() => handleBookingStatus(b.id, 'confirmed')} disabled={isUpdating} style={{ padding: '6px 12px', background: 'var(--ok)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
                                    {isUpdating ? '...' : 'Confirm'}
                                  </button>
                                  <button onClick={() => handleBookingStatus(b.id, 'cancelled')} disabled={isUpdating} style={{ padding: '6px 12px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: isUpdating ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
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
            <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '20px clamp(18px, 5vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 className="font-display" style={{ fontSize: 24, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.015em', margin: 0 }}>Departure Management</h1>
                <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2, marginBottom: 0 }}>Manage availability and seat counts per departure</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {seedMsg && <span style={{ fontSize: 12, color: seedMsg.startsWith('✓') ? 'var(--ok)' : 'var(--danger)', fontWeight: 600 }}>{seedMsg}</span>}
                <button onClick={seedDepartures} disabled={seeding} style={{ padding: '10px 18px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: seeding ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
                  {seeding ? 'Seeding...' : '⚡ Seed All Departures'}
                </button>
              </div>
            </div>
            <div style={{ padding: '32px clamp(18px, 5vw, 40px)' }}>

              {/* Package visibility */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Package Visibility</div>
                <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 14 }}>Off = fully hidden from agents (browse, public site, quote builder). A package never toggled on defaults to off.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                  {PACKAGES.map(pkg => {
                    const active = !!packageActive[pkg.id]
                    return (
                      <div key={pkg.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', background: 'white', border: `1px solid ${active ? 'var(--rule)' : 'var(--danger-bg)'}`, borderRadius: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg.name}</div>
                          <div style={{ fontSize: 12, color: active ? 'var(--ink-light)' : 'var(--danger)', textTransform: 'capitalize', fontWeight: active ? 400 : 700 }}>{pkg.region} · {active ? 'Active' : 'Inactive'}</div>
                        </div>
                        <Toggle checked={active} disabled={updatingPkg === pkg.id} onChange={() => handlePackageActive(pkg.id, !active)} />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <input value={depSearch} onChange={e => setDepSearch(e.target.value)} placeholder="Search by package name or date..." style={{ padding: '10px 16px', border: '1.5px solid var(--ctl)', borderRadius: 8, fontSize: 13, width: 320, fontFamily: 'var(--font-sans)' }} />
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
                        {['Package', 'Region', 'Departure Date', 'Booked / Total', 'Status', 'Override', 'Active'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>{h.toUpperCase()}</th>
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
                                  <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? 'var(--danger)' : pct >= 33 ? 'var(--warn)' : 'var(--ok)' }} />
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{pct}%</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <StatusBadge status={d.status}>{st.label}</StatusBadge>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <select value={d.status} disabled={updatingDep === d.id} onChange={e => handleDepStatus(d.id, e.target.value)} style={{ padding: '6px 10px', border: '1.5px solid var(--ctl)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-sans)', cursor: 'pointer', background: 'white' }}>
                                <option value="available">Available</option>
                                <option value="fast-filling">Fast Filling</option>
                                <option value="sold-out">Sold Out</option>
                              </select>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <Toggle checked={!!d.active} disabled={updatingDep === d.id} onChange={() => handleDepActive(d.id, !d.active)} />
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
