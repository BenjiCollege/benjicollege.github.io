import { useRef } from 'react'
import { experience, education } from '../data/experience'
import { Reveal } from '../components/Reveal'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

export function Experience() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('.timeline-energy', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.career-list', start: 'top 65%', end: 'bottom 65%', scrub: true },
    })
  }, { scope: root })

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">// the journey · 2018 → now</p>
          <h2 id="experience-title" className="heading">A few <span className="text-gradient">plot twists.</span></h2>
          <p className="mt-5 max-w-xl text-[var(--color-fg-dim)]">Community, cameras, cloud, and code. Different chapters, same instinct: figure out what people need and make it happen.</p>
        </div>
        <a href="https://www.linkedin.com/in/gerardo-colegio/" target="_blank" rel="noreferrer" className="preference-button text-sm">Connect on LinkedIn ↗</a>
      </Reveal>
      <div className="career-list relative">
        <div aria-hidden="true" className="absolute bottom-0 left-[9px] top-0 w-px bg-[var(--color-line)] md:left-[191px]">
          <div className="timeline-energy h-full origin-top bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)]" />
        </div>
        <ol className="space-y-8">
          {experience.map((item, index) => (
            <li key={item.role + item.company} className="relative pl-9 md:grid md:grid-cols-[160px_1fr] md:gap-16 md:pl-0">
              <span aria-hidden="true" className={`timeline-dot absolute left-0 top-5 md:left-[182px] ${item.current ? 'timeline-dot-current' : ''}`} />
              <div className="pb-3 pt-4 font-mono text-xs md:text-right">
                <p className="text-[var(--color-accent)]">{item.start}{item.end && <> — {item.end}</>}</p>
                <p className="mt-2 text-[var(--color-fg-dim)]">{String(experience.length - index).padStart(2, '0')} / {item.category}</p>
              </div>
              <Reveal className="career-card rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]/90 p-5 md:p-7" y={25}>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <p className="font-mono text-sm text-[var(--color-accent)]">{item.company}</p>
                  {item.current && <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Current chapter</span>}
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">{item.role}</h3>
                <p className="mt-2 text-xs text-[var(--color-fg-dim)]">{item.location}</p>
                <p className="mt-4 text-sm leading-relaxed">{item.summary}</p>
                <ul aria-label="Skills" className="mt-4 flex flex-wrap gap-2">
                  {item.skills.map(skill => <li key={skill} className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[10px] text-[var(--color-fg-dim)]">{skill}</li>)}
                </ul>
                <details className="mt-4" onToggle={() => ScrollTrigger.refresh()}>
                  <summary className="w-fit cursor-pointer py-2 text-sm font-medium text-[var(--color-accent)]">Inside this chapter</summary>
                  <ul className="mt-2 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[var(--color-fg-dim)]">
                    {item.details.map(detail => <li key={detail}>{detail}</li>)}
                  </ul>
                  {item.link && <a href={item.link.href} className="mt-4 inline-flex min-h-11 items-center text-sm text-[var(--color-accent)]">{item.link.label}</a>}
                </details>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-14 border-t border-[var(--color-line)] pt-8">
        <h3 className="mb-6 font-mono text-xs uppercase tracking-[.25em] text-[var(--color-fg-dim)]">The foundations / education</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {education.map(item => <Reveal key={item.school} className="flex gap-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]/70 p-5">
            <span className="font-mono text-sm text-[var(--color-accent)]">{item.year}</span>
            <div><h4 className="text-base font-semibold leading-snug">{item.degree}</h4><p className="mt-2 text-sm text-[var(--color-fg-dim)]">{item.school}</p></div>
          </Reveal>)}
        </div>
      </div>
    </section>
  )
}
