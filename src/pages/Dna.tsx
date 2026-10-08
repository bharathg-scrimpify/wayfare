import { motion } from 'motion/react'
import { Sparkle, Sun, Moon, Coffee, Rocket, Compass, HandCoins } from '@phosphor-icons/react'
import { PageTitle } from '../components/ui'
import { useTrip } from '../store/trip'
import type { Category } from '../data/mock'

const LABEL: Record<Category, string> = { culture: 'Culture', local: 'Local life', hidden: 'Hidden gems', nature: 'Nature', adventure: 'Adventure', luxury: 'Luxury' }

export default function Dna() {
  const { signals, mustGo, wishlist, swipedCount, items } = useTrip()
  const cats = (Object.keys(signals) as Category[]).sort((a, b) => signals[b] - signals[a])
  const max = Math.max(...Object.values(signals), 1)
  const booked = items.filter((i) => i.booked).length
  const evidence = [
    `Saved ${signals.local + signals.culture} culture and local-life places`,
    `${mustGo.length} marked Must Go`,
    `${wishlist.length} on the wishlist, ${swipedCount} swipes this session`,
    `${booked} bookings made, a strong signal`,
  ]
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 md:px-10">
      <PageTitle title="Your travel DNA" sub="Built from what you do, not from a quiz. It gets sharper with every trip." right={<span className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">Learned from 2 trips</span>} />

      <div className="grid gap-5 md:grid-cols-5">
        <section className="rounded-[28px] border border-line p-6 md:col-span-3">
          <h2 className="mb-5 flex items-center gap-2 text-[20px] font-extrabold"><Sparkle size={20} weight="fill" className="text-brand" /> What you love</h2>
          <ul className="grid gap-4">
            {cats.map((c, i) => (
              <li key={c} className="grid grid-cols-[110px_1fr_28px] items-center gap-3">
                <span className="text-[15px] font-bold">{LABEL[c]}</span>
                <span className="h-3"><motion.span className="block h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: `${(signals[c] / max) * 100}%` }} transition={{ duration: 0.9, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }} style={{ opacity: 0.35 + 0.65 * (signals[c] / max) }} /></span>
                <span className="text-right text-[14px] font-extrabold">{signals[c]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-5 md:col-span-2">
          <Card icon={<Coffee size={22} weight="fill" />} title="Pace" a="Relaxed" b="Two or three things a day, with breathing room" />
          <Card icon={<Sun size={22} weight="fill" />} title="Rhythm" a="Mornings" b="Most plans you keep start before noon" />
          <Card icon={<Rocket size={22} weight="fill" />} title="Planning style" a="Flexible" b="You book key things and leave the rest open" />
        </section>

        <section className="rounded-[28px] border border-line p-6 md:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-[20px] font-extrabold"><HandCoins size={20} weight="fill" /> Spending</h2>
          <p className="text-[15px] text-ink-2">Comfortable stays, pays for experiences that save time, prefers private transfers on arrival nights.</p>
        </section>

        <section className="rounded-[28px] bg-surface p-6 md:col-span-3">
          <h2 className="mb-3 flex items-center gap-2 text-[20px] font-extrabold"><Compass size={20} weight="fill" /> Why we think so</h2>
          <ul className="grid gap-2.5">{evidence.map((e) => <li key={e} className="flex items-start gap-2 text-[15px]"><Moon size={16} weight="fill" className="mt-1 shrink-0 text-ink-3" />{e}</li>)}</ul>
          <p className="mt-4 text-[13px] text-ink-3">Travellers with similar taste also loved Spitalfields and Hampstead, which is why you see them.</p>
        </section>
      </div>
    </div>
  )
}

function Card({ icon, title, a, b }: { icon: React.ReactNode; title: string; a: string; b: string }) {
  return (
    <div className="rounded-[28px] border border-line p-5">
      <p className="mb-1 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-ink-3">{icon}{title}</p>
      <p className="text-[24px] font-extrabold">{a}</p>
      <p className="text-[14px] text-ink-2">{b}</p>
    </div>
  )
}
