import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { MagneticLink } from '../components/MagneticLink'

/** Split a string into per-character spans for staggered reveals. */
function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((c, i) => (
        <span key={i} className="char inline-block will-change-transform">
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      const chars = gsap.utils.toArray<HTMLElement>('.char')

      if (reduce) {
        gsap.set(['.char', '.hero-grad', '.hero-eyebrow', '.hero-role', '.hero-cta', '.hero-cue'], {
          opacity: 1,
          y: 0,
          yPercent: 0,
        })
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.6 })
          .from(
            chars,
            { yPercent: 120, opacity: 0, stagger: 0.03, duration: 0.9 },
            '-=0.2',
          )
          .from('.hero-grad', { yPercent: 110, opacity: 0, duration: 0.9 }, '-=0.7')
          .from('.hero-role', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
          .from('.hero-cta', { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, '-=0.3')
          .from('.hero-cue', { opacity: 0, duration: 0.6 }, '-=0.2')

        // floating idle motion on the name
        gsap.to('.hero-title', {
          yPercent: -2,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }

      // Parallax background + content drift on scroll
      gsap.to('.hero-bg', {
        yPercent: 25,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-content', {
        yPercent: 40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="top"
      className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
    >
      {/* Background art */}
      <div
        className="hero-bg absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: 'url(/about/hero.jpg)' }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-bg)_75%)]" />
      <div className="absolute inset-0 -z-10 bg-[var(--color-bg)]/55" />

      <div className="hero-content relative z-10 mx-auto max-w-6xl px-6 text-center">
        <p className="hero-eyebrow mb-5 font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-accent)] sm:text-sm">
          Gerardo · "Benji" · Colegio
        </p>

        <h1 className="hero-title display font-display font-bold leading-[0.85]">
          <span className="block overflow-hidden pb-[0.05em]">
            <Chars text="SOFTWARE" />
          </span>
          {/* Gradient text can't be split into per-char spans (the glyphs
              would render transparent), so this line reveals as one unit. */}
          <span className="block overflow-hidden pb-[0.05em]">
            <span className="hero-grad inline-block text-gradient">DEVELOPER</span>
          </span>
        </h1>

        <p className="hero-role mx-auto mt-7 max-w-xl text-base text-[var(--color-fg-dim)] sm:text-lg">
          I build things for the web — and I have a little too much fun with the
          animations. Scroll down, it gets weird.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticLink
            href="#projects"
            strength={0.5}
            className="hero-cta rounded-full bg-[var(--color-fg)] px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)]"
          >
            See my work
          </MagneticLink>
          <MagneticLink
            href="#playground"
            strength={0.5}
            className="hero-cta rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)]"
          >
            Enter the playground
          </MagneticLink>
        </div>
      </div>

      <div className="hero-cue absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-dim)]">
        <span className="inline-block animate-bounce">scroll ↓</span>
      </div>
    </section>
  )
}
