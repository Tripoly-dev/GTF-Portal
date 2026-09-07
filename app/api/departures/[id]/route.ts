import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

// GET /api/departures/[packageId] — fetch departures for a package
// PUT /api/departures/[id]        — admin update a specific departure
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('departures')
      .select('*')
      .eq('package_id', id)
      .order('departure_date', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ departures: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const { status, total_seats, booked_seats } = await req.json()

    const update: any = { updated_at: new Date().toISOString() }
    if (status) update.status = status
    if (total_seats !== undefined) update.total_seats = total_seats
    if (booked_seats !== undefined) {
      update.booked_seats = booked_seats
      if (!status) {
        const ts = total_seats || 30
        update.status = booked_seats >= ts ? 'sold-out' : booked_seats >= 10 ? 'fast-filling' : 'available'
      }
    }

    const { data, error } = await supabase
      .from('departures').update(update).eq('id', id).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, departure: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
