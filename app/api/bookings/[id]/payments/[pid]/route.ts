import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

const PAYMENT_MODES = ['NEFT', 'RTGS', 'UPI', 'Cheque', 'Cash']

// PUT /api/bookings/[id]/payments/[pid] — edit own unconfirmed payment
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; pid: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, pid } = await params

    const { data: payment } = await supabase.from('booking_payments').select('*').eq('id', pid).eq('booking_id', id).single()
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    if (payment.confirmed) return NextResponse.json({ error: 'Confirmed payments cannot be edited' }, { status: 400 })
    if (payload.role !== 'admin' && payment.recorded_by !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { amount, payment_date, payment_mode, reference_number, remarks } = body

    const update: Record<string, unknown> = {}
    if (amount !== undefined) {
      if (Number(amount) <= 0) return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
      update.amount = Number(amount)
    }
    if (payment_date !== undefined) {
      if (!payment_date) return NextResponse.json({ error: 'Payment date is required' }, { status: 400 })
      update.payment_date = payment_date
    }
    if (payment_mode !== undefined) {
      if (!PAYMENT_MODES.includes(payment_mode)) return NextResponse.json({ error: 'Invalid payment mode' }, { status: 400 })
      update.payment_mode = payment_mode
    }
    if (reference_number !== undefined) update.reference_number = reference_number || null
    if (remarks !== undefined) update.remarks = remarks || null

    const { data, error } = await supabase
      .from('booking_payments')
      .update(update)
      .eq('id', pid)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Update failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ success: true, payment: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/bookings/[id]/payments/[pid] — delete own unconfirmed payment
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; pid: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, pid } = await params

    const { data: payment } = await supabase.from('booking_payments').select('*').eq('id', pid).eq('booking_id', id).single()
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    if (payment.confirmed) return NextResponse.json({ error: 'Confirmed payments cannot be deleted' }, { status: 400 })
    if (payload.role !== 'admin' && payment.recorded_by !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('booking_payments').delete().eq('id', pid)
    if (error) return NextResponse.json({ error: 'Delete failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
