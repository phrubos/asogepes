import type { KeyFact } from '@/lib/seasons'
import { dateText } from './DateLabel'
import styles from './KeyFacts.module.css'

/** "További mérések": one row per measurement, kontroll → ásógép, in the Évek strip's style. */
export default function KeyFacts({ facts, title = 'További mérések' }: { facts: KeyFact[]; title?: string }) {
  return (
    <div className={styles.facts}>
      <span className={styles.heading}>{title}</span>
      <dl className={styles.list}>
        {facts.map((f) => (
          <div key={f.label} className={styles.row}>
            <dt className={styles.label}>
              {f.label}
              <span className={styles.when}>{dateText(f.when)}</span>
            </dt>
            <dd className={styles.values}>
              <span className={styles.control}>{f.control}</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
              <span className={styles.spade}>{f.spade}</span>
              <span className={styles.unit}>{f.unit}</span>
            </dd>
            {f.note && <dd className={styles.note}>{f.note}</dd>}
          </div>
        ))}
      </dl>
      <span className={styles.legend}>Kontroll → ásógép</span>
    </div>
  )
}
