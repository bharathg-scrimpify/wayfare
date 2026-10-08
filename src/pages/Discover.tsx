import { useEffect, useRef, type Ref, useImperativeHandle } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import clsx from 'clsx'
import { X, Heart, Star, ArrowUUpLeft, Clock, PersonSimpleWalk, Sparkle } from '@phosphor-icons/react'
import { Img, PageTitle, Segmented } from '../components/ui'
import { dur, type Category, type Experience } from '../data/mock'
import { useTrip } from '../store/trip'

type Dir = 'left' | 'right' | 'super'
interface Handle { fling: (d: Dir) => void }

const LABEL: Record<Category, string> = { culture: 'Culture', local: 'Local life', hidden: 'Hidden gems', nature: 'Nature', adventure: 'Adventure', luxury: 'Luxury' }

export default function Discover() {
  const { swipeDeck, swipe, undoSwipe, swipedCount, signals } = useTrip()
  const nav = useNavigate()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const top = useRef<Handle>(null)
  const reduce = useReducedMotion()
  const deck = swipeDeck.slice(0, 3)

  const fling = (d: Dir) => top.current?.fling(d)
  const done = (id: string, d: Dir) => { swipe(id, d); x.set(0); y.set(0) }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') fling('left')
      if (e.key === 'ArrowRight') fling('right')
      if (e.key === 'ArrowUp') fling('super')
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const ranked = (Object.keys(signals) as Category[]).sort((a, b) => signals[b] - signals[a]).filter((k) => signals[k] > 0)

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10">
      <PageTitle title="Find your kind of London" sub="Swipe right on what you like. Nothing lands in your plan until you place it." compact
        right={<Segmented value="swipe" onChange={(v) => v === 'wish' && nav('/trip/wishlist')} options={[{ id: 'swipe', label: 'Swipe' }, { id: 'wish', label: 'Wishlist' }]} />} />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col items-center">
          <div className="relative h-[calc(100dvh-400px)] min-h-[360px] max-h-[600px] w-full max-w-[400px] md:h-[600px]" style={{ touchAction: 'pan-y' }}>
            {deck.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center rounded-[32px] border border-dashed border-ink/25 p-8 text-center">
                <Sparkle size={44} weight="fill" className="text-brand" />
                <p className="mt-4 text-[22px] font-extrabold">You are all caught up</p>
                <p className="mt-2 text-ink-2">We will bring fresh ideas as your plan changes.</p>
                <button onClick={() => nav('/trip/wishlist')} className="mt-5 rounded-full bg-ink px-6 py-3 font-semibold text-white">See your wishlist</button>
              </div>
            )}
            {[...deck].reverse().map((exp, ri) => {
              const idx = deck.length - 1 - ri
              return idx === 0 ? (
                <SwipeCard key={exp.id} exp={exp} x={x} y={y} ref={top} reduce={!!reduce} onSwiped={(d) => done(exp.id, d)} />
              ) : (
                <Behind key={exp.id} exp={exp} depth={idx} x={x} />
              )
            })}
          </div>

          <div className="mt-8 flex items-center gap-5">
            <Round label="Not interested" onClick={() => fling('left')} className="h-16 w-16 text-brand"><X size={30} weight="bold" /></Round>
            <Round label="Undo" onClick={undoSwipe} className="h-12 w-12 text-ink-2"><ArrowUUpLeft size={20} weight="bold" /></Round>
            <Round label="Must go" onClick={() => fling('super')} className="h-14 w-14 text-[#2563eb]"><Star size={26} weight="fill" /></Round>
            <Round label="Interested" onClick={() => fling('right')} className="h-16 w-16 text-ok"><Heart size={30} weight="fill" /></Round>
          </div>
          <p className="mt-4 text-[13px] text-ink-3">Drag the card, use the buttons, or press the arrow keys</p>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-[28px] border border-line p-6">
            <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-ink-3"><Sparkle size={14} weight="fill" className="text-brand" /> Learning your taste</p>
            <p className="mt-2 text-[15px] text-ink-2">No quiz. Every swipe, save and booking quietly sharpens what you see next.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <AnimatePresence>
                {ranked.slice(0, 5).map((k) => (
                  <motion.span key={k} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-[14px] font-bold">
                    {LABEL[k]}
                    <motion.span key={signals[k]} initial={{ scale: 1.5, color: '#e31c5f' }} animate={{ scale: 1, color: '#5f5f5f' }} className="text-[12px]">{signals[k]}</motion.span>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <p className="mt-4 text-[13px] text-ink-3">{swipedCount} swipes this session. After 2 or 3 trips we also learn your pace and spend.</p>
          </div>
          <div className="rounded-[28px] bg-brand-soft p-6">
            <p className="text-[17px] font-extrabold">Swipe right means interested</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-2">It saves to your wishlist. The star means you will not skip it, and counts for more than a swipe.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Round({ children, label, onClick, className }: { children: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return (
    <motion.button whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }} onClick={onClick} aria-label={label} className={clsx('flex items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-10px_rgb(34_34_34/0.4)] ring-1 ring-line', className)}>{children}</motion.button>
  )
}

