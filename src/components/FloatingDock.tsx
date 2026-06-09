import { useEffect } from 'react'
import { ACCENTS } from '../lib/accent'
import { useAccent } from '../hooks/useAccent'
import { useSound } from '../hooks/useSound'
import { sound } from '../lib/sound'
import { Icon } from './Icon'

export const OPEN_PALETTE_EVENT = 'open-command-palette'

const INTERACTIVE = 'a, button, [data-cursor]'

/**
 * Bottom-right control cluster: accent swatches, a sound toggle, and a ⌘K
 * launcher. Also hosts the global UI-sound listeners (they no-op until the
 * visitor enables sound).
 */
export function FloatingDock() {
  const [active, setAccent] = useAccent()
  const [soundOn, setSoundOn] = useSound()

  // Global hover/click sounds — attached once, gated by the toggle internally.
  useEffect(() => {
    const onOver = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) sound.hover()
    }
    const onClick = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) sound.click()
    }
    document.addEventListener('pointerover', onOver)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/80 px-3 py-2 backdrop-blur">
        {ACCENTS.map((a) => (
          <button
            key={a.name}
            onClick={() => setAccent(a.name)}
            aria-label={`${a.label} accent`}
            data-cursor
            className="h-4 w-4 rounded-full transition-transform hover:scale-125"
            style={{
              background: a.value,
              outline: active === a.name ? `2px solid ${a.value}` : 'none',
              outlineOffset: '2px',
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setSoundOn(!soundOn)}
        data-cursor
        aria-label={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}
        aria-pressed={soundOn}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/80 backdrop-blur transition-colors ${
          soundOn ? 'text-[var(--color-accent)]' : 'text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]'
        }`}
      >
        <Icon name={soundOn ? 'sound-on' : 'sound-off'} size={17} />
      </button>

      <button
        onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
        data-cursor
        aria-label="Open command palette"
        className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/80 px-3 py-2 font-mono text-xs text-[var(--color-fg-dim)] backdrop-blur transition-colors hover:text-[var(--color-fg)]"
      >
        <kbd className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
    </div>
  )
}
