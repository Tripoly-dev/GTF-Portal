import Link from 'next/link'
import FooterAffiliations from './FooterAffiliations'
import SocialLinks from '@/components/icons/SocialLinks'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer style={{ background: '#0B292A', color: 'rgba(245,240,232,0.68)', padding: '58px 0 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(18px, 5vw, 48px)' }}>
        <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Logo tone="light" size={26} />
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 260, marginBottom: 24, fontWeight: 400 }}>
              The B2B travel platform for professional tour operators and travel agencies. 100% B2B. Non-compete. Global.
            </p>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8 }}>
              <div>+91 89288 72400 | +91 93727 33424</div>
              <div>sales@gtfholidays.com</div>
              <div>fit@gtfholidays.com</div>
            </div>
            <div style={{ marginTop: 20 }}><SocialLinks size={38} /></div>
          </div>

          {/* Departures */}
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginBottom: 20, fontWeight: 600 }}>B2B departures</div>
            {[
              { label: 'Europe', href: '/departures/europe' },
              { label: 'Africa', href: '/departures/africa' },
              { label: 'Oceania', href: '/departures/oceania' },
              { label: 'Asia', href: '/departures/asia' },
              { label: 'Americas', href: '/departures/americas' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 13, marginBottom: 10, color: 'var(--on-dark)', textDecoration: 'none', transition: 'color 0.2s' }}>{l.label}</Link>
            ))}
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginBottom: 20, fontWeight: 600 }}>Products</div>
            {['Series Departures', 'White Label Solutions', 'ADHOC Groups', 'Bespoke Holidays', 'Agent Voice'].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 10, color: 'var(--on-dark)' }}>{l}</div>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginBottom: 20, fontWeight: 600 }}>Company</div>
            {[
              { label: 'About Us', href: '/about' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'Partner Registration', href: '/register' },
              { label: 'Privacy Policy', href: '#' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, marginBottom: 10, color: 'var(--on-dark)', textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </div>
        </div>

        <FooterAffiliations />

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.04em' }}>
            © 2026 GTF Holidays LLP (Global Travel Fusion) · All rights reserved
          </span>
        </div>
      </div>
    </footer>
  )
}
