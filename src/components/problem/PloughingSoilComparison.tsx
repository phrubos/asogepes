'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Droplets, Bug, Sprout, ThermometerSun, ArrowDown } from 'lucide-react'
import styles from './PloughingSoilComparison.module.css'
import PloughedSoilSVG from './visualizations/PloughedSoilSVG'

// Determinisztikus random generátor
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  // Round to avoid hydration mismatches from floating point precision
  return Math.round((x - Math.floor(x)) * 10000) / 10000
}

// Szántott talaj problémái
const ploughedProblems = [
  { icon: Sprout, text: 'Eketalp képződik', detail: '25-30 cm mélységben' },
  { icon: Sprout, text: 'A gyökérzet fejlődése korlátozott', detail: 'Nem jut át a tömör rétegen' },
  { icon: Droplets, text: 'A víz mélyebre jutása korlátozott', detail: 'Pangóvíz vagy felszíni elfolyás' },
  { icon: Bug, text: 'A talajélet károsodik', detail: 'Rétegek felcserélődése' },
]

// Ásógépezett talaj előnyei
const spadedBenefits = [
  { icon: Sprout, text: 'Egyenletesen laza szerkezet alakul ki', detail: '0-45 cm mélységig' },
  { icon: Sprout, text: 'A gyökerek szabadon fejlődnek', detail: 'Nincs akadály' },
  { icon: Droplets, text: 'A víz mozgása nem korlátozott', detail: 'Egyenletes eloszlás' },
  { icon: Bug, text: 'A talajélet aktívabb', detail: 'Rétegek megmaradnak' },
]

// Mélység jelölők
const depthMarkers = [0, 10, 20, 30]

// Scale Overlay Komponens
const ScaleOverlays = ({ type }: { type: 'ploughed' | 'spaded' }) => (
  <div className={styles.overlayScales}>
    {/* Bal oldali Penetrométer skála */}
    <div className={styles.scaleLeft}>
      <div className={styles.penetrometerBar}>
        <div
          className={styles.penetrometerBar}
          style={{
            position: 'absolute',
            inset: 0,
            background: type === 'ploughed'
              // Soil Depth scales: 0-30cm.
              // Top 20cm (0-66%) is Green.
              // Bottom 10cm (66-100%) is Red (Compacted).
              // Hard stop at 66% to match the dashed line exactly.
              ? 'linear-gradient(180deg, #4CAF50 0%, #8BC34A 66%, #D32F2F 68%, #D32F2F 100%)'
              : 'linear-gradient(180deg, #4CAF50 0%, #66BB6A 100%)'
          }}
        />
        <span className={styles.penetrometerLabel}>bar</span>
      </div>
    </div>

    {/* Jobb oldali Mélység skála */}
    <div className={styles.scaleRight}>
      <div className={styles.depthMarkers}>
        {[0, 10, 20, 30].map((depth) => (
          <div
            key={depth}
            className={styles.depthMarker}
            style={{ top: `${(depth / 30) * 100}%` }}
          >
            <span className={styles.depthText}>{depth} cm</span>
            <div className={styles.depthLine} />
          </div>
        ))}
      </div>
    </div>
  </div>
)


// Generate organic clod shape (irregular polygon)
const generateClodPath = (cx: number, cy: number, r: number, seed: number) => {
  const points = []
  const numPoints = 8 + Math.floor(seededRandom(seed) * 4) // 8-12 points
  const angleStep = (Math.PI * 2) / numPoints

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep
    const rVar = r * (0.8 + seededRandom(seed + i) * 0.3)
    const px = cx + Math.cos(angle) * rVar
    const py = cy + Math.sin(angle) * rVar
    points.push(`${px},${py}`)
  }
  return `M${points.join(' L')} Z`
}

