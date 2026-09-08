'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Browse Packages', href: '/dashboard/packages' },
  { label: 'Europe', href: '/dashboard/packages?region=europe' },
  { label: 'Africa', href: '/dashboard/packages?region=africa' },
  { label: 'Asia', href: '/dashboard/packages?region=asia' },
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

      <style>{`
        .agent-nav-link { position: relative; }
        .agent-nav-link::after {
          content: ''; position: absolute; left: 14px; right: 14px; bottom: -1px; height: 2px;
          background: var(--teal); transform: scaleX(0); transform-origin: center;
          transition: transform 0.25s cubic-bezier(.22,1,.36,1);
        }
        .agent-nav-link:hover { color: rgba(255,255,255,0.85) !important; }
        .agent-nav-link:hover::after { transform: scaleX(1); }
        .agent-nav-link[data-active="true"]::after { transform: scaleX(1); }
        .agent-signout {
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s cubic-bezier(.22,1,.36,1);
        }
        .agent-signout:hover { background: #d4522e; box-shadow: 0 6px 18px rgba(232,97,58,0.5); transform: translateY(-1px); }
      `}</style>

      {/* Top navbar */}
      <div style={{
        background: 'linear-gradient(180deg, #0d2622 0%, var(--ink) 65%)',
        position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 12px 28px rgba(0,0,0,0.28)',
      }}>
        <div style={{ padding: '0 32px', display: 'flex', alignItems: 'center', height: 76, gap: 0 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginRight: 40, flexShrink: 0 }}>
            <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF Holidays" style={{ height: 56, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 21, fontWeight: 700, color: '#fff' }}>
              GTF <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>Connect</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
            {NAV.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.label} href={item.href} className="agent-nav-link" data-active={active} style={{
                  padding: '0 16px', height: 76, display: 'flex', alignItems: 'center',
                  textDecoration: 'none', fontSize: 15, fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  transition: 'color 0.15s', whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side — agent info + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            {agent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))',
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.14), 0 4px 10px rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff',
                }}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{agent.agency}</div>
                </div>
              </div>
            )}
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)' }} />
            <button onClick={handleLogout} className="agent-signout" style={{
              background: 'var(--orange)', border: 'none', borderRadius: 999,
              color: '#fff', fontSize: 12, fontWeight: 700,
              padding: '9px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(232,97,58,0.35)',
            }}>
              SIGN OUT
            </button>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1 }}>{children}</div>

      {/* Slim agent footer */}
      <div style={{ background: 'linear-gradient(0deg, #0d2622 0%, var(--ink) 65%)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.75 }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>© 2026 GTF Holidays LLP</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href="mailto:sales@gtfholidays.com" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontWeight: 500 }}>sales@gtfholidays.com</a>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>+91 89288 72400</span>
          <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '6px 14px', borderRadius: 999, background: 'rgba(37,211,102,0.16)', border: '1px solid rgba(37,211,102,0.4)', color: '#25D366', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.04em' }}>
            <WhatsAppIcon size={12} color="#25D366" /> WHATSAPP
          </a>
        </div>
      </div>
    </div>
  )
}
