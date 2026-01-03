'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Leaf, Calendar, ArrowRight } from 'lucide-react'
import styles from './ResearchHero.module.css'

interface MarkerData {
  id: string
  name: string
  x: number
  y: number
  crop: string
  soil: string
  period: string
}

interface LocationCardProps {
  marker: MarkerData
  isVisible: boolean
  onClick: () => void
}

export default function LocationCard({ marker, isVisible, onClick }: LocationCardProps) {
  // Position card based on marker position
  const getCardPosition = () => {
    if (marker.id === 'kecskemet') {
      return { left: '10%', top: '30%' }
    }
    if (marker.id === 'lakitelek') {
      return { right: '5%', top: '35%' }
    }
    // szentkiraly
    return { left: '15%', top: '20%' }
  }

  const position = getCardPosition()

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`location-card-${marker.id}`}
          className={styles.locationCard}
          style={position}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClick}
        >
          <div className={styles.cardHeader}>
            <MapPin size={14} className={styles.cardIcon} />
            <span className={styles.cardName}>{marker.name}</span>
          </div>

          <div className={styles.cardDetails}>
            <div className={styles.cardDetail}>
              <Leaf size={12} />
              <span>{marker.crop}</span>
            </div>
            <div className={styles.cardDetail}>
              <Calendar size={12} />
              <span>{marker.period}</span>
            </div>
          </div>

          <div className={styles.cardSoil}>
            {marker.soil}
          </div>

          <div className={styles.cardAction}>
            <span>Részletek</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
