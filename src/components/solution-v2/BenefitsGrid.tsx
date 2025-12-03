'use client'

import { motion } from 'framer-motion'
import { benefits } from '@/lib/data'
import styles from './BenefitsGrid.module.css'
import { Check } from 'lucide-react'

export default function BenefitsGrid() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Technológiai Előnyök</h3>
        <span className={styles.badge}>AGRONOMY 2.0</span>
      </div>

      <div className={styles.grid}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.cardHeader}>
              <Check size={16} className={styles.cardIcon} />
              BENEFIT_0{index + 1}
            </div>
            <h4 className={styles.cardTitle}>{benefit.title}</h4>
            <p className={styles.cardDescription}>{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