// Ásógépezett talaj SVG vizualizáció - 600px széles
const SpadedSoilVisual = ({ isHovered }: { isHovered: boolean }) => {
  // Color palette matching PloughedSoilSVG style exactly
  const darkPalette = [
    '#4E342E', // Darkest (Subsoil)
    '#5D4037', // Medium Dark
    '#6D4C41'  // Lightest Dark
  ]

  const lightPalette = [
    '#6B5344', // Darkest Light
    '#795548', // Medium Light
    '#8B7355'  // Lightest (Topsoil base)
  ]

  const soilBgColor = '#3E2723' // Deep brown background

  const clods = useMemo(() => {
    const data: Array<{ id: string; cx: number; cy: number; path: string; isDark: boolean; variantIndex: number; delay: number }> = []
    let seed = 500
    const width = 600
    // ViewBox Y geometry - soil starts at y=30 (0cm mark)
    const soilSurface = 75
    const maxDepth = 250 // Bottom of SVG - corresponds to 30cm

    // Uniform Spaded Soil Structure (0-30cm)
    // Random mixing of light and dark clods, but uniform size distribution (loose structure)

    for (let y = soilSurface + 8; y < maxDepth; y += 12) {
      for (let x = -10; x < width + 10; x += 12) {
        // Jitter
        const jx = x + (seededRandom(seed++) - 0.5) * 10
        const jy = y + (seededRandom(seed++) - 0.5) * 10

        // Uniform mixing probability - Spading machine mixes everything nicely
        // ~30% dark clods (from subsoil mixing), ~70% light clods
        const isDark = seededRandom(seed++) < 0.3

        if (isDark) {
          // Mixed Dark Clod (Small/Medium)
          const rRand = seededRandom(seed++)
          let variant = 2
          let r = 6

          if (rRand > 0.7) {
            variant = 1 // Medium dark
            r = 7 + seededRandom(seed++) * 2
          } else {
            variant = 2 // Small dark
            r = 5 + seededRandom(seed++) * 2
          }

          const path = generateClodPath(jx, jy, r, seed++)

          data.push({
            id: `mixed-dark-${data.length}`,
            cx: jx, cy: jy, path,
            isDark: true,
            variantIndex: variant,
            delay: (y * width + x) * 0.00005
          })
        } else {
          // Light Clod (Loose topsoil structure)
          const rRand = seededRandom(seed++)
          let variant = 2
          let r = 5

          if (rRand > 0.8) {
            variant = 0 // Large Light
            r = 7.5 + seededRandom(seed++) * 2
          } else if (rRand > 0.4) {
            variant = 1 // Medium Light
            r = 6 + seededRandom(seed++) * 2
          } else {
            variant = 2 // Small Light
            r = 4.5 + seededRandom(seed++) * 2
          }

          const path = generateClodPath(jx, jy, r, seed++)

          data.push({
            id: `top-${data.length}`,
            cx: jx, cy: jy, path,
            isDark: false,
            variantIndex: variant,
            delay: (y * width + x) * 0.00005
          })
        }
      }
    }

    return data.sort((a, b) => a.cy - b.cy)
  }, [])

  // Víz részecskék - egyenletesen szivárognak le
  const waterParticles = useMemo(() => {
    const particles: Array<{ x: number; delay: number }> = []
    for (let i = 0; i < 12; i++) {
      const x = 50 + i * 45
      particles.push({ x, delay: i * 0.2 })
    }
    return particles
  }, [])

  return (
    <svg viewBox="0 0 600 250" className={styles.soilSvg} preserveAspectRatio="none">
      <defs>
        <filter id="soilTextureSpaded">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </defs>

      {/* Ég háttér - világos kék - 0cm-nél kezdődik a talaj */}
      <rect x="0" y="0" width="600" height="90" fill="#7B8FAD" />

      {/* Talaj háttér - 0cm-től indul */}
      <rect x="0" y="78" width="600" height="180" fill={soilBgColor} />

      {/* Rögök */}
      {clods.map((clod) => (
        <path
          key={clod.id}
          d={clod.path}
          fill={clod.isDark ? darkPalette[clod.variantIndex] : lightPalette[clod.variantIndex]}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={0.5}
        />
      ))}

      {/* Filter Overlay */}
      <rect x="0" y="72" width="600" height="180" fill="none" filter="url(#soilTextureSpaded)" opacity="0.2" pointerEvents="none" />

      {/* Víz egyenletesen szivárog */}
      {waterParticles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          r={4}
          fill="#64B5F6"
          initial={{ cy: 55, opacity: 0 }}
          animate={{
            cy: [55, 240],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 4,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Felszín vonal - 0cm-nél
      <line
        x1="0" y1="72" x2="600" y2="72"
        stroke="#5D4037"
        strokeWidth="2"
      /> */}

      {/* "Nincs eketalp" címke */}
      <g>
        <rect x="230" y="165" width="140" height="22" rx="4" fill="#4CAF50" />
        <text x="300" y="180" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">
          NINCS EKETALP ✓
        </text>
      </g>
    </svg>
  )
}

export default function PloughingSoilComparison() {
  const [hoveredSide, setHoveredSide] = useState<'ploughed' | 'spaded' | null>(null)
  const [activeTab, setActiveTab] = useState<'visual' | 'list'>('visual')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Fejléc REMOVED */}

      {/* Összehasonlító vizualizáció */}
      <motion.div className={styles.comparisonGrid} variants={itemVariants} style={{ gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Szántott talaj */}
        <motion.div
          className={`${styles.soilCard} ${styles.soilCardBad}`}
          onHoverStart={() => setHoveredSide('ploughed')}
          onHoverEnd={() => setHoveredSide(null)}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className={styles.cardHeader} style={{ padding: '0.5rem 0.75rem' }}>
            <div className={styles.labelBad} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <X size={14} strokeWidth={3} />
              <span>Szántott talaj</span>
            </div>

          </div>

          <div className={styles.visualContainer} style={{ padding: '0.5rem', position: 'relative' }}>
            <PloughedSoilSVG />
            <ScaleOverlays type="ploughed" />
          </div>

          <motion.ul className={styles.problemList} style={{ padding: '0.5rem', gap: '0.25rem' }}>
            {ploughedProblems.map((item, i) => (
              <motion.li
                key={i}
                className={styles.problemItem}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.05 }}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <X size={12} className={styles.iconBad} strokeWidth={3} />
                <div>
                  <span className={styles.itemText} style={{ fontSize: '0.75rem' }}>{item.text}</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* VS divider */}
        <div className={styles.divider} style={{ padding: '0.5rem 0' }}>
          <motion.div
            className={styles.vsCircle}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}
          >
            VS
          </motion.div>
        </div>

        {/* Ásógépezett talaj */}
        <motion.div
          className={`${styles.soilCard} ${styles.soilCardGood}`}
          onHoverStart={() => setHoveredSide('spaded')}
          onHoverEnd={() => setHoveredSide(null)}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className={styles.cardHeader} style={{ padding: '0.5rem 0.75rem' }}>
            <div className={styles.labelGood} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <Check size={14} strokeWidth={3} />
              <span>Ásógépezett talaj</span>
            </div>

          </div>

          <div className={styles.visualContainer}>
            <SpadedSoilVisual isHovered={hoveredSide === 'spaded'} />
            <ScaleOverlays type="spaded" />
          </div>

          <motion.ul className={styles.benefitList} style={{ padding: '0.5rem', gap: '0.25rem' }}>
            {spadedBenefits.map((item, i) => (
              <motion.li
                key={i}
                className={styles.benefitItem}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.05 }}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <Check size={12} className={styles.iconGood} strokeWidth={3} />
                <div>
                  <span className={styles.itemText} style={{ fontSize: '0.75rem' }}>{item.text}</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Lábléc megjegyzés REMOVED */}
    </motion.div>
  )
}
