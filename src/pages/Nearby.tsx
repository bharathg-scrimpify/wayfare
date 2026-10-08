import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MagnifyingGlass, NavigationArrow, Plus, BookmarkSimple, Clock, PersonSimpleWalk, CircleNotch, CheckCircle, MapPin } from '@phosphor-icons/react'
import { Button, Img, PageTitle } from '../components/ui'
import { dur } from '../data/mock'
import { useTrip } from '../store/trip'

const Z = 14
const proj = (lat: number, lon: number) => {
  const n = 256 * 2 ** Z
  const x = ((lon + 180) / 360) * n
  const r = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n
  return { x, y }
}
const CENTER = proj(51.5155, -0.1235)
const W = 340, H = 300

const PLACES: Record<string, { lat: number; lon: number; walk: number }> = {
  soane: { lat: 51.5169, lon: -0.1176, walk: 6 },
  lambs: { lat: 51.5226, lon: -0.1181, walk: 8 },
  nealsyard: { lat: 51.5139, lon: -0.1266, walk: 11 },
  cecil: { lat: 51.5110, lon: -0.1288, walk: 14 },
}
const YOU = { lat: 51.5194, lon: -0.1270 }

export default function Nearby() {
  const { getExp, addToDay, findSlot, addToWishlist, pushToast, items } = useTrip()
  const [phase, setPhase] = useState<'idle' | 'scan' | 'done'>('idle')
  const [added, setAdded] = useState<string[]>([])
  const tiles = useMemo(() => {
    const tx0 = Math.floor((CENTER.x - W / 2) / 256), ty0 = Math.floor((CENTER.y - H / 2) / 256)
    const out: { x: number; y: number; url: string }[] = []
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const tx = tx0 + i, ty = ty0 + j
      out.push({ x: tx * 256 - CENTER.x + W / 2, y: ty * 256 - CENTER.y + H / 2, url: `https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png` })
    }
    return out
  }, [])
  const pin = (lat: number, lon: number) => { const p = proj(lat, lon); return { left: p.x - CENTER.x + W / 2, top: p.y - CENTER.y + H / 2 } }
  const next = items.filter((i) => i.day === 2 && i.start >= '12:00').sort((a, b) => a.start.localeCompare(b.start))[0]

  const scan = () => { setPhase('scan'); setTimeout(() => setPhase('done'), 1500) }
  const addToday = (id: string) => {
    const e = getExp(id)
    if (!e) return
    const slot = findSlot(2, e.durationMin, e.zone)
    if (!slot) return pushToast({ text: 'That would clash with your plan today', tone: 'warn' })
    addToDay(id, 2, slot)
    setAdded((a) => [...a, id])
    setTimeout(() => pushToast({ text: `Checked. Still works with ${next?.title ?? 'your next stop'}.`, tone: 'ok' }), 700)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10">
      <PageTitle title="What is around me" sub="On the trip, tap once. We fit ideas into the gap you actually have." />
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto]">
        <div className="order-2 grid gap-4 lg:order-1 lg:max-w-[520px]">
          <p className="text-[18px] leading-relaxed text-ink-2">We look at where you are, the time, how long until your next stop, your taste and your group. Then show three to five things worth doing, never a long list.</p>
          <ul className="grid gap-3">
            {['Your location and the time', 'Free time before your next plan', 'Your next itinerary item', 'What you and your group liked before'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[16px] font-semibold"><CheckCircle size={22} weight="fill" className="text-ok" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="order-1 mx-auto lg:order-2">
          <div className="relative h-[760px] w-[390px] max-w-full overflow-hidden rounded-[52px] border-[10px] border-ink bg-white shadow-[var(--shadow-lift)]">
            <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />
            <div className="no-scrollbar h-full overflow-y-auto px-4 pb-8 pt-12">
              <p className="text-[13px] font-semibold text-ink-3">Tuesday 15 Dec, 12:05 PM</p>
              <h2 className="text-[26px] font-extrabold leading-tight tracking-tight">Around you</h2>
              <div className="mt-3 rounded-3xl bg-brand-soft p-4 text-[14px] leading-relaxed">
                <p className="font-extrabold">Your British Museum visit ended at 12:00 PM.</p>
                <p className="text-ink-2">{next ? `${next.title} starts at ${next.start.replace(/^0/, '')}. That is a ${dur(120 - 5)} window.` : 'Nothing booked next.'}</p>
              </div>

              <div className="relative mt-3 overflow-hidden rounded-3xl bg-surface" style={{ width: '100%', height: H }}>
                <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: W, height: H }}>
                  {tiles.map((t) => <img key={t.url} src={t.url} alt="" draggable={false} className="absolute h-[256px] w-[256px] max-w-none" style={{ left: t.x, top: t.y }} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />)}
                  {(() => { const p = pin(YOU.lat, YOU.lon); return (
                    <span className="absolute -translate-x-1/2 -translate-y-1/2" style={p}><span className="absolute inset-0 -m-3 animate-ping rounded-full bg-[#2563eb]/30" /><span className="relative block h-5 w-5 rounded-full border-[3px] border-white bg-[#2563eb] shadow" /></span>
                  ) })()}
                  <AnimatePresence>
                    {phase === 'done' && Object.entries(PLACES).map(([id, p], i) => {
                      const pos = pin(p.lat, p.lon)
                      return <motion.span key={id} initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 400, damping: 18 }} className="absolute -translate-x-1/2 -translate-y-full" style={pos}><MapPin size={32} weight="fill" className="text-brand drop-shadow" /></motion.span>
                    })}
                  </AnimatePresence>
                </div>
                <span className="absolute bottom-1 right-2 text-[9px] text-ink-3">Map data OpenStreetMap contributors</span>
              </div>

              {phase !== 'done' && (
                <Button size="lg" className="mt-4 w-full" onClick={scan} disabled={phase === 'scan'} icon={phase === 'scan' ? <CircleNotch size={20} className="animate-spin" /> : <MagnifyingGlass size={20} weight="bold" />}>{phase === 'scan' ? 'Looking around' : 'What is around me?'}</Button>
              )}

              {phase === 'done' && (
                <ul className="mt-4 grid gap-3">
                  {Object.keys(PLACES).map((id, i) => {
                    const e = getExp(id)
                    if (!e) return null
                    const isAdded = added.includes(id)
                    return (
                      <motion.li key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="overflow-hidden rounded-3xl border border-line">
                        <Img k={e.imageKey} className="h-28 w-full" w={500} h={260} />
                        <div className="p-3.5">
                          <p className="text-[12px] font-bold text-ink-3">{e.type}</p>
                          <p className="text-[17px] font-extrabold leading-tight">{e.title}</p>
                          <div className="mt-1 flex gap-3 text-[13px] text-ink-2"><span className="inline-flex items-center gap-1"><PersonSimpleWalk size={14} weight="bold" />{PLACES[id].walk} min walk</span><span className="inline-flex items-center gap-1"><Clock size={14} weight="bold" />{dur(e.durationMin)}</span></div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" v="dark" icon={<NavigationArrow size={14} weight="fill" />} onClick={() => pushToast({ text: `Walking directions to ${e.title}`, tone: 'info' })}>Go now</Button>
                            <Button size="sm" v={isAdded ? 'soft' : 'outline'} disabled={isAdded} icon={<Plus size={14} weight="bold" />} onClick={() => addToday(id)}>{isAdded ? 'Added' : 'Add to today'}</Button>
                            <Button size="sm" v="ghost" aria-label="Save" onClick={() => addToWishlist(id)}><BookmarkSimple size={16} weight="bold" /></Button>
                          </div>
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
