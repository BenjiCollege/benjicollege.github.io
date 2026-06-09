import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { MagneticLink } from './MagneticLink'
import { Icon } from './Icon'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'Code', href: '#github-stats' },
  { label: 'Playground', href: '#playground' },
  { label: 'Photos', href: '#photography' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const nav = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      // Hide on scroll-down, reveal on scroll-up.
      const showHide = gsap.fromTo(
        nav.current,
        { yPercent: 0 },
        { yPercent: -130, duration: 0.3, paused: true },
      )
      ScrollTrigger.create({
        start: 'top -120',
        end: 'max',
        onUpdate: (self) => {
          if (self.direction === 1) showHide.play()
          else showHide.reverse()
        },
      })
    },
    { scope: nav },
  )

  return (
    <nav
      ref={nav}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-6"
    >
      <a href="#top" className="flex items-center gap-2" data-cursor aria-label="Home">
        <span className="font-mono text-sm font-bold text-[var(--color-accent)]">{'</>'}</span>
        <span className="font-display text-lg font-bold tracking-tight">Benji</span>
      </a>

      {/* Desktop links */}
      <div className="hidden items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/70 px-2 py-1 backdrop-blur md:flex">
        {links.map((l) => (
          <MagneticLink
            key={l.href}
            href={l.href}
            strength={0.5}
            className="rounded-full px-4 py-2 text-sm text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
          >
            {l.label}
          </MagneticLink>
        ))}
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <MagneticLink
          href="/Gerardo_Colegio_Profile.pdf"
          download
          className="rounded-full px-4 py-2 text-sm text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
        >
          Résumé
        </MagneticLink>
        <MagneticLink
          href="https://github.com/BenjiCollege"
          external
          strength={0.5}
          className="flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
        >
          <Icon name="github" size={16} /> GitHub
        </MagneticLink>
      </div>

      {/* Mobile toggle */}
      <button
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span
          className="h-0.5 w-6 bg-[var(--color-fg)] transition-transform"
          style={open ? { transform: 'translateY(4px) rotate(45deg)' } : undefined}
        />
        <span
          className="h-0.5 w-6 bg-[var(--color-fg)] transition-transform"
          style={open ? { transform: 'translateY(-4px) rotate(-45deg)' } : undefined}
        />
      </button>

      {/* Mobile sheet */}
      {open && (
        <div className="fixed inset-x-4 top-20 flex flex-col gap-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 md:hidden">
          {[...links, { label: 'Résumé', href: '/Gerardo_Colegio_Profile.pdf' }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
