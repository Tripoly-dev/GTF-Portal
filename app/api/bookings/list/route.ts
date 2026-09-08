import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabase
      .from('bookings')
      .select('id, quote_id, package_id, package_name, departure_date, adults, children_with_bed, children_without_bed, total_price, status, deposit_amount, balance_amount, payment_mode, created_at, confirmed_at')
      .eq('agent_id', payload.id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const quoteIds = [...new Set((data || []).map(b => b.quote_id).filter(Boolean))]
    let clientNames: Record<string, string> = {}
    if (quoteIds.length) {
      const { data: quotesData } = await supabase.from('quotes').select('id, client_name').in('id', quoteIds)
      clientNames = Object.fromEntries((quotesData || []).map(q => [q.id, q.client_name]))
    }
    const bookings = (data || []).map(b => ({ ...b, client_name: clientNames[b.quote_id] || null }))

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
