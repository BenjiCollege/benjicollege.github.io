import type Lenis from 'lenis'
import { getReducedMotion } from './preferences'

export function decodeSectionHash(hash: string) {
  try { return decodeURIComponent(hash.replace(/^#/, '')) } catch { return '' }
}

/** Smooth-scroll to a section by id, using Lenis when available. */
export function scrollToId(id: string, offset = -60) {
  const el = document.getElementById(id)
  if (!el) return
  if (id === 'projects' && el.dataset.projectLayout === 'rail') offset = 0
  if (id === 'main-content') el.focus({ preventScroll: true })
  const lenis = (window as Window & { __lenis?: Lenis }).__lenis
  // Use one explicit offset for both engines. Lenis also subtracts an element's
  // CSS scroll-margin, which otherwise doubles our navigation clearance.
  const y = el.getBoundingClientRect().top + window.scrollY + offset
  if (lenis) {
    lenis.scrollTo(y, { force: true })
  } else {
    window.scrollTo({ top: y, behavior: getReducedMotion() ? 'instant' : 'smooth' })
  }
  window.dispatchEvent(new Event('portfolio-navigate'))
}
