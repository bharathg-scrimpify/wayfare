import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ADMIN_REQUESTS, CATALOG, DAYS, INITIAL_ACTIVITY, INITIAL_ITEMS, INITIAL_VOTES, INITIAL_WISHLIST, SWITZERLAND_REEL, TRIP,
  endOf, hm, toHm, travelMinutes, dur,
  type Activity, type Category, type Experience, type Item, type Request, type Vote,
} from '../data/mock'

export type GapAction = 'transfer' | 'flight' | 'book' | 'explore' | 'visa' | 'rebalance'
export interface Gap {
  id: string
  type: 'Transfer' | 'Flights' | 'Booking' | 'Experience' | 'Timing' | 'Overloaded' | 'Visa' | 'Walking'
  title: string
  detail: string
  day?: number
  itemId?: string
  action: { label: string; kind: GapAction }
  severity: 'high' | 'medium' | 'low'
}

export interface Toast {
  id: number
  text: string
  tone?: 'ok' | 'warn' | 'info'
  action?: { label: string; run: () => void }
}

interface Ctx {
  items: Item[]
  wishlist: string[]
  mustGo: string[]
  passed: string[]
  votes: Record<string, Partial<Record<string, Vote>>>
  signals: Record<Category, number>
  activity: Activity[]
  unseen: number
  visaRequested: boolean
  requests: Request[]
  toasts: Toast[]
  checking: boolean
  gaps: Gap[]
  swipedCount: number
  getExp: (id: string) => Experience | undefined
  swipeDeck: Experience[]
  dayItems: (day: number) => Item[]
  fitFor: (expId: string) => { level: 'strong' | 'possible' | 'later'; day: number; start: string; reason: string } | null
  addToDay: (expId: string, day: number, start: string) => void
  previewMove: (itemId: string, day: number, start: string) => string | null
  moveItem: (itemId: string, day: number, start: string) => void
  removeItem: (itemId: string) => void
  unlockItem: (itemId: string) => void
  toggleMust: (itemId: string) => void
  swipe: (expId: string, dir: 'left' | 'right' | 'super') => void
  undoSwipe: () => void
  addToWishlist: (expId: string) => void
  removeFromWishlist: (expId: string) => void
  vote: (expId: string, v: Vote) => void
  importReel: (mode: 'wishlist' | 'itinerary', ids?: string[]) => void
  runGapAction: (g: Gap) => void
  findSlot: (day: number, durationMin: number, zone: string, ignoreId?: string) => string | null
  confirmBooking: (target: { itemId?: string; expId?: string; day?: number; start?: string; title?: string }) => void
  requestVisa: () => void
  requestTransfer: () => void
  requestFlight: () => void
  addRequest: (r: Omit<Request, 'id' | 'when' | 'status'>) => void
  setRequestStatus: (id: string, s: Request['status']) => void
  markSeen: () => void
  simulateTeamChanges: () => void
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
  openBooking: { itemId?: string; expId?: string } | null
  setOpenBooking: (v: { itemId?: string; expId?: string } | null) => void
  openMove: string | null
  setOpenMove: (id: string | null) => void
  openConcierge: 'flight' | 'transfer' | 'visa' | null
  setOpenConcierge: (v: 'flight' | 'transfer' | 'visa' | null) => void
}

const C = createContext<Ctx | null>(null)
export const useTrip = () => {
  const v = useContext(C)
  if (!v) throw new Error('TripProvider missing')
  return v
}

const reelExps: Experience[] = SWITZERLAND_REEL.found.map((f) => ({
  id: f.id, title: f.title, area: f.area, type: 'Hidden gem', category: 'hidden', blurb: f.blurb,
  why: 'Found in your saved reel', imageKey: f.imageKey, durationMin: 180, zone: 'swiss', walkKm: 3,
}))

function sortDay(list: Item[]) {
  return [...list].sort((a, b) => hm(a.start) - hm(b.start))
}

