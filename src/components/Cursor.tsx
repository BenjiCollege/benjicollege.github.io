import { useRef } from 'react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../lib/gsap'

/**
 * Contextual cursor: a trailing dot + lagging ring. Over interactive elements
 * the ring grows; over anything carrying `data-cursor-label` it grows larger
 * still and shows that label ("VIEW", "READ"…). Desktop only.
 *
 * State is derived from each pointermove's target (not pointerover/out) so that
 * moving between a card's children — image, text, tags — never flickers/resets.
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

    let state = ''
    const apply = (next: string) => {
      if (next === state) return
      state = next
      const labeled = next !== '' && next !== 'generic'
      if (labeled) labelEl.textContent = next
      gsap.to(ringEl, {
        width: labeled ? 80 : next === 'generic' ? 56 : 36,
        height: labeled ? 80 : next === 'generic' ? 56 : 36,
        borderColor: next === '' ? 'var(--color-fg-dim)' : 'var(--color-accent)',
        backgroundColor: labeled
          ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)'
          : 'transparent',
        duration: 0.3,
      })
      gsap.to(labelEl, { opacity: labeled ? 1 : 0, duration: 0.2 })
      gsap.to(dotEl, { opacity: next === '' ? 1 : 0, duration: 0.2 })
    }

    const interactive = 'a, button, [data-cursor], input, textarea, [data-cursor-label]'
    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)

      const t = e.target as HTMLElement
      const labeledEl = t.closest?.('[data-cursor-label]') as HTMLElement | null
      if (labeledEl) apply(labeledEl.dataset.cursorLabel || 'generic')
      else if (t.closest?.(interactive)) apply('generic')
      else apply('')
    }

    window.addEventListener('pointermove', move)
    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', move)
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
