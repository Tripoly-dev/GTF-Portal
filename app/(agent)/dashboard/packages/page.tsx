'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES, Package } from '@/data/packages'

const CITIES = ['Mumbai', 'Delhi', 'Ahmedabad', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune']
const TRAVELER_TYPES = ['Couples', 'Family', 'Honeymoon', 'Friends', 'Seniors', 'Corporate']
const THEMES = ['Away & Beyond', 'Wind & Waves', 'Beast & Beyond', 'Moments Away']
const MONTHS = [
  { label: 'Sep 2026', value: '2026-09' }, { label: 'Oct 2026', value: '2026-10' },
  { label: 'Nov 2026', value: '2026-11' }, { label: 'Dec 2026', value: '2026-12' },
  { label: 'Jan 2027', value: '2027-01' }, { label: 'Feb 2027', value: '2027-02' },
  { label: 'Mar 2027', value: '2027-03' },
]
const PRICE_RANGES = [
  { label: '₹50k – ₹80k', min: 50000, max: 80000 },
  { label: '₹80k – ₹1.2L', min: 80000, max: 120000 },
  { label: '₹1.2L – ₹1.5L', min: 120000, max: 150000 },
  { label: '₹1.5L+', min: 150000, max: 999999 },
]
const DURATION_RANGES = [
  { label: '4 – 8 Nights', min: 4, max: 8 },
  { label: '9 – 12 Nights', min: 9, max: 12 },
  { label: '13 – 16 Nights', min: 13, max: 16 },
]

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0', fontSize: 13, color: checked ? 'var(--teal)' : 'var(--ink-mid)', fontWeight: checked ? 600 : 400 }}>
      <div style={{ width: 16, height: 16, border: `2px solid ${checked ? 'var(--teal)' : 'var(--rule)'}`, background: checked ? 'var(--teal)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
        {checked && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
      </div>
      {label}
    </label>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', fontFamily: 'Inter, sans-serif' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.1em' }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--ink-light)', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▾</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

function PackagesInner() {
  const searchParams = useSearchParams()
  const [region, setRegion] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [exCity, setExCity] = useState<string[]>([])
  const [travelerType, setTravelerType] = useState<string[]>([])
  const [theme, setTheme] = useState<string[]>([])
  const [month, setMonth] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string[]>([])
  const [duration, setDuration] = useState<string[]>([])
  const [stars, setStars] = useState<number[]>([])

  useEffect(() => {
    const r = searchParams.get('region')
    if (r) setRegion(r)
  }, [searchParams])

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  const toggleNum = (arr: number[], setArr: (v: number[]) => void, val: number) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const activeCount = exCity.length + travelerType.length + theme.length + month.length + priceRange.length + duration.length + stars.length

  const filtered = PACKAGES.filter(p => {
    if (p.tag === 'COMING SOON') return false
    if (region !== 'all' && p.region !== region) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (exCity.length && !exCity.some(c => p.exCities.includes(c))) return false
    if (travelerType.length && !travelerType.some(t => p.travelerTypes.includes(t))) return false
    if (theme.length && !theme.some(t => p.themes.includes(t))) return false
    if (stars.length && !stars.includes(p.starRating)) return false
    if (priceRange.length) {
      const range = PRICE_RANGES.find(r => priceRange.includes(r.label))
      if (range && (p.basePrice < range.min || p.basePrice > range.max)) return false
    }
    if (duration.length) {
      const dur = DURATION_RANGES.find(d => duration.includes(d.label))
      if (dur && (p.nights < dur.min || p.nights > dur.max)) return false
    }
    if (month.length) {
      const hasMonth = p.departures.some(d => month.some(m => d.date.startsWith(m)))
      if (!hasMonth) return false
    }
    return true
  })

  const clearAll = () => {
    setExCity([]); setTravelerType([]); setTheme([]); setMonth([])
    setPriceRange([]); setDuration([]); setStars([])
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Filter sidebar */}
      <div style={{ width: 260, flexShrink: 0, background: 'white', borderRight: '1px solid var(--rule)', padding: '24px 20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Filters</span>
          {activeCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: 11, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              Clear all ({activeCount})
            </button>
          )}
        </div>

        {/* Region */}
        <FilterSection title="REGION">
          {['all', 'europe', 'africa', 'oceania'].map(r => (
            <FilterCheckbox key={r} label={r === 'all' ? 'All Regions' : r.charAt(0).toUpperCase() + r.slice(1)} checked={region === r} onChange={() => setRegion(r)} />
          ))}
        </FilterSection>

        {/* Duration */}
        <FilterSection title="DURATION OF STAY">
          {DURATION_RANGES.map(d => (
            <FilterCheckbox key={d.label} label={d.label} checked={duration.includes(d.label)} onChange={() => toggle(duration, setDuration, d.label)} />
          ))}
        </FilterSection>

        {/* Ex-City */}
        <FilterSection title="DEPARTURE CITY">
          {CITIES.map(c => (
            <FilterCheckbox key={c} label={c} checked={exCity.includes(c)} onChange={() => toggle(exCity, setExCity, c)} />
          ))}
        </FilterSection>

        {/* Price */}
        <FilterSection title="PRICE PER PERSON">
          {PRICE_RANGES.map(r => (
            <FilterCheckbox key={r.label} label={r.label} checked={priceRange.includes(r.label)} onChange={() => toggle(priceRange, setPriceRange, r.label)} />
          ))}
        </FilterSection>

        {/* Star rating */}
        <FilterSection title="STAR RATING">
          {[3, 4, 5].map(s => (
            <FilterCheckbox key={s} label={`${s}★ Hotels`} checked={stars.includes(s)} onChange={() => toggleNum(stars, setStars, s)} />
          ))}
        </FilterSection>

        {/* Month */}
        <FilterSection title="MONTH OF TRAVEL">
          {MONTHS.map(m => (
            <FilterCheckbox key={m.value} label={m.label} checked={month.includes(m.value)} onChange={() => toggle(month, setMonth, m.value)} />
          ))}
        </FilterSection>

        {/* Traveler type */}
        <FilterSection title="TRAVELER TYPE">
          {TRAVELER_TYPES.map(t => (
            <FilterCheckbox key={t} label={t} checked={travelerType.includes(t)} onChange={() => toggle(travelerType, setTravelerType, t)} />
          ))}
        </FilterSection>

        {/* Themes */}
        <FilterSection title="GTF THEMES">
          {THEMES.map(t => (
            <FilterCheckbox key={t} label={t} checked={theme.includes(t)} onChange={() => toggle(theme, setTheme, t)} />
          ))}
        </FilterSection>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="font-tight" style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4 }}>Browse Packages</h1>
            <p style={{ fontSize: 13, color: 'var(--ink-light)' }}>{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <input placeholder="Search packages..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field" style={{ maxWidth: 240 }} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No packages match</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 20 }}>Try adjusting your filters</p>
            <button onClick={clearAll} className="btn-teal">Clear all filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--rule)', overflow: 'hidden' }} className="pkg-card">
      <div style={{ position: 'relative', height: 175, overflow: 'hidden' }}>
        <img src={pkg.img} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.7) 0%, transparent 55%)' }} />
        {pkg.tag && pkg.tag !== 'COMING SOON' && (
          <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 9px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>{pkg.tag}</div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          {'★'.repeat(pkg.starRating).split('').map((s, i) => (
            <span key={i} style={{ color: '#F59E0B', fontSize: 10 }}>★</span>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', fontWeight: 600 }}>
            {pkg.region.toUpperCase()} · {pkg.nights}N/{pkg.days}D
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <h3 className="font-tight" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{pkg.name}</h3>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {pkg.travelerTypes.slice(0, 3).map(t => (
            <span key={t} style={{ padding: '2px 7px', background: 'var(--teal-lt)', border: '1px solid var(--rule)', fontSize: 10, color: 'var(--teal)', fontWeight: 600 }}>{t}</span>
          ))}
          {pkg.themes.slice(0, 1).map(t => (
            <span key={t} style={{ padding: '2px 7px', background: 'var(--orange-lt)', border: '1px solid rgba(232,97,58,0.2)', fontSize: 10, color: 'var(--orange)', fontWeight: 600 }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
          <span className="font-tight" style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.02em' }}>
            ₹{pkg.basePrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 500 }}>per person</span>
        </div>

        {/* Next departure */}
        {pkg.departures.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 12 }}>
            Next: <strong style={{ color: 'var(--ink-mid)' }}>
              {new Date(pkg.departures[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </strong>
            <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700,
              background: pkg.departures[0].status === 'available' ? '#D1FAE5' : pkg.departures[0].status === 'fast-filling' ? '#FEF3C7' : '#FEE2E2',
              color: pkg.departures[0].status === 'available' ? '#065F46' : pkg.departures[0].status === 'fast-filling' ? '#92400E' : '#991B1B',
            }}>{pkg.departures[0].status === 'fast-filling' ? 'FAST FILLING' : pkg.departures[0].status.toUpperCase()}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/dashboard/packages/${pkg.id}`}
            style={{ flex: 1, textAlign: 'center', padding: '9px 0', background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'block' }}>
            CREATE QUOTE
          </Link>
          {pkg.workdriveUrl && (
            <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: '9px 12px', border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', fontSize: 11, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--ink-light)' }}>Loading packages...</div>}>
      <PackagesInner />
    </Suspense>
  )
}
