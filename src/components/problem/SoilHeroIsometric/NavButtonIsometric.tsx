'use client'

import { motion } from 'framer-motion'
import { Droplets, Layers, Shovel, ArrowRight } from 'lucide-react'
import styles from './SoilHeroIsometric.module.css'
import { NavButtonIsometricProps } from './types'

const iconMap = {
  droplet: Droplets,
  layers: Layers,
  shovel: Shovel,
}

export default function NavButtonIsometric({
  item,
  index,
  isActive,
  isOpen,
  onHover,
  onClick,
}: NavButtonIsometricProps) {
  const Icon = iconMap[item.icon]

  return (
    <motion.div
      className={`${styles.navCard} ${isActive ? styles.active : ''} ${isOpen ? styles.open : ''}`}
      style={{
        '--nav-color': item.color,
      } as React.CSSProperties}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 1 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Content */}
      <div className={styles.navHeader}>
        <span className={styles.navNumber}>{item.number}</span>
        <span className={styles.navDepthBadge}>{item.depth}</span>
      </div>

      <h3 className={styles.navTitle}>{item.title}</h3>
      <p className={styles.navDescription}>{item.description}</p>

      {/* Icon */}
      <motion.div
        className={styles.navIcon}
        animate={{
          opacity: isActive ? 1 : 0,
          x: isActive ? 0 : -10,
        }}
      >
        <ArrowRight size={18} />
      </motion.div>

      {/* Hover highlight effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${item.color}15, transparent 60%)`,
          borderRadius: '16px',
          pointerEvents: 'none',
          opacity: 0,
        }}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Connection line to drawer (when open) */}
      {isOpen && (
        <motion.div
          style={{
            position: 'absolute',
            left: '-40px',
            top: '50%',
            width: '40px',
            height: '2px',
            background: `linear-gradient(90deg, ${item.color}, transparent)`,
            transformOrigin: 'right center',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}
