import { useEffect, useState } from 'react'
import { ACCENT_EVENT, getAccentName, setAccent, type AccentName } from '../lib/accent'

/** Read/write the active accent and stay in sync with changes from anywhere. */
export function useAccent(): [AccentName, (name: AccentName) => void] {
  const [name, setName] = useState<AccentName>(getAccentName)

  useEffect(() => {
    const onChange = (e: Event) => setName((e as CustomEvent<AccentName>).detail)
    window.addEventListener(ACCENT_EVENT, onChange)
    return () => window.removeEventListener(ACCENT_EVENT, onChange)
  }, [])

  return [name, (n: AccentName) => setAccent(n)]
}
