'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import styles from './LakitelekPhotosPage.module.css'

export default function LakitelekPhotosPage() {
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
        <h3 className={styles.headerTitle}>Fotók</h3>
      </motion.div>

      {/* Photos Grid */}
      <motion.div
        className={styles.photosGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Photo 1 - Main comparison */}
        <div className={styles.photoMain}>
          <div className={styles.imagePlaceholder}>
            <span>Összehasonlító fotó</span>
            <span className={styles.placeholderSub}>7 parcella felülnézetből</span>
          </div>
        </div>

        {/* Photo 2 - Detail */}
        <div className={styles.photoSecondary}>
          <div className={styles.imagePlaceholder}>
            <span>Részlet fotó</span>
            <span className={styles.placeholderSub}>Növényfejlődés különbsége</span>
          </div>
        </div>

        {/* Photo 3 - Detail */}
        <div className={styles.photoSecondary}>
          <div className={styles.imagePlaceholder}>
            <span>Talajmintázás</span>
            <span className={styles.placeholderSub}>Penetrométeres mérés</span>
          </div>
        </div>
      </motion.div>

      {/* Caption */}
      <motion.p
        className={styles.caption}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        A fotók a 2025-ös tenyészidőszak során készültek a lakiteleki kísérleti parcellán.
      </motion.p>
    </div>
  )
}
