export type DepartureSlot = {
  date: string
  status: 'available' | 'fast-filling' | 'sold-out'
}

export type Hotel = {
  city: string
  name: string
  stars: number
  nights: number
  roomType: string
  meal: string
}

export type AddOn = {
  id: string
  label: string
  price: number
  note?: string
}

export type ItineraryDay = {
  day: number
  title: string
  description: string
  hotel?: string
  meals: string[]
}

export type FlightSegment = {
  flightNo: string
  airline: string
  sector: string
  depTime: string
  arrTime: string
  depDate?: string
}

export type FlightInfo = {
  included: boolean
  exCity: string
  departurewise: {
    departureDate: string
    segments: FlightSegment[]
  }[]
}

export type Package = {
  id: string
  name: string
  nights: number
  days: number
  region: 'europe' | 'africa' | 'asia'
  workdriveUrl: string
  img: string
  gallery: string[]
  tag?: string
  tagline: string
  basePrice: number
  currency: 'INR' | 'USD' | 'EUR'
  singlePrice?: number
  tacAdult: number
  tacChild: number
  childWithBedPrice?: number
  childWithoutBedPrice?: number
  departures: DepartureSlot[]
  singleSupplement: number
  tripleReduction: number
  addOns: AddOn[]
  hotels: Hotel[]
  travelerTypes: string[]
  themes: string[]
  exCities: string[]
  starRating: number
  hasPrice: boolean
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: ItineraryDay[]
  flights?: FlightInfo
}

const EU_DEPARTURES: DepartureSlot[] = [
  { date: '2026-09-18', status: 'fast-filling' },
  { date: '2026-10-02', status: 'available' },
  { date: '2026-10-07', status: 'available' },
  { date: '2026-10-16', status: 'available' },
  { date: '2026-10-21', status: 'available' },
  { date: '2026-10-30', status: 'fast-filling' },
  { date: '2026-11-04', status: 'available' },
  { date: '2026-11-13', status: 'available' },
  { date: '2026-11-14', status: 'available' },
  { date: '2026-11-27', status: 'available' },
  { date: '2026-12-11', status: 'fast-filling' },
  { date: '2026-12-23', status: 'available' },
  { date: '2026-12-26', status: 'sold-out' },
  { date: '2027-01-08', status: 'available' },
  { date: '2027-02-05', status: 'available' },
  { date: '2027-03-05', status: 'available' },
]

const EU_ADDONS: AddOn[] = [
  { id: 'visa_eu', label: 'Schengen Visa Assistance', price: 8500, note: 'Visa fees + processing assistance' },
  { id: 'insurance', label: 'Travel Insurance', price: 2200, note: 'Comprehensive travel coverage' },
]
const AF_ADDONS: AddOn[] = [
  { id: 'insurance', label: 'Travel Insurance', price: 2200, note: 'Comprehensive travel coverage' },
]
const ASIA_ADDONS: AddOn[] = [
  { id: 'insurance', label: 'Travel Insurance', price: 2200, note: 'Comprehensive travel coverage' },
]

