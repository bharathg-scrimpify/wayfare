import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import { CheckCircle, CreditCard, Bank, DeviceMobile, CircleNotch, Warning, Lock, Check, Circle } from '@phosphor-icons/react'
import { Button, Chip, Sheet, Img } from './ui'
import { useTrip } from '../store/trip'
import { DAYS, fmt12, dur } from '../data/mock'

export function TripSheets() {
  return (
    <>
      <MoveSheet />
      <BookingSheet />
      <ConciergeSheet />
    </>
  )
}

const SLOTS = ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30']

function MoveSheet() {
  const { openMove, setOpenMove, items, previewMove, moveItem, findSlot } = useTrip()
  const it = items.find((i) => i.id === openMove)
  const [day, setDay] = useState(1)
  const [start, setStart] = useState('14:00')
  useEffect(() => { if (it) { setDay(it.day); setStart(it.start) } }, [openMove]) // eslint-disable-line react-hooks/exhaustive-deps
  const conflict = it ? previewMove(it.id, day, start) : null
  if (!it) return <Sheet open={false} onClose={() => undefined}>{null}</Sheet>
  return (
    <Sheet
      open={!!openMove}
      onClose={() => setOpenMove(null)}
      title={`Move ${it.title}`}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3">
          {conflict && (
            <Button v="outline" onClick={() => { const s = findSlot(day, it.durationMin, it.zone, it.id); if (s) setStart(s) }}>Find another time</Button>
          )}
          <Button v={conflict ? 'dark' : 'primary'} onClick={() => { moveItem(it.id, day, start); setOpenMove(null) }}>{conflict ? 'Move anyway' : 'Move here'}</Button>
        </div>
      }
    >
      <p className="mb-3 text-[14px] font-semibold text-ink-2">Which day</p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {DAYS.slice(1, 6).map((d) => (
          <Chip key={d.index} active={day === d.index} onClick={() => setDay(d.index)}>Day {d.index + 1}, {d.short}</Chip>
        ))}
      </div>
      <p className="mb-3 mt-6 text-[14px] font-semibold text-ink-2">Start time</p>
      <div className="flex flex-wrap gap-2">
        {SLOTS.map((s) => <Chip key={s} active={start === s} onClick={() => setStart(s)}>{fmt12(s)}</Chip>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={conflict ?? 'ok'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className={clsx('mt-6 flex items-start gap-3 rounded-3xl p-4 text-[14px] leading-relaxed', conflict ? 'bg-warn-soft text-warn' : 'bg-ok-soft text-ok')}>
          {conflict ? <Warning size={22} weight="fill" className="mt-0.5 shrink-0" /> : <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0" />}
          <span className="font-medium">{conflict ?? 'This works with everything else on that day.'}</span>
        </motion.div>
      </AnimatePresence>
    </Sheet>
  )
}

export function KnownBox({ rows, note }: { rows: [string, string][]; note?: string }) {
  return (
    <div className="rounded-3xl bg-surface p-5">
      <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-3">Already on your trip</p>
      <ul className="grid gap-2.5">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-start gap-3 text-[15px]">
            <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-ok" />
            <span><span className="text-ink-2">{k}: </span><span className="font-semibold">{v}</span></span>
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 text-[13px] text-ink-2">{note}</p>}
    </div>
  )
}

const PRICES: Record<string, number> = { 'Tower of London': 16800 }
const STEPS = ['Request sent', 'Team is confirming', 'Final price ready', 'Pay the balance', 'Booking confirmed']

function BookingSheet() {
  const { openBooking, setOpenBooking, items, getExp, confirmBooking, addRequest } = useTrip()
  const [stage, setStage] = useState<'details' | 'pay' | 'track'>('details')
  const [step, setStep] = useState(0)
  const [date, setDate] = useState('Thu 17 Dec')
  const [time, setTime] = useState('09:00')
  const it = items.find((i) => i.id === openBooking?.itemId)
  const exp = openBooking?.expId ? getExp(openBooking.expId) : undefined
  const title = it?.title ?? exp?.title ?? 'Experience'
  const imageKey = it?.imageKey ?? exp?.imageKey ?? 'london'
  const total = PRICES[title] ?? exp?.priceInr ?? 9600
  const advance = Math.round(total * 0.2)
  const money = (n: number) => '₹' + n.toLocaleString('en-IN')

  useEffect(() => { if (openBooking) { setStage('details'); setStep(0); if (it) { setTime(it.start) } } }, [openBooking]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (stage !== 'track') return
    if (step === 0) { const t = setTimeout(() => setStep(1), 1300); return () => clearTimeout(t) }
    if (step === 1) { const t = setTimeout(() => setStep(2), 2000); return () => clearTimeout(t) }
  }, [stage, step])

  const close = () => setOpenBooking(null)
  const pay = () => {
    setStage('track'); setStep(0)
    addRequest({ traveller: 'You (Tanya\'s birthday trip)', type: 'Activity booking', trip: 'London, 13 to 19 Dec', summary: `${title}, ${date} ${fmt12(time)}, 4 travellers, advance of ${money(advance)} paid` })
  }

  return (
    <Sheet open={!!openBooking} onClose={close} title={stage === 'details' ? 'Help me book this' : stage === 'pay' ? 'Pay the advance' : 'Your booking'}>
      <div className="mb-5 flex items-center gap-4 rounded-3xl border border-line p-3">
        <Img k={imageKey} className="h-16 w-16 shrink-0 rounded-2xl" w={200} h={200} />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold">{title}</p>
          <p className="text-[14px] text-ink-2">4 travellers{it ? `, ${dur(it.durationMin)}` : ''}</p>
        </div>
      </div>

      {stage === 'details' && (
        <>
          <p className="mb-3 text-[14px] font-semibold text-ink-2">Date</p>
          <div className="flex flex-wrap gap-2">{['Wed 16 Dec', 'Thu 17 Dec', 'Fri 18 Dec'].map((d) => <Chip key={d} active={date === d} onClick={() => setDate(d)}>{d}</Chip>)}</div>
          <p className="mb-3 mt-5 text-[14px] font-semibold text-ink-2">Time</p>
          <div className="flex flex-wrap gap-2">{['09:00', '10:30', '13:00'].map((t) => <Chip key={t} active={time === t} onClick={() => setTime(t)}>{fmt12(t)}</Chip>)}</div>
          <p className="mt-5 rounded-3xl bg-surface p-4 text-[14px] leading-relaxed text-ink-2">A real person on our team will confirm availability and the final price. You only pay a small advance now.</p>
          <Button size="lg" className="mt-5 w-full" onClick={() => setStage('pay')}>Continue</Button>
        </>
      )}

      {stage === 'pay' && (
        <>
          <div className="rounded-3xl bg-surface p-5">
            <div className="flex items-baseline justify-between"><span className="text-ink-2">Advance today</span><span className="text-[28px] font-extrabold">{money(advance)}</span></div>
            <p className="mt-1 text-[13px] text-ink-2">Estimated total {money(total)}. The team confirms the final price before you pay the rest.</p>
          </div>
          <div className="mt-4 grid gap-2">
            {[{ i: <DeviceMobile size={22} />, t: 'UPI', s: 'Pay with any UPI app' }, { i: <CreditCard size={22} />, t: 'Card', s: 'Visa ending 4417' }, { i: <Bank size={22} />, t: 'Net banking', s: 'All major banks' }].map((m, k) => (
              <label key={m.t} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-line p-4 has-[:checked]:border-ink has-[:checked]:bg-surface">
                <input type="radio" name="pay" defaultChecked={k === 1} className="accent-[#222]" />
                {m.i}
                <span><span className="block font-semibold">{m.t}</span><span className="text-[13px] text-ink-2">{m.s}</span></span>
              </label>
            ))}
          </div>
          <Button size="lg" className="mt-5 w-full" icon={<Lock size={18} weight="fill" />} onClick={pay}>Pay {money(advance)}</Button>
          <p className="mt-3 text-center text-[12px] text-ink-3">Prototype payment. No real charge is made.</p>
        </>
      )}

      {stage === 'track' && (
        <>
          <ol className="grid gap-1">
            {STEPS.map((s, k) => {
              const done = k < step || step === 4
              const cur = k === step && step < 4
              return (
                <li key={s} className="flex items-center gap-4 py-2.5">
                  <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full', done ? 'bg-ok text-white' : cur ? 'bg-ink text-white' : 'bg-surface text-ink-3')}>
                    {done ? <Check size={16} weight="bold" /> : cur ? <CircleNotch size={16} className="animate-spin" /> : <Circle size={10} weight="fill" />}
                  </span>
                  <span className={clsx('text-[16px]', done || cur ? 'font-bold' : 'text-ink-3')}>{s}</span>
                  {k === 2 && step >= 2 && <span className="ml-auto rounded-full bg-ok-soft px-3 py-1 text-[13px] font-bold text-ok">{money(total)}</span>}
                </li>
              )
            })}
          </ol>
          {step === 2 && (
            <Button size="lg" className="mt-4 w-full" onClick={() => setStep(3)}>Pay the balance {money(total - advance)}</Button>
          )}
          {step === 3 && (
            <Button size="lg" className="mt-4 w-full" onClick={() => { setStep(4); confirmBooking({ itemId: it?.id, expId: exp?.id, title }) }}>Confirm payment</Button>
          )}
          {step === 4 && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 rounded-3xl bg-ok-soft p-5 text-ok">
              <p className="text-[18px] font-extrabold">Booked. It is now fixed in your itinerary.</p>
              <p className="mt-1 text-[14px]">Tickets will appear under Documents.</p>
              <Button v="dark" className="mt-4" onClick={close}>Done</Button>
            </motion.div>
          )}
          {step < 2 && <p className="mt-2 text-[13px] text-ink-3">Demo speed. A real reply usually takes a few hours.</p>}
        </>
      )}
    </Sheet>
  )
}

function ConciergeSheet() {
  const { openConcierge, setOpenConcierge, requestFlight, requestTransfer, requestVisa, addRequest, pushToast } = useTrip()
  const [pick, setPick] = useState('')
  const [sent, setSent] = useState(false)
  useEffect(() => { setPick(''); setSent(false) }, [openConcierge])
  const cfg = useMemo(() => {
    if (openConcierge === 'transfer') return {
      title: 'Airport transfer',
      known: [['Arrival', 'Heathrow, 11:50 PM on 13 Dec'], ['Going to', 'Bloomsbury Row Hotel'], ['Travellers', '4 adults']] as [string, string][],
      q: 'Which vehicle suits you?', opts: ['Sedan, up to 3', 'Van, up to 6'], cta: 'Request transfer options',
      done: 'Sent. Our team will share options and prices within a few hours.',
    }
    if (openConcierge === 'flight') return {
      title: 'Return flight',
      known: [['Route', 'London to Hyderabad'], ['Date', '19 Dec, after hotel check-out'], ['Travellers', '4 adults']] as [string, string][],
      q: 'Preferred departure', opts: ['Morning', 'Afternoon', 'Evening', 'No preference'], cta: 'Request a call back',
      done: 'Done. A flight specialist will call you with options.',
    }
    return {
      title: 'Visa concierge',
      known: [['Destination', 'United Kingdom, plus Istanbul transit'], ['Dates', '13 to 19 Dec 2026'], ['Travellers', '4, Indian passports'], ['Contact', 'From your profile']] as [string, string][],
      q: '', opts: [] as string[], cta: 'Send to the visa team',
      done: 'Requested. We will confirm what you need for both countries.',
    }
  }, [openConcierge])
  const submit = () => {
    if (openConcierge === 'transfer') { requestTransfer(); addRequest({ traveller: 'You (Tanya\'s birthday trip)', type: 'Transfer', trip: 'London, 13 to 19 Dec', summary: `Heathrow to Bloomsbury, 11:50 PM, ${pick || 'Sedan'}` }) }
    if (openConcierge === 'flight') { requestFlight(); addRequest({ traveller: 'You (Tanya\'s birthday trip)', type: 'Flights', trip: 'London, 13 to 19 Dec', summary: `LHR to HYD on 19 Dec, ${pick || 'no preference'}, 4 adults` }) }
    if (openConcierge === 'visa') { requestVisa(); addRequest({ traveller: 'You (Tanya\'s birthday trip)', type: 'Visa', trip: 'London, 13 to 19 Dec', summary: 'UK visitor visa and Istanbul transit check, 4 travellers' }) }
    setSent(true)
    pushToast({ text: 'Gap resolved. Your trip is updated.', tone: 'ok' })
  }
  return (
    <Sheet open={!!openConcierge} onClose={() => setOpenConcierge(null)} title={cfg.title}>
      <KnownBox rows={cfg.known} note="We already have this, so we will not ask again." />
      {cfg.q && !sent && (
        <>
          <p className="mb-3 mt-6 text-[14px] font-semibold text-ink-2">{cfg.q}</p>
          <div className="flex flex-wrap gap-2">{cfg.opts.map((o) => <Chip key={o} active={pick === o} onClick={() => setPick(o)}>{o}</Chip>)}</div>
        </>
      )}
      {!sent ? (
        <Button size="lg" className="mt-6 w-full" onClick={submit}>{cfg.cta}</Button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="flex items-start gap-3 rounded-3xl bg-ok-soft p-5 text-ok"><CheckCircle size={26} weight="fill" /><p className="text-[16px] font-bold">{cfg.done}</p></div>
          {openConcierge === 'visa' && <VisaStatus />}
          <Button v="dark" className="mt-4" onClick={() => setOpenConcierge(null)}>Back to my trip</Button>
        </motion.div>
      )}
    </Sheet>
  )
}

export function VisaStatus({ current = 0 }: { current?: number }): ReactNode {
  const labels = ['Requested', 'In progress', 'Completed']
  return (
    <div className="mt-5 flex items-center gap-2">
      {labels.map((l, k) => (
        <div key={l} className="flex flex-1 flex-col gap-2">
          <span className={clsx('h-1.5 rounded-full', k <= current ? 'bg-ok' : 'bg-line')} />
          <span className={clsx('text-[13px]', k <= current ? 'font-bold' : 'text-ink-3')}>{l}</span>
        </div>
      ))}
    </div>
  )
}
