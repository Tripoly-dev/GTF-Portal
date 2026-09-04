import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('logo') as File
    const email = formData.get('email') as string

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate type
    const allowed = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. PNG, JPG or WEBP only.' }, { status: 400 })
    }

    // Validate size (500KB)
    if (file.size > 500 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 500KB.' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const filename = `agency-logos/${email.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error } = await supabase.storage
      .from('gtf-images')
      .upload(filename, buffer, { contentType: file.type, upsert: true })

    if (error) {
      console.error('Logo upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data } = supabase.storage.from('gtf-images').getPublicUrl(filename)
    return NextResponse.json({ success: true, url: data.publicUrl })
  } catch (err) {
    console.error('Logo upload error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