const ALL_CITIES = ['Mumbai', 'Delhi', 'Ahmedabad', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune']

const PARIS_HOTELS: Hotel[] = [{ city: 'Paris', name: 'Ibis Paris Porte de Clichy', stars: 3, nights: 2, roomType: 'Standard Double', meal: 'Breakfast' }]
const AMSTERDAM_HOTELS: Hotel[] = [{ city: 'Amsterdam', name: 'NH Amsterdam Centre', stars: 4, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const ROME_HOTELS: Hotel[] = [{ city: 'Rome', name: 'Hampton By Hilton Rome North Fiano Romano', stars: 3, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const VENICE_HOTELS: Hotel[] = [{ city: 'Venice / Mestre', name: 'Hotel Tritone Mestre', stars: 3, nights: 1, roomType: 'Standard Room', meal: 'Breakfast' }]
const FLORENCE_HOTELS: Hotel[] = [{ city: 'Florence Area', name: 'Radisson Hotel Ferrara', stars: 4, nights: 1, roomType: 'Standard Room', meal: 'Breakfast' }]
const ZURICH_HOTELS: Hotel[] = [{ city: 'Zurich', name: 'Radisson Hotel & Suites Zurich', stars: 4, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const INTERLAKEN_HOTELS: Hotel[] = [{ city: 'Interlaken', name: 'Hotel Sonne Interlaken', stars: 3, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const BRUSSELS_HOTELS: Hotel[] = [{ city: 'Brussels', name: 'ibis Brussels City Centre', stars: 3, nights: 1, roomType: 'Standard Room', meal: 'Breakfast' }]
const FRANKFURT_HOTELS: Hotel[] = [{ city: 'Frankfurt', name: 'Sheraton Frankfurt Airport Hotel', stars: 4, nights: 1, roomType: 'Standard Room', meal: 'Breakfast' }]
const PRAGUE_HOTELS: Hotel[] = [{ city: 'Prague', name: 'Hotel Don Giovanni Prague', stars: 4, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const VIENNA_HOTELS: Hotel[] = [{ city: 'Vienna', name: 'Hotel Schani Wien', stars: 4, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const LONDON_HOTELS: Hotel[] = [{ city: 'London', name: 'Holiday Inn London Wembley', stars: 4, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]
const MILAN_HOTELS: Hotel[] = [{ city: 'Milan', name: 'Hotel Michelangelo Milano', stars: 4, nights: 1, roomType: 'Standard Room', meal: 'Breakfast' }]
const LUCERNE_HOTELS: Hotel[] = [{ city: 'Lucerne', name: 'Hotel Astoria Lucerne', stars: 4, nights: 2, roomType: 'Standard Room', meal: 'Breakfast' }]

const EU_GALLERY_PARIS = ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80','https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=800&q=80','https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&q=80','https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80','https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=800&q=80']
const EU_GALLERY_ROME = ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80','https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80','https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80','https://images.unsplash.com/photo-1556988680-f4e716453a28?w=800&q=80','https://images.unsplash.com/photo-1543429257-3eb0b9c580b4?w=800&q=80']
const EU_GALLERY_GENERAL = ['https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80','https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80','https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80','https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80']
const AF_GALLERY = ['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=90','https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=1200&q=90','https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=90','https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=90','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=90']
const JAPAN_GALLERY = ['https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=90','https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=90','https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=90','https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=90','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=90']
const VIETNAM_GALLERY = ['https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=90','https://images.unsplash.com/photo-1570280406792-bf58b7c59247?w=1200&q=90','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=90','https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1200&q=90','https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?w=1200&q=90']
const TURKEY_GALLERY = ['https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=90','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=90','https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=90','https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=1200&q=90','https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=1200&q=90']
const EGYPT_GALLERY = ['https://images.unsplash.com/photo-1539650116574-75c0c6d73f6c?w=1200&q=90','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=90','https://images.unsplash.com/photo-1569519024219-3e272822ab04?w=1200&q=90','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=90','https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=1200&q=90']
const SA_GALLERY = ['https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&q=80','https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80','https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80','https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=800&q=80']
const MAURITIUS_GALLERY = ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=90','https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1200&q=90','https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=90','https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1200&q=90','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90']

const EU_H_GRAND = ['Ascend to the top level of the iconic Eiffel Tower for panoramic views of Paris','Cruise along the enchanting River Seine — the heart of the City of Lights','Full-day adventure at Disneyland Paris (One Day, One Park)','Explore Zaanse Schans — Dutch heritage of windmills, cheese and wooden clogs','Sail through Amsterdam\'s charming canals','Boat ride at the majestic Rhine Falls — Europe\'s largest waterfall','Ride the Rotair to Mt. Titlis — the world\'s first revolving cable car','Jungfraujoch — Top of Europe at 11,333 feet by cogwheel train','Gondola ride through the enchanting canals of Venice','Guided city tour of Rome — Colosseum, Trevi Fountain & Vatican']
const EU_H_ALPS = ['Jungfraujoch — Top of Europe at 11,333 feet by Eiger Express & cogwheel train','Mt. Titlis at 3,020m via the world\'s first revolving Rotair cable car','Walk the Titlis Cliff Walk — Europe\'s highest suspension bridge','Gondola ride through Venice\'s enchanting canals','Witness the Leaning Tower of Pisa at the Square of Miracles','Panoramic views of Florence from Piazzale Michelangelo','Guided city tour of Rome — Colosseum, Trevi Fountain & Vatican','City Train Ride in Vaduz, capital of Liechtenstein','Swarovski Crystal Museum at Wattens']

// ── INCLUSIONS / EXCLUSIONS CONSTANTS ────────────────────────────────────────
const EU_INCL: string[] = []
const EU_EXCL: string[] = []

const AF_SA_INCL = [
  'Economy Class Return International Airfare Ex. Mumbai',
  'Standard South Africa Visa Charges',
  'Travel Insurance (up to 59 years of age)',
  '9 Nights\' Accommodation in Premium 4-Star Hotels on Twin/Double Sharing Basis',
  'Daily Breakfast with Lunches & Dinners as per itinerary',
  'Jain, Vegetarian & Non-Vegetarian Indian Cuisine and International/Local meals as per itinerary',
  'Internal Flight within South Africa (Garden Route → Johannesburg)',
  'All Airport, Hotel and Intercity Transfers by Private Air-Conditioned Coach',
  'All tours and excursions as specified in the itinerary',
  'All standard entrance fees for attractions mentioned in the itinerary',
  'Services of a Qualified English-Speaking Local Guide throughout',
  'Services of a Professional Multilingual Indian Tour Manager throughout',
  'Applicable local Taxes & Service Charges',
]
const AF_SA_EXCL = [
  'GST & TCS as applicable',
  'Optional activities — Bungee Jumping, Skydiving, Ziplining and similar',
  'Beverages during meals (except specifically included)',
  'Mineral water (except where specifically provided)',
  'Personal expenses — laundry, telephone, minibar, room service, shopping',
  'Porterage at airports, hotels and during transfers',
  'Excess baggage and airline charges',
  'Travel Insurance premium for travellers aged 60 years and above',
  'Any additional visa-related charges arising from reapplication or special processing',
  'Any item or service not specifically mentioned under Package Inclusions',
]

const AF_EG_INCL = [
  'Economy Class Return International Airfare Ex. Mumbai',
  'Egypt Standard Tourist Visa Charges',
  'Travel Insurance (up to 59 years of age)',
  '2 Nights\' Accommodation in Cairo (4-Star Hotel)',
  '1 Night aboard the Cairo–Aswan Overnight Sleeper Train (Dinner & Breakfast included)',
  '3 Nights\' Nile River Cruise in Standard Cabin (Full Board)',
  '2 Nights\' Accommodation in Hurghada (All-Inclusive)',
  'All meals as specified in the day-wise itinerary',
  'Indian Jain, Vegetarian & Non-Vegetarian meals and local/international cuisine as per itinerary',
  'Meet & Assist at Cairo International Airport upon arrival',
  'All Airport, Hotel, Railway Station, Cruise and Intercity Transfers by Private Coach',
  'All sightseeing tours and excursions as specified in the itinerary',
  'All standard entrance fees for sightseeing mentioned in the itinerary',
  'Tips/Gratuities for Local Guide, Driver, Nile Cruise Staff and applicable personnel',
  'Services of a Qualified English-Speaking Local Guide throughout',
  'Services of a Professional Multilingual Indian Tour Manager throughout',
  'Applicable local Taxes & Service Charges',
]
const AF_EG_EXCL = [
  'GST & TCS as applicable',
  'Special or restricted entrance fees — entry inside the Great Pyramid of Cheops/Khufu',
  'Optional tours, activities and excursions not mentioned under Package Inclusions',
  'Beverages during meals (except specifically included)',
  'Mineral water (except where specifically provided)',
  'Personal expenses — laundry, telephone, minibar, room service, shopping',
  'Porterage at airports, hotels, railway stations and cruise terminals',
  'Excess baggage and airline charges',
  'Travel Insurance premium for guests aged 60 years and above',
  'Any additional expenses arising due to flight delays, cancellations or circumstances beyond control',
  'Any item or service not specifically mentioned under Package Inclusions',
]

const AS_JP_INCL = [
  '8/7 Nights\' Accommodation in Premium 4-Star Hotels on Twin/Double Sharing Basis',
  'Daily Breakfast and Dinners at hotels; Lunches as per itinerary',
  'All Airport, Hotel and Intercity Transfers by Private Air-Conditioned Coach',
  'Shinkansen Bullet Train travel as specified in the itinerary',
  'All tours and sightseeing excursions as specified in the itinerary',
  'All standard entrance fees for attractions mentioned in the itinerary',
  'Services of a Qualified English-Speaking Local Guide throughout',
  'Services of a Professional Multilingual Indian Tour Manager throughout',
  'Applicable local Taxes & Service Charges',
]
const AS_JP_EXCL = [
  'International and Domestic Air Tickets (not included — land package only)',
  'Japan Tourist Visa Charges',
  'Travel Insurance',
  'Beverages during meals',
  'Personal expenses — laundry, telephone, minibar, room service, shopping',
  'Porterage at airports and hotels',
  'Excess baggage charges',
  'Optional experiences — Tokyo Disneyland, additional activities at own cost',
  'Any item or service not specifically mentioned under Package Inclusions',
]

const AS_TR_INCL = [
  'Economy Class Return International Airfare Ex. Mumbai (Royal Jordanian via Amman)',
  '10 Nights\' Accommodation in Premium 4-Star Hotels on Twin/Double Sharing Basis',
  'Daily Breakfast and Dinners at hotels; Lunches as per itinerary',
  'All Airport, Hotel and Intercity Transfers by Private Air-Conditioned Coach',
  'All tours and sightseeing excursions as specified in the itinerary',
  'All standard entrance fees for attractions mentioned in the itinerary',
  'Bosphorus Dinner Cruise with Turkish dinner and live entertainment',
  'ATV Ride in Cappadocia',
  'Services of a Qualified English-Speaking Local Guide throughout',
  'Services of a Professional Multilingual Indian Tour Manager throughout',
  'Applicable local Taxes & Service Charges',
]
const AS_TR_EXCL = [
  'Turkey Tourist e-Visa Charges',
  'Travel Insurance',
  'Optional Hot Air Balloon Ride in Cappadocia (additional cost)',
  'Beverages during meals',
  'Personal expenses — laundry, telephone, minibar, room service, shopping',
  'Porterage at airports and hotels',
  'Excess baggage charges',
  'Any item or service not specifically mentioned under Package Inclusions',
]

const AS_VN_INCL = [
  'Economy Class Return International Airfare Ex. Mumbai (VietJet Air)',
  'Domestic Flights within Vietnam — Ho Chi Minh → Da Nang → Hanoi (VietJet Air)',
  '8 Nights\' Accommodation in Premium 4-Star Hotels on Twin/Double Sharing Basis',
  'Daily Breakfast and Dinners at hotels; Lunches as per itinerary',
  'All Airport, Hotel and Intercity Transfers by Private Air-Conditioned Coach',
  'All tours and sightseeing excursions as specified in the itinerary',
  'All standard entrance fees for attractions mentioned in the itinerary',
  'Halong Bay Cruise with sightseeing and kayaking',
  'Services of a Qualified English-Speaking Local Guide throughout',
  'Services of a Professional Multilingual Indian Tour Manager throughout',
  'Applicable local Taxes & Service Charges',
]
const AS_VN_EXCL = [
  'Vietnam Tourist Visa-on-Arrival Charges',
  'Travel Insurance',
  'Beverages during meals',
  'Personal expenses — laundry, telephone, minibar, room service, shopping',
  'Porterage at airports and hotels',
  'Excess baggage charges',
  'Optional activities not mentioned in the itinerary',
  'Any item or service not specifically mentioned under Package Inclusions',
]

const AS_MU_INCL = [
  'Economy Class Return International Airfare Ex. Mumbai (Air Mauritius)',
  '6 Nights\' Accommodation at Pearle Beach Resort & Spa or similar (4-Star) on Twin/Double Sharing Basis',
  'Daily Breakfast and Selected Dinners as per itinerary',
  'Speedboat Transfer to Île aux Cerfs',
  'North Mauritius Tour — Port Louis, Citadel Fort, Caudan Waterfront',
  'South Mauritius Tour — Trou aux Cerfs, Grand Bassin, Bois Chéri Tea Plantation, Valley of Colours',
  'Casela Nature Parks — African Safari and Big Cats Kingdom',
  'All Airport and Hotel Transfers by Private Air-Conditioned Vehicle',
  'Services of a Professional Tour Representative throughout',
  'Applicable local Taxes & Service Charges',
]
const AS_MU_EXCL = [
  'Mauritius Tourist Visa (visa on arrival — free for Indian nationals)',
  'Travel Insurance',
  'Optional Water Sports at Île aux Cerfs — Parasailing, Undersea Walk, Tube Ride',
  'Lunches (except on specified days)',
  'Beverages during meals',
  'Personal expenses — laundry, telephone, minibar, room service, shopping',
  'Porterage at airports and hotels',
  'Excess baggage charges',
  'Any item or service not specifically mentioned under Package Inclusions',
]

export const PACKAGES: Package[] = [
  // EUROPE
  { id: 'eu-05', name: 'Grand Europe with London', nights: 14, days: 15, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4d45536d41045426c8c4d782fc5e55c5a', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', gallery: EU_GALLERY_GENERAL, tagline: 'Two iconic capitals, Alpine heights and timeless European charm', basePrice: 148000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: [{date:'2027-05-01',status:'available'}], singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...LONDON_HOTELS,...PARIS_HOTELS,...AMSTERDAM_HOTELS,...FRANKFURT_HOTELS,...ZURICH_HOTELS], travelerTypes: ['Couples','Family','Friends','Seniors'], themes: ['Away & Beyond'], exCities: ALL_CITIES, starRating: 4, hasPrice: false, highlights: ['Discover lifelike wonders at Madame Tussauds Wax Museum in London','Soar above London with the exhilarating London Eye Ride','Uncover the historic Tower of London and the legendary Kohinoor Diamond','Experience the Eurostar — Europe\'s renowned high-speed train','Ascend to the Eiffel Tower 3rd Level and cruise the River Seine','Full-day Disneyland Paris adventure','Jungfraujoch — Top of Europe by Eiger Express','Gondola ride through the canals of Venice','Guided city tour of Rome — Colosseum, Trevi Fountain & Vatican','Keukenhof Gardens — Holland\'s legendary tulip glory (seasonal)'], inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-06', name: 'Grand Europe', nights: 12, days: 13, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh48e4e6f4549894901a692670027c6a552', img: 'https://static.wixstatic.com/media/226760_6405694ec1584971b717372cd1c0d0b0~mv2.jpg', gallery: EU_GALLERY_GENERAL, tagline: 'From Paris to Rome — the grand sweep of European discovery', basePrice: 110000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,...AMSTERDAM_HOTELS,...BRUSSELS_HOTELS,...FRANKFURT_HOTELS,...INTERLAKEN_HOTELS], travelerTypes: ['Couples','Family','Seniors','Friends'], themes: ['Away & Beyond'], exCities: ALL_CITIES, starRating: 4, hasPrice: false, highlights: EU_H_GRAND, inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [
    { day: 1, title: 'Arrive in Paris | Paris by Night', description: 'Arrive at Paris CDG Airport and transfer to your hotel. Evening Paris Illumination Tour — the City of Lights in all its glory.', hotel: 'Paris Hotel (4★)', meals: ['Dinner'] },
    { day: 2, title: 'Paris City Tour | Eiffel Tower 3rd Level | Seine Cruise', description: 'Guided city tour — Place Vendôme, Opéra Garnier, Champs-Élysées, Arc de Triomphe. Ascend Eiffel Tower to the 3rd Level. Scenic Seine River Cruise.', hotel: 'Paris Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 3, title: 'Disneyland Paris', description: 'Full day at Disneyland Paris — choose between Disneyland Park or Walt Disney Studios Park.', hotel: 'Paris Hotel (4★)', meals: ['Breakfast','Packed Lunch','Dinner'] },
    { day: 4, title: 'Mini-Europe | Atomium | Brussels | Grand Place', description: 'Visit Mini-Europe and the Atomium in Brussels. Explore Grand Place and Manneken Pis. Proceed to the Netherlands.', hotel: 'Netherlands Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 5, title: 'Zaanse Schans | Amsterdam Canal Cruise', description: 'Dutch heritage at Zaanse Schans — windmills, cheese and clogs. Amsterdam Canal Cruise. Proceed to Germany.', hotel: 'Germany Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 6, title: 'Black Forest | Rhine Falls', description: 'Black Forest, Cuckoo Clock, Lake Titisee. Boat ride at the magnificent Rhine Falls.', hotel: 'Switzerland Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 7, title: 'Jungfraujoch — Top of Europe', description: 'Leisure time in Interlaken then the spectacular journey to Jungfraujoch at 11,333 feet via Eiger Express and cogwheel train. Ice Palace and Sphinx Observatory.', hotel: 'Switzerland Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 8, title: 'Mt. Titlis | Lucerne', description: 'Mt. Titlis at 3,020m via Rotair cable car. Titlis Cliff Walk. Orientation tour of Lucerne.', hotel: 'Switzerland Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 9, title: 'Vaduz | Swarovski Crystal Museum | Innsbruck', description: 'City Train Ride in Vaduz. Swarovski Crystal Museum. Orientation tour of Innsbruck.', hotel: 'Tyrol Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 10, title: 'Venice — Gondola Ride', description: 'Private boat to St. Mark\'s Square, Venice. Walking tour. Romantic Gondola ride through the canals.', hotel: 'Padova Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 11, title: 'Pisa | Florence', description: 'Leaning Tower of Pisa. Florence — Piazzale Michelangelo with panoramic city views.', hotel: 'Tuscany Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 12, title: 'Rome City Tour | Vatican', description: 'Guided Rome city tour — Colosseum photo stop, Trevi Fountain, St. Peter\'s Basilica and Vatican City.', hotel: 'Rome Hotel (4★)', meals: ['Breakfast','Lunch','Dinner'] },
    { day: 13, title: 'Departure', description: 'After breakfast, transfer to the airport for your onward flight home.', hotel: '', meals: ['Breakfast'] },
  ] },
  { id: 'eu-07', name: 'Gems of Europe', nights: 8, days: 9, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4cba10d5137ff4cdb80489121f66d6ab7', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80', gallery: EU_GALLERY_GENERAL, tagline: 'Eiffel Tower, Disneyland, windmills and Alpine peaks in one perfect tour', basePrice: 78000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,...AMSTERDAM_HOTELS,...BRUSSELS_HOTELS], travelerTypes: ['Couples','Family','Friends'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 3, hasPrice: false, highlights: ['Paris by Night Illumination Tour','Eiffel Tower 3rd Level panoramic views','Full-day Disneyland Paris adventure','Mini-Europe and Atomium in Brussels','Zaanse Schans Dutch windmills, cheese and clogs','Scenic Amsterdam Canal Cruise','Rhine Falls boat ride — Europe\'s largest waterfall','Mt. Titlis via Rotair revolving cable car','Jungfraujoch — Top of Europe at 11,333 feet'], inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-08', name: 'Essence of Europe', nights: 7, days: 8, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5d03f6defc38ef43bc9cedf72937733163', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80', gallery: EU_GALLERY_ROME, tagline: 'Venice canals, Pisa, Florence and Rome — Italy and the Alps in eight days', basePrice: 78000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...ROME_HOTELS,...FLORENCE_HOTELS,...VENICE_HOTELS], travelerTypes: ['Couples','Honeymoon','Seniors'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 3, hasPrice: false, highlights: EU_H_ALPS, inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-09', name: 'Europe for All', nights: 12, days: 13, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5d8f095085adee4e7b927ba6630c53c0b1', img: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&q=80', gallery: EU_GALLERY_GENERAL, tagline: 'A comfortable, classic European journey designed for every traveller', basePrice: 110000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,...AMSTERDAM_HOTELS,...ZURICH_HOTELS,...ROME_HOTELS], travelerTypes: ['Family','Seniors','Couples'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 3, hasPrice: false, highlights: EU_H_GRAND, inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-10', name: 'European Dhamaka', nights: 8, days: 9, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh412f5c88ff68b430d96732cd7971822e9', img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=600&q=80', gallery: EU_GALLERY_GENERAL, tagline: 'Paris, Brussels, Amsterdam and Switzerland — Europe\'s greatest hits', basePrice: 78000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,...AMSTERDAM_HOTELS,...BRUSSELS_HOTELS], travelerTypes: ['Family','Friends','Couples'], themes: ['Away & Beyond'], exCities: ALL_CITIES, starRating: 3, hasPrice: false, highlights: ['Eiffel Tower 2nd Level — iconic views of Paris','Scenic Seine River Cruise past Paris landmarks','Atomium photo stop in Brussels','Grand Place — one of Europe\'s most stunning medieval squares','Zaanse Schans — Dutch windmills, cheese and clogs','Amsterdam Canal Cruise','Cologne Cathedral — one of Europe\'s largest Gothic churches','Rhine Falls — Europe\'s largest waterfall','Mt. Titlis via Rotair — the world\'s first revolving cable car'], inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-11', name: 'European Glimpses', nights: 8, days: 9, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh46fa49e557c004f21bfb3898691f69d45', img: 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=600&q=80', gallery: EU_GALLERY_PARIS, tagline: 'Eight unforgettable days through the heart of Western Europe', basePrice: 78000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,...AMSTERDAM_HOTELS,...FRANKFURT_HOTELS], travelerTypes: ['Couples','Friends'], themes: ['Moments Away'], exCities: ALL_CITIES, starRating: 3, hasPrice: false, highlights: EU_H_ALPS, inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-13', name: 'European Dream', nights: 12, days: 13, region: 'europe', workdriveUrl: 'https://workdrive.zohoexternal.in/file/eo49d436f80f6e02d47a5bdb93c5a1bb958e0', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', gallery: EU_GALLERY_GENERAL, tagline: 'Twelve nights, four countries, a lifetime of memories', basePrice: 110000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: EU_DEPARTURES, singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,...AMSTERDAM_HOTELS,...PRAGUE_HOTELS,...VIENNA_HOTELS], travelerTypes: ['Couples','Family','Friends','Seniors'], themes: ['Away & Beyond'], exCities: ALL_CITIES, starRating: 4, hasPrice: false, highlights: EU_H_GRAND, inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [] },
  { id: 'eu-16', name: 'East European Delights', nights: 7, days: 8, region: 'europe', workdriveUrl: 'https://drive.google.com/file/d/1i9KSLh3TSQ0Qz2q5pUTnH_aMHLgyMEqB/view', img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80', gallery: EU_GALLERY_GENERAL, tagline: 'Palaces, castles and fairy-tale villages across Central Europe', basePrice: 78000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: [{date:'2026-09-10',status:'available'},{date:'2026-10-16',status:'available'}], singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...VIENNA_HOTELS,{city:'Budapest',name:'Hotel Budapest or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast'},{city:'Flachau Area',name:'Hotel Flachau or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast'},...PRAGUE_HOTELS,{city:'Munich',name:'Hotel Munich or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast'}], travelerTypes: ['Couples','Family','Friends','Seniors'], themes: ['Away & Beyond'], exCities: ALL_CITIES, starRating: 4, hasPrice: false, highlights: ['Schönbrunn Palace — historic summer residence of the Habsburg rulers in Vienna','Guided City Tour of Budapest — Buda Castle, Hungarian Parliament and Heroes\' Square','Scenic Danube River Cruise with stunning views of Budapest\'s iconic skyline','Charming riverside town of Szentendre — artistic vibe and colourful streets','Guided sightseeing of Prague — Prague Castle, Charles Bridge and Astronomical Clock','Kutná Hora excursion — medieval charm and architectural heritage','Guided City Tour of Salzburg — Mozart\'s birthplace — Mirabell Palace and Hohensalzburg Fortress','Storybook alpine village of Hallstatt set against a serene mountain lake','Dachstein Glacier by cable car — Ice Palace and Suspension Bridge experience'], inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [
    {day:1,title:'Arrive in Vienna',description:'Arrive in Vienna, where imperial grandeur meets classical art and musical heritage. Meet your Tour Manager and proceed to hotel. Evening at leisure. Dinner.',hotel:'Hotel Schani Wien (4★)',meals:['Dinner']},
    {day:2,title:'Vienna | Schönbrunn Palace | Drive to Budapest',description:'Guided city tour of Vienna. Visit Schönbrunn Palace — historic summer residence of the Habsburg rulers. Drive to Budapest.',hotel:'Hotel Budapest (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Budapest | Danube River Cruise | Szentendre',description:'Guided city tour of Budapest — Buda Castle, Hungarian Parliament, Heroes\' Square. Danube River Cruise. Visit charming Szentendre.',hotel:'Hotel Budapest (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Bratislava | Drive to Prague',description:'Orientation tour of Bratislava — Bratislava Castle and Old Town. Drive to Prague.',hotel:'Hotel Don Giovanni Prague (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:5,title:'Prague | Prague Castle | Charles Bridge | Kutná Hora',description:'Guided sightseeing of Prague — Prague Castle, Charles Bridge, Old Town Square and Astronomical Clock. Excursion to Kutná Hora.',hotel:'Hotel Don Giovanni Prague (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:6,title:'Salzburg | Hallstatt | Dachstein Glacier',description:'Guided City Tour of Salzburg. Drive to Hallstatt — picturesque alpine village. Dachstein Glacier via cable car — Ice Palace and Suspension Bridge. Drive to Munich.',hotel:'Hotel Munich (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Munich | Free Time | Airport Transfer',description:'Morning free time in Munich to explore the Bavarian capital at leisure.',hotel:'Hotel Munich (4★)',meals:['Breakfast']},
    {day:8,title:'Departure from Munich',description:'After breakfast, check out and transfer to Munich Airport for your return flight.',hotel:'',meals:['Breakfast']},
  ] },
  { id: 'eu-17', name: 'Paris & Amsterdam Escape', nights: 5, days: 6, region: 'europe', workdriveUrl: 'https://drive.google.com/file/d/1CMlkRUjsg5Qkq5OlmzkhoB3htCYPnGkH/view', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', gallery: EU_GALLERY_PARIS, tag: 'YOUTH', tagline: 'Paris and Amsterdam — the ultimate European escape for young explorers', basePrice: 78000, currency: 'INR', singlePrice: undefined, tacAdult: 0, tacChild: 0, departures: [{date:'2026-10-02',status:'available'},{date:'2026-10-17',status:'available'},{date:'2026-11-06',status:'available'},{date:'2026-11-21',status:'available'},{date:'2026-12-25',status:'available'}], singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS, hotels: [...PARIS_HOTELS,{city:'Amsterdam',name:'NH Amsterdam Centre or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast'}], travelerTypes: ['Friends','Couples'], themes: ['Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: false, highlights: ['Seine River Cruise and Paris Illumination Tour on arrival night','Guided orientation tour of Paris — Champs-Élysées and Arc de Triomphe','Eiffel Tower 3rd Level — breathtaking panoramic views of the city','Optional full-day adventure at Disneyland Paris','Grand-Place Brussels — magnificent medieval architecture','Amsterdam Canal Cruise through iconic waterways','Heineken Experience — interactive brewery tour','Zaanse Schans — Dutch windmills, cheese tasting and clog-making','Amsterdam Pub Crawling Tour — vibrant city nightlife'], inclusions: EU_INCL, exclusions: EU_EXCL, itinerary: [
    {day:1,title:'Arrive in Paris | Seine Cruise | Paris by Night',description:'Arrive in Paris and transfer to hotel. Evening Seine River Cruise past illuminated landmarks. Paris Illumination Tour.',hotel:'Ibis Paris Porte de Clichy (3★)',meals:['Dinner']},
    {day:2,title:'Paris | Guided Tour | Eiffel Tower 3rd Level | Free Time',description:'Guided city orientation — Champs-Élysées, Arc de Triomphe. Eiffel Tower 3rd Level. Rest of day free to explore Paris at your own pace.',hotel:'Ibis Paris Porte de Clichy (3★)',meals:['Breakfast','Dinner']},
    {day:3,title:'Optional Disneyland Paris | Day at Leisure',description:'Day free to explore Paris. Optional full-day Disneyland Paris — One Day One Park.',hotel:'Ibis Paris Porte de Clichy (3★)',meals:['Breakfast','Dinner']},
    {day:4,title:'Paris — Brussels — Amsterdam',description:'Drive to Netherlands via Brussels. Stop at Grand-Place in Brussels. Arrive Amsterdam — free time at Dam Square.',hotel:'NH Amsterdam Centre (4★)',meals:['Breakfast','Dinner']},
    {day:5,title:'Amsterdam Canal Cruise | Heineken Experience | Zaanse Schans | Pub Crawl',description:'Amsterdam Canal Cruise. Heineken Experience brewery tour. Zaanse Schans — windmills, cheese and clogs. Evening Amsterdam Pub Crawling Tour.',hotel:'NH Amsterdam Centre (4★)',meals:['Breakfast','Dinner']},
    {day:6,title:'Departure from Amsterdam',description:'After breakfast, check out and transfer to Amsterdam Airport Schiphol for your return flight.',hotel:'',meals:['Breakfast']},
  ] },
  // AFRICA
  { id: 'af-10', name: 'South African Splendour', nights: 9, days: 10, region: 'africa', workdriveUrl: 'https://drive.google.com/file/d/1BA-mhnfQXO4xWtwtLSW-UofkyocYvniW/view', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=85', gallery: SA_GALLERY, tag: 'NEW', tagline: 'Table Mountain, Big Five safaris and the Cape — South Africa at its finest', basePrice: 299999, currency: 'INR', singlePrice: 359999, tacAdult: 15000, tacChild: 8000, childWithBedPrice: 189999, childWithoutBedPrice: undefined, departures: [{date:'2026-10-09',status:'available'},{date:'2026-11-13',status:'available'}], singleSupplement: 60000, tripleReduction: 5000, addOns: AF_ADDONS, hotels: [{city:'Cape Town',name:'Cresta Grande Cape Town or similar',stars:4,nights:3,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Garden Route',name:'Diaz Hotel & Resort or similar',stars:4,nights:3,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Sun City',name:'Sun City Resort or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Johannesburg',name:'The Catalyst Hotel or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast & Dinner'}], travelerTypes: ['Couples','Family','Friends'], themes: ['Beast & Beyond','Away & Beyond'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Ascend Table Mountain by Cable Car — panoramic views of Cape Town','Cape Peninsula Tour — Seal Island Cruise, Chapman\'s Peak and Cape of Good Hope','Boulders Beach Penguin Colony — African Penguins','Wine Tasting at Benguela Cove Wine Estate','Cango Caves and Safari Ostrich Farm in Oudtshoorn','Stay at the world-famous Sun City Resort','Pilanesberg National Park Game Drive — Big Five wildlife','Gold Reef City and Johannesburg Orientation Tour'], inclusions: AF_SA_INCL, exclusions: AF_SA_EXCL, itinerary: [
    {day:1,title:'Arrive in Cape Town',description:'Welcome to South Africa! Arrive at Cape Town International Airport. Transfer to hotel. Takeaway dinner arranged for late arrivals.',hotel:'Cresta Grande Cape Town (4★)',meals:['Dinner']},
    {day:2,title:'Cape Town City Tour | Table Mountain | V&A Waterfront',description:'Orientation tour of Cape Town. Ascend iconic Table Mountain by Cable Car (weather permitting) for panoramic views. Victoria & Alfred Waterfront.',hotel:'Cresta Grande Cape Town (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Cape Peninsula | Seal Island Cruise | Boulders Beach | Cape Point',description:'Full-day Cape Peninsula Tour. Seal Island Cruise, Chapman\'s Peak Drive, Boulders Beach Penguin Colony. Flying Dutchman Funicular to Cape Point. Cape of Good Hope.',hotel:'Cresta Grande Cape Town (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Cape Town — Hermanus — Garden Route | Wine Tasting',description:'Wine Tasting at Benguela Cove Wine Estate. Visit scenic coastal Hermanus. Continue towards the Garden Route.',hotel:'Diaz Hotel & Resort (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:5,title:'Oudtshoorn — Cango Caves | Safari Ostrich Farm | Cango Wildlife Ranch',description:'Magnificent Cango Caves. Safari Ostrich Farm — the Ostrich Capital of the World. Cango Wildlife Ranch.',hotel:'Diaz Hotel & Resort (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:6,title:'Garden Route — Day at Leisure',description:'Day at leisure in the beautiful Garden Route. Optional: Bungee Jumping, Skydiving, Ziplining (additional cost).',hotel:'Diaz Hotel & Resort (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Garden Route — Johannesburg — Sun City',description:'Fly to Johannesburg and proceed to the world-famous Sun City Resort. Day free to enjoy resort facilities.',hotel:'Sun City Resort (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:8,title:'Pilanesberg National Park Game Drive',description:'Exciting Game Drive at Pilanesberg National Park — Big Five: Lion, Leopard, Elephant, Rhino and Buffalo.',hotel:'Sun City Resort (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:9,title:'Johannesburg — Orientation Tour | Gold Reef City',description:'Johannesburg Orientation Tour. Visit the famous Gold Reef City — inspired by gold-mining heritage.',hotel:'The Catalyst Hotel (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:10,title:'Departure from Johannesburg',description:'After breakfast, transfer to Johannesburg Airport for your return flight.',hotel:'',meals:['Breakfast']},
  ], flights: {
    included: true, exCity: 'Mumbai',
    departurewise: [
      { departureDate: '2026-10-09', segments: [
        { flightNo: 'MK 102', airline: 'Air Mauritius', sector: 'BOM → MRU', depTime: '08:35', arrTime: '13:15', depDate: '09 Oct' },
        { flightNo: 'MK 845', airline: 'Air Mauritius', sector: 'MRU → CPT', depTime: '15:00', arrTime: '19:10', depDate: '09 Oct' },
        { flightNo: 'MK 846', airline: 'Air Mauritius', sector: 'JNB → MRU', depTime: '20:00', arrTime: '23:55', depDate: '18 Oct' },
        { flightNo: 'MK 101', airline: 'Air Mauritius', sector: 'MRU → BOM', depTime: '22:40', arrTime: '06:35+1', depDate: '19 Oct' },
      ]},
      { departureDate: '2026-11-13', segments: [
        { flightNo: 'MK 102', airline: 'Air Mauritius', sector: 'BOM → MRU', depTime: '08:35', arrTime: '13:15', depDate: '13 Nov' },
        { flightNo: 'MK 845', airline: 'Air Mauritius', sector: 'MRU → CPT', depTime: '15:00', arrTime: '19:10', depDate: '13 Nov' },
        { flightNo: 'MK 846', airline: 'Air Mauritius', sector: 'JNB → MRU', depTime: '20:00', arrTime: '23:55', depDate: '22 Nov' },
        { flightNo: 'MK 101', airline: 'Air Mauritius', sector: 'MRU → BOM', depTime: '22:45', arrTime: '06:35+1', depDate: '23 Nov' },
      ]},
    ]
  }},
  { id: 'af-11', name: 'Mystical Egypt', nights: 8, days: 9, region: 'africa', workdriveUrl: 'https://drive.google.com/file/d/1q6Ki7-OM6QxkskweBbkxjzEWTufM8A5V/view', img: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6c?w=800&q=85', gallery: EGYPT_GALLERY, tag: 'NEW', tagline: 'Pyramids, Nile cruises and Red Sea beaches — Egypt\'s greatest wonders', basePrice: 199999, currency: 'INR', singlePrice: 259999, tacAdult: 15000, tacChild: 8000, childWithBedPrice: 156999, childWithoutBedPrice: 134999, departures: [{date:'2026-10-13',status:'available'},{date:'2026-11-10',status:'available'},{date:'2026-12-15',status:'available'}], singleSupplement: 60000, tripleReduction: 5000, addOns: AF_ADDONS, hotels: [{city:'Cairo',name:'Novotel 6 October Hotel or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Cairo–Aswan Sleeper Train',name:'Onboard Sleeper Train',stars:3,nights:1,roomType:'Sleeper Cabin',meal:'Dinner & Breakfast'},{city:'Nile Cruise',name:'Semiramis / Commodore or similar',stars:4,nights:3,roomType:'Standard Cabin',meal:'Full Board'},{city:'Hurghada',name:'Pharaoh Azur Hurgada or similar',stars:4,nights:2,roomType:'Standard Room',meal:'All Inclusive'}], travelerTypes: ['Couples','Family','Friends','Seniors'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Pyramids of Giza and the iconic Great Sphinx','Grand Egyptian Museum — world\'s largest Egyptian antiquities collection','Alexandria — Catacombs, Roman Amphitheatre and Qaitbay Citadel','Overnight Sleeper Train from Cairo to Aswan','Luxurious 3-Night Nile River Cruise through Ancient Egypt','Abu Simbel Temples — Egypt\'s greatest archaeological masterpiece','Valley of the Kings, Temple of Queen Hatshepsut and Karnak Temple','Red Sea relaxation in beautiful Hurghada'], inclusions: AF_EG_INCL, exclusions: AF_EG_EXCL, itinerary: [
    {day:1,title:'Arrive in Cairo',description:'Welcome to the land of the Pharaohs! Arrive at Cairo International Airport. Transfer to hotel. Indian dinner.',hotel:'Novotel 6 October (4★)',meals:['Dinner']},
    {day:2,title:'Alexandria Excursion',description:'Drive to Alexandria. Catacombs of Kom El Shoqafa, Pompey\'s Pillar, Roman Amphitheatre, Qaitbay Citadel photo stop. Return to Cairo.',hotel:'Novotel 6 October (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Pyramids of Giza | Grand Egyptian Museum | Overnight Train',description:'Legendary Pyramids of Giza and Great Sphinx. Grand Egyptian Museum. Board overnight Sleeper Train to Aswan.',hotel:'Sleeper Train',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Aswan | Philae Temple | Nile Cruise Embarkation',description:'Philae Temple and Aswan High Dam. Board luxurious Nile River Cruise.',hotel:'Nile Cruise (4★)',meals:['Breakfast Box','Lunch','Dinner']},
    {day:5,title:'Abu Simbel | Kom Ombo Temple',description:'Early morning excursion to magnificent Abu Simbel Temples. Sail to Kom Ombo Temple and Crocodile Museum.',hotel:'Nile Cruise (4★)',meals:['Breakfast Box','Lunch','Dinner']},
    {day:6,title:'Edfu Temple | Esna Lock | Luxor Temple',description:'Horse Carriage Ride to Temple of Edfu. Sail through the famous Esna Lock. Arrive in Luxor and visit Luxor Temple.',hotel:'Nile Cruise (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Luxor West Bank | Valley of the Kings | Hurghada',description:'Valley of the Kings, Temple of Queen Hatshepsut, Colossi of Memnon. Karnak Temple Complex. Travel to Hurghada.',hotel:'Pharaoh Azur Hurgada (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:8,title:'Leisure in Hurghada',description:'Day at leisure at your Hurghada resort. Relax on the beach, enjoy the pool or optional water sports.',hotel:'Pharaoh Azur Hurgada (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:9,title:'Departure from Cairo',description:'After breakfast, travel to Cairo International Airport for your return flight.',hotel:'',meals:['Breakfast','Packed Lunch']},
  ], flights: {
    included: true, exCity: 'Mumbai',
    departurewise: [
      { departureDate: '2026-10-13', segments: [
        { flightNo: 'RJ 191', airline: 'Royal Jordanian', sector: 'BOM → AMM', depTime: '05:15', arrTime: '09:10', depDate: '13 Oct' },
        { flightNo: 'RJ 107', airline: 'Royal Jordanian', sector: 'AMM → CAI', depTime: '10:20', arrTime: '11:30', depDate: '13 Oct' },
        { flightNo: 'RJ 108', airline: 'Royal Jordanian', sector: 'CAI → AMM', depTime: '12:30', arrTime: '14:30', depDate: '22 Oct' },
        { flightNo: 'RJ 192', airline: 'Royal Jordanian', sector: 'AMM → BOM', depTime: '20:30', arrTime: '04:00+1', depDate: '22 Oct' },
      ]},
      { departureDate: '2026-11-10', segments: [
        { flightNo: 'RJ 191', airline: 'Royal Jordanian', sector: 'BOM → AMM', depTime: '05:15', arrTime: '09:10', depDate: '10 Nov' },
        { flightNo: 'RJ 107', airline: 'Royal Jordanian', sector: 'AMM → CAI', depTime: '10:20', arrTime: '11:30', depDate: '10 Nov' },
        { flightNo: 'RJ 108', airline: 'Royal Jordanian', sector: 'CAI → AMM', depTime: '12:30', arrTime: '14:30', depDate: '19 Nov' },
        { flightNo: 'RJ 192', airline: 'Royal Jordanian', sector: 'AMM → BOM', depTime: '20:30', arrTime: '04:00+1', depDate: '19 Nov' },
      ]},
      { departureDate: '2026-12-15', segments: [
        { flightNo: 'RJ 191', airline: 'Royal Jordanian', sector: 'BOM → AMM', depTime: '05:15', arrTime: '09:10', depDate: '15 Dec' },
        { flightNo: 'RJ 107', airline: 'Royal Jordanian', sector: 'AMM → CAI', depTime: '10:20', arrTime: '11:30', depDate: '15 Dec' },
        { flightNo: 'RJ 108', airline: 'Royal Jordanian', sector: 'CAI → AMM', depTime: '12:30', arrTime: '14:30', depDate: '24 Dec' },
        { flightNo: 'RJ 192', airline: 'Royal Jordanian', sector: 'AMM → BOM', depTime: '20:30', arrTime: '04:00+1', depDate: '24 Dec' },
      ]},
    ]
  }},
  // ASIA
  { id: 'as-01', name: 'Japan Autumn Discovery', nights: 8, days: 9, region: 'asia', workdriveUrl: 'https://drive.google.com/file/d/1eltBZgAlqLL9HYf-WIeHfnb1_fNOtHOD/view', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=85', gallery: JAPAN_GALLERY, tag: 'NEW', tagline: 'Bullet trains, Buddhist temples and neon-lit nights across Japan in autumn', basePrice: 249999, currency: 'INR', singlePrice: 327999, tacAdult: 17000, tacChild: 10000, childWithBedPrice: 196999, childWithoutBedPrice: 177999, departures: [{date:'2026-10-22',status:'available'}], singleSupplement: 77000, tripleReduction: 8000, addOns: ASIA_ADDONS, hotels: [{city:'Narita',name:'ANA Crowne Plaza or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Dinner'},{city:'Tokyo',name:'1955 Tokyo Bay by Hoshino Resorts or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Nagoya',name:'Nagoya Tokyu Hotel or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Hiroshima',name:'Vessel Hotel Hiroshima or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Osaka',name:'Hotel Righa Royal or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Kansai',name:'Hotel Nikko Kansai or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast'}], travelerTypes: ['Couples','Family','Friends'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Senso-ji Temple — Tokyo\'s oldest and most celebrated Buddhist temple','Tokyo Skytree (350m) — spectacular panoramic views of the skyline','TeamLab Planets — immersive digital art of light, water and interactive installations','UNESCO Toshogu Shrine in Nikko and spectacular Kegon Waterfall','Shinkansen Bullet Train on three exciting sectors','Miyajima Island — Itsukushima Shrine and the iconic Floating Torii Gate','Hiroshima Peace Memorial Museum and Atomic Bomb Dome','Arashiyama Bamboo Grove and Kinkaku-ji Golden Pavilion in Kyoto','Nara Deer Park and Todai-ji Temple — home to Japan\'s Great Buddha','Osaka Castle, Umeda Sky Building and vibrant Dotonbori District'], inclusions: AS_JP_INCL, exclusions: AS_JP_EXCL, itinerary: [
    {day:1,title:'Arrival in Narita',description:'Welcome to Japan. Arrive at Narita International Airport, complete immigration and transfer to your hotel.',hotel:'ANA Crowne Plaza Narita (4★)',meals:['Dinner']},
    {day:2,title:'Narita — Tokyo | Senso-ji Temple | Tokyo Skytree | TeamLab Planets',description:'Visit the iconic Senso-ji Temple and Nakamise Dori shopping street. Ascend the Tokyo Skytree (350m Observatory). Visit TeamLab Planets — extraordinary immersive digital art.',hotel:'1955 Tokyo Bay (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Tokyo — Nikko | Toshogu Shrine | Kegon Waterfall',description:'Excursion to Nikko. UNESCO Toshogu Shrine with exquisite carvings. Spectacular Kegon Waterfall cascading nearly 100 metres. Return to Tokyo.',hotel:'1955 Tokyo Bay (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Tokyo — Hakone — Mt. Fuji — Nagoya',description:'Lake Ashi Pirate Cruise. Hakone Ropeway over Owakudani volcanic landscapes. Mt. Fuji 5th Station (weather permitting). Shinkansen Bullet Train to Nagoya.',hotel:'Nagoya Tokyu Hotel (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:5,title:'Nagoya — SCMAGLEV Railway Park — Toyota Museum — Hiroshima',description:'SCMAGLEV & Railway Park. Toyota Commemorative Museum. Shinkansen to Hiroshima.',hotel:'Vessel Hotel Hiroshima (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:6,title:'Miyajima Island | Hiroshima Peace Memorial | Osaka',description:'Ferry to Miyajima — Itsukushima Shrine and Floating Torii Gate. Atomic Bomb Dome, Peace Memorial Museum and Park. Shinkansen to Osaka.',hotel:'Hotel Righa Royal Osaka (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Kyoto — Nara | Arashiyama | Golden Pavilion | Nara Deer Park',description:'Arashiyama Bamboo Grove. Kinkaku-ji Temple (Golden Pavilion). Nara Deer Park with hundreds of friendly deer. Todai-ji Temple — Great Buddha. Return to Osaka.',hotel:'Hotel Righa Royal Osaka (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:8,title:'Osaka | Osaka Castle | Umeda Sky Building | Dotonbori',description:'Osaka Castle. Panoramic views from Umeda Sky Building. Shinsaibashi Shopping Street. Vibrant Dotonbori District. Proceed to Kansai.',hotel:'Hotel Nikko Kansai (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:9,title:'Departure from Kansai',description:'After breakfast, transfer to Kansai International Airport for your onward flight.',hotel:'',meals:['Breakfast']},
  ], flights: { included: false, exCity: '', departurewise: [] } },
  { id: 'as-02', name: 'Timeless Japan', nights: 7, days: 8, region: 'asia', workdriveUrl: 'https://drive.google.com/file/d/1SD8EiXLBZQUQbipWr3g4CwiYC02iJC_Q/view', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=85', gallery: JAPAN_GALLERY, tag: 'NEW', tagline: 'Tokyo, Kyoto, Osaka and Fuji — Japan\'s timeless soul in seven nights', basePrice: 237999, currency: 'INR', singlePrice: 315999, tacAdult: 20000, tacChild: 10000, childWithBedPrice: 181999, childWithoutBedPrice: 163999, departures: [{date:'2026-11-15',status:'available'}], singleSupplement: 77000, tripleReduction: 8000, addOns: ASIA_ADDONS, hotels: [{city:'Narita',name:'Hotel Nikko Narita / ANA Crowne Plaza or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Dinner'},{city:'Tokyo',name:'1955 Tokyo Bay / La Vista Tokyo Bay or similar',stars:4,nights:3,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Osaka',name:'Rihga Royal Hotel Osaka or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Kansai',name:'Hotel Nikko Kansai Airport or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast'}], travelerTypes: ['Couples','Family','Friends','Seniors'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Tokyo Skytree (350m Observatory) — breathtaking panoramic city views','Sumida River Cruise — unique perspective of Tokyo\'s iconic skyline','TeamLab Planets Tokyo — captivating digital art experience','Lake Ashi Cruise and Hakone Ropeway over Owakudani volcanic landscapes','Mt. Fuji 5th Station (weather permitting)','Shinkansen Bullet Train from Tokyo to Osaka with luggage forwarding','Arashiyama Bamboo Grove and Kinkaku-ji Golden Pavilion in Kyoto','Fushimi Inari Taisha Shrine — thousands of vibrant vermilion torii gates','Nara Deer Park and Todai-ji Temple — home to Japan\'s Great Buddha','Osaka Castle, Shinsaibashi Shopping Street and Dotonbori District'], inclusions: AS_JP_INCL, exclusions: AS_JP_EXCL, itinerary: [
    {day:1,title:'Arrival in Narita',description:'Arrive at Narita International Airport and transfer to your hotel.',hotel:'Hotel Nikko Narita (4★)',meals:['Dinner']},
    {day:2,title:'Narita — Tokyo | Tokyo Skytree | Sumida River Cruise | TeamLab Planets',description:'Tokyo Skytree (350m Observatory). Scenic Sumida River Cruise. teamLab Planets — immersive digital art.',hotel:'1955 Tokyo Bay (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Tokyo — Mt. Fuji — Hakone — Tokyo',description:'Lake Ashi Cruise. Hakone Ropeway over Owakudani Valley. Mt. Fuji 5th Station (weather permitting). Return to Tokyo.',hotel:'1955 Tokyo Bay (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Tokyo — Leisure | Optional Disneyland',description:'Day at leisure in Tokyo. Shopping or optional Tokyo Disneyland (additional cost).',hotel:'1955 Tokyo Bay (4★)',meals:['Breakfast','Dinner']},
    {day:5,title:'Tokyo — Osaka | Shinkansen | Shinsaibashi | Dotonbori',description:'Shinkansen Bullet Train to Osaka with complimentary luggage forwarding. Shinsaibashi Shopping Street and Dotonbori District.',hotel:'Rihga Royal Hotel Osaka (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:6,title:'Kyoto | Arashiyama Bamboo Grove | Kinkaku-ji | Fushimi Inari',description:'Arashiyama Bamboo Grove. Kinkaku-ji Temple (Golden Pavilion). Fushimi Inari Taisha Shrine — thousands of vibrant vermilion torii gates. Return to Osaka.',hotel:'Rihga Royal Hotel Osaka (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Nara | Nara Deer Park | Todai-ji Temple | Osaka Castle',description:'Nara Deer Park. Todai-ji Temple — Great Buddha. Osaka Castle photo stop. Proceed to Kansai.',hotel:'Hotel Nikko Kansai (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:8,title:'Departure from Kansai',description:'After breakfast, transfer to Kansai International Airport for your return flight.',hotel:'',meals:['Breakfast']},
  ], flights: { included: false, exCity: '', departurewise: [] } },
  { id: 'as-03', name: 'Grand Türkiye', nights: 10, days: 11, region: 'asia', workdriveUrl: 'https://drive.google.com/file/d/1yVHfwcYSkO6ewI__IBonn9IzmcsKQDCN/view', img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=85', gallery: TURKEY_GALLERY, tag: 'NEW', tagline: 'Grand Bazaar to Cappadocia — ten nights through Turkey\'s ancient and modern wonders', basePrice: 214999, currency: 'INR', singlePrice: 267999, tacAdult: 15000, tacChild: 8000, childWithBedPrice: 142999, childWithoutBedPrice: undefined, departures: [{date:'2026-11-10',status:'available'}], singleSupplement: 52000, tripleReduction: 6000, addOns: ASIA_ADDONS, hotels: [{city:'Istanbul',name:'Wyndham Istanbul Old City Hotel or similar',stars:4,nights:3,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Ankara',name:'Mercure Hotel Kızılay or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Cappadocia',name:'Aleria Hotel or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Antalya',name:'Ring Hotel or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Pamukkale',name:'Adempira Thermal Hotel or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Kusadasi',name:'Odelia Resort Hotel or similar',stars:4,nights:1,roomType:'Standard Room',meal:'Breakfast & Dinner'}], travelerTypes: ['Couples','Family','Friends','Seniors'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Scenic Bosphorus Dinner Cruise with Turkish dinner, live entertainment and Belly Dance','Hagia Sophia, Blue Mosque, Topkapi Palace and Grand Bazaar in Istanbul','ATV Ride through the fairy chimneys of magical Cappadocia','Cappadocia Red Tour — Devrent Valley, Love Valley, Paşabağ and Zelve','UNESCO Hierapolis and spectacular Pamukkale Travertine Terraces (Cotton Castle)','Ancient city of Ephesus — Library of Celsus, Grand Theatre and House of Virgin Mary','Temple of Artemis — one of the Seven Wonders of the Ancient World','Bursa — first Ottoman capital — Uludağ Cable Car and Green Mosque'], inclusions: AS_TR_INCL, exclusions: AS_TR_EXCL, itinerary: [
    {day:1,title:'Arrive in Istanbul | Bosphorus Dinner Cruise',description:'Arrive at Istanbul Airport. Evening Bosphorus Dinner Cruise. Turkish dinner with live folk performances and Belly Dance.',hotel:'Wyndham Istanbul Old City (4★)',meals:['Dinner']},
    {day:2,title:'Istanbul | Hagia Sophia | Blue Mosque | Topkapi Palace | Grand Bazaar',description:'Visit Hagia Sophia and Blue Mosque. Historic Hippodrome and Topkapi Palace. Shopping at the Grand Bazaar.',hotel:'Wyndham Istanbul Old City (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Istanbul — Ankara | Anıtkabir | Ankara City Tour',description:'Drive to Ankara. Visit Anıtkabir — mausoleum of Mustafa Kemal Atatürk. Panoramic city tour.',hotel:'Mercure Hotel Kızılay (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Ankara — Cappadocia | ATV Ride | Sunset Experience',description:'Drive to magical Cappadocia. Exciting ATV Ride through fairy chimneys and valleys. Breathtaking sunset.',hotel:'Aleria Hotel Cappadocia (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:5,title:'Cappadocia Red Tour | Devrent Valley | Love Valley | Zelve',description:'Cappadocia Red Tour — Devrent Valley, Love Valley, Paşabağ, Zelve Open Air Museum, Avanos pottery and Uçhisar Castle.',hotel:'Aleria Hotel Cappadocia (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:6,title:'Cappadocia — Konya — Antalya | Taurus Mountains',description:'Visit Konya — spiritual home of Mevlana Rumi. Drive through spectacular Taurus Mountains to Antalya.',hotel:'Ring Hotel Antalya (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Antalya | Kaleiçi Old Town | Hadrian\'s Gate | Düden Waterfalls',description:'Explore charming Kaleiçi Old Town. Visit Hadrian\'s Gate, Clock Tower and picturesque Düden Waterfalls.',hotel:'Ring Hotel Antalya (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:8,title:'Pamukkale | Hierapolis | Travertine Terraces',description:'UNESCO Hierapolis — Roman Bath Complex and Archaeological Museum. Spectacular white Pamukkale Travertine Terraces.',hotel:'Adempira Thermal Hotel (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:9,title:'Ephesus | Library of Celsus | House of Virgin Mary | Temple of Artemis',description:'Ancient city of Ephesus — Library of Celsus, Grand Theatre and Marble Streets. House of the Virgin Mary. Temple of Artemis photo stop. Free time in Kuşadası.',hotel:'Odelia Resort Hotel Kusadasi (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:10,title:'Bursa | Uludağ Cable Car | Green Mosque | Istanbul',description:'Bursa — first Ottoman capital. Cable Car to Uludağ Mountain. Historic Green Mosque. Continue to Istanbul.',hotel:'Wyndham Istanbul Old City (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:11,title:'Departure from Istanbul',description:'After breakfast, transfer to Istanbul Airport for your onward flight.',hotel:'',meals:['Breakfast']},
  ], flights: {
    included: true, exCity: 'Mumbai',
    departurewise: [
      { departureDate: '2026-11-10', segments: [
        { flightNo: 'RJ 191', airline: 'Royal Jordanian', sector: 'BOM → AMM', depTime: '05:15', arrTime: '09:10', depDate: '10 Nov' },
        { flightNo: 'RJ 165', airline: 'Royal Jordanian', sector: 'AMM → IST', depTime: '10:20', arrTime: '13:05', depDate: '10 Nov' },
        { flightNo: 'RJ 166', airline: 'Royal Jordanian', sector: 'IST → AMM', depTime: '14:05', arrTime: '16:40', depDate: '20 Nov' },
        { flightNo: 'RJ 192', airline: 'Royal Jordanian', sector: 'AMM → BOM', depTime: '20:30', arrTime: '04:00+1', depDate: '20 Nov' },
      ]},
    ]
  }},
  { id: 'as-04', name: 'Vietnam Escapes', nights: 8, days: 9, region: 'asia', workdriveUrl: 'https://drive.google.com/file/d/1NRg9uuboRvNSfLkkV-EobmMvCFq1Queq/view', img: 'https://images.unsplash.com/photo-1570280406792-bf58b7c59247?w=800&q=85', gallery: VIETNAM_GALLERY, tag: 'NEW', tagline: 'Saigon, Da Nang, Hanoi and Halong Bay — Vietnam from south to north', basePrice: 139999, currency: 'INR', singlePrice: 169999, tacAdult: 7000, tacChild: 3000, childWithBedPrice: 122999, childWithoutBedPrice: 101999, departures: [{date:'2026-09-20',status:'available'},{date:'2026-11-11',status:'available'}], singleSupplement: 30000, tripleReduction: 4000, addOns: ASIA_ADDONS, hotels: [{city:'Ho Chi Minh City',name:'Muong Thanh Saigon Hotel or similar',stars:4,nights:2,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Da Nang',name:'Grand Gold Hotel or similar',stars:4,nights:3,roomType:'Standard Room',meal:'Breakfast & Dinner'},{city:'Hanoi',name:'Gloud Hotel or similar',stars:4,nights:3,roomType:'Standard Room',meal:'Breakfast & Dinner'}], travelerTypes: ['Couples','Family','Friends'], themes: ['Away & Beyond','Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Discover South, Central and North Vietnam in one unforgettable holiday','Cu Chi Tunnels — legendary underground wartime network','Mekong Delta Cruise with traditional Sampan Ride','Walk across the world-famous Golden Bridge at Ba Na Hills','Hoi An Ancient Town — UNESCO World Heritage Site','Halong Bay Cruise — spectacular UNESCO-listed limestone formations','Tam Coc — "Halong Bay on Land" — scenic sampan boat ride','Hanoi Old Quarter, Ho Chi Minh Complex and vibrant Train Street'], inclusions: AS_VN_INCL, exclusions: AS_VN_EXCL, itinerary: [
    {day:1,title:'Welcome to Ho Chi Minh City | City Highlights',description:'Arrive in Ho Chi Minh City. Early Check-in. Reunification Palace, Notre Dame Cathedral and the iconic Central Post Office.',hotel:'Muong Thanh Saigon Hotel (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:2,title:'Cu Chi Tunnels | Mekong Delta | Sampan Ride',description:'Cu Chi Tunnels — remarkable underground wartime network. Mekong Delta — Tien River boat ride and Sampan cruise. Coconut Candy Workshop and folk music.',hotel:'Muong Thanh Saigon Hotel (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:3,title:'Ho Chi Minh City — Da Nang | Son Tra Peninsula | Dragon Bridge',description:'Fly to Da Nang. Son Tra Peninsula. Linh Ung Pagoda — 67m Lady Buddha statue. Dragon Bridge and Night Market.',hotel:'Grand Gold Hotel Da Nang (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:4,title:'Ba Na Hills | Cable Car | Golden Bridge | Fantasy Park',description:'Spectacular Ba Na Hills Cable Car. World-famous Golden Bridge. Fantasy Park attractions.',hotel:'Grand Gold Hotel Da Nang (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:5,title:'Marble Mountains | Cam Thanh Coconut Village | Hoi An Ancient Town',description:'Marble Mountains and Huyen Khong Cave. Basket Boat Ride at Cam Thanh Coconut Village. Hoi An Ancient Town — UNESCO World Heritage Site.',hotel:'Grand Gold Hotel Da Nang (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:6,title:'Da Nang — Hanoi | City Tour | Old Quarter | Train Street',description:'Fly to Hanoi. Tran Quoc Pagoda. Ho Chi Minh Complex and One Pillar Pagoda. Hoan Kiem Lake, Old Quarter and Train Street.',hotel:'Gloud Hotel Hanoi (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:7,title:'Ninh Binh | Hoa Lu Ancient Capital | Tam Coc Sampan Ride',description:'Hoa Lu — Vietnam\'s ancient Royal Capital. Tam Coc — sampan ride through limestone cliffs and rice fields.',hotel:'Gloud Hotel Hanoi (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:8,title:'Halong Bay Cruise | Sung Sot Cave | Titop Island',description:'Halong Bay Cruise through hundreds of limestone formations. Sung Sot Cave. Titop Island beach. Kayaking at Luon Cave.',hotel:'Gloud Hotel Hanoi (4★)',meals:['Breakfast','Lunch','Dinner']},
    {day:9,title:'Departure from Hanoi',description:'Morning at leisure for shopping. Transfer to Noi Bai International Airport for your return flight.',hotel:'',meals:['Breakfast','Lunch']},
  ], flights: {
    included: true, exCity: 'Mumbai',
    departurewise: [
      { departureDate: '2026-09-20', segments: [
        { flightNo: 'VJ 884', airline: 'VietJet Air', sector: 'BOM → SGN', depTime: '00:15', arrTime: '07:15', depDate: '20 Sep' },
        { flightNo: 'VJ 634', airline: 'VietJet Air', sector: 'SGN → DAD', depTime: '10:45', arrTime: '12:05', depDate: '22 Sep' },
        { flightNo: 'VJ 524', airline: 'VietJet Air', sector: 'DAD → HAN', depTime: '09:20', arrTime: '10:40', depDate: '25 Sep' },
        { flightNo: 'VJ 907', airline: 'VietJet Air', sector: 'HAN → BOM', depTime: '20:05', arrTime: '23:40', depDate: '28 Sep' },
      ]},
      { departureDate: '2026-11-11', segments: [
        { flightNo: 'VJ 884', airline: 'VietJet Air', sector: 'BOM → SGN', depTime: '00:15', arrTime: '07:15', depDate: '11 Nov' },
        { flightNo: 'VJ 634', airline: 'VietJet Air', sector: 'SGN → DAD', depTime: '10:45', arrTime: '12:05', depDate: '13 Nov' },
        { flightNo: 'VJ 524', airline: 'VietJet Air', sector: 'DAD → HAN', depTime: '09:20', arrTime: '10:40', depDate: '16 Nov' },
        { flightNo: 'VJ 907', airline: 'VietJet Air', sector: 'HAN → BOM', depTime: '20:05', arrTime: '23:40', depDate: '19 Nov' },
      ]},
    ]
  }},
  { id: 'as-05', name: 'Mauritian Paradise', nights: 6, days: 7, region: 'asia', workdriveUrl: 'https://drive.google.com/file/d/19mh78RZg-83DStbdGt1rHNp86_z8u5xt/view', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85', gallery: MAURITIUS_GALLERY, tag: 'NEW', tagline: 'Turquoise lagoons, island adventures and tropical bliss in Mauritius', basePrice: 1450, currency: 'USD', singlePrice: undefined, tacAdult: 51, tacChild: 51, childWithBedPrice: 1339, childWithoutBedPrice: 1019, departures: [{date:'2026-11-11',status:'available'}], singleSupplement: 0, tripleReduction: 0, addOns: ASIA_ADDONS, hotels: [{city:'Mauritius',name:'Pearle Beach Resort & Spa or similar',stars:4,nights:6,roomType:'Standard Room',meal:'Breakfast & Dinner'}], travelerTypes: ['Couples','Honeymoon','Friends','Family'], themes: ['Wind & Waves','Moments Away'], exCities: ALL_CITIES, starRating: 4, hasPrice: true, highlights: ['Île aux Cerfs — stunning island with speedboat transfers and optional water sports','North Mauritius Tour — Port Louis, Citadel Fort, Ship Model Factory and Caudan Waterfront','South Mauritius Tour — Trou aux Cerfs Volcano Crater, Grand Bassin and Bois Chéri Tea Plantation','Valley of Colours — vibrant natural landscapes','Casela Nature Parks — African Safari, Big Cats Kingdom and Tulawaka Gold Coaster Ride','Crystal-clear turquoise lagoons and pristine white-sand beaches'], inclusions: AS_MU_INCL, exclusions: AS_MU_EXCL, itinerary: [
    {day:1,title:'Arrive in Mauritius',description:'Welcome to tropical Mauritius. Arrive and transfer to your resort. Traditional Mauritian Welcome Drink on arrival. Relax or explore Grand Baie waterfront.',hotel:'Pearle Beach Resort & Spa (4★)',meals:['Dinner']},
    {day:2,title:'North Mauritius | Port Louis | Citadel Fort | Caudan Waterfront',description:'Tour of North Mauritius. Ship Model Factory, Adamas Diamond Showroom and Floreal Souvenir Shop. Historic Citadel Fort. Free time at Caudan Waterfront.',hotel:'Pearle Beach Resort & Spa (4★)',meals:['Breakfast','Dinner']},
    {day:3,title:'Île aux Cerfs | Speedboat | Optional Water Sports',description:'Shared Speedboat Transfer to Île aux Cerfs. Relax on white sandy beaches or enjoy optional water sports: Parasailing, Undersea Walk, Tube Ride.',hotel:'Pearle Beach Resort & Spa (4★)',meals:['Breakfast','Dinner']},
    {day:4,title:'South Mauritius | Trou aux Cerfs | Grand Bassin | Valley of Colours',description:'Trou aux Cerfs Volcano Crater, Grand Bassin (Ganga Talao), Bois Chéri Tea Plantation. Valley of Colours.',hotel:'Pearle Beach Resort & Spa (4★)',meals:['Breakfast','Dinner']},
    {day:5,title:'Mauritius — Day at Leisure',description:'Free day at the resort. Beach, pool or optional excursions at your own pace.',hotel:'Pearle Beach Resort & Spa (4★)',meals:['Breakfast','Dinner']},
    {day:6,title:'Casela Nature Parks | African Safari | Big Cats Kingdom',description:'Full-day Casela Nature Parks. African Safari with Zebras, Rhinos, Ostriches and Wildebeest. Big Cats Kingdom, Walk-Through Aviary and Tulawaka Gold Coaster Ride.',hotel:'Pearle Beach Resort & Spa (4★)',meals:['Breakfast','Dinner']},
    {day:7,title:'Departure from Mauritius',description:'After breakfast, check out and transfer to the airport for your return flight.',hotel:'',meals:['Breakfast']},
  ], flights: {
    included: true, exCity: 'Mumbai',
    departurewise: [
      { departureDate: '2026-11-11', segments: [
        { flightNo: 'MK 749', airline: 'Air Mauritius', sector: 'BOM → MRU', depTime: '08:35', arrTime: '13:15', depDate: '11 Nov' },
        { flightNo: 'MK 748', airline: 'Air Mauritius', sector: 'MRU → BOM', depTime: '22:40', arrTime: '06:35+1', depDate: '17 Nov' },
      ]},
    ]
  }},
]

export const REGIONS = {
  europe: {
    name: 'Europe', tagline: 'Castles, Cultures & Cobblestones',
    desc: 'From the Eiffel Tower to Alpine peaks — Europe offers the world\'s most diverse travel canvas. GTF operates guaranteed group departures across Western, Central and Northern Europe.',
    heroImg: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=85',
    packages: PACKAGES.filter(p => p.region === 'europe'),
  },
  africa: {
    name: 'Africa', tagline: 'Safari, Savannah & Soul',
    desc: 'South Africa and Egypt — experience the raw beauty of the African continent, from Cape Town\'s Table Mountain to the ancient Pyramids of Giza.',
    heroImg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=85',
    packages: PACKAGES.filter(p => p.region === 'africa'),
  },
  asia: {
    name: 'Asia', tagline: 'Ancient Wonders, Modern Energy',
    desc: 'Japan, Vietnam, Mauritius and Turkey — GTF\'s Asia series brings the best of the continent with guaranteed departures and real pricing.',
    heroImg: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=85',
    packages: PACKAGES.filter(p => p.region === 'asia'),
  },
}

export const FAQS = [
  { q: 'Why should I choose GTF Holidays for my travel business?', a: 'At GTF Holidays LLP, we specialize in professionally curated B2B travel solutions designed exclusively for travel partners. With extensive experience in Series Departures, White Label Solutions, ADHOC Groups, and Bespoke Customised Holidays, we provide complete backend support including operations, visa assistance, hotel contracting, meals, tour managers, and on-ground coordination — allowing our partners to focus on sales and customer relationships.', cat: 'General' },
  { q: 'What are Series Departures?', a: 'Series Departures are pre-planned fixed departure group tours with confirmed itineraries, hotels, sightseeing, and departures on specified dates. These tours are designed to offer cost-effective pricing, seamless operations, and professionally managed travel experiences for groups.', cat: 'General' },
  { q: 'What destinations do you operate?', a: 'We offer departures and customized holidays across: Europe, Japan, South Korea, Australia & New Zealand, South Africa / Kenya / Tanzania, Egypt & Jordan, Turkey, Vietnam & Cambodia, Scandinavia, Iceland, Balkans & Eastern Europe, Thailand & Southeast Asia, USA & Canada, South America, UAE, and many more international destinations.', cat: 'General' },
  { q: 'What is a White Label Solution?', a: 'Our White Label Solutions allow travel companies to sell and operate tours under their own brand name while GTF Holidays manages the backend operations, logistics, contracting, and execution discreetly.', cat: 'General' },
  { q: 'What are ADHOC Groups?', a: 'ADHOC Groups are customized group departures created specifically for closed groups such as families, corporates, institutions, communities, incentive groups, student groups, social groups, or special interest travellers.', cat: 'General' },
  { q: 'Do you provide fully customized holidays?', a: 'Yes. We design Bespoke Customised Holidays based on the traveller\'s preferences, budget, travel style, interests, meal requirements, hotel preferences, sightseeing priorities, and operational feasibility.', cat: 'General' },
  { q: 'Are meals included on tours?', a: 'Most group departures include meals as mentioned in the itinerary. Depending on the destination and tour design, meals may include Indian, Jain, Vegetarian, Non-Vegetarian, Continental, local cuisine experiences, buffet meals, packed meals, or fixed group menus.', cat: 'Travel & Tour' },
  { q: 'Do your tours include Tour Managers?', a: 'Yes. Our Series Departures and many group tours are accompanied by experienced professional Tour Managers or Tour Representatives for seamless coordination and guest assistance throughout the journey.', cat: 'Travel & Tour' },
  { q: 'What category of hotels do you provide?', a: 'We generally provide carefully selected hotels or equivalent accommodations, ensuring comfort, cleanliness, location advantage, and operational convenience for travellers.', cat: 'Hotels & Accommodation' },
  { q: 'How many passengers are usually in a group?', a: 'Group sizes generally range between 25 to 45 guests, allowing a comfortable balance between personalized attention and group travel experience.', cat: 'Travel & Tour' },
  { q: 'Are your tours suitable for senior citizens and families?', a: 'Yes. Our tours are designed to cater to families, couples, senior citizens, honeymooners, youngsters, and first-time international travellers.', cat: 'Travel & Tour' },
  { q: 'How do I register as a partner on this portal?', a: 'Click "Register as Agent" and fill in your agency details. Your application will be reviewed by our team within 24-48 hours. Upon approval, you\'ll receive access to view detailed itineraries, request quotes, and access partner-exclusive resources.', cat: 'B2B & White Label Support' },
]
