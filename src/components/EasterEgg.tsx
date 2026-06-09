import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { confetti } from '../lib/confetti'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]

export function EasterEgg() {
  const [toast, setToast] = useState(false)
  const idx = useRef(0)
  const toastRef = useRef<HTMLDivElement>(null)

  // One-time styled console greeting for devs who peek under the hood.
  useEffect(() => {
    console.log(
      '%c👋 Hey, you opened the console.',
      'font-size:16px;font-weight:bold;color:#2ee6d6',
    )
    console.log(
      "%cYou clearly know what you're doing. So do I — let's talk.\n%chttps://github.com/BenjiCollege  ·  Psst: try the Konami code ↑↑↓↓←→←→ B A",
      'color:#c9d1d9;font-size:13px',
      'color:#7d8694;font-size:12px',
    )
  }, [])

  // Tab-title easter egg — nudge people who wander off.
  useEffect(() => {
    const original = document.title
    const onVisibility = () => {
      document.title = document.hidden ? '👀 come back! — Benji' : original
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      document.title = original
    }
  }, [])

  useEffect(() => {
    let timer = 0
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      idx.current = key === KONAMI[idx.current] ? idx.current + 1 : key === KONAMI[0] ? 1 : 0
      if (idx.current === KONAMI.length) {
        idx.current = 0
        confetti()
        setToast(true)
        window.clearTimeout(timer)
        timer = window.setTimeout(() => setToast(false), 3200)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (toast && toastRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        toastRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
      )
    }
  }, [toast])

  if (!toast) return null
  return (
    <div
      ref={toastRef}
      className="fixed bottom-24 left-1/2 z-[310] -translate-x-1/2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold shadow-2xl"
    >
      🎉 You found the Konami code — nice taste.
    </div>
  )
}
