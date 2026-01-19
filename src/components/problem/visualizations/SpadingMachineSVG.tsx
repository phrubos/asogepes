'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

// Generate organic clod shape (irregular polygon)
// Same function as HeavyCultivatorSVG for consistency
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
    isDark: boolean // Track if it's from dark or light palette
}

const SpadingMachineSVG = () => {
    // Shared Palette - High Contrast
    const darkPalette = [
        '#3E2723', // Deep Brown
        '#5D4037', // Earthy Dark
        '#795548'  // Lighter Brown
    ]

    const lightPalette = [
        '#BCAAA4', // Rosy Beige
        '#D7CCC8', // Light Tan
        '#F5F5F5'  // Bone White
    ]

    const skyColor = '#90CAF9' // Brighter Blue
    const soilBgColor = '#A1887F' // Medium-Light Brown

    const clods = useMemo(() => {
        const items: ClodProps[] = []
        let seed = 7777 // Different seed
        const width = 300
        // max depth is same visual scale
        const soilSurface = 45
        const maxDepth = 145

        // Depth zones:
        // 0-30cm scale corresponds to 45y to 145y (100 units = 30cm)
        // Pure light zone: 0-12cm -> y = 45 to 85
        // Transition zone: 12-20cm -> y = 85 to 112 (gradual dark clod introduction)
        // Pure dark zone: 20-30cm -> y = 112 to 145
        const transitionStart = 85
        const transitionEnd = 112

        // 1. TOP LAYER (0-20 cm) -> Small Light Clods with gradual dark mixing
        for (let y = soilSurface + 8; y < transitionEnd; y += 7) {
            for (let x = -10; x < width + 10; x += 7) {
                // Jitter
                const jx = x + (seededRandom(seed++) - 0.5) * 6
                const jy = y + (seededRandom(seed++) - 0.5) * 6

                // Calculate transition progress (0 = pure light, 1 = transition end)
                let darkProbability = 0
                let darkSizeMultiplier = 0.5
                
                if (jy >= transitionStart && jy < transitionEnd) {
                    // In transition zone: gradually increase dark clod probability
                    const progress = (jy - transitionStart) / (transitionEnd - transitionStart)
                    darkProbability = progress * 0.6 // Max 60% dark at transition end
                    darkSizeMultiplier = 0.5 + progress * 0.5 // Size grows from 50% to 100%
                }

                // Decide if this clod should be dark (in transition zone)
                const shouldBeDark = seededRandom(seed++) < darkProbability

                if (shouldBeDark) {
                    // Dark clod in transition zone (smaller than bottom layer)
                    const rRand = seededRandom(seed++)
                    let variant = 2
                    let r = 4

                    if (rRand > 0.7) {
                        variant = 1 // Medium dark
                        r = (5 + seededRandom(seed++) * 1.5) * darkSizeMultiplier
                    } else {
                        variant = 2 // Small dark
                        r = (4 + seededRandom(seed++) * 1) * darkSizeMultiplier
                    }

                    const path = generateClodPath(jx, jy, r, seed++)

                    items.push({
                        id: `trans-dark-${items.length}`,
                        cx: jx, cy: jy, path,
                        delay: 0.1 + items.length * 0.0005,
                        variantIndex: variant,
                        isDark: true
                    })
                } else {
                    // Light clod (normal behavior)
                    const rRand = seededRandom(seed++)
                    let variant = 2
                    let r = 3

                    if (rRand > 0.8) {
                        variant = 0 // Large Light
                        r = 4.5 + seededRandom(seed++) * 1
                    } else if (rRand > 0.4) {
                        variant = 1 // Medium Light
                        r = 3.5 + seededRandom(seed++) * 1
                    } else {
                        variant = 2 // Small Light
                        r = 2.5 + seededRandom(seed++) * 1.5
                    }

                    const path = generateClodPath(jx, jy, r, seed++)

                    items.push({
                        id: `top-${items.length}`,
                        cx: jx, cy: jy, path,
                        delay: 0.1 + items.length * 0.0005,
                        variantIndex: variant,
                        isDark: false
                    })
                }
            }
        }

        // 2. BOTTOM LAYER (> 20 cm) -> Large Dark Clods with some light mixing at top
        for (let y = transitionEnd; y < maxDepth; y += 10) {
            for (let x = -10; x < width + 10; x += 10) {
                const jx = x + (seededRandom(seed++) - 0.5) * 8
                const jy = y + (seededRandom(seed++) - 0.5) * 8

                // Near the transition, add occasional smaller/lighter clods
                const distFromTransition = jy - transitionEnd
                const lightProbability = Math.max(0, 0.3 - distFromTransition * 0.015)
                const addLightClod = seededRandom(seed++) < lightProbability

                if (addLightClod) {
                    // Add a light clod for smoother transition
                    const variant = seededRandom(seed++) > 0.5 ? 0 : 1
                    const r = 3 + seededRandom(seed++) * 1.5

                    const path = generateClodPath(jx, jy, r, seed++)

                    items.push({
                        id: `bottom-light-${items.length}`,
                        cx: jx, cy: jy, path,
                        delay: items.length * 0.001,
                        variantIndex: variant,
                        isDark: false
                    })
                }

                // Always add dark clod
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

                const path = generateClodPath(jx, jy, r, seed++)

                items.push({
                    id: `bottom-${items.length}`,
                    cx: jx, cy: jy, path,
                    delay: items.length * 0.001,
                    variantIndex: variant,
                    isDark: true
                })
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
                const fill = item.isDark
                    ? darkPalette[item.variantIndex]
                    : lightPalette[item.variantIndex]

                return (
                    <motion.path
                        key={item.id}
                        d={item.path}
                        fill={fill}
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

export default SpadingMachineSVG
