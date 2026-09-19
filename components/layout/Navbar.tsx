'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Navbar() {
  const [depsOpen, setDepsOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const overPhoto = false

  useEffect(() => {
    // Check if current user is admin
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.agent?.role === 'admin') setIsAdmin(true)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

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
      transition: 'background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease, opacity 0.4s ease, padding 0.4s ease, backdrop-filter 0.4s ease',
    }}>
      <div style={{ width: '100%', height: '100%', padding: '0 clamp(18px, 5vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Logo tone={overPhoto ? 'light' : 'dark'} size={26} />
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Departures dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDepsOpen(true)}
            onMouseLeave={() => setDepsOpen(false)}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDepsOpen(false) }}
            onKeyDown={e => { if (e.key === 'Escape') setDepsOpen(false) }}>
            <button type="button" className="nav-link" aria-haspopup="menu" aria-expanded={depsOpen} onClick={() => setDepsOpen(o => !o)} style={{
              color: overPhoto ? 'rgba(255,255,255,0.8)' : undefined,
              display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
              background: 'none', border: 'none', padding: 0, font: 'inherit',
            }}>
              B2B Departures
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {depsOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                paddingTop: 12, zIndex: 300,
              }}>
                <div className="animate-slide-down" style={{
                  background: 'white', borderRadius: 12, overflow: 'hidden',
                  border: '1px solid var(--rule)', borderTopWidth: 2, borderTopColor: 'var(--teal)',
                  boxShadow: '0 20px 48px rgba(7,26,23,0.14)', minWidth: 190,
                }}>
                  {regions.map((r, i) => (
                    <Link key={r.href} href={r.href} style={{
                      display: 'block', padding: '11px 20px',
                      fontSize: 13, fontWeight: 500, color: 'var(--ink-mid)',
                      textDecoration: 'none', borderBottom: i < regions.length - 1 ? '1px solid var(--rule)' : 'none',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--teal-lt)'; (e.target as HTMLElement).style.color = 'var(--teal)' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.color = 'var(--ink-mid)' }}>
                      {r.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {[
            { label: 'Adhoc & White Label', href: '/adhoc-and-white-label-solutions' },
            { label: 'Bespoke Holidays', href: '/bespoke-holidays' },
            { label: 'About Us', href: '/about' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact Us', href: '/contact' },
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
              onMouseLeave={() => setAdminOpen(false)}
              onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setAdminOpen(false) }}
              onKeyDown={e => { if (e.key === 'Escape') setAdminOpen(false) }}>
              <button type="button" className="nav-link" aria-haspopup="menu" aria-expanded={adminOpen} onClick={() => setAdminOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--teal)', fontWeight: 700, background: 'none', border: 'none', padding: 0, font: 'inherit' }}>
                Admin
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {adminOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  paddingTop: 12, zIndex: 300,
                }}>
                  <div className="animate-slide-down" style={{
                    background: 'white', borderRadius: 12, overflow: 'hidden',
                    border: '1px solid var(--rule)', borderTopWidth: 2, borderTopColor: 'var(--teal)',
                    boxShadow: '0 20px 48px rgba(7,26,23,0.14)', minWidth: 190,
                  }}>
                    {adminLinks.map((l, i) => (
                      <Link key={l.href} href={l.href} style={{
                        display: 'block', padding: '11px 20px',
                        fontSize: 13, fontWeight: 500, color: 'var(--ink-mid)',
                        textDecoration: 'none', borderBottom: i < adminLinks.length - 1 ? '1px solid var(--rule)' : 'none',
                        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease',
                      }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--teal-lt)'; (e.target as HTMLElement).style.color = 'var(--teal)' }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.color = 'var(--ink-mid)' }}>
                        {l.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="button" className="nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen
                ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
            </svg>
          </button>
          <Link href="/login" className={`nav-cta ${overPhoto ? 'btn-outline-white' : 'btn-outline'} btn-sm`}>Agent login</Link>
          <Link href="/register" className="nav-cta btn-teal btn-sm">Join as partner</Link>
        </div>

      </div>
      {menuOpen && (
        <div id="mobile-menu" className="nav-drawer">
          <div className="drawer-group">B2B departures</div>
          {regions.map(r => (
            <Link key={r.href} href={r.href} className="drawer-link drawer-sub" onClick={() => setMenuOpen(false)}>{r.name}</Link>
          ))}
          <div className="drawer-group">Explore</div>
          {[
            { label: 'Adhoc & White Label', href: '/adhoc-and-white-label-solutions' },
            { label: 'Bespoke Holidays', href: '/bespoke-holidays' },
            { label: 'About Us', href: '/about' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact Us', href: '/contact' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="drawer-link" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          {isAdmin && (
            <>
              <div className="drawer-group">Admin</div>
              {adminLinks.map(l => (
                <Link key={l.href} href={l.href} className="drawer-link drawer-sub" onClick={() => setMenuOpen(false)}>{l.name}</Link>
              ))}
            </>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '13px 0', borderRadius: 999, border: '1.5px solid var(--ctl, var(--rule))', color: 'var(--ink)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Agent login</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '13px 0', borderRadius: 999, background: 'var(--teal)', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Join as partner</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
