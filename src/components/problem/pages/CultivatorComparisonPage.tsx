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

interface ClodProps {
    cx: number
    cy: number
    rx: number
    ry: number
    type?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
    delay?: number
    opacity?: number
}

const Clod = ({ cx, cy, rx, ry, type = 'medium', delay = 0, opacity = 1 }: ClodProps) => {
    const colors: Record<string, string> = {
        tiny: '#D7CCC8',
        small: '#BCAAA4',
        medium: '#A1887F',
        large: '#8D6E63',
        huge: '#6D4C41',
    }

    return (
        <motion.ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={colors[type]}
            fillOpacity={opacity}
            stroke={type === 'large' || type === 'huge' ? '#5D4037' : 'none'}
            strokeWidth={type === 'large' || type === 'huge' ? 0.5 : 0}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                delay: delay,
                type: "spring",
                stiffness: 150,
                damping: 20
            }}
        />
    )
}

const DepthMarkers = () => (
    <g style={{ pointerEvents: 'none' }}>
        <line x1="292" y1="45" x2="292" y2="145" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="4,3" />
        <rect x="268" y="32" width="28" height="14" rx="3" fill="rgba(62, 39, 35, 0.85)" />
        <text x="282" y="43" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">0 cm</text>
        <text x="287" y="148" fill="rgba(255, 255, 255, 0.95)" fontSize="9" fontWeight="600" textAnchor="end" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}>30 cm</text>
    </g>
)

const CultivatorVisual = () => {
    const trackLeft = { center: 90, bottom: 130 }
    const trackRight = { center: 210, bottom: 130 }

    const crumbsLeftTrack = useMemo(() => {
        const crumbs = []
        for (let i = 0; i < 20; i++) {
            const depth = 78 + seededRandom(i) * 11
            const spread = 8
            const offsetX = (seededRandom(i + 100) - 0.5) * spread
            crumbs.push({
                cx: trackLeft.center + offsetX,
                cy: depth,
                rx: 1.5 + seededRandom(i + 300) * 2,
                ry: 1.5 + seededRandom(i + 400) * 1.5,
                delay: 0.4 + i * 0.02
            })
        }
        return crumbs
    }, [])

    const crumbsRightTrack = useMemo(() => {
        const crumbs = []
        for (let i = 0; i < 20; i++) {
            const depth = 78 + seededRandom(i + 500) * 11
            const spread = 8
            const offsetX = (seededRandom(i + 600) - 0.5) * spread
            crumbs.push({
                cx: trackRight.center + offsetX,
                cy: depth,
                rx: 1.5 + seededRandom(i + 800) * 2,
                ry: 1.5 + seededRandom(i + 900) * 1.5,
                delay: 0.5 + i * 0.02
            })
        }
        return crumbs
    }, [])

    const compactBlocks = useMemo(() => [
        { cx: 30, cy: 75, rx: 22, ry: 18, delay: 0.2 },
        { cx: 25, cy: 105, rx: 18, ry: 14, delay: 0.25 },
        { cx: 40, cy: 130, rx: 16, ry: 12, delay: 0.3 },
        { cx: 150, cy: 70, rx: 28, ry: 20, delay: 0.35 },
        { cx: 145, cy: 100, rx: 22, ry: 16, delay: 0.4 },
        { cx: 155, cy: 125, rx: 20, ry: 14, delay: 0.45 },
        { cx: 135, cy: 115, rx: 15, ry: 12, delay: 0.5 },
        { cx: 270, cy: 75, rx: 22, ry: 18, delay: 0.55 },
        { cx: 265, cy: 105, rx: 18, ry: 14, delay: 0.6 },
        { cx: 275, cy: 130, rx: 16, ry: 12, delay: 0.65 },
    ], [])

    return (
        <svg viewBox="0 0 300 150" className={styles.soilSvg}>
            <defs>
                <linearGradient id="cultivatorSoilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5D4037" />
                    <stop offset="100%" stopColor="#3E2723" />
                </linearGradient>
                <radialGradient id="blockGradient" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#6D4C41" />
                    <stop offset="100%" stopColor="#4E342E" />
                </radialGradient>
                <radialGradient id="crumbGradient" cx="40%" cy="40%">
                    <stop offset="0%" stopColor="#D7CCC8" />
                    <stop offset="100%" stopColor="#BCAAA4" />
                </radialGradient>
            </defs>

            <motion.rect
                x="0" y="45" width="300" height="105"
                fill="url(#cultivatorSoilGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            <motion.path
                d={`M60,45 Q90,138 120,45`}
                fill="#F5F0EB"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{ transformOrigin: '90px 45px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
            />

            <motion.path
                d={`M180,45 Q210,138 240,45`}
                fill="#F5F0EB"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{ transformOrigin: '210px 45px' }}
                transition={{ duration: 0.6, delay: 0.3 }}
            />

            {compactBlocks.map((block, i) => (
                <motion.ellipse
                    key={`block-${i}`}
                    cx={block.cx}
                    cy={block.cy}
                    rx={block.rx}
                    ry={block.ry}
                    fill="url(#blockGradient)"
                    stroke="#2D1F1A"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: block.delay, type: "spring", stiffness: 120, damping: 15 }}
                    style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.4))' }}
                />
            ))}

            <g>
                {crumbsLeftTrack.map((c, i) => (
                    <motion.ellipse
                        key={`lt-${i}`}
                        cx={c.cx}
                        cy={c.cy}
                        rx={c.rx}
                        ry={c.ry}
                        fill="url(#crumbGradient)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.9 }}
                        transition={{ delay: c.delay, type: "spring", stiffness: 200, damping: 20 }}
                    />
                ))}
            </g>

            <g>
                {crumbsRightTrack.map((c, i) => (
                    <motion.ellipse
                        key={`rt-${i}`}
                        cx={c.cx}
                        cy={c.cy}
                        rx={c.rx}
                        ry={c.ry}
                        fill="url(#crumbGradient)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.9 }}
                        transition={{ delay: c.delay, type: "spring", stiffness: 200, damping: 20 }}
                    />
                ))}
            </g>

            <motion.path
                d={`M60,45 Q90,138 120,45`}
                fill="none"
                stroke="#6D4C41"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.path
                d={`M180,45 Q210,138 240,45`}
                fill="none"
                stroke="#6D4C41"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
            />

            <DepthMarkers />
        </svg>
    )
}

