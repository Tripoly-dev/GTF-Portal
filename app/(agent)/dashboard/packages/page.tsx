'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES, Package } from '@/data/packages'

const CITIES = ['Mumbai', 'Delhi', 'Ahmedabad', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune']
const TRAVELER_TYPES = ['Couples', 'Family', 'Honeymoon', 'Friends', 'Seniors', 'Corporate']
const THEMES = ['Away & Beyond', 'Wind & Waves', 'Beast & Beyond', 'Moments Away']
const MONTHS = [
  { label: 'Sep 26', value: '2026-09' }, { label: 'Oct 26', value: '2026-10' },
  { label: 'Nov 26', value: '2026-11' }, { label: 'Dec 26', value: '2026-12' },
  { label: 'Jan 27', value: '2027-01' }, { label: 'Feb 27', value: '2027-02' },
  { label: 'Mar 27', value: '2027-03' },
]
const PRICE_RANGES = [
  { label: '₹50k–₹80k', min: 50000, max: 80000 },
  { label: '₹80k–₹1.2L', min: 80001, max: 120000 },
  { label: '₹1.2L–₹1.5L', min: 120001, max: 150000 },
  { label: '₹1.5L+', min: 150001, max: 999999 },
]
const DURATION_RANGES = [
  { label: '4–8 Nights', min: 4, max: 8 },
  { label: '9–12 Nights', min: 9, max: 12 },
  { label: '13–16 Nights', min: 13, max: 16 },
]

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '3px 0', fontSize: 12, color: checked ? 'var(--teal)' : 'var(--ink-mid)', fontWeight: checked ? 600 : 400, userSelect: 'none' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      <div style={{ width: 15, height: 15, border: `2px solid ${checked ? 'var(--teal)' : 'var(--rule)'}`, background: checked ? 'var(--teal)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
        {checked && <span style={{ color: 'white', fontSize: 9, fontWeight: 800, lineHeight: 1 }}>✓</span>}
      </div>
      {label}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 14, marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', fontFamily: 'Inter, sans-serif' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.1em' }}>{title}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-light)', display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>}
    </div>
  )
}

