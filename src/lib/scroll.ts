import type Lenis from 'lenis'

/** Smooth-scroll to a section by id, using Lenis when available. */
export function scrollToId(id: string, offset = -60) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as Window & { __lenis?: Lenis }).__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset })
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
