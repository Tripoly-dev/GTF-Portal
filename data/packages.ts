export type AddOn = {
  id: string
  label: string
  price: number
  note?: string
}

export type Package = {
  id: string
  name: string
  nights: number
  days: number
  region: 'europe' | 'africa' | 'oceania' | 'asia' | 'americas'
  workdriveUrl: string
  img: string
  tag?: string
  basePrice: number
  departures: string[]
  singleSupplement: number
  tripleReduction: number
  addOns: AddOn[]
}

// ── DEPARTURE DATES ────────────────────────────────────────────────────────
// Europe: Oct–Mar season. Dates are approximate — update with real dates.
const EU_DEPARTURES = [
  '2025-10-03', '2025-10-17', '2025-11-07', '2025-11-21',
  '2025-12-05', '2025-12-19', '2026-01-09', '2026-01-23',
  '2026-02-06', '2026-02-20', '2026-03-06', '2026-03-20',
]

// Africa: Jul–Oct season
const AF_DEPARTURES = [
  '2025-07-04', '2025-07-18', '2025-08-01', '2025-08-15',
  '2025-09-05', '2025-09-19', '2025-10-03', '2025-10-17',
  '2026-07-03', '2026-07-17', '2026-08-07', '2026-08-21',
]

// Oceania: Apr–Sep season
const OC_DEPARTURES = [
  '2025-04-04', '2025-05-02', '2025-06-06', '2025-07-04',
  '2025-08-01', '2025-09-05', '2026-04-03', '2026-05-01',
]

// ── ADD-ONS ────────────────────────────────────────────────────────────────
const EU_ADDONS: AddOn[] = [
  { id: 'visa_eu', label: 'Schengen Visa Assistance', price: 8500, note: 'Visa fees + processing assistance' },
  { id: 'insurance', label: 'Travel Insurance', price: 2200, note: 'Comprehensive travel coverage' },
]
const AF_ADDONS: AddOn[] = [
  { id: 'visa_ke', label: 'Kenya/Tanzania Visa', price: 6500, note: 'E-visa processing assistance' },
  { id: 'insurance', label: 'Travel Insurance', price: 2200, note: 'Comprehensive travel coverage' },
]
const OC_ADDONS: AddOn[] = [
  { id: 'insurance', label: 'Travel Insurance', price: 2200, note: 'Comprehensive travel coverage' },
]

// ── PRICING LOGIC (placeholder — update with real prices before demo) ──────
// 7-8N  → ₹78,000 | 9-10N → ₹92,000 | 11-12N → ₹1,10,000
// 13-14N → ₹1,28,000 | 15-16N → ₹1,48,000
// Single supplement: +₹18,000 | Triple reduction: -₹4,000

