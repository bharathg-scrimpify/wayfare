import { useState } from 'react'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { Tray, Hourglass, ChatsCircle, CheckCircle, PaperPlaneTilt, Check } from '@phosphor-icons/react'
import { Button, Chip, Img, Sheet } from '../components/ui'
import { useTrip } from '../store/trip'
import type { Request } from '../data/mock'

const COLS: Request['status'][] = ['New', 'In progress', 'Waiting on traveller', 'Done']
const ICON: Record<Request['status'], React.ReactNode> = { New: <Tray size={18} weight="fill" />, 'In progress': <Hourglass size={18} weight="fill" />, 'Waiting on traveller': <ChatsCircle size={18} weight="fill" />, Done: <CheckCircle size={18} weight="fill" /> }

export default function Admin() {
  const { requests, setRequestStatus, wishlist, getExp, items, pushToast } = useTrip()
  const [open, setOpen] = useState<string | null>(null)
  const cur = requests.find((r) => r.id === open)
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')
  const mine = cur?.traveller.startsWith('You')

  return (
    <div className="bg-surface pb-16 pt-6">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[13px] font-bold uppercase tracking-wide text-ink-3">Team view</p><h1 className="text-[32px] font-extrabold tracking-tight">Traveller requests</h1></div>
          <div className="flex gap-3">{COLS.map((c) => <div key={c} className="rounded-2xl bg-white px-4 py-2.5"><p className="text-[11px] font-bold text-ink-3">{c}</p><p className="text-[22px] font-extrabold">{requests.filter((r) => r.status === c).length}</p></div>)}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLS.map((c) => (
            <section key={c} className="rounded-[24px] bg-white/60 p-3">
              <h2 className="mb-3 flex items-center gap-2 px-2 text-[15px] font-extrabold">{ICON[c]}{c}</h2>
              <ul className="grid gap-3">
                {requests.filter((r) => r.status === c).map((r) => (
                  <motion.li key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => { setOpen(r.id); setNote(''); setMsg('') }} className="w-full rounded-[20px] bg-white p-4 text-left shadow-[0_1px_0_var(--color-line)] transition-shadow hover:shadow-[var(--shadow-soft)]">
                      <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold">{r.type}</span><span className="text-[11px] text-ink-3">{r.when}</span></div>
                      <p className="mt-2 text-[15px] font-extrabold leading-snug">{r.traveller}</p>
                      <p className="text-[13px] text-ink-2">{r.trip}</p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{r.summary}</p>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Sheet open={!!cur} onClose={() => setOpen(null)} title={cur ? `${cur.type} request` : ''} wide>
        {cur && (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid content-start gap-4">
              <div className="rounded-3xl bg-surface p-5">
                <p className="text-[13px] font-bold uppercase tracking-wide text-ink-3">Request</p>
                <p className="mt-1 text-[18px] font-extrabold">{cur.traveller}</p>
                <p className="text-[14px] text-ink-2">{cur.trip}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{cur.summary}</p>
              </div>
              <div className="rounded-3xl border border-line p-5">
                <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-3">Context from their trip</p>
                {mine ? (
                  <ul className="grid gap-2 text-[14px]">
                    <li><b>Trip:</b> London, 13 to 19 Dec, 4 friends, birthday</li>
                    <li><b>Route:</b> Hyderabad, Istanbul (2 hr 15 layover), London</li>
                    <li><b>Booked:</b> {items.filter((i) => i.booked).map((i) => i.title).slice(0, 4).join(', ')}</li>
                    <li><b>Taste:</b> local culture, hidden gems, relaxed pace</li>
                    <li><b>Parents travelling:</b> yes, limit walking</li>
                  </ul>
                ) : (
                  <ul className="grid gap-2 text-[14px]">
                    <li><b>Group:</b> shared trip, everyone can edit</li>
                    <li><b>Preferences:</b> learned from 2 trips, flexible planner</li>
                    <li><b>Documents:</b> flights and hotel already uploaded</li>
                    <li className="text-ink-2">We only ask what is missing.</li>
                  </ul>
                )}
              </div>
              {mine && (
                <div className="rounded-3xl border border-line p-5">
                  <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-3">Wishlist highlights</p>
                  <div className="flex -space-x-3">{wishlist.slice(0, 5).map((id) => { const e = getExp(id); return e ? <Img key={id} k={e.imageKey} className="h-12 w-12 rounded-2xl ring-2 ring-white" w={120} h={120} /> : null })}</div>
                </div>
              )}
            </div>
            <div className="grid content-start gap-4">
              <div>
                <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-ink-3">Status</p>
                <div className="flex flex-wrap gap-2">{COLS.map((c) => <Chip key={c} active={cur.status === c} onClick={() => { setRequestStatus(cur.id, c); pushToast({ text: `Moved to ${c}`, tone: 'ok' }) }}>{c}</Chip>)}</div>
              </div>
              <label className="block"><span className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-ink-3">Internal note</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Visible to the team only" className="w-full rounded-2xl border border-line p-4 text-[15px] outline-none focus:border-ink" /></label>
              <label className="block"><span className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-ink-3">Message the traveller</span>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="Hi, we have options for you" className="w-full rounded-2xl border border-line p-4 text-[15px] outline-none focus:border-ink" /></label>
              <Button icon={<PaperPlaneTilt size={16} weight="fill" />} disabled={!msg} onClick={() => { pushToast({ text: 'Message sent to the traveller', tone: 'ok' }); setMsg('') }}>Send message</Button>
              <p className={clsx('flex items-center gap-2 text-[13px] text-ink-3', !note && 'opacity-0')}><Check size={14} weight="bold" /> Note saved</p>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
