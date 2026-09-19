'use client'
import { usePathname } from 'next/navigation'
import LogoWall from '@/components/ui/LogoWall'
import { AFFILIATION_LOGOS } from '@/data/logos'

// About Us already shows the full affiliation set in its own section.
export default function FooterAffiliations() {
  if (usePathname() === '/about') return null
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, marginBottom: 28 }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 16, fontWeight: 600 }}>MEMBERSHIPS &amp; AFFILIATIONS</div>
      <LogoWall logos={AFFILIATION_LOGOS} height={64} />
    </div>
  )
}
