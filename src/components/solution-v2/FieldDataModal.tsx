'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  MapPin,
  Leaf,
  Layers,
  Droplets,
  Calendar,
  Lightbulb
} from 'lucide-react'
import styles from './FieldDataModal.module.css'

type ModelId = '38sx' | '38wx' | '40sx'

interface FieldDataModalProps {
  isOpen: boolean
  onClose: () => void
  modelId: ModelId
}

// Field data for each model
const fieldData = {
  '38sx': {
    location: 'Lakitelek',
    model: '38SX Nagy szériás',
    meta: {
      crop: 'Ipari paradicsom',
      soil: 'Humuszos homok (KA: 27)',
      irrigation: '450 mm',
      period: 'Május – Augusztus'
    },
    spadeTreatments: [
      'Ásógép (30 cm) önállóan',
      'Szántás + Ásógép (25 cm)'
    ],
    controlTreatments: [
      'Szántás + Kombinátor',
      'Hagyományos művelés'
    ],
    chartData: [
      { month: 'Május', spade: 22, control: 28 },
      { month: 'Augusztus', spade: 20, control: 32 }
    ],
    highlight: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
  },
  '38wx': {
    location: 'Szentkirály',
    model: '38WX Lazítókéses',
    meta: {
      crop: 'Vöröshagyma',
      soil: 'Réti csernozjom (KA: 28,5)',
      irrigation: '350 mm',
      period: 'Március – Június'
    },
    spadeTreatments: [
      'Őszi nehézkultivátor',
      'Tavaszi nehézkultivátor',
      '38WX ásógép (30 cm + 55 cm lazítókés)'
    ],
    controlTreatments: [
      'Őszi nehézkultivátor',
      'Tavaszi nehézkultivátor',
      'Kombinátor'
    ],
    chartData: [
      { month: 'Március', spade: 35, control: 8 },
      { month: 'Április', spade: 30, control: 25 },
      { month: 'Május', spade: 22, control: 23 },
      { month: 'Június', spade: 17, control: 5 }
    ],
    highlight: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.'
  },
  '40sx': {
    location: 'Kecskemét-Borbás',
    model: '40SX Mélyásógép',
    meta: {
      crop: 'Ipari paradicsom',
      soil: 'Réti csernozjom (KA: 28)',
      irrigation: '400 mm',
      period: 'Május – Június'
    },
    spadeTreatments: [
      'Őszi szántás (28 cm)',
      'Simítózás',
      'Ásóborona',
      '40SX mélyásógép (45 cm)'
    ],
    controlTreatments: [
      'Őszi szántás (28 cm)',
      'Simítózás',
      'Ásóborona'
    ],
    chartData: [
      { month: 'Május', spade: 40, control: 35 },
      { month: 'Június', spade: 37, control: 27 }
    ],
    highlight: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.'
  }
}

// Spring configuration for smooth animations
const springConfig = {
  stiffness: 300,
  damping: 30,
  mass: 0.8
}

const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(10px)' }
}

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      ...springConfig,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
}

// Stagger animations for content
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
}

const metaItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
}

const listItemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.25 }
  }
}

const highlightVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.4, 
      delay: 0.4,
      ease: [0.22, 1, 0.36, 1] 
    }
  }
}

