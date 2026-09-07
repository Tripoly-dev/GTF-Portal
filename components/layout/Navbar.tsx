'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [depsOpen, setDepsOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const overPhoto = false

  useEffect(() => {
    // Check if current user is admin
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.agent?.role === 'admin') setIsAdmin(true)
    }).catch(() => {})
  }, [])

  const regions = [
    { name: 'Europe', href: '/departures/europe' },
    { name: 'Africa', href: '/departures/africa' },
    { name: 'Oceania', href: '/departures/oceania' },
    { name: 'Asia', href: '/departures/asia' },
    { name: 'Americas', href: '/departures/americas' },
  ]

  const adminLinks = [
    { name: 'All Agents', href: '/admin' },
    { name: 'All Bookings', href: '/admin/bookings' },
    { name: 'Departures', href: '/admin/departures' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 68,
      background: 'rgba(244,248,247,0.96)',
      borderBottom: '1px solid var(--rule)',
      backdropFilter: 'blur(16px)',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ width: '100%', height: '100%', padding: '0 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF Holidays" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 20, fontWeight: 800,
            color: overPhoto ? '#fff' : 'var(--ink)', letterSpacing: '-0.01em',
          }}>
            GTF <span style={{ fontWeight: 300, color: overPhoto ? 'rgba(255,255,255,0.75)' : 'var(--teal)', letterSpacing: '-0.04em' }}>Connect</span>
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

          {/* Admin dropdown — visible only to admin */}
          {isAdmin && (
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--teal)', fontWeight: 700 }}>
                Admin
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              {adminOpen && (
                <div className="animate-slide-down" style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginTop: 8, background: 'white', border: '1px solid var(--rule)',
                  boxShadow: '0 16px 48px rgba(7,26,23,0.12)', minWidth: 180, zIndex: 300,
                }}>
                  {adminLinks.map(l => (
                    <Link key={l.href} href={l.href} style={{
                      display: 'block', padding: '11px 20px',
                      fontSize: 13, fontWeight: 500, color: 'var(--ink-mid)',
                      textDecoration: 'none', borderBottom: '1px solid var(--rule)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--teal-lt)'; (e.target as HTMLElement).style.color = 'var(--teal)' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.color = 'var(--ink-mid)' }}>
                      {l.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
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
