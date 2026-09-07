'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PACKAGES } from '@/data/packages'

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  available:    { label: 'Available',    bg: '#D1FAE5', color: '#065F46' },
  'fast-filling': { label: 'Fast Filling', bg: '#FEF3C7', color: '#92400E' },
  'sold-out':   { label: 'Sold Out',    bg: '#FEE2E2', color: '#991B1B' },
}

export default function AdminDeparturesPage() {
  const router = useRouter()
  const [departures, setDepartures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchDepartures = async () => {
    try {
      // Fetch departures for all packages
      const allDeps: any[] = []
      for (const pkg of PACKAGES) {
        const res = await fetch(`/api/departures/${pkg.id}`)
        if (res.ok) {
          const data = await res.json()
          allDeps.push(...(data.departures || []).map((d: any) => ({ ...d, package_name: pkg.name, region: pkg.region })))
        }
      }
      setDepartures(allDeps.sort((a, b) => a.departure_date.localeCompare(b.departure_date)))
    } catch { console.error('Failed to fetch departures') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDepartures() }, [])

  const seedDepartures = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch('/api/admin/seed-departures', { method: 'POST' })
      const data = await res.json()
      setSeedMsg(res.ok ? `✓ ${data.message}` : `Error: ${data.error}`)
      if (res.ok) fetchDepartures()
    } catch { setSeedMsg('Failed to seed') }
    finally { setSeeding(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await fetch(`/api/departures/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setDepartures(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    setUpdating(null)
  }

  const filtered = search
    ? departures.filter(d => d.package_name?.toLowerCase().includes(search.toLowerCase()) || d.departure_date?.includes(search))
    : departures

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: 32 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>ADMIN</div>
            <h1 className="font-tight" style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', margin: 0 }}>Departure Management</h1>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {seedMsg && <span style={{ fontSize: 12, color: seedMsg.startsWith('✓') ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{seedMsg}</span>}
            <button onClick={seedDepartures} disabled={seeding} style={{ padding: '10px 18px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: seeding ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }}>
              {seeding ? 'Seeding...' : '⚡ Seed All Departures'}
            </button>
            <Link href="/admin" style={{ fontSize: 13, color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>← Admin</Link>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by package name or date..." style={{ padding: '10px 16px', border: '1.5px solid var(--rule)', borderRadius: 8, fontSize: 13, width: 320, fontFamily: "'DM Sans', sans-serif" }} />
        </div>

        {/* Table */}
        <div style={{ background: 'white', border: '1px solid var(--rule)', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>Loading departures...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✈️</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No departures found</div>
              <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>Click "Seed All Departures" to populate from packages data.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg)' }}>
                  {['Package', 'Region', 'Departure Date', 'Seats (Booked/Total)', 'Status', 'Override Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--ink-light)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const st = STATUS_STYLES[d.status] || STATUS_STYLES.available
                  const pct = Math.round(((d.booked_seats || 0) / (d.total_seats || 30)) * 100)
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--rule)', background: i % 2 === 0 ? 'white' : 'var(--bg)' }}>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{d.package_name}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--ink-light)', textTransform: 'capitalize' }}>{d.region}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>
                        {new Date(d.departure_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{d.booked_seats || 0} / {d.total_seats || 30}</span>
                          <div style={{ flex: 1, height: 6, background: 'var(--rule)', borderRadius: 3, minWidth: 60 }}>
                            <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? '#ef4444' : pct >= 33 ? '#f59e0b' : '#16a34a', transition: 'width 0.3s' }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4, background: st.bg, color: st.color, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={d.status}
                          disabled={updating === d.id}
                          onChange={e => updateStatus(d.id, e.target.value)}
                          style={{ padding: '6px 10px', border: '1.5px solid var(--rule)', borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', background: 'white' }}>
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
    </div>
  )
}
