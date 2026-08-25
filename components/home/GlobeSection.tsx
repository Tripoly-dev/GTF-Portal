'use client'
import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import Link from 'next/link'

// GTF destination markers — Europe, Africa, Asia
const MARKERS = [
  // Europe
  { location: [48.8566, 2.3522] as [number, number], size: 0.06 },   // Paris
  { location: [51.5074, -0.1278] as [number, number], size: 0.05 },  // London
  { location: [41.9028, 12.4964] as [number, number], size: 0.05 },  // Rome
  { location: [47.3769, 8.5417] as [number, number], size: 0.05 },   // Zurich
  { location: [50.0755, 14.4378] as [number, number], size: 0.04 },  // Prague
  { location: [47.4979, 19.0402] as [number, number], size: 0.04 },  // Budapest
  // Africa
  { location: [-33.9249, 18.4241] as [number, number], size: 0.06 }, // Cape Town
  { location: [30.0444, 31.2357] as [number, number], size: 0.06 },  // Cairo
  { location: [-1.2921, 36.8219] as [number, number], size: 0.04 },  // Nairobi
  // Asia
  { location: [35.6762, 139.6503] as [number, number], size: 0.07 }, // Tokyo
  { location: [41.0082, 28.9784] as [number, number], size: 0.06 },  // Istanbul
  { location: [10.8231, 106.6297] as [number, number], size: 0.05 }, // Ho Chi Minh
  { location: [-20.1609, 57.4989] as [number, number], size: 0.05 }, // Mauritius
]

const STATS = [
  { value: '17', label: 'Active Packages' },
  { value: '3', label: 'Continents' },
  { value: '100%', label: 'B2B Only' },
  { value: '24/7', label: 'Ops Support' },
]

const REGIONS = [
  { name: 'Europe', count: '10 packages', dot: '#7fe8cc' },
  { name: 'Africa', count: '2 packages', dot: '#f9a57a' },
  { name: 'Asia', count: '5 packages', dot: '#93c5fd' },
]

export default function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const phiRef = useRef(0)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !canvasRef.current) return
    const canvas = canvasRef.current
    const size = canvas.offsetWidth || 520

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 5.5,
      baseColor: [0.07, 0.28, 0.25],
      markerColor: [0.5, 0.95, 0.85],
      glowColor: [0.06, 0.45, 0.4],
      markers: MARKERS,
    })

    // Animate rotation manually
    let animFrame: number
    const animate = () => {
      phiRef.current += 0.003
      globe.update({ phi: phiRef.current })
      animFrame = requestAnimationFrame(animate)
    }
    animFrame = requestAnimationFrame(animate)

    globeRef.current = globe
    return () => {
      cancelAnimationFrame(animFrame)
      globe.destroy()
    }
  }, [visible])

  return (
    <section ref={sectionRef} style={{
      background: 'linear-gradient(160deg, #071a17 0%, #062D2A 50%, #0a3d38 100%)',
      padding: '80px 56px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(14,118,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,110,0.06) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 520px',
        gap: 64, alignItems: 'center', position: 'relative', zIndex: 1,
      }}>

        {/* LEFT — text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)',
            padding: '6px 14px', borderRadius: 999, alignSelf: 'flex-start',
            opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#14B8A6' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
              GTF CONNECT · B2B TRAVEL PLATFORM
            </span>
          </div>

          {/* Headline */}
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease',
          }}>
            <h2 style={{
              margin: 0, fontSize: 52, fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', fontFamily: 'Inter Tight, sans-serif',
            }}>
              <span style={{ color: '#fff', display: 'block' }}>Your clients deserve</span>
              <span style={{
                display: 'block',
                background: 'linear-gradient(120deg, #14B8A6, #2DD4BF 60%, #5eead4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>the world.</span>
            </h2>
          </div>

          {/* Body */}
          <p style={{
            margin: 0, fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)',
            maxWidth: 440, fontFamily: 'Inter, sans-serif', fontWeight: 400,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease',
          }}>
            GTF Holidays operates guaranteed group departures across Europe, Africa and Asia — exclusively for travel professionals. No B2C. No competition with your clients.
          </p>

          {/* Region indicators */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            opacity: visible ? 1 : 0, transition: 'opacity 0.7s 0.3s ease',
          }}>
            {REGIONS.map(r => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}>{r.name}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>{r.count}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 0, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            opacity: visible ? 1 : 0, transition: 'opacity 0.7s 0.4s ease',
          }}>
            {STATS.map((s, i) => (
              <div key={s.value} style={{
                paddingRight: i < STATS.length - 1 ? 28 : 0,
                paddingLeft: i > 0 ? 28 : 0,
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: 'Inter Tight, sans-serif' }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', marginTop: 5, fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            display: 'flex', gap: 14,
            opacity: visible ? 1 : 0, transition: 'opacity 0.7s 0.5s ease',
          }}>
            <Link href="/login" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              color: '#fff', padding: '14px 28px', borderRadius: 8,
              background: 'linear-gradient(135deg, #0F766E, #0B8F7F)',
              fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
              boxShadow: '0 8px 24px rgba(15,118,110,0.4)',
              display: 'inline-block',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 14px 32px rgba(15,118,110,0.55)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(15,118,110,0.4)'
              }}>
              AGENT LOGIN →
            </Link>
            <Link href="/register" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
              color: 'rgba(255,255,255,0.7)', padding: '14px 24px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
              display: 'inline-block', background: 'rgba(255,255,255,0.04)',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'
                ;(e.currentTarget as HTMLElement).style.color = '#fff'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
              }}>
              JOIN AS PARTNER
            </Link>
          </div>
        </div>

        {/* RIGHT — Globe */}
        <div style={{
          position: 'relative', width: 520, height: 520,
          opacity: visible ? 1 : 0, transition: 'opacity 1s 0.2s ease',
        }}>
          {/* Glow behind globe */}
          <div style={{
            position: 'absolute', inset: 40,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(15,118,110,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', cursor: 'grab' }}
          />
          {/* Region labels floating near globe */}
          <div style={{
            position: 'absolute', top: '18%', left: '-20px',
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
            padding: '6px 12px', fontSize: 11, fontWeight: 600,
            color: '#7fe8cc', fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em',
            opacity: visible ? 1 : 0, transition: 'opacity 1s 1s ease',
          }}>EUROPE</div>
          <div style={{
            position: 'absolute', bottom: '28%', left: '-10px',
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
            padding: '6px 12px', fontSize: 11, fontWeight: 600,
            color: '#f9a57a', fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em',
            opacity: visible ? 1 : 0, transition: 'opacity 1s 1.2s ease',
          }}>AFRICA</div>
          <div style={{
            position: 'absolute', top: '35%', right: '-10px',
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
            padding: '6px 12px', fontSize: 11, fontWeight: 600,
            color: '#93c5fd', fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em',
            opacity: visible ? 1 : 0, transition: 'opacity 1s 1.4s ease',
          }}>ASIA</div>
        </div>
      </div>
    </section>
  )
}