function computeGaps(items: Item[], visaRequested: boolean): Gap[] {
  const gaps: Gap[] = []
  const byDay = (d: number) => sortDay(items.filter((i) => i.day === d))

  // transfer gap
  const arrival = items.find((i) => i.type === 'flight' && i.zone === 'heathrow' && hm(endOf(i)) >= 21 * 60)
  if (arrival && !items.some((i) => i.type === 'transfer' && i.day === arrival.day)) {
    gaps.push({
      id: 'g-transfer', type: 'Transfer', day: arrival.day, severity: 'high',
      title: 'No airport transfer on arrival night',
      detail: 'Your flight lands at 11:50 PM and nothing is arranged to get you from Heathrow to the hotel.',
      action: { label: 'Get transfer options', kind: 'transfer' },
    })
  }
  // return flight
  if (!items.some((i) => i.type === 'flight' && i.day === 6)) {
    gaps.push({
      id: 'g-flight', type: 'Flights', day: 6, severity: 'high',
      title: 'Return flight is missing',
      detail: 'You are checking out on 19 Dec but no flight home is added.',
      action: { label: 'Get flight options', kind: 'flight' },
    })
  }
  // visa
  if (!visaRequested) {
    gaps.push({
      id: 'g-visa', type: 'Visa', day: 0, severity: 'high',
      title: 'Check the Istanbul transit visa',
      detail: 'Your layover is 2 hr 15 min. Entry rules for Indian passports can differ by airport route.',
      action: { label: 'Ask the visa team', kind: 'visa' },
    })
  }
  // booking gaps
  items.filter((i) => i.needsBooking && !i.booked).forEach((i) => {
    gaps.push({
      id: `g-book-${i.id}`, type: 'Booking', day: i.day, itemId: i.id, severity: 'medium',
      title: `${i.title} has no booking`,
      detail: 'Timed entry sells out. Our team can lock a slot for you.',
      action: { label: 'Help me book', kind: 'book' },
    })
  })
  // per day checks
  for (let d = 1; d <= 5; d++) {
    const list = byDay(d)
    const flex = list.filter((i) => i.kind === 'flexible')
    // experience gap: largest free window 09:00 to 19:00
    let cursor = 9 * 60
    let best = 0
    let bestStart = cursor
    for (const i of list) {
      const s = hm(i.start)
      if (s - cursor > best) { best = s - cursor; bestStart = cursor }
      cursor = Math.max(cursor, hm(endOf(i)))
    }
    if (19 * 60 - cursor > best) { best = 19 * 60 - cursor; bestStart = cursor }
    if (best >= 300) {
      gaps.push({
        id: `g-free-${d}`, type: 'Experience', day: d, severity: 'low',
        title: `${Math.round(best / 60)} hrs free on Day ${d + 1}`,
        detail: `Open time from ${toHm(bestStart)} could fit something you would love.`,
        action: { label: 'Explore experiences', kind: 'explore' },
      })
    }
    // timing gaps between activities
    const act = list.filter((i) => i.type === 'activity' || i.type === 'experience')
    for (let k = 0; k < act.length - 1; k++) {
      const a = act[k], b = act[k + 1]
      const free = hm(b.start) - hm(endOf(a))
      const need = travelMinutes(a.zone, b.zone)
      if (free < need) {
        gaps.push({
          id: `g-time-${b.id}`, type: 'Timing', day: d, itemId: b.id, severity: 'medium',
          title: `Only ${free} min to reach ${b.title}`,
          detail: `Getting from ${a.title} takes about ${need} min.`,
          action: { label: 'Fix the timing', kind: 'rebalance' },
        })
      }
    }
    // overloaded
    const km = flex.reduce((s, i) => s + (i.walkKm ?? 0), 0)
    if (flex.length >= 4) {
      gaps.push({
        id: `g-over-${d}`, type: 'Overloaded', day: d, severity: 'medium',
        title: `Day ${d + 1} is packed`,
        detail: `${flex.length} stops across the city and a lot of moving around.`,
        action: { label: 'Rebalance this day', kind: 'rebalance' },
      })
    }
    if (TRIP.parentsAlong && km > 9) {
      gaps.push({
        id: `g-walk-${d}`, type: 'Walking', day: d, severity: 'medium',
        title: `About ${km.toFixed(1)} km of walking on Day ${d + 1}`,
        detail: 'Parents are travelling. That is a lot of walking in one day.',
        action: { label: 'Make it gentler', kind: 'rebalance' },
      })
    }
  }
  const order = { high: 0, medium: 1, low: 2 }
  return gaps.sort((a, b) => order[a.severity] - order[b.severity])
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [wishlist, setWishlist] = useState<string[]>(INITIAL_WISHLIST)
  const [mustGo, setMustGo] = useState<string[]>(['camden'])
  const [passed, setPassed] = useState<string[]>([])
  const [swiped, setSwiped] = useState<{ id: string; dir: 'left' | 'right' | 'super' }[]>([])
  const [votes, setVotes] = useState(INITIAL_VOTES)
  const [signals, setSignals] = useState<Record<Category, number>>({ culture: 4, local: 5, hidden: 3, nature: 2, adventure: 0, luxury: 1 })
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY)
  const [visaRequested, setVisaRequested] = useState(false)
  const [requests, setRequests] = useState<Request[]>(ADMIN_REQUESTS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [checking, setChecking] = useState(false)
  const [openBooking, setOpenBooking] = useState<{ itemId?: string; expId?: string } | null>(null)
  const [openMove, setOpenMove] = useState<string | null>(null)
  const [openConcierge, setOpenConcierge] = useState<'flight' | 'transfer' | 'visa' | null>(null)
  const [extras, setExtras] = useState<Experience[]>([])
  const toastId = useRef(1)
  const checkTimer = useRef<number | undefined>(undefined)

  const all = useMemo(() => [...CATALOG, ...reelExps, ...extras], [extras])
  const getExp = useCallback((id: string) => all.find((e) => e.id === id), [all])

  const recheck = useCallback(() => {
    setChecking(true)
    window.clearTimeout(checkTimer.current)
    checkTimer.current = window.setTimeout(() => setChecking(false), 1100)
  }, [])

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastId.current++
    setToasts((x) => [...x.slice(-2), { ...t, id }])
    window.setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 4800)
  }, [])
  const dismissToast = useCallback((id: number) => setToasts((x) => x.filter((y) => y.id !== id)), [])

  const log = useCallback((text: string) => {
    setActivity((a) => [{ id: `ac-${Date.now()}-${Math.random()}`, who: 'you', text, at: 'Just now' }, ...a])
  }, [])

  const gaps = useMemo(() => computeGaps(items, visaRequested), [items, visaRequested])
  const dayItems = useCallback((day: number) => sortDay(items.filter((i) => i.day === day)), [items])

  const findSlot = useCallback((day: number, durationMin: number, zone: string, ignoreId?: string) => {
    const list = sortDay(items.filter((i) => i.day === day && i.id !== ignoreId))
    for (let s = 9 * 60 + 30; s + durationMin <= 20 * 60; s += 30) {
      const e = s + durationMin
      const ok = list.every((i) => {
        const is = hm(i.start), ie = hm(endOf(i))
        if (e <= is) return is - e >= Math.min(travelMinutes(zone, i.zone), 30)
        if (s >= ie) return s - ie >= Math.min(travelMinutes(i.zone, zone), 30)
        return false
      })
      if (ok) return toHm(s)
    }
    return null
  }, [items])

  const previewMove = useCallback((itemId: string, day: number, start: string) => {
    const it = items.find((i) => i.id === itemId)
    if (!it) return null
    const s = hm(start), e = s + it.durationMin
    const others = items.filter((i) => i.day === day && i.id !== itemId)
    for (const o of others) {
      const os = hm(o.start), oe = hm(endOf(o))
      if (s < oe && e > os) {
        return `This clashes with ${o.title} at ${o.start}${o.kind === 'fixed' ? ', which is a confirmed booking' : ''}.`
      }
    }
    const next = sortDay(others).find((o) => hm(o.start) >= e)
    if (next && next.kind === 'fixed') {
      const free = hm(next.start) - e
      const need = travelMinutes(it.zone, next.zone)
      if (free < need) return `Only ${free} min before your ${next.start} booking. Getting there takes about ${need} min.`
    }
    return null
  }, [items])

  const fitFor = useCallback((expId: string) => {
    const e = getExp(expId)
    if (!e) return null
    if (e.zone === 'swiss') return { level: 'later' as const, day: 1, start: '10:00', reason: 'A different destination, saved for your Switzerland trip' }
    let best: { day: number; start: string; score: number; reason: string } | null = null
    for (let d = 1; d <= 5; d++) {
      const slot = findSlot(d, e.durationMin, e.zone)
      if (!slot) continue
      const near = dayItems(d).some((i) => i.zone === e.zone)
      const score = (near ? 2 : 0) + (dayItems(d).length < 3 ? 1 : 0) + (d === 3 ? 0.5 : 0)
      const reason = near ? `You are already nearby and have ${dur(e.durationMin)} free` : `Fits into a lighter day, ${dur(e.durationMin)} open`
      if (!best || score > best.score) best = { day: d, start: slot, score, reason }
    }
    if (best) {
      return { level: best.score >= 2 ? ('strong' as const) : ('possible' as const), day: best.day, start: best.start, reason: best.reason }
    }
    return { level: 'later' as const, day: 1, start: '10:00', reason: 'Your days are full right now' }
  }, [getExp, findSlot, dayItems])

  const addToDay = useCallback((expId: string, day: number, start: string) => {
    const e = getExp(expId)
    if (!e) return
    const it: Item = {
      id: `it-${expId}-${Date.now()}`, day, start, durationMin: e.durationMin, title: e.title, subtitle: e.area,
      type: e.type === 'Activity' || e.type === 'Attraction' || e.type === 'Day trip' ? 'activity' : 'experience',
      kind: 'flexible', zone: e.zone, imageKey: e.imageKey, walkKm: e.walkKm, needsBooking: e.needsBooking, mustDo: mustGo.includes(expId),
    }
    setItems((x) => [...x, it])
    setWishlist((w) => w.filter((i) => i !== expId))
    log(`added ${e.title} to Day ${day + 1}`)
    recheck()
    pushToast({ text: `${e.title} added to Day ${day + 1}`, tone: 'ok' })
  }, [getExp, log, mustGo, pushToast, recheck])

  const moveItem = useCallback((itemId: string, day: number, start: string) => {
    const it = items.find((i) => i.id === itemId)
    if (!it) return
    setItems((x) => x.map((i) => (i.id === itemId ? { ...i, day, start } : i)))
    log(`moved ${it.title} to Day ${day + 1}`)
    recheck()
    pushToast({ text: `Moved ${it.title} to Day ${day + 1}`, tone: 'ok' })
  }, [items, log, pushToast, recheck])

  const removeItem = useCallback((itemId: string) => {
    const it = items.find((i) => i.id === itemId)
    if (!it) return
    setItems((x) => x.filter((i) => i.id !== itemId))
    log(`removed ${it.title}`)
    recheck()
    pushToast({ text: `${it.title} removed`, tone: 'info', action: { label: 'Undo', run: () => setItems((x) => [...x, it]) } })
  }, [items, log, pushToast, recheck])

  const unlockItem = useCallback((itemId: string) => {
    setItems((x) => x.map((i) => (i.id === itemId ? { ...i, kind: 'flexible' } : i)))
    recheck()
  }, [recheck])

  const toggleMust = useCallback((itemId: string) => {
    setItems((x) => x.map((i) => (i.id === itemId ? { ...i, mustDo: !i.mustDo } : i)))
  }, [])

  const bump = useCallback((cat: Category, n = 1) => setSignals((s) => ({ ...s, [cat]: s[cat] + n })), [])

  const swipe = useCallback((expId: string, dir: 'left' | 'right' | 'super') => {
    const e = getExp(expId)
    if (!e) return
    setSwiped((s) => [...s, { id: expId, dir }])
    if (dir === 'left') {
      setPassed((p) => [...p, expId])
      bump(e.category, -0)
      return
    }
    setWishlist((w) => (w.includes(expId) ? w : [...w, expId]))
    if (dir === 'super') setMustGo((m) => (m.includes(expId) ? m : [...m, expId]))
    bump(e.category, dir === 'super' ? 3 : 1)
    log(`added ${e.title} to the wishlist`)
    pushToast({ text: dir === 'super' ? `${e.title} marked Must Go` : 'Saved to wishlist. You decide where it fits.', tone: 'ok' })
  }, [bump, getExp, log, pushToast])

  const undoSwipe = useCallback(() => {
    setSwiped((s) => {
      const last = s[s.length - 1]
      if (!last) return s
      setPassed((p) => p.filter((i) => i !== last.id))
      if (last.dir !== 'left') {
        setWishlist((w) => w.filter((i) => i !== last.id))
        setMustGo((m) => m.filter((i) => i !== last.id))
      }
      return s.slice(0, -1)
    })
  }, [])

  const addToWishlist = useCallback((expId: string) => {
    const e = getExp(expId)
    setWishlist((w) => (w.includes(expId) ? w : [...w, expId]))
    if (e) { bump(e.category); log(`added ${e.title} to the wishlist`); pushToast({ text: `${e.title} saved to wishlist`, tone: 'ok' }) }
  }, [bump, getExp, log, pushToast])
  const removeFromWishlist = useCallback((expId: string) => setWishlist((w) => w.filter((i) => i !== expId)), [])

  const vote = useCallback((expId: string, v: Vote) => {
    setVotes((x) => ({ ...x, [expId]: { ...x[expId], you: v } }))
    const e = getExp(expId)
    if (e && (v === 'must' || v === 'interested')) bump(e.category, v === 'must' ? 2 : 1)
  }, [bump, getExp])

  const importReel = useCallback((mode: 'wishlist' | 'itinerary', ids?: string[]) => {
    const list = ids ?? reelExps.map((r) => r.id)
    setWishlist((w) => [...w, ...list.filter((i) => !w.includes(i))])
    setExtras((x) => x)
    bump('hidden', list.length)
    log(`added ${list.length} experiences from a saved reel`)
    pushToast({ text: mode === 'wishlist' ? `${list.length} experiences saved to your wishlist` : `${list.length} experiences added`, tone: 'ok' })
  }, [bump, log, pushToast])

  const requestVisa = useCallback(() => { setVisaRequested(true); recheck() }, [recheck])
  const requestTransfer = useCallback(() => {
    setItems((x) => [...x, { id: 'tr-1', day: 0, start: '23:55', durationMin: 60, title: 'Airport transfer, Heathrow to hotel', subtitle: 'Requested, team confirming price', type: 'transfer', kind: 'fixed', zone: 'heathrow', imageKey: 'london', status: 'requested' }])
    recheck()
  }, [recheck])
  const requestFlight = useCallback(() => {
    setItems((x) => [...x, { id: 'fl3', day: 6, start: '15:30', end: '04:55', durationMin: 600, title: 'London to Hyderabad', subtitle: 'Requested, team sourcing options', type: 'flight', kind: 'fixed', zone: 'heathrow', imageKey: 'flight', status: 'requested' }])
    recheck()
  }, [recheck])

  const addRequest = useCallback((r: Omit<Request, 'id' | 'when' | 'status'>) => {
    setRequests((x) => [{ ...r, id: `r-${Date.now()}`, when: 'Just now', status: 'New' }, ...x])
  }, [])
  const setRequestStatus = useCallback((id: string, s: Request['status']) => setRequests((x) => x.map((r) => (r.id === id ? { ...r, status: s } : r))), [])

  const confirmBooking = useCallback((t: { itemId?: string; expId?: string; day?: number; start?: string; title?: string }) => {
    if (t.itemId) {
      setItems((x) => x.map((i) => (i.id === t.itemId ? { ...i, booked: true, kind: 'fixed', status: 'confirmed', bookingRef: 'WF-' + Math.floor(10000 + Math.random() * 89999) } : i)))
      const it = items.find((i) => i.id === t.itemId)
      if (it) log(`booked ${it.title}`)
    }
    recheck()
    pushToast({ text: 'Booking confirmed. It is now a fixed part of your trip.', tone: 'ok' })
  }, [items, log, pushToast, recheck])

  const markSeen = useCallback(() => setActivity((a) => a.map((x) => ({ ...x, unseen: false }))), [])
  const simulateTeamChanges = useCallback(() => {
    const more: Activity[] = [
      { id: `s1-${Date.now()}`, who: 'arpit', text: 'added Regent\'s Canal to the wishlist', at: 'Just now', unseen: true },
      { id: `s2-${Date.now()}`, who: 'arpit', text: 'marked Kew Gardens as Interested', at: 'Just now', unseen: true },
      { id: `s3-${Date.now()}`, who: 'arpit', text: 'moved Covent Garden to the afternoon', at: 'Just now', unseen: true },
      { id: `s4-${Date.now()}`, who: 'arpit', text: 'added a note to Day 3', at: 'Just now', unseen: true },
    ]
    setActivity((a) => [...more, ...a])
    pushToast({ text: 'Arpit made 4 changes to your London trip. View updates.', tone: 'info' })
  }, [pushToast])

  const runGapAction = useCallback((g: Gap) => {
    switch (g.action.kind) {
      case 'transfer': setOpenConcierge('transfer'); break
      case 'flight': setOpenConcierge('flight'); break
      case 'visa': setOpenConcierge('visa'); break
      case 'book': setOpenBooking({ itemId: g.itemId }); break
      case 'rebalance': {
        const d = g.day ?? 4
        const flex = sortDay(items.filter((i) => i.day === d && i.kind === 'flexible'))
        const mover = flex[flex.length - 1]
        if (!mover) break
        const days = [1, 2, 3, 4, 5].filter((x) => x !== d).sort((a, b) => items.filter((i) => i.day === a).length - items.filter((i) => i.day === b).length)
        for (const nd of days) {
          const slot = findSlot(nd, mover.durationMin, mover.zone)
          if (slot) { moveItem(mover.id, nd, slot); return }
        }
        pushToast({ text: 'No room elsewhere. Try removing something.', tone: 'warn' })
        break
      }
      case 'explore': window.location.hash = '#/trip/discover'; break
    }
  }, [findSlot, items, moveItem, pushToast])

  useEffect(() => () => window.clearTimeout(checkTimer.current), [])

  const swipeDeck = useMemo(() => {
    const done = new Set([...swiped.map((s) => s.id), ...wishlist, ...items.map((i) => i.title)])
    return all.filter((e) => !done.has(e.id) && !done.has(e.title) && !e.id.startsWith('sw'))
  }, [all, swiped, wishlist, items])

  const unseen = activity.filter((a) => a.unseen).length

  const value: Ctx = {
    items, wishlist, mustGo, passed, votes, signals, activity, unseen, visaRequested, requests, toasts, checking, gaps,
    swipedCount: swiped.length, getExp, swipeDeck, dayItems, fitFor, addToDay, previewMove, moveItem, removeItem, unlockItem, toggleMust,
    swipe, undoSwipe, addToWishlist, removeFromWishlist, vote, importReel, runGapAction, findSlot, confirmBooking, requestVisa,
    requestTransfer, requestFlight, addRequest, setRequestStatus, markSeen, simulateTeamChanges, pushToast, dismissToast,
    openBooking, setOpenBooking, openMove, setOpenMove, openConcierge, setOpenConcierge,
  }
  return <C.Provider value={value}>{children}</C.Provider>
}

export { DAYS }
