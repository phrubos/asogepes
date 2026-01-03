'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import styles from './SoilHeroSlider.module.css'
import { NavItem } from './types'

interface NavButtonSliderProps {
  item: NavItem
  index: number
  isActive: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

export default function NavButtonSlider({
  item,
  index,
  isActive,
  onHover,
  onClick,
}: NavButtonSliderProps) {
  const buttonVariants = {
    hidden: {
      opacity: 0,
      x: 40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.8 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.button
      className={`${styles.navButton} ${isActive ? styles.active : ''}`}
      style={{ '--nav-color': item.color } as React.CSSProperties}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 10 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className={styles.navContent}>
        <div className={styles.navHeader}>
          <span className={styles.navNumber}>{item.number}</span>
          <span className={styles.navDepth}>{item.depth}</span>
        </div>
        <h3 className={styles.navTitle}>{item.title}</h3>
        <p className={styles.navDescription}>{item.description}</p>
      </div>

      <motion.div
        className={styles.navArrow}
        initial={{ opacity: 0, x: -5 }}
        whileHover={{ opacity: 1, x: 5 }}
      >
        <ArrowRight size={18} />
      </motion.div>
    </motion.button>
  )
}
