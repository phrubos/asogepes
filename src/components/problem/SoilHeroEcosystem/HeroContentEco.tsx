'use client'

import { motion } from 'framer-motion'
import styles from './SoilHeroEcosystem.module.css'

interface HeroContentEcoProps {
  isLoaded: boolean
  onStartRain: () => void
  isRaining: boolean
}

export default function HeroContentEco({
  isLoaded,
  onStartRain,
  isRaining,
}: HeroContentEcoProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const headlineWords = ['Mi', 'történik', 'a', 'talajban?']

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
        <span className={styles.sectionDot} />
        <span className={styles.sectionLabel}>A Probléma</span>
      </motion.div>

      {/* Headline with word animation */}
      <motion.h1 className={styles.heroHeadline} variants={itemVariants}>
        {headlineWords.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.8 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {i === 3 ? (
              <span className={styles.headlineAccent}>{word}</span>
            ) : (
              word
            )}
          </motion.span>
        ))}
      </motion.h1>

      {/* Description */}
      <motion.p className={styles.heroDescription} variants={itemVariants}>
        Az intenzív öntözés láthatatlanul károsítja a talaj
        <strong> élő ökoszisztémáját</strong>. Figyeld meg, hogyan akad el
        a víz és pusztulnak a gyökerek a tömörödött rétegekben.
      </motion.p>

      {/* Rain CTA Button */}
      <motion.button
        className={styles.rainCTA}
        variants={itemVariants}
        onClick={onStartRain}
        disabled={isRaining}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={styles.rainIcon}>
          {/* Water droplet icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M12 2C12 2 6 10 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10 12 2 12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={isLoaded ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 1.5 }}
            />
            <motion.path
              d="M10 14C10 15.1 10.9 16 12 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 2 }}
            />
          </svg>

          {/* Animated ripples when raining */}
          {isRaining && (
            <>
              <motion.div
                className={styles.rainRipple}
                animate={{
                  scale: [1, 2],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                className={styles.rainRipple}
                animate={{
                  scale: [1, 2],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.3,
                }}
              />
            </>
          )}
        </div>
        <span>{isRaining ? 'Öntözés folyamatban...' : 'Ökoszisztéma indítása'}</span>

        {/* Progress bar during rain */}
        {isRaining && (
          <motion.div
            className={styles.rainProgress}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        )}
      </motion.button>

      {/* Stats row */}
      <motion.div className={styles.statsRow} variants={itemVariants}>
        <div className={styles.statItem}>
          <motion.div
            className={styles.statValue}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.6, duration: 0.4, type: 'spring' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className={styles.statIcon}>
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5" />
            </svg>
            15+
          </motion.div>
          <div className={styles.statLabel}>mikro-organizmus/cm³</div>
        </div>

        <div className={styles.statDivider} />

        <div className={styles.statItem}>
          <motion.div
            className={styles.statValue}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.4, type: 'spring' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className={styles.statIcon}>
              <path
                d="M10 2 L10 18 M6 6 Q10 10 6 14 M14 6 Q10 10 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            45 cm
          </motion.div>
          <div className={styles.statLabel}>gyökér mélység</div>
        </div>

        <div className={styles.statDivider} />

        <div className={styles.statItem}>
          <motion.div
            className={styles.statValue}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2, duration: 0.4, type: 'spring' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className={styles.statIcon}>
              <path
                d="M2 14 L6 10 L10 12 L14 6 L18 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            -40%
          </motion.div>
          <div className={styles.statLabel}>víz beszivárgás</div>
        </div>
      </motion.div>

      {/* Ecosystem legend */}
      <motion.div
        className={styles.legend}
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.2 }}
      >
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#00D4FF' }} />
          <span>Víz részecskék</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#5A8F5A' }} />
          <span>Gyökerek</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: 'rgba(180, 200, 160, 0.8)' }} />
          <span>Mikro-élővilág</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
