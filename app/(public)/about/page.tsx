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

      {/* Hero */}
      <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <img src="https://static.wixstatic.com/media/226760_6405694ec1584971b717372cd1c0d0b0~mv2.jpg"
          alt="GTF" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.4) 0%, rgba(7,26,23,0.8) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px 56px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', marginBottom: 10, fontWeight: 600 }}>ABOUT GTF PORTAL</div>
          <h1 className="font-tight" style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Global Travel Fusion
          </h1>
          <p className="font-tight" style={{ fontSize: 20, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', marginTop: 10 }}>
            Bridging Continents, Crafting Journeys
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 56px' }}>

        {/* Intro grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>WHO WE ARE</div>
            <h2 className="font-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
              A Legacy of<br />B2B Excellence
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-mid)', lineHeight: 1.8, fontWeight: 300, marginBottom: 20 }}>
              GTF Holidays LLP, operating globally as Global Travel Fusion, is a forward-thinking B2B travel company specializing in Group Series Departures, White Label Solutions, and Custom-Built Travel Experiences.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.8, fontWeight: 300 }}>
              With every itinerary, we deliver more than just travel — we deliver connection, comfort, and confidence. Our expertise, coupled with strong on-ground partnerships, ensures our travel partners can focus on their clients while we manage seamless execution.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>OUR REACH</div>
            <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
              As a proud member of the European Tourism Association (ETOA), GTF Holidays LLP continues to expand its global footprint through ethical operations, innovation, and quality-driven service.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.8, fontWeight: 300, marginBottom: 32 }}>
              We are associated with leading travel associations and actively engaged in major tourism exhibitions across India and abroad. Our strong alliances with global partners — including Destination Management Companies, Tourism Boards, and Inbound Operators across continents — further strengthen our worldwide presence.
            </p>
            {/* Affiliation badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {affiliations.map(a => (
                <div key={a} style={{ padding: '6px 14px', border: '1.5px solid var(--rule)', background: 'white', fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '0.06em' }}>{a}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision / Mission / Commitment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 80 }}>
          {[
            {
              title: 'Vision',
              body: 'To become the foremost B2B travel partner for organizations around the world. We aspire to be renowned for our unyielding commitment to delivering the highest level of service and personalized attention, setting a new benchmark for excellence in the travel industry.',
            },
            {
              title: 'Mission',
              body: 'To seamlessly fuse top-tier travel services, profound industry expertise, a personalized approach, and continuous availability — rendering us your trusted companion in the global travel arena. We redefine the standards of travel excellence and craft indelible memories for your clients on a global scale.',
            },
            {
              title: 'Commitment',
              body: 'At GTF Holidays, our commitment is unwavering — we strive to provide the best service and support for your esteemed clientele. We fully understand the significance of smooth and memorable travel experiences, and we labour tirelessly to ensure that each traveller enjoys exceptional service throughout their journey.',
            },
          ].map((item, i) => (
            <div key={i} style={{ background: i === 0 ? 'var(--teal)' : i === 1 ? 'var(--ink)' : 'var(--paper)', padding: '48px 40px' }}>
              <div className="font-tight" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: i < 2 ? 'rgba(255,255,255,0.5)' : 'var(--teal)', marginBottom: 16 }}>{item.title.toUpperCase()}</div>
              <h3 className="font-tight" style={{ fontSize: 26, fontWeight: 700, color: i < 2 ? '#fff' : 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: i < 2 ? 'rgba(255,255,255,0.55)' : 'var(--ink-light)', lineHeight: 1.75, fontWeight: 300 }}>{item.body}</p>
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

        {/* HQ */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '48px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>HEADQUARTERS</div>
            <h3 className="font-tight" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.01em' }}>Global Travel Fusion</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.8, fontWeight: 300 }}>
              Office No.102, Mahant Chambers<br />
              Plot A-315, Road No. 34<br />
              Wagle Industrial Estate<br />
              Thane West, Maharashtra 400604<br />
              India
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['+91 89288 72400', '+91 93727 33424', 'sales@gtfholidays.com', 'fit@gtfholidays.com'].map(c => (
                <div key={c} style={{ fontSize: 15, color: 'var(--ink-mid)', fontWeight: 400 }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
