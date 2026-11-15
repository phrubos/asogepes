'use client'

import { motion } from 'framer-motion'
import { locations } from '@/lib/data'
import { szentkiralySeasons, szentkiralyTomato as TOMATO, findSeason, type Treatment } from '@/lib/seasons'
import { szentkiralyOnionField, szentkiralyTomatoField } from '@/lib/field-maps'
import { useSeason } from '../season/SeasonContext'
import SiteYearSwitch from '../season/SiteYearSwitch'
import FieldMapCard from '../fieldmap/FieldMapCard'
import SiteInfoLayout, { siteFacts } from '../fieldmap/SiteInfoLayout'
import styles from './SzentkirályInfoPage.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'
import { researchData } from '@/lib/i18n/useResearchData'

const TEXT = bilingual(
  {
    distance: '2,3 km',
    tomatoSub: '+ ipari paradicsom, külön táblán',
    twoWay: 'Vöröshagyma alatt kontroll és ásógépes parcella egymás mellett, azonos körülmények között.',
    many: (n: number) => `Vöröshagyma alatt ${n} kezelés egymás mellett, azonos körülmények között.`,
    beside: (d: string, list: string[]) => `Mellette, ${d}-re, egy ipari paradicsomos tábla: ${list.join(' és ')}.`,
    badge: '01. helyszín',
    mapTitle: 'Szentkirály · két kísérleti tábla',
    steps: 'MŰVELÉSI LÉPÉSEK · VÖRÖSHAGYMA',
    base: 'Közös alap',
  },
  {
    distance: '2.3 km',
    tomatoSub: '+ processing tomato, on a separate field',
    twoWay: 'Under onion, a control and a spaded plot side by side, under the same conditions.',
    many: (n: number) => `Under onion, ${n} treatments side by side, under the same conditions.`,
    beside: (d: string, list: string[]) => `Next to it, ${d} away, a processing tomato field: ${list.join(' and ')}.`,
    badge: 'Site 01',
    mapTitle: 'Szentkirály · two trial fields',
    steps: 'TILLAGE STEPS · ONION',
    base: 'Common base',
  },
)

const data = locations.szentkiraly
const SITE = szentkiralySeasons
// both fields on one map: the last view is fitted to them (≈ 2.3 km apart, scale ~500 m)
const FIELDS = [szentkiralyOnionField, szentkiralyTomatoField]
const TOMATO_YEARS = TOMATO.seasons.map((s) => s.year)

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
            {/ásógép|mélylazítás|spading|subsoil/i.test(step) ? <strong>{step}</strong> : step}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SzentkirályInfoPage() {
  const { year } = useSeason()
  const locale = useLocale()
  const t = TEXT[locale]
  const site = researchData(SITE, locale)
  const szentkiralyTomato = researchData(TOMATO, locale)
  const season = findSeason(site, year) ?? site.seasons[site.seasons.length - 1]
  const info = season.info
  const control = season.treatments.find((t) => t.role === 'control' && !t.deep)
  const spade = season.treatments.find((t) => t.role === 'spade' && !t.deep)
  const twoWay = season.treatments.length === 2 && control && spade
  const tomato = szentkiralyTomato.seasons.find((s) => s.year === season.year)

  const facts = siteFacts(info, undefined, locale)
  if (tomato) facts[1] = { ...facts[1], sub: t.tomatoSub }

  const lead = [
    twoWay ? t.twoWay : t.many(season.treatments.length),
    // distance between the centres of the two fields, measured on the surveyed corners
    tomato && t.beside(t.distance, tomato.treatments.map((tr) => (locale === 'en' ? tr.label.replace(/^Control \((.*)\)$/, '$1') : tr.short).toLowerCase())),
  ].filter(Boolean).join(' ')

  return (
    <SiteInfoLayout
      badge={t.badge}
      season={<SiteYearSwitch site="szentkiraly" small />}
      title={data.name}
      lead={lead}
      facts={facts}
      factsKey={season.year}
      map={
        <FieldMapCard
          site="szentkiraly"
          title={t.mapTitle}
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
        <h3 className={styles.treatmentMainHeader}>{t.steps}</h3>

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
                <span className={styles.treatmentBaseLabel}>{t.base}</span>
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
