import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { Reveal } from '../components/Reveal'

const onset = Array.from({ length: 33 }, (_, i) => `/photography/onset/image${i + 1}.jpg`)
const sports = [
  '361884A1-C62B-4B06-B724-50F401E9AF9B',
  'CF6A3607', 'CF6A3701', 'CF6A8798', 'CF6A8812', 'CF6A8827',
  'CF6A8922', 'CF6A9016', 'CF6A9050', 'CF6A9073', 'CF6A9096',
].map((n) => `/photography/sports/${n}.jpg`)

// A curated mix so the masonry feels varied (cap count for performance).
const gallery = [...sports, ...onset.slice(0, 17)]

export function Photography() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Batch reveal so cards pop in as they enter — cheaper than one trigger each.
      ScrollTrigger.batch('.photo', {
        start: 'top 92%',
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 40, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true },
          ),
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="photography" className="mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="mb-14 max-w-2xl">
        <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent-4)]">
          // beyond code
        </Reveal>
        <Reveal as="h2" className="heading">
          I also shoot <span className="text-gradient">photos</span>.
        </Reveal>
        <Reveal as="p" className="mt-4 text-lg text-[var(--color-fg-dim)]">
          Sports, sets, and travel. The same eye for detail that goes into the
          code goes into the frame. Tap any shot to enlarge.
        </Reveal>
      </div>

      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {gallery.map((src) => (
          <button
            key={src}
            onClick={() => setActive(src)}
            data-cursor
            className="photo block w-full overflow-hidden rounded-xl border border-[var(--color-line)]"
          >
            <img
              src={src}
              alt="Photography by Gerardo Colegio"
              loading="lazy"
              className="w-full transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
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
