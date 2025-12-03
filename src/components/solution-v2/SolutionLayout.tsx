'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './SolutionNew.module.css'
import { ArrowRight } from 'lucide-react'

interface SolutionLayoutProps {
  children: React.ReactNode
}

export default function SolutionLayout({ children }: SolutionLayoutProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Adjust for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle movement for the dark theme
    const shadowX = (centerX - x) / 12;
    const shadowY = (centerY - y) / 12;

    button.style.setProperty('--shadow-x', `${shadowX}px`);
    button.style.setProperty('--shadow-y', `${shadowY + 25}px`); // +25 base offset
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.style.removeProperty('--shadow-x');
    button.style.removeProperty('--shadow-y');
  };

  return (
    <section className={styles.sectionSolution}>
      <div className="container">
        <header className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={styles.headerContent}
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
          </motion.div>
          
          <motion.div 
            className={styles.navButtons}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <button 
              className={styles.navButton}
              onClick={() => scrollToSection('tech-benefits')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label="Ugrás a Technológiai Előnyök szekcióra"
            >
              <img 
                src="/images/technologia_cover.png" 
                alt="" 
                className={styles.navButtonImage}
                aria-hidden="true"
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonTitle}>Technológiai Előnyök</span>
              </div>
            </button>

            <button 
              className={styles.navButton}
              onClick={() => scrollToSection('model-range')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label="Ugrás a Modellválaszték szekcióra"
            >
              <img 
                src="/images/modell_valasztek_cover.png" 
                alt="" 
                className={styles.navButtonImage}
                aria-hidden="true"
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonTitle}>Modellválaszték</span>
              </div>
            </button>
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
