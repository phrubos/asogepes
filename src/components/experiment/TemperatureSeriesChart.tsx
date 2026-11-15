'use client'

import { Fragment, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Thermometer } from 'lucide-react'
import type { Season } from '@/lib/seasons'
import { formatCm } from '@/lib/seasons'
import DateLabel, { dateText } from './season/DateLabel'
import styles from './TemperatureSeriesChart.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TEXT = bilingual(
  {
    depth: 'Mélység',
    deep: (d: string) => `${d} mélyen`,
    control: 'Kontroll',
    spaded: 'Ásógépezett',
    warmer: 'ásógépes talaj melegebb',
    cooler: 'hűvösebb (°C)',
    aria: (d: string, when: string, c: string, s: string) => `${d}, ${when}: kontroll ${c} °C, ásógépezett ${s} °C`,
  },
  {
    depth: 'Depth',
    deep: (d: string) => `${d} deep`,
    control: 'Control',
    spaded: 'Spaded',
    warmer: 'spaded soil warmer',
    cooler: 'cooler (°C)',
    aria: (d: string, when: string, c: string, s: string) => `${d}, ${when}: control ${c} °C, spaded ${s} °C`,
  },
)

type Temperature = Season['temperature']

/** Splits "text [[strong]] text" into text and <strong> parts. */
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/\[\[|\]\]/).map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}

/**
 * Soil temperature over several measurement days, in the bar style of the 2025 chart.
 * Each depth is its own framed band; in it every day is a kontroll + ásógép bar pair with the
 * difference beside the ásógép bar (level with its top) and the date under the pair.
 * Warmer is orange, cooler is sage (never blue).
 */
export default function TemperatureSeriesChart({ data }: { data: Temperature }) {
  const locale = useLocale()
  const t = TEXT[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  // one scale for both depths
  const max = Math.max(...data.depths.flatMap((d) => d.points.flatMap((p) => [p.control, p.spade]))) * 1.08
  // Phones/tablets: one depth at a time behind a 3 cm | 10 cm picker; the card was two screens long
  // (mobile UX review 11-09, K4). Desktop shows both bands, the picker is hidden.
  const [shown, setShown] = useState(0)
  const multi = data.depths.length > 1

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <Thermometer className={styles.titleIcon} size={20} aria-hidden="true" />
          <h4 className={styles.title}>{data.title}</h4>
        </div>

        {multi && (
          <div className={styles.depthPicker} role="group" aria-label={t.depth}>
            <span className={styles.depthPickerLabel} aria-hidden="true">{t.depth}</span>
            {data.depths.map((depth, di) => (
              <button
                key={depth.label}
                type="button"
                className={`${styles.depthOption} ${di === shown ? styles.depthOptionOn : ''}`}
                aria-pressed={di === shown}
                onClick={() => setShown(di)}
              >
                {depth.label}
              </button>
            ))}
          </div>
        )}

        {data.depths.map((depth, di) => (
          <section
            key={depth.label}
            className={styles.band}
            aria-label={t.deep(depth.label)}
            data-off={multi && di !== shown ? '' : undefined}
          >
            <span className={styles.depthLabel}>{t.deep(depth.label)}</span>
            <div className={styles.days}>
              {depth.points.map((p, pi) => {
                const d = Math.round((p.spade - p.control) * 10) / 10
                const tone = d > 0.05 ? styles.warm : d < -0.05 ? styles.cool : styles.even
                const sign = d > 0.05 ? '+' : d < -0.05 ? '−' : '±'
                const delay = di * 0.2 + pi * 0.08
                return (
                  <div
                    key={pi}
                    className={styles.day}
                    role="group"
                    aria-label={t.aria(depth.label, dateText(p.when, locale), formatCm(p.control, locale), formatCm(p.spade, locale))}
                  >
                    <div className={styles.plot} aria-hidden="true">
                      {(['control', 'spade'] as const).map((k, ki) => (
                        <div key={k} className={styles.track}>
                          <motion.div
                            className={`${styles.bar} ${k === 'spade' ? styles.barSpade : styles.barControl}`}
                            style={{ height: `${(p[k] / max) * 100}%` }}
                            initial={{ scaleY: 0 }}
                            animate={isInView ? { scaleY: 1 } : {}}
                            transition={{ duration: 0.8, delay: delay + ki * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <span className={styles.barValue}>{formatCm(p[k], locale)}</span>
                          </motion.div>
                        </div>
                      ))}
                      {/* the difference, beside the ásógép bar and level with its top */}
                      <span className={styles.deltaSlot} style={{ height: `${(p.spade / max) * 100}%` }}>
                        <motion.span
                          className={`${styles.delta} ${tone}`}
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : {}}
                          transition={{ duration: 0.4, delay: delay + 0.5 }}
                        >
                          {sign}{formatCm(Math.abs(d), locale)}
                        </motion.span>
                      </span>
                    </div>
                    <span className={styles.date} aria-hidden="true"><DateLabel date={p.when} /></span>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        <ul className={styles.legend}>
          <li><span className={`${styles.swatch} ${styles.barControl}`} />{t.control}</li>
          <li><span className={`${styles.swatch} ${styles.barSpade}`} />{t.spaded}</li>
          <li><span className={`${styles.deltaKey} ${styles.warm}`}>+</span>{t.warmer}</li>
          <li><span className={`${styles.deltaKey} ${styles.cool}`}>−</span>{t.cooler}</li>
        </ul>
      </div>

      <div className={styles.explanation}>
        <p><Emphasis text={data.explanation} /></p>
      </div>
    </div>
  )
}
