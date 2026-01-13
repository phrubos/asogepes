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


  // --- PATH DEFINITIONS (PREMIUM INFOGRAPHIC STYLE) ---

  // 1. STEM - Slimmer, more technical
  const stemPaths = [
    // 0: Healthy
    "M298,150 L298,80 L302,80 L302,150 Z",
    // 1: Slightly Stressed
    "M298,150 L298,85 L302,85 L302,150 Z",
    // 2: Stunted start
    "M298,150 L298,95 L302,95 L302,150 Z",
    // 3: Stunted more
    "M298,150 L299,105 L301,105 L301,150 Z",
    // 4: Critical
    "M299,150 L299,115 L301,115 L301,150 Z"
  ]

  // 2. LEAVES - Sharp, corn/crop style
  const leavesPaths = [
    // 0: Vigorously Up
    "M298,100 Q260,60 220,70 Q260,110 298,110 M302,100 Q340,60 380,70 Q340,110 302,110",

    // 1: Neutral
    "M298,105 Q260,80 220,90 Q260,115 298,115 M302,105 Q340,80 380,90 Q340,115 302,115",

    // 2: Flat
    "M298,110 Q260,100 220,110 Q260,120 298,120 M302,110 Q340,100 380,110 Q340,120 302,120",

    // 3: Drooping
    "M298,115 Q260,130 230,140 Q260,140 298,125 M302,115 Q340,130 370,140 Q340,140 302,125",

    // 4: Wilted (Small)
    "M299,120 Q270,135 250,140 Q270,145 299,130 M301,120 Q330,135 350,140 Q330,145 301,130"
  ]

  // 3. ROOTS - Complex, fibrous network
  const rootMassPaths = [
    // 0: Deep, Extensive System
    "M300,150 C300,200 280,300 240,430 M300,150 C300,220 320,300 360,430 M300,150 C290,250 260,350 250,450 M300,150 C310,250 340,350 350,450 M300,150 C300,180 220,200 210,250 M300,150 C300,180 380,200 390,250",

    // 1: Good but slight restrict
    "M300,150 C300,200 280,300 240,400 M300,150 C300,220 320,300 360,400 M300,150 C290,250 260,350 250,420 M300,150 C310,250 340,350 350,420 M300,150 C300,180 220,200 210,250 M300,150 C300,180 380,200 390,250",

    // 2: Hitting Pan
    "M300,150 C300,200 280,280 250,330 M300,150 C300,220 320,280 350,330 M300,150 C290,250 270,300 260,340 M300,150 C310,250 330,300 340,340 M300,150 C300,180 220,200 210,250 M300,150 C300,180 380,200 390,250",

    // 3: J-Hook / Horizontal deflection
    "M300,150 C290,190 270,215 220,220 M300,150 C310,190 330,215 380,220 M300,150 C295,200 260,210 240,230 M300,150 C305,200 340,210 360,230 M300,150 C300,180 250,190 240,200 M300,150 C300,180 350,190 360,200",

    // 4: Shallow Surface Mat
    "M300,150 C290,170 250,175 200,180 M300,150 C310,170 350,175 400,180 M300,150 C280,165 240,170 220,185 M300,150 C320,165 360,170 380,185 M300,150 C290,160 260,165 250,170 M300,150 C310,160 340,165 350,170"
  ]

  // 4. TAP ROOT - The main anchor - FIX: Remains straight and penetrates INTO the pan
  const tapRootPaths = [
    "M300,150 L300,450", // 0
    "M300,150 L300,420", // 1
    "M300,150 L300,300", // 2 
    "M300,150 L300,230", // 3 - Stuck deep in the layer (Start 190, End 230)
    "M300,150 L300,210"  // 4 - Stuck shallow in the layer (Start 190, End 210)
  ]

  // Constants for Compaction Layer Zone
  const PAN_START_Y = 190;
  const PAN_HEIGHT = 60; // Thicker layer visualization

  // --- INTERPOLATIONS ---
  // Layer Color: Green -> Yellow -> Orange -> Red
  const layerColor = useTransform(activeProgress, [0, 1, 2, 3, 4],
    ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#D32F2F'])

  const layerBorderColor = useTransform(activeProgress, [0, 2, 4],
    ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)'])

  // Plant Health Colors
  const plantColor = useTransform(activeProgress, [0, 4], ['#66BB6A', '#9E9D24']) // Fresh Green -> Olive/Dry
  const rootColor = '#EFEBE9' // Off-white roots

  // Geometry Transforms
  const stemD = useTransform(activeProgress, [0, 1, 2, 3, 4], stemPaths)
  const leavesD = useTransform(activeProgress, [0, 1, 2, 3, 4], leavesPaths)
  const rootsMassD = useTransform(activeProgress, [0, 1, 2, 3, 4], rootMassPaths)
  const tapRootD = useTransform(activeProgress, [0, 1, 2, 3, 4], tapRootPaths)

  // Water Logic
  const waterFlowOpacity = useTransform(activeProgress, [0, 2, 3.5], [0.8, 0.5, 0])

  // Water pools ON TOP of the pan layer (internal waterlogging)
  const waterPoolOpacity = useTransform(activeProgress, [2.5, 4], [0, 0.9])
  const waterPoolHeight = useTransform(activeProgress, [2.5, 4], [0, 15])

  // Rain fading: Opacity for drops BELOW the layer
  // They should be visible at 0, and invisible at 4
  const deepRainOpacity = useTransform(activeProgress, [1, 3.5], [1, 0])


  // Particle Systems
  const skyRain = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 600,
    delay: Math.random() * 5,
    dur: 1.5 + Math.random() // varied speed
  })), [])

  const soilDrops = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 600,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 2 // Slower in soil
  })), [])

  return (
    <motion.div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/5"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        cursor: isHovered ? 'grab' : 'default',
        background: 'radial-gradient(circle at 50% 30%, #2c3e50 0%, #1a1a1a 100%)' // Fallback bg
      }}
    >
      <div className="w-full h-full relative select-none" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 600 500" className="w-full h-full absolute inset-0">
          <defs>
            {/* 1. SKY GRADIENT - Atmospheric */}
            <linearGradient id="skyGradientPremium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0288D1" />
              <stop offset="50%" stopColor="#81D4FA" />
              <stop offset="100%" stopColor="#E1F5FE" />
            </linearGradient>

            {/* 2. SOIL TEXTURE - Realistic Noise */}
            <filter id="soilNoise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
              <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
            </filter>

            {/* 3. SOIL GRADIENT - Deep Earth */}
            <linearGradient id="soilDeepGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5D4037" />   {/* Brown 700 */}
              <stop offset="60%" stopColor="#3E2723" />  {/* Brown 900 */}
              <stop offset="100%" stopColor="#1a0f0a" /> {/* Very Dark */}
            </linearGradient>

            {/* 4. COMPACTED LAYER PATTERN */}
            <pattern id="compactedPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#4E342E" />
              <path d="M0,8 L8,0 M-2,2 L2,-2 M6,10 L10,6" stroke="#3E2723" strokeWidth="1" />
            </pattern>

            {/* 5. GLOWS */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 6. WATER MASK - Dynamic fading */}
            <mask id="waterMask">
              {/* Top region: Always allow water */}
              <rect x="0" y="150" width="600" height={PAN_START_Y - 150} fill="white" />

              {/* Bottom region: Fades out as compaction increases */}
              <motion.rect
                x="0" y={PAN_START_Y}
                width="600" height={500 - PAN_START_Y}
                fill="white"
                style={{ opacity: deepRainOpacity }}
              />
            </mask>
          </defs>

          {/* === SKY === */}
          <rect x="0" y="0" width="600" height="150" fill="url(#skyGradientPremium)" />

          {/* Subtle clouds/atmosphere could go here */}

          {/* === RAIN (Atmospheric) === */}
          <g>
            {skyRain.map(p => (
              <line
                key={p.id}
                x1={p.x} y1="-20" x2={p.x - 5} y2="0"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              >
                <animate
                  attributeName="y1" from="-20" to="160" dur={`${p.dur}s`}
                  begin={`${p.delay}s`} repeatCount="indefinite"
                />
                <animate
                  attributeName="y2" from="0" to="180" dur={`${p.dur}s`}
                  begin={`${p.delay}s`} repeatCount="indefinite"
                />
                <animate
                  attributeName="x1" from={p.x} to={p.x - 30} dur={`${p.dur}s`}
                  begin={`${p.delay}s`} repeatCount="indefinite"
                />
                <animate
                  attributeName="x2" from={p.x - 5} to={p.x - 35} dur={`${p.dur}s`}
                  begin={`${p.delay}s`} repeatCount="indefinite"
                />
              </line>
            ))}
          </g>

          {/* === SUN === */}
          <g transform="translate(520, 60)">
            <circle r="40" fill="#FFF176" opacity="0.2" filter="url(#glow)" />
            <circle r="25" fill="#FDD835" />
          </g>

          {/* === SOIL === */}
          {/* Base Layer */}
          <rect x="0" y="150" width="600" height="350" fill="url(#soilDeepGradient)" />
          {/* Noise Texture Overlay */}
          <rect x="0" y="150" width="600" height="350" fill="url(#soilDeepGradient)" filter="url(#soilNoise)" opacity="0.6" style={{ mixBlendMode: 'overlay' }} />


          {/* === COMPACTED LAYER (Dynamic Color, Constant Visibility) === */}
          <g>
            {/* Pattern texture always visible but subtle */}
            <rect
              x="0" y={PAN_START_Y} width="600" height={PAN_HEIGHT}
              fill="url(#compactedPattern)"
              opacity="0.2"
            />
            {/* Colored Overlay that changes with progress */}
            <motion.rect
              x="0" y={PAN_START_Y} width="600" height={PAN_HEIGHT}
              fill={layerColor}
              style={{
                mixBlendMode: 'normal',
                opacity: 0.5
              }}
            />
            {/* Top/Bottom definition lines */}
            <motion.line
              x1="0" y1={PAN_START_Y} x2="600" y2={PAN_START_Y}
              stroke={layerBorderColor} strokeWidth="2" strokeDasharray="6 4"
            />
            <motion.line
              x1="0" y1={PAN_START_Y + PAN_HEIGHT} x2="600" y2={PAN_START_Y + PAN_HEIGHT}
              stroke={layerBorderColor} strokeWidth="1" strokeDasharray="2 4"
            />
          </g>


          {/* === WATER INFILTRATION === */}
          <g mask="url(#waterMask)">
            {soilDrops.map(p => (
              <circle key={p.id} r={Math.random() * 1.5 + 0.5} fill="#4FC3F7" opacity="0.5">
                <animate
                  attributeName="cx" from={p.x} to={p.x}
                  dur="0.1s" fill="freeze"
                />
                <animate
                  attributeName="cy" from="150" to="520"
                  dur={`${p.dur}s`} begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
                {/* Fade out as it goes deep */}
                <animate
                  attributeName="opacity" values="0.5;0.5;0"
                  dur={`${p.dur}s`} begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* === WATER POOLING (INTERNAL) === */}
          {/* Pools ON TOP of the pan layer (PAN_START_Y) */}
          <motion.rect
            x="0"
            y={useTransform(waterPoolHeight, h => PAN_START_Y - h)}
            width="600"
            height={waterPoolHeight}
            fill="#0288D1"
            style={{
              opacity: waterPoolOpacity,
              mixBlendMode: 'hard-light'
            }}
          />


          {/* === PLANTS & ROOTS === */}

          {/* Roots - Background (Finer hairs) */}
          <motion.path
            d={rootsMassD}
            stroke={rootColor}
            strokeWidth="1"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Roots - Main System */}
          <motion.path
            d={rootsMassD}
            stroke={rootColor}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.5))"
          />

          {/* Tap Root (The Anchor) */}
          <motion.path
            d={tapRootD}
            stroke={rootColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength: 1 }}
          />


          {/* Stem & Leaves */}
          <motion.path
            d={stemD}
            fill={plantColor}
            stroke="#1B5E20"
            strokeWidth="0.5"
            filter="drop-shadow(3px 5px 2px rgba(0,0,0,0.3))"
          />
          <motion.path
            d={leavesD}
            fill={plantColor}
            stroke="#1B5E20"
            strokeWidth="0.5"
            style={{ transformOrigin: "300px 110px" }}
            filter="drop-shadow(3px 5px 2px rgba(0,0,0,0.3))"
          />


          {/* === ANNOTATIONS === */}

          {/* Compaction Label */}
          <motion.text
            x="30"
            y={PAN_START_Y + 35}
            textAnchor="start"
            fill="rgba(255,255,255,0.9)"
            style={{
              fontSize: '14px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.9)'
            }}
          >
            Tömörödött Réteg
          </motion.text>

          {/* Depth Ruler */}
          <g transform="translate(560, 150)">
            <rect x="0" y="0" width="40" height="350" fill="url(#soilDeepGradient)" opacity="0.8" />
            <line x1="0" y1="0" x2="0" y2="350" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            {[0, 10, 20, 30, 40, 50].map((cm, i) => (
              <g key={cm} transform={`translate(0, ${i * 70})`}>
                <line x1="-5" y1="0" x2="5" y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <text x="10" y="4" textAnchor="start" fill="rgba(255,255,255,0.6)" fontSize="10px" fontWeight="normal" style={{ fontFamily: 'monospace' }}>
                  -{cm}cm
                </text>
              </g>
            ))}
          </g>

        </svg>

        {/* Overlay Vignette for integration */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
          }}
        />
      </div>
    </motion.div>
  )
}
