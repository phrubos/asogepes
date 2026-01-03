'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import styles from './AnimatedChart.module.css'

interface ChartDataPoint {
  label: string
  spade: number
  control: number
}

interface AnimatedChartProps {
  data: ChartDataPoint[]
  title?: string
  showTrend?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  colorScheme?: 'gold' | 'green'
}

export default function AnimatedChart({ 
  data, 
  title,
  showTrend = true,
  variant = 'default',
  colorScheme = 'gold'
}: AnimatedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<'spade' | 'control' | null>(null)

  const maxValue = Math.max(...data.flatMap(d => [d.spade, d.control])) * 1.1
  
  // Calculate trends
  const spadeTrend = data.length > 1 ? data[data.length - 1].spade - data[0].spade : 0
  const controlTrend = data.length > 1 ? data[data.length - 1].control - data[0].control : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  }

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

  const pulseVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  }

  const glowVariants = {
    idle: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  const valueVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: delay + 0.3 }
    })
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={14} />
    if (value < 0) return <TrendingDown size={14} />
    return <Minus size={14} />
  }

  const getTrendClass = (value: number, isSpade: boolean) => {
    // For soil looseness, negative change (less loose) is bad for spade, 
    // but we want to show if spade performed better than control
    if (isSpade) {
      return value <= 0 ? styles.trendGood : styles.trendBad
    }
    return value <= 0 ? styles.trendNeutral : styles.trendBad
  }

  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${styles[variant]} ${styles[colorScheme]}`}
    >
      {/* Header */}
      {title && (
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h4 className={styles.title}>{title}</h4>
          
          {/* Animated decorative line */}
          <motion.div 
            className={styles.titleLine}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}

      {/* Chart Grid with animated background */}
      <div className={styles.chartWrapper}>
        {/* Background grid lines */}
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

        {/* Chart bars */}
        <motion.div 
          className={styles.chartGrid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {data.map((point, index) => (
            <motion.div
              key={index}
              className={styles.chartColumn}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Month label */}
              <motion.span 
                className={styles.monthLabel}
                animate={hoveredIndex === index ? { 
                  color: 'var(--color-gold)',
                  scale: 1.05
                } : {}}
              >
                {point.label}
              </motion.span>

              {/* Bars container */}
              <div className={styles.barsContainer}>
                {/* Spade bar */}
                <motion.div
                  className={styles.barWrapper}
                  variants={pulseVariants}
                  initial="idle"
                  animate={hoveredIndex === index && hoveredBar === 'spade' ? "hover" : "idle"}
                  onHoverStart={() => setHoveredBar('spade')}
                  onHoverEnd={() => setHoveredBar(null)}
                >
                  {/* Glow effect */}
                  <motion.div
                    className={`${styles.barGlow} ${styles.spadeGlow}`}
                    variants={glowVariants}
                    initial="idle"
                    animate={hoveredIndex === index && hoveredBar === 'spade' ? "hover" : "idle"}
                  />
                  
                  <motion.div
                    className={`${styles.bar} ${styles.spadeBar}`}
                    style={{ height: `${(point.spade / maxValue) * 100}%` }}
                    variants={barVariants}
                    custom={index * 0.1}
                    whileHover={{ 
                      filter: 'brightness(1.2)',
                      boxShadow: '0 0 20px rgba(212, 168, 75, 0.4)'
                    }}
                  >
                    {/* Value tooltip */}
                    <motion.div
                      className={styles.valueTooltip}
                      variants={valueVariants}
                      custom={index * 0.1}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                    >
                      <span className={styles.valueNumber}>{point.spade}</span>
                      <span className={styles.valueUnit}>cm</span>
                    </motion.div>

                    {/* Shimmer effect */}
                    <motion.div
                      className={styles.barShimmer}
                      initial={{ x: '-100%' }}
                      animate={isInView ? { x: '200%' } : {}}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.5 + index * 0.15,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>
                  <span className={styles.barLabel}>Ásógép</span>
                </motion.div>

                {/* Control bar */}
                <motion.div
                  className={styles.barWrapper}
                  variants={pulseVariants}
                  initial="idle"
                  animate={hoveredIndex === index && hoveredBar === 'control' ? "hover" : "idle"}
                  onHoverStart={() => setHoveredBar('control')}
                  onHoverEnd={() => setHoveredBar(null)}
                >
                  {/* Glow effect */}
                  <motion.div
                    className={`${styles.barGlow} ${styles.controlGlow}`}
                    variants={glowVariants}
                    initial="idle"
                    animate={hoveredIndex === index && hoveredBar === 'control' ? "hover" : "idle"}
                  />

                  <motion.div
                    className={`${styles.bar} ${styles.controlBar}`}
                    style={{ height: `${(point.control / maxValue) * 100}%` }}
                    variants={barVariants}
                    custom={index * 0.1 + 0.05}
                    whileHover={{ 
                      filter: 'brightness(1.3)',
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <motion.div
                      className={styles.valueTooltip}
                      variants={valueVariants}
                      custom={index * 0.1 + 0.05}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                    >
                      <span className={styles.valueNumber}>{point.control}</span>
                      <span className={styles.valueUnit}>cm</span>
                    </motion.div>

                    <motion.div
                      className={styles.barShimmer}
                      initial={{ x: '-100%' }}
                      animate={isInView ? { x: '200%' } : {}}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.6 + index * 0.15,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>
                  <span className={styles.barLabel}>Kontroll</span>
                </motion.div>
              </div>

              {/* Connector line to next point */}
              {index < data.length - 1 && (
                <motion.div
                  className={styles.connector}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Legend with trend indicators */}
      <motion.div 
        className={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className={styles.legend}>
          <motion.div 
            className={styles.legendItem}
            whileHover={{ scale: 1.05 }}
          >
            <span className={`${styles.legendDot} ${styles.spadeDot}`} />
            <span className={styles.legendText}>Ásógépes kezelés</span>
            {showTrend && (
              <motion.span 
                className={`${styles.trendBadge} ${getTrendClass(spadeTrend, true)}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                {getTrendIcon(spadeTrend)}
                <span>{spadeTrend > 0 ? '+' : ''}{spadeTrend} cm</span>
              </motion.span>
            )}
          </motion.div>
          
          <motion.div 
            className={styles.legendItem}
            whileHover={{ scale: 1.05 }}
          >
            <span className={`${styles.legendDot} ${styles.controlDot}`} />
            <span className={styles.legendText}>Kontroll</span>
            {showTrend && (
              <motion.span 
                className={`${styles.trendBadge} ${getTrendClass(controlTrend, false)}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.9 }}
              >
                {getTrendIcon(controlTrend)}
                <span>{controlTrend > 0 ? '+' : ''}{controlTrend} cm</span>
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Info tooltip */}
        <motion.div 
          className={styles.infoHint}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <span className={styles.infoIcon}>📊</span>
          <span>Laza talajréteg mélysége — magasabb = jobb</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
