import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/packages/visibility — public.
// A package is only considered active if it has an explicit active=true
// row here. No row at all (never reviewed by an admin) counts as inactive,
// same as an explicit active=false row — callers should check membership
// in activePackageIds, not the absence of inactivePackageIds.
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('package_visibility')
      .select('package_id, active')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const activePackageIds = (data || []).filter(r => r.active).map(r => r.package_id)
    const inactivePackageIds = (data || []).filter(r => !r.active).map(r => r.package_id)

    return NextResponse.json({ activePackageIds, inactivePackageIds })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
