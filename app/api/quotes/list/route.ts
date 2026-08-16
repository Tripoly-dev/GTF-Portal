import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    let query = supabase.from('quotes').select('*').order('created_at', { ascending: false })

    // Agents only see their own quotes
    if (payload.role === 'agent') {
      query = query.eq('agent_id', payload.id)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
    return NextResponse.json({ quotes: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
