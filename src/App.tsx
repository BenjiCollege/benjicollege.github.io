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
import { Statement } from './sections/Statement'
import { TechStack } from './sections/TechStack'
import { Projects } from './sections/Projects'
import { GitHubStats } from './sections/GitHubStats'
import { Playground } from './sections/Playground'
import { Terminal } from './sections/Terminal'
import { Writing } from './sections/Writing'
import { Photography } from './sections/Photography'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  useSmoothScroll()

  return (
    <div className="grain relative">
      <AuroraBackground />
      <AmbientFX />
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <CommandPalette />
      <FloatingDock />
      <EasterEgg />
      <main>
        <Hero />
        <About />
        <Statement />
        <TechStack />
        <Projects />
        <Divider className="py-6" />
        <GitHubStats />
        <Playground />
        <Terminal />
        <Writing />
        <Divider className="py-6" />
        <Photography />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
