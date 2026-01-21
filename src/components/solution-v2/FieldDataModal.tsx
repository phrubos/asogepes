'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  MapPin,
  Leaf,
  Layers,
  Droplets,
  Calendar,
  Lightbulb,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './FieldDataModal.module.css'

import { fieldData, ModelId } from '@/lib/technology-data'

interface FieldDataModalProps {
  isOpen: boolean
  onClose: () => void
  modelId: ModelId
}

// Field data imported from @/lib/technology-data

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
  const router = useRouter()

  const handleViewDetails = () => {
    onClose()
    router.push('/kutatas')
  }

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


  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
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

                {/* Chart - Animated Bars with micro-interactions */}
                <motion.div className={styles.chartSection} variants={itemVariants}>
                  <motion.h4
                    className={styles.chartTitle}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Penetrométeres mérések (cm)
                  </motion.h4>

                  {/* Animated title underline */}
                  <motion.div
                    className={styles.chartTitleLine}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <div className={styles.chartGrid}>
                    {data.chartData.map((d, i) => (
                      <motion.div
                        key={i}
                        className={styles.chartItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.span
                          className={styles.chartMonth}
                          whileHover={{ color: 'var(--color-gold)' }}
                        >
                          {d.month}
                        </motion.span>
                        <div className={styles.chartBars}>
                          <div className={styles.barGroup}>
                            {/* Glow effect */}
                            <motion.div
                              className={styles.barGlow}
                              style={{ background: 'var(--color-gold)' }}
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.5 }}
                            />
                            <motion.div
                              className={`${styles.bar} ${styles.spadeBar}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: `${Math.max(20, d.spade * 2.5)}px`,
                                opacity: 1
                              }}
                              transition={{
                                height: { duration: 0.8, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.3, delay: 0.35 + i * 0.1 }
                              }}
                              whileHover={{
                                filter: 'brightness(1.25)',
                                y: -3,
                                boxShadow: '0 8px 25px rgba(212, 168, 75, 0.4)'
                              }}
                            >
                              <motion.span
                                className={styles.barValue}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                              >
                                {d.spade}
                              </motion.span>

                              {/* Shimmer effect */}
                              <motion.div
                                className={styles.barShimmer}
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{
                                  duration: 1.2,
                                  delay: 0.8 + i * 0.15,
                                  ease: 'easeInOut'
                                }}
                              />
                            </motion.div>
                            <span className={styles.barLabel}>Ásógép</span>
                          </div>
                          <div className={styles.barGroup}>
                            <motion.div
                              className={styles.barGlow}
                              style={{ background: 'rgba(255,255,255,0.5)' }}
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.3 }}
                            />
                            <motion.div
                              className={`${styles.bar} ${styles.controlBar}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: `${Math.max(15, d.control * 2.5)}px`,
                                opacity: 1
                              }}
                              transition={{
                                height: { duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.3, delay: 0.4 + i * 0.1 }
                              }}
                              whileHover={{
                                filter: 'brightness(1.4)',
                                y: -3,
                                boxShadow: '0 8px 20px rgba(255, 255, 255, 0.15)'
                              }}
                            >
                              <motion.span
                                className={styles.barValue}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65 + i * 0.1 }}
                              >
                                {d.control}
                              </motion.span>

                              <motion.div
                                className={styles.barShimmer}
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{
                                  duration: 1.2,
                                  delay: 0.9 + i * 0.15,
                                  ease: 'easeInOut'
                                }}
                              />
                            </motion.div>
                            <span className={styles.barLabel}>Kontroll</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className={styles.chartLegend}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.div
                      className={styles.legendItem}
                      whileHover={{ scale: 1.05, x: 2 }}
                    >
                      <span className={`${styles.legendDot} ${styles.spadeDot}`} />
                      <span>Ásógépes kezelés</span>
                    </motion.div>
                    <motion.div
                      className={styles.legendItem}
                      whileHover={{ scale: 1.05, x: 2 }}
                    >
                      <span className={`${styles.legendDot} ${styles.controlDot}`} />
                      <span>Kontroll</span>
                    </motion.div>
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

                {/* CTA to Research page */}
                <motion.button
                  className={styles.ctaButton}
                  onClick={handleViewDetails}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Részletes módszertan a Kutatás oldalon</span>
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
