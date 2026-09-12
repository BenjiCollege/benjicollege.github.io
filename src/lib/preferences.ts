import { useSyncExternalStore } from 'react'
import { applyStoredAccent } from './accent'

export type Theme = 'dark' | 'light'
export type Motion = 'system' | 'full' | 'reduced'
const EVENT = 'portfolio-preferences'
const read = (key: string) => {
  try { return localStorage.getItem(key) } catch { return null }
}
const write = (key: string, value: string) => {
  try { localStorage.setItem(key, value) } catch { /* Preferences still work for this visit. */ }
}
let theme: Theme = read('portfolio-theme') === 'light' ? 'light' : 'dark'
let motion: Motion = ['full', 'reduced'].includes(read('portfolio-motion') ?? '')
  ? read('portfolio-motion') as Motion : 'system'

export const getTheme = () => theme
export const getMotion = () => motion
export const getReducedMotion = () => motion === 'reduced' ||
  (motion === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

function apply() {
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.motion = getReducedMotion() ? 'reduced' : 'full'
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0d1117' : '#f5f7fc')
  applyStoredAccent()
}
const notify = () => { apply(); window.dispatchEvent(new Event(EVENT)) }
export function setTheme(value: Theme) { theme = value; write('portfolio-theme', value); notify() }
export function setMotion(value: Motion) { motion = value; write('portfolio-motion', value); notify() }
export function initializePreferences() {
  apply()
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', notify)
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith('portfolio-') || event.key === null) {
      theme = read('portfolio-theme') === 'light' ? 'light' : 'dark'
      const saved = read('portfolio-motion')
      motion = saved === 'full' || saved === 'reduced' ? saved : 'system'
      notify()
    }
  })
}
function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
export const useTheme = () => useSyncExternalStore(subscribe, getTheme)
export const useMotion = () => useSyncExternalStore(subscribe, getMotion)
export const useReducedMotion = () => useSyncExternalStore(subscribe, getReducedMotion)
