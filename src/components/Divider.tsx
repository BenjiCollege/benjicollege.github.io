import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

/**
 * Full-width animated SVG divider — a loose wave that draws itself across the
 * screen as it scrolls into view, with little dots that pop in behind it.
 */
export function Divider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const line = ref.current!.querySelector('.divider-line')
      const dots = ref.current!.querySelectorAll('.divider-dot')
      if (prefersReducedMotion()) {
        gsap.set(line, { drawSVG: '100%' })
        gsap.set(dots, { scale: 1, opacity: 1 })
        return
      }
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 92%' } })
        .fromTo(line, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut' })
        .fromTo(
          dots,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(3)' },
          '-=0.6',
        )
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`mx-auto max-w-7xl px-6 ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 1200 40" fill="none" preserveAspectRatio="none" className="h-10 w-full">
        <path
          className="divider-line"
          d="M0 20 C 150 2 300 38 450 20 S 750 2 900 20 S 1150 38 1200 20"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle className="divider-dot" cx="225" cy="20" r="3" fill="var(--color-accent-2)" />
        <circle className="divider-dot" cx="600" cy="20" r="3" fill="var(--color-accent-3)" />
        <circle className="divider-dot" cx="975" cy="20" r="3" fill="var(--color-accent-4)" />
      </svg>
    </div>
  )
}
