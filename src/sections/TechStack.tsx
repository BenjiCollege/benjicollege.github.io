import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

const stack = [
  'TypeScript', 'React', 'JavaScript', 'Node.js', 'Python', 'HTML', 'CSS',
  'Tailwind', 'GSAP', 'AWS', 'Git', 'REST APIs', 'Vite', 'Express', 'SQL',
]

/** A single marquee row that scrolls in `dir` and reacts to scroll velocity. */
function Row({ dir }: { dir: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = ref.current!
      // Duplicated content makes the loop seamless: animate one copy-width.
      // dir 1 scrolls left (0 → -50%), dir -1 scrolls right (-50% → 0).
      const tween = gsap.fromTo(
        el,
        { xPercent: dir === 1 ? 0 : -50 },
        { xPercent: dir === 1 ? -50 : 0, duration: 28, ease: 'none', repeat: -1 },
      )

      // Scroll velocity speeds the marquee up, then eases back to 1×.
      // Done with plain arithmetic in a single ticker — NO tween is created
      // per scroll event (the previous version spawned two tweens per tick).
      let target = 1
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) =>
          (target = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 500)),
      })
      const decay = () => {
        tween.timeScale(tween.timeScale() + (target - tween.timeScale()) * 0.08)
        target += (1 - target) * 0.04 // target eases back toward 1×
      }
      gsap.ticker.add(decay)
      return () => gsap.ticker.remove(decay)
    },
    { scope: ref },
  )

  const items = [...stack, ...stack]
  return (
    <div className="flex overflow-hidden py-3">
      <div ref={ref} className="flex shrink-0 items-center gap-6 pr-6">
        {items.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6">
            <span className="font-display text-3xl font-bold text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)] sm:text-5xl">
              {t}
            </span>
            <span className="text-[var(--color-accent)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function TechStack() {
  return (
    <section id="stack" className="border-y border-[var(--color-line)] bg-[var(--color-surface)]/40 py-16">
      <div className="mb-6 px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          // the toolbox
        </p>
      </div>
      <Row dir={1} />
      <Row dir={-1} />
    </section>
  )
}
