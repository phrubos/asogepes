'use client'

import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion'
import { useEffect, useMemo } from 'react'

interface InteractiveSoilProps {
  progress: number | MotionValue<number> // 0.0 to 4.0
  onProgressChange?: (val: number) => void
  onInteractionStart?: () => void
}

export default function InteractiveSoil({ progress, onProgressChange, onInteractionStart }: InteractiveSoilProps) {
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
    // 0: Deep, Extensive System - Adjusted to ~33cm (y=380)
    "M300,150 C300,200 280,280 240,380 M300,150 C300,220 320,280 360,380 M300,150 C290,250 260,320 250,375 M300,150 C310,250 340,320 350,375 M300,150 C300,180 220,200 210,250 M300,150 C300,180 380,200 390,250",

    // 1: Good but slight restrict - Adjusted to ~30cm (y=350) - MUST BE < 380
    "M300,150 C300,200 280,300 240,350 M300,150 C300,220 320,300 360,350 M300,150 C290,250 260,340 250,360 M300,150 C310,250 340,340 350,360 M300,150 C300,180 220,200 210,250 M300,150 C300,180 380,200 390,250",

    // 2: Hitting Pan - y=330 (Fine)
    "M300,150 C300,200 280,280 250,330 M300,150 C300,220 320,280 350,330 M300,150 C290,250 270,300 260,340 M300,150 C310,250 330,300 340,340 M300,150 C300,180 220,200 210,250 M300,150 C300,180 380,200 390,250",

    // 3: J-Hook / Horizontal deflection - y=230 (Fine)
    "M300,150 C290,190 270,215 220,220 M300,150 C310,190 330,215 380,220 M300,150 C295,200 260,210 240,230 M300,150 C305,200 340,210 360,230 M300,150 C300,180 250,190 240,200 M300,150 C300,180 350,190 360,200",

    // 4: Shallow Surface Mat - y=185 (Fine)
    "M300,150 C290,170 250,175 200,180 M300,150 C310,170 350,175 400,180 M300,150 C280,165 240,170 220,185 M300,150 C320,165 360,170 380,185 M300,150 C290,160 260,165 250,170 M300,150 C310,160 340,165 350,170"
  ]

  // 4. TAP ROOT - The main anchor - FIX: Remains straight and penetrates INTO the pan
  const tapRootPaths = [
    "M300,150 L300,380", // 0 - Adjusted to 33cm (y=380)
    "M300,150 L300,360", // 1 - Adjusted to 31cm (y=360) - WAS 420
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
      style={{
        cursor: 'default',
        background: 'transparent' // Transparent background as requested
      }}
    >
      <div className="w-full h-full relative select-none">
        <svg viewBox="0 0 600 500" className="w-full h-full absolute inset-0">
          <defs>
            {/* 1. SKY GRADIENT - Atmospheric */}
            <linearGradient id="skyGradientPremium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0288D1" />
              <stop offset="50%" stopColor="#81D4FA" />
              <stop offset="100%" stopColor="#E1F5FE" />
            </linearGradient>

            {/* MANOMETER GRADIENT */}
            <linearGradient id="gaugeGradient" x1="0" y1="1" x2="1" y2="1">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="50%" stopColor="#FFC107" />
              <stop offset="100%" stopColor="#D32F2F" />
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

          {/* === RAIN (Restored) === */}
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

          {/* === MANOMETER GAUGE (Moved to Front for visibility over Soil) === */}
          <g transform="translate(480, 80)">
            {/* 1. Stem (Probe) extending into soil */}
            <line x1="0" y1="20" x2="0" y2="140" stroke="#546E7A" strokeWidth="4" />
            <line x1="0" y1="20" x2="0" y2="140" stroke="rgba(0,0,0,0.3)" strokeWidth="2" transform="translate(1,0)" />

            {/* Probe Tip */}
            <path d="M-2,140 L0,145 L2,140 Z" fill="#546E7A" />

            {/* 2. Gauge Body */}
            <circle r="48" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
            <circle r="40" fill="none" stroke="#B0BEC5" strokeWidth="1" strokeDasharray="1 2" />

            {/* 3. Scale Arc (0 - 20 Bar)
                 Start at 160 deg (Left-Bottomish) -> End at 20 deg (Right-Bottomish).
             */}
            <path
              d="M-37.6,13.7 A40,40 0 1,1 37.6,13.7"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* 4. Ticks & Labels (Internal - Pressure) */}
            <g fontSize="7px" fontFamily="monospace" fill="#546E7A" textAnchor="middle" fontWeight="bold">
              {/* 0 Bar - approx 160 deg */}
              <text x="-28" y="10">0</text>

              {/* 5 Bar - approx 125 deg */}
              <text x="-22" y="-18">5</text>

              {/* 10 Bar - approx 90 deg (Top) */}
              <text x="0" y="-28">10</text>

              {/* 15 Bar - approx 55 deg */}
              <text x="22" y="-18">15</text>

              {/* 20 Bar - approx 20 deg */}
              <text x="28" y="10">20</text>

              <text x="0" y="25" fontSize="6px">BAR</text>
            </g>

            {/* 5. Needle 
                 Mapping: 0 bar -> 160 deg. 20 bar -> 380 deg (20 deg).
                 11 deg/bar.
                 Needle reflects progress 0->0 bar, 4->20 bar.
             */}
            <motion.g
              style={{
                rotate: useTransform(activeProgress, p => {
                  const pressure = p * 5;
                  return 160 + (pressure * 11);
                })
              }}
            >
              {/* Invisible circle to center the transform origin (BBox center) at 0,0 */}
              <circle r="50" fill="none" />
              <rect x="-4" y="-2" width="50" height="4" rx="2" fill="#D32F2F" filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.3))" />
              <circle r="6" fill="#37474F" />
              <circle r="3" fill="#546E7A" />
            </motion.g>

            {/* 6. External Day Labels 
                Standardized coordinates (R=52-60 for lines, R=72 for text).
                Angles: 160, 215, 270, 325, 20 deg.
            */}
            {/* 0 nap (160 deg) x=-67, y=24 */}
            <text x="-67" y="27" fontSize="10px" fill="#fff" fontWeight="bold" textAnchor="end" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">0 nap</text>
            <line x1="-48" y1="17" x2="-56" y2="20" stroke="#fff" strokeWidth="1" opacity="0.6" />

            {/* 30 nap (215 deg) x=-59, y=-41 */}
            <text x="-59" y="-41" fontSize="10px" fill="#fff" fontWeight="bold" textAnchor="end" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">30 nap</text>
            <line x1="-42" y1="-29" x2="-49" y2="-34" stroke="#fff" strokeWidth="1" opacity="0.6" />

            {/* 60 nap (270 deg) x=0, y=-72 */}
            <text x="0" y="-65" fontSize="10px" fill="#fff" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">60 nap</text>
            <line x1="0" y1="-52" x2="0" y2="-60" stroke="#fff" strokeWidth="1" opacity="0.6" />

            {/* 90 nap (325 deg) x=59, y=-41 */}
            <text x="59" y="-41" fontSize="10px" fill="#fff" fontWeight="bold" textAnchor="start" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">90 nap</text>
            <line x1="42" y1="-29" x2="49" y2="-34" stroke="#fff" strokeWidth="1" opacity="0.6" />

            {/* 120 nap (20 deg) x=67, y=24 */}
            <text x="67" y="27" fontSize="10px" fill="#fff" fontWeight="bold" textAnchor="start" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">120 nap</text>
            <line x1="48" y1="17" x2="56" y2="20" stroke="#fff" strokeWidth="1" opacity="0.6" />

            {/* === INTERACTIVE OVERLAY === */}
            <circle
              cx="0" cy="0" r="100"
              fill="transparent"
              style={{ cursor: 'grab', touchAction: 'none' }}
              onPointerDown={(e) => {
                if (onInteractionStart) onInteractionStart();
                e.currentTarget.setPointerCapture(e.pointerId);

                // Calculate initial click
                const svg = e.currentTarget.closest('svg');
                if (svg) {
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                  // Gauge Center is at (480, 80)
                  const dx = svgP.x - 480;
                  const dy = svgP.y - 80;
                  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                  // Normalize angle: 0 is Right (3 o'clock). 
                  // Gauge scale: 160 deg (Start) -> 20 deg (End).
                  // Clockwise logic: 160 -> 180/-180 -> 20.

                  // Shift logic to start from 160
                  let logicAngle = angle;
                  if (logicAngle < 20) logicAngle += 360; // 20 -> 380

                  // Range: 160 (0 bar) to 380 (20 bar). Width = 220 deg.
                  // Constrain interaction range slightly wider
                  if (logicAngle >= 140 && logicAngle <= 400) {
                    const percent = (logicAngle - 160) / 220; // 0.0 to 1.0
                    const newProgress = Math.max(0, Math.min(4, percent * 4));
                    if (onProgressChange) onProgressChange(newProgress);
                  }
                }
              }}
              onPointerMove={(e) => {
                if (e.buttons === 1) { // Left click drag
                  const svg = e.currentTarget.closest('svg');
                  if (svg) {
                    const pt = svg.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

                    const dx = svgP.x - 480;
                    const dy = svgP.y - 80;
                    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

                    let logicAngle = angle;
                    if (logicAngle < 100) logicAngle += 360; // 20 -> 380, but careful with discontinuity

                    // Range: 160 to 380.
                    if (logicAngle >= 140 && logicAngle <= 400) {
                      const percent = (logicAngle - 160) / 220;
                      const newProgress = Math.max(0, Math.min(4, percent * 4));
                      if (onProgressChange) onProgressChange(newProgress);
                    }
                  }
                }
              }}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            />

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
