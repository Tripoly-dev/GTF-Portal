import { REGIONS } from '@/data/packages'
import DeparturePage from '@/components/ui/DeparturePage'
export const metadata = { title: 'Americas Departures — GTF Portal' }
export default function AmericasPage() { return <DeparturePage region={REGIONS.americas} /> }