function PackagesInner() {
  const searchParams = useSearchParams()
  const [region, setRegion] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [exCities, setExCities] = useState<string[]>([])
  const [travelerTypes, setTravelerTypes] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [months, setMonths] = useState<string[]>([])
  const [priceRanges, setPriceRanges] = useState<string[]>([])
  const [durations, setDurations] = useState<string[]>([])
  const [stars, setStars] = useState<number[]>([])

  useEffect(() => {
    const r = searchParams.get('region')
    if (r && r !== 'all') setRegion(r)
  }, [searchParams])

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  const toggleN = (arr: number[], set: (v: number[]) => void, val: number) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const activeCount = exCities.length + travelerTypes.length + themes.length + months.length + priceRanges.length + durations.length + stars.length + (region !== 'all' ? 1 : 0)

  const clearAll = () => {
    setExCities([]); setTravelerTypes([]); setThemes([]); setMonths([])
    setPriceRanges([]); setDurations([]); setStars([]); setRegion('all')
  }

  // ── FILTER LOGIC — fixed ───────────────────────────────────────────────────
  const filtered = PACKAGES.filter(p => {
    if (p.tag === 'COMING SOON') return false

    // Region — single select
    if (region !== 'all' && p.region !== region) return false

    // Search
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false

    // Ex-city — OR within group (package must serve at least one selected city)
    if (exCities.length > 0 && !exCities.some(c => p.exCities.includes(c))) return false

    // Traveler type — OR within group
    if (travelerTypes.length > 0 && !travelerTypes.some(t => p.travelerTypes.includes(t))) return false

    // Themes — OR within group
    if (themes.length > 0 && !themes.some(t => p.themes.includes(t))) return false

    // Stars — OR within group
    if (stars.length > 0 && !stars.includes(p.starRating)) return false

    // Price — OR within group (falls in ANY selected range)
    if (priceRanges.length > 0) {
      const inAnyRange = priceRanges.some(label => {
        const range = PRICE_RANGES.find(r => r.label === label)
        return range ? p.basePrice >= range.min && p.basePrice <= range.max : false
      })
      if (!inAnyRange) return false
    }

    // Duration — OR within group
    if (durations.length > 0) {
      const inAnyDuration = durations.some(label => {
        const dur = DURATION_RANGES.find(d => d.label === label)
        return dur ? p.nights >= dur.min && p.nights <= dur.max : false
      })
      if (!inAnyDuration) return false
    }

    // Month — package must have at least one departure in ANY selected month
    if (months.length > 0) {
      const hasMonth = months.some(m => p.departures.some(d => d.date.startsWith(m)))
      if (!hasMonth) return false
    }

    return true
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Filter sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: 'white', borderRight: '1px solid var(--rule)', padding: '20px 16px', overflowY: 'auto', maxHeight: '100vh', position: 'sticky', top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Filters</span>
          {activeCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: 11, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              Clear ({activeCount})
            </button>
          )}
        </div>

        <Section title="REGION">
          {['all', 'europe', 'africa', 'asia', 'americas', 'oceania'].map(r => (
            <Checkbox key={r} label={r === 'all' ? 'All Regions' : r.charAt(0).toUpperCase() + r.slice(1)}
              checked={region === r} onChange={() => setRegion(r)} />
          ))}
        </Section>

        <Section title="DURATION">
          {DURATION_RANGES.map(d => (
            <Checkbox key={d.label} label={d.label} checked={durations.includes(d.label)} onChange={() => toggle(durations, setDurations, d.label)} />
          ))}
        </Section>

        <Section title="DEPARTURE CITY">
          {CITIES.map(c => (
            <Checkbox key={c} label={c} checked={exCities.includes(c)} onChange={() => toggle(exCities, setExCities, c)} />
          ))}
        </Section>

        <Section title="PRICE PER PERSON">
          {PRICE_RANGES.map(r => (
            <Checkbox key={r.label} label={r.label} checked={priceRanges.includes(r.label)} onChange={() => toggle(priceRanges, setPriceRanges, r.label)} />
          ))}
        </Section>

        <Section title="HOTEL STARS">
          {[3, 4, 5].map(s => (
            <Checkbox key={s} label={`${s}★ Hotels`} checked={stars.includes(s)} onChange={() => toggleN(stars, setStars, s)} />
          ))}
        </Section>

        <Section title="MONTH OF TRAVEL">
          {MONTHS.map(m => (
            <Checkbox key={m.value} label={m.label} checked={months.includes(m.value)} onChange={() => toggle(months, setMonths, m.value)} />
          ))}
        </Section>

        <Section title="TRAVELER TYPE">
          {TRAVELER_TYPES.map(t => (
            <Checkbox key={t} label={t} checked={travelerTypes.includes(t)} onChange={() => toggle(travelerTypes, setTravelerTypes, t)} />
          ))}
        </Section>

        <Section title="GTF THEMES">
          {THEMES.map(t => (
            <Checkbox key={t} label={t} checked={themes.includes(t)} onChange={() => toggle(themes, setThemes, t)} />
          ))}
        </Section>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
          <div>
            <h1 className="font-tight" style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 2 }}>Browse Packages</h1>
            <p style={{ fontSize: 12, color: 'var(--ink-light)' }}>
              {activeCount > 0 ? `${filtered.length} results · ${activeCount} filter${activeCount > 1 ? 's' : ''} active` : `${filtered.length} packages available`}
            </p>
          </div>
          <input placeholder="Search packages..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field" style={{ maxWidth: 220 }} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            {region === 'oceania' ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🦘</div>
                <h3 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Oceania — Coming Soon</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 20 }}>Our Australia series is being curated. Check back soon or contact us for custom packages.</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <h3 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No packages match</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 20 }}>Try adjusting your filters</p>
                <button onClick={clearAll} className="btn-teal">Clear all filters</button>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  const nextDep = pkg.departures.find(d => d.status !== 'sold-out')
  const STATUS_STYLE: Record<string, React.CSSProperties> = {
    'available':    { background: '#D1FAE5', color: '#065F46' },
    'fast-filling': { background: '#FEF3C7', color: '#92400E' },
    'sold-out':     { background: '#FEE2E2', color: '#991B1B' },
  }
  return (
    <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }} className="pkg-card">
      <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
        <img src={pkg.img} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.72) 0%, transparent 55%)' }} />
        {pkg.tag && pkg.tag !== 'COMING SOON' && (
          <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 8px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>{pkg.tag}</div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          {'★'.repeat(pkg.starRating).split('').map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: 10 }}>★</span>)}
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', fontWeight: 600 }}>
            {pkg.region.toUpperCase()} · {pkg.nights}N/{pkg.days}D
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h3 className="font-tight" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{pkg.name}</h3>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {pkg.travelerTypes.slice(0, 2).map(t => (
            <span key={t} style={{ padding: '2px 6px', background: 'var(--teal-lt)', fontSize: 9, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.04em' }}>{t.toUpperCase()}</span>
          ))}
          {pkg.themes.slice(0, 1).map(t => (
            <span key={t} style={{ padding: '2px 6px', background: 'var(--orange-lt)', fontSize: 9, color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.04em' }}>{t.toUpperCase()}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
          <span className="font-tight" style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.02em' }}>
            ₹{pkg.basePrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 10, color: 'var(--ink-light)' }}>per person</span>
        </div>

        {nextDep && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-light)', marginBottom: 10 }}>
            <span>Next:</span>
            <strong style={{ color: 'var(--ink-mid)' }}>
              {new Date(nextDep.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </strong>
            <span style={{ ...STATUS_STYLE[nextDep.status], padding: '1px 5px', fontSize: 9, fontWeight: 700, borderRadius: 2 }}>
              {nextDep.status === 'fast-filling' ? 'FAST FILLING' : nextDep.status.toUpperCase()}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 7 }}>
          {pkg.hasPrice ? (
            <Link href={`/dashboard/packages/${pkg.id}`}
              style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'block' }}>
              CREATE QUOTE
            </Link>
          ) : (
            <a
              href={`https://wa.me/918928872400?text=${encodeURIComponent(`Hi GTF Team, I'd like to request pricing for ${pkg.name} (${pkg.nights}N/${pkg.days}D). Please share the nett rate and TAC so I can create a quote for my client.`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--orange)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'block' }}>
              REQUEST PRICING →
            </a>
          )}
          {pkg.workdriveUrl && (
            <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 11px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 11, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              PDF ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--ink-light)' }}>Loading...</div>}>
      <PackagesInner />
    </Suspense>
  )
}
