'use client'

import { motion } from 'framer-motion'
import { Droplet, Weight, Layers, ArrowDown } from 'lucide-react'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import { problemStatistics, compactionChallenges } from '@/lib/data'
import styles from './ProblemNew.module.css'

export default function CompactionView() {
  const iconMap: Record<string, JSX.Element> = {
    droplet: <Droplet size={24} />,
    weight: <Weight size={24} />,
    layers: <Layers size={24} />,
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
      className={styles.gridContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.leftColumn}>
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.mainStat}>
            {problemStatistics.irrigation.min}-{problemStatistics.irrigation.max}
            <span className={styles.statUnit}>{problemStatistics.irrigation.unit}</span>
          </div>
          <div className={styles.statDescription}>
            {problemStatistics.irrigation.label} évente. Ennyi vizet kell a talajnak elnyelnie és megtartania szerkezetromlás nélkül.
          </div>
        </motion.div>

        <div className={styles.challengesList}>
          {compactionChallenges.map((challenge, index) => (
            <motion.div 
              key={index} 
              className={styles.challengeItem}
              variants={itemVariants}
            >
              <div className={styles.iconBox}>
                {iconMap[challenge.icon]}
              </div>
              <div className={styles.itemContent}>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <motion.div 
          className={styles.interactiveWrapper}
          variants={itemVariants}
        >
           <div style={{ 
             background: 'var(--color-white)', 
             padding: 'var(--space-xl)', 
             borderRadius: 'var(--radius-lg)',
             boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
             border: '1px solid rgba(0,0,0,0.05)'
           }}>
             <InteractiveSoil />
             <p style={{
               textAlign: 'center',
               marginTop: 'var(--space-md)',
               color: 'var(--color-earth-500)',
               fontSize: '0.875rem'
             }}>
               Kattints a rétegekre a részletekért
             </p>
           </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
