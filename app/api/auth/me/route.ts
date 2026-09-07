import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ agent: null }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ agent: null }, { status: 401 })

    const { data } = await supabase
      .from('agents')
      .select('id, full_name, email, agency_name, role, status')
      .eq('id', payload.id)
      .single()

    return NextResponse.json({ agent: data ? { ...data, role: payload.role } : null })
  } catch {
    return NextResponse.json({ agent: null }, { status: 500 })
  }
}
