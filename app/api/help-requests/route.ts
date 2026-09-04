import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { quote_id, categories, comments } = await req.json()
    if (!quote_id || !categories?.length) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data, error } = await supabase.from('help_requests').insert({
      quote_id, agent_id: payload.id, categories, comments: comments || null, status: 'open'
    }).select().single()

    if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
