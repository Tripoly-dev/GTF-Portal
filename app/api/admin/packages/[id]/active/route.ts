import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

// PUT /api/admin/packages/[id]/active — admin only. Toggles whole-package
// visibility. Not blocked by existing bookings — a booking on one date
// shouldn't prevent turning off new sales on the package going forward.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const { active } = await req.json()
    if (typeof active !== 'boolean') return NextResponse.json({ error: 'active must be true or false' }, { status: 400 })

    const { data, error } = await supabase
      .from('package_visibility')
      .upsert({ package_id: id, active, updated_at: new Date().toISOString() }, { onConflict: 'package_id' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, visibility: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
