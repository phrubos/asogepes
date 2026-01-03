'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import styles from './SoilHero.module.css'
import { SVG_CONFIG, ROOT_PATHS, COLORS } from './types'

interface PlantSystemProps {
  isLoaded: boolean
  hoveredNavId: string | null
  onRootAnimationComplete?: (id: string) => void
}

const { surfaceY, plantX, stemHeight } = SVG_CONFIG
// surfaceY = 238 (22% of 1080), stemHeight = 140

export default function PlantSystem({
  isLoaded,
  hoveredNavId,
  onRootAnimationComplete,
}: PlantSystemProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mainRootRef = useRef<SVGPathElement>(null)
  const branchRefs = useRef<{ [key: string]: SVGPathElement | null }>({})
  const hairRefs = useRef<{ [key: string]: SVGGElement | null }>({})
  const [activeRoot, setActiveRoot] = useState<string | null>(null)

  // Animate root branch on hover
  const animateRootBranch = useCallback((id: string, show: boolean) => {
    const branchPath = branchRefs.current[id]
    const hairGroup = hairRefs.current[id]

    if (!branchPath) return

    const length = branchPath.getTotalLength()

    if (show) {
      setActiveRoot(id)

      // Phase 1: Draw the main branch
      gsap.set(branchPath, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      })

      const tl = gsap.timeline()

      // Main branch grows with easing
      tl.to(branchPath, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out',
      })

      // Phase 2: Root hairs appear
      if (hairGroup) {
        const hairs = hairGroup.querySelectorAll('.rootHair')
        tl.fromTo(
          hairs,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 0.6,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.out',
          },
          '-=0.3'
        )
      }

      // Callback when animation completes
      tl.call(() => {
        onRootAnimationComplete?.(id)
      })
    } else {
      // Reverse animation
      const tl = gsap.timeline()

      if (hairGroup) {
        const hairs = hairGroup.querySelectorAll('.rootHair')
        tl.to(hairs, {
          scaleX: 0,
          opacity: 0,
          duration: 0.2,
          stagger: 0.02,
          ease: 'power2.in',
        })
      }

      tl.to(branchPath, {
        strokeDashoffset: length,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => setActiveRoot(null),
      })
    }
  }, [onRootAnimationComplete])

  // Handle hover changes
  useEffect(() => {
    if (hoveredNavId) {
      animateRootBranch(hoveredNavId, true)
    } else if (activeRoot) {
      animateRootBranch(activeRoot, false)
    }
  }, [hoveredNavId, animateRootBranch, activeRoot])

  // Animate main root on load
  useEffect(() => {
    if (isLoaded && mainRootRef.current) {
      const length = mainRootRef.current.getTotalLength()
      gsap.set(mainRootRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })
      gsap.to(mainRootRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        delay: 1.0,
        ease: 'power2.out',
      })
    }
  }, [isLoaded])

  // Generate root hair paths for a branch
  const generateRootHairs = (branchPath: string, positions: number[]) => {
    // Simplified: create perpendicular lines at various points
    return positions.map((pos, i) => {
      const angle = (i % 2 === 0 ? 45 : -45) + Math.random() * 20
      const length = 15 + Math.random() * 10
      return {
        key: i,
        angle,
        length,
        position: pos,
      }
    })
  }

  return (
    <svg
      ref={svgRef}
      className={styles.plantSvg}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Plant gradients */}
        <linearGradient id="plantGreen" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3B6834" />
          <stop offset="50%" stopColor="#4A8040" />
          <stop offset="100%" stopColor="#5D9B4E" />
        </linearGradient>

        <linearGradient id="leafGreen" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3B6834" />
          <stop offset="100%" stopColor="#6BAF5E" />
        </linearGradient>

        {/* Root gradients */}
        <linearGradient id="rootGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFD4" />
          <stop offset="50%" stopColor="#D4C4B0" />
          <stop offset="100%" stopColor="#C9B8A4" />
        </linearGradient>

        <linearGradient id="branchGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4C4B0" />
          <stop offset="100%" stopColor="#C9B8A4" />
        </linearGradient>

        {/* Glow filters */}
        <filter id="plantGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="rootGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#C9A227" floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="nutrientGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#C9A227" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Plant above ground with breathing animation */}
      <motion.g
        className={styles.plantAboveGround}
        filter="url(#plantGlow)"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={isLoaded ? { opacity: 1, scaleY: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${plantX}px ${surfaceY}px` }}
      >
        {/* Main stem with breathing - starts exactly at surfaceY */}
        <motion.path
          d={`M ${plantX} ${surfaceY} C ${plantX - 2} ${surfaceY - stemHeight * 0.35}, ${plantX + 2} ${surfaceY - stemHeight * 0.7}, ${plantX} ${surfaceY - stemHeight}`}
          stroke="url(#plantGreen)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              `M ${plantX} ${surfaceY} C ${plantX - 2} ${surfaceY - stemHeight * 0.35}, ${plantX + 2} ${surfaceY - stemHeight * 0.7}, ${plantX} ${surfaceY - stemHeight}`,
              `M ${plantX} ${surfaceY} C ${plantX - 4} ${surfaceY - stemHeight * 0.35}, ${plantX + 4} ${surfaceY - stemHeight * 0.7}, ${plantX + 2} ${surfaceY - stemHeight - 2}`,
              `M ${plantX} ${surfaceY} C ${plantX - 2} ${surfaceY - stemHeight * 0.35}, ${plantX + 2} ${surfaceY - stemHeight * 0.7}, ${plantX} ${surfaceY - stemHeight}`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Secondary stems */}
        <motion.path
          d={`M ${plantX - 2} ${surfaceY - stemHeight * 0.27} C ${plantX - 12} ${surfaceY - stemHeight * 0.46}, ${plantX - 17} ${surfaceY - stemHeight * 0.68}, ${plantX - 14} ${surfaceY - stemHeight * 0.88}`}
          stroke="url(#plantGreen)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: [-0.5, 0.5, -0.5],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${plantX - 2}px ${surfaceY - stemHeight * 0.27}px` }}
        />
        <motion.path
          d={`M ${plantX + 2} ${surfaceY - stemHeight * 0.29} C ${plantX + 13} ${surfaceY - stemHeight * 0.48}, ${plantX + 18} ${surfaceY - stemHeight * 0.7}, ${plantX + 16} ${surfaceY - stemHeight * 0.91}`}
          stroke="url(#plantGreen)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: [0.5, -0.5, 0.5],
          }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: `${plantX + 2}px ${surfaceY - stemHeight * 0.29}px` }}
        />

        {/* Leaves with independent micro-movements - scaled to stemHeight */}
        {[
          { cx: plantX - 21, cy: surfaceY - stemHeight * 0.73, rx: 8.5, ry: 14, rotate: -42, delay: 0 },
          { cx: plantX - 14, cy: surfaceY - stemHeight * 0.52, rx: 7, ry: 12, rotate: -32, delay: 0.15 },
          { cx: plantX - 7, cy: surfaceY - stemHeight * 0.34, rx: 6, ry: 10, rotate: -22, delay: 0.3 },
          { cx: plantX + 22, cy: surfaceY - stemHeight * 0.77, rx: 9, ry: 16, rotate: 46, delay: 0.1 },
          { cx: plantX + 16, cy: surfaceY - stemHeight * 0.55, rx: 8, ry: 13, rotate: 36, delay: 0.25 },
          { cx: plantX + 8, cy: surfaceY - stemHeight * 0.36, rx: 6.5, ry: 11, rotate: 26, delay: 0.4 },
          { cx: plantX - 9, cy: surfaceY - stemHeight * 0.94, rx: 6.5, ry: 11, rotate: -52, delay: 0.2 },
          { cx: plantX + 10, cy: surfaceY - stemHeight * 0.96, rx: 7, ry: 12, rotate: 56, delay: 0.35 },
        ].map((leaf, i) => (
          <motion.ellipse
            key={i}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="url(#leafGreen)"
            transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
            animate={{
              rotate: [leaf.rotate - 2, leaf.rotate + 2, leaf.rotate - 2],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 3 + (i % 3) * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: leaf.delay,
            }}
            style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
          />
        ))}
      </motion.g>

      {/* Main root below ground */}
      <path
        ref={mainRootRef}
        className={styles.mainRoot}
        d={`M ${plantX} ${surfaceY}
            C ${plantX + 4} ${surfaceY + 90}, ${plantX - 4} ${surfaceY + 180}, ${plantX} ${surfaceY + 280}
            C ${plantX + 6} ${surfaceY + 390}, ${plantX - 6} ${surfaceY + 500}, ${plantX} ${surfaceY + 620}
            C ${plantX + 4} ${surfaceY + 700}, ${plantX - 4} ${surfaceY + 800}, ${plantX} ${surfaceY + 900}`}
        stroke="url(#rootGradient)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        filter="url(#rootGlow)"
      />

      {/* Small root offshoots from main root */}
      {[
        { start: `${plantX} ${surfaceY + 120}`, end: `${plantX + 40} ${surfaceY + 150}` },
        { start: `${plantX} ${surfaceY + 120}`, end: `${plantX - 35} ${surfaceY + 145}` },
        { start: `${plantX} ${surfaceY + 220}`, end: `${plantX + 50} ${surfaceY + 260}` },
        { start: `${plantX} ${surfaceY + 220}`, end: `${plantX - 45} ${surfaceY + 255}` },
        { start: `${plantX} ${surfaceY + 350}`, end: `${plantX + 55} ${surfaceY + 400}` },
        { start: `${plantX} ${surfaceY + 350}`, end: `${plantX - 50} ${surfaceY + 395}` },
        { start: `${plantX} ${surfaceY + 500}`, end: `${plantX + 45} ${surfaceY + 560}` },
        { start: `${plantX} ${surfaceY + 500}`, end: `${plantX - 40} ${surfaceY + 555}` },
      ].map((offshoot, i) => (
        <motion.path
          key={i}
          d={`M ${offshoot.start} Q ${plantX + (i % 2 === 0 ? 20 : -20)} ${surfaceY + 135 + Math.floor(i / 2) * 130}, ${offshoot.end}`}
          stroke="url(#branchGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isLoaded ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ delay: 1.4 + i * 0.08, duration: 0.4 }}
        />
      ))}

      {/* Interactive branch paths - animated on nav hover */}
      {ROOT_PATHS.map((rootPath) => (
        <g key={rootPath.id}>
          {/* Main branch path */}
          <path
            ref={(el) => { branchRefs.current[rootPath.id] = el }}
            className={styles.branchPath}
            d={rootPath.path}
            stroke="url(#branchGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0"
            filter={activeRoot === rootPath.id ? 'url(#rootGlow)' : undefined}
          />

          {/* Root hairs group */}
          <g ref={(el) => { hairRefs.current[rootPath.id] = el }}>
            {rootPath.hairPositions.map((pos, i) => {
              // Deterministic values based on index to avoid hydration mismatch
              const angleOffset = ((i * 7 + 3) % 20) - 10 // Pseudo-random but deterministic
              const angle = (i % 2 === 0 ? -30 : 30) + angleOffset
              const hairLength = 14 + (i % 5) * 2 // Deterministic length variation
              return (
                <line
                  key={i}
                  className="rootHair"
                  x1="0"
                  y1="0"
                  x2={hairLength}
                  y2="0"
                  stroke="#C9B8A4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0"
                  style={{
                    transformOrigin: '0 0',
                    transform: `translate(${1000 + pos * 400}px, ${rootPath.targetY + (i % 3 - 1) * 15}px) rotate(${angle}deg)`,
                  }}
                />
              )
            })}
          </g>

          {/* Nutrient pulse dots (visible when active) */}
          {activeRoot === rootPath.id && (
            <motion.circle
              className={styles.nutrientDot}
              r={5}
              fill="#C9A227"
              filter="url(#nutrientGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                offsetPath: `path('${rootPath.path}')`,
              }}
            />
          )}
        </g>
      ))}
    </svg>
  )
}
