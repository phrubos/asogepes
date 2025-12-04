'use client'

import { motion } from 'framer-motion'
import { Layers, Activity, Leaf, Thermometer, AlertTriangle } from 'lucide-react'
import SoilComparison from '@/components/problem/SoilComparison'
import { ploughingProblems } from '@/lib/data'
import styles from './ProblemNew.module.css'

export default function PloughingView() {
  const iconMap: Record<string, JSX.Element> = {
    layers: <Layers size={24} />,
    activity: <Activity size={24} />,
    leaf: <Leaf size={24} />,
    thermometer: <Thermometer size={24} />,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.centeredTextBlock}>
        <p className={styles.subTitle}>
          A hagyományos szántás rövid távon megoldásnak tűnik, de valójában egy <strong>ördögi kört</strong> tart fenn.
          A forgatás tönkreteszi azt, amit védeni kellene.
        </p>
      </div>

      <div className={styles.ploughGrid}>
        {ploughingProblems.map((problem, index) => (
          <motion.div 
            key={index} 
            className={styles.consequenceCard}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                {iconMap[problem.icon] || <AlertTriangle size={24} />}
              </div>
              <div className={styles.cardBadge}>
                {problem.dataBadge}
              </div>
            </div>
            <h3 className={styles.cardTitle}>{problem.title}</h3>
            <p className={styles.cardDesc}>{problem.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className={styles.comparisonWrapper}
        variants={itemVariants}
      >
        <div className={styles.comparisonCard}>
          <SoilComparison />
        </div>
      </motion.div>
    </motion.div>
  )
}
