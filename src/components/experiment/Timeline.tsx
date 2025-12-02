'use client'

import { motion } from 'framer-motion'
import styles from './Timeline.module.css'

interface TimelineData {
  month: string
  spade: number
  control: number
}

interface TimelineProps {
  data: TimelineData[]
  title?: string
}

export default function Timeline({ data, title = "Szerkezetváltozás a termesztési ciklus alatt" }: TimelineProps) {
  const maxValue = Math.max(...data.flatMap(d => [d.spade, d.control]))
  
  // Kiszámoljuk a változásokat
  const spadeChange = data[data.length - 1].spade - data[0].spade
  const controlChange = data[data.length - 1].control - data[0].control

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      
      <div className={styles.timeline}>
        {data.map((point, index) => (
          <div key={index} className={styles.timepoint}>
            <div className={styles.month}>{point.month}</div>
            
            <div className={styles.bars}>
              <motion.div 
                className={styles.barWrapper}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.barLabel}>Ásógép</div>
                <div className={styles.barContainer}>
                  <motion.div 
                    className={`${styles.bar} ${styles.barSpade}`}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(point.spade / maxValue) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  />
                </div>
                <div className={styles.barValue}>{point.spade} cm</div>
              </motion.div>
              
              <motion.div 
                className={styles.barWrapper}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.05 }}
              >
                <div className={styles.barLabel}>Kontroll</div>
                <div className={styles.barContainer}>
                  <motion.div 
                    className={`${styles.bar} ${styles.barControl}`}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(point.control / maxValue) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.05 }}
                  />
                </div>
                <div className={styles.barValue}>{point.control} cm</div>
              </motion.div>
            </div>
            
            {index < data.length - 1 && (
              <div className={styles.connector}>
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <path d="M0 10 L30 10 L25 5 M30 10 L25 15" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.summary}>
        <div className={`${styles.summaryItem} ${styles.summarySpade}`}>
          <span className={styles.summaryLabel}>Ásógép változás:</span>
          <span className={`${styles.summaryValue} ${spadeChange <= 0 ? styles.good : styles.bad}`}>
            {spadeChange > 0 ? '+' : ''}{spadeChange} cm
          </span>
        </div>
        <div className={`${styles.summaryItem} ${styles.summaryControl}`}>
          <span className={styles.summaryLabel}>Kontroll változás:</span>
          <span className={`${styles.summaryValue} ${controlChange <= 0 ? styles.good : styles.bad}`}>
            {controlChange > 0 ? '+' : ''}{controlChange} cm
          </span>
        </div>
      </div>

      {/* Idővonal magyarázat */}
      <div className={styles.explanation}>
        <div className={styles.explanationIcon}>📊</div>
        <p>
          Az ábra a <strong>laza talajréteg mélységét</strong> mutatja centimé­terben. 
          Magasabb érték = lazább talaj = jobb gyökérnövekedés.
          A termesztési ciklus során a talaj természetesen tömörödik az öntözés és gépjárás hatására.
        </p>
      </div>
    </div>
  )
}
