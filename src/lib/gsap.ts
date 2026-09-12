// Central GSAP registration. GSAP 3.12+ ships every plugin for free, so we
// can register the "club" plugins (SplitText, Draggable, Flip, etc.) directly.
import { gsap } from 'gsap'
import { useGSAP as useGSAPContext } from '@gsap/react'
import { getReducedMotion, useReducedMotion } from './preferences'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { Flip } from 'gsap/Flip'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(
  useGSAPContext,
  ScrollTrigger,
  Draggable,
  InertiaPlugin,
  Flip,
  TextPlugin,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  SplitText,
)

// Honour the OS "reduce motion" preference. Components call this to decide
// whether to run heavy timelines or fall back to instant/fade states.
export function prefersReducedMotion(): boolean {
  return getReducedMotion()
}

// Revert every scoped animation before rebuilding it for a changed preference.
// The components themselves stay mounted, preserving forms and other UI state.
function useGSAP(callback: Parameters<typeof useGSAPContext>[0], options?: Parameters<typeof useGSAPContext>[1]) {
  const reduced = useReducedMotion()
  const config = Array.isArray(options) ? { dependencies: options } : options ?? {}
  return useGSAPContext(callback, {
    ...config,
    dependencies: [...(config.dependencies ?? []), reduced],
    revertOnUpdate: true,
  })
}

// Coarse-pointer / touch devices skip the custom cursor and the heaviest pins.
export function isTouch(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  Draggable,
  InertiaPlugin,
  Flip,
  TextPlugin,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  SplitText,
}
