'use client'
import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PACKAGES, Package } from '@/data/packages'

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:       '#F4F8F7',
  ink:      '#18161a',
  inkMid:   '#494540',
  inkLight: '#6b655c',
  rule:     '#d6d0c5',
  nav:      '#241f2b',
  navFg:    '#efebe3',
  accent:   '#9e2233',
  gold:     '#6f5320',
  teal:     '#0a6e5e',
  tealDark: '#085e50',
  cardBg:   '#ffffff',
}
const font = '"DM Sans", "Archivo", system-ui, sans-serif'

// ── FILTER DATA ───────────────────────────────────────────────────────────────
const DURATION_RANGES = [
  { label: '4–8 Nights', min: 4, max: 8 },
  { label: '9–12 Nights', min: 9, max: 12 },
  { label: '13–16 Nights', min: 13, max: 16 },
]
const PRICE_RANGES = [
  { label: '₹50k–₹80k', min: 50000, max: 80000 },
  { label: '₹80k–₹1.2L', min: 80001, max: 120000 },
  { label: '₹1.2L–₹1.5L', min: 120001, max: 150000 },
  { label: '₹1.5L+', min: 150001, max: 999999 },
]
const MONTHS = [
  { label: 'Sep 26', value: '2026-09' }, { label: 'Oct 26', value: '2026-10' },
  { label: 'Nov 26', value: '2026-11' }, { label: 'Dec 26', value: '2026-12' },
  { label: 'Jan 27', value: '2027-01' }, { label: 'Feb 27', value: '2027-02' },
  { label: 'Mar 27', value: '2027-03' },
]
const TRAVELER_TYPES = ['Couples', 'Family', 'Honeymoon', 'Friends', 'Seniors', 'Corporate']
const THEMES = ['Away & Beyond', 'Wind & Waves', 'Beast & Beyond', 'Moments Away']

// ── FILTER CHECKBOX ───────────────────────────────────────────────────────────
function FilterRow({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <div onClick={onChange} style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      fontSize: 14, color: checked ? C.ink : C.inkMid, fontWeight: checked ? 600 : 400,
      padding: '5px 0', userSelect: 'none', fontFamily: font,
    }}>
      <span style={{
        width: 14, height: 14, flexShrink: 0,
        border: `2px solid ${checked ? C.ink : C.rule}`,
        background: checked ? C.ink : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.navFg, fontSize: 9, fontWeight: 800,
      }}>
        {checked ? '✓' : ''}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 12, color: '#8f8879' }}>{count}</span>}
    </div>
  )
}

// ── FILTER SECTION ────────────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: `1px solid ${C.rule}`, padding: '16px 0 6px' }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', color: C.inkMid, marginBottom: 12, fontFamily: font }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  )
}

// ── STATUS HELPERS ────────────────────────────────────────────────────────────
const STATUS_BG: Record<string, string> = {
  'available':    '#D1FAE5', 'fast-filling': '#FEF3C7', 'sold-out': '#FEE2E2',
}
const STATUS_FG: Record<string, string> = {
  'available':    '#065F46', 'fast-filling': '#92400E', 'sold-out': '#991B1B',
}
const STATUS_LABEL: Record<string, string> = {
  'available': 'AVAILABLE', 'fast-filling': 'FAST FILLING', 'sold-out': 'SOLD OUT',
}

