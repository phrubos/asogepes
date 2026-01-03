'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import styles from './SoilHeroAlt.module.css'
import { NavItem } from './types'

interface NavButtonAltProps {
  item: NavItem
  index: number
  isActive: boolean
  isRevealed: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

export default function NavButtonAlt({
  item,
  index,
  isActive,
  isRevealed,
  onHover,
  onClick,
}: NavButtonAltProps) {
  return (
    <motion.div
      className={`${styles.navButton} ${isActive ? styles.active : ''} ${isRevealed ? styles.revealed : ''}`}
      style={{
        borderLeftColor: item.color,
        '--nav-color': item.color,
      } as React.CSSProperties}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 1.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Reveal indicator dot */}
      <motion.div
        className={styles.navRevealIndicator}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isRevealed ? 1 : 0,
          opacity: isRevealed ? 1 : 0,
        }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      />

      {/* Content */}
      <div className={styles.navContent}>
        <div className={styles.navHeader}>
          <span className={styles.navNumber}>{item.number}</span>
          <span className={styles.navDepth}>{item.depth}</span>
        </div>

        <h3 className={styles.navTitle}>{item.title}</h3>
        <p className={styles.navDescription}>{item.description}</p>
      </div>

      {/* Arrow */}
      <motion.div className={styles.navArrow}>
        <ArrowRight size={18} />
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: '16px',
          background: `linear-gradient(90deg, ${item.color}20, transparent)`,
          opacity: 0,
          pointerEvents: 'none',
        }}
        animate={{
          opacity: isActive ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Scan pulse effect when revealed */}
      {isRevealed && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '18px',
            border: '2px solid #00D4FF',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.div>
  )
}
