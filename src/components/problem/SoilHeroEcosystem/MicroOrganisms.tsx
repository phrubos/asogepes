'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { COLORS, SOIL_LAYERS, MicroOrganism } from './types'

interface MicroOrganismsProps {
  isLoaded: boolean
  activeLayer: string | null
}

export default function MicroOrganisms({
  isLoaded,
  activeLayer,
}: MicroOrganismsProps) {
  // Generate organisms positioned in different soil layers
  const organisms = useMemo((): MicroOrganism[] => {
    const result: MicroOrganism[] = []
    let id = 0

    // Bacteria - small dots, mainly in topsoil
    for (let i = 0; i < 15; i++) {
      result.push({
        id: id++,
        x: 10 + Math.random() * 80,
        y: 5 + Math.random() * 30, // Topsoil and subsoil
        type: 'bacteria',
        size: 2 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1,
        angle: Math.random() * 360,
        wobble: Math.random() * 2,
      })
    }

    // Nematodes - worm-like, in subsoil
    for (let i = 0; i < 6; i++) {
      result.push({
        id: id++,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 25,
        type: 'nematode',
        size: 8 + Math.random() * 6,
        speed: 0.3 + Math.random() * 0.5,
        angle: Math.random() * 360,
        wobble: Math.random() * 3,
      })
    }

    // Protozoa - amoeba-like, scattered
    for (let i = 0; i < 8; i++) {
      result.push({
        id: id++,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 40,
        type: 'protozoa',
        size: 4 + Math.random() * 4,
        speed: 0.2 + Math.random() * 0.4,
        angle: Math.random() * 360,
        wobble: Math.random() * 4,
      })
    }

    return result
  }, [])

  // Check if organism is in compacted zone
  const isInCompactedZone = (y: number): boolean => {
    const hardpan = SOIL_LAYERS.find(l => l.id === 'hardpan')
    if (!hardpan) return false
    return y >= hardpan.depth.start && y <= hardpan.depth.end
  }

  // Get layer opacity modifier based on active layer
  const getLayerOpacity = (y: number): number => {
    if (!activeLayer) return 1

    const layer = SOIL_LAYERS.find(l =>
      y >= l.depth.start && y < l.depth.end
    )

    if (!layer) return 1

    // Reduce opacity in compacted/active areas
    if (layer.id === activeLayer || layer.id === 'hardpan') {
      return 0.3
    }

    return 1
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <defs>
        {/* Glow filters for different organism types */}
        <filter id="bacteriaGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        </filter>

        <filter id="nematodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feFlood floodColor={COLORS.organism.nematode} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {organisms.map((org) => {
        const opacityMod = getLayerOpacity(org.y)
        const isCompacted = isInCompactedZone(org.y)

        if (org.type === 'bacteria') {
          return (
            <Bacteria
              key={org.id}
              organism={org}
              isLoaded={isLoaded}
              opacityMod={opacityMod}
              isCompacted={isCompacted}
            />
          )
        }

        if (org.type === 'nematode') {
          return (
            <Nematode
              key={org.id}
              organism={org}
              isLoaded={isLoaded}
              opacityMod={opacityMod}
              isCompacted={isCompacted}
            />
          )
        }

        return (
          <Protozoa
            key={org.id}
            organism={org}
            isLoaded={isLoaded}
            opacityMod={opacityMod}
            isCompacted={isCompacted}
          />
        )
      })}
    </svg>
  )
}

