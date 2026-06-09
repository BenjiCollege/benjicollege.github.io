// ─────────────────────────────────────────────────────────────────────────
//  WRITING — your blog posts. `content` is Markdown (GitHub-flavored: headings,
//  lists, code blocks, links, bold/italic all work). Add a new object to the
//  top of the array to publish. These two are placeholders — rewrite them.
// ─────────────────────────────────────────────────────────────────────────

export type Post = {
  slug: string
  title: string
  /** ISO date, e.g. '2025-06-01' */
  date: string
  /** short teaser shown on the card */
  summary: string
  tags: string[]
  /** Markdown body */
  content: string
}

export const posts: Post[] = [
  {
    slug: 'why-i-build-for-the-fun',
    title: 'Why I build for the fun',
    date: '2025-05-20',
    summary:
      'PLACEHOLDER — a short post about your philosophy: why delightful detail and a little chaos make better software.',
    tags: ['craft', 'opinion'],
    content: `## The hook

PLACEHOLDER — open with a story or a hot take. Why does the "fun" of building
matter to you, and why should an employer care?

## The point

Make 2–3 points. Markdown works here, so use it:

- A bullet about **delight in the details**
- A bullet about shipping fast without losing taste
- A bullet about the tools you love

> A pull-quote or a line you want to stand out.

\`\`\`ts
// even code blocks render nicely
const ship = (idea: Idea) => polish(build(idea))
\`\`\`

## The close

PLACEHOLDER — wrap up with what you're taking into your next project.`,
  },
  {
    slug: 'what-nology-taught-me',
    title: 'What _nology taught me about shipping',
    date: '2025-03-08',
    summary:
      'PLACEHOLDER — reflect on a lesson from your bootcamp / early career that still shapes how you work.',
    tags: ['career', 'learning'],
    content: `## Setting the scene

PLACEHOLDER — where were you, what were you building, what were you struggling with?

## The lesson

PLACEHOLDER — the single thing that clicked. Be specific and honest.

## How I use it now

PLACEHOLDER — a concrete example from a recent project where this paid off.`,
  },
]

/** Rough reading time from word count. */
export function readingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}