export const PACKAGES: Package[] = [
  // ── EUROPE ────────────────────────────────────────────────────────────────
  {
    id: 'eu-01', name: 'European Delights', nights: 15, days: 16, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4b2b746336b614b90a0fca213c41b601f',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    tag: 'BESTSELLER', basePrice: 148000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-02', name: 'Sparkling Europe', nights: 13, days: 14, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4e1b788d7e3a949b98aed405416c3324e',
    img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80',
    basePrice: 128000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-03', name: 'Vibrant Europe', nights: 9, days: 10, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4b1639c7c1d5c439ab825f013ec63b57e',
    img: 'https://static.wixstatic.com/media/226760_e0b59020275d4b84b1e63c496f221ddc~mv2.webp',
    basePrice: 92000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-04', name: 'Alpine Wonders', nights: 7, days: 8, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5dfb30b43f7f7140f4ab1fc15f3c982d83',
    img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',
    tag: 'POPULAR', basePrice: 78000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-05', name: 'Grand Europe with London', nights: 14, days: 15, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4d45536d41045426c8c4d782fc5e55c5a',
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    basePrice: 148000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-06', name: 'Grand Europe', nights: 12, days: 13, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh48e4e6f4549894901a692670027c6a552',
    img: 'https://static.wixstatic.com/media/226760_6405694ec1584971b717372cd1c0d0b0~mv2.jpg',
    basePrice: 110000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-07', name: 'Gems of Europe', nights: 8, days: 9, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4cba10d5137ff4cdb80489121f66d6ab7',
    img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
    basePrice: 78000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-08', name: 'Essence of Europe', nights: 7, days: 8, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5d03f6defc38ef43bc9cedf72937733163',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
    basePrice: 78000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-09', name: 'Europe for All', nights: 12, days: 13, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5d8f095085adee4e7b927ba6630c53c0b1',
    img: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&q=80',
    basePrice: 110000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-10', name: 'European Dhamaka', nights: 8, days: 9, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh412f5c88ff68b430d96732cd7971822e9',
    img: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80',
    basePrice: 78000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-11', name: 'European Glimpses', nights: 8, days: 9, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh46fa49e557c004f21bfb3898691f69d45',
    img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=600&q=80',
    basePrice: 78000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-12', name: 'Whispers of Romance', nights: 10, days: 11, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/jugh4b2b746336b614b90a0fca213c41b601f',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    tag: 'HONEYMOON', basePrice: 92000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-13', name: 'European Dream', nights: 11, days: 12, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/eo49d436f80f6e02d47a5bdb93c5a1bb958e0',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
    basePrice: 110000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-14', name: 'Best of Scandinavia', nights: 9, days: 10, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5dad2db5022362477bbf58e5eed3eabd1d',
    img: 'https://static.wixstatic.com/media/226760_e6550524027f4b8f8bca511deb4defbc~mv2.jpg',
    basePrice: 92000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },
  {
    id: 'eu-15', name: 'Amazing Europe', nights: 11, days: 12, region: 'europe',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5d4ab84049c1ec4402915107e2bb0ec951',
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',
    basePrice: 110000, departures: EU_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: EU_ADDONS,
  },

  // ── AFRICA ────────────────────────────────────────────────────────────────
  {
    id: 'af-01', name: 'Roar & Explore — Tanzania Untamed', nights: 4, days: 5, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r61e6fabaf10d354f04831ea7df84367873',
    img: 'https://static.wixstatic.com/media/11062b_7f678f04f58f46febea4a10c93f8cd39~mv2.jpg',
    tag: 'SAFARI', basePrice: 78000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-02', name: 'Wild Serenade', nights: 3, days: 4, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r6195ed62fb6cfa47d2a5caebbf293c6b6b',
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80',
    basePrice: 65000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-03', name: 'Tanzania Untamed with Zanzibar', nights: 7, days: 8, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r61e6fabaf10d354f04831ea7df84367873',
    img: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
    tag: 'POPULAR', basePrice: 92000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-04', name: "Kenya's Ultimate Safari Circuit", nights: 7, days: 8, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r61c70b8d90a48042eaa556481fb8ba5cc3',
    img: 'https://static.wixstatic.com/media/11062b_46346b8363cf4db7a02099aa96aa3024~mv2_d_3416_3415_s_4_2.jpg',
    basePrice: 92000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-05', name: 'Wild Escapade', nights: 5, days: 6, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r6178fa7dadb99c41878a3bf5080adf7802',
    img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80',
    basePrice: 78000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-06', name: 'Echoes of the Wild', nights: 6, days: 7, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r6160dcec150ca340ea8eb480ecb2c6f542',
    img: 'https://images.unsplash.com/photo-1551655510-555dc3be8633?w=600&q=80',
    basePrice: 85000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-07', name: 'Amboseli Wild Trails', nights: 3, days: 4, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r61220ab1d94e534c51ac06001db48d4534',
    img: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80',
    basePrice: 65000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-08', name: 'Predators & Pink Feathers', nights: 4, days: 5, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r61289c50456e4e4bd8a6669c85bec3061e',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    basePrice: 78000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },
  {
    id: 'af-09', name: 'Into the Heart of the Wild', nights: 6, days: 7, region: 'africa',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/77r616f377d5942c346329fe909e3a6d4194b',
    img: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=600&q=80',
    basePrice: 85000, departures: AF_DEPARTURES,
    singleSupplement: 15000, tripleReduction: 3500, addOns: AF_ADDONS,
  },

  // ── OCEANIA ───────────────────────────────────────────────────────────────
  {
    id: 'oc-01', name: 'Best of Australia', nights: 9, days: 10, region: 'oceania',
    workdriveUrl: 'https://workdrive.zohoexternal.in/file/l5o5df5a5fff6366543e397fe53513b10536d',
    img: 'https://static.wixstatic.com/media/226760_ba7cc5b928a24377a86d5d4c8d124684~mv2.jpg',
    tag: 'AVAILABLE', basePrice: 110000, departures: OC_DEPARTURES,
    singleSupplement: 18000, tripleReduction: 4000, addOns: OC_ADDONS,
  },
  {
    id: 'oc-02', name: 'Discover Australia', nights: 9, days: 10, region: 'oceania',
    workdriveUrl: '',
    img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80',
    tag: 'COMING SOON', basePrice: 110000, departures: [],
    singleSupplement: 18000, tripleReduction: 4000, addOns: OC_ADDONS,
  },
]

export const REGIONS = {
  europe: {
    name: 'Europe',
    tagline: 'Castles, Cultures & Cobblestones',
    desc: 'From the Eiffel Tower to Alpine peaks — Europe offers the world\'s most diverse travel canvas. GTF operates 15 guaranteed group departures across Western, Central and Northern Europe.',
    heroImg: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=85',
    packages: PACKAGES.filter(p => p.region === 'europe'),
  },
  africa: {
    name: 'Africa',
    tagline: 'Safari, Savannah & Soul',
    desc: 'Kenya, Tanzania and beyond — witness the Great Migration, track the Big Five and experience the raw beauty of East Africa.',
    heroImg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=85',
    packages: PACKAGES.filter(p => p.region === 'africa'),
  },
  oceania: {
    name: 'Oceania',
    tagline: 'The Great South Land',
    desc: 'Sydney, Melbourne, the Great Barrier Reef and the Red Centre — Australia delivers landscapes unlike anywhere on earth.',
    heroImg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85',
    packages: PACKAGES.filter(p => p.region === 'oceania'),
  },
  asia: {
    name: 'Asia',
    tagline: 'Ancient Wonders, Modern Energy',
    desc: 'Japan, South Korea, Thailand, Vietnam, Cambodia and beyond — GTF\'s Asia series is coming soon.',
    heroImg: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=85',
    packages: [],
  },
  americas: {
    name: 'Americas',
    tagline: 'From Patagonia to New York',
    desc: 'USA, Canada, Brazil, Peru and the wider Americas — GTF is building a brand new series.',
    heroImg: 'https://static.wixstatic.com/media/11062b_f5be68c7acbc4b1b91a684d8acd6acb9~mv2.jpg',
    packages: [],
  },
}

