export const metadata = { title: 'Bespoke Holidays — GTF Holidays' }

const WHATSAPP = 'https://wa.me/918928872400'

const PHILOSOPHY_IMAGES = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=85',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=700&q=85',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&q=85',
]

const BENEFITS = [
  '25+ Years of Travel Industry Experience',
  'Authentic Local Experiences & Hidden Gems',
  'Agent Voice – We Connect with Your Travellers as an Extension of Your Team',
  'Personally Curated Holidays Designed Around Every Traveller',
  'Hand-picked Hotels & Unique Stays',
  'Dedicated Travel Designers, Sales & Operations Team',
  'Global Destination Management Expertise',
  'Special Occasion & Celebration Holidays',
  'Reliable On-Ground Operations Worldwide',
  'Worldwide Destination Coverage',
  'Cruises, Rail Journeys & Signature Experiences',
  'Quick Turnaround on Quotations',
  'Handcrafted Itineraries with Exceptional Attention to Detail',
  'Professionally Designed Marketing & Promotional Materials',
  'Competitive & Transparent Commercials',
  'Luxury, Premium & Value Holiday Options',
  'Destination Training Programs for Travel Partners',
  'Professional On-Ground Support',
]

export default function BespokeHolidaysPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1400&q=85"
          alt="Bespoke curated travel"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.3) 0%, rgba(7,26,23,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '52px 56px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', marginBottom: 12, fontWeight: 600 }}>BESPOKE HOLIDAYS</div>
          <h1 className="font-tight" style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
            Personally curated.<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal-lt)' }}>Globally delivered.</span>
          </h1>
          <p className="font-tight" style={{ fontSize: 20, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', maxWidth: 560 }}>
            Personally Curated Global Holidays!
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 56px' }}>

        {/* Who we are */}
        <div style={{ maxWidth: 760, marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>WHO WE ARE</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
            A global destination <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>management company.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-mid)', lineHeight: 1.85, fontWeight: 300 }}>
            GTF Holidays LLP (Global Travel Fusion) is a Global Destination Management Company backed by a leadership team with 25+ years of travel industry experience, committed exclusively to empowering Travel Partners through professionally managed travel solutions, seamless operations, and exceptional destination expertise worldwide.
          </p>
        </div>

        {/* Philosophy */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>THE BESPOKE HOLIDAYS PHILOSOPHY</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 32, maxWidth: 640 }}>
            Every traveller is different. <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Every holiday should be too.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PHILOSOPHY_IMAGES.map((img, i) => (
              <div key={i} style={{ borderRadius: 4, overflow: 'hidden', height: 260 }}>
                <img src={img} alt="Curated travel experience" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Unforgettable Holidays. Unique Story. */}
        <div style={{ position: 'relative', minHeight: 420, borderRadius: 4, overflow: 'hidden', marginBottom: 80 }}>
          <img
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1400&q=85"
            alt="Mediterranean coast"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(7,26,23,0.9) 0%, rgba(7,26,23,0.5) 55%, rgba(7,26,23,0.25) 100%)' }} />
          <div style={{ position: 'relative', padding: '56px 48px', maxWidth: 560 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>UNFORGETTABLE HOLIDAYS. UNIQUE STORY.</div>
            <p className="font-tight" style={{ fontSize: 18, fontWeight: 300, color: '#fff', lineHeight: 1.7 }}>
              At Bespoke Holidays, we believe unforgettable holidays are never created from templates. Every traveller has a unique story, a different purpose of travel, and their own idea of the perfect holiday. Whether it&apos;s a honeymoon, multi-generational family holiday, luxury escape, milestone celebration, self-drive adventure, cruise, rail journey, wildlife expedition, pilgrimage, or a once-in-a-lifetime dream vacation, we transform ideas into unforgettable travel experiences.
            </p>
          </div>
        </div>

        {/* Your Client Remains Yours */}
        <div style={{ background: 'var(--teal-lt)', padding: '56px 48px', marginBottom: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--teal-dark)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>OUR COMMITMENT TO YOU</div>
          <h3 className="font-tight" style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 16, maxWidth: 620, margin: '0 auto 16px' }}>
            Your client remains yours. <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>Always.</span>
          </h3>
          <p style={{ fontSize: 15.5, color: 'var(--ink-mid)', lineHeight: 1.8, fontWeight: 300, maxWidth: 560, margin: '0 auto' }}>
            As a 100% B2B travel company, we work exclusively with Travel Partners. We never compete for your clients — we become an extension of your team.
          </p>
        </div>

        {/* Why Partner */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>WHY PARTNER WITH BESPOKE HOLIDAYS</div>
          <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 40, maxWidth: 640 }}>
            Crafted for the <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>discerning traveller.</span>
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
            Let&apos;s design something <span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal-lt)' }}>unforgettable.</span>
          </h2>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-teal">CHAT WITH OUR TEAM ON WHATSAPP →</a>
        </div>
      </div>
    </div>
  )
}
