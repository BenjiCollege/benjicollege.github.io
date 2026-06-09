// Tiny synthesized UI sounds via Web Audio — no audio files to load. Sounds are
// OFF by default (auto-playing audio is hostile); the visitor opts in via the
// dock toggle, and the choice persists. Browsers require a user gesture before
// audio can start, so the AudioContext is created lazily on first enable/play.

const KEY = 'portfolio-sound'
export const SOUND_EVENT = 'soundchange'

let ctx: AudioContext | null = null
let enabled = typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1'
let lastHover = 0

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function blip(freq: number, dur: number, vol: number, type: OscillatorType = 'sine') {
  if (!enabled) return
  const ac = ensureCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + dur)
}

export const sound = {
  isEnabled: () => enabled,
  hover() {
    // throttle so sweeping the cursor doesn't machine-gun
    const now = Date.now()
    if (now - lastHover < 60) return
    lastHover = now
    blip(1320, 0.04, 0.018, 'triangle')
  },
  click() {
    blip(560, 0.09, 0.05, 'sine')
    blip(280, 0.12, 0.035, 'sine')
  },
  toggle(on: boolean) {
    enabled = on
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, on ? '1' : '0')
    if (on) {
      ensureCtx()
      // confirmation chirp
      blip(880, 0.08, 0.05, 'sine')
    }
    window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: on }))
  },
}
