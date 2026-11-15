'use client'

import { motion } from 'framer-motion'
import { locations } from '@/lib/data'
import { kecskemetBorbasField } from '@/lib/field-maps'
import SeasonOnly from '../season/SeasonOnly'
import FieldMapCard from '../fieldmap/FieldMapCard'
import SiteInfoLayout, { siteFacts } from '../fieldmap/SiteInfoLayout'
import styles from './KecskemétInfoPage.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { useResearchData } from '@/lib/i18n/useResearchData'

const FIELDS = [kecskemetBorbasField]

export default function KecskemétInfoPage() {
  const locale = useLocale()
  const en = locale === 'en'
  const data = useResearchData(locations).kecskemet
  const facts = siteFacts(data, undefined, locale)
  return (
    <SiteInfoLayout
      badge={en ? 'Site 02' : '02. helyszín'}
      season={<SeasonOnly years={[2025]} />}
      title={data.name}
      lead={en ? 'Under processing tomato, a control and a spaded plot side by side, under the same conditions.' : 'Ipari paradicsom alatt kontroll és ásógépes parcella egymás mellett, azonos körülmények között.'}
      facts={facts}
      factsKey={2025}
      map={<FieldMapCard site="kecskemetBorbas" title={en ? 'Kecskemét-Borbás · trial field' : 'Kecskemét-Borbás · kísérleti tábla'} fields={FIELDS} />}
    >
      <motion.div
        className={styles.treatmentComparison}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className={styles.treatmentMainHeader}>{en ? 'TILLAGE STEPS' : 'MŰVELÉSI LÉPÉSEK'}</h3>

        <div className={`${styles.treatment} ${styles.treatmentControl}`}>
          <div className={styles.treatmentHeader}>
            <span className={styles.treatmentBadge}>{en ? 'Control' : 'Kontroll'}</span>
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
            <span className={styles.treatmentBadge}>{en ? 'Spaded' : 'Ásógépezett'}</span>
          </div>
          <ul className={styles.treatmentList}>
            {data.spade?.treatments.map((t, i) => (
              <li key={i}>
                {/ásógép|spading/i.test(t) ? <strong>{t}</strong> : t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </SiteInfoLayout>
  )
}
