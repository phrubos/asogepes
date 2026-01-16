'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Activity, Leaf, Thermometer, AlertTriangle, Worm, CloudFog, Quote, Plus, Minus } from 'lucide-react'
import { ploughingProblems } from '@/lib/data'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from './PloughingEffectsPage.module.css'

interface CollapsiblePloughingCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    isOpen: boolean;
    onToggle: () => void;
    isAnyOpen: boolean;
}

function CollapsiblePloughingCard({
    icon,
    title,
    description,
    badge,
    isOpen,
    onToggle,
    isAnyOpen
}: CollapsiblePloughingCardProps) {
    // If ANY card is open, but NOT this one -> Blue/Fade it
    const isInactive = isAnyOpen && !isOpen;

    return (
        <motion.div
            layout
            className={styles.cardContainer}
            onClick={() => !isOpen && onToggle()} // Optional: Allow clicking body to open
            style={{
                // Flex logic: Open takes more space, Closed takes less
                flexGrow: isOpen ? 3 : 1,
                // flexShrink: 1, // Default
                // flexBasis: 'auto',

                // Visuals
                zIndex: isOpen ? 50 : (isInactive ? 1 : 10),
                transform: isOpen ? 'scale(1.02)' : (isInactive ? 'scale(0.98)' : 'scale(1)'),
                // Blur / Fade Inactive
                filter: isInactive ? 'blur(4px) grayscale(60%)' : 'none',
                opacity: isInactive ? 0.4 : 1,

                cursor: isOpen ? 'default' : 'pointer'
            }}
            transition={{ layout: { duration: 0.4, type: "spring", stiffness: 100, damping: 15 } }}
        >
            <motion.div
                layout="position"
                style={{
                    height: '100%',
                    background: isOpen ? '#1c1917' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    border: isOpen ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    boxShadow: isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden', // Contain content
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div className={styles.cardHeader} style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div className={styles.cardIconBox} style={{
                            background: isOpen ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.05)',
                            color: isOpen ? 'var(--color-earth-900)' : 'rgba(255, 255, 255, 0.6)',
                            transform: isOpen ? 'scale(1.1)' : 'scale(1)'
                        }}>
                            {icon}
                        </div>
                        <h3 className={styles.cardTitle} style={{ color: isOpen ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
                            {title}
                        </h3>
                    </div>

                    {/* Animated Button */}
                    <div style={{ position: 'relative', flexShrink: 0, marginLeft: '12px' }}>
                        {/* Pulse Effect - Subtle Ring */}
                        {!isOpen && (
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    top: -4, left: -4, right: -4, bottom: -4,
                                    borderRadius: '50%',
                                    border: '1px solid var(--color-gold)',
                                    pointerEvents: 'none'
                                }}
                            />
                        )}

                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle();
                            }}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 168, 75, 0.15)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 36, height: 36,
                                borderRadius: '50%',
                                border: '1px solid rgba(212, 168, 75, 0.5)',
                                background: isOpen ? 'rgba(212, 168, 75, 0.2)' : 'transparent',
                                color: 'var(--color-gold)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 20,
                                backdropFilter: 'blur(4px)',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <motion.div
                                key={isOpen ? 'minus' : 'plus'}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Content - Collapsible (Relative Flow) */}
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            style={{
                                padding: '0 1rem 1rem 1rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                paddingTop: '12px',
                                flexGrow: 1, // Fill remaining space in card
                                overflowY: 'auto' // Scroll if genuinely too small
                            }}
                        >
                            <p className={styles.cardDesc}>{description}</p>
                            <span className={styles.cardBadge}>{badge}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

export default function PloughingEffectsPage() {
    const [expandedCardId, setExpandedCardId] = useState<number | null>(null)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const iconMap: Record<string, JSX.Element> = {
        layers: <Layers size={20} />,
        activity: <Activity size={20} />,
        leaf: <Leaf size={20} />,
        thermometer: <Thermometer size={20} />,
        worm: <Worm size={20} />,
        co2: <CloudFog size={20} />,
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
            <motion.div className={styles.header} variants={itemVariants}>
                <span className={styles.pillBadge}>Szántás hatásai</span>
            </motion.div>

            <div className={styles.grid}>
                {/* Left Column: Image */}
                <motion.div className={styles.imageColumn} variants={itemVariants}>
                    <div
                        className={styles.imageWrapper}
                        onClick={() => setIsLightboxOpen(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src="/images/premium_plough_head.png"
                            alt="American mouldboard eke"
                            className={styles.mainImage}
                            loading="lazy"
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

                {/* Right Column: Interactive Cards */}
                <motion.div className={styles.cardsColumn} variants={containerVariants}>
                    {ploughingProblems.map((problem, index) => (
                        <CollapsiblePloughingCard
                            key={index}
                            icon={iconMap[problem.icon] || <AlertTriangle size={20} />}
                            title={problem.title}
                            description={problem.description}
                            badge={problem.dataBadge}
                            isOpen={expandedCardId === index}
                            onToggle={() => setExpandedCardId(expandedCardId === index ? null : index)}
                            isAnyOpen={expandedCardId !== null}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}
