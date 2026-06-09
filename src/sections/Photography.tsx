import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { Reveal } from '../components/Reveal'

const onset = Array.from({ length: 33 }, (_, i) => `/photography/onset/image${i + 1}.jpg`)
const sports = [
  '361884A1-C62B-4B06-B724-50F401E9AF9B',
  'CF6A3607', 'CF6A3701', 'CF6A8798', 'CF6A8812', 'CF6A8827',
  'CF6A8922', 'CF6A9016', 'CF6A9050', 'CF6A9073', 'CF6A9096',
].map((n) => `/photography/sports/${n}.jpg`)

// Interleave the two sets so neighbours feel varied, then cap for performance.
const gallery: string[] = []
const maxLen = Math.max(sports.length, onset.length)
for (let i = 0; i < maxLen; i++) {
  if (sports[i]) gallery.push(sports[i])
  if (onset[i]) gallery.push(onset[i])
}
const shots = gallery.slice(0, 30)

// Varied frame heights give the columns a magazine rhythm.
const ASPECTS = ['3 / 4', '4 / 5', '1 / 1', '4 / 5', '5 / 7', '1 / 1', '3 / 4', '4 / 6']

export function Photography() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Heading drifts up a touch as the section passes.
      gsap.to('.photo-heading', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

      // Per-photo parallax: the oversized image slides inside its frame at a
      // rate offset from the scroll, so the grid feels like it has depth.
      gsap.utils.toArray<HTMLElement>('.photo').forEach((frame, i) => {
        const img = frame.querySelector('.parallax-img')
        const drift = i % 2 === 0 ? [-20, -4] : [-4, -20] // alternate direction
        gsap.fromTo(
          img,
          { yPercent: drift[0] },
          {
            yPercent: drift[1],
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      // Reveal frames as they enter.
      ScrollTrigger.batch('.photo', {
        start: 'top 94%',
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 50, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.07, overwrite: true },
          ),
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
            Sports, sets, and travel. The same eye for detail that goes into the
            code goes into the frame — scroll through, tap any shot to enlarge.
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {shots.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(src)}
              data-cursor-label="OPEN"
              className="photo group relative block w-full overflow-hidden rounded-xl border border-[var(--color-line)]"
              style={{ aspectRatio: ASPECTS[i % ASPECTS.length] }}
            >
              {/* GSAP translates this wrapper (parallax); CSS scales the <img>
                  inside (hover) — separate elements so transforms don't clash. */}
              <div className="parallax-img absolute inset-0 h-[130%] w-full">
                <img
                  src={src}
                  alt="Photography by Gerardo Colegio"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[var(--color-ink)]/0 transition-colors duration-500 group-hover:bg-[var(--color-ink)]/10" />
            </button>
          ))}
        </div>
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
