export const metadata = { title: 'Adhoc & White Label Solutions — GTF Holidays' }

const WHATSAPP = 'https://wa.me/918928872400'

const SERVICES = [
  'Hotels & Resorts', 'Professional Guides', 'Private Coaches', 'Rail Journeys', 'Airport Transfers',
  'Theme Parks', 'Sightseeing & Attractions', 'Gala Dinners & Events', 'Tour Directors', 'Team Building Activities',
  'Cruises & Ferries', 'Visa Support', 'Indian & International Meals', '24x7 On-Tour Support', 'Domestic Flights',
]

const BENEFITS = [
  '25+ Years of Travel Industry Experience',
  'Tailored Travel Solutions for Every Requirement',
  'Reliable On-Ground Operations Worldwide',
  'Destination Training Programs for Travel Partners',
  'Competitive & Transparent Commercials',
  'Global Destination Management Expertise',
  'White Label Solutions – Your Brand. Our Execution.',
  'Experienced Tour Manager Team',
  'Pre-Sales Support & Pre-Tour Engagement Sessions for Your Travellers',
  'Professional On-Ground Support',
  'Worldwide Destination Coverage',
  'End-to-End Planning & Tour Execution',
  'Dedicated B2B Operations Team',
  'Quick Turnaround on Quotations',
]

export default function AdhocWhiteLabelPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=85"
          alt="Travel partners in a strategic planning meeting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.3) 0%, rgba(7,26,23,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '52px 56px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', marginBottom: 12, fontWeight: 600 }}>ADHOC &amp; WHITE LABEL SOLUTIONS</div>
          <h1 className="font-tight" style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
            Your brand.<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal-lt)' }}>Our execution.</span>
          </h1>
          <p className="font-tight" style={{ fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', maxWidth: 560 }}>
            We are delighted to introduce our ADHOC &amp; White Label Solutions Division, created exclusively to support Travel Partners with reliable, professional, and seamless travel execution across the globe.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 56px' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 80, borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '32px 0' }}>
          {[
            { n: '25', sup: '+', label: 'Years Experience' },
            { n: '100', sup: '%', label: 'B2B Focused' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, paddingLeft: i > 0 ? 40 : 0, borderLeft: i > 0 ? '1px solid var(--rule)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="font-tight" style={{ fontSize: 'clamp(44px, 5vw, 60px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</span>
                <span className="font-tight" style={{ fontSize: 26, fontWeight: 300, color: 'var(--teal)', lineHeight: 1 }}>{s.sup}</span>
              </div>
              <div style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--ink-light)', marginTop: 6, fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Complete Destination Management */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>COMPLETE DESTINATION MANAGEMENT</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 40, maxWidth: 640 }}>
            Everything handled. <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Every time.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {SERVICES.map((s, i) => (
              <div key={s} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px',
                borderBottom: i < SERVICES.length - (SERVICES.length % 3 === 0 ? 3 : SERVICES.length % 3) ? '1px solid var(--rule)' : 'none',
                borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--rule)' : 'none',
                background: 'white',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                <span style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink-mid)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Partner */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>WHY PARTNER WITH GTF</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 40, maxWidth: 640 }}>
            Built for travel <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>professionals.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
            {BENEFITS.map((b, i) => (
              <div key={b} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px',
                borderBottom: i < BENEFITS.length - (BENEFITS.length % 2 === 0 ? 2 : 1) ? '1px solid var(--rule)' : 'none',
                borderRight: i % 2 === 0 ? '1px solid var(--rule)' : 'none',
                background: 'white',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                <span className="font-tight" style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.35 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div style={{ background: 'var(--ink)', padding: '80px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="eyebrow" style={{ color: 'var(--teal)', marginBottom: 16 }}>LET&apos;S TALK</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 24 }}>
            Ready to build <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal-lt)' }}>together?</span>
          </h2>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-teal">CHAT WITH OUR TEAM ON WHATSAPP →</a>
        </div>
      </div>
    </div>
  )
}