// ── PACKAGE CARD ──────────────────────────────────────────────────────────────
function PackageCard({ pkg }: { pkg: Package }) {
  const nextDep = pkg.departures.find(d => d.status !== 'sold-out')
  const cardRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const fmtPrice = () => {
    if (pkg.currency === 'USD') return `$${pkg.basePrice.toLocaleString('en-US')}`
    if (pkg.currency === 'EUR') return `€${pkg.basePrice.toLocaleString('en-IN')}`
    return `₹${pkg.basePrice.toLocaleString('en-IN')}`
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.cardBg, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative', cursor: 'pointer',
        border: hovered ? '1.5px solid transparent' : `1px solid ${C.rule}`,
        transition: 'border-color 0.2s',
        // Magnetic glow border via background-image on border
        backgroundImage: hovered
          ? `radial-gradient(circle at ${glowPos.x}px ${glowPos.y}px, rgba(10,110,94,0.5) 0%, rgba(10,110,94,0.15) 40%, transparent 70%)`
          : 'none',
        backgroundClip: hovered ? 'padding-box' : 'unset',
        boxShadow: hovered ? `0 0 0 1.5px rgba(10,110,94,0.4), 0 8px 32px rgba(10,110,94,0.12)` : 'none',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden', flexShrink: 0 }}>
        <img src={pkg.img} alt={pkg.name} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: hovered ? 'grayscale(0%) brightness(1)' : 'grayscale(35%) brightness(0.92)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24,22,26,0.72) 0%, transparent 55%)' }} />
        {pkg.tag && pkg.tag !== 'COMING SOON' && (
          <div style={{ position: 'absolute', top: 0, left: 0, padding: '5px 10px', background: C.accent, fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase', fontFamily: font }}>{pkg.tag}</div>
        )}
        <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 11, color: 'rgba(239,236,229,0.75)', letterSpacing: '0.1em', fontWeight: 700, fontFamily: font }}>{pkg.region.toUpperCase()} · {pkg.nights}N/{pkg.days}D</div>
          <div>{'★'.repeat(pkg.starRating).split('').map((_, i) => <span key={i} style={{ color: '#d9b877', fontSize: 11 }}>★</span>)}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {pkg.travelerTypes.slice(0, 2).map(t => (
            <span key={t} style={{ padding: '3px 8px', border: `1px solid ${C.teal}`, fontSize: 11, color: C.teal, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: font }}>{t}</span>
          ))}
          {pkg.themes.slice(0, 1).map(t => (
            <span key={t} style={{ padding: '3px 8px', background: C.teal, fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: font }}>{t}</span>
          ))}
        </div>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: C.ink, lineHeight: 1.2, fontFamily: font }}>{pkg.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink, fontFamily: font }}>{fmtPrice()}</span>
          <span style={{ fontSize: 13, color: C.inkLight }}>per person</span>
        </div>
        {nextDep && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.inkLight, marginBottom: 14 }}>
            Next: <strong style={{ color: C.inkMid, fontWeight: 600 }}>{new Date(nextDep.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            <span style={{ background: STATUS_BG[nextDep.status] || '#D1FAE5', color: STATUS_FG[nextDep.status] || '#065F46', padding: '2px 7px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', fontFamily: font }}>
              {STATUS_LABEL[nextDep.status] || 'AVAILABLE'}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          {pkg.hasPrice ? (
            <Link href={`/dashboard/packages/${pkg.id}`} style={{
              flex: 1, textAlign: 'left', padding: '11px 18px', background: C.teal, color: '#fff',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
              textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: font, textTransform: 'uppercase', border: `2px solid ${C.teal}`,
              transition: 'background 0.15s, border-color 0.15s', borderRadius: 6,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.tealDark; (e.currentTarget as HTMLElement).style.borderColor = C.tealDark }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.teal; (e.currentTarget as HTMLElement).style.borderColor = C.teal }}
            >
              <span>Create quote</span><span style={{ fontSize: 15 }}>→</span>
            </Link>
          ) : (
            <a href={`https://wa.me/918928872400?text=${encodeURIComponent(`Hi GTF Team, I'd like to request pricing for ${pkg.name} (${pkg.nights}N/${pkg.days}D).`)}`}
              target="_blank" rel="noopener noreferrer" style={{
                flex: 1, textAlign: 'center', padding: '11px 0', background: C.accent, color: '#fff',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', display: 'block',
                fontFamily: font, textTransform: 'uppercase', border: `2px solid ${C.accent}`, borderRadius: 6,
              }}>
              Request Pricing →
            </a>
          )}
          {pkg.workdriveUrl && (
            <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer" style={{
              padding: '11px 14px', border: `2px solid ${C.rule}`, color: C.inkMid,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              display: 'flex', alignItems: 'center', fontFamily: font, borderRadius: 6,
            }}>
              PDF ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MAIN INNER COMPONENT ──────────────────────────────────────────────────────
function PackagesInner() {
  const searchParams = useSearchParams()
  const [region, setRegion] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [durations, setDurations] = useState<string[]>([])
  const [priceRanges, setPriceRanges] = useState<string[]>([])
  const [months, setMonths] = useState<string[]>([])
  const [travelerTypes, setTravelerTypes] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [stars, setStars] = useState<number[]>([])

  useEffect(() => {
    const r = searchParams.get('region')
    if (r && r !== 'all') setRegion(r)
  }, [searchParams])

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  const toggleN = (arr: number[], set: (v: number[]) => void, val: number) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const activeCount = durations.length + priceRanges.length + months.length + travelerTypes.length + themes.length + stars.length + (region !== 'all' ? 1 : 0)

  const clearAll = () => {
    setDurations([]); setPriceRanges([]); setMonths([])
    setTravelerTypes([]); setThemes([]); setStars([]); setRegion('all'); setSearch('')
  }

  // ── FILTER LOGIC ────────────────────────────────────────────────────────────
  const filtered = PACKAGES.filter(p => {
    if (p.tag === 'COMING SOON') return false
    if (region !== 'all' && p.region !== region) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (travelerTypes.length > 0 && !travelerTypes.some(t => p.travelerTypes.includes(t))) return false
    if (themes.length > 0 && !themes.some(t => p.themes.includes(t))) return false
    if (stars.length > 0 && !stars.includes(p.starRating)) return false
    if (priceRanges.length > 0) {
      const ok = priceRanges.some(label => {
        const range = PRICE_RANGES.find(r => r.label === label)
        return range ? p.basePrice >= range.min && p.basePrice <= range.max : false
      })
      if (!ok) return false
    }
    if (durations.length > 0) {
      const ok = durations.some(label => {
        const dur = DURATION_RANGES.find(d => d.label === label)
        return dur ? p.nights >= dur.min && p.nights <= dur.max : false
      })
      if (!ok) return false
    }
    if (months.length > 0) {
      const ok = months.some(m => p.departures.some(d => d.date.startsWith(m)))
      if (!ok) return false
    }
    return true
  })

  // Per-option counts (total packages that would match this filter if added)
  const countFor = (filterFn: (p: Package) => boolean) =>
    PACKAGES.filter(p => p.tag !== 'COMING SOON').filter(filterFn).length

  const regions = ['all', 'europe', 'africa', 'asia']
  const regionCounts: Record<string, number> = {
    all:    PACKAGES.filter(p => p.tag !== 'COMING SOON').length,
    europe: PACKAGES.filter(p => p.region === 'europe' && p.tag !== 'COMING SOON').length,
    africa: PACKAGES.filter(p => p.region === 'africa' && p.tag !== 'COMING SOON').length,
    asia:   PACKAGES.filter(p => p.region === 'asia'   && p.tag !== 'COMING SOON').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F8F7', color: C.ink, fontFamily: font }}>
      <div style={{ maxWidth: 1560, margin: '0 auto', padding: '0 40px 88px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0 }}>

        {/* ── FILTER SIDEBAR ─────────────────────────────────────────────────── */}
        <aside style={{ padding: '36px 32px 60px 0', borderRight: `2px solid rgba(24,22,26,0.35)`, position: 'sticky', top: 54, maxHeight: 'calc(100vh - 54px)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: font }}>Filters</div>
            {activeCount > 0 && (
              <button onClick={clearAll} style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', color: C.accent, cursor: 'pointer', background: 'none', border: 'none', fontFamily: font }}>
                CLEAR ALL
              </button>
            )}
          </div>

          <FilterSection title="REGION">
            {regions.map(r => (
              <FilterRow key={r} label={r === 'all' ? 'All Regions' : r.charAt(0).toUpperCase() + r.slice(1)}
                checked={region === r} onChange={() => setRegion(r)} count={regionCounts[r]} />
            ))}
          </FilterSection>

          <FilterSection title="DURATION">
            {DURATION_RANGES.map(d => (
              <FilterRow key={d.label} label={d.label} checked={durations.includes(d.label)}
                onChange={() => toggle(durations, setDurations, d.label)}
                count={countFor(p => p.nights >= d.min && p.nights <= d.max)} />
            ))}
          </FilterSection>

          <FilterSection title="PRICE PER PERSON">
            {PRICE_RANGES.map(r => (
              <FilterRow key={r.label} label={r.label} checked={priceRanges.includes(r.label)}
                onChange={() => toggle(priceRanges, setPriceRanges, r.label)}
                count={countFor(p => p.basePrice >= r.min && p.basePrice <= r.max)} />
            ))}
          </FilterSection>

          <FilterSection title="HOTEL STARS">
            {[3, 4, 5].map(s => (
              <FilterRow key={s} label={`${s}★ Hotels`} checked={stars.includes(s)}
                onChange={() => toggleN(stars, setStars, s)}
                count={countFor(p => p.starRating === s)} />
            ))}
          </FilterSection>

          <FilterSection title="MONTH OF TRAVEL">
            {MONTHS.map(m => (
              <FilterRow key={m.value} label={m.label} checked={months.includes(m.value)}
                onChange={() => toggle(months, setMonths, m.value)}
                count={countFor(p => p.departures.some(d => d.date.startsWith(m.value)))} />
            ))}
          </FilterSection>

          <FilterSection title="TRAVELER TYPE">
            {TRAVELER_TYPES.map(t => (
              <FilterRow key={t} label={t} checked={travelerTypes.includes(t)}
                onChange={() => toggle(travelerTypes, setTravelerTypes, t)}
                count={countFor(p => p.travelerTypes.includes(t))} />
            ))}
          </FilterSection>

          <FilterSection title="GTF THEMES">
            {THEMES.map(t => (
              <FilterRow key={t} label={t} checked={themes.includes(t)}
                onChange={() => toggle(themes, setThemes, t)}
                count={countFor(p => p.themes.includes(t))} />
            ))}
          </FilterSection>
        </aside>

        {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
        <main style={{ padding: '36px 0 0 40px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 6px', fontFamily: font, color: C.ink }}>
                Browse Packages
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: C.inkLight }}>
                {activeCount > 0
                  ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} · ${activeCount} filter${activeCount > 1 ? 's' : ''} active`
                  : `${filtered.length} packages · B2B non-compete`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="Search packages..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    fontFamily: font, fontSize: 13, padding: '9px 12px',
                    border: `1px solid ${C.rule}`, background: '#F4F8F7',
                    color: C.ink, outline: 'none', width: 220,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {region !== 'all' && (
                <button onClick={() => setRegion('all')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                  {region.toUpperCase()} <span style={{ fontSize: 13 }}>✕</span>
                </button>
              )}
              {durations.map(d => (
                <button key={d} onClick={() => toggle(durations, setDurations, d)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                  {d} <span style={{ fontSize: 13 }}>✕</span>
                </button>
              ))}
              {priceRanges.map(p => (
                <button key={p} onClick={() => toggle(priceRanges, setPriceRanges, p)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                  {p} <span style={{ fontSize: 13 }}>✕</span>
                </button>
              ))}
              {stars.map(s => (
                <button key={s} onClick={() => toggleN(stars, setStars, s)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                  {s}★ Hotels <span style={{ fontSize: 13 }}>✕</span>
                </button>
              ))}
              {months.map(m => {
                const label = MONTHS.find(mo => mo.value === m)?.label || m
                return (
                  <button key={m} onClick={() => toggle(months, setMonths, m)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                    {label} <span style={{ fontSize: 13 }}>✕</span>
                  </button>
                )
              })}
              {travelerTypes.map(t => (
                <button key={t} onClick={() => toggle(travelerTypes, setTravelerTypes, t)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                  {t} <span style={{ fontSize: 13 }}>✕</span>
                </button>
              ))}
              {themes.map(t => (
                <button key={t} onClick={() => toggle(themes, setThemes, t)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.ink}`, background: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font, color: C.ink, letterSpacing: '0.04em' }}>
                  {t} <span style={{ fontSize: 13 }}>✕</span>
                </button>
              ))}
            </div>
          )}

          {/* Package grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: C.inkLight, marginBottom: 16, fontFamily: font }}>
                No packages match those filters. Loosen the price band or clear a filter to see the full catalogue of 17.
              </div>
              <button onClick={clearAll} style={{
                padding: '12px 24px', background: C.ink, color: C.navFg,
                fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer',
                border: `2px solid ${C.ink}`, fontFamily: font, textTransform: 'uppercase',
              }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#6b655c', fontFamily: '"Archivo", system-ui, sans-serif' }}>Loading...</div>}>
      <PackagesInner />
    </Suspense>
  )
}
