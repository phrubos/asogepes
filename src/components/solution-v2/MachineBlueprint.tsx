'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Settings, Activity, Maximize2, Zap } from 'lucide-react'
import styles from './MachineBlueprint.module.css'

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  title: string
  description: string
  icon: any
}

const hotspots: Hotspot[] = [
  {
    id: 'rotor',
    x: 25, // % from left
    y: 65, // % from top
    label: '01',
    title: 'Ásó Rotor',
    description: 'A fő rotor lapátjai behatolnak a talajba, és lazítják azt anélkül, hogy megfordítanák a rétegeket. Megszünteti az eketalpat.',
    icon: Activity
  },
  {
    id: 'roller',
    x: 75,
    y: 60,
    label: '02',
    title: 'Visszatömörítő Henger',
    description: 'A gép utánfutó hengere azonnal lezárja a felszínt, megőrizve a nedvességet és tökéletes magágyat készítve.',
    icon: Settings
  },
  {
    id: 'frame',
    x: 50,
    y: 30,
    label: '03',
    title: 'Robusztus Váz',
    description: 'Nagy igénybevételre tervezett konstrukció, amely ellenáll a vibrációnak és biztosítja a tartósságot.',
    icon: Maximize2
  },
  {
    id: 'pto',
    x: 10,
    y: 40,
    label: '04',
    title: 'TLT Hajtás',
    description: 'Közvetlen erőátvitel, amely hatékonyabb energiafelhasználást tesz lehetővé a vontatott eszközökhöz képest.',
    icon: Zap
  }
]

export default function MachineBlueprint() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  return (
    <div id="imants-40sx" className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3>IMANTS 40SX</h3>
          <span className={styles.badge}>BLUEPRINT VIEW</span>
        </div>
        <div className={styles.legend}>
          <Info size={16} className={styles.legendIcon} />
          <span>Interaktív nézet: Kattintson a pontokra</span>
        </div>
      </div>

      <div className={styles.blueprintArea}>
        {/* Grid Background */}
        <div className={styles.gridBg} />
        
        {/* Machine Image */}
        <div className={styles.imageWrapper}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={styles.imageInner}
          >
            <Image 
              src="/images/40SX.png"
              alt="Imants 40SX Blueprint"
              width={800}
              height={600}
              priority
              className={styles.machineImage}
            />
          </motion.div>

          {/* Hotspots */}
          {hotspots.map((spot) => (
            <motion.button
              key={spot.id}
              className={`${styles.hotspot} ${activeHotspot === spot.id ? styles.active : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
              whileHover={{ scale: 1.15 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + parseInt(spot.label) * 0.1 }}
            >
              <span className={styles.hotspotLabel}>{spot.label}</span>
              {/* Enhanced pulse ring */}
              <motion.span 
                className={styles.hotspotRing}
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Second pulse ring for depth */}
              <motion.span 
                className={styles.hotspotRingOuter}
                animate={{ 
                  scale: [1, 2.2, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              {/* Glow effect on active */}
              {activeHotspot === spot.id && (
                <motion.span 
                  className={styles.hotspotGlow}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Detail Panel Overlay */}
        <AnimatePresence>
          {activeHotspot && (
            <motion.div 
              className={styles.detailPanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {hotspots.filter(h => h.id === activeHotspot).map(spot => (
                <div key={spot.id} className={styles.panelContent}>
                  <div className={styles.panelHeader}>
                    <spot.icon size={24} className={styles.panelIcon} />
                    <h4>{spot.title}</h4>
                  </div>
                  <p>{spot.description}</p>
                  <button 
                    className={styles.closeButton}
                    onClick={() => setActiveHotspot(null)}
                  >
                    Bezárás
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Details List (Visible only on mobile) */}
      <div className={styles.mobileDetails}>
        {hotspots.map((spot) => (
           <div key={spot.id} className={styles.mobileItem}>
             <div className={styles.mobileHeader}>
               <span className={styles.mobileNumber}>{spot.label}</span>
               <h4>{spot.title}</h4>
             </div>
             <p>{spot.description}</p>
           </div>
        ))}
      </div>
    </div>
  )
}
