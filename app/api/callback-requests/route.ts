import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { quote_id, comments } = await req.json()
    if (!quote_id) return NextResponse.json({ error: 'Missing quote_id' }, { status: 400 })

    const { data, error } = await supabase.from('callback_requests').insert({
      quote_id, agent_id: payload.id, comments: comments || null, status: 'pending'
    }).select().single()

    if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
