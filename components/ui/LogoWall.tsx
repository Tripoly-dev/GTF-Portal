import type { Logo } from '@/data/logos'

export default function LogoWall({ logos, caption = false, height = 44 }: { logos: Logo[]; caption?: boolean; height?: number }) {
  return (
    <>
      <style>{`
        .logo-tile { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .logo-tile:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.18); }
      `}</style>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {logos.map(l => (
          <div key={l.name} className="logo-tile" title={l.name} style={{
            background: '#fff', borderRadius: 10, padding: '14px 20px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 130,
          }}>
            <img src={l.url} alt={l.name} loading="lazy" style={{ height, width: 'auto', maxWidth: 200, objectFit: 'contain', display: 'block' }} />
            {caption && <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#4b5563', textTransform: 'uppercase' }}>{l.name}</span>}
          </div>
        ))}
      </div>
    </>
  )
}
