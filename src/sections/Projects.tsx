import { useEffect, useRef, useState } from 'react'
import type Lenis from 'lenis'
import { gsap, useGSAP, ScrollTrigger, isTouch, prefersReducedMotion } from '../lib/gsap'
import { projects, type Project } from '../data/projects'
import { projectPath } from '../lib/navigation'
import { useReducedMotion } from '../lib/preferences'
import { Reveal } from '../components/Reveal'
import { Icon } from '../components/Icon'
import { WebGLImage } from '../components/WebGLImage'

const accents = [
  'var(--color-accent)',
  'var(--color-accent-2)',
  'var(--color-accent-3)',
  'var(--color-accent-4)',
]

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null)
  const accent = accents[project.accent ?? 0]

  useGSAP(
    () => {
      const el = ref.current!
      if (isTouch() || prefersReducedMotion()) return
      const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        xTo(px * 12)
        yTo(-py * 12)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
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
      data-cursor-label="VIEW"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] [transform-style:preserve-3d]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <WebGLImage src={project.image} alt={project.title} className="h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-surface-2)] to-[var(--color-accent-2)]/20 px-6 text-center">
            <span className="font-display text-2xl font-bold text-[var(--color-fg-dim)]">{project.title}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
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

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-bold"><a href={projectPath(project.slug)}>{project.title}</a></h3>
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

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm">
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
          <a href={projectPath(project.slug)} aria-label={`Read ${project.title} project story`} className="ml-auto inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-accent)]">Project story →</a>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}55, 0 30px 60px -30px ${accent}66` }}
      />
    </article>
  )
}

function Header({ horizontal, onToggle }: { horizontal: boolean; onToggle?: () => void }) {
  return (
    <div className="project-header mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          // selected work
        </Reveal>
        <Reveal as="h2" className="heading max-w-2xl">
          Stuff I've <span className="text-gradient">built</span> &amp; things I'm building.
        </Reveal>
      </div>
      <Reveal as="p" className="max-w-sm text-[var(--color-fg-dim)]">
        Public projects, from interactive websites to apps in development. {horizontal ? 'Scroll to explore the collection.' : 'Choose a project to explore the story and source.'}
      </Reveal>
      <div className="flex flex-wrap items-center gap-4">
        {onToggle && <button onClick={onToggle} className="preference-button text-sm">{horizontal ? 'Switch to grid view' : 'Switch to scroll view'}</button>}
        {horizontal && <a href="/#about" className="inline-flex min-h-11 items-center text-sm text-[var(--color-fg-dim)]">After the projects ↓</a>}
      </div>
    </div>
  )
}

export function Projects() {
  const reduced = useReducedMotion()
  const [horizontal, setHorizontal] = useState(() => window.matchMedia('(min-width: 1024px) and (min-height: 800px)').matches && !isTouch() && !prefersReducedMotion())
  const [grid, setGrid] = useState(false)
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const pin = useRef<ScrollTrigger | null>(null)
  const changingView = useRef(false)
  const toggleGrid = (value: boolean) => { changingView.current = true; setGrid(value) }

  useEffect(() => {
    if (!changingView.current || !section.current) return
    changingView.current = false
    const frame = requestAnimationFrame(() => {
      const target = section.current!
      const y = target.getBoundingClientRect().top + window.scrollY - (horizontal ? 0 : 80)
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis
      lenis?.resize()
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo({ top: y, behavior: 'instant' })
      target.querySelector<HTMLButtonElement>('.project-header button')?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [horizontal])

  // Small/touch/reduced-motion layouts retain ordinary document scrolling.
  useEffect(() => {
    const decide = () =>
      setHorizontal(
        window.matchMedia('(min-width: 1024px) and (min-height: 800px)').matches && !isTouch() && !prefersReducedMotion() && !grid,
      )
    decide()
    window.addEventListener('resize', decide)
    return () => window.removeEventListener('resize', decide)
  }, [reduced, grid])

  useGSAP(
    () => {
      if (!horizontal || !track.current || !section.current) return
      const host = section.current
      const rail = track.current
      const frame = viewport.current!
      const body = content.current!
      const distance = () => Math.max(0, rail.scrollWidth - frame.clientWidth)
      // CSS sticky owns the layout. GSAP only moves the artwork, so refreshes
      // never insert/remove a pin spacer beneath an active smooth scroll.
      const measure = () => {
        const height = Math.max(window.innerHeight, body.offsetHeight + 96)
        frame.style.height = `${height}px`
        frame.style.top = `${Math.min(0, window.innerHeight - height)}px`
        host.style.height = `${height + distance()}px`
        return height
      }
      measure()
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: () => `top ${Math.min(0, window.innerHeight - frame.offsetHeight)}px`,
          end: () => '+=' + distance(),
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onUpdate: (self) => { if (progress.current) progress.current.style.transform = `scaleX(${self.progress})` },
        },
      })
      pin.current = tween.scrollTrigger ?? null
      let pending = 0
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(pending)
        pending = requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      observer.observe(body)
      observer.observe(rail)
      pending = requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        observer.disconnect()
        cancelAnimationFrame(pending)
        pin.current = null
        tween.scrollTrigger?.kill()
        tween.kill()
        host.style.removeProperty('height')
        frame.style.removeProperty('height')
        frame.style.removeProperty('top')
      }
    },
    { scope: section, dependencies: [horizontal] },
  )

  const cards = projects.map((p) => (
    <ProjectCard key={p.slug} project={p} />
  ))

  return (
    <section ref={section} id="projects" data-project-layout={horizontal ? 'rail' : 'grid'} className={horizontal ? 'project-scroll relative' : 'mx-auto max-w-7xl px-6 py-28 md:py-40'}>
      {horizontal ? (
        <div ref={viewport} className="project-viewport">
          <div ref={content} className="project-content">
          <div className="mx-auto w-full max-w-7xl px-6">
            <Header horizontal onToggle={() => toggleGrid(true)} />
          </div>
          <div
            ref={track}
            onFocusCapture={(event) => {
              if (!event.target.matches(':focus-visible') || !pin.current || !track.current) return
              const card = event.target.closest<HTMLElement>('[data-project-card]')
              if (!card) return
              const trigger = pin.current
              const inset = parseFloat(getComputedStyle(track.current).paddingLeft)
              const position = trigger.start + Math.min(trigger.end - trigger.start, Math.max(0, card.offsetLeft - inset))
              const lenis = (window as Window & { __lenis?: Lenis }).__lenis
              if (lenis) lenis.scrollTo(position, { immediate: true })
              else window.scrollTo({ top: position, behavior: 'instant' })
              trigger.update()
            }}
            className="project-track relative flex w-max min-w-full gap-6 px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
          >
            {cards.map((card) => (
              <div key={card.key} data-project-card className="w-[400px] shrink-0">
                {card}
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-7xl px-6" aria-hidden="true">
            <div className="mb-3 flex justify-between font-mono text-[11px] uppercase tracking-widest text-[var(--color-fg-dim)]"><span>01 / {String(projects.length).padStart(2, '0')} · scroll to explore</span><span>keep going ↓</span></div>
            <div className="h-px bg-[var(--color-line)]"><div ref={progress} className="h-full origin-left scale-x-0 bg-[var(--color-accent)]" /></div>
          </div>
          </div>
        </div>
      ) : (
        <>
          <Header horizontal={false} onToggle={grid && !reduced ? () => toggleGrid(false) : undefined} />
          <Reveal stagger className="grid gap-6 sm:grid-cols-2" y={60}>
            {cards}
          </Reveal>
        </>
      )}

    </section>
  )
}
