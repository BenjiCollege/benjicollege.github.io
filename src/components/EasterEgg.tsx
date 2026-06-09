import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]
const COLORS = ['#2ee6d6', '#7c5cff', '#ff5c8a', '#ffd24c', '#3fb950', '#ffffff']

/** Fire a physics-y confetti burst from the top of the viewport. */
function confetti() {
  if (prefersReducedMotion()) return
  const layer = document.createElement('div')
  layer.style.cssText = 'position:fixed;inset:0;z-index:300;pointer-events:none;overflow:hidden'
  document.body.appendChild(layer)

  const pieces = Array.from({ length: 120 }, () => {
    const el = document.createElement('div')
    const size = gsap.utils.random(6, 12)
    el.style.cssText = `position:absolute;top:-20px;left:${gsap.utils.random(0, 100)}vw;width:${size}px;height:${size * gsap.utils.random(0.4, 1)}px;background:${gsap.utils.random(COLORS)};border-radius:${gsap.utils.random(0, 50)}%`
    layer.appendChild(el)
    return el
  })

  gsap.to(pieces, {
    y: () => window.innerHeight + 60,
    x: () => gsap.utils.random(-160, 160),
    rotation: () => gsap.utils.random(-540, 540),
    duration: () => gsap.utils.random(1.6, 3),
    ease: 'power1.in',
    stagger: { each: 0.006, from: 'random' },
    onComplete: () => layer.remove(),
  })
}

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
