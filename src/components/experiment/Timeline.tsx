'use client'

import { useState, useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { MeasureDate, TreatmentRole } from '@/lib/seasons'
import { formatCm } from '@/lib/seasons'
import DateLabel from './season/DateLabel'
import styles from './Timeline.module.css'

interface TimelineData {
  month: string
  spade: number
  control: number
}

export interface TimelineSeries {
  key: string
  label: string
  short: string
  role: TreatmentRole
  deep?: boolean
  /** Marker under the value, e.g. 'n=1' */
  flag?: string
  values: number[]
}

export interface TimelineCard {
  key: string
  title: string
  text: string
}

interface TimelineProps {
  /** Two-series form (kontroll / ásógép) */
  data?: TimelineData[]
  /** Any number of series; overrides `data` */
  series?: TimelineSeries[]
  /** Labels of the measurements when `series` is used */
  dates?: MeasureDate[]
  /** Fixed top of the scale (cm), so switching seasons keeps the same scale */
  scaleMax?: number
  title?: string
  evaluations?: {
    control: string
    spade: string
    summary: string
  }
  cards?: TimelineCard[]
  summary?: string
  /** Extra block under the bars (e.g. the Évek strip) */
  aside?: ReactNode
}

export default function Timeline({
  data = [],
  series: seriesProp,
  dates,
  scaleMax,
  title = "A talaj tömörödése a termesztési ciklus alatt",
  evaluations,
  cards: cardsProp,
  summary: summaryProp,
  aside,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  const series: TimelineSeries[] = seriesProp ?? [
    { key: 'control', label: 'Kontroll', short: 'Kontroll', role: 'control', values: data.map(d => d.control) },
    { key: 'spade', label: 'Ásógép', short: 'Ásógép', role: 'spade', values: data.map(d => d.spade) },
  ]
  const points: MeasureDate[] = dates ?? data.map(d => ({ month: d.month }))
  const cards: TimelineCard[] = cardsProp ?? (evaluations ? [
    { key: 'control', title: 'Kontroll művelés', text: evaluations.control },
    { key: 'spade', title: 'Ásógépes művelés', text: evaluations.spade },
  ] : [])
  const summary = summaryProp ?? evaluations?.summary
  const compact = series.length > 2
  const seriesByKey = Object.fromEntries(series.map(s => [s.key, s]))

  const maxValue = scaleMax ?? Math.max(...series.flatMap(s => s.values)) * 1.15

  const fillClass = (s: TimelineSeries) =>
    `${s.role === 'spade' ? styles.barSpade : styles.barControl} ${s.deep ? styles.barDeep : ''}`

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

  return (
    <div ref={containerRef} className={`${styles.container} ${compact ? styles.compact : ''}`}>
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
        {compact && (
          <ul className={styles.legend}>
            {series.map(s => (
              <li key={s.key}>
                <span className={`${styles.legendSwatch} ${fillClass(s)}`} />
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Chart area with grid lines */}
      <div className={styles.chartArea}>
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

        <motion.div
          className={styles.timeline}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {points.map((point, index) => (
            <motion.div
              key={index}
              className={styles.timepoint}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <motion.div
                className={styles.month}
                animate={hoveredIndex === index ? {
                  scale: 1.05,
                  backgroundColor: 'rgba(212, 168, 75, 0.15)'
                } : {}}
                transition={{ duration: 0.2 }}
              >
                {dates ? <DateLabel date={point} stack={compact} /> : point.month}
              </motion.div>

              {/* Bars: kontroll first (left), then ásógép */}
              <div className={styles.bars}>
                {series.map((s, si) => {
                  const value = s.values[index]
                  const hovered = hoveredIndex === index && hoveredBar === s.key
                  return (
                    <motion.div
                      key={s.key}
                      className={styles.barWrapper}
                      onHoverStart={() => setHoveredBar(s.key)}
                      onHoverEnd={() => setHoveredBar(null)}
                    >
                      {!compact && <div className={styles.barLabel}>{s.short}</div>}
                      <div className={styles.barContainer}>
                        <motion.div
                          className={styles.barGlow}
                          style={{ backgroundColor: s.role === 'spade' ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)' }}
                          initial={{ opacity: 0 }}
                          animate={hovered ? { opacity: s.role === 'spade' ? 0.6 : 0.4 } : { opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div
                          className={`${styles.bar} ${fillClass(s)}`}
                          variants={barVariants}
                          custom={index * 0.1 + si * 0.05}
                          style={{ height: `${(value / maxValue) * 100}%` }}
                          whileHover={{
                            filter: 'brightness(1.2)',
                            boxShadow: s.role === 'spade' ? '0 0 25px rgba(212, 168, 75, 0.5)' : '0 0 20px rgba(255, 255, 255, 0.2)'
                          }}
                          aria-label={`${s.label}: ${formatCm(value)} cm`}
                        >
                          <motion.span
                            className={styles.barValueInside}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.5 + index * 0.1 + si * 0.05 }}
                          >
                            {compact ? Math.round(value) : formatCm(value)}
                          </motion.span>

                          <motion.div
                            className={styles.barShimmer}
                            variants={shimmerVariants}
                            custom={index * 0.1 + si * 0.05}
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        className={styles.barValue}
                        animate={hoveredIndex === index ? { color: s.role === 'spade' ? 'var(--color-gold)' : 'rgba(255,255,255,0.9)' } : {}}
                      >
                        {formatCm(value)}{compact ? '' : ' cm'}
                      </motion.div>
                      {s.flag && <span className={styles.flag}>{s.flag}</span>}
                    </motion.div>
                  )
                })}
              </div>

              {index < points.length - 1 && (
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

        {aside && <div className={styles.aside}>{aside}</div>}
        {/* with a block under the bars, the takeaway goes there too and the side column stays short */}
        {aside && summary && <p className={styles.asideNote}>{summary}</p>}
      </div>

      {/* Side column: evaluation cards, note, optional aside */}
      <motion.div
        className={styles.summarySection}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className={styles.summaryCards}>
          {cards.map(card => {
            const s = seriesByKey[card.key]
            return (
              <div
                key={card.key}
                className={`${styles.summaryItem} ${s?.role === 'spade' ? styles.summarySpade : styles.summaryControl}`}
              >
                <div className={styles.summaryHeader}>
                  <span className={`${styles.summaryDot} ${s?.deep ? styles.barDeep : ''}`} />
                  <span className={styles.summaryLabel}>{card.title}</span>
                </div>
                <p className={styles.summaryText}>{card.text}</p>
              </div>
            )
          })}
        </div>

        {summary && !aside && (
          <motion.div
            className={styles.summaryNote}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <p>{summary}</p>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
