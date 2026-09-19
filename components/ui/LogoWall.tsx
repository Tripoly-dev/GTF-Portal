import type { Logo } from '@/data/logos'

export default function LogoWall({ logos, caption = false, height = 44 }: { logos: Logo[]; caption?: boolean; height?: number }) {
  return (
    <>
      <style>{`
        .logo-tile img { filter: grayscale(1); opacity: 0.85; transition: filter 0.25s ease, opacity 0.25s ease; }
        .logo-tile:hover img { filter: none; opacity: 1; }
      `}</style>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {logos.map(l => (
          <div key={l.name} className="logo-tile" title={l.name} style={{
            background: '#fff', borderRadius: 8, padding: '8px 12px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 92,
          }}>
            <img src={l.url} alt={l.name} loading="lazy" style={{ height, width: 'auto', maxWidth: 130, objectFit: 'contain', display: 'block' }} />
            {caption && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#4b5563', textTransform: 'uppercase' }}>{l.name}</span>}
          </div>
        ))}
      </div>
    </>
  )
}