export default function FieldDataModal({ isOpen, onClose, modelId }: FieldDataModalProps) {
  const data = fieldData[modelId]
  const prefersReducedMotion = useReducedMotion()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
      // Focus close button on open
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return
    
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement?.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement?.focus()
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with animated blur */}
          <motion.div
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            onClick={onClose}
          />

          {/* Modal with spring animation */}
          <div className={styles.modalContainer}>
            <motion.div
              ref={modalRef}
              className={styles.modal}
              variants={prefersReducedMotion ? undefined : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              <header className={styles.header}>
                <motion.div 
                  className={styles.headerLeft}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <MapPin size={20} className={styles.headerIcon} />
                  </motion.div>
                  <div>
                    <h2 id="modal-title" className={styles.title}>{data.location}</h2>
                    <span className={styles.subtitle}>{data.model}</span>
                  </div>
                </motion.div>
                <button 
                  ref={closeButtonRef}
                  className={styles.closeBtn} 
                  onClick={onClose} 
                  aria-label="Bezárás"
                >
                  <X size={20} />
                </button>
              </header>

              {/* Body */}
              <motion.div 
                className={styles.body}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Location Meta - Staggered */}
                <motion.div className={styles.metaGrid} variants={itemVariants}>
                  {[
                    { icon: Leaf, text: data.meta.crop },
                    { icon: Layers, text: data.meta.soil },
                    { icon: Droplets, text: `${data.meta.irrigation} öntözés` },
                    { icon: Calendar, text: data.meta.period }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className={styles.metaItem}
                      variants={metaItemVariants}
                      whileHover={{ x: 4, color: 'var(--color-gold)' }}
                    >
                      <item.icon size={16} />
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Treatments Comparison - Staggered */}
                <motion.div className={styles.treatmentsGrid} variants={itemVariants}>
                  <motion.div 
                    className={`${styles.treatmentCol} ${styles.spade}`}
                    whileHover={{ borderColor: 'rgba(207, 166, 87, 0.5)' }}
                  >
                    <h4 className={styles.treatmentTitle}>Ásógépes kezelés</h4>
                    <ul className={styles.treatmentList}>
                      {data.spadeTreatments.map((t, i) => (
                        <motion.li 
                          key={i}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.25 + i * 0.06 }}
                        >
                          {t}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div 
                    className={styles.treatmentCol}
                    whileHover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <h4 className={styles.treatmentTitle}>Kontroll kezelés</h4>
                    <ul className={styles.treatmentList}>
                      {data.controlTreatments.map((t, i) => (
                        <motion.li 
                          key={i}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 + i * 0.06 }}
                        >
                          {t}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>

                {/* Chart - Animated Bars */}
                <motion.div className={styles.chartSection} variants={itemVariants}>
                  <h4 className={styles.chartTitle}>Penetrométeres mérések (cm)</h4>
                  <div className={styles.chartGrid}>
                    {data.chartData.map((d, i) => (
                      <div key={i} className={styles.chartItem}>
                        <span className={styles.chartMonth}>{d.month}</span>
                        <div className={styles.chartBars}>
                          <div className={styles.barGroup}>
                            <motion.div
                              className={`${styles.bar} ${styles.spadeBar}`}
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(20, d.spade * 2.5)}px` }}
                              transition={{ 
                                duration: 0.6, 
                                delay: 0.35 + i * 0.1,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              whileHover={{ filter: 'brightness(1.2)', y: -2 }}
                            >
                              <motion.span 
                                className={styles.barValue}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                              >
                                {d.spade}
                              </motion.span>
                            </motion.div>
                            <span className={styles.barLabel}>Ásógép</span>
                          </div>
                          <div className={styles.barGroup}>
                            <motion.div
                              className={`${styles.bar} ${styles.controlBar}`}
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(15, d.control * 2.5)}px` }}
                              transition={{ 
                                duration: 0.6, 
                                delay: 0.4 + i * 0.1,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              whileHover={{ filter: 'brightness(1.2)', y: -2 }}
                            >
                              <motion.span 
                                className={styles.barValue}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.55 + i * 0.1 }}
                              >
                                {d.control}
                              </motion.span>
                            </motion.div>
                            <span className={styles.barLabel}>Kontroll</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <motion.div 
                    className={styles.chartLegend}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.spadeDot}`} />
                      <span>Ásógépes kezelés</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.controlDot}`} />
                      <span>Kontroll</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Highlight - Slide in */}
                <motion.div 
                  className={styles.highlight}
                  variants={highlightVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4, borderLeftWidth: '5px' }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Lightbulb size={20} />
                  </motion.div>
                  <p>{data.highlight}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
