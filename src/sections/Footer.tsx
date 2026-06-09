export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[var(--color-fg-dim)] sm:flex-row">
        <p className="font-mono">
          Crafted by <span className="text-[var(--color-fg)]">Gerardo Colegio</span> ·
          React + GSAP
        </p>
        <a href="#top" className="font-mono transition-colors hover:text-[var(--color-fg)]" data-cursor>
          back to top ↑
        </a>
      </div>
    </footer>
  )
}
