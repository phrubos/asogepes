'use client'

import { motion } from 'framer-motion'
import styles from './Experiment.module.css'

interface ChartData {
  month: string
  spade: number
  control: number
}

interface BarChartProps {
  data: ChartData[]
}

export default function BarChart({ data }: BarChartProps) {
  const maxValue = 40 // Max cm for scaling

  return (
    <div className={styles.chartContainer}>
      {data.map((item, index) => (
        <div key={index} className={styles.chartBarGroup}>
          <div className={styles.chartLabel}>{item.month}</div>
          <div className={styles.chartBars}>
            <motion.div
              className={`${styles.chartBar} ${styles.chartBarSpade}`}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{ height: `${(item.spade / maxValue) * 200}px` }}
            >
              <span className={styles.barValue}>{item.spade} cm</span>
            </motion.div>
            <motion.div
              className={`${styles.chartBar} ${styles.chartBarControl}`}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.05 }}
              style={{ height: `${(item.control / maxValue) * 200}px` }}
            >
              <span className={styles.barValue}>{item.control} cm</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  )
}
