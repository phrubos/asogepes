'use client'

import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { MEASURED_PROPERTIES, POINTS_2026 } from '@/lib/methodology'
import { RESEARCH_YEARS } from '@/lib/seasons'
import styles from './SzentkirályTimelinePage.module.css'
import own from './MethodologyBlocks.module.css'

/** Módszertan: what is recorded at a measuring point, and in which seasons */
export default function MeasuredPropertiesPage() {
  return (
    <div className={`${styles.timelinePage} ${own.page}`}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.headerBadge}>
          <ClipboardList size={12} />
          <span>Módszertan</span>
        </div>
        <h3 className={styles.headerTitle}>Mit mérünk a táblákon</h3>
        <p className={own.lead}>
          A mérési pontok GPS-koordinátával vannak kijelölve, így minden mérésnapon ugyanott mérünk. 2026-ban a talaj
          tömörödöttsége és hőmérséklete mellé több új jellemző került.
        </p>
      </motion.div>

      <ul className={own.grid} aria-label="Mért jellemzők">
        {MEASURED_PROPERTIES.map((p) => (
          <li key={p.name} className={own.card}>
            <div className={own.cardTop}>
              <span className={own.cardName}>{p.name}</span>
              <span className={own.years}>
                {RESEARCH_YEARS.map((y) => {
                  const on = p.years.includes(y)
                  return (
                    <span key={y} className={on ? own.yearOn : own.yearOff} title={on ? `${y}: mértük` : `${y}: nem mértük`}>
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
        <span className={own.fieldsLabel}>2026-ban</span>
        <ul className={own.fieldList}>
          {POINTS_2026.map((f) => (
            <li key={f.field}>
              <strong>{f.field}:</strong> {f.points}, {f.days} mérésnap ({f.span})
            </li>
          ))}
        </ul>
        <span className={own.legend}>
          <span><i className={own.keyOn} />mért évad</span>
          <span><i className={own.keyOff} />nem mért</span>
        </span>
      </div>
    </div>
  )
}
