'use client'

import { motion } from 'framer-motion'
import { Shovel, Layers, Combine, Star, Check, AlertCircle } from 'lucide-react'
import { applicationModes } from '@/lib/data'
import styles from './ApplicationModes.module.css'

const iconMap: Record<string, JSX.Element> = {
  spade: <Shovel size={28} />,
  layers: <Layers size={28} />,
  combine: <Combine size={28} />,
}

export default function ApplicationModes() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Alkalmazási Módok</h3>
      <p className={styles.subtitle}>
        Ásógép önmagában vagy más művelőeszközzel kombinálva
      </p>

      <div className={styles.modesGrid}>
        {applicationModes.map((mode, index) => (
          <motion.div
            key={mode.id}
            className={`${styles.modeCard} ${mode.rating === 5 ? styles.recommended : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {mode.rating === 5 && (
              <div className={styles.recommendedBadge}>
                <Star size={14} fill="currentColor" /> Ajánlott
              </div>
            )}

            <div className={styles.modeHeader}>
              <div className={styles.modeIcon}>
                {iconMap[mode.icon] || <Shovel size={28} />}
              </div>
              <h4 className={styles.modeTitle}>{mode.title}</h4>
            </div>

            <p className={styles.modeDesc}>{mode.description}</p>

            <div className={styles.modeDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Munkamélység</span>
                <span className={styles.detailValue}>{mode.depth}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mikor ajánlott?</span>
                <span className={styles.detailValue}>{mode.when}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Eredmény</span>
                <span className={`${styles.detailValue} ${mode.rating >= 4 ? styles.good : styles.moderate}`}>
                  {mode.rating >= 4 ? <Check size={14} /> : <AlertCircle size={14} />}
                  {mode.result}
                </span>
              </div>
            </div>

            <div className={styles.examples}>
              <span className={styles.examplesLabel}>Példák a kísérletből:</span>
              <ul className={styles.examplesList}>
                {mode.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>

            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < mode.rating ? styles.starFilled : styles.starEmpty}
                  fill={i < mode.rating ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.conclusion}>
        <div className={styles.conclusionIcon}>💡</div>
        <p>
          <strong>Fő megállapítás:</strong> A <em>szántás + ásógép</em> kombináció adta a legstabilabb eredményt, 
          míg az önálló mélyásógép is kiváló választás jó szerkezetű talajokon.
        </p>
      </div>
    </div>
  )
}
