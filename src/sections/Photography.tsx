import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { Reveal } from '../components/Reveal'
import { useReducedMotion } from '../lib/preferences'
import { Dialog } from '../components/Dialog'

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

// Reserve each frame's real proportions before its lazy image has decoded.
function photoHeight(src: string) {
  if (src.endsWith('/CF6A9073.jpg')) return 1920
  if (src.endsWith('/CF6A9016.jpg')) return 867
  if (src.includes('/onset/')) return /\/image(?:1|8)\.jpg$/.test(src) ? 853 : 854
  return src.includes('361884A1') ? 854 : 853
}

/** One infinite, velocity-reactive marquee row of photos. */
function Row({ items, dir, onOpen, paused, preload }: { items: string[]; dir: 1 | -1; onOpen: (s: string) => void; paused: boolean; preload: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const isPaused = paused || hovered || focused
  const pauseRef = useRef(isPaused)
  pauseRef.current = isPaused

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
        if (pauseRef.current) { tween.timeScale(0); return }
        tween.timeScale(tween.timeScale() + (target - tween.timeScale()) * 0.06)
        target += (1 - target) * 0.04
      }
      gsap.ticker.add(decay)

      return () => {
        gsap.ticker.remove(decay)
      }
    },
    { scope: ref },
  )

  // Duplicate for a seamless loop.
  const loop = reduced ? items : [...items, ...items]
  return (
    <div className={reduced ? 'overflow-x-auto px-6 py-2' : 'flex overflow-hidden'}>
      <div ref={ref} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }} className="flex shrink-0 gap-4 pr-4">
        {loop.map((src, i) => (
          <button
            key={i}
            tabIndex={i >= items.length ? -1 : 0}
            aria-hidden={i >= items.length || undefined}
            aria-label={`Enlarge ${photoCaption(src)}`}
            onClick={() => onOpen(src)}
            data-cursor-label="OPEN"
            style={{ aspectRatio: `1280 / ${photoHeight(src)}` }}
            className="group relative h-[clamp(180px,26vh,300px)] shrink-0 overflow-hidden rounded-xl border border-[var(--color-line)]"
          >
            <img
              src={src}
              alt={photoCaption(src)}
              width={1280}
              height={photoHeight(src)}
              loading={preload ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full max-w-none object-cover transition-transform duration-700 group-hover:scale-110"
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
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  const [preload, setPreload] = useState(false)
  useEffect(() => {
    // Load both copies before the moving reels enter view, instead of waiting
    // for offscreen transformed frames to trigger native lazy loading.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPreload(true); observer.disconnect() }
    }, { rootMargin: '600px' })
    observer.observe(root.current!)
    return () => observer.disconnect()
  }, [])

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
            Sports and moments behind the scenes. {reduced ? 'Browse each row and select a frame to enlarge.' : 'Hover or focus a row to pause. Select any frame for a closer look.'}
          </Reveal>
          {!reduced && <button aria-pressed={paused} onClick={() => setPaused(!paused)} className="preference-button mt-5">{paused ? 'Play photo reels' : 'Pause photo reels'}</button>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Row items={rowA} dir={1} onOpen={setActive} paused={paused || Boolean(active)} preload={preload} />
        <Row items={rowB} dir={-1} onOpen={setActive} paused={paused || Boolean(active)} preload={preload} />
      </div>

      {/* Lightbox */}
      {active && (
        <Dialog label={photoCaption(active)} onClose={() => setActive(null)} className="photo-dialog">
          <div className="mb-4 flex items-center justify-between gap-4"><p className="text-sm">{photoCaption(active)} · Gerardo Colegio</p><button autoFocus onClick={() => setActive(null)} aria-label="Close photograph" className="preference-button">Close ✕</button></div>
          <img
            src={active}
            alt={photoCaption(active)}
            className="mx-auto max-h-[75vh] max-w-full rounded-xl border border-[var(--color-line)] shadow-2xl"
          />
        </Dialog>
      )}
    </section>
  )
}

function photoCaption(src: string) {
  if (src.endsWith('/CF6A3607.jpg')) return 'Football teams lining up before the snap'
  if (src.endsWith('/onset/image1.jpg')) return 'Crew preparing a green-screen studio set'
  return src.includes('/sports/') ? `Sports collection, frame ${sports.indexOf(src) + 1}` : `Behind the scenes, frame ${onset.indexOf(src) + 1}`
}
