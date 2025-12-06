'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import MagneticButton from '@/components/ui/MagneticButton'
import ModelSection from './ModelSection'
import FieldDataModal from './FieldDataModal'
import styles from './SolutionNew.module.css'
import { ArrowRight } from 'lucide-react'

type ModelId = '38sx' | '38wx' | '40sx'

export default function SolutionLayout() {
  const router = useRouter()
  const [activeModel, setActiveModel] = useState<ModelId>('38sx')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalModelId, setModalModelId] = useState<ModelId>('38sx')
  const [hoveredFolder, setHoveredFolder] = useState<ModelId | null>(null)

  const scrollToContent = (id: ModelId) => {
    setActiveModel(id)
    const element = document.getElementById('content-area')
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const openFieldModal = (modelId: ModelId) => {
    setModalModelId(modelId)
    setModalOpen(true)
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
      translateY(-25px) 
      scale(1.12) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `
  }, [])

  const handleFolderMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const folder = e.currentTarget
    // Reset to original staggered position
    const transforms = [
      'translateY(-30px) translateX(-20px)',
      'translateY(0px) translateX(0px)',
      'translateY(30px) translateX(20px)'
    ]
    folder.style.transform = transforms[index] || ''
  }, [])

  // Folder animation variants - optimized for smooth 60fps
  const folderVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.12, 
      y: -25,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
    }
  }

  const folderFrontVariants = {
    initial: { rotateY: 0, x: 0, z: 0 },
    hover: { 
      rotateY: -15,
      x: 25,
      z: 25,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const sheetVariants = {
    initial: { x: -10, y: -6, rotate: 0 },
    hover: { 
      x: -30,
      y: -18,
      rotate: -2,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const sheet2Variants = {
    initial: { x: -5, y: -3, rotate: 0 },
    hover: { 
      x: -18,
      y: -10,
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
    initial: { scale: 1, filter: 'brightness(0.9)' },
    hover: { 
      scale: 1.15,
      filter: 'brightness(1)',
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const labelVariants = {
    initial: { color: '#FFFFFF' },
    hover: { 
      color: '#D4A84B',
      transition: { duration: 0.25 }
    }
  }

  const indicatorVariants = {
    initial: { opacity: 0, y: -5 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25 }
    }
  }

  return (
    <section className={styles.sectionSolution}>
      <div className="container">
        {/* Hero Header */}
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

          <motion.nav
            className={styles.folderNav}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Folder 1: 38SX */}
            <motion.button
              className={styles.folder}
              onClick={() => scrollToContent('38sx')}
              onMouseEnter={() => setHoveredFolder('38sx')}
              onMouseLeave={() => setHoveredFolder(null)}
              aria-label="Ugrás a 38SX modell szekcióra"
              variants={folderVariants}
              initial="initial"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div 
                className={`${styles.folderTab} ${styles.folderTabBrown}`}
                variants={tabVariants}
              >
                Model
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
                <span className={styles.modelType}>Nagy szériás</span>
                <motion.div 
                  className={styles.indicator}
                  variants={indicatorVariants}
                >
                  <span className={styles.indicatorDotActive}></span>
                  <span className={styles.indicatorDot}></span>
                  <span className={styles.indicatorDot}></span>
                </motion.div>
                <div className={styles.folderImageContainer}>
                  <motion.img
                    src="/images/38SX.png"
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
                    38SX
                  </motion.span>
                  <span className={styles.folderDesc}>
                    Univerzális ásógép nagy teljesítménnyel
                  </span>
                </div>
              </motion.div>
            </motion.button>

            {/* Folder 2: 38WX */}
            <motion.button
              className={styles.folder}
              onClick={() => scrollToContent('38wx')}
              onMouseEnter={() => setHoveredFolder('38wx')}
              onMouseLeave={() => setHoveredFolder(null)}
              aria-label="Ugrás a 38WX modell szekcióra"
              variants={folderVariants}
              initial="initial"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div 
                className={`${styles.folderTab} ${styles.folderTabGreen}`}
                variants={tabVariants}
              >
                Model
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
                <span className={styles.modelType}>Lazítókéses</span>
                <motion.div 
                  className={styles.indicator}
                  variants={indicatorVariants}
                >
                  <span className={styles.indicatorDot}></span>
                  <span className={styles.indicatorDotActive}></span>
                  <span className={styles.indicatorDot}></span>
                </motion.div>
                <div className={styles.folderImageContainer}>
                  <motion.img
                    src="/images/38WX.png"
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
                    38WX
                  </motion.span>
                  <span className={styles.folderDesc}>
                    Kombinált lazítás és művelés
                  </span>
                </div>
              </motion.div>
            </motion.button>

            {/* Folder 3: 40SX */}
            <motion.button
              className={styles.folder}
              onClick={() => scrollToContent('40sx')}
              onMouseEnter={() => setHoveredFolder('40sx')}
              onMouseLeave={() => setHoveredFolder(null)}
              aria-label="Ugrás a 40SX modell szekcióra"
              variants={folderVariants}
              initial="initial"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div 
                className={`${styles.folderTab} ${styles.folderTabBlue}`}
                variants={tabVariants}
              >
                Model
              </motion.div>
              <div className={`${styles.folderBack} ${styles.folderBackBlue}`} />
              <div className={styles.folderSheets}>
                <motion.div className={styles.sheet} variants={sheetVariants} />
                <motion.div className={styles.sheet} variants={sheet2Variants} />
              </div>
              <motion.div 
                className={styles.folderFront}
                variants={folderFrontVariants}
              >
                <span className={styles.modelType}>Mélyásógép</span>
                <motion.div 
                  className={styles.indicator}
                  variants={indicatorVariants}
                >
                  <span className={styles.indicatorDot}></span>
                  <span className={styles.indicatorDot}></span>
                  <span className={styles.indicatorDotActive}></span>
                </motion.div>
                <div className={styles.folderImageContainer}>
                  <motion.img
                    src="/images/40SX.png"
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
                    40SX
                  </motion.span>
                  <span className={styles.folderDesc}>
                    Mély talajművelés 60cm-ig
                  </span>
                </div>
              </motion.div>
            </motion.button>
          </motion.nav>
        </header>

        {/* Content Area with Sticky Tabs */}
        <div className={styles.contentArea} id="content-area">
          {/* Sticky Model Tabs with Animated Indicator */}
          <nav className={styles.modelTabs}>
            {(['38sx', '38wx', '40sx'] as ModelId[]).map((modelId) => (
              <button
                key={modelId}
                className={`${styles.modelTab} ${activeModel === modelId ? styles.active : ''}`}
                onClick={() => setActiveModel(modelId)}
              >
                {modelId.toUpperCase()}
                {activeModel === modelId && (
                  <motion.div
                    className={styles.tabIndicator}
                    layoutId="activeTabIndicator"
                    transition={{ 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 30 
                    }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Model Sections with AnimatePresence */}
          <div className={styles.contentWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel}
                className={styles.modelSectionActive}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <ModelSection 
                  modelId={activeModel} 
                  onOpenModal={() => openFieldModal(activeModel)} 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          className={styles.footer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
           <motion.p 
             className={styles.footerText}
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
           >
             Hogyan teljesített a gyakorlatban?
           </motion.p>
           <MagneticButton
             variant="primary"
             size="lg"
             showRipple
             showShine
             ariaLabel="Tovább a Kísérletekre"
             onClick={() => router.push('/kiserlet')}
           >
             Tovább a Kísérletekre <ArrowRight size={20} />
           </MagneticButton>
        </motion.div>
      </div>

      {/* Field Data Modal */}
      <FieldDataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modelId={modalModelId}
      />
    </section>
  )
}