// Bacteria - small glowing dots that drift randomly
function Bacteria({
  organism,
  isLoaded,
  opacityMod,
  isCompacted,
}: {
  organism: MicroOrganism
  isLoaded: boolean
  opacityMod: number
  isCompacted: boolean
}) {
  const duration = 8 + organism.speed * 5

  return (
    <motion.circle
      cx={organism.x}
      cy={organism.y}
      r={organism.size / 2}
      fill={COLORS.organism.bacteria}
      filter="url(#bacteriaGlow)"
      initial={{ opacity: 0, scale: 0 }}
      animate={isLoaded ? {
        opacity: [0, 0.6 * opacityMod, 0.4 * opacityMod, 0.6 * opacityMod],
        scale: isCompacted ? 0.5 : 1,
        x: [0, organism.wobble, -organism.wobble, 0],
        y: [0, organism.wobble * 0.5, -organism.wobble * 0.5, 0],
      } : {}}
      transition={{
        opacity: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        scale: { duration: 0.5 },
        x: {
          duration: duration * 0.7,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        y: {
          duration: duration * 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        delay: organism.id * 0.1,
      }}
    />
  )
}

// Nematode - worm-like creatures that wiggle
function Nematode({
  organism,
  isLoaded,
  opacityMod,
  isCompacted,
}: {
  organism: MicroOrganism
  isLoaded: boolean
  opacityMod: number
  isCompacted: boolean
}) {
  const length = organism.size
  const segments = 4
  const segmentLength = length / segments

  // Generate worm path
  const generatePath = (phase: number) => {
    let d = `M ${organism.x} ${organism.y}`
    let x = organism.x
    let y = organism.y

    for (let i = 0; i < segments; i++) {
      const angle = organism.angle + Math.sin(phase + i * 0.8) * 30
      const rad = (angle * Math.PI) / 180
      x += Math.cos(rad) * segmentLength
      y += Math.sin(rad) * segmentLength * 0.3

      d += ` L ${x} ${y}`
    }

    return d
  }

  const duration = 3 + organism.speed * 2

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={isLoaded ? { opacity: opacityMod * 0.7 } : {}}
      transition={{ duration: 1, delay: organism.id * 0.05 }}
    >
      {/* Worm body with animation */}
      <motion.path
        d={generatePath(0)}
        fill="none"
        stroke={COLORS.organism.nematode}
        strokeWidth={1.5}
        strokeLinecap="round"
        filter="url(#nematodeGlow)"
        animate={isCompacted ? {} : {
          d: [
            generatePath(0),
            generatePath(Math.PI / 2),
            generatePath(Math.PI),
            generatePath(Math.PI * 1.5),
            generatePath(Math.PI * 2),
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Head dot */}
      <motion.circle
        cx={organism.x}
        cy={organism.y}
        r={1}
        fill={COLORS.organism.nematode}
        animate={isCompacted ? {} : {
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: duration * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.g>
  )
}

// Protozoa - amoeba-like blobs that morph
function Protozoa({
  organism,
  isLoaded,
  opacityMod,
  isCompacted,
}: {
  organism: MicroOrganism
  isLoaded: boolean
  opacityMod: number
  isCompacted: boolean
}) {
  const size = organism.size
  const duration = 6 + organism.speed * 4

  // Generate blob path
  const generateBlobPath = (variation: number) => {
    const cx = organism.x
    const cy = organism.y
    const points = 6
    let d = ''

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const wobbleAmount = Math.sin(angle * 3 + variation) * (size * 0.2)
      const r = size / 2 + wobbleAmount

      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r * 0.7

      if (i === 0) {
        d = `M ${x} ${y}`
      } else {
        // Smooth curve
        const prevAngle = ((i - 1) / points) * Math.PI * 2
        const cpAngle = (angle + prevAngle) / 2
        const cpR = size / 2 + Math.sin(cpAngle * 3 + variation) * (size * 0.15)
        const cpX = cx + Math.cos(cpAngle) * cpR * 1.2
        const cpY = cy + Math.sin(cpAngle) * cpR * 0.8

        d += ` Q ${cpX} ${cpY} ${x} ${y}`
      }
    }

    return d + ' Z'
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={isLoaded ? {
        opacity: opacityMod * 0.5,
        scale: isCompacted ? 0.6 : 1,
      } : {}}
      transition={{
        duration: 1,
        delay: 0.5 + organism.id * 0.08,
      }}
    >
      <motion.path
        d={generateBlobPath(0)}
        fill={COLORS.organism.protozoa}
        animate={isCompacted ? {} : {
          d: [
            generateBlobPath(0),
            generateBlobPath(Math.PI * 0.5),
            generateBlobPath(Math.PI),
            generateBlobPath(Math.PI * 1.5),
            generateBlobPath(Math.PI * 2),
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Nucleus */}
      <motion.circle
        cx={organism.x}
        cy={organism.y}
        r={size * 0.15}
        fill="rgba(255, 255, 255, 0.3)"
        animate={isCompacted ? {} : {
          cx: [organism.x - 0.5, organism.x + 0.5, organism.x - 0.5],
          cy: [organism.y - 0.3, organism.y + 0.3, organism.y - 0.3],
        }}
        transition={{
          duration: duration * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.g>
  )
}
