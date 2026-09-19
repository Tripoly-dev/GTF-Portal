import type { ReactNode } from 'react'

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'brand' | 'neutral'

const TONES: Record<Tone, { bg: string; fg: string }> = {
  ok:      { bg: 'var(--ok-bg)',     fg: 'var(--ok)' },
  warn:    { bg: 'var(--warn-lt)',   fg: 'var(--warn)' },
  danger:  { bg: 'var(--danger-bg)', fg: 'var(--danger)' },
  info:    { bg: 'var(--info-bg)',   fg: 'var(--info)' },
  brand:   { bg: 'var(--teal-lt)',   fg: 'var(--brand)' },
  neutral: { bg: 'var(--paper)',     fg: 'var(--ink-mid)' },
}

// One meaning per state, everywhere in the product.
export const STATUS_TONE: Record<string, Tone> = {
  pending: 'warn',
  confirmed: 'ok',
  cancelled: 'danger',
  available: 'ok',
  'fast-filling': 'warn',
  'sold-out': 'danger',
  draft: 'neutral',
  created: 'info',
  sent: 'brand',
  booking: 'ok',
  approved: 'ok',
  rejected: 'danger',
  suspended: 'neutral',
}

export const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  available: 'Available',
  'fast-filling': 'Fast filling',
  'sold-out': 'Sold out',
  draft: 'Draft',
  created: 'Created',
  sent: 'Sent',
  booking: 'Booked',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
}

type Props = { status?: string; tone?: Tone; children?: ReactNode }

export default function StatusBadge({ status, tone, children }: Props) {
  const t = TONES[tone ?? STATUS_TONE[status ?? ''] ?? 'neutral']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999,
      background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600, lineHeight: 1.3, whiteSpace: 'nowrap', letterSpacing: '0.01em',
    }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {children ?? STATUS_LABEL[status ?? ''] ?? status}
    </span>
  )
}
