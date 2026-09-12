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
  try {
    const stored = localStorage.getItem(KEY) as AccentName | null
    return ACCENTS.some((a) => a.name === stored) ? (stored as AccentName) : 'cyan'
  } catch { return 'cyan' }
}

export function setAccent(name: AccentName, persist = true) {
  const accent = ACCENTS.find((a) => a.name === name) ?? ACCENTS[0]
  const light = { cyan: '#007a73', violet: '#6540cf', pink: '#b72559', amber: '#8b5b00', green: '#237537' }
  document.documentElement.style.setProperty('--color-accent', document.documentElement.dataset.theme === 'light' ? light[accent.name] : accent.value)
  if (persist) { try { localStorage.setItem(KEY, accent.name) } catch { /* Optional persistence. */ } }
  window.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: accent.name }))
}

/** Apply the stored accent on first paint (call before React renders). */
export function applyStoredAccent() {
  setAccent(getAccentName(), false)
}
