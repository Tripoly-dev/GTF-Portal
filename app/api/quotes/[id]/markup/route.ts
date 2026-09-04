import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const { markup_type, markup_value, markup_amount, total_price } = await req.json()

    const { data, error } = await supabase
      .from('quotes')
      .update({ markup_type, markup_value, markup_amount, total_price, updated_at: new Date().toISOString() })
      .eq('id', id).eq('agent_id', payload.id)
      .select().single()

    if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    return NextResponse.json({ success: true, quote: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
