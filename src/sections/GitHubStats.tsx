import { projects } from '../data/projects'
import { Reveal } from '../components/Reveal'
import { projectPath } from '../lib/navigation'

export function GitHubStats() {
  return <section id="github-stats" className="mx-auto max-w-7xl px-6 py-24">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div><Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">// on the workbench</Reveal><Reveal as="h2" className="heading">What I’m <span className="text-gradient">building next.</span></Reveal></div>
      <Reveal as="a" href="https://github.com/BenjiCollege" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">@BenjiCollege ↗</Reveal>
    </div>
    <Reveal stagger className="grid gap-6 md:grid-cols-2">
      {projects.filter(p => p.status === 'building').map(p => <article key={p.slug} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
        <p className="mb-3 text-sm text-[var(--color-accent)]">In development</p>
        <h3 className="font-display text-2xl font-bold">{p.title}</h3>
        <p className="mt-3 text-[var(--color-fg-dim)]">{p.blurb}</p>
        <p className="mt-5 text-sm text-[var(--color-fg-dim)]">{p.next}</p>
        <a href={projectPath(p.slug)} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-accent)]">Read the project story →</a>
      </article>)}
    </Reveal>
  </section>
}
