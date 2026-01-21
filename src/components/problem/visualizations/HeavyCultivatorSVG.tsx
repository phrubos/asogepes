'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

// Generate organic clod shape (irregular polygon)
// Smooth but not perfect circle
const generateClodPath = (cx: number, cy: number, r: number, seed: number) => {
    const points = []
    const numPoints = 8 + Math.floor(seededRandom(seed) * 4) // 8-12 points for smoother organic feel
    const angleStep = (Math.PI * 2) / numPoints

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep
        // Reduced variance for "clod" look vs "shard" look
        // 0.8 to 1.1 range
        const rVar = r * (0.8 + seededRandom(seed + i) * 0.3)
        const px = cx + Math.cos(angle) * rVar
        const py = cy + Math.sin(angle) * rVar
        points.push(`${px},${py}`)
    }
    // Return smooth bezier curve approximation or simple polygon?
    // Start with polygon but higher vertex count looks rounded enough at small scales
    // For "flat design" sometimes slightly rounded corners are nice, but straight lines work too.
    return `M${points.join(' L')} Z`
}

interface ClodProps {
    id: string
    type: 'outline' | 'support' | 'fill'
    cx: number
    cy: number
    path: string // Store path d
    delay: number
    variantIndex?: number
}

const HeavyCultivatorSVG = () => {
    // High Contrast Palette for Dark Website
    const darkPalette = [
        '#3E2723', // Deep Brown (retained for strongest contrast)
        '#5D4037', // Earthy Dark
        '#795548'  // lighter Brown
    ]

    // Much lighter "Light" palette to pop against dark background
    const lightPalette = [
        '#BCAAA4', // Rosy Beige
        '#D7CCC8', // Light Tan
        '#F5F5F5'  // Bone White (High brightness)
    ]

    const skyColor = '#90CAF9' // Brighter Blue
    const soilBgColor = '#A1887F' // Medium-Light Brown (Provides contrast for both dark and light clods)

    const clods = useMemo(() => {
        const items: ClodProps[] = []
        let seed = 4444
        const width = 300
        const height = 150
        const soilSurface = 45
        const maxDepth = 145

        // U-Shapes Config
        const uCenters = [50, 150, 250]
        const uOuterWidth = 96
        const uInnerWidth = 50
        const uBottom = 125 // Slightly deeper as requested (was 115)

        const getZone = (x: number, y: number): 'outline' | 'inside' | 'outside' => {
            for (const center of uCenters) {
                const dx = Math.abs(x - center)
                const dy = y - soilSurface
                if (dy < 0) continue
                // Zone logic typically stops around uBottom
                // We want "outline" logic to potentially continue for the walls, but below uBottom is "outside" (bedrock/compact)
                // actually if we want "dark clods" everywhere below, 'outside' is fine if we handle it.

                if (dx < uInnerWidth / 2 && y < uBottom - 10) return 'inside'

                const inOuter = dx < uOuterWidth / 2
                const inInner = dx < uInnerWidth / 2
                // Bottom curve of the U
                const isBottom = (y > uBottom - 15 && y < uBottom + 10 && dx < uOuterWidth / 2)

                if ((inOuter && !inInner) || isBottom) return 'outline'
            }
            return 'outside'
        }

        // 1. RIDGES (Outline + Support)
        // We use the "Dark Palette" here.
        // 3 Variants:
        // - Large: r=8-10, Color 0
        // - Med:   r=6-7, Color 1
        // - Small: r=4-5, Color 2
        for (let y = soilSurface; y < maxDepth + 10; y += 8.3) { // Start at soilSurface to fill top gap
            for (let x = -10; x < width + 10; x += 8.3) {
                const zone = getZone(x, y)
                if (zone === 'inside') continue // handled in next pass

                // Scale jitter
                const jx = x + (seededRandom(seed++) - 0.5) * 8
                const jy = y + (seededRandom(seed++) - 0.5) * 8

                // Skip if below maxDepth (visually bounded)
                if (jy > maxDepth + 5) continue;

                // Randomly select one of the 3 dark variants
                // Bias towards Larger ones in Outline?
                const rRand = seededRandom(seed++)
                let variant = 0
                let r = 8

                if (rRand > 0.6) {
                    variant = 0 // Large
                    r = 9 + seededRandom(seed++) * 2
                } else if (rRand > 0.3) {
                    variant = 1 // Med
                    r = 7 + seededRandom(seed++) * 1.5
                } else {
                    variant = 2 // Small
                    r = 5 + seededRandom(seed++) * 1.5
                }

                // CRITICAL UPDATE: emphasize boundary
                // If we are in the Outline zone AND near the inner edge (the interface with the track),
                // Force the Largest, Darkest variant (0).
                if (zone === 'outline') {
                    // Check distance to nearest center
                    for (const center of uCenters) {
                        const dx = Math.abs(x - center)
                        // Inner width is 50 -> Boundary is 25.
                        // If we are between 25 and 38 (the immediate wall), force BIG/DARK.
                        if (dx >= 25 && dx <= 38 && y < uBottom + 5) {
                            variant = 0 // Force Largest/Darkest
                            r = 10 + seededRandom(seed++) * 1.5 // Ensure it's big substantial rocks
                            break
                        }
                    }
                }

                // USER REQUEST: Only the bottom of the "pits" (U-patterns) should be the darkest clods
                // Check if we are physically below a U-shape
                for (const center of uCenters) {
                    const dx = Math.abs(x - center)
                    // If we are somewhat aligned with the pit (width 50) and at the bottom depth
                    if (dx < uInnerWidth / 2 + 5 && y >= uBottom - 5 && y <= uBottom + 20) {
                        variant = 0; // Force Largest/Darkest
                        r = 10 + seededRandom(seed++) * 1.5;
                        break;
                    }
                }

                // Removed forced "large dark" block for y >= uBottom to allow natural mixed texture
                // similar to SpadingMachine bottom layer.

                if (zone === 'outline' && variant === 2) {
                    // Upgrade small ones in outer shell to medium occasionally
                    if (seededRandom(seed++) > 0.5) variant = 1
                }

                const path = generateClodPath(jx, jy, r, seed++)

                items.push({
                    id: `ridge-${items.length}`,
                    type: 'outline', // we reuse this label for darks
                    cx: jx, cy: jy, path,
                    delay: items.length * 0.001,
                    // Store variant index for coloring
                    variantIndex: variant
                })
            }
        }

        // 2. TRACKS (Fill)
        // We use the "Light Palette" here.
        // 3 Variants:
        // - Large: r=4.5-5.5, Color 0
        // - Med:   r=3.5-4.5, Color 1
        // - Small: r=2-3.5, Color 2
        for (let y = soilSurface; y < uBottom - 5; y += 6) { // Start at soilSurface
            for (let x = 10; x < width - 10; x += 6) {
                const jx = x + (seededRandom(seed++) - 0.5) * 4
                const jy = y + (seededRandom(seed++) - 0.5) * 4

                if (getZone(jx, jy) === 'inside') {
                    const rRand = seededRandom(seed++)
                    let variant = 0
                    let r = 4

                    if (rRand > 0.7) {
                        variant = 0
                        r = 4.5 + seededRandom(seed++) * 1
                    } else if (rRand > 0.3) {
                        variant = 1
                        r = 3.5 + seededRandom(seed++) * 1
                    } else {
                        variant = 2
                        r = 2 + seededRandom(seed++) * 1.5
                    }

                    const path = generateClodPath(jx, jy, r, seed++)

                    items.push({
                        id: `fill-${items.length}`,
                        type: 'fill', cx: jx, cy: jy, path,
                        delay: 0.2 + items.length * 0.001,
                        variantIndex: variant
                    })
                }
            }
        }

        return items.sort((a, b) => a.cy - b.cy)

    }, [])

    return (
        <svg viewBox="0 0 300 150" style={{ width: '100%', height: 'auto', borderRadius: '8px', overflow: 'hidden' }} preserveAspectRatio="xMidYMid slice">
            {/* Flat Sky */}
            <rect x="0" y="0" width="300" height="45" fill={skyColor} />

            {/* Flat Soil Background */}
            <rect x="0" y="45" width="300" height="105" fill={soilBgColor} />

            {/* Particles */}
            {clods.map((item) => {
                let fill = '#000'
                if (item.type === 'outline') {
                    // Dark Palette
                    fill = darkPalette[item.variantIndex!]
                } else {
                    // Light Palette
                    fill = lightPalette[item.variantIndex!]
                }

                return (
                    <motion.path
                        key={item.id}
                        d={item.path}
                        fill={fill}
                        // Add Outline/Stroke
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={0.8}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: item.delay, duration: 0.3 }}
                    />
                )
            })}



            {/* Depth Scale */}
            <g style={{ pointerEvents: 'none' }}>
                <line x1="292" y1="45" x2="292" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4,3" />
                <rect x="268" y="32" width="28" height="14" rx="3" fill="rgba(0,0,0,0.3)" />
                <text x="282" y="43" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">0 cm</text>

                {/* 30cm label moved to align with U-pattern bottom (approx 20-22cm visual depth before compaction starts) */}
                <rect x="250" y="108" width="46" height="14" rx="3" fill="rgba(0,0,0,0.4)" />
                <text x="273" y="119" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">30 cm</text>
            </g>
        </svg>
    )
}

export default HeavyCultivatorSVG
