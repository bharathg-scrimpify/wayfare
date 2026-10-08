import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { Copy, WhatsappLogo, EnvelopeSimple, Check, Star, Heart, Question, X, UsersThree, Lightning, ArrowRight } from '@phosphor-icons/react'
import { Avatar, AvatarStack, Button, Img, PageTitle, Sheet } from '../components/ui'
import { PEOPLE, type Vote } from '../data/mock'
import { useTrip } from '../store/trip'

const VOTES: { id: Vote; label: string; icon: React.ReactNode }[] = [
  { id: 'must', label: 'Must do', icon: <Star size={14} weight="fill" /> },
  { id: 'interested', label: 'Interested', icon: <Heart size={14} weight="fill" /> },
  { id: 'maybe', label: 'Maybe', icon: <Question size={14} weight="bold" /> },
  { id: 'skip', label: 'Skip', icon: <X size={14} weight="bold" /> },
]
const W: Record<Vote, number> = { must: 3, interested: 2, maybe: 1, skip: 0 }

export default function Group() {
  const { votes, vote, getExp, activity, markSeen, unseen, simulateTeamChanges, addToWishlist, wishlist } = useTrip()
  const [invite, setInvite] = useState(false)
  const [copied, setCopied] = useState(false)
  const ids = ['camden', 'primrose', 'canal', 'kew', 'hampstead']
  const fit = (id: string) => {
    const v = Object.values(votes[id] ?? {}) as Vote[]
    if (!v.length) return 0
    return Math.round((v.reduce((s, x) => s + W[x], 0) / (v.length * 3)) * 100)
  }
  const top = ids.filter((id) => fit(id) >= 60 && !wishlist.includes(id))
  const unseenItems = activity.filter((a) => a.unseen)

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10">
      <PageTitle title="Plan it together" sub="Everyone can add, swipe and move flexible plans. No approvals, no waiting."
        right={<Button size="lg" icon={<UsersThree size={20} weight="fill" />} onClick={() => setInvite(true)}>Invite travellers</Button>} />

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="mb-1 text-[22px] font-extrabold tracking-tight">Vote on ideas</h2>
          <p className="mb-5 text-[15px] text-ink-2">Winning picks flow into the itinerary. We learn each person's taste and the group's.</p>
          <ul className="grid gap-4">
            {ids.map((id) => {
              const e = getExp(id)
              if (!e) return null
              const mine = votes[id]?.you
              const f = fit(id)
              return (
                <li key={id} className="rounded-[28px] border border-line p-3">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Img k={e.imageKey} className="h-32 w-full shrink-0 rounded-3xl sm:h-24 sm:w-32" w={400} h={300} />
                    <div className="min-w-0 flex-1 px-1">
                      <p className="truncate text-[19px] font-extrabold">{e.title}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="inline-flex -space-x-2">
                          {PEOPLE.filter((p) => votes[id]?.[p.id]).map((p) => (
                            <span key={p.id} className="relative"><Avatar id={p.id} size={28} ring /><span className={clsx('absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-white ring-2 ring-white', votes[id]?.[p.id] === 'must' ? 'bg-brand' : votes[id]?.[p.id] === 'interested' ? 'bg-ok' : votes[id]?.[p.id] === 'maybe' ? 'bg-[#d97706]' : 'bg-ink-3')}>{VOTES.find((v) => v.id === votes[id]?.[p.id])?.icon && <span className="scale-[0.6]">{VOTES.find((v) => v.id === votes[id]?.[p.id])?.icon}</span>}</span></span>
                          ))}
                        </span>
                        <motion.span key={f} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="text-[15px] font-extrabold">{f}% group fit</motion.span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 px-1 pb-1">
                    {VOTES.map((v) => (
                      <button key={v.id} onClick={() => vote(id, v.id)} aria-pressed={mine === v.id}
                        className={clsx('inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13px] font-bold transition-all active:scale-95', mine === v.id ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink/50')}>{v.icon}{v.label}</button>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
          {top.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-wrap items-center gap-3 rounded-[28px] bg-ok-soft p-5">
              <Lightning size={26} weight="fill" className="text-ok" />
              <p className="flex-1 text-[16px] font-bold text-ok">{top.length} ideas have strong group support</p>
              <Button v="dark" onClick={() => top.forEach((id) => addToWishlist(id))} icon={<ArrowRight size={16} weight="bold" />}>Send to wishlist</Button>
            </motion.div>
          )}
        </div>

        <aside className="grid content-start gap-4">
          {unseenItems.length > 0 && (
            <motion.div layout className="rounded-[28px] bg-brand-soft p-6">
              <p className="text-[13px] font-bold uppercase tracking-wide text-brand-dark">Since you last checked</p>
              <p className="mt-1 text-[22px] font-extrabold">{unseenItems.length} updates to your trip</p>
              <ul className="mt-3 grid gap-2 text-[15px]">
                {unseenItems.slice(0, 4).map((a) => <li key={a.id} className="flex gap-2"><Check size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" /><span><b>{PEOPLE.find((p) => p.id === a.who)?.name}</b> {a.text}</span></li>)}
              </ul>
              <Button size="sm" v="dark" className="mt-4" onClick={markSeen}>Got it</Button>
            </motion.div>
          )}
          <div className="rounded-[28px] border border-line p-6">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-[19px] font-extrabold">Recent activity</h3>{unseen === 0 && <span className="text-[12px] font-semibold text-ink-3">All caught up</span>}</div>
            <ul className="grid gap-4">
              <AnimatePresence initial={false}>
                {activity.slice(0, 7).map((a) => (
                  <motion.li key={a.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 text-[15px]">
                    <Avatar id={a.who} size={32} />
                    <span className="min-w-0 flex-1"><b>{PEOPLE.find((p) => p.id === a.who)?.name}</b> {a.text}<span className="block text-[12px] text-ink-3">{a.at}</span></span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <Button v="outline" size="sm" className="mt-5 w-full" onClick={simulateTeamChanges}>Demo: Arpit makes 4 changes</Button>
            <p className="mt-2 text-[12px] text-ink-3">One calm notification for a burst of edits, never four.</p>
          </div>
          <div className="rounded-[28px] border border-line p-6">
            <h3 className="mb-3 text-[19px] font-extrabold">On this trip</h3>
            <ul className="grid gap-3">{PEOPLE.map((p) => <li key={p.id} className="flex items-center gap-3 text-[15px] font-semibold"><Avatar id={p.id} size={34} />{p.name}<span className="ml-auto text-[12px] font-medium text-ink-3">{p.id === 'you' ? 'Trip creator' : 'Can edit'}</span></li>)}</ul>
          </div>
        </aside>
      </div>

      <Sheet open={invite} onClose={() => setInvite(false)} title="Invite travellers">
        <p className="mb-4 text-[15px] text-ink-2">Anyone with the link can join and start adding. No sign-up wall for the first look.</p>
        <div className="flex items-center gap-2 rounded-full border border-line p-2 pl-5">
          <span className="min-w-0 flex-1 truncate text-[15px] text-ink-2">wayfare.app/join/london-dec-x7k2</span>
          <Button size="sm" v={copied ? 'soft' : 'dark'} icon={copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />} onClick={() => { navigator.clipboard?.writeText('https://wayfare.app/join/london-dec-x7k2').catch(() => undefined); setCopied(true); setTimeout(() => setCopied(false), 1800) }}>{copied ? 'Copied' : 'Copy'}</Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button v="outline" size="lg" icon={<WhatsappLogo size={22} weight="fill" className="text-[#25D366]" />}>WhatsApp</Button>
          <Button v="outline" size="lg" icon={<EnvelopeSimple size={22} weight="fill" />}>Email</Button>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-3xl bg-surface p-4"><AvatarStack ids={['arpit', 'tanya', 'fatema']} size={32} /><p className="text-[14px] text-ink-2">Arpit, Tanya and Fatema already joined.</p></div>
      </Sheet>
    </div>
  )
}
