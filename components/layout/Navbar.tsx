'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [depsOpen, setDepsOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const overPhoto = isHome && !scrolled

  const regions = [
    { name: 'Europe', href: '/departures/europe' },
    { name: 'Africa', href: '/departures/africa' },
    { name: 'Oceania', href: '/departures/oceania' },
    { name: 'Asia', href: '/departures/asia' },
    { name: 'Americas', href: '/departures/americas' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 68,
      background: overPhoto ? 'transparent' : 'rgba(244,248,247,0.96)',
      borderBottom: overPhoto ? 'none' : '1px solid var(--rule)',
      backdropFilter: overPhoto ? 'none' : 'blur(16px)',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', height: '100%', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, background: overPhoto ? 'rgba(10,123,108,0.8)' : 'var(--teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
            fontFamily: 'Inter Tight, sans-serif',
          }}>G</div>
          <span style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 18, fontWeight: 700,
            color: overPhoto ? '#fff' : 'var(--ink)', letterSpacing: '-0.01em',
          }}>
            GTF <span style={{ fontWeight: 300, color: overPhoto ? 'rgba(255,255,255,0.75)' : 'var(--teal)' }}>Portal</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Departures dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDepsOpen(true)}
            onMouseLeave={() => setDepsOpen(false)}>
            <span className="nav-link" style={{
              color: overPhoto ? 'rgba(255,255,255,0.8)' : undefined,
              display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
            }}>
              B2B Departures
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            {depsOpen && (
              <div className="animate-slide-down" style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                marginTop: 8, background: 'white', border: '1px solid var(--rule)',
                boxShadow: '0 16px 48px rgba(7,26,23,0.12)', minWidth: 180, zIndex: 300,
              }}>
                {regions.map(r => (
                  <Link key={r.href} href={r.href} style={{
                    display: 'block', padding: '11px 20px',
                    fontSize: 13, fontWeight: 500, color: 'var(--ink-mid)',
                    textDecoration: 'none', borderBottom: '1px solid var(--rule)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--teal-lt)'; (e.target as HTMLElement).style.color = 'var(--teal)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.color = 'var(--ink-mid)' }}>
                    {r.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {[
            { label: 'About', href: '/about' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: '/contact' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="nav-link" style={{
              color: overPhoto ? 'rgba(255,255,255,0.8)' : undefined,
              textDecoration: 'none',
            }}>{l.label}</Link>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" style={{
            padding: '8px 18px',
            border: `1.5px solid ${overPhoto ? 'rgba(255,255,255,0.45)' : 'var(--rule)'}`,
            color: overPhoto ? '#fff' : 'var(--ink-mid)',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            transition: 'all 0.2s',
          }}>AGENT LOGIN</Link>
          <Link href="/register" style={{
            padding: '8px 18px',
            background: overPhoto ? 'rgba(10,123,108,0.75)' : 'var(--teal)',
            color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            transition: 'all 0.2s',
          }}>JOIN AS PARTNER</Link>
        </div>

      </div>
    </nav>
  )
}
