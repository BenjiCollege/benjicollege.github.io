import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

type DoodleType = 'underline' | 'circle' | 'arrow' | 'star'

// Hand-drawn-looking paths, authored loose on purpose so they read as marker
// scribbles rather than geometry. Each draws itself in on scroll via DrawSVG.
const SHAPES: Record<DoodleType, { vb: string; paths: string[]; fill?: boolean }> = {
  underline: {
    vb: '0 0 200 24',
    paths: ['M4 14 C 44 6 74 18 112 11 S 182 7 196 15'],
  },
  circle: {
    vb: '0 0 220 110',
    paths: [
      'M112 8 C 168 6 210 30 210 55 C 210 86 150 102 100 100 C 36 98 10 72 12 46 C 14 20 64 8 120 9',
    ],
  },
  arrow: {
    vb: '0 0 120 90',
    paths: ['M8 10 C 44 28 66 50 92 72', 'M92 72 L 70 70', 'M92 72 L 88 50'],
  },
  star: {
    vb: '0 0 60 60',
    paths: [
      'M30 4 C 34 22 38 26 56 30 C 38 34 34 38 30 56 C 26 38 22 34 4 30 C 22 26 26 22 30 4',
    ],
  },
}

type Props = {
  type: DoodleType
  className?: string
  /** stroke color; defaults to the live accent token */
  color?: string
  strokeWidth?: number
  /** draw immediately on mount instead of on scroll */
  eager?: boolean
}

export function Doodle({
  type,
  className,
  color = 'var(--color-accent)',
  strokeWidth = 3,
  eager = false,
}: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const shape = SHAPES[type]

  useGSAP(
    () => {
      const paths = ref.current!.querySelectorAll('path')
      if (prefersReducedMotion()) {
        gsap.set(paths, { drawSVG: '100%' })
        return
      }
      gsap.fromTo(
        paths,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: 0.7,
          ease: 'power2.inOut',
          stagger: 0.12,
          scrollTrigger: eager ? undefined : { trigger: ref.current, start: 'top 88%' },
          delay: eager ? 0.2 : 0,
        },
      )
    },
    { scope: ref },
  )

  return (
    <svg
      ref={ref}
      viewBox={shape.vb}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {shape.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
