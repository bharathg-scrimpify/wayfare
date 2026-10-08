import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { AirplaneTilt, Bed, Ticket, IdentificationCard, Crown, UsersThree, CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { Button, Chip, Img, PageTitle, Sheet } from '../components/ui'
import { KnownBox, VisaStatus } from '../components/Sheets'
import { useTrip } from '../store/trip'
import { CATALOG } from '../data/mock'

type Svc = 'stay' | 'special' | 'build' | null

export default function Concierge() {
  const { setOpenConcierge, setOpenBooking, visaRequested, items } = useTrip()
  const [svc, setSvc] = useState<Svc>(null)
  const hasReturn = items.some((i) => i.type === 'flight' && i.day === 6)
  const bookable = CATALOG.filter((c) => c.needsBooking && c.priceInr).slice(0, 3)

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10">
      <PageTitle title="Concierge" sub="Real people, backed by your whole trip. They start with what we already know, so you never repeat yourself." />

      <div className="grid gap-5 md:grid-cols-6">
        <Tile span="md:col-span-3" k="flight" icon={<AirplaneTilt size={26} weight="fill" />} title="Flights" text={hasReturn ? 'Return flight requested. A specialist will call you.' : 'No return flight yet. Request a call back with options.'} cta={hasReturn ? 'Requested' : 'Request a call back'} done={hasReturn} onClick={() => setOpenConcierge('flight')} />
        <Tile span="md:col-span-3" k="hotel" icon={<Bed size={26} weight="fill" />} title="Stays" text="Want a second opinion on where you are sleeping, or a better rate? We will look." cta="Request a call back" onClick={() => setSvc('stay')} />
        <Tile span="md:col-span-2" k="london" icon={<IdentificationCard size={26} weight="fill" />} title="Visa concierge" text={visaRequested ? 'In progress. We will tell you what you need for the UK and your Istanbul transit.' : 'We handle requirements, paperwork and applications.'} cta={visaRequested ? 'View status' : 'Start a request'} onClick={() => setOpenConcierge('visa')} extra={visaRequested ? <VisaStatus current={1} /> : null} />
        <Tile span="md:col-span-2" k="theatre" icon={<Crown size={26} weight="fill" />} title="Private and exclusive" text="After-hours access, private guides, a table nobody else can get." cta="Find something special" onClick={() => setSvc('special')} />
        <Tile span="md:col-span-2" k="bali" icon={<UsersThree size={26} weight="fill" />} title="Build my trip for me" text="Hand over your research. Our team returns a full plan, using everything on your trip." cta="Help me build my trip" onClick={() => setSvc('build')} />
      </div>

      <h2 className="mb-1 mt-12 text-[26px] font-extrabold tracking-tight">Book an experience</h2>
      <p className="mb-5 text-[15px] text-ink-2">Pick it, pay a small advance, and our team locks it in and confirms the final price.</p>
      <div className="grid gap-5 md:grid-cols-3">
        {bookable.map((b) => (
          <motion.div key={b.id} whileHover={{ y: -4 }} className="overflow-hidden rounded-[28px] border border-line">
            <Img k={b.imageKey} className="h-48 w-full" w={700} h={420} />
            <div className="p-5">
              <p className="text-[19px] font-extrabold leading-tight">{b.title}</p>
              <p className="mt-1 text-[14px] text-ink-2">{b.area}, from ₹{b.priceInr?.toLocaleString('en-IN')} per person</p>
              <Button v="dark" className="mt-4 w-full" icon={<Ticket size={16} weight="fill" />} onClick={() => setOpenBooking({ expId: b.id })}>Help me book this</Button>
            </div>
          </motion.div>
        ))}
      </div>
      <RequestSheet svc={svc} onClose={() => setSvc(null)} />
    </div>
  )
}

