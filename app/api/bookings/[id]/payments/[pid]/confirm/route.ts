import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

// PUT /api/bookings/[id]/payments/[pid]/confirm — admin confirms a payment
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; pid: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id, pid } = await params

    const { data: payment } = await supabase.from('booking_payments').select('*').eq('id', pid).eq('booking_id', id).single()
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    if (payment.confirmed) return NextResponse.json({ error: 'Payment is already confirmed' }, { status: 400 })

    const { data, error } = await supabase
      .from('booking_payments')
      .update({ confirmed: true, confirmed_by: payload.id, confirmed_at: new Date().toISOString() })
      .eq('id', pid)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Confirm failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ success: true, payment: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