const SpadeVisual = () => {
    const clods = useMemo(() => {
        const data: { cx: number; cy: number; rx: number; ry: number; type: ClodProps['type']; id: string }[] = []
        const rows = 5
        const cols = 12
        let seed = 1000
        const surfaceY = 45
        const minPadding = 8

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const xBase = (c / cols) * 275 + 15
                const rand = seededRandom(seed++)
                let type: ClodProps['type'] = 'medium'
                let size = 5

                if (rand < 0.45) { type = 'tiny'; size = 2 + seededRandom(seed++) * 1.5 }
                else if (rand < 0.75) { type = 'small'; size = 3 + seededRandom(seed++) * 2 }
                else if (rand < 0.92) { type = 'medium'; size = 5 + seededRandom(seed++) * 2 }
                else { type = 'large'; size = 7 + seededRandom(seed++) * 2 }

                const ry = size * 0.8
                const minCy = surfaceY + ry + minPadding
                const maxCy = 140 - ry
                const yBase = minCy + (r / rows) * (maxCy - minCy)
                const cx = xBase + (seededRandom(seed++) * 10 - 5)
                const cy = yBase + (seededRandom(seed++) * 6 - 3)

                data.push({ cx, cy: Math.max(cy, minCy), rx: size, ry, type, id: `${r}-${c}` })
            }
        }
        return data
    }, [])

    return (
        <svg viewBox="0 0 300 150" className={styles.soilSvg}>
            <defs>
                <linearGradient id="spadeSoilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8D6E63" />
                    <stop offset="100%" stopColor="#6D4C41" />
                </linearGradient>
            </defs>

            <motion.rect
                x="0" y="45" width="300" height="105"
                fill="url(#spadeSoilGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {clods.map((clod, i) => (
                <Clod
                    key={clod.id}
                    {...clod}
                    delay={i * 0.008}
                />
            ))}

            <motion.line
                x1="0" y1="45" x2="300" y2="45"
                stroke="#A1887F"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
            />

            <DepthMarkers />
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
            className={styles.contentWrapper}
            style={{
                minHeight: 'auto',
                paddingBottom: '90px',
                paddingTop: '60px',
                paddingLeft: '4%',
                paddingRight: '4%',
                marginTop: '0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
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
                        <span>Nehézkultivátor szelvény</span>
                    </div>

                    <div className={styles.soilProfileVisual} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>

                        <div style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.4',
                            color: 'rgba(255, 255, 255, 0.9)',
                            background: 'rgba(229, 115, 115, 0.08)',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '8px',
                            borderLeft: '3px solid #E57373',
                            marginBottom: '0'
                        }}>
                            A kapa nyomában (25-30 cm mélyen) <strong style={{ color: '#FFCDD2', fontWeight: 700 }}>apró morzsás talaj</strong> gyűlik össze.
                            A sorközökben <em style={{ color: '#E57373', fontWeight: 600, fontStyle: 'normal' }}>nagy, tömör rögök</em> maradnak megmunkálatlanul.
                        </div>

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
                        <span>Ásógépezett szelvény</span>
                    </div>

                    <div className={styles.soilProfileVisual} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>

                        <div style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.4',
                            color: 'rgba(255, 255, 255, 0.9)',
                            background: 'rgba(107, 139, 94, 0.08)',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--color-green)',
                            marginBottom: '0'
                        }}>
                            <strong style={{ color: '#C8E6C9', fontWeight: 700 }}>Egyenletes</strong>, 3-4 különböző méretű, dominánsan apró rögből álló szerkezet.
                            A szelvény teljes szélességében átmunkált.
                        </div>

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
