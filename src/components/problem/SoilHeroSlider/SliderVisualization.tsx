'use client'

import { useRef, useMemo, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion'
import styles from './SoilHeroSlider.module.css'
import { COLORS, ANIMATION, PARTICLE_CONFIG, ROOT_CONFIG } from './types'

interface SliderVisualizationProps {
  isLoaded: boolean
  sliderPosition: number
  onSliderChange: (position: number) => void
  isDragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
}

export default function SliderVisualization({
  isLoaded,
  sliderPosition,
  onSliderChange,
  isDragging,
  onDragStart,
  onDragEnd,
}: SliderVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Smooth spring for slider position
  const springConfig = { damping: ANIMATION.sliderDamping, stiffness: ANIMATION.sliderStiffness }
  const smoothPosition = useSpring(sliderPosition, springConfig)

  // Handle drag
  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = 'clientX' in event ? event.clientX : (event as TouchEvent).touches[0].clientX
      const relativeX = x - rect.left
      const percentage = Math.max(5, Math.min(95, (relativeX / rect.width) * 100))
      onSliderChange(percentage)
    },
    [onSliderChange]
  )

  // Generate healthy soil particles (organic, scattered)
  const healthyParticles = useMemo(() => {
    const config = PARTICLE_CONFIG.healthy
    return Array.from({ length: config.count }, (_, i) => ({
      id: `healthy-${i}`,
      cx: 5 + Math.random() * 90,
      cy: 20 + Math.random() * 75,
      r: config.minSize + Math.random() * (config.maxSize - config.minSize),
      opacity: 0.3 + Math.random() * config.opacity,
      animDelay: Math.random() * 5,
      animDuration: 3 + Math.random() * 4,
    }))
  }, [])

  // Generate damaged soil particles (compressed, layered)
  const damagedParticles = useMemo(() => {
    const config = PARTICLE_CONFIG.damaged
    return Array.from({ length: config.count }, (_, i) => ({
      id: `damaged-${i}`,
      cx: 10 + Math.random() * 80,
      cy: 25 + Math.random() * 70,
      r: config.minSize + Math.random() * (config.maxSize - config.minSize),
      opacity: 0.2 + Math.random() * config.opacity,
      isFlattened: Math.random() > 0.3,
    }))
  }, [])

  // Generate healthy roots (deep, branching)
  const healthyRoots = useMemo(() => {
    const roots = []
    const config = ROOT_CONFIG.healthy
    const rootCount = 5

    for (let r = 0; r < rootCount; r++) {
      const startX = 20 + (r * 60) / rootCount + Math.random() * 10
      let path = `M ${startX} 18`
      let currentX = startX
      let currentY = 18

      for (let s = 0; s < config.segments; s++) {
        const segmentLength = 8 + Math.random() * 12
        const curve = (Math.random() - 0.5) * 15
        currentY += segmentLength
        currentX += curve

        if (currentY > config.maxDepth) break

        path += ` Q ${currentX + curve / 2} ${currentY - segmentLength / 2} ${currentX} ${currentY}`

        // Add branches
        if (s > 1 && Math.random() > 0.5) {
          const branchDir = Math.random() > 0.5 ? 1 : -1
          const branchPath = `M ${currentX} ${currentY} q ${branchDir * (8 + Math.random() * 12)} ${4 + Math.random() * 8} ${branchDir * (15 + Math.random() * 10)} ${8 + Math.random() * 6}`
          roots.push({
            id: `healthy-branch-${r}-${s}`,
            d: branchPath,
            strokeWidth: 1 + Math.random(),
            opacity: 0.4 + Math.random() * 0.3,
            animDelay: Math.random() * 2,
          })
        }
      }

      roots.push({
        id: `healthy-root-${r}`,
        d: path,
        strokeWidth: 2 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.3,
        animDelay: r * 0.3,
      })
    }

    return roots
  }, [])

  // Generate damaged roots (shallow, sparse)
  const damagedRoots = useMemo(() => {
    const roots = []
    const config = ROOT_CONFIG.damaged
    const rootCount = 3

    for (let r = 0; r < rootCount; r++) {
      const startX = 30 + (r * 40) / rootCount + Math.random() * 10
      let path = `M ${startX} 18`
      let currentX = startX
      let currentY = 18

      for (let s = 0; s < config.segments; s++) {
        const segmentLength = 4 + Math.random() * 6
        const curve = (Math.random() - 0.5) * 8
        currentY += segmentLength
        currentX += curve

        if (currentY > config.maxDepth) break

        path += ` L ${currentX} ${currentY}`
      }

      roots.push({
        id: `damaged-root-${r}`,
        d: path,
        strokeWidth: 1 + Math.random(),
        opacity: 0.3 + Math.random() * 0.2,
      })
    }

    return roots
  }, [])

  // Generate water drops for healthy soil
  const waterDrops = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: `water-${i}`,
      startX: 15 + Math.random() * 70,
      delay: i * 0.8 + Math.random() * 2,
      duration: 2.5 + Math.random() * 1.5,
      size: 2 + Math.random() * 2,
    }))
  }, [])

  // Container entrance animation
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      ref={containerRef}
      className={`${styles.sliderContainer} ${isDragging ? styles.dragging : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
    >
      {/* Damaged Soil Layer (Background) */}
      <div className={`${styles.soilLayer} ${styles.soilLayerDamaged}`}>
        <svg
          className={styles.soilSvgOverlay}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Compacted layer lines */}
          <defs>
            <linearGradient id="damagedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5C4A3D" />
              <stop offset="50%" stopColor="#4A2F17" />
              <stop offset="100%" stopColor="#2D1A0D" />
            </linearGradient>
          </defs>

          {/* Horizontal compression lines */}
          {[30, 45, 58, 70, 82].map((y, i) => (
            <motion.line
              key={`compress-${i}`}
              x1="5"
              y1={y}
              x2="95"
              y2={y + (Math.random() - 0.5) * 3}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
            />
          ))}

          {/* Damaged particles (flattened, compressed) */}
          {damagedParticles.map((p) => (
            <ellipse
              key={p.id}
              cx={p.cx}
              cy={p.cy}
              rx={p.isFlattened ? p.r * 1.8 : p.r}
              ry={p.isFlattened ? p.r * 0.5 : p.r * 0.7}
              fill={COLORS.damaged.soil}
              opacity={p.opacity}
            />
          ))}

          {/* Damaged roots (shallow, weak) */}
          {damagedRoots.map((root) => (
            <motion.path
              key={root.id}
              d={root.d}
              stroke={COLORS.damaged.root}
              strokeWidth={root.strokeWidth}
              fill="none"
              opacity={root.opacity}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          ))}

          {/* Stagnant water pools */}
          <motion.ellipse
            cx="50"
            cy="42"
            rx="25"
            ry="4"
            fill={COLORS.damaged.water}
            opacity="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
          <motion.ellipse
            cx="35"
            cy="65"
            rx="18"
            ry="3"
            fill={COLORS.damaged.water}
            opacity="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          />
        </svg>
      </div>

      {/* Healthy Soil Layer (Foreground with clip-path) */}
      <motion.div
        className={`${styles.soilLayer} ${styles.soilLayerHealthy}`}
        style={{
          clipPath: useTransform(smoothPosition, (v) => `inset(0 ${100 - v}% 0 0)`),
        }}
      >
        <svg
          className={styles.soilSvgOverlay}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="healthyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A6B52" />
              <stop offset="30%" stopColor="#8B7355" />
              <stop offset="100%" stopColor="#7A5C3D" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Organic soil particles (round, scattered, breathing) */}
          {healthyParticles.map((p) => (
            <motion.circle
              key={p.id}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={COLORS.healthy.soilLight}
              opacity={p.opacity}
              animate={{
                r: [p.r, p.r * 1.15, p.r],
                opacity: [p.opacity, p.opacity * 0.8, p.opacity],
              }}
              transition={{
                duration: p.animDuration,
                delay: p.animDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Air pockets (pores) */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.circle
              key={`pore-${i}`}
              cx={10 + Math.random() * 80}
              cy={25 + Math.random() * 65}
              r={1.5 + Math.random() * 2}
              fill="rgba(255,255,255,0.15)"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Healthy roots (deep, branching, breathing) */}
          {healthyRoots.map((root) => (
            <motion.path
              key={root.id}
              d={root.d}
              stroke={COLORS.healthy.root}
              strokeWidth={root.strokeWidth}
              fill="none"
              opacity={root.opacity}
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                strokeWidth: [root.strokeWidth, root.strokeWidth * 1.2, root.strokeWidth],
              }}
              transition={{
                pathLength: { duration: 2, delay: root.animDelay },
                strokeWidth: {
                  duration: ANIMATION.rootBreathingSpeed,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          ))}

          {/* Water drops flowing down */}
          {waterDrops.map((drop) => (
            <motion.circle
              key={drop.id}
              cx={drop.startX}
              r={drop.size}
              fill={COLORS.healthy.water}
              opacity="0.6"
              filter="url(#glow)"
              initial={{ cy: 18, opacity: 0 }}
              animate={{
                cy: [18, 95],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                repeat: Infinity,
                ease: 'easeIn',
              }}
            />
          ))}

          {/* Microorganism dots */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.circle
              key={`micro-${i}`}
              r={0.8 + Math.random() * 0.8}
              fill="#8FBC8F"
              opacity="0.5"
              initial={{
                cx: 10 + Math.random() * 80,
                cy: 30 + Math.random() * 60,
              }}
              animate={{
                cx: [null, 10 + Math.random() * 80],
                cy: [null, 30 + Math.random() * 60],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className={styles.sliderHandle}
        style={{ left: `${sliderPosition}%` }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDrag={handleDrag}
        onDragEnd={onDragEnd}
      >
        <div className={styles.sliderHandleLine} />
        <motion.div
          className={`${styles.sliderHandleGrip} ${isDragging ? styles.dragging : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={styles.sliderHandleIcon}>
            <svg
              className={styles.sliderHandleArrow}
              viewBox="0 0 8 14"
              fill="currentColor"
            >
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <svg
              className={styles.sliderHandleArrow}
              viewBox="0 0 8 14"
              fill="currentColor"
              style={{ transform: 'rotate(180deg)' }}
            >
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <div className={styles.sliderLabels}>
        <motion.div
          className={`${styles.sliderLabel} ${styles.sliderLabelHealthy}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: sliderPosition > 20 ? 1 : 0.3, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Egészséges
        </motion.div>
        <motion.div
          className={`${styles.sliderLabel} ${styles.sliderLabelDamaged}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: sliderPosition < 80 ? 1 : 0.3, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Sérült
        </motion.div>
      </div>

      {/* Depth Scale */}
      <div className={styles.depthScale}>
        {[0, 15, 35, 55].map((depth) => (
          <div key={depth} className={styles.depthMark}>
            <div className={styles.depthLine} />
            <span className={styles.depthValue}>{depth} cm</span>
          </div>
        ))}
      </div>

      {/* Frame Decoration */}
      <div className={styles.sliderFrame}>
        <div className={`${styles.frameCorner} ${styles.topLeft}`} />
        <div className={`${styles.frameCorner} ${styles.topRight}`} />
        <div className={`${styles.frameCorner} ${styles.bottomLeft}`} />
        <div className={`${styles.frameCorner} ${styles.bottomRight}`} />
      </div>
    </motion.div>
  )
}
