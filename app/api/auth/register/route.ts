import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      full_name, agency_name, city, mobile, email, password,
      iata_number, how_did_you_hear,
      agency_address, whatsapp_number, agency_website, logo_url,
    } = body

    if (!full_name || !agency_name || !city || !mobile || !email || !password ||
      !agency_address?.trim() || !whatsapp_number?.trim() || !how_did_you_hear || !logo_url) {
      return NextResponse.json({ error: 'Please fill in every field marked with *.' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('agents').select('id').eq('email', email.toLowerCase()).single()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Sign in instead, or use a different email.' }, { status: 409 })
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
      how_did_you_hear,
      agency_address: agency_address.trim(),
      whatsapp_number: whatsapp_number.trim(),
      agency_website: agency_website?.trim() || null,
      logo_url,
      status: 'pending',
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Something went wrong on our side. Please try again in a minute.' }, { status: 500 })
  }
}
