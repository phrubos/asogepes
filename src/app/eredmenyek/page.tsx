'use client'

import { motion } from 'framer-motion'
import { Check, X, Droplets, Thermometer, Layers, Sprout, Target, Lightbulb } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { treatmentComparison } from '@/lib/data'
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

        {/* Összehasonlító táblázat */}
        <motion.div
          className={styles.comparisonTable}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className={styles.tableTitle}>Művelési Módszerek Összehasonlítása</h3>
          <p className={styles.tableSubtitle}>Lakitelek kísérlet eredményei alapján (450 mm öntözés után)</p>
          
          <div className={styles.tableContainer}>
            <div className={`${styles.tableRow} ${styles.tableHeader}`}>
              <span>Kezelés</span>
              <span>Kezdeti</span>
              <span>Végső</span>
              <span>Változás</span>
              <span>Stabil?</span>
            </div>
            {treatmentComparison.map((row, index) => (
              <motion.div
                key={index}
                className={`${styles.tableRow} ${row.stable ? styles.rowStable : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <span className={styles.treatmentName}>{row.treatment}</span>
                <span>{row.initial} cm</span>
                <span>{row.final} cm</span>
                <span className={row.stable ? styles.changeGood : styles.changeBad}>
                  {row.change > 0 ? '+' : ''}{row.change} cm
                </span>
                <span className={styles.stableIcon}>
                  {row.stable ? <Check size={18} className={styles.iconGood} /> : <X size={18} className={styles.iconBad} />}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statisztikák */}
        <motion.div
          className={styles.statsGrid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className={styles.statCard}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>Helyszín</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>7</span>
            <span className={styles.statLabel}>Kezelés</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>4</span>
            <span className={styles.statLabel}>Hónap</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>450</span>
            <span className={styles.statLabel}>mm öntözés</span>
          </div>
        </motion.div>

        {/* Ajánlások */}
        <motion.div
          className={styles.recommendations}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className={styles.recTitle}>
            <Lightbulb size={24} />
            Mikor Ajánlott az Ásógép?
          </h3>
          <div className={styles.recGrid}>
            <div className={styles.recCard}>
              <div className={styles.recIcon}><Droplets size={24} /></div>
              <h4>Öntözéses kultúrák</h4>
              <p>Paradicsom, hagyma, paprika — ahol gyakori öntözés tömöríti a talajt</p>
            </div>
            <div className={styles.recCard}>
              <div className={styles.recIcon}><Layers size={24} /></div>
              <h4>Eketalp problémák</h4>
              <p>Ahol a szántás tömör réteget hozott létre 25-30 cm mélyen</p>
            </div>
            <div className={styles.recCard}>
              <div className={styles.recIcon}><Thermometer size={24} /></div>
              <h4>Hideg tavaszon</h4>
              <p>Gyorsabb felmelegedés = korábbi ültetés, jobb kelés</p>
            </div>
            <div className={styles.recCard}>
              <div className={styles.recIcon}><Sprout size={24} /></div>
              <h4>Igényes növények</h4>
              <p>Mély gyökérzetű, talajigényes kertészeti kultúrák</p>
            </div>
          </div>
        </motion.div>

        {/* Végső következtetés */}
        <motion.div
          className={styles.conclusion}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <blockquote className={styles.conclusionQuote}>
            „A mélyásógép és a szántás+ásógép kombináció adta a legstabilabb, legegyenletesebb eredményt a teljes tenyészidőszak alatt.”
          </blockquote>
          <p className={styles.conclusionText}>
            A kutatás igazolta: az ásógépes talajművelés hatékonyan csökkenti a tömörödést, javítja a vízgazdálkodást, és elősegíti a növények fejlődését. Különösen ajánlott <strong>igényes kertészeti kultúrákhoz</strong> és <strong>öntözéses gazdálkodáshoz</strong>.
          </p>
          <div className={styles.finalBadge}>
            <Target size={20} />
            <span>Neumann János Egyetem × Agroskill Kft. — 2025</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
