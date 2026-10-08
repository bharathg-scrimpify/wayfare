import { Link } from 'react-router-dom'
import { Reveal, Img } from '../components/ui'
import { ArrowRight } from '@phosphor-icons/react'

const RECENT = [
  { to: '/trip', title: 'London for Tanya\'s birthday', sub: '13 to 19 Dec, 4 travellers', k: 'london' },
  { to: '/create', title: 'Switzerland, still deciding', sub: 'Jan 2027, 6 saved reels', k: 'switzerland' },
]

export function Segment() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-28 md:px-10">
      <Reveal><h2 className="mb-6 text-[28px] font-extrabold tracking-tight md:text-[34px]">Recently viewed</h2></Reveal>
      <div className="grid gap-5 md:grid-cols-2">
        {RECENT.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.08}>
            <Link to={r.to} className="group flex items-center gap-5 rounded-[28px] border border-line p-3 pr-6 transition-shadow hover:shadow-[var(--shadow-soft)]">
              <Img k={r.k} className="h-28 w-28 shrink-0 rounded-3xl" w={300} h={300} alt="" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[19px] font-extrabold">{r.title}</p>
                <p className="text-[15px] text-ink-2">{r.sub}</p>
              </div>
              <ArrowRight size={22} weight="bold" className="shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
