// Shared hotel image lookups — used by the agent proposal detail page and the public proposal page.

export const HOTEL_IMAGES: Record<string, string> = {
  'Cairo': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Nile Cruise': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/NILE%20CRUISE/SEMIRAMIS%20CRUISE/CRUISE%20VIEW.jpg',
  'Hurghada': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/HURGHADA/PAHROAH%20AZUR%20HOTEL%20AND%20RESORT/OUTSIDE%20VIEW.jpg',
  'Cape Town': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg',
  'Garden Route': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/GARDEN%20ROUTE/DIAZ%20HOTEL%20&%20RESORT/OUTSIDE.jpg',
  'Johannesburg': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/JOHANNESBURG/THE%20CATALYST%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Mauritius': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg',
  'Ankara': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg',
  'Cappadocia': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg',
  'Antalya': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Pamukkale': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg',
  'Kusadasi': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg',
  'Hanoi': 'https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/VIETNAM%20ESCAPES/HANOI/GLOUD%20HOTEL/OUTSIDE.jpg',
}

export const HOTEL_GALLERY: Record<string, string[]> = {
  'Novotel 6 October Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/DINING.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MYSTICAL%20EGYPT/CAIRO/NOVOTEL%206%20OCTOBER%20HOTEL/STANDARD%20ROOM.jpg'],
  'Cresta Grande Cape Town': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/DINING.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/SOUTH%20AFRICAN%20SPLENDOUR/CAPE%20TOWN/CRESTA%20GRANDE%20CAPE%20TOWN/STANDARD%20DOUBLE%20ROOM.jpg'],
  'Pearle Beach Resort & Spa': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20HOTEL.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/MAURITIAN%20PARADISE/PEARLE%20BEACH%20RESORT%20AND%20SPA/BUDGET%20ROOM.jpg'],
  'Mercure Hotel Kızılay': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDE%20ENTRY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/OUTSIDEVIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANKARA/MERCURE%20HOTEL%20KIZILAY/STANDARD%20ROOM.jpg'],
  'Aleria Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/HOTEL%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/RESTAURANT.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/CAPPADOCIA/ALLERIA%20HOTEL/STANDARD%20ROOM.jpg'],
  'Ring Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/ANTALYA/RING%20HOTEL/DOUBLE%20ROOM.jpg'],
  'Adempira Thermal Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/PAMUKKALE/ADEMPIRA%20THERMAL%20HOTEL/DELUXE%20ROOM.jpg'],
  'Odelia Resort Hotel': ['https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/OUTSIDE%20VIEW.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/LOBBY.jpg','https://mvmlwrstcpsupmekqbkm.supabase.co/storage/v1/object/public/gtf-images/hotels/GRAND%20TURKIYE/KUSADASI/ODELIA%20RESORT/STANDARD%20ROOM.jpg'],
}

export function normalizeHotelName(name: string) {
  return name.replace(/\s*\/?\s*or similar$/i, '').trim()
}

export function hotelImage(hotelName: string, city: string): string {
  const norm = normalizeHotelName(hotelName)
  const gallery = HOTEL_GALLERY[norm]
  if (gallery?.length) return gallery[0]
  return HOTEL_IMAGES[city] || ''
}
