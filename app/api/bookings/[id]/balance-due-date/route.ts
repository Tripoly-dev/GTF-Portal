import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

// PUT /api/bookings/[id]/balance-due-date — admin updates the balance due date
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const { balance_due_date } = await req.json()
    if (!balance_due_date) return NextResponse.json({ error: 'Balance due date is required' }, { status: 400 })

    const { data: booking } = await supabase.from('bookings').select('departure_date').eq('id', id).single()
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    if (new Date(balance_due_date) >= new Date(booking.departure_date)) {
      return NextResponse.json({ error: 'Balance due date must be before the departure date' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ balance_due_date, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Update failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ success: true, booking: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
