'use client'

import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion'
import { useEffect, useMemo } from 'react'

interface InteractiveSoilProps {
  progress: number | MotionValue<number> // 0.0 to 4.0
  isHovered: boolean
  setIsHovered: (hover: boolean) => void
}

export default function InteractiveSoil({ progress, isHovered, setIsHovered }: InteractiveSoilProps) {
  const progressMV = useMotionValue(0)
  const activeProgress = (typeof progress === 'number') ? progressMV : progress

  useEffect(() => {
    if (typeof progress === 'number') {
      progressMV.set(progress)
    }
  }, [progress, progressMV])


  // --- PATH DEFINITIONS (PREMIUM QUALITY) ---

  // 1. STEM (Thirsty Morph)
  const stemPaths = [
    "M295,150 C295,120 298,90 298,60 L302,60 C302,90 305,120 305,150 Z",
    "M295,150 C295,122 298,95 298,65 L302,65 C302,95 305,122 305,150 Z",
    "M294,150 C294,125 297,100 297,75 L303,75 C303,100 306,125 306,150 Z",
    "M294,150 C294,125 298,105 298,85 L302,85 C302,105 306,125 306,150 Z",
    "M293,150 C293,130 299,110 299,95 L301,95 C301,110 307,130 307,150 Z"
  ]

  // 2. LEAVES (Organic Morph - NO Clipping)
  const leavesPaths = [
    // 0: Perky
    "M298,100 Q250,60 200,80 Q250,110 298,110 M302,105 Q350,65 400,85 Q350,115 302,115",

    // 1: Slightly lower
    "M298,105 Q250,75 200,95 Q250,115 298,115 M302,110 Q350,80 400,100 Q350,120 302,120",

    // 2: Horizontal / Neutral
    "M298,110 Q250,100 205,115 Q250,125 298,120 M302,115 Q350,105 395,120 Q350,130 302,125",

    // 3: Drooping
    "M296,115 Q240,125 210,140 Q250,150 296,128 M304,120 Q360,130 390,145 Q350,148 304,133",

    // 4: Wilted / Thirsty (Right leaf raised)
    // Left Tip: 220,148. Right Tip: 380,148. (Strictly < 150)
    "M295,125 Q245,140 220,148 Q250,150 295,135 M305,130 Q355,140 380,148 Q350,150 305,140"
  ]

  // 3. ROOTS - "Fountain Style" (As per reference image)
  const rootMassPaths = [
    // 0: Full Extension (Healthy)
    `M300,150 Q280,250 230,400 
       M300,150 Q290,280 270,420 
       M300,150 Q310,280 330,420 
       M300,150 Q320,250 370,400`,

    // 1: Slightly less spread?
    `M300,150 Q280,250 230,380 
       M300,150 Q290,280 270,400 
       M300,150 Q310,280 330,400 
       M300,150 Q320,250 370,380`,

    // 2: Starting to hit layer?
    `M300,150 Q280,250 230,350 
       M300,150 Q290,280 270,370 
       M300,150 Q310,280 330,370 
       M300,150 Q320,250 370,350`,

    // 3: Diverting
    `M300,150 Q270,200 220,220 
       M300,150 Q285,220 250,230 
       M300,150 Q315,220 350,230 
       M300,150 Q330,200 380,220`,

    // 4: Shallow / Surface (Compacted)
    `M300,150 Q260,180 210,185 
       M300,150 Q280,185 240,190 
       M300,150 Q320,185 360,190 
       M300,150 Q340,180 390,185`
  ]

  // 4. SPECIAL ROOT (Shortened + Zigzag)
  const specialRootPaths = [
    "M300,150 Q300,250 300,450 M300,255 L300,255 M300,255 L300,255",
    "M300,150 Q300,250 300,450 M300,255 L300,255 M300,255 L300,255",
    "M300,150 Q300,250 300,400 M300,255 L300,255 M300,255 L300,255",
    "M300,150 Q300,250 290,350 M300,255 L280,275 M300,255 L320,275",
    "M300,150 Q300,200 300,295 M300,255 L260,285 M300,255 L340,285"
  ]


  // --- INTERPOLATIONS ---
  const layerColor = useTransform(activeProgress, [0, 1, 2, 3, 4],
    ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#D32F2F'])
  const layerOpacity = useTransform(activeProgress, [0, 4], [0.2, 0.5])
  const textOpacity = useTransform(activeProgress, [0, 4], [0.5, 1])

  const stemD = useTransform(activeProgress, [0, 1, 2, 3, 4], stemPaths)
  const leavesD = useTransform(activeProgress, [0, 1, 2, 3, 4], leavesPaths)
  const rootsMassD = useTransform(activeProgress, [0, 1, 2, 3, 4], rootMassPaths)
  const specialRootD = useTransform(activeProgress, [0, 1, 2, 3, 4], specialRootPaths)

  const plantColor = useTransform(activeProgress, [0, 4], ['#2E7D32', '#558B2F'])
  const leafColor = useTransform(activeProgress, [0, 4], ['#43A047', '#827717'])
  const rootColor = '#8D6E63';

  // Water Logic
  const waterThroughOpacity = useTransform(activeProgress, [0, 2, 4], [1, 0.5, 0])
  const waterPoolOpacity = useTransform(activeProgress, [0, 2.5, 4], [0, 0.1, 0.6])

  const PAN_START_Y = 185;
  const PAN_END_Y = 255;

  const skyRain = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i, x: 50 + Math.random() * 500, delay: Math.random() * 2
  })), [])
  const soilDrops = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i, x: 50 + Math.random() * 500, delay: Math.random() * 2.5
  })), [])

  return (
    <motion.div
      className="relative w-full h-full bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-white/10"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ cursor: isHovered ? 'grab' : 'default' }}
    >
      <div className="w-full h-full relative select-none" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 600 500" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="skyGradientPremium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FC3F7" />
              <stop offset="60%" stopColor="#81D4FA" />
              <stop offset="100%" stopColor="#B3E5FC" />
            </linearGradient>

            <pattern id="soilTexture" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="10" fill="#3E2723" />
              <circle cx="2" cy="2" r="1.5" fill="#4E342E" />
              <circle cx="7" cy="8" r="1" fill="#5D4037" />
            </pattern>
            <linearGradient id="soilDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
            </linearGradient>

            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <mask id="waterFlowMask">
              <rect x="0" y="150" width="600" height={PAN_START_Y - 150} fill="white" />
              <motion.rect
                x="0" y={PAN_START_Y} width="600" height={500 - PAN_START_Y}
                fill="white"
                style={{ opacity: waterThroughOpacity }}
              />
            </mask>
          </defs>

          {/* === SKY === */}
          <rect x="0" y="0" width="600" height="150" fill="url(#skyGradientPremium)" />

          <g>
            {skyRain.map(p => (
              <circle key={p.id} cx={p.x} cy="0" r="1.5" fill="rgba(255,255,255,0.6)">
                <animate attributeName="cy" from="-10" to="160" dur="0.8s" begin={`${p.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>

          {/* === SUN === */}
          <motion.g
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "520px 60px" }}
          >
            <circle cx="520" cy="60" r="45" fill="#FFF9C4" opacity="0.4" filter="url(#sunGlow)" />
            <circle cx="520" cy="60" r="25" fill="#FDD835" />
          </motion.g>

          {/* === SOIL === */}
          <rect x="0" y="150" width="600" height="350" fill="url(#soilTexture)" />
          <rect x="0" y="150" width="600" height="350" fill="url(#soilDepth)" style={{ mixBlendMode: 'multiply' }} />

          {/* === WATER INFILTRATION === */}
          <g mask="url(#waterFlowMask)">
            {soilDrops.map(p => (
              <circle key={p.id} cx={p.x} cy="150" r="2" fill="#29B6F6" opacity="0.6">
                <animate attributeName="cy" from="150" to="500" dur="2s" begin={`${p.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>

          {/* === COMPACTED LAYER === */}
          <motion.rect
            x="0"
            y={PAN_START_Y}
            width="600"
            height={PAN_END_Y - PAN_START_Y}
            fill={layerColor}
            style={{
              opacity: layerOpacity,
              mixBlendMode: 'overlay'
            }}
          />
          <motion.line x1="0" y1={PAN_START_Y} x2="600" y2={PAN_START_Y} stroke={layerColor} strokeWidth="1" strokeDasharray="4 4" strokeOpacity={0.8} />
          <motion.line x1="0" y1={PAN_END_Y} x2="600" y2={PAN_END_Y} stroke={layerColor} strokeWidth="1" strokeDasharray="4 4" strokeOpacity={0.8} />


          {/* === WATER POOLING === */}
          <motion.rect
            x="0"
            y={PAN_START_Y - 10}
            width="600"
            height="15"
            fill="#039BE5"
            filter="blur(5px)"
            style={{
              opacity: waterPoolOpacity,
              mixBlendMode: 'hard-light'
            }}
          />
          <motion.rect
            x="0"
            y="150"
            width="600"
            height={PAN_START_Y - 150}
            fill="#039BE5"
            style={{
              opacity: useTransform(activeProgress, [0, 2.5, 4], [0, 0, 0.2]),
              mixBlendMode: 'overlay'
            }}
          />


          {/* === ROOTS === */}
          <motion.path
            d={rootsMassD}
            stroke={rootColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(1px 1px 1px rgba(0,0,0,0.5))"
          />
          <motion.path
            d={specialRootD}
            stroke="#A1887F"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(1px 1px 1px rgba(0,0,0,0.5))"
          />

          {/* === PLANT === */}
          <motion.path
            d={stemD}
            fill={plantColor}
            stroke="#1B5E20"
            strokeWidth="0.5"
          />
          <motion.path
            d={leavesD}
            fill={leafColor}
            stroke="#1B5E20"
            strokeWidth="0.5"
            style={{ transformOrigin: "300px 150px" }}
          />

          {/* === ANNOTATIONS === */}

          <motion.text
            x="20"
            y={PAN_END_Y - 10}
            textAnchor="start"
            fill="rgba(255,255,255,1)"
            style={{
              opacity: textOpacity,
              fontSize: '13px',
              fontWeight: '900',
              textShadow: '0 2px 4px rgba(0,0,0,0.9)',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            TÖMÖRÖDÖTT RÉTEG
          </motion.text>

          <g transform="translate(560, 150)">
            {/* Background Removed */}
            {[0, 10, 20, 30, 40, 50].map((cm, i) => (
              <g key={cm} transform={`translate(0, ${i * 70})`}>
                <line x1="0" y1="0" x2="8" y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <text x="36" y="4" textAnchor="end" fill="rgba(255,255,255,0.8)" fontSize="10px" fontWeight="bold">
                  {cm}cm
                </text>
              </g>
            ))}
          </g>

        </svg>

      </div>
    </motion.div>
  )
}
