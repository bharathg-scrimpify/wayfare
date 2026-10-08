// Single place for every image in the prototype.
// Each key tries an Unsplash photo first, then a keyword photo, then a tinted gradient.
// For the final client demo, replace these with licensed, curated photography.

type Entry = { unsplash?: string; kw: string; from: string; to: string }

export const IMAGES: Record<string, Entry> = {
  london: { unsplash: '1513635269975-59663e0ac1ad', kw: 'london,city', from: '#1f2a44', to: '#6b7fa8' },
  bigben: { unsplash: '1529655683826-aba9b3e77383', kw: 'bigben,london', from: '#2b3a55', to: '#c9a66b' },
  istanbul: { unsplash: '1524231757912-21f4fe3a7200', kw: 'istanbul,mosque', from: '#3b2a4a', to: '#e08b5a' },
  singapore: { unsplash: '1525625293386-3f8f99389edd', kw: 'singapore,marina', from: '#0f3b4a', to: '#58b5a8' },
  switzerland: { unsplash: '1530122037265-a5f1f91d3b99', kw: 'switzerland,alps', from: '#1d3b5c', to: '#9cc7e8' },
  paris: { unsplash: '1502602898657-3e91760cbb34', kw: 'paris,eiffel', from: '#3a2a3a', to: '#d9a2a2' },
  tokyo: { unsplash: '1540959733332-eab4deabeeaf', kw: 'tokyo,street', from: '#2a1f3a', to: '#e0709a' },
  bali: { unsplash: '1537996194471-e657df975ab4', kw: 'bali,temple', from: '#1f3a2a', to: '#8ac28a' },
  dubai: { unsplash: '1512453979798-5ea266f8880c', kw: 'dubai,skyline', from: '#3a2f1f', to: '#e0b26b' },
  camden: { kw: 'camden,market', from: '#3a1f2a', to: '#e0795a' },
  museum: { kw: 'britishmuseum,london', from: '#2a2a2a', to: '#b8a98a' },
  towerbridge: { kw: 'towerbridge,london', from: '#1f2f44', to: '#8aa6c9' },
  primrose: { kw: 'primrosehill,london', from: '#1f3a2f', to: '#a0d0a0' },
  greenwich: { kw: 'greenwich,london', from: '#1f3344', to: '#7fb0c9' },
  canal: { kw: 'canal,london,boat', from: '#1f3a3a', to: '#7fc9b8' },
  covent: { kw: 'coventgarden,london', from: '#3a2f2f', to: '#d9b08a' },
  theatre: { kw: 'theatre,westend', from: '#2a1020', to: '#c0455a' },
  borough: { kw: 'boroughmarket,london', from: '#2f3a1f', to: '#c0c97f' },
  tate: { kw: 'tatemodern,london', from: '#2a2a33', to: '#9aa0b8' },
  kew: { kw: 'kewgardens,london', from: '#1f3a25', to: '#9ad09a' },
  shoreditch: { kw: 'shoreditch,streetart', from: '#2a2a3a', to: '#d070a0' },
  thames: { kw: 'thames,sunset,london', from: '#3a2a1f', to: '#e09a5a' },
  hotel: { kw: 'boutique,hotel,room', from: '#2f2a24', to: '#c9b08a' },
  flight: { kw: 'airplane,window,clouds', from: '#1f3350', to: '#8fb4e0' },
  library: { kw: 'bookshop,london', from: '#3a2f24', to: '#c9a06b' },
  sevendials: { kw: 'sevendials,london', from: '#33241f', to: '#d9946b' },
  hampstead: { kw: 'hampstead,heath', from: '#1f3a2a', to: '#8ac2a0' },
  spitalfields: { kw: 'spitalfields,market', from: '#2f2424', to: '#c98a7a' },
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return h | 0
}

export function imageSources(key: string, w = 900, h = 700): string[] {
  const e = IMAGES[key]
  if (!e) return []
  const out: string[] = []
  if (e.unsplash) {
    out.push(`https://images.unsplash.com/photo-${e.unsplash}?auto=format&fit=crop&w=${w}&h=${h}&q=75`)
  }
  out.push(`https://loremflickr.com/${w}/${h}/${e.kw}?lock=${Math.abs(hash(key))}`)
  return out
}

export function gradientFor(key: string): string {
  const e = IMAGES[key]
  if (!e) return 'linear-gradient(135deg,#2a2a2a,#8a8a8a)'
  return `linear-gradient(135deg, ${e.from}, ${e.to})`
}

IMAGES.oxford = { kw: 'oxford,university', from: '#2a2f3a', to: '#b8a98a' }
IMAGES.notting = { kw: 'nottinghill,colourful,houses', from: '#3a2f3a', to: '#e0a0b0' }
IMAGES.windsor = { kw: 'windsor,castle', from: '#2a3344', to: '#b0b8d0' }
