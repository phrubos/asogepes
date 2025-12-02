'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationContent from './LocationContent'
import { locations } from '@/lib/data'
import styles from './Experiment.module.css'

type LocationKey = 'szentkiraly' | 'kecskemet' | 'lakitelek'

const tabs: { key: LocationKey; number: string; name: string; crop: string }[] = [
  { key: 'szentkiraly', number: '1', name: 'Szentkirály', crop: 'Vöröshagyma' },
  { key: 'kecskemet', number: '2', name: 'Kecskemét-Borbás', crop: 'Ipari paradicsom' },
  { key: 'lakitelek', number: '3', name: 'Lakitelek', crop: 'Ipari paradicsom' },
]

export default function LocationTabs() {
  const [activeLocation, setActiveLocation] = useState<LocationKey>('szentkiraly')

  return (
    <>
      <div className={styles.locationTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.locationTab} ${activeLocation === tab.key ? styles.active : ''}`}
            onClick={() => setActiveLocation(tab.key)}
          >
            <span className={styles.tabNumber}>{tab.number}</span>
            <span className={styles.tabName}>{tab.name}</span>
            <span className={styles.tabCrop}>{tab.crop}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLocation}
          className={styles.locationContent}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <LocationContent location={activeLocation} data={locations[activeLocation]} />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
