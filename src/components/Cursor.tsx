import { useRef } from 'react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../lib/gsap'

/**
 * A trailing dot + lagging ring cursor. The ring grows and the dot hides when
 * hovering interactive elements ([data-cursor], a, button). Desktop only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isTouch() || prefersReducedMotion()) return
    document.body.classList.add('custom-cursor')

    const dotEl = dot.current!
    const ringEl = ring.current!
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50 })

    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const grow = () =>
      gsap.to(ringEl, { scale: 2, borderColor: 'var(--color-accent)', duration: 0.3 })
    const shrink = () =>
      gsap.to(ringEl, { scale: 1, borderColor: 'var(--color-fg-dim)', duration: 0.3 })

    const interactive = 'a, button, [data-cursor], input, textarea'
    const over = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactive)) grow()
    }
    const out = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactive)) shrink()
    }

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
    }
  }, [])

  // Hidden entirely on touch via CSS media query below
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ring}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border"
        style={{ borderColor: 'var(--color-fg-dim)' }}
      />
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{ background: 'var(--color-accent)' }}
      />
    </div>
  )
}
