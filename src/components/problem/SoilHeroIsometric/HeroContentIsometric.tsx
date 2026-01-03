'use client'

import { motion } from 'framer-motion'
import { MousePointer2, Layers } from 'lucide-react'
import styles from './SoilHeroIsometric.module.css'
import { HeroContentIsometricProps } from './types'

export default function HeroContentIsometric({
  isLoaded,
  activeLayer,
}: HeroContentIsometricProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const headlineWords = ['Fedezd', 'fel', 'a', 'talaj', 'rétegeit']

  return (
    <motion.div
      className={styles.heroContent}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
    >
      {/* Section Badge */}
      <motion.div className={styles.sectionBadge} variants={itemVariants}>
        <span className={styles.badgeNumber}>01</span>
        <span className={styles.badgeDivider} />
        <span className={styles.badgeLabel}>A Probléma</span>
      </motion.div>

      {/* Headline with word animation */}
      <motion.h1 className={styles.heroHeadline} variants={itemVariants}>
        {headlineWords.map((word, i) => (
          <motion.span
            key={i}
            className={styles.headlineWord}
            initial={{ opacity: 0, y: 25, rotateX: -30 }}
            animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.8 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {i === 4 ? (
              <span className={styles.headlineAccent}>{word}</span>
            ) : (
              word
            )}
          </motion.span>
        ))}
      </motion.h1>

      {/* Description */}
      <motion.p className={styles.heroDescription} variants={itemVariants}>
        Az intenzív öntözés láthatatlan károkat okoz a talajban.
        <strong> Húzd ki a rétegeket</strong> és fedezd fel, milyen problémák
        rejtőznek a felszín alatt.
      </motion.p>

      {/* Instruction Hint */}
      <motion.div className={styles.instructionHint} variants={itemVariants}>
        <div className={styles.hintIcon}>
          <MousePointer2 size={20} />
        </div>
        <div className={styles.hintText}>
          <strong>Kattints a rétegekre</strong> a 3D modellen, hogy kihúzd
          őket és meglásd a rejtett problémákat
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div className={styles.statsRow} variants={itemVariants}>
        <motion.div
          className={styles.statItem}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.4, type: 'spring' }}
        >
          <span className={styles.statValue}>4</span>
          <span className={styles.statLabel}>Talajréteg</span>
        </motion.div>

        <div className={styles.statDivider} />

        <motion.div
          className={styles.statItem}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.75, duration: 0.4, type: 'spring' }}
        >
          <span className={styles.statValue}>80 cm</span>
          <span className={styles.statLabel}>Teljes mélység</span>
        </motion.div>

        <div className={styles.statDivider} />

        <motion.div
          className={styles.statItem}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.9, duration: 0.4, type: 'spring' }}
        >
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Probléma típus</span>
        </motion.div>
      </motion.div>

      {/* Active Layer indicator (subtle) */}
      {activeLayer && (
        <motion.div
          style={{
            marginTop: '24px',
            padding: '12px 16px',
            background: 'rgba(201, 162, 39, 0.08)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Layers size={16} style={{ color: '#C9A227' }} />
          <span
            style={{
              fontSize: '0.8rem',
              color: 'rgba(245, 240, 232, 0.7)',
            }}
          >
            Aktív: <strong style={{ color: '#C9A227' }}>{activeLayer.name}</strong>
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
