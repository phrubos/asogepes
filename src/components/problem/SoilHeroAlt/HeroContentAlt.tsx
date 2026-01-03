'use client'

import { motion } from 'framer-motion'
import styles from './SoilHeroAlt.module.css'

interface HeroContentAltProps {
  isLoaded: boolean
  onStartScan: () => void
  isScanning: boolean
}

export default function HeroContentAlt({ isLoaded, onStartScan, isScanning }: HeroContentAltProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.8,
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
              delay: 1 + i * 0.1,
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
        Az intenzív öntözés láthatatlanul károsítja a talajszerkezetet.
        <strong> Vizsgáljuk meg</strong> együtt, milyen rejtett problémák
        alakulnak ki a felszín alatt.
      </motion.p>

      {/* Scan CTA Button */}
      <motion.button
        className={styles.scanCTA}
        variants={itemVariants}
        onClick={onStartScan}
        disabled={isScanning}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={styles.scanIcon}>
          <motion.div
            className={styles.scanIconRing}
            animate={isScanning ? {
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1],
            } : {}}
            transition={{
              duration: 1,
              repeat: isScanning ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className={styles.scanIconDot}
            animate={isScanning ? {
              scale: [1, 0.8, 1],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isScanning ? Infinity : 0,
            }}
          />
        </div>
        <span>{isScanning ? 'Szkennelés...' : 'Talaj szkennelése'}</span>

        {/* Animated underline on hover */}
        <motion.svg
          width="100%"
          height="2"
          viewBox="0 0 100 2"
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        >
          <motion.line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="#00D4FF"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileHover={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.svg>
      </motion.button>

      {/* Stats row */}
      <motion.div
        style={{
          display: 'flex',
          gap: '32px',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
        variants={itemVariants}
      >
        <div>
          <motion.div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#C9A227',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.4, type: 'spring' }}
          >
            350+
          </motion.div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            mm öntözés/év
          </div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div>
          <motion.div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#C9A227',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2, duration: 0.4, type: 'spring' }}
          >
            55 cm
          </motion.div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            kritikus mélység
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
