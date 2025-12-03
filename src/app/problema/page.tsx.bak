'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle, Ban, ThermometerSun, Activity, Droplet, Weight, Layers, ArrowRight, Minimize2, Thermometer } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import ConsequenceCard from '@/components/problem/ConsequenceCard'
import SoilComparison from '@/components/problem/SoilComparison'
import { compactionChallenges, ploughingProblems, problemStatistics } from '@/lib/data'
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
  const [activeTab, setActiveTab] = useState<'compaction' | 'ploughing'>('compaction')
  const [[page, direction], setPage] = useState([0, 0])

  const handleTabChange = (newTab: 'compaction' | 'ploughing') => {
    if (newTab === activeTab) return
    
    const newDirection = newTab === 'ploughing' ? 1 : -1
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
            className={`${styles.tab} ${activeTab === 'compaction' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('compaction')}
          >
            A Tömörödés Problémája
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'ploughing' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('ploughing')}
          >
            Miért Nem Elég a Szántás?
          </button>
        </div>

        <div className={styles.bookContainer}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {activeTab === 'compaction' ? (
              <motion.div
                key="compaction"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className={styles.pageWrapper}
              >
                <div className={styles.problemContent}>
                  <div className={styles.statHighlight}>
                    <div className={styles.statNumber}>
                      {problemStatistics.irrigation.min}-{problemStatistics.irrigation.max}
                      <span className={styles.statUnit}>{problemStatistics.irrigation.unit}</span>
                    </div>
                    <div className={styles.statLabel}>
                      {problemStatistics.irrigation.label}
                    </div>
                  </div>

                  <p className={styles.contextIntro}>
                    Intenzív öntözéses kertészeti kultúrákban (paradicsom, hagyma) a talaj <strong>gyorsan tömörödik</strong> a nagy mennyiségű víz és a gépek taposása hatására. A kérdés: <strong>hogyan őrizzük meg a talaj kedvező szerkezetét egy teljes termesztési ciklus alatt?</strong>
                  </p>

                  <div className={styles.challengeGrid}>
                    {compactionChallenges.map((challenge, index) => {
                      const iconMap: Record<string, JSX.Element> = {
                        droplet: <Droplet size={24} />,
                        weight: <Weight size={24} />,
                        layers: <Layers size={24} />,
                      }

                      return (
                        <motion.div
                          key={index}
                          className={styles.challengeCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={styles.challengeIcon}>
                            {iconMap[challenge.icon] || <Droplet size={24} />}
                          </div>
                          <h4 className={styles.challengeTitle}>{challenge.title}</h4>
                          <p className={styles.challengeDescription}>{challenge.description}</p>
                          <div className={styles.challengeData}>{challenge.data}</div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <blockquote className={styles.centralQuestion}>
                    „A kutatás célja: Melyik művelési módszer tudja <strong>LEGJOBBAN</strong> megőrizni a talaj laza szerkezetét egy teljes termesztési ciklus alatt?”
                  </blockquote>

                  <div className={styles.problemVisual}>
                    <InteractiveSoil />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ploughing"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className={styles.pageWrapper}
              >
                <div className={styles.consequencesContent}>
                  <p className={styles.contextIntro}>
                    A hagyományos <strong>szántás</strong> ugyan fellazítja a talajt, de komoly mellékhatásokkal jár. 
                    A forgatás során eketalpat képez, felcseréli a talajrétegeket, és károsítja a talajéletet.
                  </p>

                  <div className={styles.consequencesGrid}>
                    {ploughingProblems.map((problem, index) => (
                      <ConsequenceCard
                        key={index}
                        title={problem.title}
                        description={problem.description}
                        icon={problem.icon}
                        dataBadge={problem.dataBadge}
                        source={problem.source}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* Talajszelvény összehasonlítás - ábra placeholder */}
                  <SoilComparison />

                  <div className={styles.problemConclusion}>
                    <div className={styles.conclusionAlert}>
                      <AlertTriangle size={24} color="#F57C00" />
                      <p>
                        <strong>Ezért kellett megvizsgálni:</strong> Az ásógép — mint forgatás nélküli lazítóeszköz — képes-e megoldani ezeket a problémákat?
                      </p>
                    </div>

                    <Link href="/megoldas" className={styles.conclusionCta}>
                      <span>Tovább a megoldásra</span>
                      <ArrowRight size={20} />
                    </Link>
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
