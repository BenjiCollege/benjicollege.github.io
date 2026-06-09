import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { socials, EMAIL } from '../data/socials'
import { ACCENTS, setAccent } from '../lib/accent'
import { scrollToId } from '../lib/scroll'
import { OPEN_PALETTE_EVENT } from './FloatingDock'

type Cmd = {
  id: string
  label: string
  group: string
  hint?: string
  keywords?: string
  run: () => void
}

function useCommands(close: () => void): Cmd[] {
  return useMemo(() => {
    const go = (id: string) => () => {
      close()
      scrollToId(id)
    }
    const nav: Cmd[] = [
      { id: 'top', label: 'Go to top', group: 'Navigate', run: go('top') },
      { id: 'about', label: 'About', group: 'Navigate', run: go('about') },
      { id: 'projects', label: 'Work / Projects', group: 'Navigate', run: go('projects') },
      { id: 'playground', label: 'Animation playground', group: 'Navigate', run: go('playground') },
      { id: 'terminal', label: 'Terminal', group: 'Navigate', run: go('terminal') },
      { id: 'writing', label: 'Writing', group: 'Navigate', run: go('writing') },
      { id: 'github', label: 'GitHub activity', group: 'Navigate', run: go('github-stats') },
      { id: 'photography', label: 'Photography', group: 'Navigate', run: go('photography') },
      { id: 'contact', label: 'Contact', group: 'Navigate', run: go('contact') },
    ]
    const actions: Cmd[] = [
      {
        id: 'copy-email',
        label: 'Copy email address',
        group: 'Actions',
        hint: EMAIL,
        keywords: 'mail contact',
        run: () => {
          navigator.clipboard?.writeText(EMAIL)
          close()
        },
      },
      {
        id: 'contact',
        label: 'Send me a message',
        group: 'Actions',
        keywords: 'email form contact hire',
        run: () => {
          close()
          scrollToId('contact')
        },
      },
    ]
    const social: Cmd[] = socials
      .filter((s) => s.icon !== 'mail')
      .map((s) => ({
        id: `social-${s.icon}`,
        label: `Open ${s.label}`,
        group: 'Socials',
        hint: s.handle,
        run: () => {
          window.open(s.href, '_blank', 'noopener')
          close()
        },
      }))
    const themes: Cmd[] = ACCENTS.map((a) => ({
      id: `accent-${a.name}`,
      label: `Accent: ${a.label}`,
      group: 'Theme',
      keywords: 'color accent theme',
      run: () => setAccent(a.name),
    }))
    return [...nav, ...actions, ...social, ...themes]
  }, [close])
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const close = () => setOpen(false)
  const commands = useCommands(close)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ''} ${c.hint ?? ''}`.toLowerCase().includes(q),
    )
  }, [query, commands])

  // Open via ⌘K / Ctrl+K and the dock button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen)
    }
  }, [])

  // Reset + focus on open; lock background scroll.
  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const t = setTimeout(() => input.current?.focus(), 20)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return
      gsap.fromTo(
        '.cmd-panel',
        { y: 16, scale: 0.97, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' },
      )
      gsap.fromTo('.cmd-scrim', { opacity: 0 }, { opacity: 1, duration: 0.3 })
    },
    { scope: root, dependencies: [open] },
  )

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      results[active]?.run()
    }
  }

  // keep active row in view
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div ref={root} className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]">
      <div className="cmd-scrim absolute inset-0 bg-[var(--color-ink)]/70 backdrop-blur-sm" onClick={close} />

      <div className="cmd-panel relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">⌘</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyNav}
            placeholder="Jump to, copy, open, recolor…"
            className="w-full bg-transparent py-4 text-base text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-dim)]"
          />
          <kbd className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-fg-dim)]">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-[var(--color-fg-dim)]">No matches.</p>
          )}
          {results.map((c, i) => (
            <button
              key={c.id}
              data-idx={i}
              onMouseEnter={() => setActive(i)}
              onClick={c.run}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                i === active ? 'bg-[var(--color-surface-2)] text-[var(--color-fg)]' : 'text-[var(--color-fg-dim)]'
              }`}
            >
              <span className="flex items-center gap-3">
                {c.id.startsWith('accent-') && (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: ACCENTS.find((a) => `accent-${a.name}` === c.id)?.value }}
                  />
                )}
                {c.label}
              </span>
              <span className="flex items-center gap-2">
                {c.hint && <span className="font-mono text-[11px] text-[var(--color-fg-dim)]">{c.hint}</span>}
                <span className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-fg-dim)]">
                  {c.group}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
