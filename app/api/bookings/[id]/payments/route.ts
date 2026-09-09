import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

const PAYMENT_MODES = ['NEFT', 'RTGS', 'UPI', 'Cheque', 'Cash']

// GET /api/bookings/[id]/payments — list payments for a booking
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    const { data: booking } = await supabase.from('bookings').select('agent_id').eq('id', id).single()
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    if (payload.role === 'agent' && booking.agent_id !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('booking_payments')
      .select('*')
      .eq('booking_id', id)
      .order('payment_date', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ payments: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/bookings/[id]/payments — record a new payment
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    const { data: booking } = await supabase.from('bookings').select('agent_id').eq('id', id).single()
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    if (payload.role === 'agent' && booking.agent_id !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { amount, payment_date, payment_mode, reference_number, remarks } = body

    if (!amount || Number(amount) <= 0) return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    if (!payment_date) return NextResponse.json({ error: 'Payment date is required' }, { status: 400 })
    if (!PAYMENT_MODES.includes(payment_mode)) return NextResponse.json({ error: 'Invalid payment mode' }, { status: 400 })

    const { data, error } = await supabase
      .from('booking_payments')
      .insert({
        booking_id: id,
        amount: Number(amount),
        payment_date,
        payment_mode,
        reference_number: reference_number || null,
        remarks: remarks || null,
        recorded_by: payload.id,
        recorded_by_role: payload.role,
        confirmed: false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to record payment', detail: error.message }, { status: 500 })
    return NextResponse.json({ success: true, payment: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
