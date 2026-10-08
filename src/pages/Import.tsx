import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import {
  Link as LinkIcon, FileArrowUp, TextAlignLeft, Image as ImageIcon, InstagramLogo, MagnifyingGlass, Heart, Plus, Trash, Check, WarningCircle, AirplaneTilt, Star, PencilSimple, ShareNetwork, CheckCircle, ArrowRight, Bed, MapPin, Car,
} from '@phosphor-icons/react'
import { Button, Img, PageTitle, Segmented } from '../components/ui'
import { SWITZERLAND_REEL } from '../data/mock'
import { useTrip } from '../store/trip'

type Tab = 'link' | 'file' | 'text' | 'shot'
type Collected = { id: string; group: 'Confirmed bookings' | 'Places and experiences' | 'Other trip info'; title: string; sub: string; imageKey: string; icon: ReactNode; must?: boolean }

const SEED: Collected[] = [
  { id: 'c-hotel', group: 'Confirmed bookings', title: 'Bloomsbury Row Hotel, 6 nights', sub: '13 to 19 Dec, 2 rooms', imageKey: 'hotel', icon: <Bed size={18} weight="fill" /> },
  { id: 'c-tr', group: 'Other trip info', title: 'Palace Theatre tickets', sub: 'Tue 15 Dec, 7:00 PM, row F', imageKey: 'theatre', icon: <MapPin size={18} weight="fill" /> },
]

