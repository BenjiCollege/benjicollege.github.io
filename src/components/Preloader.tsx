import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

const SEEN_KEY = 'portfolio-preloaded'

/**
 * Full-screen intro: a 0→100 counter, then the panel splits away to reveal the
 * page. Shows once per browser session (so repeat navigations are instant) and
 * is skipped entirely under reduced-motion.
 */
export function Preloader() {
  const skip =
    typeof window === 'undefined' ||
    prefersReducedMotion() ||
    sessionStorage.getItem(SEEN_KEY) === '1'

  const [done, setDone] = useState(skip)
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (skip) return
      // Lock scroll while the loader is up.
      document.documentElement.style.overflow = 'hidden'

      const counter = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = ''
          sessionStorage.setItem(SEEN_KEY, '1')
          setDone(true)
        },
      })

      tl.to(counter, {
        v: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          const n = Math.round(counter.v)
          if (count.current) count.current.textContent = String(n).padStart(3, '0')
          if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`
        },
      })
        .to('.preloader-meta', { opacity: 0, y: -10, duration: 0.4 }, '+=0.15')
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'expo.inOut',
        })
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--color-ink)]"
    >
      <div className="preloader-meta flex flex-col items-center gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-fg-dim)]">
          Gerardo Colegio
        </span>
        <span
          ref={count}
          className="font-display text-7xl font-bold tabular-nums text-[var(--color-fg)] sm:text-9xl"
        >
          000
        </span>
        <div className="h-[2px] w-48 overflow-hidden bg-[var(--color-line)]">
          <div
            ref={bar}
            className="h-full w-full origin-left bg-[var(--color-accent)]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  )
}
