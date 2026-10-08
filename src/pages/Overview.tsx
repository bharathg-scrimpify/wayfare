import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, AirplaneTilt, Bed, Ticket, FileText, Heart, Sparkle, Headset, MapPin, SealCheck, UploadSimple, Plus, ArrowsLeftRight, Check } from '@phosphor-icons/react'
import { Avatar, AvatarStack, Button, Cover, Img, Reveal, Ring, KindBadge } from '../components/ui'
import { DAYS, DOCUMENTS, PEOPLE, TRIP, CATALOG, fmt12 } from '../data/mock'
import { GapList } from '../components/Shell'
import { useTrip } from '../store/trip'

export default function Overview() {
  const { gaps, items, wishlist, getExp, activity, unseen, markSeen, addToWishlist, runGapAction } = useTrip()
  const nav = useNavigate()
  const score = Math.max(28, 100 - gaps.reduce((s, g) => s + (g.severity === 'high' ? 11 : g.severity === 'medium' ? 5 : 3), 0))
  const next = gaps[0]
  const bookings = items.filter((i) => i.kind === 'fixed' && (i.type === 'flight' || i.type === 'hotel' || i.type === 'activity' || i.type === 'transfer'))
  const day3 = items.filter((i) => i.day === 2).sort((a, b) => a.start.localeCompare(b.start))
  const picks = CATALOG.filter((c) => !wishlist.includes(c.id) && !items.some((i) => i.title === c.title) && ['canal', 'shoreditch', 'notting2', 'kew'].includes(c.id)).slice(0, 4)
  const latest = activity.slice(0, 3)

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-4 md:px-10">
      <section className="relative overflow-hidden rounded-[32px]">
        <Cover k={TRIP.cover} className="absolute inset-0" w={1600} h={800} alt="London" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        <div className="relative grid gap-8 p-6 text-white md:grid-cols-[1fr_auto] md:items-end md:p-12 md:pt-28">
          <div>
            <p className="text-[14px] font-semibold text-white/75">{TRIP.dates}, {TRIP.who.toLowerCase()}, {TRIP.occasion.toLowerCase()}</p>
            <h1 className="mt-1 max-w-[14ch] text-[40px] font-extrabold leading-[1.02] tracking-tighter md:text-[60px]">{TRIP.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[14px] font-semibold">
              {TRIP.route.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className={clsx('rounded-full px-3 py-1.5 backdrop-blur', r === TRIP.layover ? 'bg-white/15 text-white/90' : 'bg-white/90 text-ink')}>{r}{r === TRIP.layover ? ' layover' : ''}</span>
                  {i < TRIP.route.length - 1 && <ArrowRight size={14} weight="bold" className="text-white/60" />}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3"><AvatarStack ids={['you', 'arpit', 'tanya', 'fatema']} size={36} /><span className="text-[14px] text-white/80">4 travellers</span></div>
          </div>
          <div className="flex items-center gap-4 rounded-[28px] bg-white p-4 pr-6 text-ink shadow-[var(--shadow-lift)]">
            <Ring value={score} size={92} stroke={9} />
            <div><p className="text-[13px] font-semibold text-ink-3">Trip readiness</p><p className="text-[20px] font-extrabold leading-tight">{gaps.length === 0 ? 'Ready to go' : `${gaps.length} to sort`}</p></div>
          </div>
        </div>
      </section>

      {next && (
        <Reveal className="mt-6">
          <div className="flex flex-col gap-4 rounded-[28px] bg-ink p-6 text-white md:flex-row md:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand"><Sparkle size={28} weight="fill" /></span>
            <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-white/60">Best next step</p><p className="text-[22px] font-extrabold leading-tight">{next.title}</p><p className="mt-1 text-[15px] text-white/70">{next.detail}</p></div>
            <Button size="lg" onClick={() => runGapAction(next)}>{next.action.label}</Button>
          </div>
        </Reveal>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Panel title="Day 3, Tuesday 15 Dec" action={{ label: 'Full itinerary', to: '/trip/itinerary?day=2' }}>
            <ul className="grid gap-2">
              {day3.map((i) => (
                <li key={i.id} className="flex items-center gap-4 rounded-3xl bg-surface p-3">
                  <span className="w-[74px] shrink-0 text-center text-[14px] font-extrabold">{fmt12(i.start)}</span>
                  <Img k={i.imageKey} className="h-12 w-12 shrink-0 rounded-2xl" w={150} h={150} />
                  <span className="min-w-0 flex-1 truncate text-[16px] font-bold">{i.title}</span>
                  <KindBadge kind={i.kind} small />
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>

        <Reveal delay={0.06}>
          <Panel title="Since you last checked" badge={unseen > 0 ? `${unseen} updates` : undefined}>
            <ul className="grid gap-3">
              {latest.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-[15px]"><Avatar id={a.who} size={30} /><span><span className="font-bold">{PEOPLE.find((p) => p.id === a.who)?.name}</span> {a.text}<span className="block text-[12px] text-ink-3">{a.at}</span></span></li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2"><Button size="sm" v="soft" onClick={markSeen}>Mark seen</Button><Button size="sm" v="ghost" onClick={() => nav('/trip/group')}>Open group</Button></div>
          </Panel>
        </Reveal>

        <Reveal>
          <Panel title="Bookings" action={{ label: 'Documents', to: '/trip/import' }}>
            <ul className="grid gap-2.5">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center gap-3 text-[15px]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">{b.type === 'flight' ? <AirplaneTilt size={18} weight="fill" /> : b.type === 'hotel' ? <Bed size={18} weight="fill" /> : <Ticket size={18} weight="fill" />}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{b.title}</span>
                  {b.status === 'requested' ? <span className="rounded-full bg-warn-soft px-2 py-0.5 text-[11px] font-bold text-warn">Requested</span> : <Check size={16} weight="bold" className="text-ok" />}
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>

        <Reveal delay={0.06}>
          <Panel title="Wishlist" action={{ label: 'Open', to: '/trip/wishlist' }}>
            <div className="mb-3 flex -space-x-3">
              {wishlist.slice(0, 5).map((id) => { const e = getExp(id); return e ? <Img key={id} k={e.imageKey} className="h-14 w-14 rounded-2xl ring-2 ring-white" w={150} h={150} /> : null })}
            </div>
            <p className="text-[15px] text-ink-2"><span className="font-extrabold text-ink">{wishlist.length} ideas</span> waiting for a home in your plan.</p>
            <Button size="sm" v="dark" className="mt-4" icon={<Heart size={14} weight="fill" />} onClick={() => nav('/trip/discover')}>Swipe for more</Button>
          </Panel>
        </Reveal>

        <Reveal delay={0.12}>
          <Panel title="Documents">
            <ul className="grid gap-2.5">
              {DOCUMENTS.map((d) => <li key={d.id} className="flex items-center gap-3 text-[15px]"><FileText size={20} className="text-ink-3" /><span className="min-w-0 flex-1 truncate font-semibold">{d.title}</span><span className="text-[12px] text-ink-3">{d.size}</span></li>)}
            </ul>
            <Button size="sm" v="soft" className="mt-4" icon={<UploadSimple size={14} weight="bold" />} onClick={() => nav('/trip/import')}>Add a document</Button>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-2">
          <Panel title="Because you added the British Museum" sub="Four picks that fit. Never an endless list.">
            <div className="grid gap-3 sm:grid-cols-2">
              {picks.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-3xl border border-line p-2.5 pr-3">
                  <Img k={p.imageKey} className="h-16 w-16 shrink-0 rounded-2xl" w={200} h={200} />
                  <div className="min-w-0 flex-1"><p className="truncate text-[15px] font-extrabold">{p.title}</p><p className="truncate text-[12px] text-ink-2">{p.why}</p></div>
                  <button onClick={() => addToWishlist(p.id)} aria-label={`Save ${p.title}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform active:scale-90"><Plus size={16} weight="bold" /></button>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.06}>
          <Panel title="More tools">
            <div className="grid gap-2">
              {[{ to: '/trip/concierge', i: <Headset size={20} weight="fill" />, t: 'Concierge' }, { to: '/trip/nearby', i: <MapPin size={20} weight="fill" />, t: 'What is around me' }, { to: '/trip/final', i: <SealCheck size={20} weight="fill" />, t: 'Final trip check' }, { to: '/trip/dna', i: <ArrowsLeftRight size={20} weight="fill" />, t: 'Your travel DNA' }].map((l) => (
                <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-[15px] font-bold transition-colors hover:bg-line">{l.i}{l.t}<ArrowRight size={14} weight="bold" className="ml-auto" /></Link>
              ))}
            </div>
          </Panel>
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <div className="rounded-[28px] border border-line p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-[22px] font-extrabold tracking-tight">Gaps in your trip</h2><span className="text-[13px] font-semibold text-ink-3">Always on, free while you plan</span></div>
          <GapList compact />
        </div>
      </Reveal>
      <motion.div className="h-6" />
      {DAYS.length < 0 && null}
    </div>
  )
}

function Panel({ title, sub, children, action, badge }: { title: string; sub?: string; children: React.ReactNode; action?: { label: string; to: string }; badge?: string }) {
  return (
    <section className="h-full rounded-[28px] border border-line p-6 transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div><h2 className="text-[19px] font-extrabold tracking-tight">{title}</h2>{sub && <p className="text-[13px] text-ink-2">{sub}</p>}</div>
        {badge && <span className="rounded-full bg-brand px-2.5 py-1 text-[12px] font-bold text-white">{badge}</span>}
        {action && <Link to={action.to} className="shrink-0 text-[14px] font-bold underline underline-offset-4">{action.label}</Link>}
      </div>
      {children}
    </section>
  )
}
