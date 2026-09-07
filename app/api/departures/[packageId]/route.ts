import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ packageId: string }> }) {
  try {
    const { packageId } = await params
    const { data, error } = await supabase
      .from('departures')
      .select('*')
      .eq('package_id', packageId)
      .order('departure_date', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ departures: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
