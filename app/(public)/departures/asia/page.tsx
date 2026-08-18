import { REGIONS } from '@/data/packages'
import DeparturePage from '@/components/ui/DeparturePage'
export const metadata = { title: 'Asia Departures — GTF Connect' }
export default function AsiaPage() { return <DeparturePage region={REGIONS.asia} /> }
