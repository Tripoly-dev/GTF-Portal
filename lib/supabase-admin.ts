import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-only client — bypasses RLS via the service role key.
// Never import this file from a 'use client' component.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