export default function Import() {
  const nav = useNavigate()
  const { importReel, pushToast } = useTrip()
  const [tab, setTab] = useState<Tab>('link')
  const [collected, setCollected] = useState<Collected[]>(SEED)
  const [stage, setStage] = useState<'intake' | 'confirm'>('intake')
  const add = (c: Collected[]) => setCollected((x) => [...x, ...c.filter((n) => !x.some((o) => o.id === n.id))])

  if (stage === 'confirm') {
    return <Confirm collected={collected} setCollected={setCollected} back={() => setStage('intake')} done={() => { importReel('wishlist', collected.filter((c) => c.id.startsWith('sw')).map((c) => c.id)); pushToast({ text: 'Trip built from everything you brought in', tone: 'ok' }); nav('/trip') }} />
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10">
      <PageTitle title="Bring everything in" sub="Drop in what you have. We read it, understand it, and put it in the right place." />
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="no-scrollbar -mx-1 mb-6 overflow-x-auto px-1">
            <Segmented<Tab> value={tab} onChange={setTab} options={[
              { id: 'link', label: 'Link', icon: <LinkIcon size={16} weight="bold" /> },
              { id: 'file', label: 'Files', icon: <FileArrowUp size={16} weight="bold" /> },
              { id: 'text', label: 'Paste text', icon: <TextAlignLeft size={16} weight="bold" /> },
              { id: 'shot', label: 'Screenshot', icon: <ImageIcon size={16} weight="bold" /> },
            ]} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {tab === 'link' && <LinkIntake onAdd={add} />}
              {tab === 'file' && <FileIntake onAdd={add} />}
              {tab === 'text' && <TextIntake onAdd={add} />}
              {tab === 'shot' && <ShotIntake onAdd={add} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <ShareSheetMock />
          <div className="mt-6 rounded-[28px] border border-line p-5">
            <p className="text-[13px] font-bold uppercase tracking-wide text-ink-3">Added so far</p>
            <p className="mt-1 text-[28px] font-extrabold">{collected.length} items</p>
            <ul className="mt-3 grid gap-2 text-[14px] text-ink-2">
              {collected.slice(-4).map((c) => <li key={c.id} className="flex items-center gap-2"><CheckCircle size={16} weight="fill" className="text-ok" /> <span className="truncate">{c.title}</span></li>)}
            </ul>
            <Button size="lg" className="mt-5 w-full" onClick={() => setStage('confirm')} icon={<ArrowRight size={18} weight="bold" />}>Review what we found</Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Scan({ label, lines, onDone, imageKey }: { label: string; lines: string[]; onDone: () => void; imageKey?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const ts = lines.map((_, i) => setTimeout(() => setN(i + 1), 700 * (i + 1)))
    const d = setTimeout(onDone, 700 * lines.length + 800)
    return () => { ts.forEach(clearTimeout); clearTimeout(d) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line p-6">
      {imageKey && <Img k={imageKey} className="absolute inset-0 opacity-15" w={900} h={500} />}
      <div className="scanline" />
      <p className="relative text-[18px] font-extrabold">{label}</p>
      <ul className="relative mt-4 grid gap-2.5">
        {lines.map((l, i) => (
          <li key={l} className={clsx('flex items-center gap-3 text-[15px] transition-opacity duration-300', i < n ? 'opacity-100' : 'opacity-25')}>
            {i < n ? <Check size={16} weight="bold" className="text-ok" /> : <span className="h-4 w-4 rounded-full border-2 border-line" />} {l}
          </li>
        ))}
      </ul>
    </div>
  )
}

function LinkIntake({ onAdd }: { onAdd: (c: Collected[]) => void }) {
  const { importReel } = useTrip()
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'idle' | 'scan' | 'found' | 'fail'>('idle')
  const [cards, setCards] = useState(SWITZERLAND_REEL.found)
  const [state, setState] = useState<Record<string, 'itin' | 'wish'>>({})
  const [manual, setManual] = useState('')
  const failRef = useRef(false)
  const go = (u: string, fail = false) => { setUrl(u); failRef.current = fail; setPhase('scan') }
  const act = (id: string, m: 'itin' | 'wish') => {
    const f = SWITZERLAND_REEL.found.find((x) => x.id === id)!
    setState((s) => ({ ...s, [id]: m }))
    onAdd([{ id, group: 'Places and experiences', title: f.title, sub: f.area, imageKey: f.imageKey, icon: <MapPin size={18} weight="fill" /> }])
    if (m === 'wish') importReel('wishlist', [id])
  }
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <InstagramLogo size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste an Instagram, YouTube or blog link" aria-label="Link"
            className="h-14 w-full rounded-full border border-line pl-14 pr-5 text-[16px] outline-none transition-colors focus:border-ink" />
        </div>
        <Button size="lg" onClick={() => go(url || 'instagram.com/reel/alpine-diaries-5-hidden-switzerland')} disabled={phase === 'scan'}>Read it</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
        <button onClick={() => go('instagram.com/reel/alpine-diaries-5-hidden-switzerland')} className="rounded-full bg-surface px-3.5 py-2 font-semibold hover:bg-line">Try the Switzerland reel</button>
        <button onClick={() => go('instagram.com/p/private-account-post', true)} className="rounded-full bg-surface px-3.5 py-2 font-semibold hover:bg-line">Try a link we cannot read</button>
      </div>

      <div className="mt-6">
        {phase === 'scan' && (
          <Scan imageKey="switzerland" label="Reading your reel" lines={['Opening the post', 'Listening to the voiceover', 'Spotting place names', 'Matching them to real locations']}
            onDone={() => setPhase(failRef.current ? 'fail' : 'found')} />
        )}
        {phase === 'fail' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-line bg-warn-soft p-6">
            <div className="flex items-start gap-3 text-warn"><WarningCircle size={26} weight="fill" /><div><p className="text-[18px] font-extrabold">We could not read this link clearly</p><p className="mt-1 text-[15px] text-ink-2">The post is private or has no place names. No guessing from us. Search the place and add it yourself.</p></div></div>
            <div className="relative mt-4"><MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" /><input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Search a place or experience" className="h-12 w-full rounded-full border border-line bg-white pl-12 pr-4 outline-none focus:border-ink" /></div>
            <Button className="mt-3" disabled={!manual} onClick={() => { onAdd([{ id: 'm-' + manual, group: 'Places and experiences', title: manual, sub: 'Added by you', imageKey: 'london', icon: <MapPin size={18} weight="fill" /> }]); setManual(''); setPhase('idle') }}>Add manually</Button>
          </motion.div>
        )}
        {phase === 'found' && (
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ok text-white"><Check size={18} weight="bold" /></span>
              <div><p className="text-[18px] font-extrabold">We found 5 experiences</p><p className="text-[14px] text-ink-2">{SWITZERLAND_REEL.title} by {SWITZERLAND_REEL.by}</p></div>
            </motion.div>
            <ul className="grid gap-3">
              <AnimatePresence>
                {cards.map((c, i) => (
                  <motion.li key={c.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-4 rounded-[24px] border border-line p-3 sm:flex-row sm:items-center">
                    <Img k={c.imageKey} className="h-28 w-full shrink-0 rounded-3xl sm:w-28" w={400} h={300} />
                    <div className="min-w-0 flex-1 px-1">
                      <p className="text-[12px] font-bold text-ink-3">Experience {String.fromCharCode(65 + i)}</p>
                      <p className="text-[17px] font-extrabold leading-snug">{c.title}</p>
                      <p className="text-[14px] text-ink-2">{c.area}. {c.blurb}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 px-1 pb-1">
                      {state[c.id] ? (
                        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-ok-soft px-4 text-[14px] font-bold text-ok"><Check size={16} weight="bold" />{state[c.id] === 'itin' ? 'In itinerary' : 'In wishlist'}</span>
                      ) : (
                        <>
                          <Button size="sm" v="dark" icon={<Plus size={14} weight="bold" />} onClick={() => act(c.id, 'itin')}>Itinerary</Button>
                          <Button size="sm" v="outline" icon={<Heart size={14} weight="bold" />} onClick={() => act(c.id, 'wish')}>Wishlist</Button>
                          <button onClick={() => setCards((x) => x.filter((y) => y.id !== c.id))} aria-label="Remove" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface"><Trash size={16} /></button>
                        </>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
        {phase === 'idle' && <Hint icon={<LinkIcon size={26} />} text="Paste a reel, video or blog. We turn it into places you can act on, not a link you will forget." />}
      </div>
    </div>
  )
}

function Hint({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[28px] border border-dashed border-ink/25 px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">{icon}</span>
      <p className="max-w-[40ch] text-[16px] leading-relaxed text-ink-2">{text}</p>
    </div>
  )
}

function FileIntake({ onAdd }: { onAdd: (c: Collected[]) => void }) {
  const [phase, setPhase] = useState<'idle' | 'scan' | 'found'>('idle')
  const [added, setAdded] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const [v, setV] = useState({ airline: 'Turkish Airlines TK 1112', from: 'Hyderabad (HYD)', to: 'London Heathrow (LHR)', date: '13 Dec 2026', dep: '14:10', arr: '23:50', ref: 'TK8H2Q' })
  const field = (k: keyof typeof v, label: string) => (
    <label className="block">
      <span className="mb-1 block text-[12px] font-bold uppercase tracking-wide text-ink-3">{label}</span>
      <span className="relative block">
        <input value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} className="h-11 w-full rounded-2xl border border-line bg-white px-4 pr-9 text-[15px] font-semibold outline-none focus:border-ink" />
        <PencilSimple size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3" />
      </span>
    </label>
  )
  return (
    <div>
      <div onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setPhase('scan') }}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-[28px] border-2 border-dashed border-ink/25 px-8 py-12 text-center transition-colors hover:border-ink hover:bg-surface">
        <FileArrowUp size={40} />
        <p className="text-[18px] font-extrabold">Drop a PDF, Word or Excel file</p>
        <p className="text-[14px] text-ink-2">Itineraries, tickets, confirmations, anything with trip details</p>
        <input ref={input} type="file" className="hidden" onChange={() => setPhase('scan')} aria-label="Upload file" />
      </div>
      <div className="mt-3"><button onClick={() => setPhase('scan')} className="rounded-full bg-surface px-3.5 py-2 text-[13px] font-semibold hover:bg-line">Try a sample flight confirmation</button></div>
      <div className="mt-6">
        {phase === 'scan' && <Scan imageKey="flight" label="Reading your flight confirmation" lines={['Finding airline and flight number', 'Reading airports, dates and times', 'Checking the route against your trip']} onDone={() => setPhase('found')} />}
        {phase === 'found' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-line">
            <div className="flex items-center gap-3 bg-ink p-5 text-white"><AirplaneTilt size={24} weight="fill" /><div><p className="text-[12px] font-semibold text-white/60">Flight confirmation</p><p className="text-[18px] font-extrabold">Hyderabad to London</p></div></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {field('airline', 'Airline')}{field('ref', 'Booking reference')}{field('from', 'Departs from')}{field('to', 'Arrives at')}{field('date', 'Date')}
              <div className="grid grid-cols-2 gap-3">{field('dep', 'Departs')}{field('arr', 'Arrives')}</div>
            </div>
            <div className="mx-5 mb-5 flex items-start gap-3 rounded-3xl bg-warn-soft p-4 text-warn">
              <WarningCircle size={24} weight="fill" className="mt-0.5 shrink-0" />
              <div className="text-[15px]"><p className="font-extrabold">This flight does not reach London in one hop.</p><p className="mt-0.5 text-ink-2">We added a 2 hr 15 min layover in Istanbul (IST). Correct it if that is wrong.</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-line p-5">
              <span className="rounded-full bg-surface px-3 py-1.5 text-[13px] font-bold">HYD to IST to LHR</span>
              <Button className="ml-auto" disabled={added} onClick={() => { setAdded(true); onAdd([{ id: 'c-flight', group: 'Confirmed bookings', title: 'Hyderabad to London via Istanbul', sub: `${v.airline}, ${v.date}`, imageKey: 'flight', icon: <AirplaneTilt size={18} weight="fill" /> }]) }}>{added ? 'Added to your trip' : 'Looks right, add it'}</Button>
            </div>
          </motion.div>
        )}
        {phase === 'idle' && <Hint icon={<FileArrowUp size={26} />} text="Upload a confirmation and we pull out airline, airports, times and layovers, then flag anything that does not add up." />}
      </div>
    </div>
  )
}

function TextIntake({ onAdd }: { onAdd: (c: Collected[]) => void }) {
  const [t, setT] = useState('Hotel: Bloomsbury Row, 13 to 19 Dec. Friend said do Hampstead Heath on a clear day. Dishoom Covent Garden booked Sat 8pm.')
  const [phase, setPhase] = useState<'idle' | 'scan' | 'found'>('idle')
  const [done, setDone] = useState(false)
  return (
    <div>
      <label className="block"><span className="sr-only">Paste your notes</span>
        <textarea value={t} onChange={(e) => setT(e.target.value)} rows={5} className="w-full rounded-[28px] border border-line p-5 text-[16px] leading-relaxed outline-none focus:border-ink" /></label>
      <Button className="mt-3" size="lg" onClick={() => setPhase('scan')}>Read my notes</Button>
      <div className="mt-6">
        {phase === 'scan' && <Scan label="Reading your notes" lines={['Splitting bookings from ideas', 'Finding places and dates']} onDone={() => setPhase('found')} />}
        {phase === 'found' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3">
            {[['Booking', 'Bloomsbury Row Hotel', '13 to 19 Dec'], ['Idea from a friend', 'Hampstead Heath', 'Best on a clear day'], ['Booking', 'Restaurant dinner', 'Sat 8:00 PM, added as is']].map(([a, b, c]) => (
              <div key={b} className="flex items-center gap-4 rounded-3xl border border-line p-4"><span className="rounded-full bg-surface px-3 py-1 text-[12px] font-bold">{a}</span><div className="flex-1"><p className="font-extrabold">{b}</p><p className="text-[14px] text-ink-2">{c}</p></div></div>
            ))}
            <p className="text-[14px] text-ink-2">Restaurant bookings go straight into your itinerary. We never suggest restaurants, only keep yours.</p>
            <Button className="w-fit" disabled={done} onClick={() => { setDone(true); onAdd([{ id: 'c-note', group: 'Places and experiences', title: 'Hampstead Heath', sub: 'From a friend', imageKey: 'hampstead', icon: <MapPin size={18} weight="fill" /> }]) }}>{done ? 'Added' : 'Add all three'}</Button>
          </motion.div>
        )}
        {phase === 'idle' && <Hint icon={<TextAlignLeft size={26} />} text="Paste messy notes, a friend's message or an agent's itinerary. We sort bookings from ideas." />}
      </div>
    </div>
  )
}

function ShotIntake({ onAdd }: { onAdd: (c: Collected[]) => void }) {
  const [phase, setPhase] = useState<'idle' | 'scan' | 'found'>('idle')
  const [done, setDone] = useState(false)
  return (
    <div>
      <div onClick={() => setPhase('scan')} className="flex cursor-pointer flex-col items-center gap-3 rounded-[28px] border-2 border-dashed border-ink/25 px-8 py-12 text-center transition-colors hover:border-ink hover:bg-surface">
        <ImageIcon size={40} /><p className="text-[18px] font-extrabold">Drop a screenshot</p><p className="text-[14px] text-ink-2">Booking apps, chats, notes, maps. Tap to try a sample.</p>
      </div>
      <div className="mt-6">
        {phase === 'scan' && <Scan imageKey="thames" label="Reading your screenshot" lines={['Recognising a booking screen', 'Extracting date, time and pier']} onDone={() => setPhase('found')} />}
        {phase === 'found' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-[28px] border border-line p-4 sm:flex-row sm:items-center">
            <Img k="thames" className="h-32 w-full rounded-3xl sm:w-40" w={400} h={300} />
            <div className="flex-1"><p className="text-[12px] font-bold text-ink-3">Activity booking</p><p className="text-[18px] font-extrabold">Sunset Thames cruise</p><p className="text-[14px] text-ink-2">Wed 16 Dec, 7:00 PM, Embankment pier, 4 guests</p></div>
            <Button disabled={done} onClick={() => { setDone(true); onAdd([{ id: 'c-cruise', group: 'Confirmed bookings', title: 'Sunset Thames cruise', sub: 'Wed 16 Dec, 7:00 PM', imageKey: 'thames', icon: <Star size={18} weight="fill" /> }]) }}>{done ? 'Added' : 'Add it'}</Button>
          </motion.div>
        )}
        {phase === 'idle' && <Hint icon={<ImageIcon size={26} />} text="Screenshots of tickets, chats and notes are placed where they belong, with the details pulled out." />}
      </div>
    </div>
  )
}

function ShareSheetMock() {
  return (
    <div className="rounded-[28px] bg-surface p-5">
      <p className="mb-1 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-ink-3"><ShareNetwork size={14} weight="bold" /> From your phone</p>
      <p className="mb-4 text-[15px] text-ink-2">Tap Share on any reel. Wayfare is right there, and the post lands in your trip.</p>
      <div className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-soft)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <p className="mb-3 text-center text-[13px] font-semibold text-ink-2">Share to</p>
        <div className="grid grid-cols-4 gap-3 text-center text-[11px] font-semibold text-ink-2">
          {['Messages', 'WhatsApp', 'Notes'].map((a) => <span key={a} className="flex flex-col items-center gap-1.5"><span className="h-12 w-12 rounded-2xl bg-surface" />{a}</span>)}
          <motion.span animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="flex flex-col items-center gap-1.5 text-brand"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_8px_20px_-8px_rgb(227_28_95/0.8)]"><svg width="24" height="24" viewBox="0 0 64 64"><path d="M17 41 L28 22 L36 34 L42 26 L48 41" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>Wayfare</motion.span>
        </div>
      </div>
    </div>
  )
}

function Confirm({ collected, setCollected, back, done }: { collected: Collected[]; setCollected: (c: Collected[]) => void; back: () => void; done: () => void }) {
  const groups: Collected['group'][] = ['Confirmed bookings', 'Places and experiences', 'Other trip info']
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 md:px-10">
      <button onClick={back} className="mb-4 text-[14px] font-semibold text-ink-2 hover:text-ink">Back to adding</button>
      <PageTitle title="Here is what we found" sub="Keep it, edit it, or mark the ones you will not skip." />
      {groups.map((g) => {
        const rows = collected.filter((c) => c.group === g)
        if (!rows.length) return null
        return (
          <section key={g} className="mb-8">
            <h2 className="mb-3 text-[20px] font-extrabold">{g}</h2>
            <ul className="grid gap-3">
              <AnimatePresence>
                {rows.map((c) => (
                  <motion.li key={c.id} layout exit={{ opacity: 0, x: -40 }} className="flex flex-wrap items-center gap-4 rounded-[24px] border border-line p-3">
                    <Img k={c.imageKey} className="h-16 w-16 shrink-0 rounded-2xl" w={200} h={200} />
                    <div className="min-w-0 flex-1">
                      {editing === c.id
                        ? <input autoFocus defaultValue={c.title} onBlur={(e) => { setCollected(collected.map((x) => (x.id === c.id ? { ...x, title: e.target.value || x.title } : x))); setEditing(null) }} className="h-10 w-full rounded-xl border border-ink px-3 font-bold outline-none" />
                        : <p className="truncate text-[17px] font-extrabold">{c.title}</p>}
                      <p className="text-[14px] text-ink-2">{c.sub}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCollected(collected.map((x) => (x.id === c.id ? { ...x, must: !x.must } : x)))} aria-pressed={c.must} className={clsx('inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-bold', c.must ? 'bg-brand text-white' : 'bg-surface hover:bg-line')}><Star size={14} weight={c.must ? 'fill' : 'bold'} /> Must do</button>
                      <button onClick={() => setEditing(c.id)} aria-label="Edit" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface"><PencilSimple size={18} /></button>
                      <button onClick={() => setCollected(collected.filter((x) => x.id !== c.id))} aria-label="Remove" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface"><Trash size={18} /></button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        )
      })}
      <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-full bg-ink p-2 pl-6 text-white shadow-[var(--shadow-lift)]">
        <span className="text-[15px] font-semibold">{collected.length} items ready</span>
        <Button v="primary" size="lg" onClick={done}>Looks good, build my trip</Button>
      </div>
    </div>
  )
}

export { Car }
