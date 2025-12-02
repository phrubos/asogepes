'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle, Ban, ThermometerSun, Activity, Droplet, Weight, Layers, ArrowRight, Compress, Thermometer } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import ConsequenceCard from '@/components/problem/ConsequenceCard'
import ConsequenceImage from '@/components/problem/ConsequenceImage'
import { consequences, irrigationChallenges, problemStatistics } from '@/lib/data'
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
            Öntözéses Termesztés Kihívása
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'consequences' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('consequences')}
          >
            Hagyományos Művelés Problémái
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
                    Intenzív öntözéses kertészeti kultúrákban (paradicsom, hagyma) a talaj <strong>gyorsan tömörödik</strong> a nagy mennyiségű víz hatására. A kérdés: hogyan őrizzük meg a talaj kedvező szerkezetét a teljes termesztési ciklus alatt?
                  </p>

                  <div className={styles.challengeGrid}>
                    {irrigationChallenges.map((challenge, index) => {
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
                    „A kérdés: Melyik művelési módszer tudja <strong>LEGJOBBAN</strong> megőrizni a talaj laza szerkezetét egy teljes termesztési ciklus alatt?"
                  </blockquote>

                  <div className={styles.problemVisual}>
                    <InteractiveSoil />
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
                        dataBadge={consequence.dataBadge}
                        source={consequence.source}
                        index={index}
                      />
                    ))}
                  </div>

                  <div className={styles.problemConclusion}>
                    <div className={styles.conclusionAlert}>
                      <AlertTriangle size={24} color="#F57C00" />
                      <p>
                        <strong>Ezért kellett megvizsgálni:</strong> Különböző művelési módszerek (szántás, kultivátor, ásógép, lazítás) hogyan hatnak a talaj szerkezetének változására egy teljes termesztési ciklus alatt.
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
