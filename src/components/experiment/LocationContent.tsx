'use client'

import Timeline from './Timeline'
import TemperatureChart from './TemperatureChart'
import IsometricFieldChart from './IsometricFieldChart'
import styles from './Experiment.module.css'

interface LocationData {
  name: string
  crop: string
  soil: string
  ka: string
  irrigation: string
  period: string
  measurements: string
  measurementLabel?: string
  treatmentCount?: string
  spade?: {
    treatments: string[]
  }
  control?: {
    treatments: string[]
  }
  chartData?: { month: string; spade: number; control: number }[]
  evaluations?: {
    control: string
    spade: string
    summary: string
  }
  temperatureData?: {
    depth1cm: { spade: number; control: number }
    depth5cm: { spade: number; control: number }
  }
  highlight?: { title: string; text: string }
  parcels?: {
    num: string
    treatment: string
    shortName: string
    may: number
    jun: number
    aug: number
    rating: number
    description: string
    good: boolean
  }[]
  conclusions?: {
    summary: string
    bestResults: string[]
  }
}

interface LocationContentProps {
  location: string
  data: LocationData
}

export default function LocationContent({ location, data }: LocationContentProps) {
  const isLakitelek = location === 'lakitelek'
  const isSzentkiraly = location === 'szentkiraly'

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
              <span className={styles.infoLabel}>Arany-féle kötöttség (KA)</span>
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
              <span className={styles.infoLabel}>
                {data.measurementLabel || (isLakitelek ? 'Parcellák' : 'Mérések száma')}
              </span>
              <span className={styles.infoValue}>{data.measurements}</span>
            </div>
            {/* Lakitelek extra mező: Művelés */}
            {isLakitelek && data.treatmentCount && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Művelés</span>
                <span className={styles.infoValue}>{data.treatmentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kezelés összehasonlítás (nem Lakitelek) */}
      {!isLakitelek && data.spade && data.control && (
        <div className={styles.treatmentComparison}>
          {/* Kontroll előbb (balra) */}
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
          <div className={styles.treatmentVs}>VS</div>
          {/* Ásógépezett utána (jobbra) */}
          <div className={`${styles.treatment} ${styles.treatmentSpade}`}>
            <div className={styles.treatmentHeader}>
              <span className={styles.treatmentBadge}>Ásógépezett</span>
            </div>
            <ul className={styles.treatmentList}>
              {data.spade.treatments.map((t, i) => (
                <li key={i}>
                  {t.toLowerCase().includes('ásógép') || t.toLowerCase().includes('mélylazítás')
                    ? <strong>{t}</strong>
                    : t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Timeline diagram (nem Lakitelek) */}
      {!isLakitelek && data.chartData && (
        <Timeline
          data={data.chartData}
          title={`A talaj tömörödése ${data.chartData.length} hónap alatt`}
          evaluations={data.evaluations}
        />
      )}

      {/* Szentkirály: Talajhőmérséklet diagram */}
      {isSzentkiraly && data.temperatureData && (
        <TemperatureChart data={data.temperatureData} />
      )}

      {/* Highlight szekció (nem Lakitelek) */}
      {!isLakitelek && data.highlight && (
        <div className={styles.locationHighlight}>
          <div className={styles.highlightImage}>
            <div className={styles.imagePlaceholder}>
              <span>Összehasonlító fotó</span>
              <span className={styles.placeholderSub}>
                {isSzentkiraly ? 'Gyomborítottság különbsége' : 'Paradicsom állomány júniusban'}
              </span>
            </div>
          </div>
          <div className={styles.highlightText}>
            <h4>{data.highlight.title}</h4>
            <p dangerouslySetInnerHTML={{
              __html: data.highlight.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }} />
          </div>
        </div>
      )}

      {/* Lakitelek: 3D izometrikus diagram */}
      {isLakitelek && data.parcels && (
        <IsometricFieldChart
          parcels={data.parcels}
          conclusions={data.conclusions}
        />
      )}
    </>
  )
}
