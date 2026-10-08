import { motion } from 'motion/react'
import { CheckCircle, WarningCircle, Sparkle, Check, ArrowRight } from '@phosphor-icons/react'
import { Button, PageTitle, Ring } from '../components/ui'
import { useTrip } from '../store/trip'
import { fmt12 } from '../data/mock'

export default function Final() {
  const { items, gaps, runGapAction } = useTrip()
  const ready = items.filter((i) => i.kind === 'fixed' && i.status !== 'requested')
  const attention = gaps.filter((g) => g.severity !== 'low' && ['Transfer', 'Booking', 'Flights', 'Visa'].includes(g.type))
  const rest = gaps.filter((g) => !attention.includes(g))
  const total = ready.length + attention.length
  const pct = total === 0 ? 100 : Math.round((ready.length / total) * 100)
  const allGood = attention.length === 0

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 md:px-10">
      <PageTitle title="Final trip check" sub="A last look before you go. Ready, needs attention, and nice-to-haves." />
      <div className="relative mb-8 flex items-center gap-6 overflow-hidden rounded-[32px] bg-ink p-6 text-white md:p-8">
        {allGood && <Confetti />}
        <div className="rounded-full bg-white p-2 text-ink"><Ring value={pct} size={110} stroke={10} /></div>
        <div>
          <p className="text-[13px] font-semibold text-white/60">{ready.length} ready, {attention.length} need you</p>
          <p className="text-[28px] font-extrabold leading-tight tracking-tight md:text-[36px]">{allGood ? 'You are trip-ready' : 'Nearly there'}</p>
          <p className="mt-1 max-w-[44ch] text-[15px] text-white/70">{allGood ? 'Everything essential is booked. Enjoy London.' : 'Fix the items below and this turns green.'}</p>
        </div>
      </div>

      <Group title="Ready" tone="ok" icon={<CheckCircle size={22} weight="fill" className="text-ok" />}>
        {ready.map((i) => (
          <li key={i.id} className="flex items-center gap-3 rounded-2xl bg-ok-soft px-4 py-3"><Check size={18} weight="bold" className="text-ok" /><span className="flex-1 truncate text-[15px] font-bold">{i.title}</span><span className="text-[12px] font-semibold text-ink-2">Day {i.day + 1}, {fmt12(i.start)}</span></li>
        ))}
      </Group>

      <Group title="Needs attention" tone="warn" icon={<WarningCircle size={22} weight="fill" className="text-warn" />} empty="Nothing needs you right now.">
        {attention.map((g) => (
          <li key={g.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-warn-soft px-4 py-3">
            <span className="min-w-0 flex-1"><span className="block text-[15px] font-bold">{g.title}</span><span className="block text-[13px] text-ink-2">{g.detail}</span></span>
            <Button size="sm" v="dark" icon={<ArrowRight size={14} weight="bold" />} onClick={() => runGapAction(g)}>{g.action.label}</Button>
          </li>
        ))}
      </Group>

      <Group title="Suggestions" tone="info" icon={<Sparkle size={22} weight="fill" className="text-brand" />} empty="No suggestions. Your days look balanced.">
        {rest.slice(0, 4).map((g) => (
          <li key={g.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface px-4 py-3">
            <span className="min-w-0 flex-1"><span className="block text-[15px] font-bold">{g.title}</span><span className="block text-[13px] text-ink-2">{g.detail}</span></span>
            <Button size="sm" v="outline" onClick={() => runGapAction(g)}>{g.action.label}</Button>
          </li>
        ))}
      </Group>
    </div>
  )
}

function Group({ title, icon, children, empty }: { title: string; tone: string; icon: React.ReactNode; children: React.ReactNode; empty?: string }) {
  const hasKids = Array.isArray(children) ? children.length > 0 : !!children
  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-[22px] font-extrabold tracking-tight">{icon}{title}</h2>
      {hasKids ? <ul className="grid gap-2.5">{children}</ul> : <p className="rounded-2xl bg-surface px-4 py-4 text-[15px] text-ink-2">{empty}</p>}
    </section>
  )
}

function Confetti() {
  const colors = ['#e31c5f', '#ffffff', '#4ade80', '#fbbf24', '#60a5fa']
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 26 }).map((_, i) => (
        <motion.span key={i} className="absolute top-0 h-2.5 w-1.5 rounded-sm" style={{ left: `${(i * 37) % 100}%`, background: colors[i % colors.length] }}
          initial={{ y: -20, rotate: 0, opacity: 1 }} animate={{ y: 260, rotate: 360 + i * 20, opacity: 0 }} transition={{ duration: 2 + (i % 5) * 0.3, delay: (i % 7) * 0.12, ease: 'easeOut' }} />
      ))}
    </div>
  )
}
