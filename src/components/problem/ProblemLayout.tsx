'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './ProblemNew.module.css'
import { ArrowRight, ArrowDown } from 'lucide-react'

interface ProblemLayoutProps {
  compactionContent: React.ReactNode
  ploughingContent: React.ReactNode
}

export default function ProblemLayout({ compactionContent, ploughingContent }: ProblemLayoutProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const shadowX = (centerX - x) / 10;
    const shadowY = (centerY - y) / 10;

    button.style.setProperty('--shadow-x', `${shadowX}px`);
    button.style.setProperty('--shadow-y', `${shadowY + 20}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.style.removeProperty('--shadow-x');
    button.style.removeProperty('--shadow-y');
  };

  // Framer Motion variants
  const buttonVariants = {
    initial: { scale: 1, y: 0, rotateX: 0 },
    hover: { 
      scale: 1.06, 
      y: -12, 
      rotateX: 2,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    tap: { scale: 1.02, y: -6 }
  }

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.12,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const titleVariants = {
    initial: { x: 0 },
    hover: { 
      x: 6,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const cornerVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 0.9,
      transition: { duration: 0.4 }
    }
  }

  const arrowVariants = {
    initial: { opacity: 0, x: -4, y: 4 },
    hover: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration: 0.3, delay: 0.1 }
    }
  }

  const shineVariants = {
    initial: { x: '-100%' },
    hover: { 
      x: '200%',
      transition: { duration: 0.6, ease: 'easeInOut' }
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

          <motion.div 
            className={styles.navButtons}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button 
              className={styles.navButton}
              onClick={() => scrollToSection('compaction')}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredButton('compaction')}
              onMouseLeave={(e) => {
                handleMouseLeave(e)
                setHoveredButton(null)
              }}
              aria-label="Ugrás a Tömörödés szekcióra"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine sweep effect */}
              <motion.div 
                className={styles.shineSweep}
                variants={shineVariants}
                initial="initial"
                animate={hoveredButton === 'compaction' ? 'hover' : 'initial'}
              />
              
              <motion.img 
                src="/images/tömörités_cover.png" 
                alt="" 
                className={styles.navButtonImage}
                aria-hidden="true"
                variants={imageVariants}
              />
              <div className={styles.navButtonOverlay}>
                <motion.span 
                  className={styles.navButtonTitle}
                  variants={titleVariants}
                >
                  A Tömörödés
                </motion.span>
              </div>
              
              {/* Corner accent */}
              <motion.div 
                className={styles.cornerAccent}
                variants={cornerVariants}
              >
                <motion.div variants={arrowVariants}>
                  <ArrowDown size={16} />
                </motion.div>
              </motion.div>
            </motion.button>

            <motion.button 
              className={styles.navButton}
              onClick={() => scrollToSection('ploughing')}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredButton('ploughing')}
              onMouseLeave={(e) => {
                handleMouseLeave(e)
                setHoveredButton(null)
              }}
              aria-label="Ugrás a Szántás Korlátai szekcióra"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine sweep effect */}
              <motion.div 
                className={styles.shineSweep}
                variants={shineVariants}
                initial="initial"
                animate={hoveredButton === 'ploughing' ? 'hover' : 'initial'}
              />
              
              <motion.img 
                src="/images/szantas_korlatai_cover.png" 
                alt="" 
                className={styles.navButtonImage}
                aria-hidden="true"
                variants={imageVariants}
              />
              <div className={styles.navButtonOverlay}>
                <motion.span 
                  className={styles.navButtonTitle}
                  variants={titleVariants}
                >
                  A Szántás Korlátai
                </motion.span>
              </div>
              
              {/* Corner accent */}
              <motion.div 
                className={styles.cornerAccent}
                variants={cornerVariants}
              >
                <motion.div variants={arrowVariants}>
                  <ArrowDown size={16} />
                </motion.div>
              </motion.div>
            </motion.button>
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
