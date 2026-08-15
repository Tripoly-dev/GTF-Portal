'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Agent = {
  id: string
  full_name: string
  agency_name: string
  city: string
  mobile: string
  email: string
  iata_number: string | null
  how_did_you_hear: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents')
      if (res.status === 401 || res.status === 403) { router.push('/login'); return }
      const data = await res.json()
      setAgents(data.agents || [])
    } catch {
      console.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAgents() }, [])

  const handleAction = async (agentId: string, action: 'approved' | 'rejected') => {
    setUpdating(agentId)
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action }),
      })
      if (res.ok) {
        setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: action } : a))
      }
    } catch { console.error('Update failed') }
    finally { setUpdating(null) }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const filtered = agents.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter
    const matchSearch = !search || [a.full_name, a.agency_name, a.email, a.city].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const counts = {
    all: agents.length,
    pending: agents.filter(a => a.status === 'pending').length,
    approved: agents.filter(a => a.status === 'approved').length,
    rejected: agents.filter(a => a.status === 'rejected').length,
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{ width: 240, background: 'var(--ink)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Inter Tight, sans-serif' }}>G</div>
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>GTF <span style={{ fontWeight: 300 }}>Admin</span></span>
          </Link>
          <div style={{ marginTop: 12, padding: '4px 10px', background: 'rgba(232,97,58,0.2)', border: '1px solid rgba(232,97,58,0.4)', display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--orange)' }}>ADMIN PANEL</div>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {[
            { icon: '⊞', label: 'Dashboard', active: true },
            { icon: '👥', label: `Agents (${counts.all})`, active: false },
            { icon: '⏳', label: `Pending (${counts.pending})`, active: false, highlight: counts.pending > 0 },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 24px',
              background: item.active ? 'rgba(10,123,108,0.2)' : 'transparent',
              borderLeft: item.active ? '2px solid var(--teal)' : '2px solid transparent',
              color: item.active ? '#fff' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: item.active ? 600 : 400,
              cursor: 'pointer',
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.highlight && <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 12 }}>
            <span>←</span> View Portal
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif' }}>
            <span>→</span> Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Top bar */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Agent Management</h1>
            <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2 }}>Review and approve partner registrations</p>
          </div>
          {counts.pending > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: 'var(--orange-lt)', border: '1px solid rgba(232,97,58,0.3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>{counts.pending} pending approval{counts.pending !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div style={{ padding: '32px 40px' }}>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Total Agents', n: counts.all, color: 'var(--teal)' },
              { label: 'Pending', n: counts.pending, color: 'var(--orange)' },
              { label: 'Approved', n: counts.approved, color: '#065F46' },
              { label: 'Rejected', n: counts.rejected, color: '#991B1B' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--rule)', padding: '24px 24px' }}>
                <div className="font-tight" style={{ fontSize: 40, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Filter + Search */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
            <input
              placeholder="Search by name, agency, email or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ maxWidth: 320 }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '8px 18px', border: '1.5px solid var(--rule)', background: filter === f ? 'var(--ink)' : 'white',
                  color: filter === f ? '#fff' : 'var(--ink-mid)', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.04em', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
                }}>
                  {f} ({counts[f]})
                </button>
              ))}
            </div>
          </div>

          {/* Agents table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-light)' }}>Loading agents...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>👥</div>
              <div className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
                {filter === 'pending' ? 'No pending applications' : 'No agents found'}
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-light)' }}>
                {filter === 'pending' ? 'All caught up! Check back when new agents register.' : 'Try adjusting your search or filter.'}
              </p>
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 140px 160px', padding: '12px 20px', background: 'var(--paper)', borderBottom: '1px solid var(--rule)', gap: 16 }}>
                {['Agent / Agency', 'Contact', 'City', 'IATA#', 'Applied', 'Action'].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</div>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((agent, i) => (
                <div key={agent.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 140px 160px',
                  padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--rule)' : 'none',
                  gap: 16, alignItems: 'center',
                  background: agent.status === 'pending' ? '#FFFBF5' : 'white',
                }}>
                  {/* Name + Agency */}
                  <div>
                    <div className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>{agent.full_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{agent.agency_name}</div>
                    {agent.how_did_you_hear && (
                      <div style={{ fontSize: 10, color: 'var(--teal)', marginTop: 3 }}>via {agent.how_did_you_hear}</div>
                    )}
                  </div>

                  {/* Contact */}
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--ink-mid)', marginBottom: 2 }}>{agent.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{agent.mobile}</div>
                  </div>

                  {/* City */}
                  <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{agent.city}</div>

                  {/* IATA */}
                  <div style={{ fontSize: 12, color: agent.iata_number ? 'var(--ink)' : 'var(--ink-light)' }}>
                    {agent.iata_number || '—'}
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{formatDate(agent.created_at)}</div>

                  {/* Action */}
                  <div>
                    {agent.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleAction(agent.id, 'approved')}
                          disabled={updating === agent.id}
                          style={{
                            padding: '7px 14px', background: 'var(--teal)', color: '#fff',
                            border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            opacity: updating === agent.id ? 0.6 : 1,
                          }}>
                          {updating === agent.id ? '...' : 'APPROVE'}
                        </button>
                        <button
                          onClick={() => handleAction(agent.id, 'rejected')}
                          disabled={updating === agent.id}
                          style={{
                            padding: '7px 14px', background: 'transparent', color: '#991B1B',
                            border: '1px solid #FECACA', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          }}>
                          REJECT
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className={`badge-${agent.status}`}>{agent.status.toUpperCase()}</span>
                        {agent.status === 'approved' && (
                          <button onClick={() => handleAction(agent.id, 'rejected')} style={{ fontSize: 10, color: 'var(--ink-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>revoke</button>
                        )}
                        {agent.status === 'rejected' && (
                          <button onClick={() => handleAction(agent.id, 'approved')} style={{ fontSize: 10, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>approve</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
