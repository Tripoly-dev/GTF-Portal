export type Currency = 'INR' | 'USD' | 'EUR' | string

const SYMBOL: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' }

// Indian grouping for INR and EUR, US grouping for USD; whole units only.
export function money(n: number | null | undefined, currency: Currency = 'INR'): string {
  const symbol = SYMBOL[currency] ?? '₹'
  const locale = currency === 'USD' ? 'en-US' : 'en-IN'
  return symbol + Math.round(Number(n) || 0).toLocaleString(locale)
}

export function moneyOrDash(n: number | null | undefined, currency: Currency = 'INR'): string {
  return n ? money(n, currency) : '—'
}

export type DateStyle = 'short' | 'long' | 'weekday'

export function formatDate(d: string | null | undefined, style: DateStyle = 'short', empty = '—'): string {
  if (!d) return empty
  const opts: Intl.DateTimeFormatOptions =
    style === 'long' ? { day: 'numeric', month: 'long', year: 'numeric' }
    : style === 'weekday' ? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(d).toLocaleDateString('en-IN', opts)
}
