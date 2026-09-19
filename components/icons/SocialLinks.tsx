import WhatsAppIcon from './WhatsAppIcon'
import InstagramIcon from './InstagramIcon'
import LinkedInIcon from './LinkedInIcon'

const LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/gtf_holidays/', Icon: InstagramIcon, bg: 'linear-gradient(45deg, #F58529, #DD2A7B 55%, #8134AF)' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/global-travel-fusion-gtf-holidays', Icon: LinkedInIcon, bg: '#0A66C2' },
  { label: 'WhatsApp', href: 'https://wa.me/918928872400', Icon: WhatsAppIcon, bg: '#25D366' },
]

// Real brand icons as round buttons. Same look on light and dark backgrounds.
export default function SocialLinks({ size = 40, gap = 10 }: { size?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', gap, flexWrap: 'wrap' }}>
      {LINKS.map(({ label, href, Icon, bg }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`GTF Holidays on ${label}`} title={label}
          style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
          <Icon size={Math.round(size * 0.5)} color="#fff" />
        </a>
      ))}
    </div>
  )
}
