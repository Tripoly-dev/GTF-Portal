import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const packageId = searchParams.get('package_id')

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (packageId) query = query.eq('package_id', packageId)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Fetch agent details for each booking
    const agentIds = [...new Set(data?.map(b => b.agent_id) || [])]
    const { data: agents } = await supabase
      .from('agents')
      .select('id, full_name, agency_name, email, mobile')
      .in('id', agentIds)

    const agentMap = Object.fromEntries((agents || []).map(a => [a.id, a]))
    const bookings = (data || []).map(b => ({ ...b, agent: agentMap[b.agent_id] || null }))

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
