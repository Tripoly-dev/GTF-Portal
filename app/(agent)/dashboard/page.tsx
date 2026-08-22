'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'

export default function DashboardPage() {
  const [agent, setAgent] = useState<{ name: string; agency: string; email: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('gtf_agent')
    if (stored) setAgent(JSON.parse(stored))
    else setAgent({ name: 'Demo Agent', agency: 'Demo Travel Agency', email: 'agent@demo.com' })
  }, [])

  const regions = [
    { name: 'Europe', count: 10, href: '/dashboard/packages?region=europe', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80', status: 'active' },
    { name: 'Africa', count: 2, href: '/dashboard/packages?region=africa', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80', status: 'active' },
    { name: 'Asia', count: 5, href: '/dashboard/packages?region=asia', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', status: 'active' },
  ]

  const featuredPackages = PACKAGES.filter(p => p.tag !== 'COMING SOON').slice(0, 6)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--rule)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Partner Dashboard</h1>
          <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2 }}>
            Welcome back{agent ? `, ${agent.name}` : ''}. You have access to all GTF B2B packages.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/quotes" style={{ padding: '8px 18px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center' }}>MY QUOTES</Link>
          <Link href="/dashboard/packages" className="btn-teal" style={{ padding: '8px 18px', fontSize: 12 }}>+ NEW QUOTE</Link>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { n: '17', l: 'Active Packages', color: 'var(--teal)' },
            { n: '3', l: 'Continents', color: 'var(--orange)' },
            { n: '100%', l: 'B2B Non-Compete', color: 'var(--teal)' },
            { n: '24/7', l: 'Ops Support', color: 'var(--orange)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--rule)', padding: '22px 24px' }}>
              <div className="font-tight" style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 500, letterSpacing: '0.04em' }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Region cards */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Browse by Region</h2>
            <Link href="/dashboard/packages" style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>View all packages →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {regions.map(r => (
              <Link key={r.name} href={r.href} style={{ position: 'relative', height: 150, overflow: 'hidden', display: 'block', textDecoration: 'none', opacity: r.status === 'coming' ? 0.65 : 1 }}>
                <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.85) 0%, rgba(7,26,23,0.1) 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
                  <div className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                    {r.status === 'coming' ? 'COMING SOON' : `${r.count} PACKAGES`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured packages — with Create Quote button */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Featured Packages</h2>
            <Link href="/dashboard/packages" style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {featuredPackages.map(pkg => (
              <div key={pkg.id} style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  <img src={pkg.img} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.7) 0%, transparent 55%)' }} />
                  {pkg.tag && pkg.tag !== 'COMING SOON' && (
                    <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 8px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>{pkg.tag}</div>
                  )}
                  <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', fontWeight: 600 }}>{pkg.region.toUpperCase()} · {pkg.nights}N/{pkg.days}D</div>
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>{pkg.nights}N / {pkg.days}D</div>
                  <h3 className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{pkg.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span className="font-tight" style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)' }}>₹{pkg.basePrice.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 10, color: 'var(--ink-light)' }}>per person</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/dashboard/packages/${pkg.id}`}
                      style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'block' }}>
                      CREATE QUOTE
                    </Link>
                    {pkg.workdriveUrl && (
                      <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
                        style={{ padding: '8px 12px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 11, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        PDF ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support banner */}
        <div style={{ background: 'var(--ink)', padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div>
            <h3 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 6 }}>Need help with a quote?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>
              Our sales team is available Mon–Sat, 9AM–7PM IST. WhatsApp or email for a response within 2 hours.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" className="btn-teal" style={{ whiteSpace: 'nowrap' }}>WhatsApp Now</a>
            <a href="mailto:sales@gtfholidays.com" className="btn-outline-white" style={{ whiteSpace: 'nowrap' }}>Email Sales</a>
          </div>
        </div>
      </div>
    </div>
  )
}
