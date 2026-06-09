import { useRef, useState } from 'react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../lib/gsap'
import { projects, type Project } from '../data/projects'
import { Reveal } from '../components/Reveal'
import { Icon } from '../components/Icon'
import { ProjectModal } from '../components/ProjectModal'

const accents = [
  'var(--color-accent)',
  'var(--color-accent-2)',
  'var(--color-accent-3)',
  'var(--color-accent-4)',
]

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const accent = accents[project.accent ?? 0]

  useGSAP(
    () => {
      const el = ref.current!
      if (isTouch() || prefersReducedMotion()) return
      const img = el.querySelector('.card-img') as HTMLElement
      const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        xTo(px * 12)
        yTo(-py * 12)
        gsap.to(img, { scale: 1.08, duration: 0.5 })
      }
      const leave = () => {
        xTo(0)
        yTo(0)
        gsap.to(img, { scale: 1, duration: 0.5 })
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  return (
    <article
      ref={ref}
      data-cursor
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] [transform-style:preserve-3d]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="card-img h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
        {project.status === 'building' && (
          <span
            className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-ink)]/80 px-3 py-1 font-mono text-[11px] backdrop-blur"
            style={{ color: accent }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: accent }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
            </span>
            currently building
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display text-2xl font-bold">{project.title}</h3>
        <p className="mt-2 text-sm text-[var(--color-fg-dim)]">{project.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-fg-dim)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-4 text-sm">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 font-semibold transition-colors hover:text-[var(--color-accent)]"
            >
              Live <Icon name="external" size={15} />
            </a>
          )}
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
            >
              Code <Icon name="github" size={15} />
            </a>
          )}
          <span className="ml-auto flex items-center gap-1 font-mono text-xs text-[var(--color-fg-dim)] transition-colors group-hover:text-[var(--color-fg)]">
            case study →
          </span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}55, 0 30px 60px -30px ${accent}66` }}
      />
    </article>
  )
}

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null)
  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            // selected work
          </Reveal>
          <Reveal as="h2" className="heading max-w-2xl">
            Stuff I've <span className="text-gradient">built</span> &amp; things I'm building.
          </Reveal>
        </div>
        <Reveal as="p" className="max-w-sm text-[var(--color-fg-dim)]">
          A mix of shipped projects and active experiments. Hover the cards —
          they tilt.
        </Reveal>
      </div>

      <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" y={60}>
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} onOpen={() => setOpenProject(p)} />
        ))}
      </Reveal>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  )
}
