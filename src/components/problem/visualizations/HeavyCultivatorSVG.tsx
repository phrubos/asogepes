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
        const uBottom = 96 // Approx 15cm (Half of 100 unit soil depth)

        const getZone = (x: number, y: number): 'outline' | 'inside' | 'outside' => {
            for (const center of uCenters) {
                const dx = Math.abs(x - center)
                const dy = y - soilSurface
                if (dy < 0) continue
                if (y > uBottom + 10) continue

                if (dx < uInnerWidth / 2 && y < uBottom - 10) return 'inside'

                const inOuter = dx < uOuterWidth / 2
                const inInner = dx < uInnerWidth / 2
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
        for (let y = soilSurface + 10; y < maxDepth; y += 8) {
            // Extended bounds to ensure edges are filled (-10 to width + 10)
            for (let x = -10; x < width + 10; x += 8) {
                const zone = getZone(x, y)
                if (zone === 'inside') continue // handled in next pass

                // Scale jitter
                const jx = x + (seededRandom(seed++) - 0.5) * 8
                const jy = y + (seededRandom(seed++) - 0.5) * 8

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

                // NEW REQUEST: 15-20cm layer should be emphatically large dark rocks
                // 15cm ~ y=95, 20cm ~ y=112. Let's cover 95 to 115.
                if (y >= 95 && y <= 118) {
                    variant = 0
                    r = 10 + seededRandom(seed++) * 2 // Force very large
                }

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
        for (let y = soilSurface + 10; y < uBottom - 5; y += 6) {
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

            {/* Surface Line */}
            <rect x="0" y="44" width="300" height="2" fill="#3E2723" opacity={0.5} />

            {/* Depth Scale */}
            <g style={{ pointerEvents: 'none' }}>
                <line x1="292" y1="45" x2="292" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4,3" />
                <rect x="268" y="32" width="28" height="14" rx="3" fill="rgba(0,0,0,0.3)" />
                <text x="282" y="43" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">0 cm</text>
                <text x="287" y="148" fill="rgba(255, 255, 255, 0.95)" fontSize="9" fontWeight="600" textAnchor="end" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>30 cm</text>
            </g>
        </svg>
    )
}

export default HeavyCultivatorSVG
