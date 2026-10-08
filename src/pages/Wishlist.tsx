import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { Heart, Star, Trash, CalendarPlus, Clock } from '@phosphor-icons/react'
import { Button, Chip, Img, KindBadge, PageTitle, Segmented } from '../components/ui'
import { DAYS, dur, fmt12 } from '../data/mock'
import { useTrip } from '../store/trip'

const META = {
  strong: { t: 'Strong fit', d: 'Easy to include. You have the time and you are nearby.', c: 'bg-ok-soft text-ok' },
  possible: { t: 'Possible fit', d: 'Works with a little adjustment.', c: 'bg-warn-soft text-warn' },
  later: { t: 'Saved for later', d: 'Hard to fit right now. It stays safe here.', c: 'bg-surface text-ink-2' },
} as const

export default function Wishlist() {
  const { wishlist, getExp, fitFor, addToDay, removeFromWishlist, findSlot, mustGo, pushToast } = useTrip()
  const nav = useNavigate()
  const [other, setOther] = useState<string | null>(null)
  const groups = (['strong', 'possible', 'later'] as const).map((lvl) => ({ lvl, ids: wishlist.filter((id) => fitFor(id)?.level === lvl) }))

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 md:px-10">
      <PageTitle title="Your wishlist" sub="Liked, but not placed yet. We suggest where things could go. You decide."
        right={<Segmented value="wish" onChange={(v) => v === 'swipe' && nav('/trip/discover')} options={[{ id: 'swipe', label: 'Swipe' }, { id: 'wish', label: 'Wishlist' }]} />} />

      {wishlist.length === 0 && <p className="rounded-3xl bg-surface p-10 text-center text-ink-2">Nothing saved yet. Swipe right on ideas you like.</p>}

      {groups.map(({ lvl, ids }) => ids.length > 0 && (
        <section key={lvl} className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className={clsx('rounded-full px-3 py-1 text-[13px] font-bold', META[lvl].c)}>{META[lvl].t}</span>
            <span className="text-[14px] text-ink-2">{META[lvl].d}</span>
          </div>
          <ul className="grid gap-4">
            <AnimatePresence initial={false}>
              {ids.map((id) => {
                const e = getExp(id)
                const f = fitFor(id)
                if (!e || !f) return null
                return (
                  <motion.li key={id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="overflow-hidden rounded-[28px] border border-line">
                    <div className="flex flex-col gap-4 p-3 sm:flex-row">
                      <Img k={e.imageKey} className="h-44 w-full shrink-0 rounded-3xl sm:h-auto sm:w-48" w={500} h={400} />
                      <div className="min-w-0 flex-1 py-1 pr-2">
                        <div className="flex flex-wrap items-center gap-2"><KindBadge kind="wishlist" small />{mustGo.includes(id) && <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand-dark"><Star size={11} weight="fill" /> Must go</span>}</div>
                        <p className="mt-1 text-[22px] font-extrabold leading-tight">{e.title}</p>
                        <p className="text-[14px] text-ink-2">{e.area}, {dur(e.durationMin)}</p>
                        <div className={clsx('mt-3 rounded-2xl p-3 text-[14px] leading-relaxed', META[lvl].c)}>
                          {lvl === 'later' ? f.reason : <><span className="font-extrabold">Day {f.day + 1}, {fmt12(f.start)}.</span> {f.reason}.</>}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {lvl !== 'later' && <Button size="sm" v="dark" icon={<CalendarPlus size={16} weight="bold" />} onClick={() => addToDay(id, f.day, f.start)}>Add to Day {f.day + 1}</Button>}
                          <Button size="sm" v="outline" onClick={() => setOther(other === id ? null : id)}>Choose another day</Button>
                          <Button size="sm" v="ghost" icon={<Heart size={16} weight="fill" />} onClick={() => pushToast({ text: `${e.title} stays in your wishlist`, tone: 'info' })}>Keep</Button>
                          <button onClick={() => removeFromWishlist(id)} aria-label="Remove" className="ml-auto flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface"><Trash size={16} /></button>
                        </div>
                        <AnimatePresence>
                          {other === id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="flex flex-wrap gap-2 pt-3">
                                {DAYS.slice(1, 6).map((d) => {
                                  const slot = findSlot(d.index, e.durationMin, e.zone)
                                  return <Chip key={d.index} className={clsx(!slot && 'opacity-40')} onClick={() => { if (slot) { addToDay(id, d.index, slot); setOther(null) } else pushToast({ text: `Day ${d.index + 1} is full`, tone: 'warn' }) }} icon={<Clock size={14} weight="bold" />}>Day {d.index + 1}{slot ? `, ${fmt12(slot)}` : ', full'}</Chip>
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </section>
      ))}
    </div>
  )
}
