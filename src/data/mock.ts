export type Kind = 'fixed' | 'flexible'
export type ItemType = 'flight' | 'hotel' | 'activity' | 'transfer' | 'experience'
export type Category = 'culture' | 'hidden' | 'nature' | 'adventure' | 'local' | 'luxury'
export type ExpType = 'Attraction' | 'Local experience' | 'Neighbourhood' | 'Activity' | 'Hidden gem' | 'Day trip'
export type Vote = 'must' | 'interested' | 'maybe' | 'skip'

export interface Item {
  id: string
  day: number
  start: string
  end?: string
  durationMin: number
  title: string
  subtitle?: string
  type: ItemType
  kind: Kind
  zone: string
  imageKey: string
  booked?: boolean
  needsBooking?: boolean
  walkKm?: number
  mustDo?: boolean
  status?: 'confirmed' | 'requested'
  bookingRef?: string
}

export interface Experience {
  id: string
  title: string
  area: string
  type: ExpType
  category: Category
  blurb: string
  why: string
  imageKey: string
  durationMin: number
  zone: string
  walkKm: number
  needsBooking?: boolean
  priceInr?: number
}

export interface Person {
  id: string
  name: string
  tint: string
}

export const PEOPLE: Person[] = [
  { id: 'you', name: 'You', tint: '#222222' },
  { id: 'arpit', name: 'Arpit', tint: '#e31c5f' },
  { id: 'tanya', name: 'Tanya', tint: '#0f8a5f' },
  { id: 'fatema', name: 'Fatema', tint: '#b45309' },
]

export const TRIP = {
  id: 'london-dec',
  name: 'London for Tanya\'s birthday',
  short: 'London',
  route: ['Hyderabad', 'Istanbul', 'London', 'Hyderabad'],
  layover: 'Istanbul',
  dates: '13 to 19 Dec 2026',
  nights: 6,
  who: 'Friends',
  occasion: 'Birthday',
  parentsAlong: true,
  cover: 'london',
}

export interface Day {
  index: number
  short: string
  date: string
  city: string
}

export const DAYS: Day[] = [
  { index: 0, short: 'Sun', date: '13 Dec', city: 'Travel day' },
  { index: 1, short: 'Mon', date: '14 Dec', city: 'London' },
  { index: 2, short: 'Tue', date: '15 Dec', city: 'London' },
  { index: 3, short: 'Wed', date: '16 Dec', city: 'London' },
  { index: 4, short: 'Thu', date: '17 Dec', city: 'London' },
  { index: 5, short: 'Fri', date: '18 Dec', city: 'London' },
  { index: 6, short: 'Sat', date: '19 Dec', city: 'Departure' },
]

const TRAVEL: Record<string, Record<string, number>> = {
  bloomsbury: { soho: 12, camden: 15, southbank: 25, city: 22, greenwich: 45, kensington: 30, heathrow: 55, hampstead: 30, kew: 55 },
  soho: { bloomsbury: 12, camden: 20, southbank: 15, city: 25, greenwich: 45, kensington: 20, heathrow: 50, hampstead: 30, kew: 45 },
  camden: { bloomsbury: 15, soho: 20, southbank: 30, city: 28, greenwich: 55, kensington: 35, hampstead: 20, kew: 60 },
  southbank: { bloomsbury: 25, soho: 15, camden: 30, city: 15, greenwich: 35, kensington: 30, kew: 50 },
  city: { bloomsbury: 22, soho: 25, camden: 28, southbank: 15, greenwich: 30, kensington: 35 },
  greenwich: { bloomsbury: 45, soho: 45, camden: 55, southbank: 35, city: 30, kensington: 55 },
  kensington: { bloomsbury: 30, soho: 20, camden: 35, southbank: 30, city: 35, greenwich: 55, kew: 35 },
}

export function travelMinutes(a: string, b: string): number {
  if (a === b) return 8
  return TRAVEL[a]?.[b] ?? TRAVEL[b]?.[a] ?? 30
}

