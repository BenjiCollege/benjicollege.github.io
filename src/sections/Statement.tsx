import { useRef } from 'react'
import { gsap, useGSAP, SplitText, prefersReducedMotion } from '../lib/gsap'
import { Doodle } from '../components/Doodle'

/**
 * A big manifesto whose words brighten one-by-one, scrubbed to scroll position.
 * Uses SplitText to break the copy into words, then a scrubbed tween across the
 * section. Key words get an accent color for rhythm.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const target = root.current!.querySelector('.statement-text') as HTMLElement
      const split = new SplitText(target, { type: 'words', wordsClass: 'st-word' })

      if (prefersReducedMotion()) {
        gsap.set(split.words, { opacity: 1 })
        return () => split.revert()
      }

      gsap.set(split.words, { opacity: 0.14 })
      gsap.to(split.words, {
        opacity: 1,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 75%',
          end: 'bottom 75%',
          scrub: true,
        },
      })

      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-5xl px-6 py-32 md:py-48"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
        // how I work
      </p>
      <h2 className="statement-text font-display text-3xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.2]">
        I sweat the details most people scroll right past — the easing on a
        button, the half-second a page takes to load, the tiny moment that makes
        someone grin. Good software is invisible. Great software feels like{' '}
        <span className="relative inline-block text-gradient">
          magic
          <Doodle type="underline" className="absolute -bottom-3 left-0 h-4 w-full" />
        </span>
        . I build for the magic.
      </h2>
    </section>
  )
}
