import { REGIONS } from '@/data/packages'
import DeparturePage from '@/components/ui/DeparturePage'
export const metadata = { title: 'Oceania Departures — GTF Portal' }
export default function OceaniaPage() { return <DeparturePage region={REGIONS.oceania} /> }
