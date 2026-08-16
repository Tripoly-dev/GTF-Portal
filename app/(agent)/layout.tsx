'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { icon: '⊞', label: 'Dashboard', href: '/dashboard' },
  { icon: '📦', label: 'Browse Packages', href: '/dashboard/packages' },
  { icon: '📋', label: 'My Quotes', href: '/dashboard/quotes' },
  { icon: '✈', label: 'Europe', href: '/dashboard/packages?region=europe' },
  { icon: '🦁', label: 'Africa', href: '/dashboard/packages?region=africa' },
  { icon: '🌏', label: 'Oceania', href: '/dashboard/packages?region=oceania' },
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [agent, setAgent] = useState<{ name: string; agency: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('gtf_agent')
    if (stored) setAgent(JSON.parse(stored))
    else setAgent({ name: 'Demo Agent', agency: 'Demo Travel Agency' })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('gtf_agent')
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href.split('?')[0]) && href !== '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar — always visible on all agent pages */}
      <div style={{ width: 240, background: 'var(--ink)', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>

        {/* Logo */}
        <div style={{ padding: '24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Inter Tight, sans-serif' }}>G</div>
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>
              GTF <span style={{ fontWeight: 300 }}>Portal</span>
            </span>
          </Link>
        </div>

        {/* Agent info */}
        {agent && (
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              {agent.name.charAt(0)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{agent.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{agent.agency}</div>
            <div style={{ padding: '3px 8px', background: 'rgba(10,123,108,0.3)', border: '1px solid rgba(10,123,108,0.5)', display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--teal)' }}>
              APPROVED PARTNER
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = isActive(item.href)
            return (
              <Link key={item.label} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 24px', textDecoration: 'none',
                background: active ? 'rgba(10,123,108,0.2)' : 'transparent',
                borderLeft: active ? '2px solid var(--teal)' : '2px solid transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 12 }}>
            <span>💬</span> WhatsApp Support
          </a>
          <button onClick={handleLogout} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 10, fontFamily: 'Inter, sans-serif', padding: 0,
          }}>
            <span>→</span> Sign Out
          </button>
        </div>
      </div>

      {/* Main content — offset by sidebar width */}
      <div style={{ marginLeft: 240, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
