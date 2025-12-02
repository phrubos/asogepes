'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownUp, RefreshCcw, Sprout, Wind, Skull, Layers } from 'lucide-react'
import styles from './Problem.module.css'

export default function SoilInfographic() {
  const [isPloughed, setIsPloughed] = useState(false)

  const togglePlough = () => setIsPloughed(!isPloughed)

  const texts = {
    natural: {
      title: 'Természetes állapot',
      button: 'Szántás',
      caption: 'Természetes állapot: egészséges talajélet, átjárható rétegek.',
      aerobicDesc: 'Élő, oxigéndús, morzsalékos.',
      anaerobicDesc: 'Tömör, oxigénszegény.',
    },
    ploughed: {
      title: 'Szántás után',
      button: 'Visszaállítás',
      caption: 'A szántás megfordítja a rétegeket: a biológiai élet elpusztul, vízzáró réteg keletkezik.',
      aerobicDesc: 'Eltemetve, oxigénhiányos.',
      anaerobicDesc: 'Felszínre kerülve kiszárad.',
    },
  }

  const currentTexts = isPloughed ? texts.ploughed : texts.natural

  return (
    <div className={styles.soilInfographic}>
      {/* Header / Control */}
      <div className={styles.soilHeader}>
        <h4 className={styles.soilStateTitle}>{currentTexts.title}</h4>
        <button
          onClick={togglePlough}
          className={`${styles.soilToggleBtn} ${isPloughed ? styles.soilToggleBtnPloughed : ''}`}
        >
          {isPloughed ? (
            <>
              <RefreshCcw size={16} /> {currentTexts.button}
            </>
          ) : (
            <>
              <ArrowDownUp size={16} /> {currentTexts.button}
            </>
          )}
        </button>
      </div>

      {/* Visualization Container */}
      <div className={styles.soilVisualization}>
        {/* Aerobic Layer */}
        <motion.div
          layout
          initial={false}
          animate={{
            y: isPloughed ? 140 : 0,
            filter: isPloughed ? 'grayscale(0.5) brightness(0.8)' : 'grayscale(0)',
          }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          className={`${styles.soilLayer} ${styles.soilAerobic}`}
        >
          <div className={styles.layerContent}>
            <div className={styles.layerInfo}>
              <span className={styles.layerLabel}>Aerob réteg</span>
              {isPloughed ? (
                <Skull size={18} className={styles.layerIconDeath} />
              ) : (
                <Sprout size={18} className={styles.layerIconLife} />
              )}
            </div>
            <p className={styles.layerDesc}>{currentTexts.aerobicDesc}</p>
          </div>
          {!isPloughed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.layerIndicators}
            >
              <span className={`${styles.indicator} ${styles.indicatorO2}`}>O<sub>2</sub></span>
              <span className={`${styles.indicator} ${styles.indicatorBio}`}>Bio</span>
            </motion.div>
          )}
        </motion.div>

        {/* Plough Pan (Eketalp) */}
        <AnimatePresence>
          {isPloughed && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={styles.ploughPan}
            >
              <span className={styles.panLabel}>Eketalp (Tömör)</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Anaerobic Layer */}
        <motion.div
          layout
          initial={false}
          animate={{
            y: isPloughed ? -140 : 0,
          }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          className={`${styles.soilLayer} ${styles.soilAnaerobic}`}
        >
          <div className={styles.layerContent}>
            <div className={styles.layerInfo}>
              <span className={styles.layerLabel}>Anaerob réteg</span>
              <Layers size={18} />
            </div>
            <p className={styles.layerDesc}>{currentTexts.anaerobicDesc}</p>
          </div>
          {isPloughed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={styles.layerIndicators}
            >
              <Wind size={20} />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Caption */}
      <p className={styles.diagramCaption}>{currentTexts.caption}</p>
    </div>
  )
}
