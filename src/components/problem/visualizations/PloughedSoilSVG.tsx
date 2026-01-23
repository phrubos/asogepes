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
    // Palette
    const darkPalette = ['#4E342E', '#5D4037', '#6D4C41']
    const lightPalette = ['#6B5344', '#795548', '#8B7355']
    const skyColor = '#7B8FAD' // Muted Blue
    const soilBgColor = '#3E2723' // Deep brown background

    const clods = useMemo(() => {
        const items: ClodProps[] = []
        let seed = 4567
        const width = 300
        const soilSurface = 50
        const panStart = 116 // 20cm
        const maxDepth = 155 // 30cm+

        // 1. TOP LAYER (0 - 20cm) - Evenly distributed size 3-4 clods
        // Size 1-6 scale -> 1=2px, 6=12px. 
        // Size 3-4 -> 6px - 8px radius?
        // User asked for "3-4" sizes. Let's say r ~ 5-7.
        for (let y = soilSurface + 6; y < panStart - 6; y += 10) { // Spacing determined by size
            for (let x = -10; x < width + 10; x += 10) {
                const jx = x + (seededRandom(seed++) - 0.5) * 8
                const jy = y + (seededRandom(seed++) - 0.5) * 8

                // Size 3-4 logic
                const rBase = 5 + seededRandom(seed++) * 2 // 5 to 7
                const path = generateClodPath(jx, jy, rBase, seed++)

                // Mix of colors, mostly "soil" colors
                const isDark = seededRandom(seed++) > 0.4
                const variant = Math.floor(seededRandom(seed++) * 3)

                items.push({
                    id: `top-${items.length}`,
                    cx: jx, cy: jy, path,
                    delay: (y * width + x) * 0.00005,
                    variantIndex: variant,
                    isDark
                })
            }
        }

        // 2. PAN LAYER (20 - 30cm) - "Behind" the red line, size 5-6 clods
        // Size 5-6 -> 9px - 12px radius.
        for (let y = panStart + 10; y < maxDepth; y += 14) {
            for (let x = -10; x < width + 10; x += 14) {
                const jx = x + (seededRandom(seed++) - 0.5) * 10
                const jy = y + (seededRandom(seed++) - 0.5) * 4 // Less vertical jitter to keep in band

                const rBase = 9 + seededRandom(seed++) * 3 // 9 to 12
                const path = generateClodPath(jx, jy, rBase, seed++)

                // Compacted clods - mostly dark
                const isDark = true
                const variant = 0 // Darkest

                items.push({
                    id: `pan-${items.length}`,
                    cx: jx, cy: jy, path,
                    delay: 0.2 + (y * width + x) * 0.00005,
                    variantIndex: variant,
                    isDark
                })
            }
        }

        return items.sort((a, b) => a.cy - b.cy)
    }, [])

    return (
        <svg viewBox="0 0 300 150" style={{ width: '100%', height: 'auto', borderRadius: '8px', overflow: 'hidden' }} preserveAspectRatio="xMidYMid slice">
            <defs>
            </defs>

            {/* Flat Sky */}
            <rect x="0" y="0" width="300" height="50" fill={skyColor} />

            {/* Flat Soil Background */}
            <rect x="0" y="50" width="300" height="100" fill={soilBgColor} />

            {/* Particles - Render all first */}
            {clods.map((item) => {
                const fill = item.isDark
                    ? darkPalette[item.variantIndex]
                    : lightPalette[item.variantIndex]

                return (
                    <motion.path
                        key={item.id}
                        d={item.path}
                        fill={fill}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={0.5}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: item.delay }}
                    />
                )
            })}

            {/* Falling Water Drops - Stagnating at the Pan */}
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                    key={`drop-${i}`}
                    cx={30 + i * 35} // Spread across width
                    r={2}
                    fill="#64B5F6"
                    initial={{ cy: 0, opacity: 0 }}
                    animate={{
                        cy: [0, 112], // Fall to just above the pan (116)
                        opacity: [0, 0.8, 0.8, 0] // Fade out after stopping
                    }}
                    transition={{
                        duration: 3 + Math.random(), // Varied speed
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeIn", // Accelerate down
                        times: [0, 0.8, 0.9, 1] // Spend time "sitting" at the bottom
                    }}
                />
            ))}

            {/* Water Accumulation Band (Pulsating Blue Layer) */}
            <motion.rect
                x="0" y="110" width="300" height="6" // Thinner (6px), sits on Pan (116)
                fill="#64B5F6" // Matches raindrops
                stroke="#1E88E5" // Darker Contour
                strokeWidth="1"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Eketalp (Plough Pan) - Red Band (20-30cm -> 116-150px) */}
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                {/* Visual Red Layer "Over" the large clods but transparent enough to see them? 
                    User said "Behind the red line should be the ... clods". 
                    So Red Line is in front (overlay).
                */}
                <rect x="0" y="116" width="300" height="34" fill="#D32F2F" opacity="0.4" />

                {/* Stronger Top Border for definition */}
                <line x1="0" y1="116" x2="300" y2="116" stroke="#B71C1C" strokeWidth="2" strokeDasharray="6,4" />

                {/* Label */}
                <rect x="100" y="125" width="100" height="16" rx="4" fill="#C62828" />
                <text x="150" y="136" fill="white" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                    EKETALP
                </text>
            </motion.g>

        </svg>
    )
}

export default PloughedSoilSVG
