'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Droplets, ArrowDownToLine, Sprout } from 'lucide-react'

// --- KONFIGURÁCIÓ & ADATOK ---
const GROUND_Y = 120 // Talajszint Y koordinátája (pixel)
const CM_TO_PX = 7   // 1 cm hány pixelnek felel meg
// Tömörödött réteg: 5cm - 15cm
const PAN_START_Y = GROUND_Y + (5 * CM_TO_PX)  // 155px
const PAN_END_Y = GROUND_Y + (15 * CM_TO_PX)   // 225px

const timelineData = [
  { day: 0, label: 'Optimális', penetrometer: 8, color: '#4CAF50' },
  { day: 30, label: '30 nap', penetrometer: 11, color: '#8BC34A' },
  { day: 60, label: '60 nap', penetrometer: 14, color: '#FFC107' },
  { day: 90, label: '90 nap', penetrometer: 17, color: '#FF9800' },
  { day: 120, label: '120 nap után', penetrometer: 20, color: '#D32F2F' },
]

export default function InteractiveSoil() {
  const [dayIndex, setDayIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  const isCompacted = dayIndex === 4
  const currentData = timelineData[dayIndex]

  // --- AUTOMATIKUS LOOP ---
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!isHovered && !isUserInteracting) {
      interval = setInterval(() => {
        setDayIndex((prev) => (prev === 0 ? 4 : 0))
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isHovered, isUserInteracting])

  const handleInteractionStart = () => setIsUserInteracting(true)

  const handleToggle = () => {
    handleInteractionStart()
    setDayIndex(dayIndex === 0 ? 4 : 0)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInteractionStart()
    setDayIndex(parseInt(e.target.value))
  }

  // --- PATH DEFINÍCIÓK (A Lényeg) ---
  // Minden path a (150, 120) pontból indul ki.

  // 1. SZÁR (Stem) - A földfelszín FELETT (0-120 tartomány)
  // A szár a talajszinttől (120) indul és felfelé megy
  const stemPathHealthy = "M150,120 L150,50"
  const stemPathCompacted = "M150,120 L152,60" // Kicsit ferde, sorvadtabb

  // 2. LEVELEK (Leaves) - A földfelszín felett (0-120 tartomány)
  const leavesPathHealthy = "M150,75 Q100,45 85,80 M150,85 Q200,55 215,90"
  const leavesPathCompacted = "M151,80 Q115,100 105,115 M151,90 Q185,110 195,115" // Lekonyulnak

  // 3. GYÖKÉRZET (Roots) - A földfelszín ALATT (120+ tartomány)
  // Healthy: Mélyre megy, elágazó
  const rootPathHealthy = `
    M150,120 
    C150,160 145,240 140,300 
    C135,320 125,335 110,345 
    M150,150 C170,180 185,250 195,310 
    M150,135 C130,165 115,220 105,280
    M150,140 C160,170 170,230 180,290
  `

  // Compacted: Megakad a rétegnél (PAN_START_Y = 155), szétterül
  const rootPathCompacted = `
    M150,120 
    C150,135 150,145 150,155 
    C125,158 100,155 70,150 
    M150,155 C175,158 200,155 230,150 
    M150,155 L151,210 
  `
  // Magyarázat a Compacted Path-hoz:
  // 1. szakasz: Lemegy 120-tól 155-ig (réteg teteje).
  // 2. szakasz: 155-nél balra kanyarodik (vízszintesen terül).
  // 3. szakasz: 155-nél jobbra kanyarodik.
  // 4. szakasz: Egy vékony szál megpróbál lemenni 250-ig.

  // --- RÉSZECSKÉK (VÍZ) ---
  const [particles, setParticles] = useState<any[]>([])
  useEffect(() => {
    setParticles(Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      xStart: 40 + Math.random() * 220,
      delay: Math.random() * 2,
      duration: 1.2 + Math.random(),
    })))
  }, [])

  return (
    <motion.div
      style={{
        width: '100%', maxWidth: '500px', margin: '0 auto',
        background: 'rgba(26, 22, 18, 0.95)', borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        fontFamily: '"Inter", sans-serif', overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)'
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

      {/* --- FEJLÉC --- */}
      <div style={{ padding: '24px 24px 10px', background: 'transparent', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {dayIndex === 0 ? 'Optimális talajszerkezet' : 'Tömörödés hatása'}
          </h2>
          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isCompacted ? '#2E7D32' : '#C62828',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            <ArrowLeftRight size={14} />
            {isCompacted ? 'Javítás' : 'Rontás'}
          </motion.button>
        </div>

        {/* VEZÉRLŐPULT */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
            {timelineData.map((d, i) => (
              <motion.span
                key={i}
                animate={{ color: i === dayIndex ? d.color : 'rgba(255, 255, 255, 0.5)', scale: i === dayIndex ? 1.1 : 1 }}
              >
                {d.label}
              </motion.span>
            ))}
          </div>
          <input
            type="range" min="0" max="4" step="1"
            value={dayIndex} onChange={handleSliderChange}
            style={{ width: '100%', cursor: 'pointer', accentColor: currentData.color, display: 'block' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)' }}>Penetrométer:</span>
            <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #4CAF50 0%, #FFC107 40%, #D32F2F 100%)' }} />
              <motion.div
                style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', background: '#000', boxShadow: '0 0 4px rgba(0,0,0,0.5)' }}
                animate={{ left: `${(currentData.penetrometer / 25) * 100}%` }}
              />
            </div>
            <motion.span
              key={currentData.penetrometer}
              initial={{ scale: 1.2 }} animate={{ scale: 1 }}
              style={{ fontSize: '0.9rem', fontWeight: 800, color: currentData.color, width: '55px', textAlign: 'right' }}
            >
              {currentData.penetrometer} bar
            </motion.span>
          </div>
        </div>
      </div>

      {/* --- VIZUALIZÁCIÓ (350px Magas) --- */}
      <div style={{ position: 'relative', height: '350px', width: '100%', overflow: 'hidden', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>

        {/* 1. RÉTEG: ÉG (0 - 120px) */}
        <motion.div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${GROUND_Y}px`, zIndex: 1 }}
          animate={{ background: isCompacted ? 'linear-gradient(180deg, #5C6B8A 0%, #4A5568 100%)' : 'linear-gradient(180deg, #7B8FAD 0%, #5C6B8A 100%)' }}
        />

        {/* 2. RÉTEG: TALAJ HÁTTÉR (120px - 500px) */}
        <div style={{ position: 'absolute', top: `${GROUND_Y}px`, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, #5D4E37 0%, #3D3226 30%, #2A231C 100%)', zIndex: 2 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.2, filter: 'url(#soilNoise)' }} />
          {/* Talajfelszín vonal */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, rgba(139, 115, 85, 0.6), transparent)' }} />
        </div>

        {/* 3. RÉTEG: TÖMÖRÖDÖTT SÁV (Csak ha compacted) */}
        {/* Pozíció: 5-15 cm => 155px - 225px */}
        <AnimatePresence>
          {isCompacted && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.8 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'absolute',
                top: `${PAN_START_Y}px`,
                height: `${PAN_END_Y - PAN_START_Y}px`,
                left: 0, right: 0,
                background: 'rgba(120, 20, 20, 0.35)', // Sötétvörös sáv
                borderTop: '2px dashed rgba(200, 50, 50, 0.6)',
                borderBottom: '2px dashed rgba(200, 50, 50, 0.6)',
                zIndex: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <div style={{
                background: 'rgba(0,0,0,0.4)', color: '#FFEBEE', padding: '4px 12px',
                borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.5px',
                backdropFilter: 'blur(4px)'
              }}>
                TÖMÖRÖDÖTT RÉTEG (5-15 CM)
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. RÉTEG: NAP */}
        <motion.div
          style={{
            position: 'absolute', top: 20, right: 20, width: 48, height: 48, borderRadius: '50%',
            background: 'radial-gradient(circle, #FDD835 0%, #FBC02D 100%)', zIndex: 4,
            boxShadow: '0 0 25px rgba(253, 216, 53, 0.5)'
          }}
          animate={{ opacity: isCompacted ? 0.4 : 1, scale: isCompacted ? 0.8 : 1 }}
        />

        {/* 5. RÉTEG: SVG NÖVÉNY (Közös koordináta-rendszerben) */}
        <svg
          width="100%" height="100%" viewBox="0 0 300 350"
          style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
        >
          {/* SZÁR (Stem) */}
          <motion.path
            d={isCompacted ? stemPathCompacted : stemPathHealthy}
            stroke={isCompacted ? "#AED581" : "#66BB6A"}
            strokeWidth={isCompacted ? 4 : 6}
            strokeLinecap="round"
            fill="none"
            animate={{ d: isCompacted ? stemPathCompacted : stemPathHealthy }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          {/* LEVELEK (Leaves) */}
          <motion.path
            d={isCompacted ? leavesPathCompacted : leavesPathHealthy}
            stroke={isCompacted ? "#AED581" : "#43A047"}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            animate={{ d: isCompacted ? leavesPathCompacted : leavesPathHealthy }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* GYÖKÉRZET (Roots) */}
          <motion.path
            d={isCompacted ? rootPathCompacted : rootPathHealthy}
            stroke={isCompacted ? "#8D6E63" : "#D7CCC8"} // Kicsit sötétebb ha beteg
            strokeWidth={isCompacted ? 3 : 4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: isCompacted ? rootPathCompacted : rootPathHealthy }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>

        {/* 6. RÉTEG: VÍZ (Részecskék) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute', left: 0, top: 0, width: 6, height: 8,
                background: '#4FC3F7', borderRadius: '50%', boxShadow: '0 0 4px #29B6F6'
              }}
              initial={{ x: p.xStart, y: -20, opacity: 0 }}
              animate={isCompacted ? {
                // TÖMÖRÖDÖTT: Koppan a rétegen (155px) VAGY a felszínen (120px) és elfolyik
                y: [0, PAN_START_Y, PAN_START_Y + 5],
                x: [p.xStart, p.xStart, p.xStart + (p.id % 2 === 0 ? 100 : -100)], // Oldalra úszik
                opacity: [0, 1, 0],
                scale: [1, 1, 0]
              } : {
                // EGÉSZSÉGES: Lemegy mélyre
                y: [0, 480],
                x: p.xStart,
                opacity: [0, 1, 0],
                scale: [1, 1, 0.5]
              }}
              transition={{
                duration: isCompacted ? 1.5 : 2.5,
                repeat: Infinity,
                delay: p.delay,
                ease: isCompacted ? "easeOut" : "linear"
              }}
            />
          ))}
        </div>

        {/* 7. RÉTEG: UI OVERLAY (Skálák) */}

        {/* Jobb oldali Mélység Skála */}
        <div style={{ position: 'absolute', right: 10, top: GROUND_Y, bottom: 0, width: 40, zIndex: 20 }}>
          {[0, 10, 20, 30, 40, 50].map((cm) => (
            <div key={cm} style={{ position: 'absolute', top: cm * CM_TO_PX, right: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 1, background: 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{cm} cm</span>
            </div>
          ))}
        </div>

        {/* Bal oldali Penetrométer színskála (Függőleges) */}
        <div style={{
          position: 'absolute', left: 16, top: GROUND_Y + 10, height: '300px', width: 6, borderRadius: '3px',
          background: 'linear-gradient(180deg, #4CAF50 0%, #FFC107 40%, #D32F2F 100%)',
          zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }} />

      </div>

      {/* --- LÁBLÉC STATISZTIKA --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px', background: 'rgba(26, 22, 18, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <StatBox
          icon={<Sprout size={18} />}
          label="Gyökérzóna"
          value={isCompacted ? 'Sekély (20 cm)' : 'Mély (50 cm+)'}
          isGood={!isCompacted}
        />
        <StatBox
          icon={<Droplets size={18} />}
          label="Vízgazdálkodás"
          value={isCompacted ? 'Gyenge, felszíni elfolyás' : 'Kiegyensúlyozott'}
          isGood={!isCompacted}
        />
      </div>
    </motion.div>
  )
}

// Segédkomponens
function StatBox({ icon, label, value, isGood }: any) {
  return (
    <div style={{
      background: isGood ? 'rgba(76, 175, 80, 0.15)' : 'rgba(211, 47, 47, 0.15)',
      border: `1px solid ${isGood ? 'rgba(76, 175, 80, 0.3)' : 'rgba(211, 47, 47, 0.3)'}`,
      borderRadius: '12px', padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '6px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
        {icon} {label}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
          style={{
            color: isGood ? '#81C784' : '#EF5350',
            fontWeight: 800,
            fontSize: 'clamp(0.7rem, 2.5vw, 0.95rem)',
            whiteSpace: 'nowrap'
          }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}