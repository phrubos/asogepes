'use client'

import { motion } from 'framer-motion'
import { benefits } from '@/lib/data'
import styles from './SolutionNew.module.css'
import { Check } from 'lucide-react'

export default function BenefitsGrid() {
  return (
    <div className={styles.blueprintContainer}>
      <div className={styles.blueprintHeader}>
        <div className={styles.blueprintTitle}>
          Technológiai Előnyök
        </div>
        <span className={styles.blueprintBadge}>AGRONOMY 2.0</span>
      </div>

      <div className={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className={styles.benefitCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div style={{ 
              color: 'var(--color-gold)', 
              marginBottom: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'monospace',
              fontSize: '0.75rem'
            }}>
              <Check size={16} />
              BENEFIT_0{index + 1}
            </div>
            <h4 style={{ 
              color: 'var(--color-white)', 
              marginBottom: 'var(--space-sm)',
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem'
            }}>
              {benefit.title}
            </h4>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '0.9375rem',
              lineHeight: '1.6',
              margin: 0
            }}>
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
