'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PACKAGES } from '@/data/packages'
import { reducedMotion } from '@/lib/motion'

// ── HERO ──────────────────────────────────────────────────────────────────────
// Exact implementation matching zip HTML prototype (GTF Portal Homepage.dc.html)
// PDF upgrade applied: photography fills blobs instead of image-slot placeholders
function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="hero-sec" style={{
      minHeight: 650,
      display: 'flex',
      alignItems: 'center',
      gap: 64,
      padding: 'clamp(53px, 9vw, 88px) clamp(18px, 5vw, 56px) 42px',
      position: 'relative',
      background: '#FFFFFF',
      overflow: 'hidden',
    }}>

      {/* LEFT — Typography / Brand (47%) */}
      <div className="hero-left" style={{
        flex: '0 0 47%',
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        position: 'relative',
        zIndex: 2,
      }}>

        {/* Headline */}
        <h1 className="font-display" style={{
          margin: 0,
          fontSize: 'clamp(2.75rem, 1.2rem + 4.6vw, 4.75rem)',
          fontWeight: 400,
          lineHeight: 1.04,
          paddingBottom: 8,
          letterSpacing: '-0.025em',
          color: 'var(--ink)',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s 0.08s ease, transform 0.7s 0.08s ease'}}>
          The world,<br /><em style={{ color: 'var(--brand)' }}>for your clients.</em>
        </h1>

        {/* Body — zip exact: 17px, var(--ink-mid), max-width 480px, line-height 1.7 */}
        <p style={{
          margin: 0, maxWidth: 480, fontSize: 17, lineHeight: 1.7,
          color: 'var(--ink-mid)', fontFamily: 'var(--font-sans)',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.18s ease, transform 0.7s 0.18s ease',
        }}>
          Curated global departures built exclusively for travel professionals. Series Departures · White Label · Bespoke Holidays — one B2B platform, three continents, zero B2C.
        </p>

        {/* CTAs — pill 999px, teal primary */}
        <div className="hero-cta" style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 6,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.28s ease, transform 0.7s 0.28s ease',
        }}>
          <Link href="/register" className="btn-teal btn-lg">Join as partner</Link>
          <Link href="/departures/europe" className="btn-outline btn-lg">Explore departures</Link>
        </div>

      </div>

      {/* RIGHT — Organic blob collage (44%) */}
      <div className="hero-right" style={{ flex: '0 0 44%', position: 'relative', height: 600 }}>

        {/* Dashed vertical route line */}
        <div style={{
          position: 'absolute', top: '14%', left: '16%',
          width: 2, height: '52%',
          background: 'repeating-linear-gradient(180deg, rgba(15,118,110,0.3) 0px 6px, transparent 6px 12px)',
          zIndex: 1,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.8s ease',
        }} />

        {/* PRIMARY BLOB — Swiss Alps, top-right, floatA */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '76%', height: '70%',
          borderRadius: '40% 60% 44% 56% / 52% 46% 54% 48%',
          overflow: 'hidden',
          boxShadow: '0 40px 90px rgba(6,20,20,0.4)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.2s ease',
          zIndex: 2,
        }}>
          <img
            src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900&q=90"
            alt="Swiss Alps"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, transparent 55%, rgba(3,10,10,0.65) 100%)', pointerEvents: 'none' }} />
          <div style={{
            position: 'absolute', bottom: 22, left: 26,
            color: '#fff', fontSize: 12,
            fontFamily: 'var(--font-mono)', opacity: 0.9,
          }}>ZRH · 47.3°N</div>
        </div>

        {/* SECONDARY BLOB — Mediterranean coast, bottom-left, floatC */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '65%', height: '58%',
          borderRadius: '48% 52% 58% 42% / 55% 45% 55% 45%',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(8,16,14,0.4)',
          border: '3px solid #fff',
          zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.45s ease',
        }}>
          <img
            src="https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=700&q=90"
            alt="Paris, Eiffel Tower"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, transparent 55%, rgba(3,10,10,0.55) 100%)', pointerEvents: 'none' }} />
          <div style={{
            position: 'absolute', bottom: 16, left: 18,
            color: '#fff', fontSize: 12,
            fontFamily: 'var(--font-mono)', opacity: 0.9,
          }}>PAR · 48.8566°N</div>
        </div>

        {/* CIRCLE — Japan, top-left, enlarged for a stronger destination signal */}
        <div style={{
          position: 'absolute', top: '9%', left: '5%',
          width: 190, height: 190,
          borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(4,20,20,0.4)',
          border: '3px solid #fff', zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.65s ease',
        }}>
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=90"
            alt="Japan cherry blossom temple"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }}
          />
        </div>

        {/* NBO label */}
        <div style={{
          position: 'absolute', top: '29%', left: '9%',
          color: 'var(--brand)', fontSize: 12,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700, letterSpacing: '0.04em', zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 0.9s ease',
        }}>NBO</div>

      </div>

    </section>
  )
}
// ── MARQUEE ───────────────────────────────────────────────────────────────────
function ProductStream() {
  const [active, setActive] = useState(0)
  const products = [
    { name: 'Europe', category: 'GROUP DEPARTURES', packages: '9', price: '€1,149', next: '02 OCT', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85', href: '/departures/europe', popular: ['Grand Europe — 12N', 'East European Delights — 7N', 'Paris & Amsterdam Escape — 5N'] },
    { name: 'Africa', category: 'GROUP DEPARTURES', packages: '2', price: '₹1,99,999', next: '09 OCT', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-0.jpg', href: '/departures/africa', popular: ['South African Splendour — 9N', 'Mystical Egypt — 8N'] },
    { name: 'Asia', category: 'GROUP DEPARTURES', packages: '5', price: '₹1,39,999', next: '20 SEP', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/JAPAN%20AUTOMN%20DISCOVERY/JAPAN%20AUTOMN%20DISCOVERY-0.png', href: '/departures/asia', popular: ['Japan Autumn Discovery — 8N', 'Grand Türkiye — 10N', 'Vietnam Escapes — 8N'] },
  ]

  return (
    <section id="product-stream" style={{ padding: 'clamp(58px, 9vw, 96px) clamp(18px, 5vw, 48px) clamp(67px, 9vw, 112px)', background: 'linear-gradient(135deg,#123536 0%,#1B4949 58%,#245756 100%)', color: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, marginBottom: 42, flexWrap: 'wrap' }}>
          <div>
            <h2 className="font-tight product-stream-heading font-display" style={{ margin: 0, fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1, fontWeight: 400, letterSpacing: '-0.03em' }}>Three continents. <span style={{ color: 'var(--accent-dk)', fontWeight: 400, fontStyle: 'italic' }}>Ready-to-sell departures.</span></h2>
          </div>
          <Link href="/departures/europe" style={{ color: 'var(--accent-dk)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Browse all departures →</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 14, justifyContent: 'center', padding: '8px 4px 18px' }}>
          {products.map((p, i) => {
            const expanded = active === i
            return (
              <Link key={p.name} href={p.href} aria-label={`View ${p.name} departures`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} style={{ position: 'relative', flex: `0 0 ${expanded ? '520px' : '280px'}`, minHeight: 500, borderRadius: 18, overflow: 'hidden', textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'end', padding: 24, backgroundImage: `linear-gradient(180deg,rgba(3,15,20,0.04) 26%,rgba(3,10,16,0.94) 100%), url(${p.image})`, backgroundPosition: 'center', backgroundSize: 'cover', transform: expanded ? 'translateY(-6px)' : 'translateY(0)', boxShadow: expanded ? '0 24px 54px rgba(0,0,0,0.34)' : '0 12px 28px rgba(0,0,0,0.16)', transition: 'flex-basis .45s ease, transform .35s ease, box-shadow .35s ease' }}>
                <span style={{ position: 'absolute', top: 16, left: 16, padding: '5px 9px', borderRadius: 999, background: 'rgba(3,10,16,.58)', border: '1px solid rgba(255,255,255,.22)', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>{p.category}</span>
                <div>
                  <div className="font-tight" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12, fontWeight: 700, color: 'rgba(255,253,248,.9)' }}><span>{p.packages} DEPARTURES</span>{p.price && <span style={{ color: 'var(--accent-dk)' }}>FROM {p.price}</span>}</div>
                  <div style={{ marginTop: 7, fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>NEXT: {p.next}</div>
                  {expanded && <div style={{ marginTop: 14, paddingTop: 13, borderTop: '1px solid rgba(255,255,255,.26)' }}><div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.62)', marginBottom: 8 }}>Popular departures</div>{p.popular.map(item => <div key={item} style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>{item}</div>)}<div style={{ marginTop: 12, fontSize: 13, fontWeight: 700 }}>View products →</div></div>}
                </div>
              </Link>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 2 }}>
          <button type="button" aria-label="Previous destination" onClick={() => setActive((active + products.length - 1) % products.length)} style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,.26)', background: 'rgba(255,255,255,.08)', color: '#fff', cursor: 'pointer' }}>←</button>
          <button type="button" aria-label="Next destination" onClick={() => setActive((active + 1) % products.length)} style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,.26)', background: 'rgba(255,255,255,.08)', color: '#fff', cursor: 'pointer' }}>→</button>
        </div>
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 28 }}>{products.map((p, i) => <span key={p.name} style={{ width: active === i ? 24 : 6, height: 6, borderRadius: 99, background: active === i ? 'var(--accent-dk)' : 'rgba(255,253,248,.28)', transition: 'background-color .25s ease, border-color .25s ease, color .25s ease, box-shadow .25s ease, transform .25s ease, opacity .25s ease, width 0.25s ease' }} />)}</div>
      </div>
    </section>
  )
}

// ── CUSTOMER JOURNEY ─────────────────────────────────────────────────────────
function CustomerJourney() {
  const clips = [
    { title: 'Kyoto at Dawn', country: 'JAPAN', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=85', quote: '"A quiet morning our clients still talk about."', partner: 'Japan · GTF Guest Story' },
    { title: 'Swiss Alps', country: 'SWITZERLAND', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=85', quote: '"Every view felt like part of the itinerary."', partner: 'Switzerland · GTF Guest Story' },
    { title: 'Tanzania Safari', country: 'AFRICA', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=85', quote: '"The wild moments became our favourite memories."', partner: 'Africa · GTF Guest Story' },
    { title: 'Paris by Night', country: 'FRANCE', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85', quote: '"Paris felt effortless from the first evening."', partner: 'France · GTF Guest Story' },
    { title: 'Australian Coast', country: 'AUSTRALIA', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=900&q=85', quote: '"The coast, the pace, and the people were perfect."', partner: 'Australia · GTF Guest Story' },
    { title: 'South Africa', country: 'SOUTH AFRICA', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/SOUTH%20AFRICAN%20SPLENDOUR/SOUTH%20AFRICAN%20SPLENDOUR-3.jpg', quote: '"An experience that redefines what travel means."', partner: 'South Africa · GTF Guest Story' },
    { title: 'Mystical Egypt', country: 'EGYPT', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MYSTICAL%20EGYPT/MYSTICAL%20EGYPT-0.jpg', quote: '"History came alive in the most unexpected ways."', partner: 'Egypt · GTF Guest Story' },
    { title: 'Japan in Autumn', country: 'JAPAN', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/JAPAN%20AUTOMN%20DISCOVERY/JAPAN%20AUTOMN%20DISCOVERY-2.jpg', quote: '"The colours, the culture, the calm — unforgettable."', partner: 'Japan · GTF Guest Story' },
    { title: 'Grand Turkiye', country: 'TURKEY', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/GRAND%20TURKIYE/GRAND%20TURKIYE-1.jpg', quote: '"Every city surprised us more than the last."', partner: 'Turkey · GTF Guest Story' },
    { title: 'Mauritian Paradise', country: 'MAURITIUS', image: 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/packages/MAURITIAN%20PARADISE/MAURITIAN%20PARADISE-1.jpg', quote: '"Pure paradise — clients are already planning their return."', partner: 'Mauritius · GTF Guest Story' },
  ]
  const [active, setActive] = useState(2)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAuto = (currentActive: number) => {
    if (reducedMotion()) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    progressRef.current = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 100)
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % clips.length)
      setProgress(0)
    }, 5000)
  }

  useEffect(() => {
    if (!paused) startAuto(active)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [paused, active])

  const goTo = (idx: number) => {
    setActive(idx)
    setProgress(0)
    setPaused(true)
    setTimeout(() => setPaused(false), 8000)
  }
  const prev = () => goTo((active - 1 + clips.length) % clips.length)
  const next = () => goTo((active + 1) % clips.length)

  return (
    <section className="cj2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="cj2-inner">
        <div className="cj2-header">
          <h2 className="cj2-title font-display">See the world through <em>our partners&apos; eyes</em></h2>
          <p className="cj2-sub">Real journeys. Real places. Real stories from travellers around the globe.</p>
        </div>
        <div className="cj2-stage">
          <button type="button" className="cj2-arrow" onClick={prev} aria-label="Previous">&#8249;</button>
          <div className="cj2-track">
            {clips.map((clip, i) => {
              const isActive = i === active
              const dist = Math.min(Math.abs(i - active), Math.abs(i - active + clips.length), Math.abs(i - active - clips.length))
              if (dist > 2) return null
              return (
                <button key={clip.title} type="button" onClick={() => goTo(i)}
                  className={`cj2-card${isActive ? ' cj2-card-active' : ''}`}
                  style={{ opacity: dist === 0 ? 1 : dist === 1 ? 0.7 : 0.4, transform: `scale(${isActive ? 1 : 0.88})` }}
                  aria-pressed={isActive}>
                  <div className="cj2-img" style={{ backgroundImage: `url(${clip.image})` }} />
                  <div className="cj2-shade" />
                  <span className="cj2-play">&#9654;</span>
                  <span className="cj2-chip">{clip.country}</span>
                  <div className="cj2-content">
                    <strong className="cj2-name">{clip.title}</strong>
                    {isActive && <div className="cj2-quote-wrap"><p className="cj2-quote">{clip.quote}</p><small className="cj2-partner">{clip.partner}</small></div>}
                  </div>
                  {isActive && <div className="cj2-progress-bar"><div className="cj2-progress-fill" style={{ width: `${progress}%` }} /></div>}
                </button>
              )
            })}
          </div>
          <button type="button" className="cj2-arrow" onClick={next} aria-label="Next">&#8250;</button>
        </div>
        <div className="cj2-dots">
          {clips.map((_, i) => <button key={i} type="button" className={`cj2-dot${i === active ? ' cj2-dot-active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />)}
        </div>
      </div>
    </section>
  )
}


// ── EDITORIAL INTRO ───────────────────────────────────────────────────────────
function EditorialIntro() {
  return (
    <section className="rg-stack" style={{ position: 'relative', overflow: 'hidden', minHeight: 560, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left — editorial text */}
      <div style={{ padding: 'clamp(43px, 9vw, 72px) clamp(18px, 5vw, 56px) clamp(43px, 9vw, 72px) clamp(18px, 5vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff', zIndex: 1 }}>
        <h2 className="font-tight about-portal-heading font-display" style={{
          fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.0,
          color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: 28,
        }}>
          One partner.<br />
          Every departure.<br />
          <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--teal)' }}>Global confidence.</span>
        </h2>
        <p className="about-portal-copy" style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-mid)', marginBottom: 20, fontWeight: 400 }}>
          GTF Connect gives travel agents and tour operators one dependable B2B partner for guaranteed series departures, white-label operations, and bespoke journeys.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-light)', marginBottom: 36, fontWeight: 400 }}>
          We coordinate the details behind the scenes so your team can sell with clarity, protect the client relationship, and grow across continents.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
          <Link href="/register" className="btn-teal">Join GTF as a partner →</Link>
          <Link href="/contact" className="btn-outline">Schedule a call</Link>
        </div>
        <div aria-label="GTF operating flow" style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          {['DISCOVER', 'QUOTE', 'Confirm', 'SUPPORT'].map((step, i) => (
            <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <span style={{ padding: '8px 13px', border: '1px solid var(--rule)', borderRadius: 999, color: 'var(--teal)', fontSize: 12, letterSpacing: '0.04em', fontWeight: 700 }}>{step}</span>
              {i < 3 && <span aria-hidden="true" style={{ color: 'var(--rule)' }}>→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Right — hero image with CTA overlay */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 560 }}>
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=90"
          alt="Travel professionals collaborating"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%', position: 'absolute', inset: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(7,26,23,0.88) 0%, rgba(7,26,23,0.55) 60%, rgba(7,26,23,0.3) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px clamp(18px, 5vw, 56px) 56px clamp(18px, 5vw, 52px)' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 400, lineHeight: 0.95, color: '#fff', marginBottom: 20, letterSpacing: '-0.03em' }}>
            Your next best-seller<br />
            <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--teal-lt)' }}>starts here.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--on-dark)', lineHeight: 1.7, marginBottom: 36, fontWeight: 400, maxWidth: 380 }}>
            Join a global partner network built to help travel professionals sell further — while GTF coordinates the world behind the scenes.
          </p>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', marginBottom: 16 }}>
            B2B only · Free registration · Admin approval required
          </div>
        </div>
      </div>
    </section>
  )
}

// ── BENTO VALUE GRID ─────────────────────────────────────────────────────────
// Earliest upcoming departure among packages an admin has switched on.
function useNextDeparture() {
  const [next, setNext] = useState<{ name: string; day: string; nights: number; days: number; region: string } | null>(null)
  useEffect(() => {
    fetch('/api/packages/visibility').then(r => r.json()).then(d => {
      const active: string[] = d.activePackageIds || []
      const today = new Date().toISOString().slice(0, 10)
      let best: { date: string; pkg: typeof PACKAGES[number] } | null = null
      for (const pkg of PACKAGES) {
        if (!active.includes(pkg.id)) continue
        for (const dep of pkg.departures) {
          if (dep.status !== 'sold-out' && dep.date >= today && (!best || dep.date < best.date)) best = { date: dep.date, pkg }
        }
      }
      if (best) setNext({
        name: best.pkg.name.toUpperCase(),
        day: new Date(best.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase(),
        nights: best.pkg.nights, days: best.pkg.days,
        region: best.pkg.region.toUpperCase(),
      })
    }).catch(() => {})
  }, [])
  return next
}

function ApprovedBento() {
  const [inView, setInView] = useState(false)
  const [routeMap, setRouteMap] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [flowStep, setFlowStep] = useState(0)
  const next = useNextDeparture()
  const sectionRef = useRef<HTMLElement | null>(null)
  const photos = [
    { src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=85', label: 'EUROPE' },
    { src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85', label: 'JAPAN' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85', label: 'ALPS' },
  ]
  useEffect(() => {
    const node = sectionRef.current
    if (!node || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } }, { threshold: .15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (reducedMotion()) return; const t = setInterval(() => setRouteMap(v => !v), 3200); return () => clearInterval(t) }, [])
  useEffect(() => { if (reducedMotion()) return; const t = setInterval(() => setPhotoIndex(v => (v + 1) % photos.length), 4800); return () => clearInterval(t) }, [photos.length])
  useEffect(() => { if (reducedMotion()) return; const t = setInterval(() => setFlowStep(v => (v + 1) % 4), 2400); return () => clearInterval(t) }, [])
  const reveal = inView ? ' approved-in' : ''
  return (
    <section ref={sectionRef} className="bento-approved" aria-labelledby="approved-bento-title">
      <div className="bento-approved-inner">
        <div className={`bento-approved-heading${reveal}`}>
          <h2 className="font-display" id="approved-bento-title">Built for professionals. <em>Designed for scale.</em></h2>
        </div>
        <div className="bento-approved-grid">
          <article className={`approved-tile approved-hero${reveal}`}>
            <div className="approved-hero-slides" aria-label="Curated luxury travel imagery">{photos.map((photo, i) => <div key={photo.label} className={`approved-hero-slide ${photoIndex === i ? 'photo-active' : ''}`} style={{ backgroundImage: `url('${photo.src}')` }} aria-hidden={photoIndex !== i} />)}</div>
            <div className="approved-hero-shade" />
            <div className="approved-hero-content"><div className="approved-label">GTF HOLIDAYS · GLOBAL TRAVEL FUSION</div><strong>The world,<br /><i>ready to sell.</i></strong><small>100% B2B · NON-COMPETE</small></div>
          </article>
          <article className={`approved-tile approved-routes${reveal} ${routeMap ? 'route-map-on' : ''}`}>
            <div className="approved-label">GLOBAL ROUTES</div>
            <strong className="route-copy">One partner.<br />Three continents.</strong>
            <div className="route-map-copy"><svg viewBox="0 0 260 100" aria-label="Schematic route connecting Europe, Japan and Australia"><path d="M8 70 C50 16 82 78 126 43 S197 18 252 72" /><circle cx="45" cy="43" r="5" /><circle cx="146" cy="43" r="5" /><circle cx="226" cy="63" r="5" /></svg><small>EUROPE · JAPAN · AUSTRALIA</small></div>
            <small>EUROPE · AFRICA · ASIA</small>
          </article>
          <article className={`approved-tile approved-platform${reveal}`}>
            <div className="approved-label">GTF CONNECT · PARTNER PLATFORM</div>
            <strong>Your clients.<br /><i>Our global engine.</i></strong>
            <p>White-label departures, coordinated operations, and partner-first support.</p>
            <small>BUILT FOR TRAVEL PROFESSIONALS</small>
          </article>
          <article className={`approved-tile approved-ticket${reveal}`}>
            <div className="ticket-main"><div className="approved-label">NEXT DEPARTURE{next ? ` · ${next.day}` : ''}</div><strong>{next ? next.name : 'GROUP SERIES'}</strong><small>{next ? `${next.nights}N / ${next.days}D · ${next.region} · LAND PACKAGE` : 'EUROPE · AFRICA · ASIA'}</small></div>
            <div className="ticket-stub"><b>GTF</b><span className="ticket-barcode" /><small>{next ? `B2B / ${next.day}` : 'B2B'}</small></div>
          </article>
          <article className={`approved-tile approved-flow${reveal}`}>
            <div className="approved-label">OPERATING MODEL</div>
            <div className="flow-line">{['DISCOVER', 'QUOTE', 'Confirm', 'SUPPORT'].map((step, i) => <span key={step} className={flowStep === i ? 'flow-active' : ''}>{step}{i < 3 ? ' →' : ''}</span>)}</div>
            <small>ONE BRIEF · ONE PROPOSAL</small>
          </article>
          <article className={`approved-tile approved-white-label${reveal}`}><div className="approved-label">WHITE LABEL SOLUTIONS</div><strong>YOUR BRAND.<br /><i>OUR BACKEND.</i></strong><small>PARTNER-READY · BUILT TO SCALE</small></article>
          <article className={`approved-tile approved-network${reveal}`}><div className="approved-label">AGENT NETWORK</div><div className="network-nodes">● · ● · ●</div><strong>Stronger together.</strong><small>MOVING NODES · ALWAYS ON</small></article>
        </div>
      </div>
    </section>
  )
}

// ── USPs ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductStream />
      <CustomerJourney />
      <ApprovedBento />
      <EditorialIntro />
    </main>
  )
}
