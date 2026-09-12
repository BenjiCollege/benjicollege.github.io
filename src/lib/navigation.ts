import { useSyncExternalStore } from 'react'

const EVENT = 'portfolio-route'
export const projectPath = (slug: string) => `/projects/${encodeURIComponent(slug)}/`
function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener)
  window.addEventListener('popstate', listener)
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener('popstate', listener) }
}
export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname)
export function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new Event(EVENT))
  window.dispatchEvent(new Event('portfolio-navigate'))
}
