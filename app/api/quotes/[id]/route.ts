import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

// GET single quote
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    const { data: quote, error } = await supabase
      .from('quotes').select('*').eq('id', id).eq('agent_id', payload.id).single()

    if (error || !quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

    const { data: agent } = await supabase
      .from('agents')
      .select('full_name, agency_name, email, mobile, whatsapp_number, agency_address, agency_website, logo_url')
      .eq('id', payload.id).single()

    return NextResponse.json({ quote, agent })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT full edit (wizard save)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await req.json()

    const { data, error } = await supabase
      .from('quotes')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id).eq('agent_id', payload.id)
      .select().single()

    if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    return NextResponse.json({ success: true, quote: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
