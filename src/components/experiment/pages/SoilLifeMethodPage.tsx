'use client'

import { motion } from 'framer-motion'
import { Microscope } from 'lucide-react'
import { MICROBIOMETER_EXAMPLE as EX, MICROBIOMETER_ROUNDS } from '@/lib/methodology'
import { lakitelekSoilLife } from '@/lib/seasons'
import styles from './SzentkirályTimelinePage.module.css'
import own from './MethodologyBlocks.module.css'

const hu = (v: number, d = 0) => v.toFixed(d).replace('.', ',')

/** Módszertan: how soil life is measured (MicroBIOMETER), with one worked example */
export default function SoilLifeMethodPage() {
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
          <div className={own.split2} role="img" aria-label={`Gomba ${hu(EX.fungi)} %, baktérium ${hu(EX.bacteria)} %`}>
            <span className={own.fungi} style={{ flexBasis: `${EX.fungi}%` }}>Gomba {Math.round(EX.fungi)} %</span>
            <span className={own.bacteria} style={{ flexBasis: `${EX.bacteria}%` }}>Baktérium {Math.round(EX.bacteria)} %</span>
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
