'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from '@/components/results/Results.module.css'

const findings = [
  {
    number: '01',
    title: 'Tartósabb lazaság',
    description: 'Az ásógépezett parcellák <strong>5-10 cm-rel mélyebben</strong> maradtak lazák a teljes tenyészidőszak alatt, még 400-450 mm öntözővíz kijuttatása után is.'
  },
  {
    number: '02',
    title: 'Gyorsabb felmelegedés',
    description: 'A tavaszi mérések során az ásógépezett talaj <strong>2-4°C-kal melegebb</strong> volt — a 2025-ös hideg tavasz miatt ez különösen fontos volt.'
  },
  {
    number: '03',
    title: 'Jobb vízgazdálkodás',
    description: 'Az ásógépezett parcellákban a víz <strong>egyenletesebben oszlott el</strong> a talajszelvényben, mélyebb rétegekbe is lejutott.'
  },
  {
    number: '04',
    title: 'Látható növényfejlődés',
    description: 'A paradicsom és hagyma állományok <strong>szemmel láthatóan fejlettebbek</strong> voltak az ásógépezett területeken.'
  }
]

export default function EredmenyekPage() {
  return (
    <section className={`section ${styles.sectionResults}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="04" title="Eredmények" light />
        </motion.div>

        <div className={styles.keyFindings}>
          {findings.map((finding, index) => (
            <motion.div
              key={finding.number}
              className={styles.finding}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <div className={styles.findingNumber}>{finding.number}</div>
              <div className={styles.findingContent}>
                <h3>{finding.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: finding.description }} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.comparisonVisual}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className={styles.comparisonImages}>
            <div className={styles.comparisonSide}>
              <div className={styles.comparisonPlaceholder}>
                <span>Hagyományos művelés</span>
              </div>
              <span className={styles.comparisonLabel}>Kontroll parcella</span>
            </div>
            <div className={styles.comparisonDivider}>
              <span>VS</span>
            </div>
            <div className={styles.comparisonSide}>
              <div className={`${styles.comparisonPlaceholder} ${styles.comparisonPlaceholderHighlight}`}>
                <span>Ásógépes művelés</span>
              </div>
              <span className={styles.comparisonLabel}>Ásógépezett parcella</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.conclusion}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <blockquote className={styles.conclusionQuote}>
            „A mélyásógép és a szántás+ásógép kombináció adta a legstabilabb, legegyenletesebb eredményt a teljes tenyészidőszak alatt."
          </blockquote>
          <p className={styles.conclusionText}>
            A kutatás igazolta: az ásógépes talajművelés hatékonyan csökkenti a tömörödést, javítja a vízgazdálkodást, és elősegíti a növények fejlődését. Különösen ajánlott <strong>igényes kertészeti kultúrákhoz</strong> és <strong>öntözéses gazdálkodáshoz</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
