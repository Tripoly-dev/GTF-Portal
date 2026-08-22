'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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
    <section style={{
      minHeight: 650,
      display: 'flex',
      alignItems: 'center',
      gap: 64,
      padding: '88px 56px 42px',
      position: 'relative',
      background: '#FFFFFF',
      overflow: 'hidden',
    }}>

      {/* LEFT — Typography / Brand (47%) */}
      <div style={{
        flex: '0 0 47%',
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        position: 'relative',
        zIndex: 2,
      }}>

        {/* Eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12.5, fontWeight: 700, letterSpacing: '0.16em',
          color: '#0F766E', fontFamily: 'Inter, sans-serif',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{ width: 22, height: 1.5, background: '#14B8A6', display: 'inline-block', flexShrink: 0 }} />
          100% B2B · GTF HOLIDAYS
        </div>

        {/* Headline — zip exact: 72px, 800, line-height 1.03, letter-spacing -0.025em */}
        <h1 style={{
          margin: 0,
          fontSize: 68,
          fontWeight: 800,
          lineHeight: 1.08,
          paddingBottom: 8,
          letterSpacing: '-0.025em',
          fontFamily: 'Inter Tight, sans-serif',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s 0.08s ease, transform 0.7s 0.08s ease',
        }}>
          <span style={{ color: '#0F172A', display: 'block' }}>The World,</span>
          <span style={{
            display: 'block',
            fontWeight: 800,
            background: 'linear-gradient(120deg, #0F766E, #14B8A6 60%, #2DD4BF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>for your clients.</span>
        </h1>

        {/* Body — zip exact: 17px, #475569, max-width 480px, line-height 1.7 */}
        <p style={{
          margin: 0, maxWidth: 480, fontSize: 17, lineHeight: 1.7,
          color: '#475569', fontFamily: 'Inter, sans-serif',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.18s ease, transform 0.7s 0.18s ease',
        }}>
          Curated global departures built exclusively for travel professionals. Series Departures · White Label · Bespoke Holidays — one B2B platform, three continents, zero B2C.
        </p>

        {/* CTAs — zip exact: pill 999px, coral #FF5A5F primary */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18, marginTop: 6,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.28s ease, transform 0.7s 0.28s ease',
        }}>
          <Link href="/register" style={{
            textDecoration: 'none', fontSize: 14, fontWeight: 700,
            letterSpacing: '0.02em', color: '#fff',
            padding: '18px 32px', borderRadius: 999,
            background: '#FF5A5F',
            boxShadow: '0 8px 24px rgba(255,90,95,0.35)',
            display: 'inline-block', fontFamily: 'Inter, sans-serif',
            transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.045) translateY(-1px)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 14px 32px rgba(255,90,95,0.48)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(255,90,95,0.35)'
          }}>
            JOIN AS PARTNER →
          </Link>
          <Link href="/departures/europe" style={{
            textDecoration: 'none', fontSize: 14, fontWeight: 700,
            letterSpacing: '0.02em', color: '#0F172A',
            padding: '18px 30px', borderRadius: 999,
            border: '1.5px solid #CBD5E1',
            display: 'inline-block', fontFamily: 'Inter, sans-serif',
            transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#0F172A'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'
          }}>
            EXPLORE DEPARTURES
          </Link>
        </div>

        {/* Stats — zip exact: 24px, padding 30px, border #E2E8F0 */}
        <div style={{
          display: 'flex', gap: 0,
          borderTop: '1px solid #E2E8F0', paddingTop: 22,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 0.38s ease',
        }}>
          {[
            { n: '3', l: 'CONTINENTS' },
            { n: '17', l: 'ACTIVE PACKAGES' },
            { n: '100%', l: 'B2B ONLY' },
            { n: 'Global', l: 'OPS SUPPORT' },
          ].map((s, i) => (
            <div key={s.n} style={{
              paddingRight: i < 3 ? 30 : 0,
              paddingLeft: i > 0 ? 30 : 0,
              borderRight: i < 3 ? '1px solid #E2E8F0' : 'none',
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1, fontFamily: 'Inter Tight, sans-serif' }}>{s.n}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', color: '#64748B', marginTop: 5, fontFamily: 'Inter, sans-serif' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Organic blob collage (44%) */}
      <div style={{ flex: '0 0 44%', position: 'relative', height: 600 }}>

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
          animation: 'floatA 8s ease-in-out infinite',
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
            color: '#fff', fontSize: 11, letterSpacing: '0.04em',
            fontFamily: 'ui-monospace, monospace', opacity: 0.9,
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
          animation: 'floatC 7s ease-in-out infinite',
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
            color: '#fff', fontSize: 10.5, letterSpacing: '0.04em',
            fontFamily: 'ui-monospace, monospace', opacity: 0.9,
          }}>PAR · 48.8566°N</div>
        </div>

        {/* CIRCLE — Japan, top-left, enlarged for a stronger destination signal */}
        <div style={{
          position: 'absolute', top: '9%', left: '5%',
          width: 190, height: 190,
          borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(4,20,20,0.4)',
          border: '3px solid #fff', zIndex: 3,
          animation: 'floatB 6s ease-in-out infinite',
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
          color: '#0F766E', fontSize: 10,
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700, letterSpacing: '0.05em', zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 0.9s ease',
        }}>NBO</div>

        {/* 5 CONTINENTS badge */}
        <div style={{
          position: 'absolute', top: '6%', right: '4%',
          background: 'rgba(15,118,110,0.94)',
          backdropFilter: 'blur(6px)',
          color: '#fff', fontSize: 10.5, fontWeight: 700,
          letterSpacing: '0.08em', padding: '7px 12px',
          borderRadius: 999, zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 1s ease',
        }}>3 CONTINENTS</div>
      </div>

      {/* Float animations — exact from zip */}
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-18px) rotate(-1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) rotate(4deg); }
          50% { transform: translateY(16px) rotate(6deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </section>
  )
}
// ── MARQUEE ───────────────────────────────────────────────────────────────────
function DestinationMarquee() {
  const items = ['Grand Europe', 'Mystical Egypt', 'Japan Autumn Discovery', 'Vietnam Escapes', 'South African Splendour', 'Grand Türkiye', 'Timeless Japan', 'Mauritian Paradise', 'East European Delights', 'Paris & Amsterdam Escape']
  return (
    <div className="marquee-strip" aria-label="GTF featured departures">
      <div className="marquee-track">
        {[...items, ...items, ...items].map((item, i) => <span className="marquee-item" key={`${item}-${i}`}>{item}<span className="marquee-star" aria-hidden="true">✦</span></span>)}
      </div>
    </div>
  )
}

