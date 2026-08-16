'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PACKAGES, Package } from '@/data/packages'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function PackagesPage() {
  const [region, setRegion] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = PACKAGES.filter(p => {
    if (p.tag === 'COMING SOON') return false
    if (region !== 'all' && p.region !== region) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'europe', label: 'Europe' },
    { id: 'africa', label: 'Africa' },
    { id: 'oceania', label: 'Oceania' },
  ]

  return (
    <div style={{ padding: '32px 40px', background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-tight" style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Browse Packages
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-light)' }}>
          Select a package to view details and create a quote for your client
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
        <input
          placeholder="Search packages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field"
          style={{ maxWidth: 280 }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {regions.map(r => (
            <button key={r.id} onClick={() => setRegion(r.id)} style={{
              padding: '8px 18px', border: '1.5px solid var(--rule)',
              background: region === r.id ? 'var(--teal)' : 'white',
              color: region === r.id ? '#fff' : 'var(--ink-mid)',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
            }}>{r.label}</button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: 'var(--ink-light)', marginLeft: 'auto' }}>
          {filtered.length} packages
        </span>
      </div>

      {/* Package grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {filtered.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-light)' }}>
          No packages found
        </div>
      )}
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden', transition: 'all 0.2s' }}
      className="pkg-card">
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={pkg.img} alt={pkg.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.7) 0%, transparent 60%)' }} />
        {pkg.tag && pkg.tag !== 'COMING SOON' && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 9px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>
            {pkg.tag}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', fontWeight: 600 }}>
            {pkg.region.toUpperCase()} · {pkg.nights}N/{pkg.days}D
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px' }}>
        <h3 className="font-tight" style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 12, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {pkg.name}
        </h3>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
          <span className="font-tight" style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.02em' }}>
            ₹{pkg.basePrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 500 }}>per person (double)</span>
        </div>

        {/* Departures preview */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>NEXT DEPARTURES</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {pkg.departures.slice(0, 3).map(d => (
              <span key={d} style={{
                padding: '3px 8px', background: 'var(--teal-lt)',
                fontSize: 11, color: 'var(--teal)', fontWeight: 600,
                border: '1px solid var(--rule)',
              }}>
                {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
            ))}
            {pkg.departures.length > 3 && (
              <span style={{ fontSize: 11, color: 'var(--ink-light)', padding: '3px 0' }}>+{pkg.departures.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/dashboard/packages/${pkg.id}`}
            style={{ flex: 1, textAlign: 'center', padding: '10px 0', background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'block' }}>
            CREATE QUOTE
          </Link>
          {pkg.workdriveUrl && (
            <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: '10px 14px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              PDF ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
