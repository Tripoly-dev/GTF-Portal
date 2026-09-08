import { supabaseAdmin } from '@/lib/supabase-admin'
import { PACKAGES } from '@/data/packages'
import NotFoundProposal from './NotFoundProposal'
import ProposalPublicView from './ProposalPublicView'

export const dynamic = 'force-dynamic'

export default async function PublicProposalPage({ params }: { params: Promise<{ quote_number: string }> }) {
  const { quote_number } = await params
  const quoteNumber = Number(quote_number)
  if (!Number.isInteger(quoteNumber)) return <NotFoundProposal />

  const { data: quote } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('quote_number', quoteNumber)
    .single()
  if (!quote) return <NotFoundProposal />

  const { data: agent } = await supabaseAdmin
    .from('agents')
    .select('full_name, agency_name, logo_url, mobile, email, whatsapp_number')
    .eq('id', quote.agent_id)
    .single()
  if (!agent) return <NotFoundProposal />

  const pkg = PACKAGES.find(p => p.id === quote.package_id) || null
  if (!pkg) return <NotFoundProposal />

  return <ProposalPublicView quote={quote} agent={agent} pkg={pkg} />
}
