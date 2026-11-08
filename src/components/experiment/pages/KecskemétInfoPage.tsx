'use client'

import { motion } from 'framer-motion'
import { locations } from '@/lib/data'
import { kecskemetBorbasField } from '@/lib/field-maps'
import SeasonOnly from '../season/SeasonOnly'
import FieldMapCard from '../fieldmap/FieldMapCard'
import SiteInfoLayout, { siteFacts } from '../fieldmap/SiteInfoLayout'
import styles from './KecskemétInfoPage.module.css'

const data = locations.kecskemet
const FIELDS = [kecskemetBorbasField]
const facts = siteFacts(data)

export default function KecskemétInfoPage() {
  return (
    <SiteInfoLayout
      badge="02. helyszín"
      season={<SeasonOnly years={[2025]} />}
      title={data.name}
      lead="Ipari paradicsom alatt kontroll és ásógépes parcella egymás mellett, azonos körülmények között."
      facts={facts}
      factsKey={2025}
      map={<FieldMapCard site="kecskemetBorbas" title="Kecskemét-Borbás · kísérleti tábla" fields={FIELDS} />}
    >
      <motion.div
        className={styles.treatmentComparison}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className={styles.treatmentMainHeader}>MŰVELÉSI LÉPÉSEK</h3>

        <div className={`${styles.treatment} ${styles.treatmentControl}`}>
          <div className={styles.treatmentHeader}>
            <span className={styles.treatmentBadge}>Kontroll</span>
          </div>
          <ul className={styles.treatmentList}>
            {data.control?.treatments.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className={styles.treatmentVs}>
          <span>VS</span>
        </div>

        <div className={`${styles.treatment} ${styles.treatmentSpade}`}>
          <div className={styles.treatmentHeader}>
            <span className={styles.treatmentBadge}>Ásógépezett</span>
          </div>
          <ul className={styles.treatmentList}>
            {data.spade?.treatments.map((t, i) => (
              <li key={i}>
                {/ásógép/i.test(t) ? <strong>{t}</strong> : t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </SiteInfoLayout>
  )
}
