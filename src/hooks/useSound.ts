import { useEffect, useState } from 'react'
import { sound, SOUND_EVENT } from '../lib/sound'

/** Read/toggle the sound-enabled state, synced across components. */
export function useSound(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(sound.isEnabled())
  useEffect(() => {
    const handler = (e: Event) => setOn((e as CustomEvent<boolean>).detail)
    window.addEventListener(SOUND_EVENT, handler)
    return () => window.removeEventListener(SOUND_EVENT, handler)
  }, [])
  return [on, (v: boolean) => sound.toggle(v)]
}
