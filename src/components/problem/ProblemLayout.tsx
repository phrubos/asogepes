'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './ProblemNew.module.css'
import { ArrowRight } from 'lucide-react'

interface ProblemLayoutProps {
  compactionContent: React.ReactNode
  ploughingContent: React.ReactNode
}

export default function ProblemLayout({ compactionContent, ploughingContent }: ProblemLayoutProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X relative to button
    const y = e.clientY - rect.top;  // Mouse Y relative to button
    
    // Calculate shadow offset (inverted mouse movement)
    // When mouse is top-left, shadow goes bottom-right
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const shadowX = (centerX - x) / 10; // Max offset +/- 15px approx
    const shadowY = (centerY - y) / 10;

    button.style.setProperty('--shadow-x', `${shadowX}px`);
    button.style.setProperty('--shadow-y', `${shadowY + 20}px`); // Keep base offset
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    // Reset to defaults defined in CSS
    button.style.removeProperty('--shadow-x');
    button.style.removeProperty('--shadow-y');
  };

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

          <motion.div 
            className={styles.navButtons}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <button 
              className={styles.navButton}
              onClick={() => scrollToSection('compaction')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src="/images/tömörités_cover.png" 
                alt="Tömörödés" 
                className={styles.navButtonImage}
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonTitle}>A Tömörödés</span>
              </div>
            </button>

            <button 
              className={styles.navButton}
              onClick={() => scrollToSection('ploughing')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src="/images/szantas_korlatai_cover.png" 
                alt="Szántás korlátai" 
                className={styles.navButtonImage}
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonTitle}>A Szántás Korlátai</span>
              </div>
            </button>
          </motion.div>
        </header>

        <div className={styles.contentWrapper}>
          <div id="compaction" style={{ scrollMarginTop: '120px' }}>
            {compactionContent}
          </div>
          
          <div style={{ height: '80px' }} /> {/* Spacer */}

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
           <a href="/megoldas" className={styles.nextButton}>
             Megnézem a megoldást <ArrowRight size={20} />
           </a>
        </motion.div>
      </div>
    </section>
  )
}
