import { useEffect, useState } from 'react'
import { ACCENTS } from '../lib/accent'
import { useAccent } from '../hooks/useAccent'
import { useSound } from '../hooks/useSound'
import { sound } from '../lib/sound'
import { setMotion, setTheme, useMotion, useTheme, type Motion } from '../lib/preferences'
import { Dialog } from './Dialog'

export const OPEN_PALETTE_EVENT = 'open-command-palette'

export function FloatingDock() {
  const [open, setOpen] = useState(false)
  const [accent, setAccent] = useAccent()
  const [soundOn, setSoundOn] = useSound()
  const theme = useTheme()
  const motion = useMotion()
  useEffect(() => {
    const hover = (e: Event) => { if ((e.target as HTMLElement).closest?.('a, button')) sound.hover() }
    const click = (e: Event) => { if ((e.target as HTMLElement).closest?.('a, button')) sound.click() }
    document.addEventListener('pointerover', hover)
    document.addEventListener('click', click)
    return () => { document.removeEventListener('pointerover', hover); document.removeEventListener('click', click) }
  }, [])
  return <>
    <div className="settings-launcher fixed bottom-5 right-5 z-40">
      <button aria-haspopup="dialog" onClick={() => setOpen(true)} className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-sm font-semibold shadow-lg">
        <span aria-hidden="true" className="text-[var(--color-accent)]">✦</span> Settings
      </button>
    </div>
    {open && <Dialog label="Site settings" onClose={() => setOpen(false)} className="settings-dialog">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Make it yours.</h2>
        <button autoFocus aria-label="Close settings" onClick={() => setOpen(false)} className="min-h-11 min-w-11 rounded-full border border-[var(--color-line)]">✕</button>
      </div>
      <p className="mt-2 text-sm text-[var(--color-fg-dim)]">Same personality. Your kind of experience.</p>
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-semibold">Appearance</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['dark', 'light'] as const).map(value => <button key={value} aria-pressed={theme === value} onClick={() => setTheme(value)} className="preference-button capitalize">{value === 'dark' ? '☾' : '☀'} {value}</button>)}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-semibold">Motion</legend>
        <div className="grid gap-2">
          {([{ value: 'full', label: 'Full experience', help: 'All the movement, all the fun.' }, { value: 'reduced', label: 'Reduced motion', help: 'Still layouts and instant transitions.' }, { value: 'system', label: 'Follow device', help: 'Full experience unless your device requests less motion.' }] as {value: Motion; label: string; help: string}[]).map(item => <button key={item.value} aria-pressed={motion === item.value} onClick={() => setMotion(item.value)} className="preference-button text-left"><span className="block font-semibold">{item.label}</span><span className="block text-sm text-[var(--color-fg-dim)]">{item.help}</span></button>)}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-semibold">Accent color</legend>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map(a => <button key={a.name} aria-label={`${a.label} accent`} aria-pressed={accent === a.name} onClick={() => setAccent(a.name)} className="preference-button grid h-11 w-11 place-items-center !p-0"><span className="h-6 w-6 rounded-full" style={{ background: a.value }} /></button>)}
        </div>
      </fieldset>
      <button aria-pressed={soundOn} onClick={() => setSoundOn(!soundOn)} className="preference-button mt-6 w-full">UI sounds: {soundOn ? 'on' : 'off'}</button>
      <button onClick={() => { setOpen(false); window.setTimeout(() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT)), 0) }} className="mt-4 min-h-11 w-full text-sm underline underline-offset-4">Open command palette <span className="text-[var(--color-fg-dim)]">(Ctrl / ⌘ K)</span></button>
    </Dialog>}
  </>
}