export const hm = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
export const toHm = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
export const fmt12 = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}
export const endOf = (i: Item) => i.end ?? toHm(hm(i.start) + i.durationMin)
export const dur = (min: number) => {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

export const INITIAL_ITEMS: Item[] = [
  { id: 'fl1', day: 0, start: '14:10', end: '19:25', durationMin: 315, title: 'Hyderabad to Istanbul', subtitle: 'Turkish Airlines TK 1112, seats 14A and 14B', type: 'flight', kind: 'fixed', zone: 'airport', imageKey: 'flight', booked: true, status: 'confirmed', bookingRef: 'TK8H2Q' },
  { id: 'fl2', day: 0, start: '21:40', end: '23:50', durationMin: 250, title: 'Istanbul to London Heathrow', subtitle: 'Turkish Airlines TK 1979, lands 11:50 PM', type: 'flight', kind: 'fixed', zone: 'heathrow', imageKey: 'flight', booked: true, status: 'confirmed', bookingRef: 'TK8H2Q' },
  { id: 'ht1', day: 0, start: '23:59', durationMin: 5, title: 'Late check-in', subtitle: 'Bloomsbury Row Hotel, 6 nights', type: 'hotel', kind: 'fixed', zone: 'bloomsbury', imageKey: 'hotel', booked: true, status: 'confirmed', bookingRef: 'BRH-55021' },

  { id: 'a1', day: 1, start: '11:30', durationMin: 90, title: 'Seven Dials and Neal\'s Yard', subtitle: 'A slow first morning, nothing booked', type: 'experience', kind: 'flexible', zone: 'soho', imageKey: 'sevendials', walkKm: 2 },
  { id: 'a2', day: 1, start: '15:00', durationMin: 120, title: 'Cecil Court rare book alley', subtitle: 'Tiny shops, no queue', type: 'experience', kind: 'flexible', zone: 'soho', imageKey: 'library', walkKm: 1 },

  { id: 'a3', day: 2, start: '09:30', durationMin: 150, title: 'British Museum', subtitle: 'Opens 9:30 AM, free entry', type: 'activity', kind: 'flexible', zone: 'bloomsbury', imageKey: 'museum', walkKm: 3, mustDo: true },
  { id: 'a4', day: 2, start: '14:00', durationMin: 120, title: 'Covent Garden at leisure', subtitle: 'Street performers and the covered market', type: 'experience', kind: 'flexible', zone: 'soho', imageKey: 'covent', walkKm: 2 },
  { id: 'b1', day: 2, start: '19:00', durationMin: 150, title: 'Evening at the Palace Theatre', subtitle: 'Row F, 4 tickets', type: 'activity', kind: 'fixed', zone: 'soho', imageKey: 'theatre', booked: true, status: 'confirmed', bookingRef: 'PT-90417' },

  { id: 'a5', day: 3, start: '09:30', durationMin: 120, title: 'Hidden Bloomsbury bookshops', subtitle: 'Guided by a local bookseller', type: 'experience', kind: 'flexible', zone: 'bloomsbury', imageKey: 'library', walkKm: 2.5 },
  { id: 'b2', day: 3, start: '19:00', durationMin: 120, title: 'Sunset Thames cruise', subtitle: 'Boards at Embankment pier', type: 'activity', kind: 'fixed', zone: 'southbank', imageKey: 'thames', booked: true, status: 'confirmed', bookingRef: 'TC-22871' },

  { id: 'a6', day: 4, start: '09:00', durationMin: 150, title: 'Tower of London', subtitle: 'Crown Jewels and the Yeoman tour', type: 'activity', kind: 'flexible', zone: 'city', imageKey: 'towerbridge', walkKm: 3, needsBooking: true },
  { id: 'a7', day: 4, start: '11:45', durationMin: 75, title: 'Borough Market', subtitle: 'Cheese, bread, small producers', type: 'experience', kind: 'flexible', zone: 'southbank', imageKey: 'borough', walkKm: 2 },
  { id: 'a8', day: 4, start: '13:30', durationMin: 120, title: 'Tate Modern', subtitle: 'Turbine Hall and the viewing level', type: 'activity', kind: 'flexible', zone: 'southbank', imageKey: 'tate', walkKm: 2.5 },
  { id: 'a9', day: 4, start: '15:45', durationMin: 150, title: 'Greenwich and the Observatory', subtitle: 'River boat from Tate Modern pier', type: 'activity', kind: 'flexible', zone: 'greenwich', imageKey: 'greenwich', walkKm: 4 },

  { id: 'b3', day: 5, start: '15:30', durationMin: 90, title: 'Afternoon tea in Mayfair', subtitle: 'Table for 4, booked', type: 'activity', kind: 'fixed', zone: 'soho', imageKey: 'covent', booked: true, status: 'confirmed', bookingRef: 'AT-10442' },
  { id: 'a10', day: 5, start: '10:30', durationMin: 150, title: 'Notting Hill and Portobello Road', subtitle: 'Antiques, colour, a long wander', type: 'experience', kind: 'flexible', zone: 'kensington', imageKey: 'notting', walkKm: 3 },

  { id: 'ht2', day: 6, start: '11:00', durationMin: 30, title: 'Hotel check-out', subtitle: 'Bloomsbury Row Hotel', type: 'hotel', kind: 'fixed', zone: 'bloomsbury', imageKey: 'hotel', booked: true, status: 'confirmed', bookingRef: 'BRH-55021' },
]

export const CATALOG: Experience[] = [
  { id: 'camden', title: 'Camden Market', area: 'Camden', type: 'Local experience', category: 'local', blurb: 'Canal-side stalls, vintage racks and street food courtyards.', why: 'Matches the local-culture places you saved', imageKey: 'camden', durationMin: 180, zone: 'camden', walkKm: 2.5 },
  { id: 'primrose', title: 'Primrose Hill at golden hour', area: 'Camden', type: 'Hidden gem', category: 'nature', blurb: 'The best free view of the London skyline, ten minutes from the market.', why: 'Pairs with Camden Market', imageKey: 'primrose', durationMin: 90, zone: 'camden', walkKm: 1.5 },
  { id: 'canal', title: 'Regent\'s Canal towpath walk', area: 'Camden to King\'s Cross', type: 'Hidden gem', category: 'hidden', blurb: 'Narrowboats, street art and quiet locks away from the crowds.', why: 'Relaxed pace, few tourists', imageKey: 'canal', durationMin: 120, zone: 'camden', walkKm: 4 },
  { id: 'spitalfields', title: 'Old Spitalfields Market', area: 'Spitalfields', type: 'Local experience', category: 'local', blurb: 'Independent makers under a restored Victorian roof.', why: 'You saved two maker markets', imageKey: 'spitalfields', durationMin: 120, zone: 'city', walkKm: 2 },
  { id: 'shoreditch', title: 'Shoreditch street art walk', area: 'Shoreditch', type: 'Neighbourhood', category: 'hidden', blurb: 'Murals that change every few weeks, with a local guide.', why: 'Popular with travellers who like hidden spots', imageKey: 'shoreditch', durationMin: 120, zone: 'city', walkKm: 3.5, needsBooking: true, priceInr: 2400 },
  { id: 'hampstead', title: 'Hampstead Heath and Kenwood House', area: 'Hampstead', type: 'Attraction', category: 'nature', blurb: 'Rolling heath, a ponds trail and a grand house with a free gallery.', why: 'Good for a gentler day', imageKey: 'hampstead', durationMin: 180, zone: 'hampstead', walkKm: 5 },
  { id: 'kew', title: 'Kew Gardens glasshouses', area: 'Kew', type: 'Attraction', category: 'nature', blurb: 'Victorian glasshouses are warm in December, with a lit winter trail at night.', why: 'Warm, easy walking for parents', imageKey: 'kew', durationMin: 240, zone: 'kew', walkKm: 4, needsBooking: true, priceInr: 2100 },
  { id: 'oxford', title: 'Oxford by train, a day trip', area: 'Oxford', type: 'Day trip', category: 'culture', blurb: 'Colleges, the Bodleian and a covered market, 1 hr from Paddington.', why: 'You marked museums as Must Go', imageKey: 'oxford', durationMin: 420, zone: 'oxford', walkKm: 5, needsBooking: true, priceInr: 3800 },
  { id: 'windsor', title: 'Windsor Castle', area: 'Windsor', type: 'Day trip', category: 'luxury', blurb: 'A working royal residence, with state apartments decked out for Christmas.', why: 'December is the best time to go', imageKey: 'windsor', durationMin: 360, zone: 'windsor', walkKm: 3, needsBooking: true, priceInr: 4200 },
  { id: 'notting2', title: 'Portobello antiques stalls', area: 'Notting Hill', type: 'Local experience', category: 'local', blurb: 'Saturday-only antiques arcade, the real one, not the souvenir stretch.', why: 'Hidden corner of a busy area', imageKey: 'notting', durationMin: 90, zone: 'kensington', walkKm: 1.5 },
  { id: 'cecil', title: 'Cecil Court rare book alley', area: 'Soho', type: 'Hidden gem', category: 'hidden', blurb: 'A pedestrian lane of antiquarian shops, once called Flicker Alley.', why: 'You saved a bookshop reel', imageKey: 'library', durationMin: 60, zone: 'soho', walkKm: 1 },
  { id: 'greenwich-mkt', title: 'Greenwich covered market', area: 'Greenwich', type: 'Local experience', category: 'local', blurb: 'Craft stalls beside the Cutty Sark, quieter on weekdays.', why: 'Near the Observatory', imageKey: 'greenwich', durationMin: 75, zone: 'greenwich', walkKm: 1.5 },
  { id: 'borough2', title: 'Borough Market tasting trail', area: 'Southwark', type: 'Activity', category: 'local', blurb: 'A guided tasting trail through the stalls, small producers only.', why: 'Local food culture, led by a guide', imageKey: 'borough', durationMin: 150, zone: 'southbank', walkKm: 1.5, needsBooking: true, priceInr: 3100 },
]

export const INITIAL_WISHLIST = ['camden', 'primrose', 'spitalfields', 'hampstead']

export const INITIAL_VOTES: Record<string, Partial<Record<string, Vote>>> = {
  camden: { arpit: 'must', tanya: 'interested', fatema: 'maybe' },
  primrose: { arpit: 'interested', tanya: 'must' },
  canal: { tanya: 'interested', fatema: 'interested' },
  kew: { fatema: 'must', arpit: 'maybe' },
  hampstead: { tanya: 'maybe', fatema: 'skip' },
}

export interface Activity {
  id: string
  who: string
  text: string
  at: string
  unseen?: boolean
}

export const INITIAL_ACTIVITY: Activity[] = [
  { id: 'ac1', who: 'arpit', text: 'added Camden Market to the wishlist', at: '2 hours ago', unseen: true },
  { id: 'ac2', who: 'tanya', text: 'moved British Museum to Day 3', at: '3 hours ago', unseen: true },
  { id: 'ac3', who: 'fatema', text: 'removed London Eye', at: 'Yesterday', unseen: true },
  { id: 'ac4', who: 'arpit', text: 'added three experiences to the wishlist', at: 'Yesterday' },
]

export const DOCUMENTS = [
  { id: 'd1', title: 'E-ticket, Hyderabad to London', kind: 'PDF', size: '212 KB' },
  { id: 'd2', title: 'Bloomsbury Row Hotel confirmation', kind: 'PDF', size: '98 KB' },
  { id: 'd3', title: 'Palace Theatre tickets', kind: 'PDF', size: '340 KB' },
  { id: 'd4', title: 'Thames cruise booking', kind: 'Screenshot', size: '1.1 MB' },
]

export interface Request {
  id: string
  traveller: string
  type: 'Visa' | 'Activity booking' | 'Trip build' | 'Private experience' | 'Flights' | 'Stay' | 'Transfer'
  trip: string
  status: 'New' | 'In progress' | 'Waiting on traveller' | 'Done'
  when: string
  summary: string
}

export const ADMIN_REQUESTS: Request[] = [
  { id: 'r1', traveller: 'Tanya Menon', type: 'Visa', trip: 'London, 13 to 19 Dec', status: 'In progress', when: '1 hr ago', summary: 'UK visitor visa plus Istanbul transit check, 4 travellers, Indian passports' },
  { id: 'r2', traveller: 'Rohit Varma', type: 'Activity booking', trip: 'Switzerland, 2 to 9 Jan', status: 'New', when: '12 min ago', summary: 'Jungfraujoch with a morning train, 2 adults, advance paid' },
  { id: 'r3', traveller: 'Sana Qureshi', type: 'Private experience', trip: 'Istanbul, 22 to 26 Dec', status: 'New', when: '40 min ago', summary: 'Anniversary, private Bosphorus dinner for 2, budget flexible' },
  { id: 'r4', traveller: 'Karthik and Divya', type: 'Trip build', trip: 'Singapore and Bali', status: 'In progress', when: '3 hrs ago', summary: 'Honeymoon, 9 nights, relaxed pace, saved 14 places from reels' },
  { id: 'r5', traveller: 'Imran Sheikh', type: 'Flights', trip: 'Tokyo, 3 to 11 Mar', status: 'Waiting on traveller', when: 'Yesterday', summary: 'Family of 5, call back requested for business class options' },
  { id: 'r6', traveller: 'Pooja Rao', type: 'Stay', trip: 'Dubai, 27 to 31 Dec', status: 'Done', when: 'Yesterday', summary: 'Beach resort near the Marina, two shortlisted, confirmed' },
]

export const DESTINATIONS = [
  { id: 'london', name: 'London', country: 'United Kingdom', imageKey: 'london' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkiye', imageKey: 'istanbul' },
  { id: 'switzerland', name: 'Switzerland', country: 'Alps and lakes', imageKey: 'switzerland' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', imageKey: 'singapore' },
  { id: 'paris', name: 'Paris', country: 'France', imageKey: 'paris' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', imageKey: 'tokyo' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', imageKey: 'bali' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', imageKey: 'dubai' },
]

export const SWITZERLAND_REEL = {
  title: '5 Hidden Experiences in Switzerland',
  by: '@alpine.diaries',
  found: [
    { id: 'sw1', title: 'Oeschinensee at first light', area: 'Kandersteg', blurb: 'A turquoise alpine lake, a gondola ride and a quiet shore path.', imageKey: 'switzerland' },
    { id: 'sw2', title: 'Lauterbrunnen waterfall village walk', area: 'Bernese Oberland', blurb: '72 waterfalls in one valley, an easy flat trail.', imageKey: 'switzerland' },
    { id: 'sw3', title: 'Lavaux vineyard terraces', area: 'Lake Geneva', blurb: 'Stone-walled terraces above the lake, walkable between villages.', imageKey: 'switzerland' },
    { id: 'sw4', title: 'Verzasca valley bridge pools', area: 'Ticino', blurb: 'Clear green pools beneath an old stone bridge.', imageKey: 'switzerland' },
    { id: 'sw5', title: 'Appenzell cheese villages', area: 'Eastern Switzerland', blurb: 'Painted houses and a working dairy tasting room.', imageKey: 'switzerland' },
  ],
}

CATALOG.push(
  { id: 'soane', title: 'Sir John Soane\'s Museum', area: 'Holborn', type: 'Hidden gem', category: 'hidden', blurb: 'A crowded, candlelit house of antiquities that hardly anyone queues for.', why: 'Quiet, indoors and close to you', imageKey: 'museum', durationMin: 75, zone: 'bloomsbury', walkKm: 0.8 },
  { id: 'nealsyard', title: 'Neal\'s Yard courtyard', area: 'Covent Garden', type: 'Local experience', category: 'local', blurb: 'A painted courtyard with a cheese dairy and herbal apothecary.', why: 'Short, bright and walkable', imageKey: 'sevendials', durationMin: 45, zone: 'soho', walkKm: 0.6 },
  { id: 'lambs', title: 'Lamb\'s Conduit Street', area: 'Bloomsbury', type: 'Neighbourhood', category: 'local', blurb: 'An independent-shops street with a village feel, minutes from the museum.', why: 'Relaxed and close by', imageKey: 'library', durationMin: 45, zone: 'bloomsbury', walkKm: 0.7 },
)
