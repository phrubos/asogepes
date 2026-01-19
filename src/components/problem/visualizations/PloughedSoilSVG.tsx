'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

// Reuse organic clod shape logic
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

interface ClodProps {
    id: string
    cx: number
    cy: number
    path: string
    delay: number
    variantIndex: number
    isDark: boolean
}

const PloughedSoilSVG = () => {
    // Original "Plowed Soil" Palette (Darker, less contrast)
    // Based on SoilComparison.tsx gradients: #8B7355 start, #6B5344 end, #5D4037 deep
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

    const skyColor = '#7B8FAD' // Muted Blue from original
    const soilBgColor = '#3E2723' // Deep brown background

    const clods = useMemo(() => {
        const items: ClodProps[] = []
        let seed = 1234
        const width = 300
        const soilSurface = 45
        const maxDepth = 145

        // Use HeavyCultivator Logic (U-Pattern) to represent "Plowed" structure
        // (Large clods, uneven surface, compaction)
        const uCenters = [50, 150, 250]
        const uOuterWidth = 96
        const uInnerWidth = 50
        const uBottom = 96 // ~15-20cm

        const getZone = (x: number, y: number): 'outline' | 'inside' | 'outside' => {
            for (const center of uCenters) {
                const dx = Math.abs(x - center)
                const dy = y - soilSurface

                // U-shape bounding box
                if (dx < uOuterWidth / 2 && dy < (uBottom - soilSurface)) {
                    // Check if inside inner cutout
                    // Tapering logic
                    const progress = dy / (uBottom - soilSurface)
                    const currentInnerWidth = uInnerWidth * (1 - progress * 0.5)

                    if (dx < currentInnerWidth / 2) {
                        return 'inside'
                    }
                    return 'outline'
                }
            }
            return 'outside'
        }

        // 1. RIDGES (Outline + Support) - Darker/Larger
        for (let y = soilSurface + 10; y < maxDepth; y += 8) {
            for (let x = -10; x < width + 10; x += 8) {
                const zone = getZone(x, y)
                if (zone === 'inside') continue

                const jx = x + (seededRandom(seed++) - 0.5) * 6
                const jy = y + (seededRandom(seed++) - 0.5) * 6

                let variant = 0
                let r = 8
                const rRand = seededRandom(seed++)
                if (rRand > 0.6) { variant = 0; r = 9 + seededRandom(seed++) * 2 }
                else if (rRand > 0.3) { variant = 1; r = 7 + seededRandom(seed++) * 1.5 }
                else { variant = 2; r = 5 + seededRandom(seed++) * 1.5 }

                // Force larger clods at structure boundary (like HeavyCultivator)
                if (zone === 'outline') {
                    for (const center of uCenters) {
                        const dx = Math.abs(x - center)
                        if (dx >= 25 && dx <= 38 && y < uBottom + 5) {
                            variant = 0
                            r = 10 + seededRandom(seed++) * 1.5
                            break
                        }
                    }
                }

                // Compaction Layer (Pan) at 25-30cm (y=112 to y=125)
                // Force flat, dense structure
                if (y >= 115 && y <= 130) {
                    variant = 0 // Darkest
                    r = 6 + seededRandom(seed++) * 4 // Mixed sizes but tight
                }

                const path = generateClodPath(jx, jy, r, seed++)
                items.push({ id: `ridge-${items.length}`, cx: jx, cy: jy, path, delay: 0.2 + items.length * 0.0001, variantIndex: variant, isDark: true })
            }
        }

        // 2. INSIDE TRACKS - Lighter/Smaller
        for (let y = soilSurface + 5; y < maxDepth; y += 5) {
            for (let x = -10; x < width + 10; x += 5) {
                if (getZone(x, y) !== 'inside') continue

                const jx = x + (seededRandom(seed++) - 0.5) * 4
                const jy = y + (seededRandom(seed++) - 0.5) * 4

                let variant = 2
                let r = 3
                const rRand = seededRandom(seed++)
                if (rRand > 0.8) { variant = 0; r = 4.5 }
                else if (rRand > 0.4) { variant = 1; r = 3.5 }
                else { variant = 2; r = 2.5 }

                const path = generateClodPath(jx, jy, r, seed++)
                items.push({ id: `track-${items.length}`, cx: jx, cy: jy, path, delay: 0.4 + items.length * 0.0005, variantIndex: variant, isDark: false })
            }
        }

        return items.sort((a, b) => a.cy - b.cy)
    }, [])

    // Water Pooling (Pangóvíz) - above the pan (y=96)
    const waterPools = useMemo(() => {
        const pools = []
        for (let i = 0; i < 8; i++) {
            pools.push({
                cx: 40 + i * 38,
                cy: 94, // Just above the pan
                rx: 12 + Math.random() * 5,
                delay: Math.random() * 2
            })
        }
        return pools
    }, [])

    return (
        <svg viewBox="0 0 300 150" style={{ width: '100%', height: 'auto', borderRadius: '8px', overflow: 'hidden' }} preserveAspectRatio="xMidYMid slice">
            {/* Flat Sky */}
            <rect x="0" y="0" width="300" height="50" fill={skyColor} />

            {/* Flat Soil Background */}
            <rect x="0" y="50" width="300" height="112" fill={soilBgColor} />

            {/* Particles */}
            {clods.map((item) => {
                const fill = item.isDark
                    ? darkPalette[item.variantIndex]
                    : lightPalette[item.variantIndex]

                return (
                    <motion.path
                        key={item.id}
                        d={item.path}
                        fill={fill}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth={0.5}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: item.delay }}
                    />
                )
            })}

            {/* Surface Line */}
            {/* <rect x="0" y="44" width="300" height="2" fill="#5D4037" opacity={0.8} /> */}

            {/* Eketalp (Plough Pan) - Solid Red Band aligned with U-bottom */}
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                {/* Translucent Red Overlay - ~7cm height */}
                <rect x="0" y="96" width="300" height="24" fill="#C62828" opacity="0.6" />

                {/* Dashed Borders */}
                <line x1="0" y1="96" x2="300" y2="96" stroke="#B71C1C" strokeWidth="1.5" strokeDasharray="4,2" />
                <line x1="0" y1="120" x2="300" y2="120" stroke="#B71C1C" strokeWidth="1.5" strokeDasharray="4,2" />

                {/* Label Badge */}
                <rect x="85" y="103" width="130" height="10" rx="2" fill="#C62828" />
                <text x="150" y="111" fill="white" fontSize="7" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                    EKETALP (20+ bar)
                </text>
            </motion.g>

            {/* Water Pooling (Pangóvíz) */}
            {waterPools.map((pool, i) => (
                <motion.ellipse
                    key={`pool-${i}`}
                    cx={pool.cx} cy={pool.cy}
                    rx={pool.rx} ry={3}
                    fill="#4FC3F7"
                    opacity={0.7}
                    animate={{ rx: [pool.rx, pool.rx + 2, pool.rx], opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, delay: pool.delay }}
                />
            ))}
        </svg>
    )
}

export default PloughedSoilSVG
