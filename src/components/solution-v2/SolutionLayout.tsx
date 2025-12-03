'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './SolutionNew.module.css'
import { ArrowRight, ArrowDown } from 'lucide-react'

interface SolutionLayoutProps {
  children: React.ReactNode
}

export default function SolutionLayout({ children }: SolutionLayoutProps) {
  const scrollToContent = () => {
    const element = document.getElementById('imants-40sx');
    if (element) {
      const yOffset = -120; // Adjust for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <section className={styles.sectionSolution}>
      <div className="container">
        <header className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader number="02" title="A Megoldás" light />
            <h1 className={styles.mainTitle}>
              Lazítás<br />
              forgatás nélkül
            </h1>
            <p className={styles.subTitle}>
              Az Imants ásógép technológia <em>megőrzi a talaj természetes rétegződését</em>, 
              miközben megszünteti a tömörödést. Ismerje meg a gép működését.
            </p>
            
            <motion.button 
              onClick={scrollToContent}
              className={styles.scrollDownButton}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ 
                opacity: { delay: 1, duration: 0.5 },
                y: { repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }
              }}
              aria-label="Görgetés lefelé"
            >
              <ArrowDown size={32} />
            </motion.button>
          </motion.div>
        </header>

        <div className={styles.contentWrapper}>
          {children}
        </div>

        <motion.div 
          className={styles.footer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
           <p className={styles.footerText}>
             Hogyan teljesített a gyakorlatban?
           </p>
           <a href="/kiserlet" className={styles.nextButton}>
             Tovább a Kísérletekre <ArrowRight size={20} />
           </a>
        </motion.div>
      </div>
    </section>
  )
}
