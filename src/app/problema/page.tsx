'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import SoilInfographic from '@/components/problem/SoilInfographic'
import ConsequenceCard from '@/components/problem/ConsequenceCard'
import { consequences } from '@/lib/data'
import styles from '@/components/problem/Problem.module.css'

export default function ProblemaPage() {
  return (
    <section className={`section ${styles.sectionProblem}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="01" title="A Probléma" />
        </motion.div>

        <div className={styles.problemGrid}>
          <motion.div
            className={styles.problemMain}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <blockquote className={styles.problemQuote}>
              „A talajdegradáció országos probléma, amelynek fő kiváltó okait a helytelen talajművelési eljárások adják."
            </blockquote>
            <p className={styles.problemText}>
              A hagyományos szántás évszázadok óta a mezőgazdaság alapja. De tudjuk-e, milyen hatással van a talajunkra? A folyamatos forgatás <strong>megöli a talaj biológiai életét</strong>, oxidálja a széntartalmat, és tömör réteget — úgynevezett <strong>eketalpat</strong> — képez.
            </p>
          </motion.div>

          <motion.div
            className={styles.problemVisual}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SoilInfographic />
          </motion.div>
        </div>

        <div className={styles.problemConsequences}>
          <h3 className={styles.consequencesTitle}>Következmények</h3>
          <div className={styles.consequencesGrid}>
            {consequences.map((consequence, index) => (
              <ConsequenceCard
                key={index}
                title={consequence.title}
                description={consequence.description}
                icon={consequence.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
