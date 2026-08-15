'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'

export default function DashboardPage() {
  const router = useRouter()
  const [agent, setAgent] = useState<{ name: string; agency: string; email: string; city: string } | null>(null)

  useEffect(() => {
    // For demo — read from localStorage or use demo data
    const stored = localStorage.getItem('gtf_agent')
    if (stored) setAgent(JSON.parse(stored))
    else setAgent({ name: 'Demo Agent', agency: 'Demo Travel Agency', email: 'agent@demo.com', city: 'Mumbai' })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('gtf_agent')
    router.push('/login')
  }

  const regions = [
    { name: 'Europe', count: 15, href: '/departures/europe', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80', status: 'active' },
    { name: 'Africa', count: 9, href: '/departures/africa', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80', status: 'active' },
    { name: 'Oceania', count: 2, href: '/departures/oceania', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&q=80', status: 'active' },
    { name: 'Asia', count: 0, href: '/departures/asia', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', status: 'coming' },
    { name: 'Americas', count: 0, href: '/departures/americas', img: 'https://static.wixstatic.com/media/11062b_f5be68c7acbc4b1b91a684d8acd6acb9~mv2.jpg', status: 'coming' },
  ]

  const recentPackages = PACKAGES.filter(p => p.tag !== 'COMING SOON').slice(0, 6)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{ width: 240, background: 'var(--ink)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Inter Tight, sans-serif' }}>G</div>
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>GTF <span style={{ fontWeight: 300 }}>Portal</span></span>
          </Link>
        </div>

        {/* Agent info */}
        {agent && (
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              {agent.name.charAt(0)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{agent.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{agent.agency}</div>
            <div style={{ marginTop: 8, padding: '3px 8px', background: 'rgba(10,123,108,0.3)', border: '1px solid rgba(10,123,108,0.5)', display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--teal)' }}>APPROVED PARTNER</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding: '16px 0', flex: 1 }}>
          {[
            { icon: '⊞', label: 'Dashboard', href: '/dashboard', active: true },
            { icon: '✈', label: 'Europe', href: '/departures/europe', active: false },
            { icon: '🦁', label: 'Africa', href: '/departures/africa', active: false },
            { icon: '🌏', label: 'Oceania', href: '/departures/oceania', active: false },
            { icon: '🗾', label: 'Asia', href: '/departures/asia', active: false },
            { icon: '🗽', label: 'Americas', href: '/departures/americas', active: false },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 24px', textDecoration: 'none',
              background: item.active ? 'rgba(10,123,108,0.2)' : 'transparent',
              borderLeft: item.active ? '2px solid var(--teal)' : '2px solid transparent',
              color: item.active ? '#fff' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: item.active ? 600 : 400,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 12 }}>
            <span>💬</span> WhatsApp Support
          </a>
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
            <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              Partner Dashboard
            </h1>
            <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2 }}>
              Welcome back{agent ? `, ${agent.name}` : ''}. You have access to all GTF B2B packages.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="mailto:sales@gtfholidays.com" style={{ padding: '8px 18px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em' }}>EMAIL SALES TEAM</a>
            <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" className="btn-teal" style={{ padding: '8px 18px', fontSize: 12 }}>WHATSAPP US</a>
          </div>
        </div>

        <div style={{ padding: '40px' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { n: '25+', l: 'Active Packages', color: 'var(--teal)' },
              { n: '5', l: 'Continents', color: 'var(--orange)' },
              { n: '100%', l: 'B2B Non-Compete', color: 'var(--teal)' },
              { n: '24/7', l: 'Ops Support', color: 'var(--orange)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--rule)', padding: '24px 24px' }}>
                <div className="font-tight" style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 500, letterSpacing: '0.04em' }}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Region cards */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Browse by Region</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {regions.map(r => (
                <Link key={r.name} href={r.href} style={{
                  position: 'relative', height: 160, overflow: 'hidden',
                  display: 'block', textDecoration: 'none',
                  opacity: r.status === 'coming' ? 0.65 : 1,
                }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.85) 0%, rgba(7,26,23,0.1) 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px' }}>
                    <div className="font-tight" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                      {r.status === 'coming' ? 'COMING SOON' : `${r.count} PACKAGES`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent packages */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Featured Packages</h2>
              <Link href="/departures/europe" style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {recentPackages.map(pkg => (
                <div key={pkg.id} style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>
                  <div style={{ height: 160, overflow: 'hidden' }}>
                    <img src={pkg.img} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>{pkg.nights}N / {pkg.days}D · {pkg.region.toUpperCase()}</div>
                    <h3 className="font-tight" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 12, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{pkg.name}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {pkg.workdriveUrl && (
                        <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
                          style={{ padding: '7px 14px', background: 'var(--teal)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none' }}>
                          VIEW PDF ↗
                        </a>
                      )}
                      <a href={`mailto:sales@gtfholidays.com?subject=Quote Request: ${pkg.name}`}
                        style={{ padding: '7px 14px', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none' }}>
                        REQUEST QUOTE
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support banner */}
          <div style={{ background: 'var(--ink)', padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
            <div>
              <h3 className="font-tight" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 8 }}>Need help with a quote?</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>
                Our sales team is available Monday–Saturday, 9AM–7PM IST. WhatsApp us or send an email and we'll get back within 2 hours.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
              <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" className="btn-teal" style={{ whiteSpace: 'nowrap' }}>WhatsApp Now</a>
              <a href="mailto:sales@gtfholidays.com" className="btn-outline-white" style={{ whiteSpace: 'nowrap' }}>Email Sales</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
