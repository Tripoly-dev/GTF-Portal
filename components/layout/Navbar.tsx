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
      background: 'rgba(244,248,247,0.92)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      boxShadow: '0 1px 0 rgba(200,222,218,0.7), 0 12px 32px rgba(7,26,23,0.05)',
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
            GTF <span style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 500,
              color: overPhoto ? 'rgba(255,255,255,0.85)' : 'var(--teal)', letterSpacing: 0,
            }}>Connect</span>
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
                marginTop: 12, background: 'white', borderRadius: 12, overflow: 'hidden',
                border: '1px solid var(--rule)', borderTopWidth: 2, borderTopColor: 'var(--teal)',
                boxShadow: '0 20px 48px rgba(7,26,23,0.14)', minWidth: 190, zIndex: 300,
              }}>
                {regions.map((r, i) => (
                  <Link key={r.href} href={r.href} style={{
                    display: 'block', padding: '11px 20px',
                    fontSize: 13, fontWeight: 500, color: 'var(--ink-mid)',
                    textDecoration: 'none', borderBottom: i < regions.length - 1 ? '1px solid var(--rule)' : 'none',
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
            { label: 'Adhoc & White Label', href: '/adhoc-and-white-label-solutions' },
            { label: 'Bespoke Holidays', href: '/bespoke-holidays' },
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
                  marginTop: 12, background: 'white', borderRadius: 12, overflow: 'hidden',
                  border: '1px solid var(--rule)', borderTopWidth: 2, borderTopColor: 'var(--teal)',
                  boxShadow: '0 20px 48px rgba(7,26,23,0.14)', minWidth: 190, zIndex: 300,
                }}>
                  {adminLinks.map((l, i) => (
                    <Link key={l.href} href={l.href} style={{
                      display: 'block', padding: '11px 20px',
                      fontSize: 13, fontWeight: 500, color: 'var(--ink-mid)',
                      textDecoration: 'none', borderBottom: i < adminLinks.length - 1 ? '1px solid var(--rule)' : 'none',
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
            padding: '9px 20px', borderRadius: 999,
            border: `1.5px solid ${overPhoto ? 'rgba(255,255,255,0.45)' : 'var(--rule)'}`,
            color: overPhoto ? '#fff' : 'var(--ink-mid)',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            transition: 'transform 0.25s cubic-bezier(.22,1,.36,1), border-color 0.25s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            ;(e.currentTarget as HTMLElement).style.borderColor = overPhoto ? 'rgba(255,255,255,0.8)' : 'var(--teal)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.borderColor = overPhoto ? 'rgba(255,255,255,0.45)' : 'var(--rule)'
          }}>AGENT LOGIN</Link>
          <Link href="/register" style={{
            padding: '9px 22px', borderRadius: 999,
            background: overPhoto ? 'rgba(10,123,108,0.75)' : 'var(--teal)',
            boxShadow: '0 6px 18px rgba(10,123,108,0.32)',
            color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            transition: 'transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease, background 0.25s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px) scale(1.02)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 24px rgba(10,123,108,0.42)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(10,123,108,0.32)'
          }}>JOIN AS PARTNER</Link>
        </div>

      </div>
    </nav>
  )
}
