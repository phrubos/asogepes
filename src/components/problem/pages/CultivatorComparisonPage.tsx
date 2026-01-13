'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Layers } from 'lucide-react'
import styles from '../ProblemNew.module.css'

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

const comparisonData = {
    cultivator: {
        title: 'Nehézkultivátor talaj',
        items: [
            'A szármaradványok elégtelen beforgatása',
            'A lazítás egyenletlen, főként a kapák nyomában történik',
            'Ültetésre közvetlenül nem alkalmas',
        ],
    },
    spade: {
        title: 'Ásógépezett talaj',
        items: [
            'A szármaradványok a felszín alá kerülnek',
            'Egyenletesen laza szelvény alakul ki',
            'A vetés és ültetés rögtön kezdődhet',
        ],
    },
}

// Reuse the visual style from PloughingSoilComparison but stripped down
const CultivatorVisual = () => {
    const clods = useMemo(() => {
        const data: Array<{ cx: number; cy: number; rx: number; ry: number; type: string }> = []
        let seed = 100

        // Felső művelt réteg - nagyobb rögök
        for (let i = 0; i < 40; i++) {
            const cx = 20 + seededRandom(seed++) * 260
            const cy = 50 + seededRandom(seed++) * 40
            const size = 6 + seededRandom(seed++) * 8
            data.push({ cx, cy, rx: size, ry: size * 0.7, type: 'large' })
        }

        // Alsó réteg - nagyon tömör
        for (let i = 0; i < 30; i++) {
            const cx = 20 + seededRandom(seed++) * 260
            const cy = 100 + seededRandom(seed++) * 40
            const size = 10 + seededRandom(seed++) * 8
            data.push({ cx, cy, rx: size, ry: size * 0.5, type: 'compact' })
        }

        return data
    }, [])

    return (
        <svg viewBox="0 0 300 150" className={styles.soilSvg} preserveAspectRatio="none">
            <defs>
                <linearGradient id="cultivatorSoilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8D6E63" />
                    <stop offset="40%" stopColor="#6D4C41" />
                    <stop offset="45%" stopColor="#4E342E" />
                    <stop offset="100%" stopColor="#3E2723" />
                </linearGradient>
                <filter id="soilTextureCultivator">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.15" />
                    </feComponentTransfer>
                    <feBlend in="SourceGraphic" mode="overlay" />
                </filter>
            </defs>

            {/* Ég háttér */}
            <rect x="0" y="0" width="300" height="45" fill="#7B8FAD" />

            {/* Talaj háttér */}
            <rect x="0" y="45" width="300" height="105" fill="url(#cultivatorSoilGradient)" />
            <rect x="0" y="45" width="300" height="105" fill="url(#cultivatorSoilGradient)" filter="url(#soilTextureCultivator)" opacity="0.3" />

            {/* Talajfelszín vonal */}
            <line x1="0" y1="45" x2="300" y2="45" stroke="#8B7355" strokeWidth="2" />

            {/* Rögök */}
            {clods.map((clod, i) => (
                <motion.ellipse
                    key={i}
                    cx={clod.cx}
                    cy={clod.cy}
                    rx={clod.rx}
                    ry={clod.ry}
                    fill={clod.type === 'large' ? '#A1887F' : '#4E342E'}
                    stroke={clod.type === 'compact' ? '#3E2723' : 'none'}
                    strokeWidth={1}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: clod.type === 'large' ? 0.8 : 0.9 }}
                    transition={{ delay: i * 0.01, type: 'spring', stiffness: 150 }}
                />
            ))}
        </svg>
    )
}

