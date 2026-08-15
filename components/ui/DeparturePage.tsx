'use client'
import Link from 'next/link'
import { Package } from '@/data/packages'

type Region = {
  name: string
  tagline: string
  desc: string
  heroImg: string
  packages: Package[]
}

export default function DeparturePage({ region }: { region: Region }) {
  const hasPackages = region.packages.length > 0

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img src={region.heroImg} alt={region.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.3) 0%, rgba(7,26,23,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px 56px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', marginBottom: 10, fontWeight: 600 }}>
            B2B FIXED DEPARTURES
          </div>
          <h1 className="font-tight" style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
            {region.name}
          </h1>
          <p className="font-tight" style={{ fontSize: 22, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
            {region.tagline}
          </p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 1.7, fontWeight: 300 }}>
            {region.desc}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--rule)', padding: '12px 56px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-light)' }}>
          <Link href="/" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <span>→</span>
          <span>B2B Departures</span>
          <span>→</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{region.name}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 56px' }}>

        {hasPackages ? (
          <>
            <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 className="font-tight" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {region.packages.length} Packages Available
                </h2>
                <p style={{ fontSize: 14, color: 'var(--ink-light)', marginTop: 4 }}>
                  Click "View Itinerary" to download the full PDF brochure
                </p>
              </div>
              <Link href="/register" className="btn-teal" style={{ whiteSpace: 'nowrap' }}>
                Register to Request Quotes →
              </Link>
            </div>

            {/* Package grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {region.packages.map((pkg) => (
                <div key={pkg.id} className="pkg-card" style={{
                  background: 'white', border: '1px solid var(--rule)', overflow: 'hidden',
                }}>
                  {/* Photo */}
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img src={pkg.img} alt={pkg.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                    {pkg.tag && (
                      <div style={{
                        position: 'absolute', top: 14, left: 14,
                        padding: '4px 10px', background: pkg.tag === 'COMING SOON' ? 'var(--ink-light)' : 'var(--orange)',
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff',
                      }}>{pkg.tag}</div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8 }}>
                      {pkg.nights} NIGHTS · {pkg.days} DAYS
                    </div>
                    <h3 className="font-tight" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                      {pkg.name}
                    </h3>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {pkg.workdriveUrl && pkg.tag !== 'COMING SOON' ? (
                        <a href={pkg.workdriveUrl} target="_blank" rel="noopener noreferrer"
                          className="btn-teal" style={{ fontSize: 11, padding: '9px 18px' }}>
                          VIEW ITINERARY ↗
                        </a>
                      ) : (
                        <div style={{ padding: '9px 18px', background: 'var(--paper)', fontSize: 11, color: 'var(--ink-light)', fontWeight: 600, letterSpacing: '0.04em' }}>
                          COMING SOON
                        </div>
                      )}
                      <Link href="/register" style={{
                        padding: '9px 18px', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                        border: '1.5px solid var(--rule)', color: 'var(--ink-mid)', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s',
                      }}>REQUEST QUOTE</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Coming soon state */
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🌍</div>
            <h2 className="font-tight" style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em' }}>
              New Series Coming Soon
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-light)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 40px' }}>
              GTF is building an exciting new series for {region.name}. Register as a partner to be the first to know when packages launch.
            </p>
            <Link href="/register" className="btn-teal">REGISTER TO GET EARLY ACCESS</Link>
          </div>
        )}

        {/* Bottom CTA */}
        {hasPackages && (
          <div style={{ marginTop: 80, padding: '48px 56px', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
            <div>
              <h3 className="font-tight" style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
                Want to sell these packages?
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                Register as a GTF partner to access full pricing, request quotes, and download detailed itineraries.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
              <Link href="/register" className="btn-teal" style={{ whiteSpace: 'nowrap' }}>JOIN AS PARTNER</Link>
              <Link href="/contact" className="btn-outline-white" style={{ whiteSpace: 'nowrap' }}>TALK TO US</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
