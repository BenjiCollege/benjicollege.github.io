import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { useReducedMotion } from '../lib/preferences'

/**
 * Wire Lenis smooth scrolling into GSAP's ScrollTrigger so pinned sections and
 * scrubbed timelines stay in sync with the eased scroll position.
 * No-ops (native scroll) when the user prefers reduced motion.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    // Refresh can change document height; sync bounds before the next wheel event.
    const resize = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', resize)
    // Expose for programmatic smooth-scroll (command palette, nav jumps).
    ;(window as Window & { __lenis?: Lenis }).__lenis = lenis
    if (document.querySelector('dialog[open]')) lenis.stop()

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      ScrollTrigger.removeEventListener('refresh', resize)
      lenis.destroy()
      delete (window as Window & { __lenis?: Lenis }).__lenis
    }
  }, [reduced])
}
