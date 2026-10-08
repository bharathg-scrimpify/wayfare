import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Compass, FileArrowUp, Ticket, ArrowRight, Stethoscope, Clock } from '@phosphor-icons/react'
import { Button, Img, Reveal } from '../components/ui'
import { Segment } from './parts'

export default function Home() {
  const reduce = useReducedMotion()
  const rise = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] as const } })
  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1280px] items-center gap-10 px-5 pb-10 pt-4 md:grid-cols-[1.05fr_1fr] md:px-10">
        <div>
          <motion.h1 {...rise(0)} className="text-[44px] font-extrabold leading-[1.02] tracking-tighter md:text-[68px]">
            Everything you planned.<br />
            <span className="text-brand">One trip.</span>
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-5 max-w-[46ch] text-[18px] leading-relaxed text-ink-2">
            Bring your reels, bookings and ideas together. We turn them into a day-by-day plan that actually works.
          </motion.p>
          <motion.div {...rise(0.2)} className="mt-8 flex flex-wrap gap-3">
            <Link to="/create"><Button size="lg" icon={<ArrowRight size={20} weight="bold" />}>Start a trip</Button></Link>
            <Link to="/trip"><Button size="lg" v="outline">Open my London trip</Button></Link>
          </motion.div>
        </div>

        <motion.div {...rise(0.15)} className="relative grid h-[460px] grid-cols-[1.1fr_1fr] gap-4 md:h-[620px]">
          <Img k="london" eager className="h-full rounded-[28px] shadow-[var(--shadow-soft)]" w={800} h={1100} alt="London skyline" />
          <div className="grid grid-rows-[1fr_1.2fr] gap-4">
            <Img k="istanbul" eager className="rounded-[28px]" w={600} h={500} alt="Istanbul" />
            <Img k="switzerland" eager className="rounded-[28px]" w={600} h={700} alt="Swiss Alps" />
          </div>
          <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-3xl bg-white/90 p-3 pr-5 shadow-[var(--shadow-lift)] backdrop-blur-xl md:-left-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white"><Stethoscope size={22} weight="fill" /></span>
            <span><span className="block text-[14px] font-bold">Spotted early</span><span className="block text-[13px] text-ink-2">No airport transfer for your 11:50 PM landing</span></span>
          </motion.div>
          <div className="absolute right-3 top-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[14px] font-bold shadow-[var(--shadow-soft)] backdrop-blur-xl">
            <Clock size={16} weight="bold" /> Day 3, 9:30 AM British Museum
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 pb-20 md:px-10">
        <Reveal><h2 className="mb-2 text-[30px] font-extrabold tracking-tight md:text-[40px]">Start wherever you are</h2></Reveal>
        <Reveal delay={0.05}><p className="mb-8 max-w-[56ch] text-[17px] text-ink-2">Planning from zero, sitting on a pile of saved posts, or fully booked already. Pick your starting line.</p></Reveal>
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal>
            <Link to="/create" className="group relative block h-[380px] overflow-hidden rounded-[28px]">
              <Img k="bali" className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" w={900} h={900} alt="" />
              <Overlay icon={<Compass size={26} weight="fill" />} title="Start from scratch" text="Discover places, swipe what you like, and we build the days around you." />
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link to="/trip/import" className="group relative block h-[380px] overflow-hidden rounded-[28px]">
              <Img k="switzerland" className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" w={700} h={900} alt="" />
              <Overlay icon={<FileArrowUp size={26} weight="fill" />} title="I have research" text="Paste reels, blogs and PDFs. We read them and organise everything." />
            </Link>
          </Reveal>
          <Reveal delay={0.16}>
            <Link to="/trip/import" className="group relative block h-[380px] overflow-hidden rounded-[28px]">
              <Img k="dubai" className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" w={700} h={900} alt="" />
              <Overlay icon={<Ticket size={26} weight="fill" />} title="Already booked" text="Upload tickets and we plan around them, then flag what is missing." />
            </Link>
          </Reveal>
        </div>
      </section>

      <Segment />
    </div>
  )
}

function Overlay({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">{icon}</span>
        <p className="text-[24px] font-extrabold leading-tight">{title}</p>
        <p className="mt-1 max-w-[34ch] text-[15px] leading-relaxed text-white/85">{text}</p>
      </div>
    </>
  )
}
