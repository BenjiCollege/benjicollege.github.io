import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { Reveal } from '../components/Reveal'

const onset = Array.from({ length: 33 }, (_, i) => `/photography/onset/image${i + 1}.jpg`)
const sports = [
  '361884A1-C62B-4B06-B724-50F401E9AF9B',
  'CF6A3607', 'CF6A3701', 'CF6A8798', 'CF6A8812', 'CF6A8827',
  'CF6A8922', 'CF6A9016', 'CF6A9050', 'CF6A9073', 'CF6A9096',
].map((n) => `/photography/sports/${n}.jpg`)

// Interleave, then split across two rows.
const mixed: string[] = []
for (let i = 0; i < Math.max(sports.length, onset.length); i++) {
  if (sports[i]) mixed.push(sports[i])
  if (onset[i]) mixed.push(onset[i])
}
const pics = mixed.slice(0, 24)
const rowA = pics.filter((_, i) => i % 2 === 0)
const rowB = pics.filter((_, i) => i % 2 === 1)

/** One infinite, velocity-reactive marquee row of photos. */
function Row({ items, dir, onOpen }: { items: string[]; dir: 1 | -1; onOpen: (s: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = ref.current!
      const tween = gsap.fromTo(
        el,
        { xPercent: dir === 1 ? 0 : -50 },
        { xPercent: dir === 1 ? -50 : 0, duration: 60, ease: 'none', repeat: -1 },
      )

      // Scroll velocity briefly speeds the row up, then eases back to 1×.
      let target = 1
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) =>
          (target = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400)),
      })
      const decay = () => {
        tween.timeScale(tween.timeScale() + (target - tween.timeScale()) * 0.06)
        target += (1 - target) * 0.04
      }
      gsap.ticker.add(decay)

      // Pause the row while a photo in it is hovered.
      const enter = () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: 'auto' })
      const leave = () => (target = 1)
      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointerleave', leave)

      return () => {
        gsap.ticker.remove(decay)
        el.removeEventListener('pointerenter', enter)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  // Duplicate for a seamless loop.
  const loop = [...items, ...items]
  return (
    <div className="flex overflow-hidden">
      <div ref={ref} className="flex shrink-0 gap-4 pr-4">
        {loop.map((src, i) => (
          <button
            key={i}
            onClick={() => onOpen(src)}
            data-cursor-label="OPEN"
            className="group relative h-[clamp(180px,26vh,300px)] shrink-0 overflow-hidden rounded-xl border border-[var(--color-line)]"
          >
            <img
              src={src}
              alt="Photography by Gerardo Colegio"
              loading="lazy"
              decoding="async"
              className="h-full w-auto max-w-none object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-[var(--color-ink)]/0 transition-colors duration-500 group-hover:bg-[var(--color-ink)]/15" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function Photography() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.to('.photo-heading', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="photography" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto mb-14 max-w-7xl px-6">
        <div className="photo-heading max-w-2xl">
          <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent-4)]">
            // beyond code
          </Reveal>
          <Reveal as="h2" className="heading">
            I also shoot <span className="text-gradient">photos</span>.
          </Reveal>
          <Reveal as="p" className="mt-4 text-lg text-[var(--color-fg-dim)]">
            Sports, sets, and travel. The reels run on their own — hover to pause
            a row, tap any frame to enlarge.
          </Reveal>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Row items={rowA} dir={1} onOpen={setActive} />
        <Row items={rowB} dir={-1} onOpen={setActive} />
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--color-ink)]/90 p-6 backdrop-blur"
          onClick={() => setActive(null)}
          data-cursor
        >
          <img
            src={active}
            alt="Enlarged"
            className="max-h-[90vh] max-w-full rounded-xl border border-[var(--color-line)] shadow-2xl"
          />
          <button
            className="absolute right-6 top-6 font-mono text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]"
            aria-label="Close"
          >
            close ✕
          </button>
        </div>
      )}
    </section>
  )
}
