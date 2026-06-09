import { ACCENTS } from '../lib/accent'
import { useAccent } from '../hooks/useAccent'

export const OPEN_PALETTE_EVENT = 'open-command-palette'

/**
 * Bottom-right control cluster: accent swatches + a ⌘K launcher (also the way
 * to open the palette on touch devices that have no keyboard shortcut).
 */
export function FloatingDock() {
  const [active, setAccent] = useAccent()

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
