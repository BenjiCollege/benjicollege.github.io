import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Cursor } from './components/Cursor'
import { ScrollProgress } from './components/ScrollProgress'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { TechStack } from './sections/TechStack'
import { Projects } from './sections/Projects'
import { Playground } from './sections/Playground'
import { Photography } from './sections/Photography'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  useSmoothScroll()

  return (
    <div className="grain relative">
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Playground />
        <Photography />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
