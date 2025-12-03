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
            <button
              className={styles.navButton}
              onClick={() => scrollToContent('38sx')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label="Ugrás a 38SX modell szekcióra"
            >
              <img
                src="/images/38SX.png"
                alt=""
                className={styles.navButtonImage}
                aria-hidden="true"
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonLabel}>Nagy szériás</span>
                <span className={styles.navButtonTitle}>38SX</span>
              </div>
            </button>

            <button
              className={styles.navButton}
              onClick={() => scrollToContent('38wx')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label="Ugrás a 38WX modell szekcióra"
            >
              <img
                src="/images/38WX.png"
                alt=""
                className={styles.navButtonImage}
                aria-hidden="true"
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonLabel}>Lazítókéses</span>
                <span className={styles.navButtonTitle}>38WX</span>
              </div>
            </button>

            <button
              className={styles.navButton}
              onClick={() => scrollToContent('40sx')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label="Ugrás a 40SX modell szekcióra"
            >
              <img
                src="/images/40SX.png"
                alt=""
                className={styles.navButtonImage}
                aria-hidden="true"
              />
              <div className={styles.navButtonOverlay}>
                <span className={styles.navButtonLabel}>Mélyásógép</span>
                <span className={styles.navButtonTitle}>40SX</span>
              </div>
            </button>
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
