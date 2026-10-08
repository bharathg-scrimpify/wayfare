import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import {
  House, CalendarBlank, Compass, UsersThree, Headset, Heart, MapPin, SealCheck, Sparkle, Play, CaretRight, CaretLeft, X, Stethoscope, CircleNotch, CheckCircle, ArrowRight, UploadSimple,
} from '@phosphor-icons/react'
import { Avatar, AvatarStack, Button, Logo, Sheet, Toaster, spring } from './ui'
import { useTrip, type Gap } from '../store/trip'
import { TripSheets } from './Sheets'

type Tab = { to: string; label: string; icon: typeof House; end?: boolean }
const MAIN: Tab[] = [
  { to: '/trip', label: 'Overview', icon: House, end: true },
  { to: '/trip/itinerary', label: 'Itinerary', icon: CalendarBlank },
  { to: '/trip/discover', label: 'Discover', icon: Compass },
  { to: '/trip/group', label: 'Group', icon: UsersThree },
  { to: '/trip/concierge', label: 'Concierge', icon: Headset },
]
const MORE: Tab[] = [
  { to: '/trip/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/trip/import', label: 'Bring it in', icon: UploadSimple },
  { to: '/trip/nearby', label: 'Nearby', icon: MapPin },
  { to: '/trip/final', label: 'Final check', icon: SealCheck },
  { to: '/trip/dna', label: 'Travel DNA', icon: Sparkle },
]

const TOUR = [
  { to: '/', label: 'Start anywhere', note: 'Three ways in: from scratch, with research, or with bookings.' },
  { to: '/trip/import', label: 'Bring everything in', note: 'Reels, PDFs and confirmations become structured trip items.' },
  { to: '/trip/discover', label: 'Swipe to discover', note: 'Right saves to the wishlist. You decide where it fits.' },
  { to: '/trip/itinerary', label: 'Fixed, flexible, wishlist', note: 'Every change is re-checked against what is booked.' },
  { to: '/trip', label: 'Gap detection', note: 'Always on, with a one-tap fix for every gap.' },
  { to: '/trip/group', label: 'Plan together', note: 'Votes, batched updates and no approval gates.' },
  { to: '/trip/concierge', label: 'A human team behind it', note: 'Booking, visa and private experiences.' },
  { to: '/trip/nearby', label: 'On the trip', note: 'What is around me, fitted to your gap.' },
  { to: '/trip/final', label: 'Final trip check', note: 'Ready, needs attention, suggestions.' },
  { to: '/admin', label: 'Backend team view', note: 'Every request arrives with full context.' },
]

export function Shell() {
  const loc = useLocation()
  const inTrip = loc.pathname.startsWith('/trip')
  useEffect(() => { window.scrollTo({ top: 0 }) }, [loc.pathname])
  return (
    <div className="min-h-[100dvh] bg-white">
      <Header inTrip={inTrip} />
      {inTrip && <TripTabs />}
      <main className={clsx(inTrip ? 'pb-32 md:pb-24' : '')}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={loc.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {inTrip && <TripHealth />}
      {inTrip && <BottomBar />}
      <DemoTour />
      <Toaster />
      <TripSheets />
    </div>
  )
}

function Header({ inTrip }: { inTrip: boolean }) {
  const { unseen } = useTrip()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={clsx('sticky top-0 z-40 bg-white/90 backdrop-blur-xl transition-shadow', scrolled ? 'shadow-[0_1px_0_var(--color-line)]' : '')}>
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Link to="/" aria-label="Wayfare home"><Logo /></Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <HeaderLink to="/trip" active={inTrip}>My trip</HeaderLink>
          <HeaderLink to="/trip/discover">Discover</HeaderLink>
          <HeaderLink to="/trip/concierge">Concierge</HeaderLink>
          <HeaderLink to="/admin">Team view</HeaderLink>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => window.dispatchEvent(new Event('wayfare:tour'))} className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-semibold hover:border-ink" aria-label="Start demo tour">
            <Play size={14} weight="fill" /> <span className="hidden sm:inline">Demo tour</span>
          </button>
          <Link to="/trip/group" className="relative hidden items-center md:flex" aria-label="Group activity">
            <AvatarStack ids={['arpit', 'tanya', 'fatema']} size={30} />
            {unseen > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">{unseen}</span>}
          </Link>
          <Link to="/trip/dna" aria-label="Profile"><Avatar id="you" size={38} /></Link>
        </div>
      </div>
    </header>
  )
}

function HeaderLink({ to, children, active }: { to: string; children: ReactNode; active?: boolean }) {
  return (
    <NavLink to={to} end className={({ isActive }) => clsx('rounded-full px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-surface', isActive || active ? 'text-ink' : 'text-ink-2')}>
      {children}
    </NavLink>
  )
}

