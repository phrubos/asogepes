'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Leaf, Thermometer, AlertTriangle, ArrowDownToLine, Shuffle, TrendingUp, Quote } from 'lucide-react'
import Image from 'next/image'
import { ploughingProblems } from '@/lib/data'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from './PloughingEffectsPage.module.css'

interface CollapsiblePloughingCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    isOpen: boolean;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    isAnyOpen: boolean;
}

function CollapsiblePloughingCard({
    icon,
    title,
    description,
    badge,
    isOpen,
    onHoverStart,
    onHoverEnd,
    isAnyOpen
}: CollapsiblePloughingCardProps) {
    // If ANY card is open, but NOT this one -> Blue/Fade it
    const isInactive = isAnyOpen && !isOpen;

    return (
        <div
            className={styles.cardContainer}
            style={{
                // Static layout props - maintains the "slot" in the list
                position: 'relative',
                flex: 1,
                width: '100%',
                zIndex: isOpen ? 50 : 1, // Ensure active slot is on top
                overflow: 'visible' // Allow overlay
            }}
        >
            <motion.div
                onMouseEnter={onHoverStart}
                onMouseLeave={onHoverEnd}
                style={{
                    // Absolute positioning to allow "overlay" expansion without pushing siblings
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: isOpen ? 'auto' : '100%',
                    minHeight: '100%',

                    // Visual Styling
                    background: isOpen ? '#1c1917' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    border: isOpen ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    boxShadow: isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden', // Contain content inside the rounded corners
                    display: 'flex',
                    flexDirection: 'column',

                    // States
                    transform: isOpen ? 'scale(1.02)' : (isInactive ? 'scale(0.98)' : 'scale(1)'),
                    filter: isInactive ? 'blur(4px) grayscale(60%)' : 'none',
                    opacity: isInactive ? 0.4 : 1,
                    cursor: 'pointer',
                    zIndex: isOpen ? 50 : 2
                }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            >
                <div className={styles.cardHeader} style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div className={styles.cardIconBox} style={{
                            background: isOpen ? 'var(--color-gold)' : 'rgba(212, 168, 75, 0.1)',
                            color: isOpen ? 'var(--color-earth-900)' : 'var(--color-gold)',
                            transform: isOpen ? 'scale(1.1)' : 'scale(1)'
                        }}>
                            {icon}
                        </div>
                        <h3 className={styles.cardTitle} style={{ color: isOpen ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
                            {title}
                        </h3>
                    </div>
                </div>

                {/* Content - Collapsible (Relative Flow) */}
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                padding: '0 1rem 1rem 1rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                paddingTop: '12px',
                                // flexGrow: 1, // Not needed in auto height
                                overflowY: 'auto' // Scroll if genuinely too small
                            }}
                        >
                            <p className={styles.cardDesc}>{description}</p>
                            <span className={styles.cardBadge}>{badge}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default function PloughingEffectsPage() {
    const [expandedCardId, setExpandedCardId] = useState<number | null>(null)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const iconMap: Record<string, JSX.Element> = {
        'arrow-down-to-line': <ArrowDownToLine size={20} />,
        activity: <Activity size={20} />,
        leaf: <Leaf size={20} />,
        thermometer: <Thermometer size={20} />,
        shuffle: <Shuffle size={20} />,
        'trending-up': <TrendingUp size={20} />,
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    }

    return (
        <motion.div
            className={styles.container}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Header moved to right column */}

            <div className={styles.grid}>
                {/* Left Column: Image */}
                <motion.div className={styles.imageColumn} variants={itemVariants}>
                    <div
                        className={styles.imageWrapper}
                        onClick={() => setIsLightboxOpen(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Image
                            src="/images/premium_plough_head.png"
                            alt="American mouldboard eke"
                            fill
                            className={styles.mainImage}
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            priority
                        />

                    </div>
                    <ImageLightbox
                        isOpen={isLightboxOpen}
                        onClose={() => setIsLightboxOpen(false)}
                        src="/images/premium_plough_head.png"
                        alt="American mouldboard eke"
                    />
                </motion.div>

                {/* Center Column: Quote */}
                <motion.div className={styles.quoteColumn} variants={itemVariants}>
                    <div className={styles.quoteWrapper}>
                        <Quote size={40} className={styles.quoteIcon} />
                        <blockquote className={styles.quoteText}>
                            A hagyományos szántás rövid távon megoldásnak tűnik, de valójában egy{' '}
                            <span className={styles.quoteHighlight}>ördögi kört</span>
                            {' '}tart fenn. A rendszeres forgatás ma már közismerten inkább károsnak tekintett. Fent optimálisan forgat, viszont a művelt réteg alatt túl erősen tömörít.
                        </blockquote>
                        <div className={styles.quoteDecoration} />
                    </div>
                </motion.div>

                {/* Right Column: Title + Interactive Cards */}
                <motion.div className={styles.cardsColumn} variants={containerVariants}>
                    <motion.div className={styles.header} variants={itemVariants} style={{ textAlign: 'left', marginBottom: '1rem' }}>
                        <span className={styles.pillBadge}>Szántás hatásai</span>
                    </motion.div>

                    {ploughingProblems.map((problem, index) => (
                        <CollapsiblePloughingCard
                            key={index}
                            icon={iconMap[problem.icon] || <AlertTriangle size={20} />}
                            title={problem.title}
                            description={problem.description}
                            badge={problem.dataBadge}
                            isOpen={expandedCardId === index}
                            onHoverStart={() => setExpandedCardId(index)}
                            onHoverEnd={() => setExpandedCardId(null)}
                            isAnyOpen={expandedCardId !== null}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}
