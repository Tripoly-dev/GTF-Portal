import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const {
      quote_id, package_id, package_name, departure_date,
      adults, children_with_bed, children_without_bed, total_price,
      passengers, deposit_amount, deposit_due_date,
      balance_amount, balance_due_date, payment_mode, notes,
    } = body

    // Validate required fields
    if (!quote_id || !package_id || !departure_date || !passengers?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify quote belongs to this agent and is in 'sent' status
    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .select('id, status, agent_id')
      .eq('id', quote_id)
      .eq('agent_id', payload.id)
      .single()

    if (quoteErr || !quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    if (quote.status !== 'sent') return NextResponse.json({ error: 'Only sent proposals can be converted to bookings' }, { status: 400 })

    // Create booking
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        quote_id, agent_id: payload.id,
        package_id, package_name, departure_date,
        adults: adults || 1,
        children_with_bed: children_with_bed || 0,
        children_without_bed: children_without_bed || 0,
        total_price, passengers,
        deposit_amount: deposit_amount || null,
        deposit_due_date: deposit_due_date || null,
        balance_amount: balance_amount || null,
        balance_due_date: balance_due_date || null,
        payment_mode: payment_mode || null,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingErr) {
      console.error('Booking create error:', bookingErr)
      return NextResponse.json({ error: 'Failed to create booking', detail: bookingErr.message }, { status: 500 })
    }

    // Update quote status to 'booking'
    await supabase
      .from('quotes')
      .update({ status: 'booking', updated_at: new Date().toISOString() })
      .eq('id', quote_id)

    return NextResponse.json({ success: true, booking })
  } catch (err) {
    console.error('Booking create exception:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
