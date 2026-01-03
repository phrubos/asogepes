'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Droplets, Sprout, Layers } from 'lucide-react'
import styles from './SoilHeroEcosystem.module.css'
import { NavItem } from './types'

interface NavButtonEcoProps {
  item: NavItem
  index: number
  isActive: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

export default function NavButtonEco({
  item,
  index,
  isActive,
  onHover,
  onClick,
}: NavButtonEcoProps) {
  // Icon based on nav item
  const getIcon = () => {
    switch (item.id) {
      case 'compaction':
        return <Droplets size={18} />
      case 'cultivator':
        return <Sprout size={18} />
      case 'ploughing':
        return <Layers size={18} />
      default:
        return null
    }
  }

  return (
    <motion.div
      className={`${styles.navButton} ${isActive ? styles.active : ''}`}
      style={{
        '--nav-color': item.color,
        borderLeftColor: item.color,
      } as React.CSSProperties}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 1 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background glow on hover */}
      <motion.div
        className={styles.navGlow}
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className={styles.navContent}>
        <div className={styles.navHeader}>
          <div className={styles.navNumberWrapper}>
            <span className={styles.navNumber}>{item.number}</span>
            <motion.span
              className={styles.navIcon}
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {getIcon()}
            </motion.span>
          </div>
          <span className={styles.navDepth}>{item.depth}</span>
        </div>

        <h3 className={styles.navTitle}>{item.title}</h3>
        <p className={styles.navDescription}>{item.description}</p>

        {/* Problem indicator on hover */}
        <motion.div
          className={styles.navProblem}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isActive ? 'auto' : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <span className={styles.problemBadge}>
            <span className={styles.problemDot} />
            {item.problem}
          </span>
        </motion.div>
      </div>

      {/* Arrow */}
      <motion.div
        className={styles.navArrow}
        animate={{
          x: isActive ? 4 : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight size={18} />
      </motion.div>

      {/* Animated border pulse */}
      {isActive && (
        <motion.div
          className={styles.navPulse}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Ecosystem activity indicator */}
      <motion.div
        className={styles.activityIndicator}
        initial={{ scale: 0 }}
        animate={{
          scale: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        <motion.div
          className={styles.activityRing}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
