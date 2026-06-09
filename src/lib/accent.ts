// Visitor-selectable accent color. Swaps the primary --color-accent token at
// runtime and persists the choice. Components subscribe via the `accentchange`
// event (see useAccent) so the active swatch stays in sync everywhere.

export type AccentName = 'cyan' | 'violet' | 'pink' | 'amber' | 'green'

export const ACCENTS: { name: AccentName; label: string; value: string }[] = [
  { name: 'cyan', label: 'Cyan', value: '#2ee6d6' },
  { name: 'violet', label: 'Violet', value: '#7c5cff' },
  { name: 'pink', label: 'Pink', value: '#ff5c8a' },
  { name: 'amber', label: 'Amber', value: '#ffd24c' },
  { name: 'green', label: 'Green', value: '#3fb950' },
]

const KEY = 'portfolio-accent'
export const ACCENT_EVENT = 'accentchange'

export function getAccentName(): AccentName {
  if (typeof localStorage === 'undefined') return 'cyan'
  const stored = localStorage.getItem(KEY) as AccentName | null
  return ACCENTS.some((a) => a.name === stored) ? (stored as AccentName) : 'cyan'
}

export function setAccent(name: AccentName, persist = true) {
  const accent = ACCENTS.find((a) => a.name === name) ?? ACCENTS[0]
  document.documentElement.style.setProperty('--color-accent', accent.value)
  if (persist) localStorage.setItem(KEY, accent.name)
  window.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: accent.name }))
}

/** Apply the stored accent on first paint (call before React renders). */
export function applyStoredAccent() {
  setAccent(getAccentName(), false)
}
