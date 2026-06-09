import { useRef, useState, type ReactNode } from 'react'
import { gsap, useGSAP, Draggable, Flip, prefersReducedMotion } from '../lib/gsap'
import { useMagnetic } from '../hooks/useMagnetic'
import { Reveal } from '../components/Reveal'

/** A titled demo tile. The label tells visitors *which* animation they're seeing. */
function Demo({
  name,
  hint,
  children,
  className,
}: {
  name: string
  hint: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 ${className ?? ''}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {name}
        </span>
        <span className="font-mono text-[11px] text-[var(--color-fg-dim)]">{hint}</span>
      </div>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  )
}

/* 1 ─ Magnetic ----------------------------------------------------------- */
function MagneticDemo() {
  const ref = useMagnetic<HTMLButtonElement>(0.7)
  return (
    <button
      ref={ref}
      data-cursor
      className="rounded-full bg-[var(--color-fg)] px-8 py-4 font-semibold text-[var(--color-ink)]"
    >
      pull me
    </button>
  )
}

/* 2 ─ Scramble ----------------------------------------------------------- */
function ScrambleDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const run = () => {
    const el = ref.current!.querySelector('.scramble') as HTMLElement
    gsap.to(el, {
      duration: 1,
      scrambleText: { text: 'DECODED!', chars: 'upperCase', speed: 0.4 },
    })
  }
  const reset = () => {
    const el = ref.current!.querySelector('.scramble') as HTMLElement
    gsap.to(el, { duration: 0.8, scrambleText: { text: 'hover me', chars: '01' } })
  }
  return (
    <div ref={ref} onPointerEnter={run} onPointerLeave={reset} data-cursor className="cursor-pointer">
      <span className="scramble font-mono text-2xl font-bold text-[var(--color-accent-2)]">
        hover me
      </span>
    </div>
  )
}

/* 3 ─ Flip shuffle ------------------------------------------------------- */
function FlipDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5])
  const colors = [
    'var(--color-accent)',
    'var(--color-accent-2)',
    'var(--color-accent-3)',
    'var(--color-accent-4)',
    'var(--color-fg)',
    'var(--color-fg-dim)',
  ]
  const shuffle = () => {
    const items = ref.current!.querySelectorAll('.flip-item')
    const state = Flip.getState(items)
    setOrder((o) => [...o].sort(() => Math.random() - 0.5))
    requestAnimationFrame(() =>
      Flip.from(state, { duration: 0.6, ease: 'power3.inOut', stagger: 0.04 }),
    )
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={ref} className="grid grid-cols-3 gap-2">
        {order.map((i) => (
          <div
            key={i}
            className="flip-item h-9 w-9 rounded-lg"
            style={{ background: colors[i] }}
          />
        ))}
      </div>
      <button onClick={shuffle} data-cursor className="font-mono text-xs text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]">
        ⟳ shuffle
      </button>
    </div>
  )
}

/* 4 ─ Draggable + inertia ----------------------------------------------- */
function DragDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      Draggable.create(handle.current, {
        bounds: ref.current,
        inertia: true,
        edgeResistance: 0.7,
        onDrag() {
          gsap.to(handle.current, { rotation: this.deltaX * 0.4, duration: 0.3 })
        },
        onRelease() {
          gsap.to(handle.current, { rotation: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
        },
      })
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className="relative h-[140px] w-full">
      <div
        ref={handle}
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent-3)] to-[var(--color-accent-4)] font-bold text-[var(--color-ink)]"
      >
        fling
      </div>
    </div>
  )
}

/* 5 ─ Stagger burst ------------------------------------------------------ */
function StaggerDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const burst = () => {
    gsap.fromTo(
      ref.current!.querySelectorAll('.dot'),
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(3)',
        stagger: { each: 0.025, from: 'center', grid: 'auto' },
      },
    )
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={ref} className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="dot h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
        ))}
      </div>
      <button onClick={burst} data-cursor className="font-mono text-xs text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]">
        ✦ burst
      </button>
    </div>
  )
}

/* 6 ─ Elastic squish ----------------------------------------------------- */
function ElasticDemo() {
  const ref = useRef<HTMLButtonElement>(null)
  const boing = () =>
    gsap.fromTo(
      ref.current,
      { scale: 0.6 },
      { scale: 1, duration: 1.1, ease: 'elastic.out(1.2,0.3)' },
    )
  return (
    <button
      ref={ref}
      onClick={boing}
      data-cursor
      className="grid h-20 w-20 place-items-center rounded-full border-2 border-[var(--color-accent-2)] font-mono text-sm text-[var(--color-accent-2)]"
    >
      boing
    </button>
  )
}

export function Playground() {
  return (
    <section
      id="playground"
      className="relative overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-ink)] py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent-3)]">
            // the playground
          </Reveal>
          <Reveal as="h2" className="heading">
            An animation <span className="text-gradient">playground</span>.
          </Reveal>
          <Reveal as="p" className="mt-4 text-lg text-[var(--color-fg-dim)]">
            Every tile is a different GSAP toy. Hover them, click them, fling
            them around. This is the part I had the most fun with.
          </Reveal>
        </div>

        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" y={50}>
          <Demo name="Magnetic" hint="hover"><MagneticDemo /></Demo>
          <Demo name="ScrambleText" hint="hover"><ScrambleDemo /></Demo>
          <Demo name="Flip" hint="click"><FlipDemo /></Demo>
          <Demo name="Draggable · inertia" hint="drag"><DragDemo /></Demo>
          <Demo name="Stagger · grid" hint="click"><StaggerDemo /></Demo>
          <Demo name="Elastic ease" hint="click"><ElasticDemo /></Demo>
        </Reveal>
      </div>
    </section>
  )
}
