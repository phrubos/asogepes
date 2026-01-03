'use client'

import { motion } from 'framer-motion'
// import SoilHero from './SoilHero'
// import SoilHeroAlt from './SoilHeroAlt'
// import SoilHeroSlider from './SoilHeroSlider'
// import SoilHeroIsometric from './SoilHeroIsometric'
// import SoilHeroInteractive from './SoilHeroInteractive'
import ProblemHero from './ProblemHero'
import CultivatorView from './CultivatorView'
import SectionScrollIndicator from '@/components/ui/SectionScrollIndicator'
import styles from './ProblemNew.module.css'
import { ArrowRight } from 'lucide-react'

const PROBLEM_SECTIONS = [
  { id: 'compaction', name: 'Tömörödés' },
  { id: 'cultivator', name: 'Kultivátor' },
  { id: 'ploughing', name: 'Szántás' },
]

interface ProblemLayoutProps {
  compactionContent: React.ReactNode
  ploughingContent: React.ReactNode
}

export default function ProblemLayout({ compactionContent, ploughingContent }: ProblemLayoutProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -120
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section className={styles.sectionProblem}>
      {/* ÚJ HERO - Split Layout v7 */}
      <ProblemHero onNavigate={scrollToSection} />

      <div className="container">
        <div className={styles.contentWrapper}>
          {/* 01: Öntözés okozta tömörödés */}
          <div id="compaction" style={{ scrollMarginTop: '120px' }}>
            {compactionContent}
          </div>

          <div style={{ height: '80px' }} />

          {/* 02: Nehézkultivátor korlátai */}
          <div id="cultivator" style={{ scrollMarginTop: '120px' }}>
            <CultivatorView />
          </div>

          <div style={{ height: '80px' }} />

          {/* 03: Szántás korlátai */}
          <div id="ploughing" style={{ scrollMarginTop: '120px' }}>
            {ploughingContent}
          </div>
        </div>

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className={styles.footerText}>
            Van kiút a tömörödésből?
          </p>
          <a href="/technologia" className={styles.nextButton}>
            Ismerje meg a technológiát <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
      {/* Section Scroll Indicator */}
      <SectionScrollIndicator sections={PROBLEM_SECTIONS} />
    </section>
  )
}
