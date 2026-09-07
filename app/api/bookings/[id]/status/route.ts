import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const { status } = await req.json()

    const allowed = ['pending', 'confirmed', 'cancelled']
    if (!allowed.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

    // Fetch booking to get departure info
    const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).single()
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString()
      updateData.confirmed_by = payload.email

      // Update departure booked_seats
      const totalPax = (booking.adults || 0) + (booking.children_with_bed || 0) + (booking.children_without_bed || 0)
      const { data: dep } = await supabase
        .from('departures')
        .select('*')
        .eq('package_id', booking.package_id)
        .eq('departure_date', booking.departure_date)
        .single()

      if (dep) {
        const newBooked = (dep.booked_seats || 0) + totalPax
        const newStatus = newBooked >= dep.total_seats ? 'sold-out' : newBooked >= 10 ? 'fast-filling' : 'available'
        await supabase
          .from('departures')
          .update({ booked_seats: newBooked, status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', dep.id)
      }
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
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
