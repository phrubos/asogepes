'use client'

import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { MEASURED_PROPERTIES, POINTS_2026 } from '@/lib/methodology'
import { RESEARCH_YEARS } from '@/lib/seasons'
import styles from './SzentkirályTimelinePage.module.css'
import own from './MethodologyBlocks.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { useResearchData } from '@/lib/i18n/useResearchData'

/** Módszertan: what is recorded at a measuring point, and in which seasons */
export default function MeasuredPropertiesPage() {
  const en = useLocale() === 'en'
  const props = useResearchData(MEASURED_PROPERTIES)
  const points = useResearchData(POINTS_2026)
  return (
    <div className={`${styles.timelinePage} ${own.page}`}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.headerBadge}>
          <ClipboardList size={12} />
          <span>{en ? 'Methodology' : 'Módszertan'}</span>
        </div>
        <h3 className={styles.headerTitle}>{en ? 'What we measure in the fields' : 'Mit mérünk a táblákon'}</h3>
        <p className={own.lead}>
          {en
            ? 'The measuring points are fixed by GPS coordinates, so we measure in the same place on every measuring day. In 2026 several new properties were added to soil compaction and temperature.'
            : 'A mérési pontok GPS-koordinátával vannak kijelölve, így minden mérésnapon ugyanott mérünk. 2026-ban a talaj tömörödöttsége és hőmérséklete mellé több új jellemző került.'}
        </p>
      </motion.div>

      <ul className={own.grid} aria-label={en ? 'Measured properties' : 'Mért jellemzők'}>
        {props.map((p) => (
          <li key={p.name} className={own.card}>
            <div className={own.cardTop}>
              <span className={own.cardName}>{p.name}</span>
              <span className={own.years}>
                {RESEARCH_YEARS.map((y) => {
                  const on = p.years.includes(y)
                  return (
                    <span key={y} className={on ? own.yearOn : own.yearOff} title={on ? `${y}: ${en ? 'measured' : 'mértük'}` : `${y}: ${en ? 'not measured' : 'nem mértük'}`}>
                      {String(y).slice(2)}
                    </span>
                  )
                })}
              </span>
            </div>
            <span className={own.cardWhat}>{p.what}</span>
            <span className={own.cardMeta}>
              <span className={own.unit}>{p.unit}</span> · {p.how}
            </span>
          </li>
        ))}
      </ul>

      <div className={own.fields}>
        <span className={own.fieldsLabel}>{en ? 'In 2026' : '2026-ban'}</span>
        <ul className={own.fieldList}>
          {points.map((f) => (
            <li key={f.field}>
              <strong>{f.field}:</strong> {f.points}, {f.days} {en ? 'measuring days' : 'mérésnap'} ({f.span})
            </li>
          ))}
        </ul>
        <span className={own.legend}>
          <span><i className={own.keyOn} />{en ? 'season measured' : 'mért évad'}</span>
          <span><i className={own.keyOff} />{en ? 'not measured' : 'nem mért'}</span>
        </span>
      </div>
    </div>
  )
}
