'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import ModelSection from './ModelSection'
import FieldDataModal from './FieldDataModal'
import styles from './SolutionNew.module.css'
import { ArrowRight } from 'lucide-react'

type ModelId = '38sx' | '38wx' | '40sx'

export default function SolutionLayout() {
  const [activeModel, setActiveModel] = useState<ModelId>('38sx')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalModelId, setModalModelId] = useState<ModelId>('38sx')

  const scrollToContent = (id: ModelId) => {
    setActiveModel(id)
    const element = document.getElementById('content-area')
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const shadowX = (centerX - x) / 12
    const shadowY = (centerY - y) / 12

    button.style.setProperty('--shadow-x', `${shadowX}px`)
    button.style.setProperty('--shadow-y', `${shadowY + 25}px`)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    button.style.removeProperty('--shadow-x')
    button.style.removeProperty('--shadow-y')
  }

  const openFieldModal = (modelId: ModelId) => {
    setModalModelId(modelId)
    setModalOpen(true)
  }

  const [hoveredButton, setHoveredButton] = useState<ModelId | null>(null)

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
    initial: { scale: 1, filter: 'brightness(0.9)' },
    hover: { 
      scale: 1.15,
      filter: 'brightness(1)',
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const labelVariants = {
    initial: { y: 0, color: 'rgba(255, 255, 255, 0.6)' },
    hover: { 
      y: -2,
      color: 'rgba(232, 200, 122, 1)',
      transition: { duration: 0.3 }
    }
  }

  const titleVariants = {
    initial: { x: 0, color: '#FFFFFF' },
    hover: { 
      x: 6,
      color: '#D4A84B',
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const indicatorVariants = {
    initial: { opacity: 0, y: -8 },
    hover: { 
      opacity: 1, 
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

          <motion.div
            className={styles.navButtons}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              className={styles.navButton}
              onClick={() => scrollToContent('38sx')}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredButton('38sx')}
              onMouseLeave={(e) => {
                handleMouseLeave(e)
                setHoveredButton(null)
              }}
              aria-label="Ugrás a 38SX modell szekcióra"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine sweep */}
              <motion.div 
                className={styles.shineSweep}
                variants={shineVariants}
                initial="initial"
                animate={hoveredButton === '38sx' ? 'hover' : 'initial'}
              />
              
              <motion.img
                src="/images/38SX.png"
                alt=""
                className={styles.navButtonImage}
                aria-hidden="true"
                variants={imageVariants}
              />
              <div className={styles.navButtonOverlay}>
                <motion.span 
                  className={styles.navButtonLabel}
                  variants={labelVariants}
                >
                  Nagy szériás
                </motion.span>
                <motion.span 
                  className={styles.navButtonTitle}
                  variants={titleVariants}
                >
                  38SX
                </motion.span>
              </div>
              
              {/* Indicator dots */}
              <motion.div 
                className={styles.indicator}
                variants={indicatorVariants}
              >
                <span className={styles.indicatorDotActive}></span>
                <span className={styles.indicatorDot}></span>
                <span className={styles.indicatorDot}></span>
              </motion.div>
            </motion.button>

            <motion.button
              className={styles.navButton}
              onClick={() => scrollToContent('38wx')}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredButton('38wx')}
              onMouseLeave={(e) => {
                handleMouseLeave(e)
                setHoveredButton(null)
              }}
              aria-label="Ugrás a 38WX modell szekcióra"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine sweep */}
              <motion.div 
                className={styles.shineSweep}
                variants={shineVariants}
                initial="initial"
                animate={hoveredButton === '38wx' ? 'hover' : 'initial'}
              />
              
              <motion.img
                src="/images/38WX.png"
                alt=""
                className={styles.navButtonImage}
                aria-hidden="true"
                variants={imageVariants}
              />
              <div className={styles.navButtonOverlay}>
                <motion.span 
                  className={styles.navButtonLabel}
                  variants={labelVariants}
                >
                  Lazítókéses
                </motion.span>
                <motion.span 
                  className={styles.navButtonTitle}
                  variants={titleVariants}
                >
                  38WX
                </motion.span>
              </div>
              
              {/* Indicator dots */}
              <motion.div 
                className={styles.indicator}
                variants={indicatorVariants}
              >
                <span className={styles.indicatorDot}></span>
                <span className={styles.indicatorDotActive}></span>
                <span className={styles.indicatorDot}></span>
              </motion.div>
            </motion.button>

            <motion.button
              className={styles.navButton}
              onClick={() => scrollToContent('40sx')}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredButton('40sx')}
              onMouseLeave={(e) => {
                handleMouseLeave(e)
                setHoveredButton(null)
              }}
              aria-label="Ugrás a 40SX modell szekcióra"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine sweep */}
              <motion.div 
                className={styles.shineSweep}
                variants={shineVariants}
                initial="initial"
                animate={hoveredButton === '40sx' ? 'hover' : 'initial'}
              />
              
              <motion.img
                src="/images/40SX.png"
                alt=""
                className={styles.navButtonImage}
                aria-hidden="true"
                variants={imageVariants}
              />
              <div className={styles.navButtonOverlay}>
                <motion.span 
                  className={styles.navButtonLabel}
                  variants={labelVariants}
                >
                  Mélyásógép
                </motion.span>
                <motion.span 
                  className={styles.navButtonTitle}
                  variants={titleVariants}
                >
                  40SX
                </motion.span>
              </div>
              
              {/* Indicator dots */}
              <motion.div 
                className={styles.indicator}
                variants={indicatorVariants}
              >
                <span className={styles.indicatorDot}></span>
                <span className={styles.indicatorDot}></span>
                <span className={styles.indicatorDotActive}></span>
              </motion.div>
            </motion.button>
          </motion.div>
        </header>

        {/* Content Area with Sticky Tabs */}
        <div className={styles.contentArea} id="content-area">
          {/* Sticky Model Tabs */}
          <nav className={styles.modelTabs}>
            <button
              className={`${styles.modelTab} ${activeModel === '38sx' ? styles.active : ''}`}
              onClick={() => setActiveModel('38sx')}
            >
              38SX
            </button>
            <button
              className={`${styles.modelTab} ${activeModel === '38wx' ? styles.active : ''}`}
              onClick={() => setActiveModel('38wx')}
            >
              38WX
            </button>
            <button
              className={`${styles.modelTab} ${activeModel === '40sx' ? styles.active : ''}`}
              onClick={() => setActiveModel('40sx')}
            >
              40SX
            </button>
          </nav>

          {/* Model Sections */}
          <div className={styles.contentWrapper}>
            {activeModel === '38sx' && (
              <div className={styles.modelSectionActive}>
                <ModelSection modelId="38sx" onOpenModal={() => openFieldModal('38sx')} />
              </div>
            )}
            {activeModel === '38wx' && (
              <div className={styles.modelSectionActive}>
                <ModelSection modelId="38wx" onOpenModal={() => openFieldModal('38wx')} />
              </div>
            )}
            {activeModel === '40sx' && (
              <div className={styles.modelSectionActive}>
                <ModelSection modelId="40sx" onOpenModal={() => openFieldModal('40sx')} />
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
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

      {/* Field Data Modal */}
      <FieldDataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modelId={modalModelId}
      />
    </section>
  )
}
