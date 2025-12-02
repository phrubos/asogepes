'use client'

import { motion } from 'framer-motion'
import { Clock, Droplets, Sprout, Leaf, Minimize2, Activity, Thermometer, Droplet } from 'lucide-react'
import styles from './Problem.module.css'

interface ConsequenceCardProps {
  title: string
  description: string
  icon: string
  dataBadge?: string
  source?: string
  index: number
}

const icons: Record<string, JSX.Element> = {
  clock: <Clock size={24} strokeWidth={2} />,
  water: <Droplets size={24} strokeWidth={2} />,
  root: <Sprout size={24} strokeWidth={2} />,
  organic: <Leaf size={24} strokeWidth={2} />,
  leaf: <Leaf size={24} strokeWidth={2} />,
  compress: <Minimize2 size={24} strokeWidth={2} />,
  activity: <Activity size={24} strokeWidth={2} />,
  thermometer: <Thermometer size={24} strokeWidth={2} />,
  droplet: <Droplet size={24} strokeWidth={2} />,
  layers: <Minimize2 size={24} strokeWidth={2} />,
}

export default function ConsequenceCard({ title, description, icon, dataBadge, source, index }: ConsequenceCardProps) {
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
        {dataBadge && (
          <div className={styles.dataBadge}>
            {dataBadge}
          </div>
        )}
        {source && (
          <div className={styles.source}>
            Forrás: {source}
          </div>
        )}
      </div>
    </motion.div>
  )
}
