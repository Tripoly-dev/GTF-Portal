import { REGIONS } from '@/data/packages'
import DeparturePage from '@/components/ui/DeparturePage'

export const metadata = { title: 'Europe Departures — GTF Portal' }

export default function EuropePage() {
  return <DeparturePage region={REGIONS.europe} />
}
