import type { ReactNode } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'

type Props = {
  href: string
  children: ReactNode
  className?: string
  strength?: number
  download?: boolean
  external?: boolean
}

/** Anchor with a magnetic-hover pull. */
export function MagneticLink({
  href,
  children,
  className,
  strength = 0.4,
  download,
  external,
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement>(strength)
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      download={download}
      data-cursor
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
