import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'
import { PACKAGES } from '@/data/packages'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    // Build departures from packages.ts
    const departures: any[] = []
    for (const pkg of PACKAGES) {
      if (!pkg.departures?.length) continue
      for (const dep of pkg.departures) {
        departures.push({
          package_id: pkg.id,
          departure_date: dep.date,
          status: dep.status === 'sold-out' ? 'sold-out' : dep.status === 'fast-filling' ? 'fast-filling' : 'available',
          total_seats: 30,
          booked_seats: 0,
        })
      }
    }

    if (!departures.length) return NextResponse.json({ error: 'No departures found' }, { status: 400 })

    // Upsert — skip existing ones
    const { data, error } = await supabase
      .from('departures')
      .upsert(departures, { onConflict: 'package_id,departure_date', ignoreDuplicates: true })
      .select()

    if (error) return NextResponse.json({ error: error.message, detail: error.details }, { status: 500 })

    return NextResponse.json({ success: true, seeded: departures.length, message: `${departures.length} departures seeded` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
