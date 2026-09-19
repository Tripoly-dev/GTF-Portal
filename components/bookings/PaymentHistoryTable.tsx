'use client'
import type { Payment } from './types'
import { formatDate, money as fmtAmount } from '@/lib/format'
import StatusBadge from '@/components/ui/StatusBadge'

const fmtDate = (d: string) => formatDate(d, 'short')

type Props = {
  payments: Payment[]
  isAdmin: boolean
  currentUserId?: string
  confirmingId?: string | null
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
  onConfirm?: (payment: Payment) => void
}

function IconButton({ title, onClick, children, color }: { title: string; onClick: () => void; children: React.ReactNode; color: string }) {
  return (
    <button title={title} onClick={onClick} style={{
      width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--rule)', borderRadius: 6, background: 'white', cursor: 'pointer', color,
      transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${color} 8%, transparent)` }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; (e.currentTarget as HTMLElement).style.background = 'white' }}>
      {children}
    </button>
  )
}

export default function PaymentHistoryTable({ payments, isAdmin, currentUserId, confirmingId, onEdit, onDelete, onConfirm }: Props) {
  const canModify = (p: Payment) => !p.confirmed && (isAdmin || p.recorded_by === currentUserId)

  const cols = ['DATE', 'AMOUNT', 'MODE', 'REFERENCE', 'RECORDED BY', 'STATUS', 'ACTIONS']

  if (payments.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', padding: '48px 24px', textAlign: 'center', color: 'var(--ink-light)', fontSize: 13 }}>
        No payments recorded yet
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--rule)', overflow: 'hidden', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
        <thead>
          <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--rule)' }}>
            {cols.map(c => (
              <th key={c} style={{ textAlign: c === 'AMOUNT' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-light)' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--rule)' }}>
              <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{fmtDate(p.payment_date)}</td>
              <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: 'var(--ink)', textAlign: 'right', whiteSpace: 'nowrap' }}>{fmtAmount(p.amount)}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{p.payment_mode}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)' }}>{p.reference_number || '—'}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--ink-mid)', textTransform: 'capitalize' }}>{p.recorded_by_role}</td>
              <td style={{ padding: '14px 16px' }}>
                <StatusBadge tone={p.confirmed ? 'ok' : 'warn'}>{p.confirmed ? 'Confirmed' : 'Pending'}</StatusBadge>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {canModify(p) && (
                    <>
                      <IconButton title="Edit" color="var(--teal)" onClick={() => onEdit(p)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                      </IconButton>
                      <IconButton title="Delete" color="var(--brand)" onClick={() => onDelete(p)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                      </IconButton>
                    </>
                  )}
                  {isAdmin && !p.confirmed && onConfirm && (
                    <button onClick={() => onConfirm(p)} disabled={confirmingId === p.id} style={{
                      padding: '6px 12px', borderRadius: 6, border: 'none', background: 'var(--ok)', color: '#fff',
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', whiteSpace: 'nowrap',
                      opacity: confirmingId === p.id ? 0.6 : 1,
                    }}>
                      {confirmingId === p.id ? '...' : 'Confirm'}
                    </button>
                  )}
                  {!canModify(p) && p.confirmed && <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>—</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
