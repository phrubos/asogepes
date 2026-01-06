'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers, Activity, Leaf, Thermometer, AlertTriangle } from 'lucide-react'
import { ploughingProblems } from '@/lib/data'
import styles from '../ProblemNew.module.css'

export default function PloughingEffectsPage() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const [isFlipped, setIsFlipped] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    // Auto-flip effect
    useEffect(() => {
        if (isPaused) return

        const timer = setInterval(() => {
            setIsFlipped(prev => !prev)
        }, 3000)

        return () => clearInterval(timer)
    }, [isPaused])

    const iconMap: Record<string, JSX.Element> = {
        layers: <Layers size={18} />,
        activity: <Activity size={18} />,
        leaf: <Leaf size={18} />,
        thermometer: <Thermometer size={18} />,
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    }

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.5, rotate: -10 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 20,
                delay: 0.1
            }
        }
    }

    const quoteVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.6
            }
        }
    }

    // Card positions: top-left, top-right, bottom-left, bottom-right
    const cardPositions = [
        { className: styles.orbitalCardTopLeft },
        { className: styles.orbitalCardTopRight },
        { className: styles.orbitalCardBottomLeft },
        { className: styles.orbitalCardBottomRight },
    ]

    // Severity levels for progress bars
    const severityLevels = [90, 75, 65, 55]

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.orbitalContainer}
        >
            {/* Header Badge */}
            <motion.div
                className={styles.orbitalHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <span className={styles.pillBadge}>Szántás hatásai</span>
            </motion.div>

            {/* Main Orbital Layout */}
            <div className={styles.orbitalLayout}>
                {/* Central Flip Card */}
                <motion.div
                    className={styles.orbitalCenter}
                    variants={imageVariants}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className={styles.flipCardInner}>
                        <motion.div
                            className={styles.flipCardWrapper}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.22, 1, 0.36, 1],
                                type: 'spring',
                                stiffness: 60,
                                damping: 15
                            }}
                        >
                            {/* FRONT SIDE (Image) */}
                            <div className={styles.flipCardFront}>
                                <div className={styles.orbitalImageWrapper}>
                                    <img
                                        src="/images/eke.jpg"
                                        alt="American mouldboard eke"
                                        className={styles.orbitalImage}
                                    />
                                    <div className={styles.orbitalImageOverlay}>
                                        <span className={styles.orbitalImageLabel}>American mouldboard</span>
                                    </div>
                                </div>
                            </div>

                            {/* BACK SIDE (Text) */}
                            <div className={styles.flipCardBack}>
                                <div className={styles.flipCardBackContent}>
                                    <Thermometer className={styles.flipBackIcon} size={32} />
                                    <p className={styles.flipBackText}>
                                        A rögösebb és nehezebben elmunkálható talajfelszín megnehezíti a precíz magvetést és palántaültetést, ezen felül tavasszal lassabban és egyenetlenül melegszik fel az ilyen talajfelszín, lassítva a tavasszal vetett vagy ültetett kultúrnövények csírázását, kezdeti vegetatív fejlődését.
                                    </p>
                                    <div className={styles.flipBackDecoration} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Glowing ring effect */}
                    <div className={styles.orbitalGlow} />
                </motion.div>

                {/* Orbital Cards */}
                {ploughingProblems.map((problem, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        className={`${styles.orbitalCard} ${cardPositions[index].className}`}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        whileHover={{
                            scale: 1.05,
                            zIndex: 10,
                            transition: { type: 'spring', stiffness: 300 }
                        }}
                    >
                        {/* Connection line to center */}
                        <div className={styles.orbitalConnector} />

                        <div className={styles.orbitalCardInner}>
                            <div className={styles.orbitalCardHeader}>
                                <motion.div
                                    className={styles.orbitalCardIcon}
                                    animate={hoveredCard === index ? {
                                        scale: 1.15,
                                        rotate: -8
                                    } : {
                                        scale: 1,
                                        rotate: 0
                                    }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                >
                                    {iconMap[problem.icon] || <AlertTriangle size={16} />}
                                </motion.div>
                                <span className={styles.orbitalCardBadge}>
                                    {problem.dataBadge}
                                </span>
                            </div>

                            <h3 className={styles.orbitalCardTitle}>
                                {problem.title}
                            </h3>

                            <p className={styles.orbitalCardDesc}>
                                {problem.description}
                            </p>

                            <div className={styles.orbitalProgressContainer}>
                                <motion.div
                                    className={styles.orbitalProgressBar}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${severityLevels[index]}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quote Section at Bottom */}
            <motion.div
                className={styles.orbitalQuote}
                variants={quoteVariants}
            >
                <div className={styles.orbitalQuoteLine} />
                <div className={styles.orbitalQuoteContent}>
                    <svg
                        className={styles.orbitalQuoteIcon}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M10 8C10 10.21 8.21 12 6 12C5.27 12 4.59 11.8 4 11.46V16C4 17.1 4.9 18 6 18H10V8ZM20 8C20 10.21 18.21 12 16 12C15.27 12 14.59 11.8 14 11.46V16C14 17.1 14.9 18 16 18H20V8Z"
                            fill="currentColor"
                        />
                    </svg>
                    <blockquote className={styles.orbitalQuoteText}>
                        A hagyományos szántás rövid távon megoldásnak tűnik, de valójában egy{' '}
                        <strong className={styles.quoteHighlight}>ördögi kört</strong>
                        {' '}tart fenn.
                    </blockquote>
                </div>
                <div className={styles.orbitalQuoteLine} />
            </motion.div>
        </motion.div>
    )
}
