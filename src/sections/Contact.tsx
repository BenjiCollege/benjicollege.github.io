import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { socials, EMAIL } from '../data/socials'
import { Icon } from '../components/Icon'
import { MagneticLink } from '../components/MagneticLink'
import { useMagnetic } from '../hooks/useMagnetic'

function SocialCard({ s }: { s: (typeof socials)[number] }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3)
  return (
    <a
      ref={ref}
      href={s.href}
      target={s.icon === 'mail' ? undefined : '_blank'}
      rel="noreferrer"
      data-cursor
      className="group flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4 transition-colors hover:border-[var(--color-accent)]"
    >
      <span className="flex items-center gap-3">
        <span className="text-[var(--color-fg-dim)] transition-colors group-hover:text-[var(--color-accent)]">
          <Icon name={s.icon} size={22} />
        </span>
        <span className="font-semibold">{s.label}</span>
      </span>
      <span className="font-mono text-xs text-[var(--color-fg-dim)]">{s.handle}</span>
    </a>
  )
}

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // The giant word slides in on scrub
      gsap.from('.contact-big span', {
        yPercent: 110,
        stagger: 0.05,
        ease: 'power3.out',
        duration: 1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          // say hello
        </p>

        <h2 className="contact-big display font-display leading-[0.85]">
          <span className="block overflow-hidden">
            <span className="inline-block">LET'S</span>
          </span>
          <span className="block overflow-hidden text-gradient">
            <span className="inline-block">CONNECT</span>
          </span>
        </h2>

        <p className="mt-6 max-w-md text-lg text-[var(--color-fg-dim)]">
          Got a project, a question, or just want to talk shop? My inbox is
          open and I love meeting other developers.
        </p>

        <div className="mt-8">
          <MagneticLink
            href={`mailto:${EMAIL}`}
            strength={0.4}
            className="inline-flex items-center gap-3 rounded-full bg-[var(--color-fg)] px-8 py-4 font-semibold text-[var(--color-ink)]"
          >
            <Icon name="mail" size={18} /> {EMAIL}
          </MagneticLink>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((s) => (
            <SocialCard key={s.label} s={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
