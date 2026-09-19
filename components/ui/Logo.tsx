type LogoProps = {
  tone?: 'dark' | 'light'
  suffix?: string
  size?: number
}

export default function Logo({ tone = 'dark', suffix = 'Connect', size = 24 }: LogoProps) {
  const light = tone === 'light'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.4), lineHeight: 1 }}>
      <svg width={Math.round(size * 1.2)} height={size} viewBox="0 0 36 30" fill="none" aria-hidden="true">
        <path d="M0 9 36 3 28 30 30 13.5Z" fill={light ? 'var(--accent-dk)' : 'var(--brand)'} />
        <path d="M0 9 30 13.5 36 3Z" fill={light ? '#fff' : 'var(--teal)'} fillOpacity={light ? 0.9 : 1} />
      </svg>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: Math.round(size * 0.85), fontWeight: 700, letterSpacing: '-0.01em', color: light ? '#fff' : 'var(--ink)' }}>
        GTF{suffix && (
          <>
            {' '}
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 500, letterSpacing: 0, color: light ? 'var(--accent-dk)' : 'var(--teal)' }}>{suffix}</span>
          </>
        )}
      </span>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Global Travel Fusion</span>
    </span>
  )
}
