import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    let query = supabase.from('bookings').select('*').eq('id', id)

    // Agents can only see their own bookings
    if (payload.role === 'agent') query = query.eq('agent_id', payload.id)

    const { data, error } = await query.single()
    if (error || !data) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    // Fetch agent info
    const { data: agent } = await supabase
      .from('agents')
      .select('full_name, agency_name, email, mobile')
      .eq('id', data.agent_id)
      .single()

    return NextResponse.json({ booking: data, agent })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
