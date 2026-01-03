'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { COLORS, SOIL_LAYERS } from './types'

interface RootSystemProps {
  isLoaded: boolean
  activeLayer: string | null
  containerHeight: number
}

interface RootPath {
  id: string
  d: string
  thickness: number
  delay: number
  healthyLength: number
  stressedAt: number // Y position where root becomes stressed
}

export default function RootSystem({
  isLoaded,
  activeLayer,
  containerHeight,
}: RootSystemProps) {
  // Generate organic root paths
  const rootPaths = useMemo((): RootPath[] => {
    const paths: RootPath[] = []
    const rootCount = 5

    for (let i = 0; i < rootCount; i++) {
      const startX = 30 + (i * 15) + (Math.random() * 10 - 5)
      let currentX = startX
      let currentY = 0

      // Build path with organic curves
      let d = `M ${startX} 0`
      const segments = 8 + Math.floor(Math.random() * 4)
      const segmentHeight = 100 / segments

      for (let j = 0; j < segments; j++) {
        const nextY = currentY + segmentHeight
        const wobble = (Math.random() - 0.5) * 15
        const nextX = currentX + wobble

        // Create bezier curve for organic feel
        const cp1x = currentX + (Math.random() - 0.5) * 8
        const cp1y = currentY + segmentHeight * 0.3
        const cp2x = nextX + (Math.random() - 0.5) * 8
        const cp2y = nextY - segmentHeight * 0.3

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`

        currentX = nextX
        currentY = nextY
      }

      // Find where hardpan layer starts (stress point)
      const hardpanLayer = SOIL_LAYERS.find(l => l.id === 'hardpan')
      const stressedAt = hardpanLayer ? hardpanLayer.depth.start : 45

      paths.push({
        id: `root-${i}`,
        d,
        thickness: 3 - i * 0.4 + Math.random() * 0.5,
        delay: i * 0.15,
        healthyLength: stressedAt,
        stressedAt,
      })

      // Add sub-branches
      if (i < 3) {
        const branchStartY = 15 + Math.random() * 20
        const branchX = startX + (Math.random() - 0.5) * 10
        const branchDir = i % 2 === 0 ? 1 : -1

        let branchD = `M ${branchX} ${branchStartY}`
        let bx = branchX
        let by = branchStartY

        for (let k = 0; k < 4; k++) {
          const nextY = by + 8 + Math.random() * 6
          const nextX = bx + branchDir * (8 + Math.random() * 6)

          branchD += ` Q ${bx + branchDir * 4} ${by + 5}, ${nextX} ${nextY}`
          bx = nextX
          by = nextY
        }

        paths.push({
          id: `branch-${i}`,
          d: branchD,
          thickness: 1.5 + Math.random() * 0.5,
          delay: 0.3 + i * 0.1,
          healthyLength: 40,
          stressedAt: 35,
        })
      }
    }

    return paths
  }, [])

  // Calculate stress level based on active layer
  const getStressLevel = (path: RootPath): number => {
    if (activeLayer === 'hardpan' || activeLayer === 'ploughing') return 0.8
    if (activeLayer === 'subsoil' || activeLayer === 'cultivator') return 0.4
    return 0
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: '15%',
        top: 0,
        width: '35%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 12,
      }}
    >
      <defs>
        {/* Gradient for healthy root */}
        <linearGradient id="rootHealthy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.root.healthy} stopOpacity="0.9" />
          <stop offset="60%" stopColor={COLORS.root.healthy} stopOpacity="0.7" />
          <stop offset="100%" stopColor={COLORS.root.stressed} stopOpacity="0.4" />
        </linearGradient>

        {/* Gradient for stressed root */}
        <linearGradient id="rootStressed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.root.healthy} stopOpacity="0.9" />
          <stop offset="40%" stopColor={COLORS.root.stressed} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6B4A3A" stopOpacity="0.3" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="rootGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Root tip marker */}
        <marker id="rootTip" markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle cx="2" cy="2" r="1.5" fill={COLORS.root.tip} opacity="0.8" />
        </marker>
      </defs>

      {/* Render root paths */}
      {rootPaths.map((path) => {
        const stressLevel = getStressLevel(path)
        const isStressed = stressLevel > 0.3

        return (
          <g key={path.id}>
            {/* Root glow/shadow */}
            <motion.path
              d={path.d}
              fill="none"
              stroke="rgba(90, 143, 90, 0.3)"
              strokeWidth={path.thickness + 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#rootGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isLoaded ? {
                pathLength: isStressed ? 0.5 : 0.85,
                opacity: 0.5,
              } : {}}
              transition={{
                pathLength: {
                  duration: 2,
                  delay: path.delay + 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: { duration: 0.5, delay: path.delay },
              }}
            />

            {/* Main root path */}
            <motion.path
              d={path.d}
              fill="none"
              stroke={isStressed ? 'url(#rootStressed)' : 'url(#rootHealthy)'}
              strokeWidth={path.thickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isLoaded ? {
                pathLength: isStressed ? 0.5 : 0.85,
                opacity: 1,
              } : {}}
              transition={{
                pathLength: {
                  duration: 2,
                  delay: path.delay + 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: { duration: 0.5, delay: path.delay },
              }}
            />

            {/* Fine root hairs (only on main roots) */}
            {path.id.startsWith('root-') && (
              <RootHairs
                parentPath={path}
                isLoaded={isLoaded}
                isStressed={isStressed}
              />
            )}
          </g>
        )
      })}

      {/* Stress indicator overlay */}
      {activeLayer && (
        <motion.rect
          x="0"
          y={SOIL_LAYERS.find(l => l.id === 'hardpan')?.depth.start || 45}
          width="100"
          height="15"
          fill="rgba(255, 100, 100, 0.1)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </svg>
  )
}

// Fine root hairs component
function RootHairs({
  parentPath,
  isLoaded,
  isStressed,
}: {
  parentPath: RootPath
  isLoaded: boolean
  isStressed: boolean
}) {
  const hairs = useMemo(() => {
    const result: { x: number; y: number; length: number; angle: number }[] = []
    const hairCount = 12

    for (let i = 0; i < hairCount; i++) {
      const t = (i + 1) / (hairCount + 1)
      const y = t * (isStressed ? 45 : 70)

      // Estimate X position (simplified)
      const x = 30 + (Math.random() - 0.5) * 20

      result.push({
        x,
        y,
        length: 3 + Math.random() * 4,
        angle: (Math.random() - 0.5) * 60 + (i % 2 === 0 ? -45 : 45),
      })
    }

    return result
  }, [isStressed])

  return (
    <>
      {hairs.map((hair, i) => {
        const endX = hair.x + Math.cos((hair.angle * Math.PI) / 180) * hair.length
        const endY = hair.y + Math.sin((hair.angle * Math.PI) / 180) * hair.length

        return (
          <motion.line
            key={i}
            x1={hair.x}
            y1={hair.y}
            x2={endX}
            y2={endY}
            stroke={COLORS.root.healthy}
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isLoaded ? {
              pathLength: 1,
              opacity: hair.y > 40 && isStressed ? 0.2 : 0.6,
            } : {}}
            transition={{
              duration: 0.5,
              delay: 1.5 + i * 0.05,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </>
  )
}
