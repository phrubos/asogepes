'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Ban, ThermometerSun, Activity } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import ConsequenceCard from '@/components/problem/ConsequenceCard'
import ConsequenceImage from '@/components/problem/ConsequenceImage'
import { consequences } from '@/lib/data'
import styles from '@/components/problem/Problem.module.css'

const variants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.9,
    transformPerspective: 1000,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: (direction: number) => ({
    rotateY: direction < 0 ? 90 : -90,
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
    transition: {
      duration: 0.6,
      ease: "easeIn"
    }
  })
}

export default function ProblemaPage() {
  const [activeTab, setActiveTab] = useState<'problem' | 'consequences'>('problem')
  const [[page, direction], setPage] = useState([0, 0])

  const handleTabChange = (newTab: 'problem' | 'consequences') => {
    if (newTab === activeTab) return
    
    const newDirection = newTab === 'consequences' ? 1 : -1
    setPage([page + newDirection, newDirection])
    setActiveTab(newTab)
  }

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

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'problem' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('problem')}
          >
            A Láthatatlan Fal
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'consequences' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('consequences')}
          >
            Következmények
          </button>
        </div>

        <div className={styles.bookContainer}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {activeTab === 'problem' ? (
              <motion.div
                key="problem"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className={styles.pageWrapper}
              >
                <div className={styles.problemContent}>
                  <div className={styles.problemGrid}>
                    <div className={styles.problemMain}>
                      <blockquote className={styles.problemQuote}>
                        „Miért fullad meg a növényed, miközben mindent megadsz neki?"
                      </blockquote>
                      <p className={styles.problemText}>
                        A felszín alatt 25-30 cm mélyen egy <strong>áttörhetetlen, tömör réteg</strong> húzódik, amit a nehéz gépek tapostak keményre az évek során. Ez az <strong>Eketalp</strong>.
                      </p>

                      <div className={styles.painGrid}>
                        <div className={styles.painCard}>
                          <div className={styles.painTitle}>
                            <Ban size={18} color="#D32F2F" /> Gyökér-börtön
                          </div>
                          <p className={styles.painText}>
                            A gyökerek nem tudnak áttörni a 20 bar nyomású rétegen. Sekélyen maradnak, így a növény instabil és sérülékeny.
                          </p>
                        </div>
                        <div className={styles.painCard}>
                          <div className={styles.painTitle}>
                            <AlertTriangle size={18} color="#F57C00" /> Víz-csapda
                          </div>
                          <p className={styles.painText}>
                            A téli csapadék nem szivárog le a mélybe (pangóvíz), nyáron pedig a talajvíz nem jut fel a gyökerekhez (aszálykár).
                          </p>
                        </div>
                        <div className={styles.painCard}>
                          <div className={styles.painTitle}>
                            <Activity size={18} color="#5D4037" /> Fulladás
                          </div>
                          <p className={styles.painText}>
                            Levegőtlen környezetben elpusztul a hasznos talajélet, és rothadási folyamatok indulnak be a gyökérzónában.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.problemVisual}>
                      <InteractiveSoil />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="consequences"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className={styles.pageWrapper}
              >
                <div className={styles.consequencesContent}>
                  <div className={styles.consequencesHeader}>
                    <ConsequenceImage />
                  </div>
                  
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
