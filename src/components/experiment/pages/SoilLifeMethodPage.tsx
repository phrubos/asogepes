'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Microscope } from 'lucide-react'
import { MICROBIOMETER_EXAMPLE as EX, MICROBIOMETER_ROUNDS } from '@/lib/methodology'
import { lakitelekSoilLife } from '@/lib/seasons'
import styles from './SzentkirályTimelinePage.module.css'
import own from './MethodologyBlocks.module.css'

const hu = (v: number, d = 0) => v.toFixed(d).replace('.', ',')

/** Módszertan: how soil life is measured (MicroBIOMETER), with one worked example */
export default function SoilLifeMethodPage() {
  const splitRef = useRef<HTMLDivElement>(null)
  const seen = useInView(splitRef, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  return (
    <div className={`${styles.timelinePage} ${own.page}`}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.headerBadge}>
          <Microscope size={12} />
          <span>Módszertan</span>
        </div>
        <h3 className={styles.headerTitle}>A talajélet mérése</h3>
      </motion.div>

      <div className={own.split}>
        <div className={own.text}>
          <p className={own.body}>
            A MicroBIOMETER gyorsteszt a talajmintában élő mikroorganizmusok széntartalmát méri, mikrogramm szén per
            gramm talaj (µgC/g) egységben, és megmutatja, mennyi ebből a gomba és mennyi a baktérium. Parcellánként,
            táblánként 3 párhuzamos mintát mérünk, és ezek átlagát közöljük.
          </p>
          <p className={own.body}>Több élő szén = élénkebb talajélet.</p>

          <div className={own.rounds}>
            <span className={own.fieldsLabel}>Mintavételek</span>
            <ol className={own.roundList}>
              {MICROBIOMETER_ROUNDS.map((r) => (
                <li key={r.when}>
                  <span className={own.roundWhen}>{r.when}</span>
                  <span>{r.where}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <figure className={own.example}>
          <span className={own.exampleTag}>Példa</span>
          <span className={own.exampleValue}>
            {hu(EX.carbon)} <small>{lakitelekSoilLife.unit}</small>
          </span>
          <span className={own.exampleWhat}>élő mikrobiális szén</span>
          {/* the gold fungi share grows from the left once in view, like the bars of the charts; the labels follow */}
          <div ref={splitRef} className={own.split2} role="img" aria-label={`Gomba ${hu(EX.fungi)} %, baktérium ${hu(EX.bacteria)} %`}>
            <span className={own.fungi} style={{ flexBasis: `${EX.fungi}%` }}>
              <motion.span
                className={own.fungiFill}
                initial={reduced ? false : { scaleX: 0 }}
                animate={seen || reduced ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span className={own.splitLabel} initial={reduced ? false : { opacity: 0 }} animate={seen || reduced ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
                Gomba {Math.round(EX.fungi)} %
              </motion.span>
            </span>
            <span className={own.bacteria} style={{ flexBasis: `${EX.bacteria}%` }}>
              <motion.span className={own.splitLabel} initial={reduced ? false : { opacity: 0 }} animate={seen || reduced ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
                Baktérium {Math.round(EX.bacteria)} %
              </motion.span>
            </span>
          </div>
          <figcaption className={own.exampleCaption}>
            {EX.place}, {EX.when}, a {EX.parcels} parcella átlaga
          </figcaption>
          <p className={own.note}>{lakitelekSoilLife.note}</p>
        </figure>
      </div>
    </div>
  )
}
