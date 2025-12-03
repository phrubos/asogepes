'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, ArrowRight } from 'lucide-react'
import styles from './LocationSelector.module.css'

type LocationKey = 'szentkiraly' | 'kecskemet' | 'lakitelek'

interface LocationSelectorProps {
  activeLocation: LocationKey
  onLocationChange: (location: LocationKey) => void
}

const locations: { key: LocationKey; name: string; crop: string; number: string }[] = [
  { key: 'szentkiraly', number: '01', name: 'Szentkirály', crop: 'Vöröshagyma' },
  { key: 'kecskemet', number: '02', name: 'Kecskemét', crop: 'Ipari Paradicsom' },
  { key: 'lakitelek', number: '03', name: 'Lakitelek', crop: 'Ipari Paradicsom' },
]

export default function LocationSelector({ activeLocation, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSelect = (key: LocationKey) => {
    onLocationChange(key)
    setIsOpen(false)
  }

  const activeData = locations.find(l => l.key === activeLocation)

  return (
    <>
      {/* Floating Trigger Pill */}
      <motion.div 
        className={styles.triggerContainer}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <button 
          className={styles.triggerButton}
          onClick={() => setIsOpen(true)}
        >
          <div className={styles.triggerIcon}>
            <MapPin size={20} />
          </div>
          <div className={styles.triggerText}>
            <span className={styles.triggerLabel}>Kísérleti helyszín</span>
            <span className={styles.triggerValue}>{activeData?.name}</span>
          </div>
        </button>
      </motion.div>

      {/* Fullscreen Selection Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <h2 className={styles.modalTitle}>Válassz helyszínt</h2>
              
              <div className={styles.locationsGrid}>
                {locations.map((loc, index) => (
                  <motion.button
                    key={loc.key}
                    className={`${styles.locationCard} ${activeLocation === loc.key ? styles.activeCard : ''}`}
                    onClick={() => handleSelect(loc.key)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                  >
                    <div className={styles.cardImage}>
                      {/* Image Placeholder */}
                      <div className={styles.imagePlaceholder}>
                        <span>{loc.number}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardNumber}>{loc.number}</span>
                        <span className={styles.cardCrop}>{loc.crop}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{loc.name}</h3>
                      <div className={styles.cardIndicator} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
