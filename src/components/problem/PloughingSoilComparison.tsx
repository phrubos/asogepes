'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Droplets, Bug, Sprout, ThermometerSun, ArrowDown } from 'lucide-react'
import styles from './PloughingSoilComparison.module.css'

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

// Penetrométer színskála
const getPenetrometerColor = (depth: number, isPloughed: boolean) => {
  if (isPloughed) {
    if (depth < 25) return '#4CAF50' // Zöld - laza
    if (depth < 30) return '#F44336' // Piros - eketalp
    return '#FF9800' // Narancs - tömör
  }
  return '#4CAF50' // Ásógépnél végig zöld
}

// Szántott talaj SVG vizualizáció
const PloughedSoilVisual = ({ isHovered }: { isHovered: boolean }) => {
  const clods = useMemo(() => {
    const data: Array<{ cx: number; cy: number; rx: number; ry: number; type: string }> = []
    let seed = 100
    
    // Felső művelt réteg - nagyobb rögök
    for (let i = 0; i < 25; i++) {
      const cx = 20 + seededRandom(seed++) * 260
      const cy = 50 + seededRandom(seed++) * 70
      const size = 8 + seededRandom(seed++) * 12
      data.push({ cx, cy, rx: size, ry: size * 0.7, type: 'large' })
    }
    
    // Eketalp réteg alatt - nagyon tömör
    for (let i = 0; i < 15; i++) {
      const cx = 20 + seededRandom(seed++) * 260
      const cy = 170 + seededRandom(seed++) * 50
      const size = 15 + seededRandom(seed++) * 10
      data.push({ cx, cy, rx: size, ry: size * 0.5, type: 'compact' })
    }
    
    return data
  }, [])

  // Blokkolt gyökerek
  const blockedRoots = useMemo(() => {
    const roots: Array<{ x: number; path: string }> = []
    for (let i = 0; i < 5; i++) {
      const x = 60 + i * 45
      roots.push({
        x,
        path: `M${x},45 Q${x + (i % 2 === 0 ? 5 : -5)},80 ${x},120 L${x},135`
      })
    }
    return roots
  }, [])

  // Víz részecskék - pangóvíz az eketalp felett
  const waterParticles = useMemo(() => {
    const particles: Array<{ x: number; delay: number }> = []
    for (let i = 0; i < 8; i++) {
      particles.push({ x: 40 + i * 30, delay: i * 0.3 })
    }
    return particles
  }, [])

  return (
    <svg viewBox="0 0 300 250" className={styles.soilSvg}>
      <defs>
        <linearGradient id="ploughedSoilGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="40%" stopColor="#6D4C41" />
          <stop offset="45%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        <linearGradient id="eketalpGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="50%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
        <filter id="soilTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </defs>

      {/* Ég háttér - világos kék */}
      <rect x="0" y="0" width="300" height="45" fill="#7B8FAD" />
      
      {/* Talaj háttér */}
      <rect x="0" y="45" width="300" height="195" fill="url(#ploughedSoilGradient)" />
      
      {/* Textúra overlay */}
      <rect x="0" y="45" width="300" height="195" fill="url(#ploughedSoilGradient)" filter="url(#soilTexture)" opacity="0.3" />
      
      {/* Talajfelszín vonal */}
      <line x1="0" y1="45" x2="300" y2="45" stroke="#8B7355" strokeWidth="2" />

      {/* Eketalp réteg - kiemelt */}
      <motion.g
        animate={{ opacity: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <rect x="0" y="130" width="300" height="25" fill="url(#eketalpGradient)" />
        <motion.rect 
          x="0" y="130" width="300" height="25" 
          fill="#B71C1C" 
          opacity={0.3}
          animate={{ opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Eketalp vonalak */}
        <line x1="0" y1="130" x2="300" y2="130" stroke="#B71C1C" strokeWidth="2" strokeDasharray="8,4" />
        <line x1="0" y1="155" x2="300" y2="155" stroke="#B71C1C" strokeWidth="2" strokeDasharray="8,4" />
      </motion.g>

      {/* Rögök */}
      {clods.map((clod, i) => (
        <motion.ellipse
          key={i}
          cx={clod.cx}
          cy={clod.cy}
          rx={clod.rx}
          ry={clod.ry}
          fill={clod.type === 'large' ? '#A1887F' : '#4E342E'}
          stroke={clod.type === 'compact' ? '#3E2723' : 'none'}
          strokeWidth={1}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: clod.type === 'large' ? 0.8 : 0.9 }}
          transition={{ delay: i * 0.02, type: 'spring', stiffness: 150 }}
        />
      ))}

      {/* Blokkolt gyökerek */}
      {blockedRoots.map((root, i) => (
        <motion.g key={i}>
          <motion.path
            d={root.path}
            stroke="#8D6E63"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
          />
          {/* Blokkolt vég jelzés */}
          <motion.circle
            cx={root.x}
            cy={135}
            r={4}
            fill="#F44336"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 1.3 + i * 0.1 }}
          />
        </motion.g>
      ))}

      {/* Pangóvíz az eketalp felett */}
      {waterParticles.map((p, i) => (
        <motion.ellipse
          key={i}
          cx={p.x}
          cy={125}
          rx={8}
          ry={3}
          fill="#64B5F6"
          opacity={0.6}
          animate={{
            cx: [p.x, p.x + (i % 2 === 0 ? 15 : -15), p.x],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Eketalp címke */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <rect x="100" y="135" width="100" height="18" rx="4" fill="#B71C1C" />
        <text x="150" y="148" fill="white" fontSize="10" fontWeight="700" textAnchor="middle">
          EKETALP (20+ bar)
        </text>
      </motion.g>

      {/* Mélység skála */}
      <g className={styles.depthScale}>
        {depthMarkers.map((depth, i) => {
          const y = 45 + (depth / 30) * 195
          return (
            <g key={depth}>
              <line x1="285" y1={y} x2="295" y2={y} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <text x="280" y={y + 4} fill="rgba(255,255,255,0.8)" fontSize="9" textAnchor="end">
                {depth} cm
              </text>
            </g>
          )
        })}
        <line x1="290" y1="45" x2="290" y2="245" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,4" />
      </g>

      {/* Penetrométer skála (bal oldal) */}
      <g className={styles.penetrometerScale}>
        <defs>
          <linearGradient id="penetrometerPloughed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="40%" stopColor="#8BC34A" />
            <stop offset="45%" stopColor="#F44336" />
            <stop offset="55%" stopColor="#F44336" />
            <stop offset="60%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#FF5722" />
          </linearGradient>
        </defs>
        <rect x="8" y="50" width="8" height="180" rx="4" fill="url(#penetrometerPloughed)" />
        <text x="12" y="42" fill="rgba(255,255,255,0.7)" fontSize="8" textAnchor="middle">bar</text>
      </g>
    </svg>
  )
}

// Ásógépezett talaj SVG vizualizáció
const SpadedSoilVisual = ({ isHovered }: { isHovered: boolean }) => {
  const clods = useMemo(() => {
    const data: Array<{ cx: number; cy: number; rx: number; ry: number; type: string; delay: number }> = []
    let seed = 500
    
    // Egyenletes, apró rögök az egész szelvényben
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 12; col++) {
        const baseX = 15 + col * 24
        const baseY = 55 + row * 23
        const cx = baseX + (seededRandom(seed++) - 0.5) * 12
        const cy = baseY + (seededRandom(seed++) - 0.5) * 10
        
        const rand = seededRandom(seed++)
        let type = 'small'
        let size = 4 + seededRandom(seed++) * 3
        
        if (rand > 0.85) {
          type = 'medium'
          size = 6 + seededRandom(seed++) * 4
        } else if (rand > 0.95) {
          type = 'large'
          size = 8 + seededRandom(seed++) * 3
        }
        
        data.push({ 
          cx, cy, 
          rx: size, 
          ry: size * 0.75, 
          type,
          delay: (row * 12 + col) * 0.008
        })
      }
    }
    return data
  }, [])

  // Egészséges gyökerek - mélyre nyúlnak
  const healthyRoots = useMemo(() => {
    const roots: Array<{ x: number; path: string }> = []
    for (let i = 0; i < 5; i++) {
      const x = 60 + i * 45
      const depth = 180 + seededRandom(i * 100) * 40
      const curve1 = (seededRandom(i * 200) - 0.5) * 30
      const curve2 = (seededRandom(i * 300) - 0.5) * 20
      roots.push({
        x,
        path: `M${x},45 Q${x + curve1},100 ${x + curve2},${depth}`
      })
    }
    return roots
  }, [])

  // Víz részecskék - egyenletesen szivárognak le
  const waterParticles = useMemo(() => {
    const particles: Array<{ x: number; delay: number }> = []
    for (let i = 0; i < 6; i++) {
      particles.push({ x: 50 + i * 40, delay: i * 0.4 })
    }
    return particles
  }, [])

  return (
    <svg viewBox="0 0 300 250" className={styles.soilSvg}>
      <defs>
        <linearGradient id="spadedSoilGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#795548" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
        <filter id="soilTextureSpaded">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </defs>

      {/* Ég háttér - világos kék */}
      <rect x="0" y="0" width="300" height="45" fill="#7B8FAD" />
      
      {/* Talaj háttér - egyenletesebb */}
      <rect x="0" y="45" width="300" height="195" fill="url(#spadedSoilGradient)" />
      <rect x="0" y="45" width="300" height="195" fill="url(#spadedSoilGradient)" filter="url(#soilTextureSpaded)" opacity="0.2" />
      
      {/* Talajfelszín vonal */}
      <line x1="0" y1="45" x2="300" y2="45" stroke="#8B7355" strokeWidth="2" />

      {/* Egyenletes rögök */}
      {clods.map((clod, i) => (
        <motion.ellipse
          key={i}
          cx={clod.cx}
          cy={clod.cy}
          rx={clod.rx}
          ry={clod.ry}
          fill={clod.type === 'small' ? '#BCAAA4' : clod.type === 'medium' ? '#A1887F' : '#8D6E63'}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.85 }}
          transition={{ delay: clod.delay, type: 'spring', stiffness: 200 }}
        />
      ))}

      {/* Egészséges, mély gyökerek */}
      {healthyRoots.map((root, i) => (
        <motion.path
          key={i}
          d={root.path}
          stroke="#A5D6A7"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: 'easeOut' }}
        />
      ))}

      {/* Víz egyenletesen szivárog */}
      {waterParticles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          r={4}
          fill="#64B5F6"
          initial={{ cy: 50, opacity: 0 }}
          animate={{
            cy: [50, 220],
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

      {/* Felszín vonal */}
      <motion.line
        x1="0" y1="45" x2="300" y2="45"
        stroke="#A1887F"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* "Nincs eketalp" címke */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <rect x="90" y="135" width="120" height="18" rx="4" fill="#4CAF50" />
        <text x="150" y="148" fill="white" fontSize="10" fontWeight="700" textAnchor="middle">
          NINCS EKETALP ✓
        </text>
      </motion.g>

      {/* Mélység skála */}
      <g className={styles.depthScale}>
        {[0, 10, 20, 30].map((depth) => {
          const y = 45 + (depth / 30) * 195
          return (
            <g key={depth}>
              <line x1="285" y1={y} x2="295" y2={y} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <text x="280" y={y + 4} fill="rgba(255,255,255,0.8)" fontSize="9" textAnchor="end">
                {depth} cm
              </text>
            </g>
          )
        })}
        <line x1="290" y1="45" x2="290" y2="245" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,4" />
      </g>

      {/* Penetrométer skála (bal oldal) - végig zöld */}
      <g className={styles.penetrometerScale}>
        <defs>
          <linearGradient id="penetrometerSpaded" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#66BB6A" />
          </linearGradient>
        </defs>
        <rect x="8" y="50" width="8" height="180" rx="4" fill="url(#penetrometerSpaded)" />
        <text x="12" y="42" fill="rgba(255,255,255,0.7)" fontSize="8" textAnchor="middle">bar</text>
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
      {/* Fejléc */}
      <motion.div className={styles.header} variants={itemVariants}>
        <h3 className={styles.title}>Talajszelvény Összehasonlítás</h3>
        <p className={styles.subtitle}>
          A Művelt réteg 0-30 cm. A függőleges cm mélység és penetrométeres színskála is látható.
        </p>
      </motion.div>

      {/* Összehasonlító vizualizáció */}
      <motion.div className={styles.comparisonGrid} variants={itemVariants}>
        {/* Szántott talaj */}
        <motion.div 
          className={`${styles.soilCard} ${styles.soilCardBad}`}
          onHoverStart={() => setHoveredSide('ploughed')}
          onHoverEnd={() => setHoveredSide(null)}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.labelBad}>
              <X size={16} strokeWidth={3} />
              <span>Szántott talaj</span>
            </div>
            <span className={styles.badge}>Hagyományos</span>
          </div>
          
          <div className={styles.visualContainer}>
            <PloughedSoilVisual isHovered={hoveredSide === 'ploughed'} />
          </div>

          <div className={styles.caption}>
            A szántott rétegnek egyenletesen a nagy és a túl nagy rögökből kellene állnia, 
            míg az ásógépezett szelvényen a két optimális, kisebb méretű rög jelenne meg.
          </div>

          <motion.ul className={styles.problemList}>
            {ploughedProblems.map((item, i) => (
              <motion.li 
                key={i}
                className={styles.problemItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(244, 67, 54, 0.08)' }}
              >
                <X size={16} className={styles.iconBad} strokeWidth={3} />
                <div>
                  <span className={styles.itemText}>{item.text}</span>
                  <span className={styles.itemDetail}>{item.detail}</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* VS divider */}
        <div className={styles.divider}>
          <motion.div 
            className={styles.vsCircle}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            VS
          </motion.div>
        </div>

        {/* Ásógépezett talaj */}
        <motion.div 
          className={`${styles.soilCard} ${styles.soilCardGood}`}
          onHoverStart={() => setHoveredSide('spaded')}
          onHoverEnd={() => setHoveredSide(null)}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.labelGood}>
              <Check size={16} strokeWidth={3} />
              <span>Ásógépezett talaj</span>
            </div>
            <span className={styles.badgeGood}>Ajánlott</span>
          </div>
          
          <div className={styles.visualContainer}>
            <SpadedSoilVisual isHovered={hoveredSide === 'spaded'} />
          </div>

          <div className={styles.caption}>
            Egyenletesen laza szerkezet alakul ki, a gyökerek szabadon fejlődhetnek 
            és a víz akadálytalanul jut a mélyebb rétegekbe.
          </div>

          <motion.ul className={styles.benefitList}>
            {spadedBenefits.map((item, i) => (
              <motion.li 
                key={i}
                className={styles.benefitItem}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(76, 175, 80, 0.08)' }}
              >
                <Check size={16} className={styles.iconGood} strokeWidth={3} />
                <div>
                  <span className={styles.itemText}>{item.text}</span>
                  <span className={styles.itemDetail}>{item.detail}</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Lábléc megjegyzés */}
      <motion.div className={styles.footer} variants={itemVariants}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: 'linear-gradient(180deg, #4CAF50, #F44336, #FF9800)' }} />
          <span>Penetrométer skála: zöld (laza) → piros (tömör)</span>
        </div>
        <div className={styles.legendItem}>
          <ArrowDown size={14} />
          <span>Vízmozgás iránya a talajban</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
