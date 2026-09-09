export type Payment = {
  id: string
  booking_id: string
  amount: number
  payment_date: string
  payment_mode: 'NEFT' | 'RTGS' | 'UPI' | 'Cheque' | 'Cash'
  reference_number: string | null
  remarks: string | null
  recorded_by: string
  recorded_by_role: 'agent' | 'admin'
  confirmed: boolean
  confirmed_by: string | null
  confirmed_at: string | null
  created_at: string
}

export const PAYMENT_MODES = ['NEFT', 'RTGS', 'UPI', 'Cheque', 'Cash'] as const
