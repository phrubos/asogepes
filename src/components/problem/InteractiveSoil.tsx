'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- KONFIGURÁCIÓ & ADATOK ---
const GROUND_Y = 150 // Talajszint Y (lejjebb hozva)
const CM_TO_PX = 7
const PAN_START_Y = GROUND_Y + (5 * CM_TO_PX) // 150 + 35 = 185
const PAN_END_Y = GROUND_Y + (15 * CM_TO_PX)  // 150 + 105 = 255

interface InteractiveSoilProps {
  dayIndex: number
  isCompacted: boolean
  isHovered: boolean
  setIsHovered: (hover: boolean) => void
}

export default function InteractiveSoil({ dayIndex, isCompacted, isHovered, setIsHovered }: InteractiveSoilProps) {

  // --- PATH DEFINÍCIÓK (X=300 a középvonal) ---

  // 1. SZÁR (Stem) - Földfelszín felett
  const stemPathHealthy = "M300,150 L300,60"
  const stemPathCompacted = "M300,150 L302,70"

  // 2. LEVELEK (Leaves)
  // Szélesebb ívek, hogy kitöltsék a teret
  const leavesPathHealthy = "M300,95 Q220,55 200,110 M300,105 Q380,65 400,120"
  const leavesPathCompacted = "M301,100 Q250,130 240,150 M301,110 Q350,140 360,150"

  // 3. GYÖKÉRZET (Roots)
  const rootPathHealthy = `
    M300,150 
    C300,200 290,300 280,380 
    C275,410 260,430 240,450 
    M300,190 C330,230 350,320 365,400 
    M300,170 C270,210 250,280 240,360
    M300,175 C315,215 330,290 340,370
  `

  const rootPathCompacted = `
    M300,150 
    C300,165 300,175 300,185 
    C260,190 220,185 180,180 
    M300,185 C340,188 380,185 420,180 
    M300,185 L302,260 
  `

  // --- RÉSZECSKÉK (VÍZ) ---
  const [particles, setParticles] = useState<any[]>([])
  useEffect(() => {
    setParticles(Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      xStart: 100 + Math.random() * 400, // Szélesebb szórás (100-500)
      delay: Math.random() * 2,
      duration: 1.2 + Math.random(),
    })))
  }, [])

  return (
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: 'transparent',
        borderRadius: '24px',
        fontFamily: '"Inter", sans-serif',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* TEXTÚRA SVG (Rejtett) */}
      <svg width="0" height="0">
        <filter id="soilNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.1" /></feComponentTransfer>
        </filter>
      </svg>

      {/* --- VIZUALIZÁCIÓ (Teljes kitöltés) --- */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>

        {/* 5. RÉTEG: SVG NÖVÉNY ÉS HÁTTÉR (Közös koordináta-rendszerben szélesebb nézet) */}
        <svg
          width="100%" height="100%" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, zIndex: 10 }}
        >
          <defs>
            <filter id="soilNoiseSVG">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer><feFuncA type="linear" slope="0.1" /></feComponentTransfer>
            </filter>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isCompacted ? "#5C6B8A" : "#7B8FAD"} />
              <stop offset="100%" stopColor={isCompacted ? "#4A5568" : "#5C6B8A"} />
            </linearGradient>
            <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5D4E37" />
              <stop offset="30%" stopColor="#3D3226" />
              <stop offset="100%" stopColor="#2A231C" />
            </linearGradient>
          </defs>

          {/* 1. ÉG HÁTTÉR */}
          <motion.rect
            x="0" y="0" width="600" height={GROUND_Y}
            fill="url(#skyGradient)"
          />

          {/* 2. TALAJ HÁTTÉR */}
          <rect x="0" y={GROUND_Y} width="600" height="500" fill="url(#soilGradient)" />
          <rect x="0" y={GROUND_Y} width="600" height="500" filter="url(#soilNoiseSVG)" opacity="0.3" />

          {/* Talajfelszín vonal */}
          <rect x="0" y={GROUND_Y} width="600" height="4" fill="rgba(139, 115, 85, 0.6)" />


          {/* 3. TÖMÖRÖDÖTT SÁV (SVG-ben) */}
          <AnimatePresence>
            {isCompacted && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <rect
                  x="0"
                  y={PAN_START_Y}
                  width="600"
                  height={PAN_END_Y - PAN_START_Y}
                  fill="rgba(120, 20, 20, 0.35)"
                />
                <line x1="0" y1={PAN_START_Y} x2="600" y2={PAN_START_Y} stroke="rgba(200, 50, 50, 0.6)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="0" y1={PAN_END_Y} x2="600" y2={PAN_END_Y} stroke="rgba(200, 50, 50, 0.6)" strokeWidth="2" strokeDasharray="5,5" />

                {/* Text Label in SVG - Centered at 300 */}
                <rect x="220" y={PAN_START_Y + 25} width="160" height="24" rx="6" fill="rgba(0,0,0,0.5)" />
                <text x="300" y={PAN_START_Y + 41} textAnchor="middle" fill="#FFEBEE" fontSize="12" fontWeight="800" letterSpacing="1">TÖMÖRÖDÖTT RÉTEG</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* SZÁR (Stem) */}
          <motion.path
            d={isCompacted ? stemPathCompacted : stemPathHealthy}
            stroke={isCompacted ? "#AED581" : "#66BB6A"}
            strokeWidth={isCompacted ? 6 : 8}
            strokeLinecap="round"
            fill="none"
            animate={{ d: isCompacted ? stemPathCompacted : stemPathHealthy }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          {/* LEVELEK (Leaves) */}
          <motion.path
            d={isCompacted ? leavesPathCompacted : leavesPathHealthy}
            stroke={isCompacted ? "#AED581" : "#43A047"}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            animate={{ d: isCompacted ? leavesPathCompacted : leavesPathHealthy }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* GYÖKÉRZET (Roots) */}
          <motion.path
            d={isCompacted ? rootPathCompacted : rootPathHealthy}
            stroke={isCompacted ? "#8D6E63" : "#D7CCC8"} // Kicsit sötétebb ha beteg
            strokeWidth={isCompacted ? 4 : 5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: isCompacted ? rootPathCompacted : rootPathHealthy }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>

        {/* 4. RÉTEG: NAP (HTML overlay) */}
        <motion.div
          style={{
            position: 'absolute', top: '15px', right: '15px', width: 64, height: 64, borderRadius: '50%',
            background: 'radial-gradient(circle, #FDD835 0%, #FBC02D 100%)', zIndex: 12,
            boxShadow: '0 0 35px rgba(253, 216, 53, 0.4)'
          }}
          animate={{ opacity: isCompacted ? 0.4 : 1, scale: isCompacted ? 0.8 : 1 }}
        />

        {/* 6. RÉTEG: VÍZ (Részecskék) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
          {/* Note: Particles logic needs to be aware of the SVG scaling if using HTML overlay. 
               Since preserveAspectRatio is slice, exact alignment might be tricky unless viewBox ~= container.
               Container is roughly 600x500 in desktop split view, so this map is close.
           */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute', left: 0, top: 0, width: 6, height: 8,
                background: '#4FC3F7', borderRadius: '50%', boxShadow: '0 0 4px #29B6F6'
              }}
              // Need to map coordinates roughly from SVG 600x500 to % or similar.
              // Easier to use % for responsiveness. 
              // xStart was 100-500. 100/600 ~ 16%, 500/600 ~ 83%.
              initial={{ left: `${(p.xStart / 600) * 100}%`, top: '-5%', opacity: 0 }}
              animate={isCompacted ? {
                // TÖMÖRÖDÖTT: Koppan a rétegen 
                // PAN_START_Y = 185. 185/500 = 37%.
                top: ['0%', '37%', '38%'],
                left: [`${(p.xStart / 600) * 100}%`, `${(p.xStart / 600) * 100}%`, `${((p.xStart + (p.id % 2 === 0 ? 100 : -100)) / 600) * 100}%`],
                opacity: [0, 1, 0],
                scale: [1, 1, 0]
              } : {
                // EGÉSZSÉGES: Lemegy mélyre
                top: ['0%', '90%'],
                left: `${(p.xStart / 600) * 100}%`,
                opacity: [0, 1, 0],
                scale: [1, 1, 0.5]
              }}
              transition={{
                duration: isCompacted ? 1.5 : 2.5, // Faster in air
                repeat: Infinity,
                delay: p.delay,
                ease: isCompacted ? "easeOut" : "linear"
              }}
            />
          ))}
        </div>

        {/* 7. RÉTEG: UI OVERLAY (Skálák) */}
        {/* Jobb oldali Mélység Skála - Relative to Percentage to match SVG roughly */}
        <div style={{ position: 'absolute', right: 10, top: '30%', bottom: 0, width: 40, zIndex: 20 }}>
          {/* GROUND_Y = 150. 150/500 = 30%. */}
          {[0, 10, 20, 30, 40, 50].map((cm) => (
            <div key={cm} style={{ position: 'absolute', top: `${(cm * 1.6)}%`, right: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Simplified mapping: 50cm = 70% of height? 
                   If GROUND is 30%, bottom is 100%. Range is 70%.
                   50cm -> 70%. 1cm -> 1.4%. 
                   Let's use 1.4 multiplier.
               */}
              <div style={{ width: 8, height: 1, background: 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{cm} cm</span>
            </div>
          ))}
        </div>

        {/* Bal oldali Penetrométer színskála (Függőleges) */}
        <div style={{
          position: 'absolute', left: 16, top: '32%', bottom: 20, width: 6, borderRadius: '3px',
          background: 'linear-gradient(180deg, #4CAF50 0%, #FFC107 40%, #D32F2F 100%)',
          zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }} />

      </div>
    </motion.div>
  )
}