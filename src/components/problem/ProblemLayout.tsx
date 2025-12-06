'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './ProblemNew.module.css'
import { ArrowRight } from 'lucide-react'

interface ProblemLayoutProps {
  compactionContent: React.ReactNode
  ploughingContent: React.ReactNode
}

export default function ProblemLayout({ compactionContent, ploughingContent }: ProblemLayoutProps) {
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const handleFolderMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const folder = e.currentTarget
    const rect = folder.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25
    
    folder.style.transform = `
      translateY(-20px) 
      scale(1.08) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `
  }, [])

  const handleFolderMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const folder = e.currentTarget
    // Reset to original staggered position
    const transforms = [
      'translateY(-20px) translateX(-15px)',
      'translateY(20px) translateX(15px)'
    ]
    folder.style.transform = transforms[index] || ''
  }, [])

  // Folder animation variants - optimized for smooth 60fps
  const folderVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.08, 
      y: -20,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
    }
  }

  const folderFrontVariants = {
    initial: { rotateY: 0, x: 0, z: 0 },
    hover: { 
      rotateY: -15,
      x: 20,
      z: 20,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const sheetVariants = {
    initial: { x: -8, y: -5, rotate: 0 },
    hover: { 
      x: -25,
      y: -15,
      rotate: -2,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const sheet2Variants = {
    initial: { x: -4, y: -2, rotate: 0 },
    hover: { 
      x: -15,
      y: -8,
      rotate: -1,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const tabVariants = {
    initial: { y: 0 },
    hover: { 
      y: -6,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const labelVariants = {
    initial: { x: 0, color: 'var(--color-earth-900)' },
    hover: { 
      x: 4,
      color: 'var(--color-green)',
      transition: { duration: 0.25 }
    }
  }

  const cornerVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.25 }
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

          <motion.nav 
            className={styles.folderNav}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Folder 1: A Tömörödés */}
            <motion.button 
              className={styles.folder}
              onClick={() => scrollToSection('compaction')}
              onMouseEnter={() => setHoveredFolder('compaction')}
              onMouseLeave={() => setHoveredFolder(null)}
              aria-label="Ugrás a Tömörödés szekcióra"
              variants={folderVariants}
              initial="initial"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div 
                className={`${styles.folderTab} ${styles.folderTabBrown}`}
                variants={tabVariants}
              >
                01
              </motion.div>
              <div className={`${styles.folderBack} ${styles.folderBackBrown}`} />
              <div className={styles.folderSheets}>
                <motion.div className={styles.sheet} variants={sheetVariants} />
                <motion.div className={styles.sheet} variants={sheet2Variants} />
              </div>
              <motion.div 
                className={styles.folderFront}
                variants={folderFrontVariants}
              >
                <div className={styles.holePunch} style={{ top: '50px' }} />
                <div className={styles.holePunch} style={{ top: '150px' }} />
                <div className={styles.holePunch} style={{ top: '250px' }} />
                <div className={styles.marginLine} />
                <div className={styles.folderImageContainer}>
                  <motion.img 
                    src="/images/tömörités_cover.png" 
                    alt="" 
                    className={styles.folderImage}
                    variants={imageVariants}
                  />
                </div>
                <div className={styles.folderContent}>
                  <motion.span 
                    className={styles.folderLabel}
                    variants={labelVariants}
                  >
                    A Tömörödés
                  </motion.span>
                  <span className={styles.folderDesc}>
                    Hogyan zárja el a víz és levegő útját a tömörödött talaj?
                  </span>
                </div>
                <motion.div 
                  className={styles.folderCornerAccent}
                  variants={cornerVariants}
                >
                  <ArrowRight size={16} style={{ transform: 'rotate(45deg)' }} />
                </motion.div>
              </motion.div>
            </motion.button>

            {/* Folder 2: A Szántás Korlátai */}
            <motion.button 
              className={styles.folder}
              onClick={() => scrollToSection('ploughing')}
              onMouseEnter={() => setHoveredFolder('ploughing')}
              onMouseLeave={() => setHoveredFolder(null)}
              aria-label="Ugrás a Szántás Korlátai szekcióra"
              variants={folderVariants}
              initial="initial"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div 
                className={`${styles.folderTab} ${styles.folderTabGreen}`}
                variants={tabVariants}
              >
                02
              </motion.div>
              <div className={`${styles.folderBack} ${styles.folderBackGreen}`} />
              <div className={styles.folderSheets}>
                <motion.div className={styles.sheet} variants={sheetVariants} />
                <motion.div className={styles.sheet} variants={sheet2Variants} />
              </div>
              <motion.div 
                className={styles.folderFront}
                variants={folderFrontVariants}
              >
                <div className={styles.holePunch} style={{ top: '50px' }} />
                <div className={styles.holePunch} style={{ top: '150px' }} />
                <div className={styles.holePunch} style={{ top: '250px' }} />
                <div className={styles.marginLine} />
                <div className={styles.folderImageContainer}>
                  <motion.img 
                    src="/images/szantas_korlatai_cover.png" 
                    alt="" 
                    className={styles.folderImage}
                    variants={imageVariants}
                  />
                </div>
                <div className={styles.folderContent}>
                  <motion.span 
                    className={styles.folderLabel}
                    variants={labelVariants}
                  >
                    A Szántás Korlátai
                  </motion.span>
                  <span className={styles.folderDesc}>
                    Miért nem oldja meg a hagyományos szántás a problémát?
                  </span>
                </div>
                <motion.div 
                  className={styles.folderCornerAccent}
                  variants={cornerVariants}
                >
                  <ArrowRight size={16} style={{ transform: 'rotate(45deg)' }} />
                </motion.div>
              </motion.div>
            </motion.button>
          </motion.nav>
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
