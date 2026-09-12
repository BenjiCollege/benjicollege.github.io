import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { socials, EMAIL } from '../data/socials'
import { ACCENTS, setAccent } from '../lib/accent'
import { scrollToId } from '../lib/scroll'
import { OPEN_PALETTE_EVENT } from './FloatingDock'
import { Dialog } from './Dialog'
import { navigate } from '../lib/navigation'

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
      // Wait for the dialog to restore focus and restart smooth scrolling.
      // Starting before its cleanup lets Lenis.start() reset the destination.
      requestAnimationFrame(() => {
        if (location.pathname !== '/') navigate(`/#${id}`)
        else scrollToId(id)
      })
    }
    const nav: Cmd[] = [
      { id: 'top', label: 'Go to top', group: 'Navigate', run: go('top') },
      { id: 'about', label: 'About', group: 'Navigate', run: go('about') },
      { id: 'experience', label: 'Career timeline / Résumé', keywords: 'journey resume experience education', group: 'Navigate', run: go('experience') },
      { id: 'chat', label: 'Simulated stream chat', keywords: 'twitch emotes raid', group: 'Navigate', run: go('chat') },
      { id: 'projects', label: 'Work / Projects', group: 'Navigate', run: go('projects') },
      { id: 'playground', label: 'Animation playground', group: 'Navigate', run: go('playground') },
      { id: 'terminal', label: 'Terminal', group: 'Navigate', run: go('terminal') },
      { id: 'github', label: 'Currently building', group: 'Navigate', run: go('github-stats') },
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
        id: 'send-message',
        label: 'Send me a message',
        group: 'Actions',
        keywords: 'email form contact hire',
        run: () => {
          go('contact')()
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
        if (document.querySelector('dialog[open]') && !open) return
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
  }, [open])

  // Reset + focus on open; lock background scroll.
  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
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
    <Dialog label="Command palette" onClose={close}>
    <div ref={root}>
      <div className="cmd-panel relative w-full overflow-hidden rounded-2xl bg-[var(--color-surface)]">
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">⌘</span>
          <input
            autoFocus
            aria-label="Search commands"
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyNav}
            placeholder="Jump to, copy, open, recolor…"
            className="w-full bg-transparent py-4 text-base text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-dim)]"
          />
          <button aria-label="Close command palette" onClick={close} className="min-h-11 min-w-11 rounded text-sm text-[var(--color-fg-dim)]">✕</button>
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
    </Dialog>
  )
}
