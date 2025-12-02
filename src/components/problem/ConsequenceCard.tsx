'use client'

import { motion } from 'framer-motion'
import { Clock, Droplets, Sprout, Leaf } from 'lucide-react'
import styles from './Problem.module.css'

interface ConsequenceCardProps {
  title: string
  description: string
  icon: string
  index: number
}

const icons: Record<string, JSX.Element> = {
  clock: <Clock size={24} strokeWidth={2} />,
  water: <Droplets size={24} strokeWidth={2} />,
  root: <Sprout size={24} strokeWidth={2} />,
  organic: <Leaf size={24} strokeWidth={2} />,
}

export default function ConsequenceCard({ title, description, icon, index }: ConsequenceCardProps) {
  return (
    <motion.div
      className={styles.consequenceCard}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.consequenceIcon}>
        {icons[icon] || <Leaf size={24} />}
      </div>
      <div className={styles.consequenceContent}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </motion.div>
  )
}
