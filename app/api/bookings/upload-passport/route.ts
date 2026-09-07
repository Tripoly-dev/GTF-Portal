import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const formData = await req.formData()
    const file = formData.get('passport') as File
    const bookingId = formData.get('booking_id') as string
    const passengerName = formData.get('passenger_name') as string

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate type — JPEG, PNG, PDF only
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. JPG, PNG or PDF only.' }, { status: 400 })
    }

    // Validate size — 2MB max
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 2MB per passport.' }, { status: 400 })
    }

    const ext = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'
    const safeName = passengerName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const filename = `booking-documents/${bookingId || payload.id}/${safeName}-passport-${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error } = await supabase.storage
      .from('gtf-images')
      .upload(filename, buffer, { contentType: file.type, upsert: true })

    if (error) {
      console.error('Passport upload error:', error)
      return NextResponse.json({ error: 'Upload failed', detail: error.message }, { status: 500 })
    }

    const { data } = supabase.storage.from('gtf-images').getPublicUrl(filename)
    return NextResponse.json({ success: true, url: data.publicUrl })
  } catch (err) {
    console.error('Passport upload exception:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
