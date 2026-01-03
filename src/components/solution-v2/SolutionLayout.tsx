'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import MagneticButton from '@/components/ui/MagneticButton'
import SectionScrollIndicator from '@/components/ui/SectionScrollIndicator'
import ModelSection from './ModelSection'
import FieldDataModal from './FieldDataModal'
import OperationPrinciple from './OperationPrinciple'
import ApplicationGuide from './ApplicationGuide'
import HubFolder from './HubFolder'
import styles from './SolutionNew.module.css'
import { ArrowRight } from 'lucide-react'

const TECHNOLOGY_SECTIONS = [
  { id: 'operation-principle', name: 'Működési elv' },
  { id: 'content-area', name: 'Modellek' },
  { id: 'application-guide', name: 'Alkalmazás' },
]

type ModelId = '38sx' | '38wx' | '40sx'

export default function SolutionLayout() {
  const router = useRouter()
  const [activeModel, setActiveModel] = useState<ModelId>('38sx')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalModelId, setModalModelId] = useState<ModelId>('38sx')

  const scrollToOperation = useCallback(() => {
    const element = document.getElementById('operation-principle')
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const scrollToModel = useCallback((id: ModelId) => {
    setActiveModel(id)
    const element = document.getElementById('content-area')
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const scrollToGuide = useCallback(() => {
    const element = document.getElementById('application-guide')
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

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
            <PageBadge number="03" label="A TECHNOLÓGIA" />
            <h1 className={styles.mainTitle}>
              Lazítás és forgatás,<br />
              optimális arányban
            </h1>
            <p className={styles.subTitle}>
              Az Imants ásógép technológia <em>megőrzi a talaj természetes rétegződését</em>,
              miközben megszünteti a tömörödést. Ismerje meg a gép működését.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HubFolder
              onScrollToOperation={scrollToOperation}
              onScrollToModel={scrollToModel}
              onScrollToGuide={scrollToGuide}
            />
          </motion.div>
        </header>

        {/* Operation Principle Section - NEW */}
        <OperationPrinciple />

        {/* Divider */}
        <div className={styles.sectionDivider} />

        {/* Content Area with Sticky Tabs */}
        <div className={styles.contentArea} id="content-area">
          <motion.div
            className={styles.modelsHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.modelsBadge}>IMANTS DUPLAROTOROS ÁSÓGÉP MODELLEK</span>
            <h2 className={styles.modelsTitle}>Homok és vályog talajokra</h2>
          </motion.div>
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

        {/* Divider */}
        <div className={styles.sectionDivider} />

        {/* Application Guide Section - NEW */}
        <ApplicationGuide />

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
             Hogyan teszteltük ezeket a gyakorlatban?
           </motion.p>
           <MagneticButton
             variant="primary"
             size="lg"
             showRipple
             showShine
             ariaLabel="Tovább a Kutatásra"
             onClick={() => router.push('/kutatas')}
           >
             Tovább a Kutatásra <ArrowRight size={20} />
           </MagneticButton>
        </motion.div>
      </div>

      {/* Field Data Modal */}
      <FieldDataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modelId={modalModelId}
      />

      {/* Section Scroll Indicator */}
      <SectionScrollIndicator sections={TECHNOLOGY_SECTIONS} />
    </section>
  )
}
