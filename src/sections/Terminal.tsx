import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { scrollToId } from '../lib/scroll'
import { setAccent, ACCENTS, type AccentName } from '../lib/accent'
import { confetti } from '../lib/confetti'
import { socials, EMAIL } from '../data/socials'
import { projects } from '../data/projects'

type Line = { kind: 'in' | 'out' | 'accent'; text: string }

const PROMPT = 'visitor@gerardocolegio.dev:~$'

const BANNER: Line[] = [
  { kind: 'accent', text: "Benji's terminal — type `help` to get started." },
]

const SECTIONS = ['about', 'projects', 'writing', 'github-stats', 'playground', 'photography', 'contact']

function run(raw: string): Line[] | 'clear' {
  const [cmd, ...args] = raw.trim().split(/\s+/)
  const arg = args.join(' ')
  switch (cmd.toLowerCase()) {
    case '':
      return []
    case 'help':
      return [
        { kind: 'out', text: 'Available commands:' },
        { kind: 'out', text: '  about            who I am' },
        { kind: 'out', text: '  projects         what I have built' },
        { kind: 'out', text: '  skills           my stack' },
        { kind: 'out', text: '  contact          how to reach me' },
        { kind: 'out', text: '  social           my links' },
        { kind: 'out', text: '  goto <section>   scroll the page somewhere' },
        { kind: 'out', text: '  theme <color>    recolor the site' },
        { kind: 'out', text: '  whoami · ls · date · echo · clear' },
        { kind: 'accent', text: '  ...and maybe a `sudo` or two 😉' },
      ]
    case 'about':
      return [
        { kind: 'out', text: 'Gerardo "Benji" Colegio — Software Developer.' },
        { kind: 'out', text: 'I build for the web and have too much fun with the animations.' },
        { kind: 'out', text: 'Came up through _nology; full-time coder, part-time photographer + gamer.' },
      ]
    case 'projects':
      return [
        { kind: 'out', text: `${projects.length} projects on file:` },
        ...projects.map((p) => ({ kind: 'out' as const, text: `  • ${p.title} — ${p.tech.join(', ')}` })),
        { kind: 'accent', text: 'Tip: `goto projects` to see them.' },
      ]
    case 'skills':
    case 'stack':
      return [
        { kind: 'out', text: 'TypeScript · React · JavaScript · Node.js · Python' },
        { kind: 'out', text: 'HTML · CSS · Tailwind · GSAP · AWS · Git · SQL' },
      ]
    case 'contact':
      return [
        { kind: 'out', text: `email: ${EMAIL}` },
        { kind: 'accent', text: 'or `goto contact` to use the form.' },
      ]
    case 'social':
      return socials.map((s) => ({ kind: 'out' as const, text: `  ${s.label.padEnd(12)} ${s.href}` }))
    case 'whoami':
      return [{ kind: 'out', text: 'a person with great taste in portfolios.' }]
    case 'ls':
      return [{ kind: 'out', text: SECTIONS.join('   ') }]
    case 'date':
      return [{ kind: 'out', text: new Date().toString() }]
    case 'echo':
      return [{ kind: 'out', text: arg }]
    case 'goto': {
      const target = arg.toLowerCase()
      if (SECTIONS.includes(target) || target === 'top') {
        scrollToId(target)
        return [{ kind: 'accent', text: `→ scrolling to ${target}` }]
      }
      return [{ kind: 'out', text: `goto: unknown section '${arg}'. try: ${SECTIONS.join(', ')}` }]
    }
    case 'theme': {
      const name = arg.toLowerCase() as AccentName
      if (ACCENTS.some((a) => a.name === name)) {
        setAccent(name)
        return [{ kind: 'accent', text: `theme set to ${name}` }]
      }
      return [{ kind: 'out', text: `theme: pick one of ${ACCENTS.map((a) => a.name).join(', ')}` }]
    }
    case 'clear':
      return 'clear'
    case 'sudo':
      if (arg.toLowerCase().includes('hire')) {
        confetti('center')
        return [
          { kind: 'accent', text: '🎉 Permission granted. Excellent decision.' },
          { kind: 'out', text: `Let's talk: ${EMAIL}` },
        ]
      }
      return [{ kind: 'out', text: 'sudo: nice try. (the only thing you can sudo here is `sudo hire-benji`)' }]
    default:
      return [{ kind: 'out', text: `command not found: ${cmd}. type \`help\`.` }]
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  const submit = () => {
    const entry: Line = { kind: 'in', text: value }
    const result = run(value)
    if (value.trim()) setHistory((h) => [value, ...h])
    setHIdx(-1)
    if (result === 'clear') {
      setLines([])
    } else {
      setLines((prev) => [...prev, entry, ...result])
    }
    setValue('')
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(hIdx + 1, history.length - 1)
      if (history[next] !== undefined) {
        setHIdx(next)
        setValue(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = hIdx - 1
      setHIdx(next)
      setValue(next < 0 ? '' : history[next] ?? '')
    }
  }

  return (
    <section id="terminal" className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <Reveal>
        <div
          className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)] shadow-2xl"
          onClick={() => inputRef.current?.focus()}
        >
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[var(--color-accent-3)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--color-accent-4)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--color-accent)]" />
            <span className="ml-3 font-mono text-xs text-[var(--color-fg-dim)]">benji@portfolio — try it</span>
          </div>

          {/* body */}
          <div ref={bodyRef} className="h-[340px] overflow-y-auto p-4 font-mono text-sm leading-relaxed">
            {lines.map((l, i) => (
              <div
                key={i}
                className={
                  l.kind === 'accent'
                    ? 'text-[var(--color-accent)]'
                    : l.kind === 'in'
                      ? 'text-[var(--color-fg)]'
                      : 'text-[var(--color-fg-dim)]'
                }
              >
                {l.kind === 'in' && <span className="text-[var(--color-accent-2)]">{PROMPT} </span>}
                <span className="whitespace-pre-wrap break-words">{l.text}</span>
              </div>
            ))}

            {/* live input line */}
            <div className="flex items-center text-[var(--color-fg)]">
              <span className="shrink-0 text-[var(--color-accent-2)]">{PROMPT}&nbsp;</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
                className="w-full bg-transparent text-[var(--color-fg)] caret-[var(--color-accent)] outline-none"
              />
            </div>
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-xs text-[var(--color-fg-dim)]">
          a real shell — type <span className="text-[var(--color-accent)]">help</span> and hit enter
        </p>
      </Reveal>
    </section>
  )
}
