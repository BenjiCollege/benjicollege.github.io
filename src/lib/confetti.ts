import { gsap, prefersReducedMotion } from './gsap'

const COLORS = ['#2ee6d6', '#7c5cff', '#ff5c8a', '#ffd24c', '#3fb950', '#ffffff']

/**
 * Fire a physics-y confetti burst. `origin: 'center'` bursts outward from the
 * middle (form success); the default rains from the top (Konami).
 */
export function confetti(origin: 'top' | 'center' = 'top') {
  if (prefersReducedMotion()) return
  const layer = document.createElement('div')
  layer.style.cssText = 'position:fixed;inset:0;z-index:300;pointer-events:none;overflow:hidden'
  document.body.appendChild(layer)

  const fromCenter = origin === 'center'
  const pieces = Array.from({ length: fromCenter ? 90 : 120 }, () => {
    const el = document.createElement('div')
    const size = gsap.utils.random(6, 12)
    const left = fromCenter ? 50 : gsap.utils.random(0, 100)
    const top = fromCenter ? 45 : -5
    el.style.cssText = `position:absolute;top:${top}vh;left:${left}vw;width:${size}px;height:${size * gsap.utils.random(0.4, 1)}px;background:${gsap.utils.random(COLORS)};border-radius:${gsap.utils.random(0, 50)}%`
    layer.appendChild(el)
    return el
  })

  gsap.to(pieces, {
    y: () => (fromCenter ? gsap.utils.random(-300, 300) : window.innerHeight + 60),
    x: () => (fromCenter ? gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2) : gsap.utils.random(-160, 160)),
    rotation: () => gsap.utils.random(-540, 540),
    opacity: fromCenter ? 0 : 1,
    duration: () => gsap.utils.random(fromCenter ? 1 : 1.6, fromCenter ? 2 : 3),
    ease: fromCenter ? 'power2.out' : 'power1.in',
    stagger: { each: 0.005, from: 'random' },
    onComplete: () => layer.remove(),
  })
}
