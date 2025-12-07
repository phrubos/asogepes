'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationContent from './LocationContent'
import LocationSelector from './LocationSelector'
import { locations } from '@/lib/data'
import styles from './Experiment.module.css'

type LocationKey = 'szentkiraly' | 'kecskemet' | 'lakitelek'

export default function LocationTabs() {
  const [activeLocation, setActiveLocation] = useState<LocationKey>('szentkiraly')

  return (
    <>
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

      {/* Floating Location Selector with Modal */}
      <LocationSelector 
        activeLocation={activeLocation} 
        onLocationChange={setActiveLocation} 
      />
    </>
  )
}
