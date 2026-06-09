// Central GSAP registration. GSAP 3.12+ ships every plugin for free, so we
// can register the "club" plugins (SplitText, Draggable, Flip, etc.) directly.
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { Flip } from 'gsap/Flip'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  Draggable,
  InertiaPlugin,
  Flip,
  TextPlugin,
  ScrambleTextPlugin,
)

// Honour the OS "reduce motion" preference. Components call this to decide
// whether to run heavy timelines or fall back to instant/fade states.
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
}
