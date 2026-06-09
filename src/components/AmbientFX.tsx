import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../lib/gsap'

/**
 * Two designer flourishes:
 *  • a soft spotlight glow that follows the cursor (sits behind content, so it
 *    lights the background/aurora near the pointer — never washes out text)
 *  • a baseline/column "design grid" overlay you toggle with the `g` key
 */
export function AmbientFX() {
  const glow = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState(false)

  useGSAP(() => {
    if (isTouch() || prefersReducedMotion()) return
    const el = glow.current!
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    let shown = false
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      if (!shown) {
        shown = true
        gsap.to(el, { opacity: 1, duration: 0.6 })
      }
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // `g` toggles the design grid (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey) return
      if (e.key.toLowerCase() === 'g') setGrid((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* spotlight — behind content */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-[5] hidden h-[40rem] w-[40rem] rounded-full md:block"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 60%)',
        }}
      />

      {/* design grid overlay */}
      {grid && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-4 gap-4 px-6 sm:grid-cols-6 lg:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full border-x border-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)]"
              />
            ))}
          </div>
          {/* baseline rows */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 95px, color-mix(in srgb, var(--color-accent) 14%, transparent) 95px, color-mix(in srgb, var(--color-accent) 14%, transparent) 96px)',
            }}
          />
          <span className="absolute bottom-5 left-5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/80 px-3 py-1.5 font-mono text-xs text-[var(--color-accent)] backdrop-blur">
            design grid · press G to hide
          </span>
        </div>
      )}
    </>
  )
}
