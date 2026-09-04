import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'
import { renderToBuffer } from '@react-pdf/renderer'
import { ProposalPDF } from '@/lib/proposal-pdf'
import { PACKAGES } from '@/data/packages'
import React from 'react'

export async function GET(req: NextRequest) {
  try {
    // Auth check
    const token = getTokenFromCookie(req.headers.get('cookie'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const quoteId = searchParams.get('id')
    if (!quoteId) return NextResponse.json({ error: 'Quote ID required' }, { status: 400 })

    // Fetch quote — must belong to this agent
    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .eq('agent_id', payload.id)  // Security: ownership check
      .single()

    if (quoteErr || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Fetch agent
    const { data: agent, error: agentErr } = await supabase
      .from('agents')
      .select('full_name, agency_name, email, mobile, whatsapp_number, agency_address, agency_website, logo_url')
      .eq('id', payload.id)
      .single()

    if (agentErr || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get package data from packages.ts
    const pkg = PACKAGES.find(p => p.id === quote.package_id) || null

    // Generate PDF
    const element = React.createElement(ProposalPDF, { quote, agent, pkg }) as any
    const pdfBuffer = await renderToBuffer(element)
    const uint8Array = new Uint8Array(pdfBuffer)

    const filename = `${quote.trip_name.replace(/[^a-zA-Z0-9]/g, '-')}-Proposal.pdf`

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': uint8Array.length.toString(),
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
