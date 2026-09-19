import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const { status } = await req.json()

    const allowed = ['approved', 'rejected', 'suspended']
    if (!allowed.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

    const { data, error } = await supabase
      .from('agents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, agent: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

const COLS = 'id, full_name, agency_name, agency_address, city, mobile, whatsapp_number, email, agency_website, iata_number, how_did_you_hear, logo_url, status, created_at'

// PATCH /api/admin/agents/[id] — admin edits an agent's profile details
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const body = await req.json()

    const required = ['full_name', 'agency_name', 'agency_address', 'city', 'mobile', 'whatsapp_number', 'how_did_you_hear'] as const
    const update: Record<string, string | null> = { updated_at: new Date().toISOString() }
    for (const k of required) {
      const v = typeof body[k] === 'string' ? body[k].trim() : ''
      if (!v) return NextResponse.json({ error: `${k.replace(/_/g, ' ')} is required` }, { status: 400 })
      update[k] = v
    }
    update.agency_website = typeof body.agency_website === 'string' && body.agency_website.trim() ? body.agency_website.trim() : null
    update.iata_number = typeof body.iata_number === 'string' && body.iata_number.trim() ? body.iata_number.trim() : null
    if (typeof body.logo_url === 'string' && body.logo_url) update.logo_url = body.logo_url

    const { data, error } = await supabase
      .from('agents')
      .update(update)
      .eq('id', id)
      .select(COLS)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, agent: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
