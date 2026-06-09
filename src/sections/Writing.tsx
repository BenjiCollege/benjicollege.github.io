import { lazy, Suspense, useState } from 'react'
import { posts, readingTime, type Post } from '../data/posts'
import { Reveal } from '../components/Reveal'
import { Icon } from '../components/Icon'

// Lazy so react-markdown (heavy) only loads when a post is actually opened.
const PostModal = lazy(() =>
  import('../components/PostModal').then((m) => ({ default: m.PostModal })),
)

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

export function Writing() {
  const [open, setOpen] = useState<Post | null>(null)

  return (
    <section id="writing" className="mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            // writing
          </Reveal>
          <Reveal as="h2" className="heading max-w-2xl">
            Notes &amp; <span className="text-gradient">thoughts</span>.
          </Reveal>
        </div>
        <Reveal as="p" className="max-w-sm text-[var(--color-fg-dim)]">
          Occasional writing on building for the web, lessons learned, and things
          I'm figuring out.
        </Reveal>
      </div>

      <Reveal stagger className="grid gap-4" y={40}>
        {posts.map((p) => (
          <button
            key={p.slug}
            onClick={() => setOpen(p)}
            data-cursor
            className="group flex flex-col gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-left transition-colors hover:border-[var(--color-accent)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="max-w-2xl">
              <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--color-fg-dim)]">
                <span>{fmtDate(p.date)}</span>
                <span className="text-[var(--color-accent)]">{readingTime(p.content)}</span>
                {p.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
              <h3 className="font-display text-xl font-bold transition-colors group-hover:text-[var(--color-accent)] sm:text-2xl">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--color-fg-dim)]">{p.summary}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-[var(--color-fg-dim)] transition-colors group-hover:text-[var(--color-fg)]">
              read <Icon name="arrow" size={15} />
            </span>
          </button>
        ))}
      </Reveal>

      {open && (
        <Suspense fallback={null}>
          <PostModal post={open} onClose={() => setOpen(null)} />
        </Suspense>
      )}
    </section>
  )
}
