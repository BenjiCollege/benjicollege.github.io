import { useEffect, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import type { Project } from '../data/projects'
import { Icon } from './Icon'

const accents = [
  'var(--color-accent)',
  'var(--color-accent-2)',
  'var(--color-accent-3)',
  'var(--color-accent-4)',
]

type Props = { project: Project | null; onClose: () => void }

export function ProjectModal({ project, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null)

  // Esc to close + lock scroll while open.
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [project, onClose])

  useGSAP(
    () => {
      if (!project || prefersReducedMotion()) return
      gsap.fromTo('.pm-scrim', { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(
        '.pm-panel',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.pm-stagger',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.1 },
      )
    },
    { scope: root, dependencies: [project?.title] },
  )

  if (!project) return null
  const accent = accents[project.accent ?? 0]

  return (
    <div ref={root} className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="pm-scrim fixed inset-0 bg-[var(--color-ink)]/80 backdrop-blur" onClick={onClose} />

      <div className="pm-panel relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">
        {/* Close */}
        <button
          onClick={onClose}
          data-cursor
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-ink)]/70 text-[var(--color-fg-dim)] backdrop-blur transition-colors hover:text-[var(--color-fg)]"
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="pm-stagger mb-1 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--color-fg-dim)]">
            {project.year && <span>{project.year}</span>}
            {project.role && <span style={{ color: accent }}>{project.role}</span>}
            {project.status === 'building' && <span style={{ color: accent }}>● currently building</span>}
          </div>

          <h2 className="pm-stagger font-display text-3xl font-bold sm:text-4xl">{project.title}</h2>
          <p className="pm-stagger mt-3 text-[var(--color-fg-dim)]">{project.blurb}</p>

          <div className="pm-stagger mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-fg-dim)]">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-7 space-y-6">
            <Block title="The problem" body={project.problem} fallback="Add the context for this project in src/data/projects.ts → problem." />
            <Block title="My approach" body={project.approach} fallback="Describe how you built it in src/data/projects.ts → approach." />

            {project.highlights && project.highlights.length > 0 && (
              <div className="pm-stagger">
                <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
                  Highlights
                </h3>
                <ul className="space-y-1.5">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--color-fg-dim)]">
                      <span style={{ color: accent }}>▹</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pm-stagger mt-8 flex flex-wrap gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
                style={{ background: accent }}
              >
                Visit live <Icon name="external" size={15} />
              </a>
            )}
            {project.source && (
              <a
                href={project.source}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-fg)]"
              >
                View code <Icon name="github" size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Block({ title, body, fallback }: { title: string; body?: string; fallback: string }) {
  return (
    <div className="pm-stagger">
      <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-fg)]/90">
        {body || <span className="italic text-[var(--color-fg-dim)]">{fallback}</span>}
      </p>
    </div>
  )
}
