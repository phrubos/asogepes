'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  Leaf,
  Layers,
  Droplets,
  Calendar,
  Lightbulb
} from 'lucide-react'
import styles from './FieldDataModal.module.css'

type ModelId = '38sx' | '38wx' | '40sx'

interface FieldDataModalProps {
  isOpen: boolean
  onClose: () => void
  modelId: ModelId
}

// Field data for each model
const fieldData = {
  '38sx': {
    location: 'Lakitelek',
    model: '38SX Nagy szériás',
    meta: {
      crop: 'Ipari paradicsom',
      soil: 'Humuszos homok (KA: 27)',
      irrigation: '450 mm',
      period: 'Május – Augusztus'
    },
    spadeTreatments: [
      'Ásógép (30 cm) önállóan',
      'Szántás + Ásógép (25 cm)'
    ],
    controlTreatments: [
      'Szántás + Kombinátor',
      'Hagyományos művelés'
    ],
    chartData: [
      { month: 'Május', spade: 22, control: 28 },
      { month: 'Augusztus', spade: 20, control: 32 }
    ],
    highlight: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
  },
  '38wx': {
    location: 'Szentkirály',
    model: '38WX Lazítókéses',
    meta: {
      crop: 'Vöröshagyma',
      soil: 'Réti csernozjom (KA: 28,5)',
      irrigation: '350 mm',
      period: 'Március – Június'
    },
    spadeTreatments: [
      'Őszi nehézkultivátor',
      'Tavaszi nehézkultivátor',
      '38WX ásógép (30 cm + 55 cm lazítókés)'
    ],
    controlTreatments: [
      'Őszi nehézkultivátor',
      'Tavaszi nehézkultivátor',
      'Kombinátor'
    ],
    chartData: [
      { month: 'Március', spade: 35, control: 8 },
      { month: 'Április', spade: 30, control: 25 },
      { month: 'Május', spade: 22, control: 23 },
      { month: 'Június', spade: 17, control: 5 }
    ],
    highlight: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.'
  },
  '40sx': {
    location: 'Kecskemét-Borbás',
    model: '40SX Mélyásógép',
    meta: {
      crop: 'Ipari paradicsom',
      soil: 'Réti csernozjom (KA: 28)',
      irrigation: '400 mm',
      period: 'Május – Június'
    },
    spadeTreatments: [
      'Őszi szántás (28 cm)',
      'Simítózás',
      'Ásóborona',
      '40SX mélyásógép (45 cm)'
    ],
    controlTreatments: [
      'Őszi szántás (28 cm)',
      'Simítózás',
      'Ásóborona'
    ],
    chartData: [
      { month: 'Május', spade: 40, control: 35 },
      { month: 'Június', spade: 37, control: 27 }
    ],
    highlight: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.'
  }
}

export default function FieldDataModal({ isOpen, onClose, modelId }: FieldDataModalProps) {
  const data = fieldData[modelId]

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className={styles.modalContainer}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <header className={styles.header}>
                <div className={styles.headerLeft}>
                  <MapPin size={20} className={styles.headerIcon} />
                  <div>
                    <h2 className={styles.title}>{data.location}</h2>
                    <span className={styles.subtitle}>{data.model}</span>
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Bezárás">
                  <X size={20} />
                </button>
              </header>

              {/* Body */}
              <div className={styles.body}>
                {/* Location Meta */}
                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <Leaf size={16} />
                    <span>{data.meta.crop}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Layers size={16} />
                    <span>{data.meta.soil}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Droplets size={16} />
                    <span>{data.meta.irrigation} öntözés</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar size={16} />
                    <span>{data.meta.period}</span>
                  </div>
                </div>

                {/* Treatments Comparison */}
                <div className={styles.treatmentsGrid}>
                  <div className={`${styles.treatmentCol} ${styles.spade}`}>
                    <h4 className={styles.treatmentTitle}>Ásógépes kezelés</h4>
                    <ul className={styles.treatmentList}>
                      {data.spadeTreatments.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.treatmentCol}>
                    <h4 className={styles.treatmentTitle}>Kontroll kezelés</h4>
                    <ul className={styles.treatmentList}>
                      {data.controlTreatments.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Chart */}
                <div className={styles.chartSection}>
                  <h4 className={styles.chartTitle}>Penetrométeres mérések (cm)</h4>
                  <div className={styles.chartGrid}>
                    {data.chartData.map((d, i) => (
                      <div key={i} className={styles.chartItem}>
                        <span className={styles.chartMonth}>{d.month}</span>
                        <div className={styles.chartBars}>
                          <div className={styles.barGroup}>
                            <div
                              className={`${styles.bar} ${styles.spadeBar}`}
                              style={{ height: `${Math.max(20, d.spade * 2.5)}px` }}
                            >
                              <span className={styles.barValue}>{d.spade}</span>
                            </div>
                            <span className={styles.barLabel}>Ásógép</span>
                          </div>
                          <div className={styles.barGroup}>
                            <div
                              className={`${styles.bar} ${styles.controlBar}`}
                              style={{ height: `${Math.max(15, d.control * 2.5)}px` }}
                            >
                              <span className={styles.barValue}>{d.control}</span>
                            </div>
                            <span className={styles.barLabel}>Kontroll</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.spadeDot}`} />
                      <span>Ásógépes kezelés</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.controlDot}`} />
                      <span>Kontroll</span>
                    </div>
                  </div>
                </div>

                {/* Highlight */}
                <div className={styles.highlight}>
                  <Lightbulb size={20} />
                  <p>{data.highlight}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
