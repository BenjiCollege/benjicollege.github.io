import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { Reveal } from '../components/Reveal'
import { Doodle } from '../components/Doodle'

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // photo parallax
      gsap.to('.about-photo', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="about"
      className="relative mx-auto grid max-w-6xl gap-12 px-6 py-28 md:grid-cols-[1.2fr_1fr] md:items-center md:py-40"
    >
      <div>
        <Reveal as="p" className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          // about
        </Reveal>
        <Reveal stagger className="space-y-6">
          <h2 className="heading max-w-xl">
            I'm Benji — a developer who likes the{' '}
            <span className="relative inline-block text-gradient">
              fun
              <Doodle type="underline" className="absolute -bottom-1 left-0 h-3 w-full" />
            </span>{' '}
            part.
          </h2>
          <p className="max-w-xl text-lg text-[var(--color-fg-dim)]">
            I'm a software developer shipping real products by day. I came up
            through <a className="text-[var(--color-fg)] underline decoration-[var(--color-accent)] underline-offset-4" href="https://us.nology.io/" target="_blank" rel="noreferrer">_nology</a>,
            fell in love with building for the browser, and never looked back.
          </p>
          <p className="max-w-xl text-lg text-[var(--color-fg-dim)]">
            When I'm not writing code I'm behind a camera or deep in a game.
            This site is my playground — every animation here is something I
            wanted to try. Poke at things. Break stuff. Then let's
            {' '}
            <a className="text-[var(--color-fg)] underline decoration-[var(--color-accent-3)] underline-offset-4" href="#contact">connect</a>.
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 pt-2 font-mono text-sm text-[var(--color-fg-dim)]">
            <li><span className="text-[var(--color-accent)]">▹</span> Full-stack web</li>
            <li><span className="text-[var(--color-accent-2)]">▹</span> Cloud (_nology)</li>
            <li><span className="text-[var(--color-accent-3)]">▹</span> Photography</li>
            <li><span className="text-[var(--color-accent-4)]">▹</span> Game tinkering</li>
          </ul>
        </Reveal>
      </div>

      <Reveal className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--color-line)]">
          <img
            src="/about/me.jpeg"
            alt="Gerardo (Benji) Colegio"
            loading="lazy"
            className="about-photo h-[112%] w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-2)]/30 blur-2xl" />
      </Reveal>
    </section>
  )
}
