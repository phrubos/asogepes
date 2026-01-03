'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './BarChart.module.css'

interface ChartData {
  month: string
  spade: number
  control: number
}

interface BarChartProps {
  data: ChartData[]
}

export default function BarChart({ data }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<'spade' | 'control' | null>(null)
  
  const maxValue = Math.max(...data.flatMap(d => [d.spade, d.control])) * 1.15

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: (delay: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        scaleY: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3, delay }
      }
    })
  }

  const shimmerVariants = {
    hidden: { x: '-100%' },
    visible: (delay: number) => ({
      x: '200%',
      transition: { duration: 1.2, delay: delay + 0.5, ease: 'easeInOut' }
    })
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Grid lines */}
      <div className={styles.gridLines}>
        {[0, 25, 50, 75, 100].map((percent, i) => (
          <motion.div
            key={percent}
            className={styles.gridLine}
            style={{ bottom: `${percent}%` }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 0.3, scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 * i }}
          />
        ))}
      </div>

      <div className={styles.chartGrid}>
        {data.map((item, index) => (
          <motion.div 
            key={index} 
            className={styles.chartColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            {/* Month label */}
            <motion.div 
              className={styles.monthLabel}
              animate={hoveredIndex === index ? { 
                scale: 1.05,
                color: 'var(--color-gold)'
              } : {}}
            >
              {item.month}
            </motion.div>

            {/* Bars */}
            <div className={styles.barsContainer}>
              {/* Spade bar */}
              <motion.div
                className={styles.barWrapper}
                onHoverStart={() => setHoveredBar('spade')}
                onHoverEnd={() => setHoveredBar(null)}
              >
                {/* Glow */}
                <motion.div
                  className={`${styles.barGlow} ${styles.spadeGlow}`}
                  initial={{ opacity: 0 }}
                  animate={hoveredIndex === index && hoveredBar === 'spade' ? { opacity: 0.6 } : { opacity: 0 }}
                />
                
                <motion.div
                  className={`${styles.bar} ${styles.spadeBar}`}
                  style={{ height: `${(item.spade / maxValue) * 100}%` }}
                  variants={barVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={index * 0.1}
                  whileHover={{ 
                    filter: 'brightness(1.2)',
                    boxShadow: '0 0 25px rgba(212, 168, 75, 0.5)'
                  }}
                >
                  <motion.span 
                    className={styles.barValue}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {item.spade}
                  </motion.span>
                  
                  {/* Shimmer */}
                  <motion.div
                    className={styles.barShimmer}
                    variants={shimmerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    custom={index * 0.1}
                  />
                </motion.div>
                <span className={styles.barLabel}>Ásógép</span>
              </motion.div>

              {/* Control bar */}
              <motion.div
                className={styles.barWrapper}
                onHoverStart={() => setHoveredBar('control')}
                onHoverEnd={() => setHoveredBar(null)}
              >
                <motion.div
                  className={`${styles.barGlow} ${styles.controlGlow}`}
                  initial={{ opacity: 0 }}
                  animate={hoveredIndex === index && hoveredBar === 'control' ? { opacity: 0.4 } : { opacity: 0 }}
                />
                
                <motion.div
                  className={`${styles.bar} ${styles.controlBar}`}
                  style={{ height: `${(item.control / maxValue) * 100}%` }}
                  variants={barVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={index * 0.1 + 0.05}
                  whileHover={{ 
                    filter: 'brightness(1.3)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <motion.span 
                    className={styles.barValue}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.55 + index * 0.1 }}
                  >
                    {item.control}
                  </motion.span>
                  
                  <motion.div
                    className={styles.barShimmer}
                    variants={shimmerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    custom={index * 0.1 + 0.05}
                  />
                </motion.div>
                <span className={styles.barLabel}>Kontroll</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