function CardFace({ exp }: { exp: Experience }) {
  return (
    <>
      <Img k={exp.imageKey} className="absolute inset-0" w={900} h={1200} eager />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-ink backdrop-blur">{exp.type}</span>
        {exp.needsBooking && <span className="rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">Book ahead</span>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-[14px] font-semibold text-white/80">{exp.area}</p>
        <p className="mt-0.5 text-[28px] font-extrabold leading-[1.1] tracking-tight">{exp.title}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-white/85">{exp.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur"><Clock size={14} weight="bold" /> {dur(exp.durationMin)}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur"><PersonSimpleWalk size={14} weight="bold" /> {exp.walkKm} km</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur"><Sparkle size={14} weight="fill" /> {exp.why}</span>
        </div>
      </div>
    </>
  )
}

function SwipeCard({ exp, x, y, onSwiped, ref, reduce }: { exp: Experience; x: MotionValue<number>; y: MotionValue<number>; onSwiped: (d: Dir) => void; ref?: Ref<Handle>; reduce: boolean }) {
  const rotate = useTransform(x, [-320, 0, 320], [-16, 0, 16])
  const like = useTransform(x, [24, 130], [0, 1])
  const nope = useTransform(x, [-130, -24], [1, 0])
  const sup = useTransform(y, [-24, -130], [0, 1])
  const fling = (d: Dir) => {
    const w = window.innerWidth
    const tx = d === 'left' ? -w : d === 'right' ? w : 0
    const ty = d === 'super' ? -window.innerHeight : 60
    const dur = reduce ? 0.01 : 0.42
    const ease = [0.32, 0.72, 0, 1] as const
    Promise.all([animate(x, tx, { duration: dur, ease }).finished, animate(y, ty, { duration: dur, ease }).finished]).then(() => onSwiped(d))
  }
  useImperativeHandle(ref, () => ({ fling }))
  const back = () => { animate(x, 0, { type: 'spring', stiffness: 520, damping: 32 }); animate(y, 0, { type: 'spring', stiffness: 520, damping: 32 }) }
  return (
    <motion.div
      className="absolute inset-0 cursor-grab overflow-hidden rounded-[32px] bg-ink shadow-[var(--shadow-lift)] active:cursor-grabbing"
      style={{ x, y, rotate, touchAction: 'pan-y' }}
      drag dragElastic={0.85} dragMomentum={false} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(_, i) => {
        if (i.offset.y < -140 || i.velocity.y < -700) return fling('super')
        if (i.offset.x > 110 || i.velocity.x > 520) return fling('right')
        if (i.offset.x < -110 || i.velocity.x < -520) return fling('left')
        back()
      }}
      initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1 }} whileTap={{ scale: 1.015 }}
    >
      <CardFace exp={exp} />
      <motion.div style={{ opacity: like }} className="pointer-events-none absolute left-6 top-14 -rotate-12 rounded-2xl border-[5px] border-[#2dd68b] px-4 py-1 text-[34px] font-black tracking-wider text-[#2dd68b]">SAVE</motion.div>
      <motion.div style={{ opacity: nope }} className="pointer-events-none absolute right-6 top-14 rotate-12 rounded-2xl border-[5px] border-[#ff4d7e] px-4 py-1 text-[34px] font-black tracking-wider text-[#ff4d7e]">PASS</motion.div>
      <motion.div style={{ opacity: sup }} className="pointer-events-none absolute inset-x-0 top-24 flex justify-center"><span className="rounded-2xl border-[5px] border-[#60a5fa] px-4 py-1 text-[32px] font-black tracking-wider text-[#60a5fa]">MUST GO</span></motion.div>
    </motion.div>
  )
}

function Behind({ exp, depth, x }: { exp: Experience; depth: number; x: MotionValue<number> }) {
  const base = depth === 1 ? 0.94 : 0.88
  const to = depth === 1 ? 1 : 0.94
  const scale = useTransform(x, [-260, 0, 260], [to, base, to])
  const ty = useTransform(x, [-260, 0, 260], [depth === 1 ? 0 : 18, depth === 1 ? 18 : 36, depth === 1 ? 0 : 18])
  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px] bg-ink shadow-[var(--shadow-soft)]" style={{ scale, y: ty }}>
      <CardFace exp={exp} />
    </motion.div>
  )
}
