'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Browse Packages', href: '/dashboard/packages' },
  { label: 'My Quotes', href: '/dashboard/quotes' },
  { label: 'Europe', href: '/dashboard/packages?region=europe' },
  { label: 'Africa', href: '/dashboard/packages?region=africa' },
  { label: 'Oceania', href: '/dashboard/packages?region=oceania' },
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
    const path = href.split('?')[0]
    if (path === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(path)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top navbar */}
      <div style={{
        background: 'var(--ink)', position: 'sticky', top: 0, zIndex: 200,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ padding: '0 32px', display: 'flex', alignItems: 'center', height: 54, gap: 0 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 32, flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'Inter Tight, sans-serif' }}>G</div>
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff' }}>
              GTF <span style={{ fontWeight: 300 }}>Portal</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {NAV.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.label} href={item.href} style={{
                  padding: '0 14px', height: 54, display: 'flex', alignItems: 'center',
                  textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                  borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side — agent info + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            {agent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{agent.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{agent.agency}</div>
                </div>
              </div>
            )}
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600,
              padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.04em', transition: 'all 0.15s',
            }}>
              SIGN OUT
            </button>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div>{children}</div>
    </div>
  )
}
