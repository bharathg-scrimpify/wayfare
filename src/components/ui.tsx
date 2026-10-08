import { useEffect, useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import clsx from 'clsx'
import { Lock, ArrowsLeftRight, Heart, X, CheckCircle, WarningCircle, Info } from '@phosphor-icons/react'
import { gradientFor, imageSources } from '../lib/images'
import { PEOPLE } from '../data/mock'
import { useTrip } from '../store/trip'

export const spring = { type: 'spring' as const, stiffness: 320, damping: 30 }

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[20px]" style={{ color: dark ? '#fff' : 'var(--color-brand)' }}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="18" fill="currentColor" />
        <path d="M17 41 L28 22 L36 34 L42 26 L48 41" fill="none" stroke={dark ? '#222' : '#fff'} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      wayfare
    </span>
  )
}

export function Img({ k, alt = '', className, w = 900, h = 700, eager = false }: { k: string; alt?: string; className?: string; w?: number; h?: number; eager?: boolean }) {
  const srcs = imageSources(k, w, h)
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(false)
  const failed = i >= srcs.length
  return (
    <div className={clsx('overflow-hidden', /\babsolute\b/.test(className ?? '') ? '' : 'relative', className)} style={{ background: gradientFor(k) }}>
      {!failed && (
        <img
          key={srcs[i]}
          src={srcs[i]}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          draggable={false}
          onLoad={() => setOk(true)}
          onError={() => { setOk(false); setI((n) => n + 1) }}
          className={clsx('absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500', ok ? 'opacity-100' : 'opacity-0')}
        />
      )}
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { v?: 'primary' | 'dark' | 'outline' | 'ghost' | 'soft'; size?: 'sm' | 'md' | 'lg'; icon?: ReactNode }
export function Button({ v = 'primary', size = 'md', icon, className, children, ...p }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,box-shadow,border-color] duration-200 active:scale-[0.97] disabled:opacity-45 disabled:pointer-events-none'
  const sizes = { sm: 'h-9 px-4 text-[13px]', md: 'h-11 px-5 text-[15px]', lg: 'h-14 px-8 text-[16px]' }
  const vs = {
    primary: 'bg-brand text-white hover:bg-brand-dark shadow-brand',
    dark: 'bg-ink text-white hover:bg-black',
    outline: 'border border-ink/25 bg-white text-ink hover:border-ink hover:bg-surface',
    ghost: 'text-ink hover:bg-surface',
    soft: 'bg-surface text-ink hover:bg-line',
  }
  return (
    <button className={clsx(base, sizes[size], vs[v], className)} {...p}>
      {icon}
      {children}
    </button>
  )
}

export function Chip({ active, children, onClick, icon, className }: { active?: boolean; children: ReactNode; onClick?: () => void; icon?: ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-4 h-11 text-[14px] font-semibold transition-all duration-200 active:scale-[0.97]',
        active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/50',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function Avatar({ id, size = 32, ring = false }: { id: string; size?: number; ring?: boolean }) {
  const p = PEOPLE.find((x) => x.id === id) ?? PEOPLE[0]
  return (
    <span
      title={p.name}
      className={clsx('inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white', ring && 'ring-2 ring-white')}
      style={{ width: size, height: size, background: p.tint, fontSize: size * 0.4 }}
    >
      {p.name[0]}
    </span>
  )
}

export function AvatarStack({ ids, size = 28 }: { ids: string[]; size?: number }) {
  return (
    <span className="inline-flex -space-x-2">
      {ids.map((i) => <Avatar key={i} id={i} size={size} ring />)}
    </span>
  )
}

export function KindBadge({ kind, small }: { kind: 'fixed' | 'flexible' | 'wishlist'; small?: boolean }) {
  const cfg = {
    fixed: { t: 'Fixed', c: 'bg-ink text-white', i: <Lock weight="fill" size={small ? 11 : 13} /> },
    flexible: { t: 'Flexible', c: 'bg-surface text-ink border border-line', i: <ArrowsLeftRight weight="bold" size={small ? 11 : 13} /> },
    wishlist: { t: 'Wishlist', c: 'bg-brand-soft text-brand-dark', i: <Heart weight="fill" size={small ? 11 : 13} /> },
  }[kind]
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full font-semibold', small ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]', cfg.c)}>
      {cfg.i}
      {cfg.t}
    </span>
  )
}

export function Ring({ value, size = 84, stroke = 8, label }: { value: number; size?: number; stroke?: number; label?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const reduce = useReducedMotion()
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-brand)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{label ?? <span className="text-[20px] font-extrabold">{Math.round(value)}%</span>}</div>
    </div>
  )
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { id: T; label: string; icon?: ReactNode }[] }) {
  return (
    <div className="inline-flex rounded-full bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={clsx('relative inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-semibold transition-colors', value === o.id ? 'text-ink' : 'text-ink-2')}
        >
          {value === o.id && <motion.span layoutId={`seg-${options.map((x) => x.id).join('')}`} className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgb(34_34_34/0.12)]" transition={spring} />}
          <span className="relative flex items-center gap-2">{o.icon}{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export function Sheet({ open, onClose, title, children, wide, footer }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className={clsx('relative flex max-h-[92dvh] w-full flex-col rounded-t-[28px] bg-white shadow-[var(--shadow-lift)] md:rounded-[28px]', wide ? 'md:max-w-3xl' : 'md:max-w-xl')}
            initial={{ y: 60, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={spring}
          >
            <div className="flex items-center justify-between px-6 pb-2 pt-5">
              <h2 className="text-[20px] font-extrabold tracking-tight">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface"><X size={20} weight="bold" /></button>
            </div>
            <div className="overflow-y-auto px-6 pb-6">{children}</div>
            {footer && <div className="border-t border-line px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function Toaster() {
  const { toasts, dismissToast } = useTrip()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ y: 24, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={spring}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-ink py-3 pl-4 pr-3 text-[14px] font-medium text-white shadow-[var(--shadow-lift)]"
            role="status"
          >
            {t.tone === 'ok' ? <CheckCircle size={20} weight="fill" className="text-[#4ade80]" /> : t.tone === 'warn' ? <WarningCircle size={20} weight="fill" className="text-[#fbbf24]" /> : <Info size={20} weight="fill" className="text-[#93c5fd]" />}
            <span>{t.text}</span>
            {t.action && (
              <button onClick={() => { t.action?.run(); dismissToast(t.id) }} className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold hover:bg-white/25">{t.action.label}</button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function PageTitle({ title, sub, right, compact }: { title: string; sub?: string; right?: ReactNode; compact?: boolean }) {
  return (
    <div className={clsx('mb-6 flex flex-wrap items-end justify-between gap-4', compact && 'max-md:mb-4')}>
      <div>
        <h1 className={clsx('font-extrabold leading-tight tracking-tight md:text-[38px]', compact ? 'text-[26px]' : 'text-[30px]')}>{title}</h1>
        {sub && <p className={clsx('mt-1 max-w-[60ch] text-[16px] text-ink-2', compact && 'max-md:hidden')}>{sub}</p>}
      </div>
      {right}
    </div>
  )
}