function Tile({ span, k, icon, title, text, cta, onClick, done, extra }: { span: string; k: string; icon: React.ReactNode; title: string; text: string; cta: string; onClick: () => void; done?: boolean; extra?: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`${span} group relative overflow-hidden rounded-[28px] bg-ink text-white`}>
      <Img k={k} className="absolute inset-0 opacity-40 transition-transform duration-700 group-hover:scale-105" w={900} h={600} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
      <div className="relative flex h-full min-h-[260px] flex-col justify-end p-6">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">{icon}</span>
        <p className="text-[24px] font-extrabold leading-tight">{title}</p>
        <p className="mt-1 max-w-[44ch] text-[15px] leading-relaxed text-white/80">{text}</p>
        {extra && <div className="mt-2 text-white [&_span]:text-white">{extra}</div>}
        <Button v={done ? 'soft' : 'primary'} className="mt-4 w-fit" onClick={onClick} icon={done ? <CheckCircle size={18} weight="fill" /> : <ArrowRight size={16} weight="bold" />}>{cta}</Button>
      </div>
    </motion.div>
  )
}

function RequestSheet({ svc, onClose }: { svc: Svc; onClose: () => void }) {
  const { addRequest, pushToast } = useTrip()
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [sent, setSent] = useState(false)
  useEffect(() => { setA(''); setB(''); setSent(false) }, [svc])
  const cfg = {
    stay: { title: 'Stays call back', known: [['Destination', 'London, 13 to 19 Dec'], ['Current hotel', 'Bloomsbury Row Hotel'], ['Travellers', '4 adults, 2 rooms']] as [string, string][], q1: 'What would you like?', o1: ['Better rate', 'Another area', 'Upgrade'], q2: '', o2: [] as string[], type: 'Stay' as const, sum: 'Second opinion on hotel, 4 adults' },
    special: { title: 'Private and exclusive', known: [['Destination', 'London'], ['Dates', '13 to 19 Dec 2026'], ['Group', '4 friends'], ['Occasion', 'Birthday']] as [string, string][], q1: 'What are you in the mood for?', o1: ['Private after-hours museum', 'Chef table', 'Behind the scenes'], q2: 'Budget per person', o2: ['Up to ₹20k', '₹20k to ₹50k', 'Open'], type: 'Private experience' as const, sum: 'Birthday, private experience for 4' },
    build: { title: 'Build my trip for me', known: [['Saved places', 'Everything you brought in'], ['Bookings', 'Flights, hotel, theatre, cruise'], ['Taste', 'Local culture, hidden gems'], ['Travellers', '4, parents joining']] as [string, string][], q1: 'How hands-on do you want us?', o1: ['Fill the gaps', 'Plan all days'], q2: '', o2: [] as string[], type: 'Trip build' as const, sum: 'Full trip build with context attached' },
  }[svc ?? 'stay']
  const go = () => { addRequest({ traveller: 'You (Tanya\'s birthday trip)', type: cfg.type, trip: 'London, 13 to 19 Dec', summary: `${cfg.sum}${a ? ', ' + a : ''}${b ? ', ' + b : ''}` }); setSent(true); pushToast({ text: 'Request sent to our team', tone: 'ok' }) }
  return (
    <Sheet open={!!svc} onClose={onClose} title={cfg.title}>
      <KnownBox rows={cfg.known} note="Nothing here needs typing again." />
      {!sent ? (
        <>
          <p className="mb-3 mt-6 text-[14px] font-semibold text-ink-2">{cfg.q1}</p>
          <div className="flex flex-wrap gap-2">{cfg.o1.map((o) => <Chip key={o} active={a === o} onClick={() => setA(o)}>{o}</Chip>)}</div>
          {cfg.q2 && <><p className="mb-3 mt-5 text-[14px] font-semibold text-ink-2">{cfg.q2}</p><div className="flex flex-wrap gap-2">{cfg.o2.map((o) => <Chip key={o} active={b === o} onClick={() => setB(o)}>{o}</Chip>)}</div></>}
          <Button size="lg" className="mt-6 w-full" onClick={go}>Send to our team</Button>
        </>
      ) : (
        <div className="mt-6"><div className="flex items-start gap-3 rounded-3xl bg-ok-soft p-5 text-ok"><CheckCircle size={26} weight="fill" /><p className="text-[16px] font-bold">Sent. Someone on the team will reach out with the full context in front of them.</p></div><Button v="dark" className="mt-4" onClick={onClose}>Done</Button></div>
      )}
    </Sheet>
  )
}
