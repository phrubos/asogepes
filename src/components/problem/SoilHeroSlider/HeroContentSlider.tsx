'use client'

import { motion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import styles from './SoilHeroSlider.module.css'
import { SOIL_STATES } from './types'

interface HeroContentSliderProps {
  isLoaded: boolean
  sliderPosition: number
}

export default function HeroContentSlider({
  isLoaded,
  sliderPosition,
}: HeroContentSliderProps) {
  // Determine which state is dominant based on slider position
  const isHealthyDominant = sliderPosition > 50
  const healthyStrength = sliderPosition / 100
  const damagedStrength = 1 - healthyStrength

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      className={styles.heroContent}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
    >
      {/* Section Indicator */}
      <motion.div className={styles.sectionIndicator} variants={itemVariants}>
        <span className={styles.sectionNumber}>01</span>
        <span className={styles.sectionLabel}>A probléma</span>
      </motion.div>

      {/* Headline - morphs based on slider position */}
      <motion.h1 className={styles.heroHeadline} variants={itemVariants}>
        A talaj{' '}
        <motion.span
          className={isHealthyDominant ? styles.headlineAccent : styles.headlineAccentDamaged}
          key={isHealthyDominant ? 'healthy' : 'damaged'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isHealthyDominant ? 'egészsége' : 'sérülése'}
        </motion.span>
        <br />
        a szemed előtt
      </motion.h1>

      {/* Description */}
      <motion.p className={styles.heroDescription} variants={itemVariants}>
        Húzd a csúszkát és lásd a különbséget az egészséges, laza
        talajszerkezet és a tömörödött, sérült talaj között.
        A vizualizáció valós talajmintákon alapul.
      </motion.p>

      {/* State Indicators */}
      <motion.div className={styles.stateIndicators} variants={itemVariants}>
        <div
          className={`${styles.stateIndicator} ${sliderPosition > 30 ? styles.active : ''}`}
        >
          <span className={styles.stateDot} />
          <span>{SOIL_STATES.healthy.label}</span>
        </div>
        <div
          className={`${styles.stateIndicator} ${styles.damaged} ${sliderPosition < 70 ? styles.active : ''}`}
        >
          <span className={styles.stateDot} />
          <span>{SOIL_STATES.damaged.label}</span>
        </div>
      </motion.div>

      {/* Drag Hint */}
      <motion.div
        className={styles.dragHint}
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className={styles.dragIcon}>
          <motion.div
            className={styles.dragArrows}
            animate={{ x: [-3, 3, -3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MoveHorizontal size={20} />
          </motion.div>
        </div>
        <span>Húzd a csúszkát az összehasonlításhoz</span>
      </motion.div>
    </motion.div>
  )
}
