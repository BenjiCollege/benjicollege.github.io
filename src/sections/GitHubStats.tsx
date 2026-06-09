import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { Reveal } from '../components/Reveal'
import { Icon } from '../components/Icon'

const USER = 'BenjiCollege'

type Profile = { public_repos: number; followers: number; following: number }
type Repo = {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
}

/** Counts up to `value` when scrolled into view. */
function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(
    () => {
      const el = ref.current!
      if (prefersReducedMotion()) {
        el.textContent = String(value)
        return
      }
      const obj = { v: 0 }
      gsap.to(obj, {
        v: value,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: () => (el.textContent = String(Math.round(obj.v))),
      })
    },
    { scope: ref, dependencies: [value] },
  )
  return (
    <div className="text-center">
      <span ref={ref} className="font-display text-4xl font-bold text-[var(--color-fg)] sm:text-5xl">
        0
      </span>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">{label}</p>
    </div>
  )
}

export function GitHubStats() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [repos, setRepos] = useState<Repo[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch(`https://api.github.com/users/${USER}`).then((r) => {
        if (!r.ok) throw new Error('profile')
        return r.json()
      }),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`).then((r) => {
        if (!r.ok) throw new Error('repos')
        return r.json()
      }),
    ])
      .then(([p, rs]: [Profile, Repo[]]) => {
        if (!alive) return
        setProfile(p)
        setRepos(
          rs
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
            .slice(0, 6),
        )
      })
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [])

  return (
    <section id="github-stats" className="mx-auto max-w-7xl px-6 py-28 md:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            // live from github
          </Reveal>
          <Reveal as="h2" className="heading max-w-2xl">
            Always <span className="text-gradient">shipping</span>.
          </Reveal>
        </div>
        <Reveal
          as="a"
          className="flex items-center gap-2 font-mono text-sm text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
          {...({ href: `https://github.com/${USER}`, target: '_blank', rel: 'noreferrer' } as object)}
        >
          @{USER} <Icon name="external" size={15} />
        </Reveal>
      </div>

      {error ? (
        <p className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-fg-dim)]">
          Couldn't reach the GitHub API right now (it rate-limits anonymous requests).{' '}
          <a href={`https://github.com/${USER}`} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] underline">
            Visit my profile →
          </a>
        </p>
      ) : (
        <>
          {/* Stat counters */}
          {profile && (
            <div className="mb-10 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
              <Counter value={profile.public_repos} label="Repos" />
              <Counter value={profile.followers} label="Followers" />
              <Counter value={profile.following} label="Following" />
            </div>
          )}

          {/* Contribution graph (no-auth image service, tinted) */}
          <div className="mb-10 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">
              contribution graph
            </p>
            <img
              src={`https://ghchart.rshah.org/2ee6d6/${USER}`}
              alt={`${USER}'s GitHub contribution graph`}
              loading="lazy"
              className="min-w-[640px]"
              onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
            />
          </div>

          {/* Top repos */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]" />
                ))
              : repos.map((r) => (
                  <a
                    key={r.id}
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor
                    className="group flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-accent)]"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="github" size={16} />
                      <h3 className="truncate font-semibold transition-colors group-hover:text-[var(--color-accent)]">
                        {r.name}
                      </h3>
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--color-fg-dim)]">
                      {r.description ?? 'No description yet.'}
                    </p>
                    <div className="mt-4 flex items-center gap-4 font-mono text-xs text-[var(--color-fg-dim)]">
                      {r.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                          {r.language}
                        </span>
                      )}
                      <span>★ {r.stargazers_count}</span>
                      <span>⑂ {r.forks_count}</span>
                    </div>
                  </a>
                ))}
          </div>
        </>
      )}
    </section>
  )
}
