import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/** A thin gradient bar at the top that tracks page scroll progress. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      },
    )
  }, [])
  return (
    <div
      ref={bar}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
      style={{
        background:
          'linear-gradient(90deg, var(--color-accent), var(--color-accent-2), var(--color-accent-3))',
      }}
    />
  )
}
