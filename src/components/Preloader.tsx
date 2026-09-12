import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { useReducedMotion } from '../lib/preferences'

const SEEN_KEY = 'portfolio-preloaded'

/**
 * Full-screen intro: a 0→100 counter, then the panel splits away to reveal the
 * page. Shows once per browser session (so repeat navigations are instant) and
 * is skipped entirely under reduced-motion.
 */
export function Preloader() {
  const reduced = useReducedMotion()
  const seen = () => { try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false } }
  const finish = () => {
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* Optional. */ }
    setDone(true)
  }
  const skip =
    typeof window === 'undefined' ||
    prefersReducedMotion() ||
    seen() || Boolean(window.location.hash)

  const [done, setDone] = useState(skip)
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (skip || done) return
      // Lock scroll while the loader is up.
      document.documentElement.style.overflow = 'hidden'

      const counter = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = ''
          finish()
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
      return () => { document.documentElement.style.overflow = '' }
    },
    { scope: root, dependencies: [done] },
  )

  if (done || reduced) return null

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
      <button onClick={finish} className="absolute bottom-8 rounded-full border border-[var(--color-line)] px-6 py-3 text-sm">Skip intro →</button>
    </div>
  )
}