export const FAQS = [
  { q: 'Why should I choose GTF Holidays for my travel business?', a: 'At GTF Holidays LLP, we specialize in professionally curated B2B travel solutions designed exclusively for travel partners. With extensive experience in Series Departures, White Label Solutions, ADHOC Groups, and Bespoke Customised Holidays, we provide complete backend support including operations, visa assistance, hotel contracting, meals, tour managers, and on-ground coordination — allowing our partners to focus on sales and customer relationships.', cat: 'General' },
  { q: 'What are Series Departures?', a: 'Series Departures are pre-planned fixed departure group tours with confirmed itineraries, hotels, sightseeing, and departures on specified dates. These tours are designed to offer cost-effective pricing, seamless operations, and professionally managed travel experiences for groups.', cat: 'General' },
  { q: 'What destinations do you operate?', a: 'We offer departures and customized holidays across: Europe, Japan, South Korea, Australia & New Zealand, South Africa / Kenya / Tanzania, Egypt & Jordan, Turkey, Vietnam & Cambodia, Scandinavia, Iceland, Balkans & Eastern Europe, Thailand & Southeast Asia, USA & Canada, South America, UAE, and many more international destinations.', cat: 'General' },
  { q: 'What is a White Label Solution?', a: 'Our White Label Solutions allow travel companies to sell and operate tours under their own brand name while GTF Holidays manages the backend operations, logistics, contracting, and execution discreetly.', cat: 'General' },
  { q: 'What are ADHOC Groups?', a: 'ADHOC Groups are customized group departures created specifically for closed groups such as families, corporates, institutions, communities, incentive groups, student groups, social groups, or special interest travellers.', cat: 'General' },
  { q: 'Do you provide fully customized holidays?', a: 'Yes. We design Bespoke Customised Holidays based on the traveller\'s preferences, budget, travel style, interests, meal requirements, hotel preferences, sightseeing priorities, and operational feasibility.', cat: 'General' },
  { q: 'What is the "Tour Family" concept?', a: 'The "Tour Family" concept is a unique approach where travellers from various travel partners come together and travel as one professionally managed tour family. This allows travel partners to confidently promote and sell departures under a collaborative B2B ecosystem while GTF Holidays manages the backend operations seamlessly.', cat: 'General' },
  { q: 'What is the "Agent Voice" concept?', a: 'The "Agent Voice" concept is a unique support initiative where our experienced team members directly communicate with your clients under your company\'s banner — providing accurate tour information, destination guidance, and travel assistance. GTF operates purely as a backend B2B partner, ensuring the travel partner always remains the primary face for the client.', cat: 'General' },
  { q: 'Are meals included on tours?', a: 'Most group departures include meals as mentioned in the itinerary. Depending on the destination and tour design, meals may include Indian, Jain, Vegetarian, Non-Vegetarian, Continental, local cuisine experiences, buffet meals, packed meals, or fixed group menus.', cat: 'Travel & Tour' },
  { q: 'Do your tours include Tour Managers?', a: 'Yes. Our Series Departures and many group tours are accompanied by experienced professional Tour Managers or Tour Representatives for seamless coordination and guest assistance throughout the journey.', cat: 'Travel & Tour' },
  { q: 'What category of hotels do you provide?', a: 'We generally provide carefully selected hotels or equivalent accommodations, ensuring comfort, cleanliness, location advantage, and operational convenience for travellers.', cat: 'Hotels & Accommodation' },
  { q: 'How many passengers are usually in a group?', a: 'Group sizes generally range between 25 to 45 guests, allowing a comfortable balance between personalized attention and group travel experience.', cat: 'Travel & Tour' },
  { q: 'Are your tours suitable for senior citizens and families?', a: 'Yes. Our tours are designed to cater to families, couples, senior citizens, honeymooners, youngsters, and first-time international travellers.', cat: 'Travel & Tour' },
  { q: 'Do you work only with travel partners across India?', a: 'No. While we have a strong network across India, we also collaborate with travel companies, tour operators, and travel agencies globally. GTF Holidays LLP operates exclusively as a B2B travel operator and does not deal in B2C retail business.', cat: 'B2B & White Label Support' },
  { q: 'How do I register as a partner on this portal?', a: 'Click "Register as Agent" and fill in your agency details. Your application will be reviewed by our team within 24-48 hours. Upon approval, you\'ll receive access to view detailed itineraries, request quotes, and access partner-exclusive resources.', cat: 'B2B & White Label Support' },
]