// ── PRODUCT STREAM ───────────────────────────────────────────────────────────
// The homepage's primary B2B product-discovery surface. Cards expand on focus
// or hover so agents can scan commercial details without leaving the homepage.
function ProductStream() {
  const [active, setActive] = useState(0)
  const products = [
    { name: 'Europe', category: 'GROUP DEPARTURES', packages: '10', price: '₹78,000', next: '18 SEP', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85', href: '/departures/europe', popular: ['Grand Europe — 12N', 'East European Delights — 7N', 'Paris & Amsterdam Escape — 5N'] },
    { name: 'Africa', category: 'GROUP DEPARTURES', packages: '2', price: '₹1,99,999', next: '09 OCT', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1000&q=85', href: '/departures/africa', popular: ['South African Splendour — 9N', 'Mystical Egypt — 8N'] },
    { name: 'Asia', category: 'GROUP DEPARTURES', packages: '5', price: '₹1,39,999', next: '20 SEP', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=85', href: '/departures/asia', popular: ['Japan Autumn Discovery — 8N', 'Grand Türkiye — 10N', 'Vietnam Escapes — 8N'] },
  ]

  return (
    <section id="product-stream" style={{ padding: '96px 48px 112px', background: 'linear-gradient(135deg,#123536 0%,#1B4949 58%,#245756 100%)', color: '#FFFDF8', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, marginBottom: 42, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow" style={{ color: '#79D8C5', marginBottom: 12 }}>THE SIGNATURE FEATURE</div>
            <h2 className="font-tight product-stream-heading" style={{ margin: 0, fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em' }}>Three continents. <span style={{ color: '#79D8C5', fontWeight: 300, fontStyle: 'italic' }}>Ready-to-sell departures.</span></h2>
          </div>
          <Link href="/departures/europe" style={{ color: '#79D8C5', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>BROWSE ALL DEPARTURES →</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 14, overflowX: 'auto', padding: '8px 4px 18px', scrollbarWidth: 'thin' }}>
          {products.map((p, i) => {
            const expanded = active === i
            return (
              <Link key={p.name} href={p.href} aria-label={`View ${p.name} departures`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} style={{ position: 'relative', flex: `0 0 ${expanded ? '440px' : '220px'}`, minHeight: 500, borderRadius: 18, overflow: 'hidden', textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'end', padding: 24, backgroundImage: `linear-gradient(180deg,rgba(3,15,20,0.04) 26%,rgba(3,10,16,0.94) 100%), url(${p.image})`, backgroundPosition: 'center', backgroundSize: 'cover', transform: expanded ? 'translateY(-6px)' : 'translateY(0)', boxShadow: expanded ? '0 24px 54px rgba(0,0,0,0.34)' : '0 12px 28px rgba(0,0,0,0.16)', transition: 'flex-basis .45s ease, transform .35s ease, box-shadow .35s ease' }}>
                <span style={{ position: 'absolute', top: 16, left: 16, padding: '5px 9px', borderRadius: 999, background: 'rgba(3,10,16,.58)', border: '1px solid rgba(255,255,255,.22)', fontSize: 9, fontWeight: 700, letterSpacing: '.08em' }}>{p.category}</span>
                <div>
                  <div className="font-tight" style={{ fontSize: 27, fontWeight: 800, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12, fontWeight: 700, color: 'rgba(255,253,248,.9)' }}><span>{p.packages} DEPARTURES</span><span style={{ color: '#79D8C5' }}>FROM {p.price}</span></div>
                  <div style={{ marginTop: 7, fontSize: 11.5, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>NEXT: {p.next}</div>
                  {expanded && <div style={{ marginTop: 14, paddingTop: 13, borderTop: '1px solid rgba(255,255,255,.26)' }}><div style={{ fontSize: 10, letterSpacing: '.1em', fontWeight: 700, color: 'rgba(255,255,255,.62)', marginBottom: 8 }}>POPULAR DEPARTURES</div>{p.popular.map(item => <div key={item} style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>{item}</div>)}<div style={{ marginTop: 12, fontSize: 12, fontWeight: 700 }}>VIEW PRODUCTS →</div></div>}
                </div>
              </Link>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 2 }}>
          <button type="button" aria-label="Previous destination" onClick={() => setActive((active + products.length - 1) % products.length)} style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,.26)', background: 'rgba(255,255,255,.08)', color: '#fff', cursor: 'pointer' }}>←</button>
          <button type="button" aria-label="Next destination" onClick={() => setActive((active + 1) % products.length)} style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,.26)', background: 'rgba(255,255,255,.08)', color: '#fff', cursor: 'pointer' }}>→</button>
        </div>
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 28 }}>{products.map((p, i) => <span key={p.name} style={{ width: active === i ? 24 : 6, height: 6, borderRadius: 99, background: active === i ? '#79D8C5' : 'rgba(255,253,248,.28)', transition: 'all .25s ease' }} />)}</div>
      </div>
    </section>
  )
}

// ── CUSTOMER JOURNEY ─────────────────────────────────────────────────────────
function CustomerJourney() {
  const journeyRef = useRef<HTMLDivElement | null>(null)
  const clips = [
    { title: 'Kyoto at Dawn', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=85', quote: '“A quiet morning our clients still talk about.”', partner: 'Japan · GTF guest story', duration: '10 sec' },
    { title: 'Swiss Alps', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=85', quote: '“Every view felt like part of the itinerary.”', partner: 'Switzerland · GTF guest story', duration: '10 sec' },
    { title: 'Tanzania Safari', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=85', quote: '“The wild moments became our favourite memories.”', partner: 'Tanzania · GTF guest story', duration: '10 sec' },
    { title: 'Paris by Night', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&q=85', quote: '“Paris felt effortless from the first evening.”', partner: 'France · GTF guest story', duration: '10 sec' },
    { title: 'Australian Coast', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=700&q=85', quote: '“The coast, the pace, and the people were perfect.”', partner: 'Australia · GTF guest story', duration: '10 sec' },
    { title: 'Iceland in Motion', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=700&q=85', quote: '“A cinematic trip our whole group remembers.”', partner: 'Iceland · GTF guest story', duration: '10 sec' },
    { title: 'Rome After Dark', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=700&q=85', quote: '“History, food, and the right pace in one journey.”', partner: 'Italy · GTF guest story', duration: '10 sec' },
    { title: 'African Great Migration', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=700&q=85', quote: '“The kind of experience that changes how you travel.”', partner: 'Kenya · GTF guest story', duration: '10 sec' },
    { title: 'Eastern Europe', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?w=700&q=85', quote: '“Unexpected cities, beautiful details, brilliant stories.”', partner: 'Prague & Budapest · GTF guest story', duration: '10 sec' },
    { title: 'European Winter Markets', label: 'CUSTOMER TRAVEL FILM', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=700&q=85', quote: '“A winter escape our clients want to repeat.”', partner: 'Central Europe · GTF guest story', duration: '10 sec' },
  ]
  const scrollJourney = (direction: number) => journeyRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' })
  return (
    <section id="customer-journey" className="customer-journey" aria-labelledby="customer-journey-title">
      <div className="customer-journey-intro"><div className="eyebrow">CUSTOMER JOURNEY · REAL TRAVEL STORIES</div><h2 id="customer-journey-title">See the world through our partners’ eyes</h2><p>Real journeys. Real places. Real stories from travellers around the globe.</p></div>
      <div className="customer-journey-carousel">
        <button type="button" aria-label="Previous journey step" onClick={() => scrollJourney(-1)}>←</button>
        <div className="customer-journey-track" ref={journeyRef}>
          {clips.map((clip, index) => <button type="button" className="customer-journey-card" key={clip.title} aria-label={`Play testimonial: ${clip.title}`} style={{ animationDelay: `${index * 100}ms` }}><div className="customer-journey-image" style={{ backgroundImage: `url('${clip.image}')` }} /><div className="customer-journey-shade" /><span className="customer-journey-play" aria-hidden="true">▶</span><div className="customer-journey-card-copy"><span>{clip.label}</span><strong>{clip.title}</strong><p>{clip.quote}</p><small>{clip.partner} · {clip.duration}</small></div></button>)}
        </div>
        <button type="button" aria-label="Next journey step" onClick={() => scrollJourney(1)}>→</button>
      </div>
    </section>
  )
}

// ── EDITORIAL INTRO ───────────────────────────────────────────────────────────
function EditorialIntro() {
  return (
    <section className="about-portal" style={{ padding: '48px 0 72px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 20 }}>ABOUT GTF PORTAL</div>
          <h2 className="font-tight about-portal-heading" style={{
            fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 800, lineHeight: 1.0,
            color: 'var(--ink)', letterSpacing: '-0.03em',
          }}>
            One partner.<br />
            Every departure.<br />
            <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Global confidence.</span>
          </h2>
        </div>
        <div>
          <p className="about-portal-copy" style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--ink-mid)', marginBottom: 28, fontWeight: 300 }}>
            GTF Connect gives travel agents and tour operators one dependable B2B partner for guaranteed series departures, white-label operations, and bespoke journeys.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-light)', marginBottom: 40, fontWeight: 300 }}>
            We coordinate the details behind the scenes so your team can sell with clarity, protect the client relationship, and grow across continents.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/register" className="btn-teal">BECOME A PARTNER</Link>
            <Link href="/about" className="btn-outline">OUR STORY</Link>
          </div>
          <div aria-label="GTF operating flow" style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginTop: 28 }}>
            {['DISCOVER', 'QUOTE', 'CONFIRM', 'SUPPORT'].map((step, i) => <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><span style={{ padding: '8px 13px', border: '1px solid #CBD5E1', borderRadius: 999, color: 'var(--teal)', fontSize: 10.5, letterSpacing: '.1em', fontWeight: 700 }}>{step}</span>{i < 3 && <span aria-hidden="true" style={{ color: '#CBD5E1' }}>→</span>}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── BENTO VALUE GRID ─────────────────────────────────────────────────────────
function Bento() {
  const [active, setActive] = useState(0)
  const cells = [
    { title: '100% B2B & NON-COMPETE', text: 'Your clients stay yours. We never sell direct.', coords: 'NON-COMPETE', col: 'span 2', row: 'span 2', accent: '#FBBF24', visual: 'GLOBAL ROUTE' },
    { title: 'GLOBAL PRODUCT', text: 'Products across continents and travel categories.', coords: '3 CONTINENTS', col: 'span 2', row: 'span 1', accent: '#14B8A6', visual: '03 / 03' },
    { title: 'GUARANTEED DEPARTURES', text: 'Confirmed dates and ready-to-sell itineraries.', coords: 'FIXED SERIES', col: 'span 2', row: 'span 1', accent: '#FBBF24', visual: '12 SEP →' },
    { title: 'COMPETITIVE B2B RATES', text: 'Commercial pricing designed for travel professionals.', coords: 'PARTNER PRICING', col: 'span 1', row: 'span 1', accent: '#14B8A6', visual: 'B2B' },
    { title: 'OPERATIONAL SUPPORT', text: 'Reliable support before and during the journey.', coords: '24/7 OPS', col: 'span 1', row: 'span 1', accent: '#FBBF24', visual: 'ONLINE' },
    { title: 'ONE-STOP PLATFORM', text: 'Discovery, coordination and sales support in one place.', coords: 'ALL-IN-ONE', col: 'span 2', row: 'span 1', accent: '#14B8A6', visual: '4 STEPS' },
  ]
  return <section style={{ padding: '92px 48px', background: '#F8FAFC' }}><div style={{ maxWidth: 1240, margin: '0 auto' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, marginBottom: 42, flexWrap: 'wrap' }}><div><div className="eyebrow" style={{ marginBottom: 12 }}>WHY GTF</div><h2 className="font-tight" style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-.03em' }}>Built for professionals. <span style={{ color: 'var(--teal)', fontWeight: 300, fontStyle: 'italic' }}>Designed for scale.</span></h2></div><div style={{ color: '#64748B', fontSize: 13 }}>HOVER TO EXPLORE THE GTF ADVANTAGE</div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: 190, gap: 16 }}>{cells.map((cell, i) => { const selected = i === active; return <button type="button" key={cell.title} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-pressed={selected} style={{ gridColumn: cell.col, gridRow: cell.row, minHeight: 0, border: `1px solid ${selected ? cell.accent : '#E2E8F0'}`, borderRadius: 18, padding: 26, background: selected ? 'linear-gradient(145deg,#fff 40%,#F0FDFA)' : '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', textAlign: 'left', cursor: 'pointer', transform: selected ? 'translateY(-5px)' : 'translateY(0)', boxShadow: selected ? `0 18px 38px ${cell.accent}2b` : 'none', transition: 'transform .3s ease, box-shadow .3s ease, border-color .3s ease' }}><div style={{ position: 'relative', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div className="bento-route-visual" style={{ position: 'relative', width: 120, height: 64, color: cell.accent }}><span style={{ position: 'absolute', left: 4, top: 32, width: 112, height: 1, background: cell.accent, opacity: .42, transform: 'rotate(-14deg)' }} /><span style={{ position: 'absolute', left: 10, top: 21, width: 8, height: 8, borderRadius: '50%', background: '#0F766E', boxShadow: `0 0 0 5px ${cell.accent}22` }} /><span style={{ position: 'absolute', right: 7, top: 9, width: 8, height: 8, borderRadius: '50%', background: cell.accent, boxShadow: `0 0 0 5px ${cell.accent}22` }} /><span style={{ position: 'absolute', left: 42, top: 8, width: 50, height: 38, border: `1px solid ${cell.accent}`, borderRadius: '58% 42% 52% 48%', opacity: .55 }} /><span style={{ position: 'absolute', left: 50, top: 14, width: 36, height: 25, border: `1px solid ${cell.accent}`, borderRadius: '45% 55% 40% 60%', opacity: .28 }} /></div><span style={{ color: '#94A3B8', font: '10px ui-monospace,monospace', letterSpacing: '.05em' }}>{cell.visual}</span></div><div><h3 className="font-tight" style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700 }}>{cell.title}</h3><p style={{ margin: '0 0 10px', color: '#64748B', fontSize: 13.5, lineHeight: 1.5 }}>{cell.text}</p><div style={{ color: '#94A3B8', font: '10px ui-monospace,monospace', letterSpacing: '.04em' }}>{cell.coords}</div></div></button> })}</div></div></section>
}

// ── GTF BENTO EXPERIENCE ─────────────────────────────────────────────────────
// A mixed editorial collage: each tile has a distinct role, palette and
// entrance moment so the section feels like a branded travel experience.
function BentoExperience() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [routeMapVisible, setRouteMapVisible] = useState(false)
  const [flowStep, setFlowStep] = useState(0)
  const bentoSectionRef = useRef<HTMLElement | null>(null)
  const destinationPhotos = [
    { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85', label: 'SWISS ALPS · 46.8°N', title: <>Alpine<br />clarity.</> },
    { image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=85', label: 'MEDITERRANEAN · 43.3°N', title: <>Coastal<br />intent.</> },
    { image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85', label: 'JAPAN · 35.0°N', title: <>Quiet<br />wonder.</> },
  ]
  useEffect(() => {
    const node = bentoSectionRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true)
        observer.disconnect()
      }
    }, { threshold: 0.18 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const timer = setInterval(() => setPhotoIndex(index => (index + 1) % destinationPhotos.length), 4800)
    return () => clearInterval(timer)
  }, [destinationPhotos.length])
  useEffect(() => {
    const timer = setInterval(() => setRouteMapVisible(value => !value), 3200)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    const timer = setInterval(() => setFlowStep(step => (step + 1) % 4), 1200)
    return () => clearInterval(timer)
  }, [])

  const activate = (index: number) => setActive(index)
  const revealClass = revealed ? 'bento-reveal bento-revealed' : 'bento-reveal'

  return (
    <section ref={bentoSectionRef} className="bento-experience" aria-labelledby="bento-title">
      <div className="bento-experience-inner">
        <div className="bento-heading">
          <div className="eyebrow">THE GTF ADVANTAGE</div>
          <h2 id="bento-title" className="font-tight">Built for professionals. <em>Designed for scale.</em></h2>
          <p>A global travel network with the confidence, products and support to help partners sell further. Motion runs automatically.</p>
        </div>

        <div className="bento-experience-grid">
          <button type="button" className={`${revealClass} bento-tile bento-editorial`} style={{ animationDelay: '80ms' }} onMouseEnter={() => activate(0)} onFocus={() => activate(0)} onClick={() => activate(0)} aria-pressed={active === 0}>
            <span className="bento-compass" aria-hidden="true">✦</span>
            <span className="bento-editorial-kicker">GTF HOLIDAYS · GLOBAL TRAVEL FUSION</span>
            <strong>THE WORLD,<br /><i>READY TO SELL.</i></strong>
            <span className="bento-rule" />
            <span className="bento-editorial-foot">100% B2B · NON-COMPETE</span>
          </button>

          <button type="button" className={`${revealClass} bento-tile bento-routes ${active === 1 ? 'bento-active' : ''}`} style={{ animationDelay: '180ms' }} onMouseEnter={() => activate(1)} onFocus={() => activate(1)} onClick={() => activate(1)} aria-pressed={active === 1}>
            <div className="bento-tile-label"><span>◎</span> GLOBAL ROUTES</div>
            <div className={`bento-route-stage ${routeMapVisible ? 'is-map' : ''}`}>
              <strong className="bento-route-title">One partner.<br />Five continents.</strong>
              <div className="bento-route-map-content">
                <svg className="bento-map" viewBox="0 0 520 220" role="img" aria-label="Routes connecting Europe, Africa, Japan and Australia">
                  <path d="M40 125 C135 40, 168 175, 270 92 S392 50, 470 125" />
                  <path d="M170 166 C230 84, 330 160, 390 78" />
                  <circle cx="170" cy="96" r="5" /><circle cx="270" cy="92" r="5" /><circle cx="390" cy="78" r="5" /><circle cx="430" cy="140" r="5" />
                </svg>
                <div className="bento-route-labels"><span>EUROPE</span><span>AFRICA</span><span>JAPAN</span><span>AUSTRALIA</span></div>
              </div>
            </div>
            <div className="bento-tile-foot">5 CONTINENTS · ONE PARTNER</div>
          </button>

          <div className={`${revealClass} bento-tile bento-destination-photo`} style={{ animationDelay: '280ms' }}>
            {destinationPhotos.map((photo, index) => <div key={photo.label} className={`bento-photo-slide ${index === photoIndex ? 'bento-photo-slide-active' : ''}`} style={{ backgroundImage: `url('${photo.image}')` }} aria-hidden={index !== photoIndex} />)}
            <div className="bento-photo-overlay" />
            <div className="bento-photo-copy"><span>CURATED JOURNEYS</span><strong>{destinationPhotos[photoIndex].title}</strong><small>{destinationPhotos[photoIndex].label}</small><div className="bento-photo-dots" aria-label="Destination photo selector">{destinationPhotos.map((photo, index) => <button type="button" key={photo.label} aria-label={`Show ${photo.label}`} className={index === photoIndex ? 'active' : ''} onClick={() => setPhotoIndex(index)} />)}</div></div>
          </div>

          <button type="button" className={`${revealClass} bento-tile bento-departure ${active === 3 ? 'bento-active' : ''}`} style={{ animationDelay: '380ms' }} onMouseEnter={() => activate(3)} onFocus={() => activate(3)} onClick={() => activate(3)} aria-pressed={active === 3}>
            <div className="bento-ticket-top"><span>NEXT DEPARTURE</span><span>12 SEP</span></div>
            <strong className="bento-departure-title">European<br />Delights</strong>
            <div className="bento-ticket-meta"><span>GATE<br /><b>B2B</b></span><span>BOARDING<br /><b>09:00</b></span><span>CLASS<br /><b>PARTNER</b></span></div>
            <div className="bento-barcode" aria-hidden="true" />
          </button>

          <button type="button" className={`${revealClass} bento-tile bento-flow ${active === 4 ? 'bento-active' : ''}`} style={{ animationDelay: '480ms' }} onMouseEnter={() => activate(4)} onFocus={() => activate(4)} onClick={() => activate(4)} aria-pressed={active === 4}>
            <div className="bento-tile-label">THE OPERATING MODEL</div>
            <div className="bento-flow-steps"><span className={flowStep === 0 ? 'is-step-active' : ''}>⌕<small>DISCOVER</small></span><i>→</i><span className={flowStep === 1 ? 'is-step-active' : ''}>▣<small>QUOTE</small></span><i>→</i><span className={flowStep === 2 ? 'is-step-active' : ''}>✓<small>CONFIRM</small></span><i>→</i><span className={flowStep === 3 ? 'is-step-active' : ''}>◉<small>SUPPORT</small></span></div>
            <div className="bento-tile-foot">ONE BRIEF · ONE COMPREHENSIVE PROPOSAL</div>
          </button>

          <button type="button" className={`${revealClass} bento-tile bento-white-label ${active === 5 ? 'bento-active' : ''}`} style={{ animationDelay: '580ms' }} onMouseEnter={() => activate(5)} onFocus={() => activate(5)} onClick={() => activate(5)} aria-pressed={active === 5}>
            <span className="bento-white-label-kicker">WHITE LABEL SOLUTIONS</span>
            <strong className="bento-white-label-title">YOUR BRAND.<br /><i>OUR BACKEND.</i></strong>
            <span className="bento-white-label-stamp">GTF OPERATIONS<br />BEHIND THE SCENES</span>
          </button>

          <button type="button" className={`${revealClass} bento-tile bento-network ${active === 6 ? 'bento-active' : ''}`} style={{ animationDelay: '680ms' }} onMouseEnter={() => activate(6)} onFocus={() => activate(6)} onClick={() => activate(6)} aria-pressed={active === 6}>
            <div className="bento-tile-label">YOUR GLOBAL AGENT NETWORK</div>
            <div className="bento-network-visual"><span /><span /><span /><span /><i /></div>
            <strong>Strategic partnerships.<br /><em>Stronger together.</em></strong>
          </button>
        </div>
      </div>
    </section>
  )
}

// ── APPROVED IMAGE-FIRST BENTO ────────────────────────────────────────────────
function ApprovedBento() {
  const [inView, setInView] = useState(false)
  const [routeMap, setRouteMap] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [flowStep, setFlowStep] = useState(0)
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
  useEffect(() => { const t = setInterval(() => setRouteMap(v => !v), 3200); return () => clearInterval(t) }, [])
  useEffect(() => { const t = setInterval(() => setPhotoIndex(v => (v + 1) % photos.length), 4800); return () => clearInterval(t) }, [photos.length])
  useEffect(() => { const t = setInterval(() => setFlowStep(v => (v + 1) % 4), 1200); return () => clearInterval(t) }, [])
  const reveal = inView ? ' approved-in' : ''
  return (
    <section ref={sectionRef} className="bento-approved" aria-labelledby="approved-bento-title">
      <div className="bento-approved-inner">
        <div className={`bento-approved-heading${reveal}`}>
          <div className="bento-approved-kicker">GTF CONNECT · GLOBAL TRAVEL SYSTEM</div>
          <h2 id="approved-bento-title">Built for professionals. <em>Designed for scale.</em></h2>
        </div>
        <div className="bento-approved-grid">
          <article className={`approved-tile approved-hero${reveal}`}>
            <div className="approved-hero-slides" aria-label="Curated luxury travel imagery">{photos.map((photo, i) => <div key={photo.label} className={`approved-hero-slide ${photoIndex === i ? 'photo-active' : ''}`} style={{ backgroundImage: `url('${photo.src}')` }} aria-hidden={photoIndex !== i} />)}</div>
            <div className="approved-hero-shade" />
            <div className="approved-hero-content"><div className="approved-label">GTF HOLIDAYS · GLOBAL TRAVEL FUSION</div><strong>The world,<br /><i>ready to sell.</i></strong><small>100% B2B · NON-COMPETE</small></div>
          </article>
          <article className={`approved-tile approved-routes${reveal} ${routeMap ? 'route-map-on' : ''}`}>
            <div className="approved-label">GLOBAL ROUTES</div>
            <strong className="route-copy">One partner.<br />Five continents.</strong>
            <div className="route-map-copy"><svg viewBox="0 0 260 100" aria-label="Schematic route connecting Europe, Japan and Australia"><path d="M8 70 C50 16 82 78 126 43 S197 18 252 72" /><circle cx="45" cy="43" r="5" /><circle cx="146" cy="43" r="5" /><circle cx="226" cy="63" r="5" /></svg><small>EUROPE · JAPAN · AUSTRALIA</small></div>
            <small>5 CONTINENTS · LIVE SERIES</small>
          </article>
          <article className={`approved-tile approved-platform${reveal}`}>
            <div className="approved-label">GTF CONNECT · PARTNER PLATFORM</div>
            <strong>Your clients.<br /><i>Our global engine.</i></strong>
            <p>White-label departures, coordinated operations, and partner-first support.</p>
            <small>BUILT FOR TRAVEL PROFESSIONALS</small>
          </article>
          <article className={`approved-tile approved-ticket${reveal}`}>
            <div className="ticket-main"><div className="approved-label">NEXT DEPARTURE · 12 SEP</div><strong>EUROPEAN<br />DELIGHTS</strong><small>GATE B2B · BOARDING 09:00 · GUARANTEED DEPARTURE</small></div>
            <div className="ticket-stub"><b>GTF</b><span className="ticket-barcode" /><small>B2B / 12 SEP</small></div>
          </article>
          <article className={`approved-tile approved-flow${reveal}`}>
            <div className="approved-label">OPERATING MODEL</div>
            <div className="flow-line">{['DISCOVER', 'QUOTE', 'CONFIRM', 'SUPPORT'].map((step, i) => <span key={step} className={flowStep === i ? 'flow-active' : ''}>{step}{i < 3 ? ' →' : ''}</span>)}</div>
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
function USPs() {
  const usps = [
    { icon: '🤝', title: '100% B2B & Non-Compete Model', desc: 'We never sell direct to consumers. Your clients are always yours.' },
    { icon: '🏷', title: 'White Label & FIT Expertise', desc: 'Operate tours under your own brand. We handle everything behind the scenes.' },
    { icon: '📦', title: 'Ready-to-Sell Group Departures', desc: 'Pre-built packages with confirmed dates, hotels and pricing — ready to market.' },
    { icon: '🌍', title: 'Truly Global Destination Coverage', desc: 'Europe, Africa, Oceania, Asia, Americas — one partner for all continents.' },
    { icon: '👔', title: 'Experienced Tour Managers', desc: '24/7 operations support with professional tour managers on every departure.' },
    { icon: '🎨', title: 'Theme-Based Product Structure', desc: 'Away & Beyond. Wind & Waves. Beast & Beyond. Moments Away. Built for selling.' },
  ]
  return (
    <section style={{ padding: '80px 0', background: 'var(--paper)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>WHY GTF</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            Built for professionals.<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Designed for scale.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {usps.map((u, i) => (
            <div key={i} style={{
              background: 'white', padding: '36px 32px',
              borderBottom: i < 3 ? '1px solid var(--rule)' : 'none',
              borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--rule)' : 'none',
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{u.icon}</div>
              <h3 className="font-tight" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{u.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-light)', lineHeight: 1.65, fontWeight: 300 }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── DESTINATIONS GRID ─────────────────────────────────────────────────────────
function DestinationsGrid() {
  const regions = [
    { name: 'Europe', count: '15 packages', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80', href: '/departures/europe', size: 'tall' },
    { name: 'Africa', count: '9 packages', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80', href: '/departures/africa', size: 'normal' },
    { name: 'Oceania', count: '2 packages', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80', href: '/departures/oceania', size: 'normal' },
    { name: 'Asia', count: 'Coming Soon', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', href: '/departures/asia', size: 'wide' },
    { name: 'Americas', count: 'Coming Soon', img: 'https://static.wixstatic.com/media/11062b_f5be68c7acbc4b1b91a684d8acd6acb9~mv2.jpg', href: '/departures/americas', size: 'normal' },
  ]

  return (
    <section style={{ padding: '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>B2B FIXED DEPARTURES</div>
            <h2 className="font-tight" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              5 Continents.<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Guaranteed departures.</span>
            </h2>
          </div>
          <Link href="/departures/europe" style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--teal)', paddingBottom: 2 }}>
            Browse all departures →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '280px 280px', gap: 12 }}>
          {regions.slice(0, 5).map((r, i) => (
            <Link key={r.name} href={r.href} className="dest-card" style={{
              position: 'relative', borderRadius: 4, overflow: 'hidden',
              gridColumn: i === 0 ? '1' : i === 3 ? '2 / 4' : 'auto',
              gridRow: i === 0 ? '1 / 3' : 'auto',
              display: 'block', textDecoration: 'none',
            }}>
              <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div className="dest-card-overlay" style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: i === 0 ? '28px 28px' : '18px 20px' }}>
                <div className="font-tight" style={{ fontSize: i === 0 ? 28 : 20, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', fontWeight: 500 }}>{r.count.toUpperCase()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WHAT WE OFFER — asymmetric ─────────────────────────────────────────────────
function WhatWeOffer() {
  const services = [
    {
      tag: 'MOST POPULAR',
      label: 'Series Departures',
      desc: 'Pre-planned fixed departure group tours with confirmed itineraries, hotels, sightseeing and dates. Ready-to-sell. Cost-effective. Professionally managed.',
      img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
      stat: '25+ active packages',
    },
    {
      tag: 'WHITE LABEL',
      label: 'White Label Solutions',
      desc: 'Sell tours under your own brand. GTF manages everything behind the scenes — operations, hotels, logistics, on-ground coordination.',
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
      stat: 'Your brand. Our backend.',
    },
    {
      tag: 'CUSTOM GROUPS',
      label: 'ADHOC Groups',
      desc: 'Corporates, institutions, incentive groups, school tours — fully customized group departures built around your client\'s specific requirements.',
      img: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&q=80',
      stat: '25–45 pax per group',
    },
    {
      tag: 'BESPOKE',
      label: 'Bespoke Holidays',
      desc: 'Tailor-made itineraries built around budget, travel style, meal preferences, hotel choices and sightseeing priorities. No two alike.',
      img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80',
      stat: 'Fully customised',
    },
  ]
  const rightHeights = [220, 160, 222]

  return (
    <section style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>WHAT WE OFFER</div>
            <h2 className="font-tight" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              Every product.<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>One partnership.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.7, fontWeight: 300 }}>
            From a solo traveller's custom itinerary to a 200-pax incentive group — one B2B agreement covers it all.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 10 }}>
          {/* Hero card */}
          <div style={{ position: 'relative', borderRadius: 4, height: 612, overflow: 'hidden' }}>
            <img src={services[0].img} alt={services[0].label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.9) 0%, rgba(7,26,23,0.05) 50%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'var(--orange)' }} />
            <div style={{ position: 'absolute', top: 28, left: 28, padding: '5px 12px', background: 'var(--orange)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>{services[0].tag}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 32px' }}>
              <div className="font-tight" style={{ fontSize: 80, fontWeight: 800, color: 'rgba(255,255,255,0.06)', lineHeight: 1, marginBottom: -24, letterSpacing: '-0.04em', userSelect: 'none' }}>01</div>
              <h3 className="font-tight" style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{services[0].label}</h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 420, fontWeight: 300, marginBottom: 20 }}>{services[0].desc}</p>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 16 }}>{services[0].stat.toUpperCase()}</div>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fff', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 2 }}>
                EXPLORE PACKAGES →
              </Link>
            </div>
          </div>

          {/* Right stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {services.slice(1).map((s, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 4, height: rightHeights[i], overflow: 'hidden', flexShrink: 0 }}>
                <img src={s.img} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.88) 0%, rgba(7,26,23,0.1) 60%)' }} />
                <div style={{ position: 'absolute', top: 16, left: 16, padding: '3px 8px', background: 'var(--orange)', fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>{s.tag}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{s.label}</h3>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>{s.stat}</p>
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── ONE STOP SHOP ─────────────────────────────────────────────────────────────
function OneStopShop() {
  const points = [
    { n: '01', title: 'Agent Voice Concept', body: 'Our team communicates with your clients under your brand — answering queries, providing tour information, building confidence. You stay the face. We do the backend.' },
    { n: '02', title: 'Tour Family Concept', body: 'Travellers from multiple partners travel together as one professionally managed tour family. Seamless, warm, and consistent — every departure.' },
    { n: '03', title: 'Single Point of Contact', body: 'One account manager handles all destinations, all queries, all logistics. No coordination chaos across time zones or suppliers.' },
    { n: '04', title: '24/7 Operations Support', body: 'From first quote to final departure — and everything in between. Because emergencies don\'t follow office hours.' },
  ]
  return (
    <section style={{ background: 'var(--ink)', padding: '100px 56px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div style={{ position: 'sticky', top: 120, alignSelf: 'start' }}>
          <div className="eyebrow" style={{ color: 'var(--teal)', marginBottom: 20 }}>ONE-STOP SHOP</div>
          <h2 className="font-tight" style={{
            fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800,
            color: '#fff', lineHeight: 0.92, marginBottom: 32, letterSpacing: '-0.03em',
          }}>
            One desk.<br />The entire<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--orange)' }}>world.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 380, fontWeight: 300, marginBottom: 40 }}>
            No matter how complex the routing — 8 countries, 40 hotels, group transfers, activities — you send one brief and receive one comprehensive proposal.
          </p>
          <Link href="/register" className="btn-orange">JOIN THE NETWORK →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {points.map((p, i) => (
            <div key={i} style={{
              padding: '36px 0',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: i === points.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', paddingTop: 6, flexShrink: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em' }}>{p.n}</span>
                <div>
                  <h3 className="font-tight" style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, fontWeight: 300 }}>{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { n: '5', sup: '+', label: 'Continents covered', body: 'Europe, Africa, Oceania, Asia and the Americas — a single platform connecting your agency to the entire world.', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=85' },
    { n: '25', sup: '+', label: 'Active B2B packages', body: 'Series Departures with confirmed dates, hotels and pricing — ready for you to sell from day one.', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85' },
    { n: '100', sup: '%', label: 'B2B non-compete model', body: 'We never sell direct to consumers. Every booking you make through GTF stays yours. Always.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ position: 'relative', height: 460, overflow: 'hidden', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <img src={s.img} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.55) 0%, rgba(7,26,23,0.85) 100%)' }} />
          {/* Watermark */}
          <div className="font-tight" style={{ position: 'absolute', bottom: -20, left: -10, fontSize: 'clamp(120px, 15vw, 180px)', fontWeight: 800, color: 'rgba(255,255,255,0.05)', lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>
            {s.n}<span style={{ fontSize: '0.45em', verticalAlign: 'super' }}>{s.sup}</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
              <span className="font-tight" style={{ fontSize: 'clamp(52px, 6vw, 76px)', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>{s.n}</span>
              <span className="font-tight" style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, color: 'var(--orange)', lineHeight: 1 }}>{s.sup}</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal-lt)', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontWeight: 300, maxWidth: 260 }}>{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const items = [
    { q: 'GTF\'s Agent Voice concept completely changed how we handle client queries. Our conversion rates went up significantly once GTF started responding under our banner.', name: 'Priya Sharma', role: 'Director, Wanderlust Travel', city: 'Mumbai, India' },
    { q: 'The Tour Family concept is brilliant for small agencies like ours. We can sell seats on a guaranteed departure without needing to fill the whole coach ourselves.', name: 'Ahmed Al-Rashid', role: 'Head of Operations, Gulf Horizons', city: 'Dubai, UAE' },
    { q: 'Their Africa safari circuit is unlike anything else in the B2B market. Our clients come back every year asking for more GTF itineraries specifically.', name: 'Sarah Chen', role: 'CEO, Pacific Travel Co.', city: 'Singapore' },
  ]

  const goTo = (idx: number) => {
    if (idx === active) return
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 350)
  }

  useEffect(() => {
    const t = setInterval(() => goTo((active + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [active])

  return (
    <section style={{ background: 'var(--ink)', padding: '120px 56px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 80 }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.3)' }}>PARTNER VOICES</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === active ? 24 : 6, height: 6, borderRadius: 3,
                background: i === active ? 'var(--teal)' : 'rgba(255,255,255,0.2)',
                border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0,
              }} />
            ))}
          </div>
        </div>
        <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease', maxWidth: 900 }}>
          <div className="font-tight" style={{ fontSize: 120, lineHeight: 0.6, color: 'var(--teal)', opacity: 0.3, fontStyle: 'italic', userSelect: 'none', marginBottom: 0 }}>"</div>
          <p className="font-tight" style={{ fontSize: 'clamp(20px, 2.8vw, 36px)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.55, letterSpacing: '-0.01em', marginBottom: 56 }}>
            {items[active].q}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 32, height: 1, background: 'var(--teal)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{items[active].name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 300 }}>{items[active].role} · {items[active].city}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>Trusted by travel agencies across India, Middle East, Southeast Asia and beyond</div>
          <Link href="/register" style={{ padding: '11px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s' }}>REGISTER NOW →</Link>
        </div>
      </div>
    </section>
  )
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="join-network-cta" style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
      <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1800&q=90" alt="Travel professionals collaborating around a table" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,26,23,0.9) 0%, rgba(7,26,23,0.48) 52%, rgba(7,26,23,0.18) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 56px', maxWidth: 700 }}>
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>JOIN THE GTF NETWORK</div>
        <h2 className="font-tight" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 0.95, color: '#fff', marginBottom: 24, letterSpacing: '-0.03em' }}>
          Your next best-seller<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal-lt)' }}>starts here.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 40, fontWeight: 300, maxWidth: 460 }}>
          Join a global partner network built to help travel professionals sell further — while GTF coordinates the world behind the scenes.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-teal" style={{ background: '#fff', color: 'var(--ink)' }}>
            JOIN GTF AS A PARTNER →
          </Link>
          <Link href="/contact" className="btn-outline-white">SCHEDULE A CALL</Link>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 16, letterSpacing: '0.08em' }}>
          B2B ONLY · FREE REGISTRATION · ADMIN APPROVAL REQUIRED
        </div>
      </div>
    </section>
  )
}

// ── THEMES SECTION ─────────────────────────────────────────────────────────────
function Themes() {
  const themes = [
    { name: 'Away & Beyond', sub: 'Epic Escape to Timeless Lands', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80' },
    { name: 'Wind & Waves', sub: 'Where Ocean Breezes Meet Timeless Escapes', img: 'https://static.wixstatic.com/media/nsplsh_78507346587362584a5267~mv2_d_5773_4330_s_4_2.jpg' },
    { name: 'Beast & Beyond', sub: 'From Game Drives to Great Escapes', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
    { name: 'Moments Away', sub: 'Effortless Getaways Enriching Experiences', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80' },
  ]
  return (
    <section style={{ padding: '80px 0', background: 'var(--paper)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>CONCEPTUAL THEMES</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            Built for selling.<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Crafted for experiencing.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {themes.map((t, i) => (
            <div key={i} style={{ position: 'relative', height: 320, borderRadius: 4, overflow: 'hidden', cursor: 'pointer' }}>
              <img src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,26,23,0.85) 0%, rgba(7,26,23,0) 50%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px' }}>
                <div className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PAGE EXPORT ───────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main>
      <Hero />
      <DestinationMarquee />
      <ProductStream />
      <CustomerJourney />
      <ApprovedBento />
      <EditorialIntro />
      <FinalCTA />
    </main>
  )
}
