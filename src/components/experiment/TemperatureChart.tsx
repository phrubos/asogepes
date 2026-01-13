'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Thermometer } from 'lucide-react'
import styles from './TemperatureChart.module.css'

interface TemperatureData {
  depth1cm: { spade: number; control: number }
  depth5cm: { spade: number; control: number }
}

interface TemperatureChartProps {
  data: TemperatureData
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  const maxTemp = Math.max(
    data.depth1cm.spade,
    data.depth1cm.control,
    data.depth5cm.spade,
    data.depth5cm.control
  ) * 1.1

  const diff1cm = (data.depth1cm.spade - data.depth1cm.control).toFixed(1)
  const diff5cm = (data.depth5cm.spade - data.depth5cm.control).toFixed(1)

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: (delay: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        scaleY: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4, delay }
      }
    })
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.titleWrapper}>
          <Thermometer className={styles.titleIcon} size={20} />
          <h4 className={styles.title}>A talajhőmérséklet a vöröshagyma csírázásakor</h4>
        </div>
        <motion.div
          className={styles.titleLine}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      <div className={styles.chartArea}>
        {/* 1 cm mélység */}
        <div className={styles.depthSection}>
          <div className={styles.depthLabel}>1 cm mélyen</div>
          <div className={styles.barsRow}>
            {/* Kontroll */}
            <div className={styles.barGroup}>
              <div className={styles.barContainer}>
                <motion.div
                  className={`${styles.bar} ${styles.barControl}`}
                  variants={barVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={0}
                  style={{ height: `${(data.depth1cm.control / maxTemp) * 100}%` }}
                >
                  <span className={styles.barValue}>{data.depth1cm.control}°C</span>
                </motion.div>
              </div>
              <span className={styles.barLabel}>Kontroll</span>
            </div>

            {/* Ásógépezett */}
            <div className={styles.barGroup}>
              <div className={styles.barContainer}>
                <motion.div
                  className={`${styles.bar} ${styles.barSpade}`}
                  variants={barVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={0.1}
                  style={{ height: `${(data.depth1cm.spade / maxTemp) * 100}%` }}
                >
                  <span className={styles.barValue}>{data.depth1cm.spade}°C</span>
                </motion.div>
              </div>
              <span className={styles.barLabel}>Ásógépezett</span>
            </div>

            {/* Különbség */}
            <motion.div
              className={styles.diffBadge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              +{diff1cm}°C
            </motion.div>
          </div>
        </div>

        {/* 5 cm mélység */}
        <div className={styles.depthSection}>
          <div className={styles.depthLabel}>5 cm mélyen</div>
          <div className={styles.barsRow}>
            {/* Kontroll */}
            <div className={styles.barGroup}>
              <div className={styles.barContainer}>
                <motion.div
                  className={`${styles.bar} ${styles.barControl}`}
                  variants={barVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={0.2}
                  style={{ height: `${(data.depth5cm.control / maxTemp) * 100}%` }}
                >
                  <span className={styles.barValue}>{data.depth5cm.control}°C</span>
                </motion.div>
              </div>
              <span className={styles.barLabel}>Kontroll</span>
            </div>

            {/* Ásógépezett */}
            <div className={styles.barGroup}>
              <div className={styles.barContainer}>
                <motion.div
                  className={`${styles.bar} ${styles.barSpade}`}
                  variants={barVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={0.3}
                  style={{ height: `${(data.depth5cm.spade / maxTemp) * 100}%` }}
                >
                  <span className={styles.barValue}>{data.depth5cm.spade}°C</span>
                </motion.div>
              </div>
              <span className={styles.barLabel}>Ásógépezett</span>
            </div>

            {/* Különbség */}
            <motion.div
              className={styles.diffBadge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              +{diff5cm}°C
            </motion.div>
          </div>
        </div>
      </div>

      {/* Magyarázat */}
      <motion.div
        className={styles.explanation}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
      >
        <p>
          A vetés után, a csírázás időszakában a talajhőmérsékletnek nagy jelentősége van.
          Márciusban, a kora tavaszi felmelegedés idején, dél körüli időben mértük a csírázó hagyma
          talajának felszínközeli hőmérsékletét. A lazább szerkezetű, ásógépezett talaj{' '}
          <strong>+3-5°C-kal magasabb</strong> hőmérsékletű.
          Ez jelentősen felgyorsítja a növények kezdeti növekedését.
        </p>
      </motion.div>
    </div>
  )
}
