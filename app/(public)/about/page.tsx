export const metadata = { title: 'About GTF — Global Travel Fusion' }

export default function AboutPage() {
  const usps = [
    '100% B2B & Non-Compete Model',
    'White Label & FIT Expertise',
    'Volume-Driven Partner-Friendly Approach',
    'Ready-to-Sell Group Series Departures',
    'Experienced Tour Managers & 24/7 Support',
    'Truly Global Destination Coverage',
    'Theme-Based Product Structure',
  ]
  const affiliations = ['ETOA', 'TAAI', 'OTOAI', 'PATA', 'IITM', 'TTF', 'GTAA', 'TAAPI']

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero — real GTF office photo */}
      <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <img
          src="https://static.wixstatic.com/media/82fcd3_7604997909f6444aad99aa41252fc590~mv2.jpg"
          alt="GTF Holidays"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.3) 0%, rgba(7,26,23,0.82) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '52px 56px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', marginBottom: 12, fontWeight: 600 }}>ABOUT US</div>
          <h1 className="font-tight" style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
            Our Story
          </h1>
          <p className="font-tight" style={{ fontSize: 20, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', maxWidth: 560 }}>
            GTF Holidays — Connecting Travel Partners to Limitless Exploration. B2B Unleashed.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 56px' }}>

        {/* Intro with GTF map */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>WHO WE ARE</div>
            <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
              A Legacy of<br />B2B Excellence
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-mid)', lineHeight: 1.85, fontWeight: 300, marginBottom: 20 }}>
              Welcome to the world of Global Travel Fusion (GTF Holidays LLP), your trusted B2B Travel Partner, facilitating seamless journeys to destinations spanning the globe. Within the sphere of the travel industry, we are recognized as seasoned experts who bring a distinctive personal touch to every aspect of our service.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.85, fontWeight: 300, marginBottom: 20 }}>
              Our commitment to providing exceptional travel experiences extends beyond conventional norms, and it is underpinned by our unwavering dedication to meeting your needs on a 24/7 basis.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.85, fontWeight: 300 }}>
              We elevate your proficiency by offering comprehensive destination trainings and sales support. We firmly believe that an informed travel professional is better equipped to serve their clientele, and we strive to keep you abreast of the latest insights and knowledge concerning the destinations we encompass.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* GTF World Map */}
            <img
              src="https://static.wixstatic.com/media/226760_c80ed3c91d0f40119de4f55d3c03fbec~mv2.png"
              alt="GTF Global Coverage Map"
              style={{ width: '100%', borderRadius: 4, border: '1px solid var(--rule)' }}
            />
            {/* Office photo */}
            <img
              src="https://static.wixstatic.com/media/226760_bedc1a193c5c4461af6547b62bf79ab2~mv2.jpeg"
              alt="GTF Holidays Thane Office"
              style={{ width: '100%', height: 220, objectFit: 'cover', objectPosition: 'center 40%', borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Vision / Mission / Commitment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 80 }}>
          {[
            {
              title: 'Vision',
              body: 'To become the foremost B2B travel partner for organizations around the world. We aspire to be renowned for our unyielding commitment to delivering the highest level of service and personalized attention, setting a new benchmark for excellence in the travel industry.',
              bg: 'var(--teal)', textColor: '#fff', labelColor: 'rgba(255,255,255,0.45)',
            },
            {
              title: 'Mission',
              body: 'To seamlessly fuse top-tier travel services, profound industry expertise, a personalized approach, and continuous availability — rendering us your trusted companion in the global travel arena. We redefine the standards of travel excellence and craft indelible memories for your clients on a global scale.',
              bg: 'var(--ink)', textColor: '#fff', labelColor: 'rgba(255,255,255,0.4)',
            },
            {
              title: 'Commitment',
              body: 'At GTF Holidays, our commitment is unwavering — we strive to provide the best service and support for your esteemed clientele. We fully understand the significance of smooth and memorable travel experiences, and we labour tirelessly to ensure that each traveller enjoys exceptional service throughout their journey.',
              bg: 'var(--paper)', textColor: 'var(--ink)', labelColor: 'var(--teal)',
            },
          ].map((item, i) => (
            <div key={i} style={{ background: item.bg, padding: '48px 40px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: item.labelColor, marginBottom: 16 }}>{item.title.toUpperCase()}</div>
              <h3 className="font-tight" style={{ fontSize: 26, fontWeight: 700, color: item.textColor, marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: item.labelColor, lineHeight: 1.8, fontWeight: 300 }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* USPs */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 32 }}>WHY CHOOSE GTF</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
            {usps.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px', borderBottom: '1px solid var(--rule)', borderRight: i % 2 === 0 ? '1px solid var(--rule)' : 'none', background: 'white' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                <span className="font-tight" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{u}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GTF Logo + HQ */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '48px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <img
              src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png"
              alt="GTF Holidays Logo"
              style={{ width: 120, marginBottom: 20 }}
            />
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 10 }}>MEMBERSHIPS & AFFILIATIONS</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {affiliations.map(a => (
                <div key={a} style={{ padding: '5px 12px', border: '1.5px solid var(--rule)', background: 'white', fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.06em' }}>{a}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>HEADQUARTERS</div>
            <h3 className="font-tight" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 12, letterSpacing: '-0.01em' }}>Global Travel Fusion</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.9, fontWeight: 300 }}>
              Office No.102, Mahant Chambers<br />
              Plot No. A-315, Road No. 34<br />
              Opp. Cybertech House, near New Passport Office<br />
              Wagle Industrial Estate<br />
              Thane West, Maharashtra 400604
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['+91 89288 72400', '+91 93727 33424', '+91 93727 33428', '+91 93727 33425', 'sales@gtfholidays.com', 'fit@gtfholidays.com'].map(c => (
                <div key={c} style={{ fontSize: 14, color: 'var(--ink-mid)', fontWeight: c.includes('@') ? 400 : 500 }}>{c}</div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <a href="https://www.instagram.com/gtf_holidays/" target="_blank" rel="noopener noreferrer"
                style={{ padding: '7px 14px', background: 'var(--ink)', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em' }}>INSTAGRAM</a>
              <a href="https://linkedin.com/company/global-travel-fusion-gtf-holidays" target="_blank" rel="noopener noreferrer"
                style={{ padding: '7px 14px', background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em' }}>LINKEDIN</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
