import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

type Props = {
  children: ReactNode
  className?: string
  /** stagger children instead of the element itself */
  stagger?: boolean
  y?: number
  delay?: number
  as?: ElementType
}

/**
 * Scroll-triggered reveal. Fades + rises into view once. When `stagger` is set,
 * its direct children animate in sequence. Respects reduced-motion (instant).
 */
export function Reveal({
  children,
  className,
  stagger = false,
  y = 40,
  delay = 0,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current!
      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        },
      )
      // ScrollTrigger auto-refreshes on window load + resize, so no manual
      // per-instance refresh() here (that was O(n²) across all Reveals).
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
