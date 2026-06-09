import { generatedProjects } from './projects.generated'

// ─────────────────────────────────────────────────────────────────────────
//  PROJECTS
//
//  The base data (title, description, languages, screenshot, links) is pulled
//  from GitHub by `npm run generate-projects` → projects.generated.ts.
//
//  You control two things HERE, and they survive re-running the generator:
//   1. CURATION — which repos show, and in what order.
//   2. OVERRIDES — per-repo edits: problem / approach / highlights, a nicer
//      title, status: 'building', a custom blurb, etc. Anything you set wins.
// ─────────────────────────────────────────────────────────────────────────

export type Project = {
  title: string
  blurb: string
  tech: string[]
  image: string
  live?: string
  source?: string
  status?: 'shipped' | 'building'
  accent?: 0 | 1 | 2 | 3
  // Case-study detail (shown in the modal) — fill these via OVERRIDES below.
  year?: string
  role?: string
  problem?: string
  approach?: string
  highlights?: string[]
}

// 1) CURATE — list the repo slugs you want to feature, in order. Remove any you
//    don't want. Leave the array empty to show ALL auto-pulled repos.
//    (Slugs are the exact GitHub repo names — see projects.generated.ts.)
const CURATION: string[] = []

// 2) OVERRIDE — keyed by repo slug. Add the case-study fields and polish here.
const OVERRIDES: Record<string, Partial<Project>> = {
  // 'doyouwannagooutwithme-main': {
  //   title: 'Will You Go Out With Me?',
  //   status: 'shipped',
  //   year: '2024',
  //   role: 'Solo developer',
  //   problem: 'What you were solving / the idea.',
  //   approach: 'How you built it, key decisions.',
  //   highlights: ['A standout feature', 'Something you learned'],
  // },
}

const order = CURATION.length ? CURATION : generatedProjects.map((p) => p.slug)

export const projects: Project[] = order
  .map((slug) => generatedProjects.find((p) => p.slug === slug))
  .filter((g): g is NonNullable<typeof g> => Boolean(g))
  .map((g, i) => ({
    title: g.title,
    blurb: g.blurb || 'No description yet — add one on GitHub, or via OVERRIDES.',
    tech: g.tech.length ? g.tech : ['Code'],
    image: g.image,
    live: g.live || undefined,
    source: g.source || undefined,
    status: 'shipped' as const,
    accent: (i % 4) as 0 | 1 | 2 | 3,
    ...OVERRIDES[g.slug],
  }))
