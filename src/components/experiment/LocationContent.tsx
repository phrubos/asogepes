'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import BarChart from './BarChart'
import Timeline from './Timeline'
import styles from './Experiment.module.css'

interface LocationData {
  name: string
  crop: string
  soil: string
  ka: string
  irrigation: string
  period: string
  measurements: string
  spade?: {
    treatments: string[]
  }
  control?: {
    treatments: string[]
  }
  chartData?: { month: string; spade: number; control: number }[]
  callout?: { number: string; text: string }
  highlight?: { title: string; text: string }
  parcels?: { num: string; treatment: string; may: number; aug: number; change: number; good: boolean }[]
  multiChartData?: { label: string; may: number; aug: number }[]
}

interface LocationContentProps {
  location: string
  data: LocationData
}

export default function LocationContent({ location, data }: LocationContentProps) {
  const isLakitelek = location === 'lakitelek'

  return (
    <>
      <div className={styles.locationHeader}>
        <div className={styles.locationMap}>
          <div className={styles.mapPlaceholder}>
            <span>Drónfelvétel helye</span>
          </div>
        </div>
        <div className={styles.locationInfo}>
          <h3>{data.name}</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Talaj</span>
              <span className={styles.infoValue}>{data.soil}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kötöttség (KA)</span>
              <span className={styles.infoValue}>{data.ka}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kultúra</span>
              <span className={styles.infoValue}>{data.crop}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Öntözés</span>
              <span className={styles.infoValue}>{data.irrigation}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Mérési időszak</span>
              <span className={styles.infoValue}>{data.period}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{isLakitelek ? 'Parcellák' : 'Mérések száma'}</span>
              <span className={styles.infoValue}>{data.measurements}</span>
            </div>
          </div>
        </div>
      </div>

      {!isLakitelek && data.spade && data.control && (
        <div className={styles.treatmentComparison}>
          <div className={`${styles.treatment} ${styles.treatmentSpade}`}>
            <div className={styles.treatmentHeader}>
              <span className={styles.treatmentBadge}>Ásógépezett</span>
            </div>
            <ul className={styles.treatmentList}>
              {data.spade.treatments.map((t, i) => (
                <li key={i}>{t.includes('ásógép') || t.includes('mélyásógép') ? <strong>{t}</strong> : t}</li>
              ))}
            </ul>
          </div>
          <div className={styles.treatmentVs}>VS</div>
          <div className={`${styles.treatment} ${styles.treatmentControl}`}>
            <div className={styles.treatmentHeader}>
              <span className={styles.treatmentBadge}>Kontroll</span>
            </div>
            <ul className={styles.treatmentList}>
              {data.control.treatments.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!isLakitelek && data.chartData && (
        <>
          {/* Idővonal vizualizáció */}
          <Timeline data={data.chartData} title={`Szerkezetváltozás: ${data.name}`} />
          
          <div className={styles.resultsPreview}>
            <h4>Tömörödés alakulása (részletes)</h4>
            <BarChart data={data.chartData} />
            <div className={styles.chartLegend}>
              <span className={`${styles.legendItem} ${styles.legendSpade}`}>Ásógépezett</span>
              <span className={`${styles.legendItem} ${styles.legendControl}`}>Kontroll</span>
              <span className={styles.legendNote}>Laza talajréteg mélysége (cm) – magasabb = jobb</span>
            </div>
            {data.callout && (
              <div className={styles.resultCallout}>
                <span className={styles.calloutNumber}>{data.callout.number}</span>
                <span className={styles.calloutText}>{data.callout.text}</span>
              </div>
            )}
          </div>
        </>
      )}

      {!isLakitelek && data.highlight && (
        <div className={styles.locationHighlight}>
          <div className={styles.highlightImage}>
            <div className={styles.imagePlaceholder}>
              <span>Összehasonlító fotó</span>
              <span className={styles.placeholderSub}>{location === 'szentkiraly' ? 'Gyomborítottság különbsége' : 'Paradicsom állomány júniusban'}</span>
            </div>
          </div>
          <div className={styles.highlightText}>
            <h4>{data.highlight.title}</h4>
            <p dangerouslySetInnerHTML={{ __html: data.highlight.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        </div>
      )}

      {isLakitelek && data.parcels && (
        <div className={styles.lakitelekParcels}>
          <div className={styles.lakitelekIntro}>
            <h4>7 művelési kombináció összehasonlítása</h4>
            <p className={styles.lakitelekDesc}>
              Lakiteleken <strong>7 különböző művelési kombinációt</strong> vizsgáltunk egymás mellett, 
              azonos körülmények között. Ez a legrészletesebb összehasonlítás, ami bemutatja: 
              <em>melyik művelési mód őrzi meg legjobban a talaj szerkezetét?</em>
            </p>
          </div>
          
          <div className={styles.parcelsTable}>
            <div className={`${styles.parcelRow} ${styles.parcelHeader}`}>
              <span className={styles.parcelNum}>#</span>
              <span className={styles.parcelTreatment}>Művelés</span>
              <span className={styles.parcelMay}>Május</span>
              <span className={styles.parcelAug}>Augusztus</span>
              <span className={styles.parcelChange}>Változás</span>
              <span className={styles.parcelStatus}>Értékelés</span>
            </div>
            {data.parcels.map((parcel, index) => (
              <div
                key={index}
                className={`${styles.parcelRow} ${parcel.good && (parcel.num === 'I.' || parcel.num === 'VII.') ? styles.parcelHighlight : ''}`}
              >
                <span className={styles.parcelNum}>{parcel.num}</span>
                <span className={styles.parcelTreatment}>{parcel.treatment}</span>
                <span className={styles.parcelMay}>{parcel.may} cm</span>
                <span className={styles.parcelAug}>{parcel.aug} cm</span>
                <span className={`${styles.parcelChange} ${parcel.good ? styles.parcelChangeGood : styles.parcelChangeBad}`}>
                  {parcel.good ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {parcel.change > 0 ? '+' : ''}{parcel.change} cm
                </span>
                <span className={styles.parcelStatus}>
                  {parcel.good ? (
                    <CheckCircle size={18} className={styles.statusGood} />
                  ) : (
                    <XCircle size={18} className={styles.statusBad} />
                  )}
                </span>
              </div>
            ))}
          </div>
          
          {/* Lakitelek következtetések */}
          <div className={styles.lakitelekConclusions}>
            <div className={styles.conclusionCard}>
              <div className={styles.conclusionIcon}>🏆</div>
              <div className={styles.conclusionContent}>
                <h5>Legstabilabb eredmény</h5>
                <p><strong>VII. Szántás + Ásógép:</strong> Csak -1 cm változás 4 hónap és 450 mm öntözés után!</p>
              </div>
            </div>
            <div className={styles.conclusionCard}>
              <div className={styles.conclusionIcon}>⭐</div>
              <div className={styles.conclusionContent}>
                <h5>Önálló ásógép</h5>
                <p><strong>I. és III. parcella:</strong> Mélyásógép és ásógép is kiváló (-2 cm)</p>
              </div>
            </div>
            <div className={styles.conclusionCard}>
              <div className={styles.conclusionIcon}>⚠️</div>
              <div className={styles.conclusionContent}>
                <h5>Túllázítás veszélye</h5>
                <p><strong>II., IV., VI.:</strong> Túl sok művelet = gyorsabb visszatömörödés (-7 cm)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLakitelek && data.multiChartData && (
        <div className={styles.lakitelekChart}>
          <h4>Tömörödés alakulása (450 mm öntözés után)</h4>
          <div className={styles.multiChart}>
            {data.multiChartData.map((row, index) => (
              <div key={index} className={styles.multiChartRow}>
                <span className={styles.rowLabel}>{row.label}</span>
                <div className={styles.rowBars}>
                  <motion.div
                    className={`${styles.rowBar} ${styles.barMay}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    style={{ width: `${(row.may / 40) * 100}%` }}
                  >
                    <span>{row.may}</span>
                  </motion.div>
                  <motion.div
                    className={`${styles.rowBar} ${styles.barAug}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 + 0.1 }}
                    style={{ width: `${(row.aug / 40) * 100}%` }}
                  >
                    <span>{row.aug}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.chartLegend}>
            <span className={`${styles.legendItem} ${styles.legendMay}`}>Május</span>
            <span className={`${styles.legendItem} ${styles.legendAug}`}>Augusztus</span>
            <span className={styles.legendNote}>Laza talajréteg mélysége (cm)</span>
          </div>
        </div>
      )}
    </>
  )
}
