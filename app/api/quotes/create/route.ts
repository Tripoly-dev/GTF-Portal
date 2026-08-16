import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const {
      package_id, package_name, region,
      departure_date, adults, room_type,
      base_price, markup_type, markup_value, markup_amount,
      add_ons, add_ons_total, total_price,
      client_name, client_type, trip_name,
      estimated_booking_date, flights_booked, notes,
    } = body

    if (!package_id || !client_name || !departure_date || !adults) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase.from('quotes').insert({
      agent_id: payload.id,
      agent_email: payload.email,
      package_id, package_name, region,
      departure_date, adults, room_type,
      base_price, markup_type, markup_value, markup_amount,
      add_ons: add_ons || [],
      add_ons_total: add_ons_total || 0,
      total_price,
      client_name, client_type, trip_name,
      estimated_booking_date: estimated_booking_date || null,
      flights_booked: flights_booked || false,
      notes: notes || null,
      status: 'draft',
    }).select().single()

    if (error) {
      console.error('Quote create error:', error)
      return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 })
    }

    return NextResponse.json({ success: true, quote: data })
  } catch (err) {
    console.error('Quote API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
