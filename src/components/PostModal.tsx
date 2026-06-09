import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { readingTime, type Post } from '../data/posts'

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

type Props = { post: Post | null; onClose: () => void }

export function PostModal({ post, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!post) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [post, onClose])

  useGSAP(
    () => {
      if (!post || prefersReducedMotion()) return
      gsap.fromTo('.post-scrim', { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(
        '.post-panel',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      )
    },
    { scope: root, dependencies: [post?.slug] },
  )

  if (!post) return null

  return (
    <div ref={root} className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="post-scrim fixed inset-0 bg-[var(--color-ink)]/80 backdrop-blur" onClick={onClose} />

      <article className="post-panel relative my-auto w-full max-w-2xl rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-10">
        <button
          onClick={onClose}
          data-cursor
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
        >
          ✕
        </button>

        <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--color-fg-dim)]">
          <span>{fmtDate(post.date)}</span>
          <span className="text-[var(--color-accent)]">{readingTime(post.content)}</span>
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>

        <h2 className="mb-6 font-display text-3xl font-bold sm:text-4xl">{post.title}</h2>

        <div className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
