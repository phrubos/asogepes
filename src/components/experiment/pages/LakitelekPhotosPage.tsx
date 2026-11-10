'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { locations } from '@/lib/data'
import { SeasonLabel } from '../season/SeasonOnly'
import { useSeason } from '../season/SeasonContext'
import styles from './LakitelekPhotosPage.module.css'
import PhotoViewer from '@/components/shared/PhotoViewer/PhotoViewer'
import LakitelekRyeBoard from './LakitelekRyeBoard'

const data = locations.lakitelek

/** 2025: the photo viewer; 2026: the seven rye bundles of May (LakitelekRyeBoard) */
export default function LakitelekPhotosPage() {
  const { year } = useSeason()
  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerBadge}>
          <MapPin size={12} />
          <span>Lakitelek</span>
        </div>
        <SeasonLabel switchAt="lakitelek-info" />
      </motion.div>

      {/* Content */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {year === 2026 ? <LakitelekRyeBoard /> : <PhotoViewer items={data.photos || []} />}
      </motion.div>
    </div>
  )
}
