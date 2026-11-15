'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Microscope } from 'lucide-react'
import { MICROBIOMETER_EXAMPLE as EX, MICROBIOMETER_ROUNDS } from '@/lib/methodology'
import { lakitelekSoilLife } from '@/lib/seasons'
import styles from './SzentkirályTimelinePage.module.css'
import own from './MethodologyBlocks.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { useResearchData } from '@/lib/i18n/useResearchData'

const hu = (v: number, d = 0) => v.toFixed(d).replace('.', ',')

/** Módszertan: how soil life is measured (MicroBIOMETER), with one worked example */
export default function SoilLifeMethodPage() {
  const splitRef = useRef<HTMLDivElement>(null)
  const seen = useInView(splitRef, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  const en = useLocale() === 'en'
  const ex = useResearchData(EX)
  const rounds = useResearchData(MICROBIOMETER_ROUNDS)
  const life = useResearchData(lakitelekSoilLife)
  const pct = (v: number, d = 0) => (en ? `${v.toFixed(d)}%` : `${hu(v, d)} %`)
  return (
    <div className={`${styles.timelinePage} ${own.page}`}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.headerBadge}>
          <Microscope size={12} />
          <span>{en ? 'Methodology' : 'Módszertan'}</span>
        </div>
        <h3 className={styles.headerTitle}>{en ? 'Measuring soil life' : 'A talajélet mérése'}</h3>
      </motion.div>

      <div className={own.split}>
        <div className={own.text}>
          <p className={own.body}>
            {en
              ? 'The MicroBIOMETER rapid test measures the carbon held in living microorganisms in a soil sample, in micrograms of carbon per gram of soil (µgC/g), and shows how much of it is fungal and how much bacterial. We measure 3 replicate samples per plot or field and report their mean.'
              : 'A MicroBIOMETER gyorsteszt a talajmintában élő mikroorganizmusok széntartalmát méri, mikrogramm szén per gramm talaj (µgC/g) egységben, és megmutatja, mennyi ebből a gomba és mennyi a baktérium. Parcellánként, táblánként 3 párhuzamos mintát mérünk, és ezek átlagát közöljük.'}
          </p>
          <p className={own.body}>{en ? 'More living carbon = livelier soil life.' : 'Több élő szén = élénkebb talajélet.'}</p>

          <div className={own.rounds}>
            <span className={own.fieldsLabel}>{en ? 'Sampling rounds' : 'Mintavételek'}</span>
            <ol className={own.roundList}>
              {rounds.map((r) => (
                <li key={r.when}>
                  <span className={own.roundWhen}>{r.when}</span>
                  <span>{r.where}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <figure className={own.example}>
          <span className={own.exampleTag}>{en ? 'Example' : 'Példa'}</span>
          <span className={own.exampleValue}>
            {en ? ex.carbon.toFixed(0) : hu(ex.carbon)} <small>{life.unit}</small>
          </span>
          <span className={own.exampleWhat}>{en ? 'microbial biomass carbon' : 'élő mikrobiális szén'}</span>
          {/* the gold fungi share grows from the left once in view, like the bars of the charts; the labels follow */}
          <div ref={splitRef} className={own.split2} role="img" aria-label={en ? `Fungi ${pct(ex.fungi)}, bacteria ${pct(ex.bacteria)}` : `Gomba ${hu(ex.fungi)} %, baktérium ${hu(ex.bacteria)} %`}>
            <span className={own.fungi} style={{ flexBasis: `${EX.fungi}%` }}>
              <motion.span
                className={own.fungiFill}
                initial={reduced ? false : { scaleX: 0 }}
                animate={seen || reduced ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span className={own.splitLabel} initial={reduced ? false : { opacity: 0 }} animate={seen || reduced ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
                {en ? 'Fungi' : 'Gomba'} {pct(Math.round(ex.fungi))}
              </motion.span>
            </span>
            <span className={own.bacteria} style={{ flexBasis: `${EX.bacteria}%` }}>
              <motion.span className={own.splitLabel} initial={reduced ? false : { opacity: 0 }} animate={seen || reduced ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
                {en ? 'Bacteria' : 'Baktérium'} {pct(Math.round(ex.bacteria))}
              </motion.span>
            </span>
          </div>
          <figcaption className={own.exampleCaption}>
            {ex.place}, {ex.when}, {en ? `mean of the ${ex.parcels} plots` : `a ${ex.parcels} parcella átlaga`}
          </figcaption>
          <p className={own.note}>{life.note}</p>
        </figure>
      </div>
    </div>
  )
}
