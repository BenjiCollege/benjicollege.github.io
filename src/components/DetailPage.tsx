import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'

export function DetailPage({ path }: { path: string }) {
  const [, kind, slug] = path.split('/')
  const project = kind === 'projects' ? projects.find(p => encodeURIComponent(p.slug) === slug) : undefined
  const title = project?.title ?? 'Page not found'
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    document.title = `${title} — Gerardo Colegio`
    const description = document.querySelector('meta[name="description"]')
    const previous = description?.getAttribute('content') ?? ''
    description?.setAttribute('content', project?.blurb ?? 'Explore projects by Gerardo Colegio.')
    root.current?.focus({ preventScroll: true })
    return () => { document.title = 'Gerardo Colegio — Software Developer'; description?.setAttribute('content', previous) }
  }, [title, project])
  return <main ref={root} id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-6 pb-28 pt-32 focus:outline-none">
    <a href="/#projects" className="inline-block py-3 text-sm underline underline-offset-4">← Back to projects</a>
    <article className="mt-6 rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-10">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{project ? (project.status === 'building' ? 'In development · 2026' : 'Project story · 2026') : '404'}</p>
      <h1 className="heading font-display font-bold leading-tight">{title}</h1>
      {project && <>
        <p className="mt-6 text-lg text-[var(--color-fg-dim)]">{project.blurb}</p>
        <div className="my-6 flex flex-wrap gap-2">{project.tech.map(t => <span key={t} className="rounded-full border border-[var(--color-line)] px-3 py-1 text-sm">{t}</span>)}</div>
        {project.image && <img src={project.image} alt={`${project.title} preview`} className="mb-8 max-h-[32rem] w-full rounded-xl object-contain" />}
        <div className="markdown">
          <h2>The idea</h2><p>{project.problem}</p>
          <h2>The approach</h2><p>{project.approach}</p>
          <h2>Inside the project</h2><ul>{project.highlights?.map(h => <li key={h}>{h}</li>)}</ul>
          {project.next && <><h2>Status & next steps</h2><p>{project.next}</p></>}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="preference-button">Visit website ↗</a>}
          <a href={project.source} target="_blank" rel="noreferrer" className="preference-button">Explore public source ↗</a>
        </div>
        <p className="mt-6 text-sm text-[var(--color-fg-dim)]">Project details are based on the <a href={`${project.source}#readme`} target="_blank" rel="noreferrer" className="underline underline-offset-4">public repository and its documentation</a>, reviewed September 2026.</p>
      </>}
      {!project && <p className="mt-6">This page isn’t available. <a href="/#projects" className="underline">Explore the projects</a>.</p>}
    </article>
  </main>
}
