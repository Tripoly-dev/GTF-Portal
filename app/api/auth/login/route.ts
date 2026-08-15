import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const normalEmail = email.toLowerCase().trim()

    // Check admin first
    const { data: admin } = await supabase
      .from('admins')
      .select('id, email, password_hash')
      .eq('email', normalEmail)
      .single()

    if (admin) {
      const valid = await verifyPassword(password, admin.password_hash)
      if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      const token = signToken({ id: admin.id, email: admin.email, role: 'admin' })
      const res = NextResponse.json({ success: true, role: 'admin' })
      res.cookies.set('gtf_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/' })
      return res
    }

    // Check agent
    const { data: agent } = await supabase
      .from('agents')
      .select('id, email, password_hash, status, full_name, agency_name')
      .eq('email', normalEmail)
      .single()

    if (!agent) return NextResponse.json({ error: 'No account found with this email' }, { status: 401 })

    const valid = await verifyPassword(password, agent.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    if (agent.status === 'pending') return NextResponse.json({ error: 'Your account is pending approval. We\'ll notify you once approved.' }, { status: 403 })
    if (agent.status === 'rejected') return NextResponse.json({ error: 'Your application was not approved. Please contact sales@gtfholidays.com.' }, { status: 403 })

    const token = signToken({ id: agent.id, email: agent.email, role: 'agent' })
    const res = NextResponse.json({ success: true, role: 'agent', name: agent.full_name })
    res.cookies.set('gtf_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/' })
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
