'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './ProblemNew.module.css'
import { ArrowRight } from 'lucide-react'

interface ProblemLayoutProps {
  compactionContent: React.ReactNode
  ploughingContent: React.ReactNode
}

export default function ProblemLayout({ compactionContent, ploughingContent }: ProblemLayoutProps) {
  const [activeView, setActiveView] = useState<'compaction' | 'ploughing'>('compaction')
  const contentRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (view: 'compaction' | 'ploughing') => {
    setActiveView(view)
    
    // Immediate scroll to content
    const element = contentRef.current;
    if (element) {
      const yOffset = -120; // Increased offset to account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <section className={styles.sectionProblem}>
      <div className="container">
        <header className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={styles.headerContent}
          >
            <SectionHeader number="01" title="A Probléma" />
            <h1 className={styles.mainTitle}>
              Miért fulladnak meg<br />
              a gyökerek?
            </h1>
            <p className={styles.subTitle}>
              Az intenzív öntözés és a nehéz gépek taposása láthatatlanul teszi tönkre a talajszerkezetet. 
              Két fő ellenséggel küzdünk.
            </p>
          </motion.div>
        </header>

        <div className={styles.toggleWrapper}>
          <div className={styles.toggleContainer}>
            <button
              onClick={() => handleTabChange('compaction')}
              className={`${styles.toggleButton} ${activeView === 'compaction' ? styles.active : ''}`}
            >
              A Tömörödés
            </button>
            <button
              onClick={() => handleTabChange('ploughing')}
              className={`${styles.toggleButton} ${activeView === 'ploughing' ? styles.active : ''}`}
            >
              A Szántás Korlátai
            </button>
            <motion.div
              className={styles.activeBackground}
              animate={{
                x: activeView === 'compaction' ? '0%' : '100%',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <div ref={contentRef} style={{ scrollMarginTop: '120px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={styles.contentWrapper}
            >
              {activeView === 'compaction' ? compactionContent : ploughingContent}
            </motion.div>
          </AnimatePresence>
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
           <a href="/megoldas" className={styles.nextButton}>
             Megnézem a megoldást <ArrowRight size={20} />
           </a>
        </motion.div>
      </div>
    </section>
  )
}
