'use client'

import { motion } from 'framer-motion'
import styles from './Problem.module.css'

interface ConsequenceCardProps {
  title: string
  description: string
  icon: string
  index: number
}

const icons: Record<string, JSX.Element> = {
  clock: (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  water: (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 4v40M14 14l10 10 10-10M14 24l10 10 10-10M14 34l10 10 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  root: (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M8 40 Q24 10 40 40" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="24" cy="36" r="4" fill="currentColor"/>
    </svg>
  ),
  organic: (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M4 44 L44 4" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8 Q24 20 36 12 Q28 28 40 36" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
}

export default function ConsequenceCard({ title, description, icon, index }: ConsequenceCardProps) {
  return (
    <motion.div
      className={styles.consequenceCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.consequenceIcon}>
        {icons[icon]}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
    </motion.div>
  )
}