function TripTabs() {
  const all = [...MAIN, ...MORE]
  return (
    <div className="sticky top-[72px] z-30 hidden border-b border-line bg-white/90 backdrop-blur-xl md:block">
      <div className="no-scrollbar mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-10">
        {all.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end ?? false} className={({ isActive }) => clsx('relative flex shrink-0 flex-col items-center gap-1 px-5 py-3 text-[13px] font-semibold transition-colors', isActive ? 'text-ink' : 'text-ink-3 hover:text-ink')}>
            {({ isActive }) => (
              <>
                <t.icon size={24} weight={isActive ? 'fill' : 'regular'} />
                {t.label}
                {isActive && <motion.span layoutId="tab-underline" className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-ink" transition={spring} />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function BottomBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden" aria-label="Trip">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {MAIN.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => clsx('flex h-[62px] flex-col items-center justify-center gap-1 text-[11px] font-semibold', isActive ? 'text-brand' : 'text-ink-3')}>
            {({ isActive }) => (<><t.icon size={24} weight={isActive ? 'fill' : 'regular'} />{t.label}</>)}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function TripHealth() {
  const { gaps, checking } = useTrip()
  const [open, setOpen] = useState(false)
  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-[78px] right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-semibold text-white shadow-[var(--shadow-lift)] md:bottom-8 md:right-8 md:pr-5"
        whileTap={{ scale: 0.96 }} layout transition={spring}
        aria-label="Open trip health"
      >
        {checking ? <CircleNotch size={20} className="animate-spin" /> : gaps.length === 0 ? <CheckCircle size={20} weight="fill" className="text-[#4ade80]" /> : <Stethoscope size={20} weight="fill" />}
        <span className="hidden md:inline">{checking ? 'Checking your trip' : gaps.length === 0 ? 'Trip looks great' : `${gaps.length} to look at`}</span>
        {gaps.length > 0 && !checking && <span className="md:hidden text-[15px] font-extrabold">{gaps.length}</span>}
      </motion.button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Trip health" wide>
        <GapList onDone={() => setOpen(false)} />
      </Sheet>
    </>
  )
}

const GAP_TONE: Record<Gap['severity'], string> = { high: 'bg-brand', medium: 'bg-[#d97706]', low: 'bg-[#0f8a5f]' }

export function GapList({ onDone, compact }: { onDone?: () => void; compact?: boolean }) {
  const { gaps, runGapAction } = useTrip()
  if (gaps.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle size={52} weight="fill" className="text-ok" />
        <p className="text-[20px] font-extrabold">No gaps. Your trip hangs together.</p>
        <p className="text-ink-2">We keep checking as you change things.</p>
      </div>
    )
  }
  return (
    <ul className={clsx('flex flex-col', compact ? 'gap-3' : 'gap-3')}>
      <AnimatePresence initial={false}>
        {gaps.map((g) => (
          <motion.li key={g.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, height: 0, marginBottom: -12 }} transition={{ duration: 0.3 }}
            className="flex items-start gap-4 rounded-3xl border border-line bg-white p-4">
            <span className={clsx('mt-1 h-10 w-1.5 shrink-0 rounded-full', GAP_TONE[g.severity])} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-wide text-ink-3">{g.type}</span>
                {g.day !== undefined && <span className="text-[12px] text-ink-3">Day {g.day + 1}</span>}
              </div>
              <p className="text-[16px] font-bold leading-snug">{g.title}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-ink-2">{g.detail}</p>
            </div>
            <Button size="sm" v="dark" onClick={() => { runGapAction(g); if (g.action.kind === 'explore') onDone?.() }} className="shrink-0 self-center">
              {g.action.label}
            </Button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

function DemoTour() {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const go = (n: number) => { const k = Math.max(0, Math.min(TOUR.length - 1, n)); setI(k); nav(TOUR[k].to) }
  useEffect(() => {
    const h = () => { setOpen(true); setI(0); nav(TOUR[0].to) }
    window.addEventListener('wayfare:tour', h)
    return () => window.removeEventListener('wayfare:tour', h)
  }, [nav])
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={spring}
            className="fixed bottom-24 left-4 right-4 z-50 rounded-3xl bg-ink p-5 text-white shadow-[var(--shadow-lift)] md:bottom-8 md:left-8 md:right-auto md:w-[380px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold text-white/60">Step {i + 1} of {TOUR.length}</p>
                <p className="text-[18px] font-extrabold leading-tight">{TOUR[i].label}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-white/75">{TOUR[i].note}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close tour" className="rounded-full p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1">
                {TOUR.map((_, k) => <span key={k} className={clsx('h-1.5 rounded-full transition-all', k === i ? 'w-5 bg-white' : 'w-1.5 bg-white/30')} />)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => go(i - 1)} disabled={i === 0} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30" aria-label="Previous"><CaretLeft size={18} weight="bold" /></button>
                <button onClick={() => go(i + 1)} disabled={i === TOUR.length - 1} className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-bold text-ink disabled:opacity-40">Next <CaretRight size={16} weight="bold" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { ArrowRight }
