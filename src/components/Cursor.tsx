import { useRef } from 'react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../lib/gsap'

/**
 * Contextual cursor: a trailing dot + lagging ring. Over interactive elements
 * the ring grows; over anything carrying `data-cursor-label` it grows larger
 * still and shows that label ("VIEW", "DRAG", "OPEN"…). Desktop only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (isTouch() || prefersReducedMotion()) return
    document.body.classList.add('custom-cursor')

    const dotEl = dot.current!
    const ringEl = ring.current!
    const labelEl = label.current!
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50 })

    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.4, ease: 'power3' })
    const ry = gsap.quickTo(ringEl, 'y', { duration: 0.4, ease: 'power3' })

    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const reset = () => {
      gsap.to(ringEl, {
        width: 36,
        height: 36,
        borderColor: 'var(--color-fg-dim)',
        backgroundColor: 'transparent',
        duration: 0.3,
      })
      gsap.to(labelEl, { opacity: 0, duration: 0.15 })
      gsap.to(dotEl, { opacity: 1, duration: 0.2 })
    }

    const enter = (text?: string) => {
      if (text) {
        labelEl.textContent = text
        gsap.to(ringEl, {
          width: 80,
          height: 80,
          borderColor: 'var(--color-accent)',
          backgroundColor: 'color-mix(in srgb, var(--color-accent) 14%, transparent)',
          duration: 0.3,
        })
        gsap.to(labelEl, { opacity: 1, duration: 0.2 })
        gsap.to(dotEl, { opacity: 0, duration: 0.2 })
      } else {
        gsap.to(ringEl, { width: 56, height: 56, borderColor: 'var(--color-accent)', duration: 0.3 })
        gsap.to(dotEl, { opacity: 0, duration: 0.2 })
      }
    }

    const selector = 'a, button, [data-cursor], [data-cursor-label]'
    const over = (e: Event) => {
      const el = (e.target as HTMLElement).closest(selector) as HTMLElement | null
      if (!el) return
      const labeled = el.closest('[data-cursor-label]') as HTMLElement | null
      enter(labeled?.dataset.cursorLabel)
    }
    const out = (e: Event) => {
      if ((e.target as HTMLElement).closest(selector)) reset()
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

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ring}
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border"
        style={{ borderColor: 'var(--color-fg-dim)' }}
      >
        <span
          ref={label}
          className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)] opacity-0"
        />
      </div>
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{ background: 'var(--color-accent)' }}
      />
    </div>
  )
}
