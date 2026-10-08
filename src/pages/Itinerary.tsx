import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import {
  ArrowsLeftRight, Trash, Star, LockOpen, Hammer, Sparkle, UserCircle, Plus, Warning, ClockCountdown, Check, CalendarCheck, CircleNotch, Heart,
} from '@phosphor-icons/react'
import { Button, Chip, Img, KindBadge, PageTitle, Segmented, Sheet } from '../components/ui'
import { DAYS, TRIP, dur, endOf, fmt12, hm, type Item } from '../data/mock'
import { useTrip, type Gap } from '../store/trip'

type Mode = 'self' | 'auto' | 'expert'

export default function Itinerary() {
  const { dayItems, gaps, wishlist, getExp, fitFor, addToDay, setOpenMove, removeItem, unlockItem, toggleMust, runGapAction, setOpenBooking } = useTrip()
  const loc = useLocation()
  const nav = useNavigate()
  const [day, setDay] = useState(2)
  const [mode, setMode] = useState<Mode>('self')
  const [warn, setWarn] = useState<{ item: Item; action: 'unlock' | 'remove' } | null>(null)
  const [auto, setAuto] = useState(false)
  const [expert, setExpert] = useState(false)

  useEffect(() => {
    const d = new URLSearchParams(loc.search).get('day')
    if (d) setDay(Number(d))
  }, [loc.search])

  const list = dayItems(day)
  const dayGaps = gaps.filter((g) => g.day === day && !g.itemId)
  const gapFor = (id: string): Gap | undefined => gaps.find((g) => g.itemId === id)

  const rows = useMemo(() => {
    const out: ({ t: 'item'; item: Item } | { t: 'free'; from: string; mins: number; key: string })[] = []
    let cursor = hm('09:00')
    list.forEach((it) => {
      const s = hm(it.start)
      if (it.type !== 'hotel' && s - cursor >= 90 && day > 0 && day < 6) out.push({ t: 'free', from: `${String(Math.floor(cursor / 60)).padStart(2, '0')}:${String(cursor % 60).padStart(2, '0')}`, mins: s - cursor, key: `f-${it.id}` })
      out.push({ t: 'item', item: it })
      cursor = Math.max(cursor, hm(endOf(it)))
    })
    if (day > 0 && day < 6 && 19 * 60 - cursor >= 90) out.push({ t: 'free', from: `${String(Math.floor(cursor / 60)).padStart(2, '0')}:${String(cursor % 60).padStart(2, '0')}`, mins: 19 * 60 - cursor, key: 'f-end' })
    return out
  }, [list, day])

  const onMode = (m: Mode) => { setMode(m); if (m === 'auto') setAuto(true); if (m === 'expert') setExpert(true) }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10">
      <PageTitle title="Day by day" sub="Fixed things stay put. Flexible things move. Wishlist waits until you decide."
        right={<Segmented<Mode> value={mode} onChange={onMode} options={[{ id: 'self', label: 'Build it myself', icon: <Hammer size={16} weight="bold" /> }, { id: 'auto', label: 'Create it for me', icon: <Sparkle size={16} weight="bold" /> }, { id: 'expert', label: 'Talk to an expert', icon: <UserCircle size={16} weight="bold" /> }]} />} />

      <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {DAYS.map((d) => (
          <button key={d.index} onClick={() => setDay(d.index)} aria-pressed={day === d.index}
            className={clsx('relative flex h-[68px] w-[78px] shrink-0 flex-col items-center justify-center rounded-3xl border text-center transition-colors', day === d.index ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink/50')}>
            <span className="text-[12px] font-semibold opacity-70">{d.short}</span>
            <span className="text-[17px] font-extrabold">{d.date.split(' ')[0]}</span>
            {gaps.some((g) => g.day === d.index) && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white" />}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-[26px] font-extrabold tracking-tight">Day {day + 1}, {DAYS[day].city}</h2>
            <span className="text-[15px] text-ink-2">{DAYS[day].short} {DAYS[day].date}</span>
          </div>

          <AnimatePresence initial={false}>
            {dayGaps.map((g) => (
              <motion.div key={g.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mb-3 flex items-center gap-3 rounded-3xl bg-warn-soft p-4">
                  <Warning size={22} weight="fill" className="shrink-0 text-warn" />
                  <div className="min-w-0 flex-1"><p className="text-[15px] font-bold text-ink">{g.title}</p><p className="text-[13px] text-ink-2">{g.detail}</p></div>
                  <Button size="sm" v="dark" onClick={() => (g.action.kind === 'explore' ? nav('/trip/discover') : runGapAction(g))}>{g.action.label}</Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <ol className="relative grid gap-3">
            <AnimatePresence initial={false}>
              {rows.map((r) =>
                r.t === 'free' ? (
                  <motion.li key={r.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 pl-0 sm:pl-[88px]">
                    <div className="flex flex-1 items-center gap-3 rounded-3xl border border-dashed border-ink/25 px-4 py-3 text-[14px] text-ink-2">
                      <ClockCountdown size={18} /> Free time, {dur(r.mins)}
                      {r.mins >= 180 && <button onClick={() => nav('/trip/discover')} className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-bold text-ink shadow-[var(--shadow-soft)]"><Plus size={14} weight="bold" /> Fill it</button>}
                    </div>
                  </motion.li>
                ) : (
                  <motion.li key={r.item.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex gap-4">
                    <div className="hidden w-[72px] shrink-0 pt-4 text-right sm:block">
                      <p className="text-[15px] font-extrabold">{fmt12(r.item.start).replace(' ', '\u00a0')}</p>
                      <p className="text-[12px] text-ink-3">{dur(r.item.durationMin)}</p>
                    </div>
                    <ItemCard item={r.item} gap={gapFor(r.item.id)}
                      onMove={() => setOpenMove(r.item.id)}
                      onRemove={() => (r.item.kind === 'fixed' ? setWarn({ item: r.item, action: 'remove' }) : removeItem(r.item.id))}
                      onUnlock={() => setWarn({ item: r.item, action: 'unlock' })}
                      onMust={() => toggleMust(r.item.id)}
                      onBook={() => setOpenBooking({ itemId: r.item.id })}
                      onGap={() => { const g = gapFor(r.item.id); if (g) runGapAction(g) }} />
                  </motion.li>
                ),
              )}
            </AnimatePresence>
          </ol>
          {list.length === 0 && <p className="rounded-3xl bg-surface p-8 text-center text-ink-2">Nothing here yet. Add from your wishlist.</p>}
        </div>

        <aside className="lg:sticky lg:top-[170px] lg:self-start">
          <div className="rounded-[28px] border border-line p-5">
            <div className="mb-1 flex items-center justify-between"><h3 className="text-[19px] font-extrabold">Wishlist</h3><KindBadge kind="wishlist" small /></div>
            <p className="mb-4 text-[14px] text-ink-2">Liked, but not placed yet. You decide what enters the plan.</p>
            <ul className="grid gap-3">
              {wishlist.slice(0, 4).map((id) => {
                const e = getExp(id)
                const f = fitFor(id)
                if (!e) return null
                return (
                  <li key={id} className="rounded-3xl bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <Img k={e.imageKey} className="h-12 w-12 shrink-0 rounded-2xl" w={150} h={150} />
                      <div className="min-w-0 flex-1"><p className="truncate text-[15px] font-bold">{e.title}</p><p className="text-[12px] text-ink-2">{dur(e.durationMin)}</p></div>
                    </div>
                    {f && f.level !== 'later' ? (
                      <Button size="sm" v="dark" className="mt-3 w-full" onClick={() => addToDay(id, f.day, f.start)}>Add to Day {f.day + 1}, {fmt12(f.start)}</Button>
                    ) : <p className="mt-2 text-[12px] text-ink-2">{f?.reason}</p>}
                  </li>
                )
              })}
            </ul>
            <Button v="outline" className="mt-4 w-full" onClick={() => nav('/trip/wishlist')}>Open wishlist</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold text-ink-2"><KindBadge kind="fixed" small /> booked, time bound <KindBadge kind="flexible" small /> can move</div>
        </aside>
      </div>

      <Sheet open={!!warn} onClose={() => setWarn(null)} title="Hold on">
        {warn && (
          <>
            <div className="flex items-start gap-3 rounded-3xl bg-warn-soft p-5 text-warn"><Warning size={26} weight="fill" className="shrink-0" /><p className="text-[16px] font-bold">This is linked to a confirmed booking. Changing it may affect your trip.</p></div>
            <p className="mt-4 text-[15px] text-ink-2">{warn.item.title}{warn.item.bookingRef ? `, reference ${warn.item.bookingRef}` : ''}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button v="outline" onClick={() => setWarn(null)}>Keep it fixed</Button>
              <Button v="dark" onClick={() => { if (warn.action === 'unlock') unlockItem(warn.item.id); else removeItem(warn.item.id); setWarn(null) }}>{warn.action === 'unlock' ? 'Unlock it' : 'Remove it anyway'}</Button>
            </div>
          </>
        )}
      </Sheet>

      <AutoSheet open={auto} onClose={() => { setAuto(false); setMode('self') }} />
      <ExpertSheet open={expert} onClose={() => { setExpert(false); setMode('self') }} />
    </div>
  )
}

function ItemCard({ item, gap, onMove, onRemove, onUnlock, onMust, onBook, onGap }: { item: Item; gap?: Gap; onMove: () => void; onRemove: () => void; onUnlock: () => void; onMust: () => void; onBook: () => void; onGap: () => void }) {
  const fixed = item.kind === 'fixed'
  return (
    <div className={clsx('relative flex-1 overflow-hidden rounded-[24px] border bg-white transition-shadow hover:shadow-[var(--shadow-soft)]', fixed ? 'border-ink/80' : 'border-line')}>
      <div className="flex gap-4 p-3">
        <Img k={item.imageKey} className="h-[92px] w-[92px] shrink-0 rounded-[20px]" w={300} h={300} />
        <div className="min-w-0 flex-1 py-0.5">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <KindBadge kind={item.kind} small />
            {item.status === 'requested' && <span className="rounded-full bg-warn-soft px-2 py-0.5 text-[11px] font-bold text-warn">Requested</span>}
            {item.mustDo && <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand-dark"><Star size={11} weight="fill" /> Must do</span>}
            <span className="text-[12px] font-semibold text-ink-3 sm:hidden">{fmt12(item.start)}</span>
          </div>
          <p className="truncate text-[17px] font-extrabold leading-snug">{item.title}</p>
          {item.subtitle && <p className="line-clamp-1 text-[14px] text-ink-2">{item.subtitle}</p>}
          {gap && (
            <button onClick={onGap} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-3 py-1 text-[12px] font-bold text-warn underline decoration-wavy decoration-warn/60 underline-offset-4">
              <Warning size={12} weight="fill" /> {gap.type === 'Booking' ? 'No booking attached' : gap.type === 'Timing' ? 'Tight timing' : gap.type}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-t border-line px-3 py-2">
        {!fixed && <ActBtn icon={<ArrowsLeftRight size={16} weight="bold" />} label="Move" onClick={onMove} />}
        {fixed && item.type !== 'hotel' && item.type !== 'flight' && <ActBtn icon={<LockOpen size={16} weight="bold" />} label="Unlock" onClick={onUnlock} />}
        {item.needsBooking && !item.booked && <ActBtn icon={<CalendarCheck size={16} weight="bold" />} label="Help me book" onClick={onBook} strong />}
        <ActBtn icon={<Star size={16} weight={item.mustDo ? 'fill' : 'bold'} />} label={item.mustDo ? 'Must do' : 'Mark must do'} onClick={onMust} />
        <ActBtn icon={<Trash size={16} weight="bold" />} label="Remove" onClick={onRemove} className="ml-auto" />
      </div>
    </div>
  )
}

function ActBtn({ icon, label, onClick, className, strong }: { icon: React.ReactNode; label: string; onClick: () => void; className?: string; strong?: boolean }) {
  return (
    <button onClick={onClick} className={clsx('inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors', strong ? 'bg-ink text-white hover:bg-black' : 'text-ink-2 hover:bg-surface hover:text-ink', className)}>{icon}{label}</button>
  )
}

function AutoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wishlist, items, fitFor, addToDay, pushToast, swipedCount } = useTrip()
  const [n, setN] = useState(0)
  const lines = [
    `Reading your ${wishlist.length} saved places`,
    `Locking in ${items.filter((i) => i.kind === 'fixed').length} confirmed bookings`,
    `Learning from ${14 + swipedCount} swipes`,
    'Placing what fits and leaving breathing room',
  ]
  useEffect(() => {
    if (!open) { setN(0); return }
    const ts = lines.map((_, i) => setTimeout(() => setN(i + 1), 800 * (i + 1)))
    const d = setTimeout(() => {
      let c = 0
      wishlist.forEach((id) => { const f = fitFor(id); if (f && f.level === 'strong' && c < 2) { addToDay(id, f.day, f.start); c++ } })
      pushToast({ text: c ? `Placed ${c} wishlist picks. Everything else is untouched.` : 'Your plan already fits what you saved.', tone: 'ok' })
      onClose()
    }, 800 * lines.length + 900)
    return () => { ts.forEach(clearTimeout); clearTimeout(d) }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Sheet open={open} onClose={onClose} title="Creating your trip">
      <ul className="grid gap-3 py-2">
        {lines.map((l, i) => (
          <li key={l} className={clsx('flex items-center gap-3 text-[16px] transition-opacity', i < n ? 'opacity-100' : 'opacity-30')}>
            <span className={clsx('flex h-7 w-7 items-center justify-center rounded-full', i < n ? 'bg-ok text-white' : 'bg-surface')}>{i < n ? <Check size={14} weight="bold" /> : i === n ? <CircleNotch size={14} className="animate-spin" /> : null}</span>{l}
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-3xl bg-surface p-4 text-[14px] text-ink-2">We organise your choices. We do not replace them, and you can change anything after.</p>
    </Sheet>
  )
}

function ExpertSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addRequest, pushToast } = useTrip()
  const [slot, setSlot] = useState('')
  const slots = ['Today, 6:30 PM', 'Today, 8:00 PM', 'Tomorrow, 11:00 AM', 'Tomorrow, 4:30 PM']
  return (
    <Sheet open={open} onClose={onClose} title="Talk to a trip expert"
      footer={<Button size="lg" className="w-full" disabled={!slot} onClick={() => { addRequest({ traveller: 'You (Tanya\'s birthday trip)', type: 'Trip build', trip: 'London, 13 to 19 Dec', summary: `Call booked for ${slot}. Full trip context attached.` }); pushToast({ text: `Call booked for ${slot}. Added to your calendar.`, tone: 'ok' }); onClose() }}>Book this call</Button>}>
      <p className="mb-4 text-[15px] text-ink-2">Not feeling the plan? A real specialist reviews your whole trip first, so you never repeat yourself.</p>
      <div className="mb-4 flex items-center gap-3 rounded-3xl bg-surface p-4"><Img k="hotel" className="h-12 w-12 rounded-full" w={120} h={120} /><div><p className="font-extrabold">Aditi from the trip team</p><p className="text-[13px] text-ink-2">Knows London, speaks Hindi and English</p></div></div>
      <div className="flex flex-wrap gap-2">{slots.map((s) => <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>{s}</Chip>)}</div>
      <p className="mt-4 text-[13px] text-ink-3">Syncs with Google Calendar once you confirm.</p>
    </Sheet>
  )
}

export { TRIP, Heart }
