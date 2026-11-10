'use client'

import { motion } from 'framer-motion'
import { locations } from '@/lib/data'
import { szentkiralySeasons, szentkiralyTomato, findSeason, type Treatment } from '@/lib/seasons'
import { szentkiralyOnionField, szentkiralyTomatoField } from '@/lib/field-maps'
import { useSeason } from '../season/SeasonContext'
import SiteYearSwitch from '../season/SiteYearSwitch'
import FieldMapCard from '../fieldmap/FieldMapCard'
import SiteInfoLayout, { siteFacts } from '../fieldmap/SiteInfoLayout'
import styles from './SzentkirályInfoPage.module.css'

const data = locations.szentkiraly
const site = szentkiralySeasons
// both fields on one map: the last view is fitted to them (≈ 2.3 km apart, scale ~500 m)
const FIELDS = [szentkiralyOnionField, szentkiralyTomatoField]
const TOMATO_YEARS = szentkiralyTomato.seasons.map((s) => s.year)
/** Between the centres of the two fields, measured on the surveyed corners */
const FIELD_DISTANCE = '2,3 km'

function TreatmentCard({ t }: { t: Treatment }) {
  const spade = t.role === 'spade'
  return (
    <div className={`${styles.treatment} ${spade ? styles.treatmentSpade : styles.treatmentControl} ${t.deep ? styles.treatmentDeep : ''}`}>
      <div className={styles.treatmentHeader}>
        <span className={styles.treatmentBadge}>{t.label}</span>
      </div>
      <ul className={styles.treatmentList}>
        {t.steps.map((step, i) => (
          <li key={i}>
            {/ásógép|mélylazítás/i.test(step) ? <strong>{step}</strong> : step}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SzentkirályInfoPage() {
  const { year } = useSeason()
  const season = findSeason(site, year) ?? site.seasons[site.seasons.length - 1]
  const info = season.info
  const control = season.treatments.find((t) => t.role === 'control' && !t.deep)
  const spade = season.treatments.find((t) => t.role === 'spade' && !t.deep)
  const twoWay = season.treatments.length === 2 && control && spade
  const tomato = szentkiralyTomato.seasons.find((s) => s.year === season.year)

  const facts = siteFacts(info)
  if (tomato) facts[1] = { ...facts[1], sub: `+ ipari paradicsom, külön táblán` }

  const lead = [
    twoWay
      ? 'Vöröshagyma alatt kontroll és ásógépes parcella egymás mellett, azonos körülmények között.'
      : `Vöröshagyma alatt ${season.treatments.length} kezelés egymás mellett, azonos körülmények között.`,
    tomato && `Mellette, ${FIELD_DISTANCE}-re, egy ipari paradicsomos tábla: ${tomato.treatments.map((t) => t.short.toLowerCase()).join(' és ')}.`,
  ].filter(Boolean).join(' ')

  return (
    <SiteInfoLayout
      badge="01. helyszín"
      season={<SiteYearSwitch site="szentkiraly" small />}
      title={data.name}
      lead={lead}
      facts={facts}
      factsKey={season.year}
      map={
        <FieldMapCard
          site="szentkiraly"
          title="Szentkirály · két kísérleti tábla"
          fields={FIELDS}
          inactive={TOMATO_YEARS.includes(season.year) ? [] : [szentkiralyTomatoField.id]}
        />
      }
    >
      {/* Treatments: kontroll vs ásógép (two), or a shared base plus every treatment (more) */}
      <motion.div
        key={`treat-${season.year}`}
        className={twoWay ? styles.treatmentComparison : styles.treatmentMulti}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className={styles.treatmentMainHeader}>MŰVELÉSI LÉPÉSEK · VÖRÖSHAGYMA</h3>

        {twoWay ? (
          <>
            <TreatmentCard t={control} />
            <div className={styles.treatmentVs}>
              <span>VS</span>
            </div>
            <TreatmentCard t={spade} />
          </>
        ) : (
          <>
            {info.base && (
              <div className={styles.treatmentBase}>
                <span className={styles.treatmentBaseLabel}>Közös alap</span>
                <span className={styles.treatmentBaseText}>{info.base}</span>
                {info.treatmentNote && <span className={styles.treatmentBaseNote}>{info.treatmentNote}</span>}
              </div>
            )}
            {season.treatments.map((t) => <TreatmentCard key={t.id} t={t} />)}
          </>
        )}
      </motion.div>
    </SiteInfoLayout>
  )
}
