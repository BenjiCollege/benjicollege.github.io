import { generatedProjects } from './projects.generated'

export type Project = {
  slug: string
  title: string
  blurb: string
  tech: string[]
  image: string
  live?: string
  source?: string
  status?: 'shipped' | 'building' | 'source'
  accent?: 0 | 1 | 2 | 3
  year?: string
  role?: string
  problem?: string
  approach?: string
  highlights?: string[]
  next?: string
}

// Explicit editorial selection. The generator reads only PUBLIC repositories;
// profile READMEs, exercises and forks never become featured work automatically.
const CURATION = ['machita-salsa', 'affordable-piano-tuning', 'origin', 'verso', 'pokemon-overworld', 'benjicollege.github.io']
const OVERRIDES: Record<string, Partial<Project>> = {
  'machita-salsa': {
    title: 'Machita — Salsa Macha',
    image: '/projects/machita-product.webp',
    blurb: 'A bilingual storefront that turns a cart into a ready-to-send WhatsApp or email order.',
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'GSAP'],
    year: '2026', status: 'shipped',
    problem: 'Give a small salsa brand a product catalog and a practical way to receive local orders in English or Spanish.',
    approach: 'A React storefront keeps catalog content in a single JSON file. The cart persists between visits, and checkout produces a localized order summary for WhatsApp or email. Payment is arranged directly with the seller.',
    highlights: ['English and Spanish content with a remembered language choice', 'Persistent cart and validated delivery or pickup details', 'Light and dark themes, animated interactions, and reduced-motion support'],
    next: 'Keep product information and ordering details current as the catalog changes.',
  },
  'affordable-piano-tuning': {
    title: 'Affordable Piano Tuning',
    image: '/projects/piano-technician.webp',
    blurb: 'A piano-tuning website where scroll choreography and a playable keyboard bring the service to life.',
    tech: ['Next.js', 'TypeScript', 'GSAP', 'Web Audio'],
    year: '2026', status: 'shipped',
    problem: 'Turn an interactive HTML prototype into a React marketing site while preserving its musical identity.',
    approach: 'Next.js prerenders the page content. A client-side controller handles GSAP, smooth scrolling, and synthesized piano tones, with explicit teardown for listeners, animation timelines, and audio resources.',
    highlights: ['Prerendered marketing content', 'A Web Audio keyboard with synthesized piano tones', 'Scroll-driven keyboard, parallax, and sheet-music animation'],
    next: 'The public README identifies responsive layout work as a follow-up to the desktop-first prototype.',
  },
  origin: {
    title: 'Origin',
    blurb: 'An iOS strength-training app that connects planning, workout logging, and explainable progression.',
    tech: ['SwiftUI', 'TypeScript', 'PostgreSQL'],
    year: '2026', status: 'building', image: '',
    problem: 'Make the plan before a workout as useful as the log afterward, while keeping training decisions visible to the person using the app.',
    approach: 'A SwiftUI client handles plans and sets, with a PostgreSQL backend and a client outbox for synchronization. Progression suggestions explain the sessions behind them. CI separates iOS compilation from database and concurrency checks.',
    highlights: ['Workout planning and set logging', 'Progression suggestions with supporting history', 'Separate iOS, database, and concurrency verification workflows'],
    next: 'The public README reports CI compilation and tests, but no deployed-backend sync run. Signing and distribution still need validation. This is not an App Store release.',
  },
  verso: {
    title: 'Verso',
    blurb: 'A block-based iOS notes app exploring paper, typography, and on-device tools without an app-owned server.',
    tech: ['SwiftUI', 'SwiftData', 'TextKit 2', 'CloudKit'],
    year: '2026', status: 'building', image: '',
    problem: 'Treat a note as a structured page that can hold writing, lists, ink, audio, and useful data instead of a single text field.',
    approach: 'Typed blocks share a registry, templates are JSON, and TextKit 2 places ruled lines against actual text baselines. The architecture uses Apple frameworks for storage, ink, audio, and on-device intelligence, with heuristic fallbacks.',
    highlights: ['Registry-based block system and JSON templates', 'Paper and typography tied to text layout', 'On-device processing and a private-iCloud sync architecture'],
    next: 'The public README reports simulator builds and tests. Physical-device behavior and cross-device sync remain unverified; this is still in development.',
  },
  'pokemon-overworld': {
    title: 'Overworld',
    blurb: 'A Pokémon-style exploration engine rebuilt with React, canvas, and 27 swappable trainer sprites.',
    tech: ['React', 'Canvas 2D', 'JavaScript', 'GSAP'],
    year: '2026', status: 'source', image: '',
    problem: 'Modernize a legacy tile-based browser game while preserving movement, collision, sprinting, and character switching.',
    approach: 'The rewrite replaces per-frame DOM updates with a delta-timed canvas loop and a following camera. Engine events feed a React reducer, so interface feedback follows gameplay state. The original game by Loic Sharma is preserved and credited in the repository.',
    highlights: ['Canvas rendering and a player-following camera', '27 trainer sprites and collision handling', 'Keyboard controls, touch D-pad, and reduced-motion alternatives'],
    next: 'Explore the source and the preserved legacy version to compare the rendering approaches.',
  },
  'benjicollege.github.io': {
    title: 'This portfolio',
    blurb: 'A creative coding playground built around animated interfaces, real project stories, and photography.',
    tech: ['React', 'TypeScript', 'GSAP', 'WebGL'],
    year: '2026', status: 'shipped', image: '/about/hero.jpg', live: 'https://gerardocolegio.dev/',
    problem: 'Present software work and personal creative interests in one place while keeping navigation and reading accessible.',
    approach: 'Reusable React sections pair scoped GSAP timelines with progressive WebGL effects. Visitors can choose a theme, accent, and motion level. Public repositories supply project metadata; editorial details explain the work.',
    highlights: ['Interactive animation playground and terminal', 'Dark and light themes with visitor-controlled motion', 'Project stories and photography in one experience'],
    next: 'Keep project status and build notes aligned with the public repositories.',
  },
}

export const projects: Project[] = CURATION.flatMap((slug, i) => {
  const base = generatedProjects.find(p => p.slug === slug)
  if (!base) return []
  return [{
    slug, title: base.title, blurb: base.blurb || '', tech: base.tech,
    image: base.image, source: base.source, live: base.live || undefined,
    status: 'source' as const, accent: (i % 4) as 0 | 1 | 2 | 3,
    ...OVERRIDES[slug],
  }]
})
