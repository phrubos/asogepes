'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LocationCard from './LocationCard'
import styles from './ResearchHero.module.css'

interface MarkerData {
  id: string
  name: string
  x: number
  y: number
  crop: string
  soil: string
  period: string
}

// Marker positions converted from actual geographic coordinates
// Using same projection as HUNGARY_PATH: lon (16.2-22.71) → x (0-100), lat (45.76-48.62) → y (70-0)
const MARKERS: MarkerData[] = [
  {
    id: 'szentkiraly',
    name: 'Szentkirály',
    x: 55, // ~19.8°E
    y: 42, // ~46.9°N
    crop: 'Vöröshagyma',
    soil: 'Réti csernozjom',
    period: 'Március – Június'
  },
  {
    id: 'kecskemet',
    name: 'Kecskemét-Borbás',
    x: 52, // ~19.6°E
    y: 44, // ~46.85°N
    crop: 'Ipari paradicsom',
    soil: 'Réti csernozjom',
    period: 'Május – Június'
  },
  {
    id: 'lakitelek',
    name: 'Lakitelek',
    x: 60, // ~20.1°E
    y: 43, // ~46.87°N
    crop: 'Ipari paradicsom',
    soil: 'Humuszos homok',
    period: 'Május – Augusztus'
  }
]

// Hungary outline from GeoJSON world.geo.json data
// Converted from [longitude, latitude] coordinates to SVG viewBox (0 0 100 70)
// Longitude range: 16.2° - 22.71° (~6.51° = 100 units)
// Latitude range: 45.76° - 48.62° (~2.86° = 70 units, inverted for SVG Y)
const HUNGARY_PATH = `
  M 0 43
  L 5 27
  L 2 22
  L 11 22
  L 12 12
  L 20 18
  L 25 21
  L 38 18
  L 40 13
  L 46 12
  L 53 9
  L 55 10
  L 62 7
  L 66 1
  L 71 0
  L 87 7
  L 91 5
  L 99 11
  L 100 18
  L 91 23
  L 83 40
  L 74 56
  L 62 61
  L 52 60
  L 40 66
  L 35 70
  L 22 65
  L 10 55
  L 6 52
  L 3 44
  Z
`

interface HungaryMapProps {
  onLocationClick?: (locationId: string) => void
}

export default function HungaryMap({ onLocationClick }: HungaryMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleClick = (id: string) => {
    if (onLocationClick) {
      onLocationClick(id)
    }
    const element = document.getElementById(`location-${id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!isMounted) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapLabel}>
          <span>Magyarország</span>
          <span className={styles.mapLabelSub}>Kutatási helyszínek</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer}>
      <svg
        viewBox="-5 -5 110 80"
        className={styles.hungarySvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 168, 75, 0.18)" />
            <stop offset="100%" stopColor="rgba(212, 168, 75, 0.06)" />
          </linearGradient>

          <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212, 168, 75, 1)" />
            <stop offset="100%" stopColor="rgba(212, 168, 75, 0)" />
          </radialGradient>

          <pattern id="mapPattern" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="0.3" fill="rgba(212, 168, 75, 0.15)" />
          </pattern>
        </defs>

        {/* Country fill */}
        <motion.path
          d={HUNGARY_PATH}
          fill="url(#mapFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Dot pattern */}
        <motion.path
          d={HUNGARY_PATH}
          fill="url(#mapPattern)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Animated border */}
        <motion.path
          d={HUNGARY_PATH}
          fill="none"
          stroke="rgba(212, 168, 75, 0.7)"
          strokeWidth="0.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#mapGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Markers */}
        {MARKERS.map((marker, index) => {
          const isHovered = hoveredMarker === marker.id

          return (
            <g key={marker.id}>
              {/* Pulse ring */}
              <motion.circle
                cx={marker.x}
                cy={marker.y}
                r={4}
                fill="none"
                stroke="rgba(212, 168, 75, 0.5)"
                strokeWidth="0.3"
                pointerEvents="none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />

              {/* Glow */}
              <motion.circle
                cx={marker.x}
                cy={marker.y}
                r={isHovered ? 4 : 3}
                fill="url(#dotGlow)"
                pointerEvents="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.8 : 0.4 }}
                transition={{ duration: 0.25 }}
              />

              {/* Main dot */}
              <motion.circle
                cx={marker.x}
                cy={marker.y}
                r={isHovered ? 2.2 : 1.8}
                fill="var(--color-gold)"
                stroke="#fff"
                strokeWidth="0.5"
                style={{ cursor: 'pointer' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + index * 0.12, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.3 }}
                onMouseEnter={() => setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={() => handleClick(marker.id)}
              />

              {/* Label */}
              <motion.text
                x={marker.x + (marker.id === 'kecskemet' ? -18 : marker.id === 'lakitelek' ? 1 : -8)}
                y={marker.y + (marker.id === 'szentkiraly' ? -4 : 5)}
                fill={isHovered ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.8)'}
                fontSize="2.2"
                fontWeight={isHovered ? '600' : '500'}
                fontFamily="var(--font-display)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                style={{ transition: 'fill 0.2s' }}
              >
                {marker.name}
              </motion.text>
            </g>
          )
        })}

        {/* Reference cities - geographic coordinates converted to SVG viewBox */}
        {[
          { x: 43, y: 27, label: 'Budapest' },  // 19.0°E, 47.5°N
          { x: 83, y: 27, label: 'Debrecen' },  // 21.6°E, 47.5°N
          { x: 31, y: 62, label: 'Pécs' },      // 18.2°E, 46.1°N
          { x: 22, y: 23, label: 'Győr' },      // 17.6°E, 47.7°N
        ].map((city, i) => (
          <g key={city.label}>
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={0.8}
              fill="rgba(255, 255, 255, 0.3)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 + i * 0.08 }}
            />
            <motion.text
              x={city.x + 2}
              y={city.y + 1}
              fill="rgba(255, 255, 255, 0.35)"
              fontSize="2"
              fontFamily="var(--font-display)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 + i * 0.08 }}
            >
              {city.label}
            </motion.text>
          </g>
        ))}
      </svg>

      {/* Hover cards */}
      {MARKERS.map((marker) => (
        <LocationCard
          key={marker.id}
          marker={marker}
          isVisible={hoveredMarker === marker.id}
          onClick={() => handleClick(marker.id)}
        />
      ))}

      {/* Label */}
      <motion.div
        className={styles.mapLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span>Magyarország</span>
        <span className={styles.mapLabelSub}>Kutatási helyszínek</span>
      </motion.div>
    </div>
  )
}
