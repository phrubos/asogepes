// ModelSection.tsx - Redesign Layout
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Wrench,
  Ruler,
  Gauge,
  CheckCircle2,
  ZoomIn,
  ArrowRight,
  MapPin
} from 'lucide-react'
import { modelDetails } from '@/lib/data'
import { lakitelekSeasons } from '@/lib/seasons'
import ImageLightbox from '@/components/ui/ImageLightbox'
import styles from './ModelSection.module.css'

type ModelId = '38sx' | '38wx' | '40sx'

interface ModelSectionProps {
  modelId: ModelId
}

const loose = (a: number, b: number) => `a laza réteg ${a} → ${b} cm (május → augusztus)`
const sz = modelDetails['38wx'].fieldApplication
const kec = modelDetails['40sx'].fieldApplication.locations[0]
const kecChart = kec.chartData ?? [{ month: '', spade: 0, control: 0 }]
const lakI = modelDetails['40sx'].fieldApplication.locations[1]
const lastOf = <T,>(xs: T[]) => xs[xs.length - 1]

/** 2025 results per model, from data.ts; each links to its block on the research page */
const RESULTS: Record<ModelId, { place: string; section: string; fact: string }[]> = {
  '38sx': modelDetails['38sx'].fieldApplication.treatments.map((t) => ({
    place: `Lakitelek, ${t.parcel} parcella`,
    section: 'lakitelek-chart',
    fact: `${t.description}: ${loose(t.initial, t.final)}`,
  })),
  '38wx': [
    {
      place: 'Szentkirály, vöröshagyma',
      section: 'szentkiraly-timeline',
      fact: `${lastOf(sz.chartData).month}ban ${lastOf(sz.chartData).spade} cm laza réteg, a kontrollon ${lastOf(sz.chartData).control} cm`,
    },
  ],
  '40sx': [
    {
      place: `${kec.name}, ipari paradicsom`,
      section: 'kecskemet-timeline',
      fact: `${lastOf(kecChart).month}ban ${lastOf(kecChart).spade} cm laza réteg, a kontrollon ${lastOf(kecChart).control} cm`,
    },
    {
      place: lakI.name,
      section: 'lakitelek-chart',
      fact: `${lakI.treatment}: ${loose(lakI.initial ?? 0, lakI.final ?? 0)}`,
    },
  ],
}

/** What the 2025 figures compare to: a falling "22 → 20 cm" alone reads as a loss (mobile UX review 11-09, K7).
 *  Lakitelek: the parcel without a spading machine (szántás + kombinátor, V.), same months, from seasons.ts. */
const lk2025 = lakitelekSeasons.seasons.find((s) => s.year === 2025)
const lkPlain = lk2025?.parcels.find((p) => p.num === 'V.')
const lkLast = (lk2025?.chartLabels.length ?? 1) - 1
const plainNote = lkPlain?.values
  ? `Összehasonlításul az ásógép nélküli szántás + kombinátor (V.) parcellán ${lkPlain.values[0]} → ${lkPlain.values[lkLast]} cm: ott jóval többet tömörödött vissza a talaj.`
  : undefined
const RESULT_NOTE: Partial<Record<ModelId, string>> = {
  '38sx': plainNote,
}

/** Where the work went on in 2026 (Kecskemét-Borbás was not measured again) */
const NEXT_SEASON: Record<ModelId, string> = {
  '38sx': '2026-ban ugyanezen a 7 lakiteleki parcellán folytatódtak a mérések, rozzsal.',
  '38wx': '2026-ban a szentkirályi hagymatáblán folytatódtak a mérések, és mellé új paradicsomtábla került.',
  '40sx': '2026-ban Lakiteleken (rozs, a mélyásógépes I. parcellán is) és Szentkirályon folytatódtak a mérések; Kecskemét-Borbáson nem mértünk.',
}
const NEXT_SECTION: Record<ModelId, string> = { '38sx': 'lakitelek-chart', '38wx': 'szentkiraly-timeline', '40sx': 'lakitelek-chart' }

export default function ModelSection({ modelId }: ModelSectionProps) {
  const model = modelDetails[modelId]
  const [lightboxOpen, setLightboxOpen] = useState(false)


  return (
    <section className={styles.compactSection}>
      {/* Header */}
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.titleRow}>
          <h2 className={styles.modelName}>{model.name}</h2>
          <span className={styles.typeBadge}>{model.type}</span>
        </div>
      </motion.div>

      <div className={styles.mainLayout}>
        {/* Top Row: Image (Left) + Specs (Right) */}
        <div className={styles.topRow}>

          {/* Image Card */}
          <motion.div
            className={styles.imageCard}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={model.image}
              alt={`${model.name} ${model.type}`}
              width={800}
              height={600}
              className={styles.machineImage}
              priority
            />
            <div className={styles.zoomIndicator}><ZoomIn size={18} /></div>
          </motion.div>

          {/* Specs Panel */}
          <motion.div
            className={styles.specsPanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.panelHeader}>
              <Wrench size={24} color="var(--color-gold)" /> Műszaki adatok
            </div>

            <div className={styles.specsBoxContainer}>
              {/* Depth */}
              <div className={styles.specRow}>
                <div className={styles.specIconBox}><Ruler size={24} /></div>
                <div className={styles.specContent}>
                  <span className={styles.specLabel}>Munkamélység</span>
                  <span className={styles.specValue}>{model.specs.depth}</span>
                </div>
              </div>

              {/* Power */}
              <div className={styles.specRow}>
                <div className={styles.specIconBox}><Gauge size={24} /></div>
                <div className={styles.specContent}>
                  <span className={styles.specLabel}>Teljesítményigény</span>
                  <span className={styles.specValue}>{model.specs.power}</span>
                </div>
              </div>
            </div>

            <div className={styles.featuresList}>
              <div className={styles.featuresTitle}>Főbb jellemzők</div>
              {model.specs.features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: what this model did in the field (2025), and where 2026 stands */}
        <motion.div
          className={styles.resultsCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.resultsInfo}>
            <div className={styles.resultsHeader}>
              <MapPin size={20} /> Kísérleti eredmények
            </div>
            <ul className={styles.resultList}>
              {RESULTS[modelId].map((r) => (
                <li key={r.place} className={styles.resultRow}>
                  <span className={styles.yearChip}>2025</span>
                  <span className={styles.resultText}>
                    <Link href={`/kutatas?section=${r.section}`} className={styles.resultPlace}>
                      {r.place}
                    </Link>
                    <span>{r.fact}</span>
                  </span>
                </li>
              ))}
            </ul>
            {RESULT_NOTE[modelId] && <p className={styles.resultNote}>{RESULT_NOTE[modelId]}</p>}
          </div>

          <div className={styles.nextSeason}>
            <div className={styles.resultsHeader}>
              <span className={styles.yearChipOff}>2026</span> A második év
            </div>
            <p className={styles.resultsDesc}>
              {NEXT_SEASON[modelId]}
            </p>
            <Link href={`/kutatas?section=${NEXT_SECTION[modelId]}`} className={styles.detailsLink}>
              A 2026-os mérések a Kutatás oldalon <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={model.image}
        alt={`${model.name} - ${model.type}`}
        images={[
          { src: '/images/38SX_new.jpeg', alt: '38SX Nagy szériás ásógép' },
          { src: '/images/38WX_new.jpeg', alt: '38WX Lazítókéses ásógép' },
          { src: '/images/40SX_new.jpeg', alt: '40SX Mélyásógép' }
        ]}
        initialIndex={modelId === '38sx' ? 0 : modelId === '38wx' ? 1 : 2}
      />
    </section>
  )
}
