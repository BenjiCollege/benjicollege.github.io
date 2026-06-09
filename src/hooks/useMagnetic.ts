import { useRef } from 'react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../lib/gsap'

/**
 * Magnetic hover: the element is pulled toward the cursor while hovered and
 * springs back on leave. Returns a ref to spread onto any element.
 *
 * @param strength how far (px-ish multiplier) the element drifts toward the pointer
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.4) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || isTouch() || prefersReducedMotion()) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const relX = e.clientX - (r.left + r.width / 2)
        const relY = e.clientY - (r.top + r.height / 2)
        xTo(relX * strength)
        yTo(relY * strength)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref },
  )

  return ref
}
