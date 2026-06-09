// ─────────────────────────────────────────────────────────────────────────
//  PROJECTS — placeholder content. Edit titles, blurbs, tech, and links to
//  match reality. Screenshots already live in /public/projects/.
//  `status: 'building'` adds a "Currently building" badge + pulse.
// ─────────────────────────────────────────────────────────────────────────

export type Project = {
  title: string
  blurb: string
  tech: string[]
  image: string
  /** Live site / demo URL — leave '' to hide the button */
  live?: string
  /** Source code URL — leave '' to hide the button */
  source?: string
  status?: 'shipped' | 'building'
  /** Accent index 0–3 → cycles through the theme accent colors */
  accent?: 0 | 1 | 2 | 3

  // ── Case-study detail (shown in the modal). All optional — the modal
  //    falls back gracefully when a field is missing, so fill these in over
  //    time. `blurb` is reused as the overview.
  year?: string
  role?: string
  /** The problem / context — what were you solving? */
  problem?: string
  /** Your approach — how you built it, key decisions. */
  approach?: string
  /** 2–4 punchy highlights / outcomes. */
  highlights?: string[]
}

export const projects: Project[] = [
  {
    title: 'Chroma Lair',
    blurb:
      'PLACEHOLDER — a game / interactive project. Describe the concept, your role, and what made it fun to build.',
    tech: ['TypeScript', 'Canvas', 'Game Dev'],
    image: '/projects/Chroma-Lair.png',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'building',
    accent: 1,
    // ↓ Example of the case-study fields — fill the rest of the projects the
    //   same way (or delete these to fall back to the generic prompts).
    year: '2025',
    role: 'Solo developer',
    problem:
      'PLACEHOLDER — what sparked this project and what problem or itch it scratches.',
    approach:
      'PLACEHOLDER — how you built it: the architecture, the tricky bits, the decisions you are proud of.',
    highlights: [
      'PLACEHOLDER — a standout feature or result',
      'PLACEHOLDER — something you learned',
      'PLACEHOLDER — a metric or detail worth bragging about',
    ],
  },
  {
    title: 'Switch Lair',
    blurb:
      'PLACEHOLDER — describe this project. What problem does it solve / what was the idea?',
    tech: ['React', 'TypeScript'],
    image: '/projects/SwitchLair.jpg',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'building',
    accent: 2,
  },
  {
    title: 'Draft API',
    blurb:
      'PLACEHOLDER — an API project. Note the stack, endpoints, and what you learned shipping it.',
    tech: ['Node.js', 'Express', 'REST'],
    image: '/projects/draftAPI-website.png',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'shipped',
    accent: 0,
  },
  {
    title: 'PokéGuess',
    blurb:
      'PLACEHOLDER — a "guess the Pokémon" game built on the PokéAPI. Mention the gameplay and the API integration.',
    tech: ['JavaScript', 'PokéAPI', 'CSS'],
    image: '/projects/pokeGuess-website.png',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'shipped',
    accent: 3,
  },
  {
    title: 'Bakery Site',
    blurb:
      'PLACEHOLDER — a responsive marketing site for a bakery. Highlight the layout and any animation work.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '/projects/bakery-website.png',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'shipped',
    accent: 2,
  },
  {
    title: 'Calculator',
    blurb:
      'PLACEHOLDER — a calculator app. Note the logic handling, edge cases, and styling approach.',
    tech: ['JavaScript', 'CSS Grid'],
    image: '/projects/calculator-website.png',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'shipped',
    accent: 0,
  },
  {
    title: 'Python Terminal Game',
    blurb:
      'PLACEHOLDER — a text-based game that runs in the terminal. Describe the mechanics and structure.',
    tech: ['Python'],
    image: '/projects/pythonTerminal-game.png',
    live: '',
    source: 'https://github.com/BenjiCollege',
    status: 'shipped',
    accent: 3,
  },
  {
    title: 'Photography Site',
    blurb:
      'PLACEHOLDER — the gallery site for my photography work. Note the layout / image handling.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '/projects/photography-website.png',
    live: 'https://gerardocolegio.com',
    source: 'https://github.com/BenjiCollege',
    status: 'shipped',
    accent: 1,
  },
]
