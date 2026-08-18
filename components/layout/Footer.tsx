import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0B292A', color: 'rgba(245,240,232,0.68)', padding: '72px 0 40px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF Holidays" style={{ height: 30, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 19, fontWeight: 800, color: '#F5F0E8', letterSpacing: '-0.03em' }}>GTF <span style={{ fontWeight: 300, color: '#79D8C5' }}>Connect</span></span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 260, marginBottom: 24, fontWeight: 300 }}>
              The B2B travel platform for professional tour operators and travel agencies. 100% B2B. Non-compete. Global.
            </p>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
              <div>+91 89288 72400 | +91 93727 33424</div>
              <div>sales@gtfholidays.com</div>
              <div>fit@gtfholidays.com</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['in', 'ig', 'wa'].map(s => (
                <div key={s} style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, cursor: 'pointer' }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Departures */}
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 20, fontWeight: 600 }}>B2B DEPARTURES</div>
            {[
              { label: 'Europe', href: '/departures/europe' },
              { label: 'Africa', href: '/departures/africa' },
              { label: 'Oceania', href: '/departures/oceania' },
              { label: 'Asia', href: '/departures/asia' },
              { label: 'Americas', href: '/departures/americas' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>{l.label}</Link>
            ))}
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 20, fontWeight: 600 }}>PRODUCTS</div>
            {['Series Departures', 'White Label Solutions', 'ADHOC Groups', 'Bespoke Holidays', 'Agent Voice'].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{l}</div>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 20, fontWeight: 600 }}>COMPANY</div>
            {[
              { label: 'About GTF', href: '/about' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'Partner Registration', href: '/register' },
              { label: 'Privacy Policy', href: '#' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.04em' }}>
            © 2026 GTF Holidays LLP (Global Travel Fusion) · All rights reserved
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['ETOA', 'TAAI', 'OTOAI', 'PATA'].map(b => (
              <div key={b} style={{ padding: '3px 10px', border: '1px solid rgba(255,255,255,0.12)', fontSize: 9, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
