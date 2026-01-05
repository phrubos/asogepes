'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import styles from './Timeline.module.css'

interface TimelineData {
  month: string
  spade: number
  control: number
}

interface TimelineProps {
  data: TimelineData[]
  title?: string
  evaluations?: {
    control: string
    spade: string
    summary: string
  }
}

export default function Timeline({ data, title = "A talaj tömörödése a termesztési ciklus alatt", evaluations }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<'spade' | 'control' | null>(null)
  
  const maxValue = Math.max(...data.flatMap(d => [d.spade, d.control])) * 1.15
  
  const spadeChange = data[data.length - 1].spade - data[0].spade
  const controlChange = data[data.length - 1].control - data[0].control

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: (delay: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        scaleY: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4, delay }
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

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={14} />
    if (value < 0) return <TrendingDown size={14} />
    return <Minus size={14} />
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Header with animated line */}
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h4 className={styles.title}>{title}</h4>
        <motion.div 
          className={styles.titleLine}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Chart area with grid lines */}
      <div className={styles.chartArea}>
        {/* Animated grid lines */}
        <div className={styles.gridLines}>
          {[0, 25, 50, 75, 100].map((percent, i) => (
            <motion.div
              key={percent}
              className={styles.gridLine}
              style={{ bottom: `${percent}%` }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 0.4, scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            />
          ))}
        </div>

        {/* Timeline points */}
        <motion.div 
          className={styles.timeline}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {data.map((point, index) => (
            <motion.div 
              key={index} 
              className={styles.timepoint}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Month pill */}
              <motion.div 
                className={styles.month}
                animate={hoveredIndex === index ? { 
                  scale: 1.05,
                  backgroundColor: 'rgba(212, 168, 75, 0.15)'
                } : {}}
                transition={{ duration: 0.2 }}
              >
                {point.month}
              </motion.div>
              
              {/* Bars - Kontroll előrébb (balra), majd Ásógép (jobbra) */}
              <div className={styles.bars}>
                {/* Control bar - ELSŐ */}
                <motion.div
                  className={styles.barWrapper}
                  onHoverStart={() => setHoveredBar('control')}
                  onHoverEnd={() => setHoveredBar(null)}
                >
                  <div className={styles.barLabel}>Kontroll</div>
                  <div className={styles.barContainer}>
                    <motion.div
                      className={styles.barGlow}
                      style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                      initial={{ opacity: 0 }}
                      animate={hoveredIndex === index && hoveredBar === 'control' ? { opacity: 0.4 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className={`${styles.bar} ${styles.barControl}`}
                      variants={barVariants}
                      custom={index * 0.1}
                      style={{ height: `${(point.control / maxValue) * 100}%` }}
                      whileHover={{
                        filter: 'brightness(1.3)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <motion.span
                        className={styles.barValueInside}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {point.control}
                      </motion.span>

                      <motion.div
                        className={styles.barShimmer}
                        variants={shimmerVariants}
                        custom={index * 0.1}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className={styles.barValue}
                    animate={hoveredIndex === index ? { color: 'rgba(255,255,255,0.9)' } : {}}
                  >
                    {point.control} cm
                  </motion.div>
                </motion.div>

                {/* Spade bar - MÁSODIK */}
                <motion.div
                  className={styles.barWrapper}
                  onHoverStart={() => setHoveredBar('spade')}
                  onHoverEnd={() => setHoveredBar(null)}
                >
                  <div className={styles.barLabel}>Ásógép</div>
                  <div className={styles.barContainer}>
                    {/* Glow effect */}
                    <motion.div
                      className={styles.barGlow}
                      style={{ backgroundColor: 'var(--color-gold)' }}
                      initial={{ opacity: 0 }}
                      animate={hoveredIndex === index && hoveredBar === 'spade' ? { opacity: 0.6 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className={`${styles.bar} ${styles.barSpade}`}
                      variants={barVariants}
                      custom={index * 0.1 + 0.05}
                      style={{ height: `${(point.spade / maxValue) * 100}%` }}
                      whileHover={{
                        filter: 'brightness(1.2)',
                        boxShadow: '0 0 25px rgba(212, 168, 75, 0.5)'
                      }}
                    >
                      {/* Value inside bar */}
                      <motion.span
                        className={styles.barValueInside}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.55 + index * 0.1 }}
                      >
                        {point.spade}
                      </motion.span>

                      {/* Shimmer */}
                      <motion.div
                        className={styles.barShimmer}
                        variants={shimmerVariants}
                        custom={index * 0.1 + 0.05}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className={styles.barValue}
                    animate={hoveredIndex === index ? { color: 'var(--color-gold)' } : {}}
                  >
                    {point.spade} cm
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Animated connector */}
              {index < data.length - 1 && (
                <motion.div 
                  className={styles.connector}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <ArrowRight size={24} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Summary section with evaluation cards and note */}
      <motion.div
        className={styles.summarySection}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* Left side: Summary cards */}
        <div className={styles.summaryCards}>
          <motion.div
            className={`${styles.summaryItem} ${styles.summaryControl}`}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className={styles.summaryHeader}>
              <span className={styles.summaryDot} />
              <span className={styles.summaryLabel}>Kontroll művelés</span>
            </div>
            <div className={`${styles.summaryValue} ${controlChange <= 0 ? styles.good : styles.bad}`}>
              {getTrendIcon(controlChange)}
              <span>{controlChange > 0 ? '+' : ''}{controlChange} cm</span>
            </div>
            {evaluations?.control && (
              <p className={styles.summaryText}>{evaluations.control}</p>
            )}
          </motion.div>

          <motion.div
            className={`${styles.summaryItem} ${styles.summarySpade}`}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className={styles.summaryHeader}>
              <span className={styles.summaryDot} />
              <span className={styles.summaryLabel}>Ásógépes művelés</span>
            </div>
            <div className={`${styles.summaryValue} ${spadeChange <= 0 ? styles.good : styles.bad}`}>
              {getTrendIcon(spadeChange)}
              <span>{spadeChange > 0 ? '+' : ''}{spadeChange} cm</span>
            </div>
            {evaluations?.spade && (
              <p className={styles.summaryText}>{evaluations.spade}</p>
            )}
          </motion.div>
        </div>

        {/* Right side: Summary note */}
        {evaluations?.summary && (
          <motion.div
            className={styles.summaryNote}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <p>{evaluations.summary}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
