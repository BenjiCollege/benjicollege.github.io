import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { Nav } from './components/Nav'
import { CommandPalette } from './components/CommandPalette'
import { FloatingDock } from './components/FloatingDock'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { TechStack } from './sections/TechStack'
import { Projects } from './sections/Projects'
import { GitHubStats } from './sections/GitHubStats'
import { Playground } from './sections/Playground'
import { Photography } from './sections/Photography'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  useSmoothScroll()

  return (
    <div className="grain relative">
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <CommandPalette />
      <FloatingDock />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <GitHubStats />
        <Playground />
        <Photography />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
