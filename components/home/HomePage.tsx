'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── HERO ──────────────────────────────────────────────────────────────────────
// Base: zip HTML prototype design (organic blobs, white bg, floating animations)
// Upgrades per PDF brief: real photos inside blobs, stronger headline, editorial feel
function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '120px 56px 80px',
      position: 'relative',
      background: '#FAFAF8', // warm editorial off-white — photography dominates
      overflow: 'hidden',
    }}>

      {/* ── LEFT — Typography / Brand (47%) ──────────────────────────────── */}
      <div style={{
        flex: '0 0 47%',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        position: 'relative',
        zIndex: 2,
      }}>

        {/* Eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{ width: 22, height: 1.5, background: '#0A7B6C', display: 'inline-block', flexShrink: 0 }} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: '#0A7B6C', fontFamily: 'Inter, sans-serif',
          }}>100% B2B · GTF HOLIDAYS</span>
        </div>

        {/* Headline — solid ink, no gradient, very large */}
        <h1 className="font-tight" style={{
          margin: 0,
          fontSize: 'clamp(64px, 5.8vw, 92px)',
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: '#0F172A',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s 0.08s ease, transform 0.7s 0.08s ease',
        }}>
          The World,<br />
          <span style={{ color: '#0F172A' }}>For Your Clients.</span>
        </h1>

        {/* Teal accent rule — restrained brand accent per PDF brief */}
        <div style={{
          width: 48, height: 2, background: '#0A7B6C',
          margin: '24px 0',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s 0.2s ease',
        }} />

        {/* Supporting copy */}
        <p style={{
          margin: '0 0 32px',
          maxWidth: 460,
          fontSize: 16,
          lineHeight: 1.72,
          color: '#475569',
          fontWeight: 400,
          fontFamily: 'Inter, sans-serif',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.18s ease, transform 0.7s 0.18s ease',
        }}>
          Curated global departures and travel products built exclusively for travel professionals. Series Departures · White Label · Bespoke Holidays.
        </p>

        {/* CTAs — modest rounding per PDF (not full pill, not zero) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.28s ease, transform 0.7s 0.28s ease',
        }}>
          <Link href="/register" style={{
            textDecoration: 'none',
            fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
            color: '#fff',
            padding: '16px 30px',
            borderRadius: 8,
            background: '#E8613A',
            boxShadow: '0 6px 20px rgba(232,97,58,0.35)',
            display: 'inline-block',
            fontFamily: 'Inter, sans-serif',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(232,97,58,0.45)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(232,97,58,0.35)'
          }}>
            JOIN AS PARTNER →
          </Link>
          <Link href="/departures/europe" style={{
            textDecoration: 'none',
            fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
            color: '#0F172A',
            padding: '15px 28px',
            borderRadius: 8,
            border: '1.5px solid #CBD5E1',
            display: 'inline-block',
            fontFamily: 'Inter, sans-serif',
            transition: 'border-color 0.2s ease, transform 0.25s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#0F172A'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          }}>
            EXPLORE DEPARTURES
          </Link>
        </div>

        {/* Stats row with vertical dividers — from zip prototype */}
        <div style={{
          display: 'flex', gap: 0,
          borderTop: '1px solid #E2E8F0',
          paddingTop: 24,
          marginBottom: 20,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 0.38s ease',
        }}>
          {[
            { n: '5', l: 'CONTINENTS' },
            { n: '25+', l: 'PACKAGES' },
            { n: '100%', l: 'B2B ONLY' },
            { n: '24/7', l: 'OPS SUPPORT' },
          ].map((s, i) => (
            <div key={s.n} style={{
              paddingRight: i < 3 ? 24 : 0,
              paddingLeft: i > 0 ? 24 : 0,
              borderRight: i < 3 ? '1px solid #E2E8F0' : 'none',
            }}>
              <div className="font-tight" style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#64748B', marginTop: 5, fontFamily: 'Inter, sans-serif' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* B2B credibility line */}
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
          color: '#94A3B8', fontFamily: 'Inter, sans-serif',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 0.5s ease',
        }}>
          ETOA MEMBER · TAAI · OTOAI · PATA · GLOBAL DEPARTURES
        </div>
      </div>

      {/* ── RIGHT — Organic blob collage with real photos (53%) ───────────── */}
      <div style={{
        flex: '0 0 53%',
        position: 'relative',
        height: 700,
        marginLeft: 32,
      }}>

        {/* Dashed vertical route line — from zip prototype, atmospheric */}
        <div style={{
          position: 'absolute',
          top: '14%', left: '16%',
          width: 2, height: '52%',
          background: 'repeating-linear-gradient(180deg, rgba(10,123,108,0.35) 0px 6px, transparent 6px 12px)',
          zIndex: 1,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.8s ease',
        }} />

        {/* PRIMARY BLOB — Europe. Large, top-right. floatA animation */}
        {/* Shape: organic irregular border-radius from zip prototype */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '76%', height: '70%',
          borderRadius: '40% 60% 44% 56% / 52% 46% 54% 48%',
          overflow: 'hidden',
          boxShadow: '0 40px 90px rgba(6,20,20,0.28)',
          animation: 'floatA 8s ease-in-out infinite',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.2s ease',
          zIndex: 2,
        }}>
          <img
            src="https://images.unsplash.com/photo-1499856374079-1fcd7bf1bf0e?w=900&q=90"
            alt="Paris, Europe"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          {/* Subtle dark gradient for coordinate label legibility */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, transparent 55%, rgba(3,10,10,0.55) 100%)', pointerEvents: 'none' }} />
          {/* Coordinate label — tiny, atmospheric, glass */}
          <div style={{
            position: 'absolute', bottom: 22, left: 26,
            color: '#fff', fontSize: 10, letterSpacing: '0.06em',
            fontFamily: 'ui-monospace, monospace',
            background: 'rgba(10,123,108,0.3)', backdropFilter: 'blur(6px)',
            padding: '4px 9px', border: '1px solid rgba(255,255,255,0.18)',
          }}>
            PAR · 48.8566° N
          </div>
        </div>

        {/* SECONDARY BLOB — Mediterranean/Swiss Alps. Bottom-left. floatC animation */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0,
          width: '50%', height: '44%',
          borderRadius: '48% 52% 58% 42% / 55% 45% 55% 45%',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(8,16,14,0.32)',
          border: '3px solid #fff',
          zIndex: 3,
          animation: 'floatC 7s ease-in-out infinite',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.45s ease',
        }}>
          <img
            src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=90"
            alt="Swiss Alps"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, transparent 55%, rgba(3,10,10,0.5) 100%)', pointerEvents: 'none' }} />
          <div style={{
            position: 'absolute', bottom: 16, left: 18,
            color: '#fff', fontSize: 10, letterSpacing: '0.06em',
            fontFamily: 'ui-monospace, monospace',
            background: 'rgba(10,123,108,0.3)', backdropFilter: 'blur(6px)',
            padding: '4px 9px', border: '1px solid rgba(255,255,255,0.18)',
          }}>
            ZRH · 47.3° N
          </div>
        </div>

        {/* TERTIARY — Kenya Safari. Small circle, top-left. floatB animation */}
        <div style={{
          position: 'absolute',
          top: '9%', left: '5%',
          width: 136, height: 136,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(4,20,20,0.35)',
          border: '3px solid #fff',
          zIndex: 4,
          animation: 'floatB 6s ease-in-out infinite',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s 0.65s ease',
        }}>
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=90"
            alt="Kenya Safari"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }}
          />
        </div>

        {/* NBO label — below circle, teal */}
        <div style={{
          position: 'absolute',
          top: 'calc(9% + 148px)', left: 'calc(5% + 46px)',
          color: '#0A7B6C',
          fontSize: 10, fontFamily: 'ui-monospace, monospace',
          fontWeight: 700, letterSpacing: '0.08em',
          zIndex: 4,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 0.9s ease',
        }}>NBO</div>

        {/* 5 CONTINENTS badge — top-right of collage */}
        <div style={{
          position: 'absolute',
          top: 16, right: 16,
          background: 'rgba(10,123,108,0.92)',
          backdropFilter: 'blur(6px)',
          color: '#fff',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          padding: '7px 14px',
          borderRadius: 999,
          zIndex: 5,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.7s 1s ease',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          5 CONTINENTS
        </div>

        {/* Airport codes strip — atmospheric, bottom of collage */}
        <div style={{
          position: 'absolute',
          bottom: 20, right: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          zIndex: 5,
          opacity: loaded ? 0.65 : 0,
          transition: 'opacity 0.7s 1.1s ease',
        }}>
          {['PAR', 'NBO', 'TYO', 'ZRH'].map((code, i) => (
            <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: '#0F172A', fontFamily: 'ui-monospace, monospace', fontWeight: 700, letterSpacing: '0.1em' }}>{code}</span>
              {i < 3 && <span style={{ fontSize: 8, color: '#CBD5E1' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Floating animations — from zip prototype */}
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
  const row1 = ['European Delights', 'Alpine Wonders', 'Sparkling Europe', 'Grand Europe', 'Best of Scandinavia', 'Vibrant Europe', 'Gems of Europe', 'Whispers of Romance', 'European Dream', 'Amazing Europe']
  const row2 = ["Kenya's Ultimate Safari", 'Tanzania Untamed', 'Best of Australia', 'Amboseli Wild Trails', 'Predators & Pink Feathers', 'Echoes of the Wild', 'Wild Serenade', 'Into the Heart of the Wild']
  return (
    <div style={{ background: 'var(--paper)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', overflow: 'hidden' }}>
      <div style={{ padding: '13px 0', borderBottom: '1px solid var(--rule)', overflow: 'hidden' }}>
        <div className="marquee-track-left">
          {[...row1, ...row1, ...row1].map((d, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 20px', whiteSpace: 'nowrap' }}>
              <span className="font-tight" style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 400, color: 'var(--ink-mid)' }}>{d}</span>
              <span style={{ color: 'var(--rule)', fontSize: 8 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '13px 0', overflow: 'hidden' }}>
        <div className="marquee-track-right">
          {[...row2, ...row2, ...row2].map((d, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 20px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.1em', fontWeight: 500 }}>{d.toUpperCase()}</span>
              <span style={{ color: 'var(--rule)', fontSize: 6 }}>●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── EDITORIAL INTRO ───────────────────────────────────────────────────────────
function EditorialIntro() {
  return (
    <section style={{ padding: '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 20 }}>ABOUT GTF PORTAL</div>
          <h2 className="font-tight" style={{
            fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 800, lineHeight: 1.0,
            color: 'var(--ink)', letterSpacing: '-0.03em',
          }}>
            One platform.<br />
            One invoice.<br />
            <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Every corner<br />of the world.</span>
          </h2>
        </div>
        <div>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--ink-mid)', marginBottom: 28, fontWeight: 300 }}>
            GTF Holidays LLP, operating globally as Global Travel Fusion, is a forward-thinking 100% B2B travel company specializing in Group Series Departures, White Label Solutions, and Custom-Built Travel Experiences.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-light)', marginBottom: 40, fontWeight: 300 }}>
            A proud member of ETOA (European Tourism Association), we deliver connection, comfort, and confidence — with every itinerary, across every continent.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/register" className="btn-teal">BECOME A PARTNER</Link>
            <Link href="/about" className="btn-outline">OUR STORY</Link>
          </div>
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
    <section style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
      <img src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1600&q=85" alt="travel" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,26,23,0.82) 0%, rgba(7,26,23,0.2) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 56px', maxWidth: 700 }}>
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>JOIN THE NETWORK</div>
        <h2 className="font-tight" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 0.95, color: '#fff', marginBottom: 24, letterSpacing: '-0.03em' }}>
          Ready to grow<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal-lt)' }}>your travel business?</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 40, fontWeight: 300, maxWidth: 460 }}>
          Join travel agencies across India and beyond who trust GTF for guaranteed group departures, white label solutions and bespoke holiday creation.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-teal" style={{ background: '#fff', color: 'var(--ink)' }}>
            CREATE FREE ACCOUNT →
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
      <EditorialIntro />
      <USPs />
      <DestinationsGrid />
      <WhatWeOffer />
      <OneStopShop />
      <StatsStrip />
      <Themes />
      <Testimonials />
      <FinalCTA />
    </main>
  )
}
