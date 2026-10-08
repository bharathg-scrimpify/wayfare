import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import {
  MagnifyingGlass, ArrowLeft, User, Heart, UsersThree, House, Baby, Users, Cake, Confetti, MusicNotes, Sparkle, CirclesFour, AirplaneTilt, Plus, X, CircleNotch, Check, ArrowRight,
} from '@phosphor-icons/react'
import { Button, Chip, Img } from '../components/ui'
import { DESTINATIONS } from '../data/mock'

const WHO = [
  { id: 'Solo', icon: User }, { id: 'Partner', icon: Heart }, { id: 'Friends', icon: UsersThree }, { id: 'Family', icon: House },
  { id: 'Parents', icon: Users }, { id: 'Kids', icon: Baby }, { id: 'Group', icon: CirclesFour },
]
const OCC = [
  { id: 'Honeymoon', icon: Heart }, { id: 'Anniversary', icon: Sparkle }, { id: 'Birthday', icon: Cake },
  { id: 'Celebration', icon: Confetti }, { id: 'Festival or event', icon: MusicNotes }, { id: 'Nothing specific', icon: CirclesFour },
]

export default function Create() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [q, setQ] = useState('')
  const [dest, setDest] = useState<string | null>('london')
  const [undecided, setUndecided] = useState(false)
  const [stops, setStops] = useState<string[]>(['istanbul'])
  const [adding, setAdding] = useState(false)
  const [who, setWho] = useState<string[]>(['Friends'])
  const [occ, setOcc] = useState('Birthday')
  const [range, setRange] = useState<[number, number | null]>([13, 19])
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState(0)

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? DESTINATIONS.filter((d) => d.name.toLowerCase().startsWith(s) || d.country.toLowerCase().startsWith(s)) : []
  }, [q])
  const main = DESTINATIONS.find((d) => d.id === dest)

  const next = () => {
    if (step < 3) return setStep(step + 1)
    setBusy(true)
    const t = [700, 1500, 2300]
    t.forEach((ms, k) => setTimeout(() => setPhase(k + 1), ms))
    setTimeout(() => nav('/trip/import'), 3100)
  }
  const canNext = step === 0 ? !!dest || undecided : step === 1 ? who.length > 0 : true

  const toggleWho = (id: string) => setWho((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))

  if (busy) {
    const lines = ['Reading your destination', 'Checking transit and layovers', 'Setting up your trip home', 'Ready']
    return (
      <div className="relative flex min-h-[calc(100dvh-72px)] items-center justify-center overflow-hidden px-6">
        {main && <Img k={main.imageKey} className="absolute inset-0 opacity-25" w={1400} h={900} />}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        <div className="relative text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white">
            <AirplaneTilt size={36} weight="fill" />
          </motion.div>
          <h1 className="text-[34px] font-extrabold tracking-tight md:text-[44px]">Creating your trip</h1>
          <ul className="mx-auto mt-6 grid w-fit gap-3 text-left">
            {lines.map((l, k) => (
              <li key={l} className={clsx('flex items-center gap-3 text-[17px] transition-opacity duration-500', k <= phase ? 'opacity-100' : 'opacity-25')}>
                <span className={clsx('flex h-7 w-7 items-center justify-center rounded-full', k < phase ? 'bg-ok text-white' : 'bg-surface')}>
                  {k < phase ? <Check size={14} weight="bold" /> : k === phase ? <CircleNotch size={14} className="animate-spin" /> : null}
                </span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[920px] px-5 pb-32 pt-4 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => (step === 0 ? nav('/') : setStep(step - 1))} aria-label="Back" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-ink"><ArrowLeft size={20} weight="bold" /></button>
        <div className="flex flex-1 gap-2">{[0, 1, 2, 3].map((k) => <span key={k} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><motion.span className="block h-full bg-ink" initial={false} animate={{ width: k <= step ? '100%' : '0%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} /></span>)}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          {step === 0 && (
            <div>
              <h1 className="text-[36px] font-extrabold leading-tight tracking-tight md:text-[52px]">Where are we going?</h1>
              <div className="relative mt-6">
                <MagnifyingGlass size={22} weight="bold" className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city, country or region" aria-label="Search destinations"
                  className="h-16 w-full rounded-full border border-line bg-white pl-14 pr-6 text-[17px] shadow-[var(--shadow-soft)] outline-none transition-colors placeholder:text-ink-3 focus:border-ink" />
                <AnimatePresence>
                  {matches.length > 0 && (
                    <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-[72px] z-10 overflow-hidden rounded-3xl border border-line bg-white p-2 shadow-[var(--shadow-lift)]">
                      {matches.map((m) => (
                        <li key={m.id}>
                          <button onClick={() => { setDest(m.id); setUndecided(false); setQ('') }} className="flex w-full items-center gap-4 rounded-2xl p-2 text-left hover:bg-surface">
                            <Img k={m.imageKey} className="h-14 w-14 rounded-2xl" w={160} h={160} />
                            <span><span className="block text-[17px] font-bold">{m.name}</span><span className="text-[14px] text-ink-2">{m.country}</span></span>
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {main && !undecided && (
                <motion.div layout className="mt-6 rounded-[28px] border border-line p-4">
                  <div className="flex items-center gap-4">
                    <Img k={main.imageKey} className="h-20 w-20 rounded-3xl" w={240} h={240} />
                    <div className="flex-1"><p className="text-[22px] font-extrabold">{main.name}</p><p className="text-ink-2">{main.country}</p></div>
                    <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-white">Main destination</span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-[15px] font-semibold">
                    <span className="rounded-full bg-surface px-4 py-2">Hyderabad</span>
                    {stops.map((s) => (
                      <RouteStop key={s} name={DESTINATIONS.find((d) => d.id === s)?.name ?? s} layover onRemove={() => setStops((x) => x.filter((y) => y !== s))} />
                    ))}
                    <RouteStop name={main.name} main />
                    <span className="text-ink-3">to</span>
                    <span className="rounded-full bg-surface px-4 py-2">Hyderabad</span>
                    <button onClick={() => setAdding((a) => !a)} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-ink/40 px-4 py-2 hover:border-ink"><Plus size={14} weight="bold" /> Add a stop</button>
                  </div>
                  <AnimatePresence>
                    {adding && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-4">
                          {DESTINATIONS.filter((d) => d.id !== dest && !stops.includes(d.id)).map((d) => <Chip key={d.id} onClick={() => { setStops((x) => [...x, d.id]); setAdding(false) }}>{d.name}</Chip>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {stops.length > 0 && <p className="mt-4 text-[14px] text-ink-2">We will check transit visas and layover timing for every stop.</p>}
                </motion.div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <h2 className="text-[20px] font-extrabold">Popular right now</h2>
                <Chip active={undecided} onClick={() => { setUndecided(!undecided); setDest(undecided ? 'london' : null) }}>I have not decided yet</Chip>
              </div>
              <div className="no-scrollbar -mx-5 mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
                {DESTINATIONS.map((d) => (
                  <button key={d.id} onClick={() => { setDest(d.id); setUndecided(false); setStops((s) => s.filter((x) => x !== d.id)) }} className="group relative h-[200px] w-[160px] shrink-0 snap-start overflow-hidden rounded-[24px] text-left md:w-auto" aria-pressed={dest === d.id}>
                    <Img k={d.imageKey} className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" w={500} h={600} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-[17px] font-extrabold text-white">{d.name}</span>
                    {dest === d.id && <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white"><Check size={16} weight="bold" /></span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-[36px] font-extrabold leading-tight tracking-tight md:text-[52px]">Who is coming?</h1>
              <p className="mt-2 text-[17px] text-ink-2">Pick everyone who applies. We tune suggestions to the group.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {WHO.map((w) => (
                  <button key={w.id} onClick={() => toggleWho(w.id)} aria-pressed={who.includes(w.id)}
                    className={clsx('flex h-32 flex-col items-start justify-between rounded-[24px] border p-5 text-left transition-all active:scale-[0.97]', who.includes(w.id) ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink/50')}>
                    <w.icon size={30} weight={who.includes(w.id) ? 'fill' : 'regular'} />
                    <span className="text-[17px] font-bold">{w.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-[36px] font-extrabold leading-tight tracking-tight md:text-[52px]">Anything special?</h1>
              <p className="mt-2 text-[17px] text-ink-2">One tap. It shapes the ideas we show you.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {OCC.map((o) => (
                  <button key={o.id} onClick={() => setOcc(o.id)} aria-pressed={occ === o.id}
                    className={clsx('flex h-32 flex-col items-start justify-between rounded-[24px] border p-5 text-left transition-all active:scale-[0.97]', occ === o.id ? 'border-brand bg-brand-soft' : 'border-line hover:border-ink/50')}>
                    <o.icon size={30} weight={occ === o.id ? 'fill' : 'regular'} className={occ === o.id ? 'text-brand' : ''} />
                    <span className="text-[17px] font-bold">{o.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-[36px] font-extrabold leading-tight tracking-tight md:text-[52px]">When are you going?</h1>
              <p className="mt-2 text-[17px] text-ink-2">Tap a start and an end date.</p>
              <Calendar range={range} setRange={setRange} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[920px] items-center justify-between">
          <p className="hidden text-[14px] text-ink-2 md:block">
            {main && !undecided ? `${main.name}${stops.length ? ' via ' + stops.map((s) => DESTINATIONS.find((d) => d.id === s)?.name).join(', ') : ''}` : 'Destination open'}
          </p>
          <Button size="lg" disabled={!canNext} onClick={next} icon={<ArrowRight size={18} weight="bold" />} className="ml-auto">{step === 3 ? 'Create my trip' : 'Continue'}</Button>
        </div>
      </div>
    </div>
  )
}

function RouteStop({ name, layover, main, onRemove }: { name: string; layover?: boolean; main?: boolean; onRemove?: () => void }) {
  return (
    <>
      <span className="text-ink-3">to</span>
      <span className={clsx('inline-flex items-center gap-2 rounded-full px-4 py-2', main ? 'bg-ink text-white' : 'bg-brand-soft text-brand-dark')}>
        {name}
        {layover && <span className="text-[12px] font-bold">layover</span>}
        {onRemove && <button onClick={onRemove} aria-label={`Remove ${name}`}><X size={14} weight="bold" /></button>}
      </span>
    </>
  )
}

function Calendar({ range, setRange }: { range: [number, number | null]; setRange: (r: [number, number | null]) => void }) {
  const offset = 1 // 1 Dec 2026 is a Tuesday, Monday-first grid
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const [a, b] = range
  const pick = (d: number) => {
    if (b !== null || d < a) setRange([d, null])
    else setRange([a, d])
  }
  return (
    <div className="mt-8 max-w-md rounded-[28px] border border-line p-5">
      <p className="mb-4 text-center text-[18px] font-extrabold">December 2026</p>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[12px] font-semibold text-ink-3">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="py-2">{d}</span>)}</div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: offset }).map((_, i) => <span key={i} />)}
        {days.map((d) => {
          const inR = b !== null && d > a && d < b
          const end = d === a || d === b
          return (
            <button key={d} onClick={() => pick(d)} className={clsx('relative flex h-11 items-center justify-center text-[15px] font-semibold', inR && 'bg-surface', d === a && b !== null && 'rounded-l-full bg-surface', d === b && 'rounded-r-full bg-surface')} aria-label={`${d} December`}>
              <span className={clsx('flex h-11 w-11 items-center justify-center rounded-full transition-colors', end ? 'bg-ink text-white' : 'hover:border hover:border-ink')}>{d}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-center text-[15px] font-semibold">{b ? `${a} to ${b} Dec, ${b - a} nights` : `From ${a} Dec, pick your return`}</p>
    </div>
  )
}
