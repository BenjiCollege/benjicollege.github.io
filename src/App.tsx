import { useSmoothScroll } from './hooks/useSmoothScroll'
import { AuroraBackground } from './components/AuroraBackground'
import { AmbientFX } from './components/AmbientFX'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { Nav } from './components/Nav'
import { CommandPalette } from './components/CommandPalette'
import { FloatingDock } from './components/FloatingDock'
import { EasterEgg } from './components/EasterEgg'
import { Divider } from './components/Divider'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { StreamChat } from './sections/StreamChat'
import { Statement } from './sections/Statement'
import { TechStack } from './sections/TechStack'
import { Projects } from './sections/Projects'
import { GitHubStats } from './sections/GitHubStats'
import { Playground } from './sections/Playground'
import { Terminal } from './sections/Terminal'
import { Photography } from './sections/Photography'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { lazy, Suspense, useEffect } from 'react'
import { navigate, usePath } from './lib/navigation'
import { scrollToId, decodeSectionHash } from './lib/scroll'
import { ScrollTrigger } from './lib/gsap'
const DetailPage = lazy(() => import('./components/DetailPage').then(m => ({ default: m.DetailPage })))

export default function App() {
  useSmoothScroll()
  const path = usePath()
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return
      const url = new URL(anchor.href)
      if (url.origin !== location.origin) return
      event.preventDefault()
      if (url.pathname !== location.pathname) navigate(url.pathname + url.hash)
      else {
        history.pushState({}, '', url.pathname + url.hash)
        if (url.hash) scrollToId(decodeSectionHash(url.hash), url.hash === '#top' ? 0 : -80)
      }
    }
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (path === '/' && location.hash) scrollToId(decodeSectionHash(location.hash), location.hash === '#top' ? 0 : -80)
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [path])

  return (
    <div className="grain relative">
      <a href={path === '/' ? '/#main-content' : '#main-content'} className="skip-link">Skip to content</a>
      <AuroraBackground />
      <AmbientFX />
      {path === '/' && <Preloader />}
      <Cursor />
      <ScrollProgress />
      <Nav />
      <CommandPalette />
      <FloatingDock />
      <EasterEgg />
      {path !== '/' ? <Suspense fallback={<main className="px-6 py-40" aria-live="polite">Opening story…</main>}><DetailPage path={path} /></Suspense> : <main id="main-content" tabIndex={-1}>
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Statement />
        <TechStack />
        <Divider className="py-6" />
        <GitHubStats />
        <Playground />
        <StreamChat />
        <Terminal />
        <Divider className="py-6" />
        <Photography />
        <Contact />
      </main>}
      <Footer />
    </div>
  )
}
