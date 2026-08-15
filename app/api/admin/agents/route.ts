import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabase
      .from('agents')
      .select('id, full_name, agency_name, city, mobile, email, iata_number, how_did_you_hear, status, created_at')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    return NextResponse.json({ agents: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
