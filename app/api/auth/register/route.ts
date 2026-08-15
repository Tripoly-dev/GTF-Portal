import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, agency_name, city, mobile, email, password, iata_number, how_did_you_hear } = body

    if (!full_name || !agency_name || !city || !mobile || !email || !password) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('agents')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const password_hash = await hashPassword(password)

    const { error } = await supabase.from('agents').insert({
      full_name: full_name.trim(),
      agency_name: agency_name.trim(),
      city: city.trim(),
      mobile: mobile.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      iata_number: iata_number?.trim() || null,
      how_did_you_hear: how_did_you_hear || null,
      status: 'pending',
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Registration successful. Awaiting admin approval.' })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
