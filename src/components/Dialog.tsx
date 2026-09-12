import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type Lenis from 'lenis'

/** Native modal semantics, focus containment, Escape, and focus restoration. */
export function Dialog({ children, onClose, label, className = '' }: {
  children: ReactNode; onClose: () => void; label: string; className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.documentElement.style.overflow
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.documentElement.style.overflow = overflow
      ;(window as Window & { __lenis?: Lenis }).__lenis?.start()
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(
    <dialog ref={ref} aria-label={label} data-lenis-prevent
      onCancel={(e) => { e.preventDefault(); close.current() }}
      onClick={(e) => { if (e.target === e.currentTarget) close.current() }}
      className={`portfolio-dialog ${className}`}>
      <div className="dialog-content">{children}</div>
    </dialog>, document.body,
  )
}
