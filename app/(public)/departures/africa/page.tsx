import { REGIONS } from '@/data/packages'
import DeparturePage from '@/components/ui/DeparturePage'
export const metadata = { title: 'Africa Departures — GTF Connect' }
export default function AfricaPage() { return <DeparturePage region={REGIONS.africa} /> }
