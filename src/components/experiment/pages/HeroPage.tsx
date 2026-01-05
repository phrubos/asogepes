'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, Droplets } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import HungaryMap from '../ResearchHero/HungaryMap'
import styles from './HeroPage.module.css'

interface HeroPageProps {
  onLocationClick?: (locationId: string) => void
}

export default function HeroPage({ onLocationClick }: HeroPageProps) {
  const stats = [
    { icon: MapPin, number: '3', label: 'Helyszín' },
    { icon: Calendar, number: '4', label: 'Hónap' },
    { icon: Droplets, number: '9', label: 'Kezelés' },
  ]

  return (
    <div className={styles.heroPage}>
      <div className={styles.content}>
        {/* Left Column - Text */}
        <div className={styles.textColumn}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageBadge number="04" label="A KUTATÁS" />
          </motion.div>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Szántóföldi talajszerkezet
            <span className={styles.titleAccent}>vizsgálatok</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Három helyszínen, 9 különböző művelési kombinációval,
            négy hónapon át mértük a talajszerkezet változását —{' '}
            <em>az eredmények egyértelműek.</em>
          </motion.p>

          {/* Stats Row */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className={styles.statItem}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className={styles.statIcon}>
                    <IconComponent size={16} />
                  </div>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Right Column - Map */}
        <motion.div
          className={styles.mapColumn}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className={styles.mapContainer}>
            <HungaryMap onLocationClick={onLocationClick} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