const SpadeVisual = () => {
    const clods = useMemo(() => {
        const data: Array<{ cx: number; cy: number; rx: number; ry: number; type: string; delay: number }> = []
        let seed = 500

        // Egyenletes, apró rögök az egész szelvényben
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 12; col++) {
                const baseX = 15 + col * 24
                const baseY = 55 + row * 18
                const cx = baseX + (seededRandom(seed++) - 0.5) * 12
                const cy = baseY + (seededRandom(seed++) - 0.5) * 10

                const rand = seededRandom(seed++)
                let type = 'small'
                let size = 4 + seededRandom(seed++) * 3

                if (rand > 0.85) {
                    type = 'medium'
                    size = 6 + seededRandom(seed++) * 4
                } else if (rand > 0.95) {
                    type = 'large'
                    size = 8 + seededRandom(seed++) * 3
                }

                data.push({
                    cx: cx > 290 ? 290 : cx,
                    cy,
                    rx: size,
                    ry: size * 0.75,
                    type,
                    delay: (row * 12 + col) * 0.005
                })
            }
        }
        return data
    }, [])

    return (
        <svg viewBox="0 0 300 150" className={styles.soilSvg} preserveAspectRatio="none">
            <defs>
                <linearGradient id="spadedSoilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8D6E63" />
                    <stop offset="50%" stopColor="#795548" />
                    <stop offset="100%" stopColor="#6D4C41" />
                </linearGradient>
                <filter id="soilTextureSpaded">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.1" />
                    </feComponentTransfer>
                    <feBlend in="SourceGraphic" mode="overlay" />
                </filter>
            </defs>

            {/* Ég háttér */}
            <rect x="0" y="0" width="300" height="45" fill="#7B8FAD" />

            {/* Talaj háttér */}
            <rect x="0" y="45" width="300" height="105" fill="url(#spadedSoilGradient)" />
            <rect x="0" y="45" width="300" height="105" fill="url(#spadedSoilGradient)" filter="url(#soilTextureSpaded)" opacity="0.2" />

            {/* Talajfelszín vonal */}
            <line x1="0" y1="45" x2="300" y2="45" stroke="#8B7355" strokeWidth="2" />

            {/* Egyenletes rögök */}
            {clods.map((clod, i) => (
                <motion.ellipse
                    key={i}
                    cx={clod.cx}
                    cy={clod.cy}
                    rx={clod.rx}
                    ry={clod.ry}
                    fill={clod.type === 'small' ? '#BCAAA4' : clod.type === 'medium' ? '#A1887F' : '#8D6E63'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.85 }}
                    transition={{ delay: clod.delay, type: 'spring', stiffness: 200 }}
                />
            ))}
        </svg>
    )
}

export default function CultivatorComparisonPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`${styles.contentWrapper} ${styles.comparisonPageWrapper}`}
        >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span className={styles.pillBadge}>Talajszelvény összehasonlítás</span>
            </motion.div>

            <div className={styles.soilProfilesContainer} style={{ alignItems: 'start', marginBottom: '0' }}>
                <motion.div
                    className={styles.soilProfile}
                    whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <div className={`${styles.soilProfileHeader} ${styles.negativeHeader}`}>
                        <X size={16} strokeWidth={2.5} />
                        <span>Nehézkultivátorozott talaj</span>
                    </div>

                    <div className={styles.soilProfileVisual} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                        <CultivatorVisual />
                        <ul className={styles.comparisonList} style={{ padding: '0 0.5rem', marginTop: '0.25rem' }}>
                            {comparisonData.cultivator.items.map((item, i) => (
                                <li key={i}><X size={14} className={styles.iconNegative} strokeWidth={3} /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.soilProfile}
                    whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(107, 139, 94, 0.25)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <div className={`${styles.soilProfileHeader} ${styles.positiveHeader}`}>
                        <Check size={16} strokeWidth={2.5} />
                        <span>Ásógépezett talaj</span>
                    </div>

                    <div className={styles.soilProfileVisual} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                        <SpadeVisual />
                        <ul className={styles.comparisonList} style={{ padding: '0 0.5rem', marginTop: '0.25rem' }}>
                            {comparisonData.spade.items.map((item, i) => (
                                <li key={i}><Check size={14} className={styles.iconPositive} strokeWidth={3} /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
