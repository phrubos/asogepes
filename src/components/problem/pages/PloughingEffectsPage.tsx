'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Activity, Leaf, Thermometer, AlertTriangle, Worm, CloudFog, Quote } from 'lucide-react'
import { ploughingProblems } from '@/lib/data'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from './PloughingEffectsPage.module.css'

export default function PloughingEffectsPage() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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
                        <motion.div
                            key={index}
                            className={styles.cardContainer}
                            variants={itemVariants}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={styles.interactiveCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIconBox}>
                                        {iconMap[problem.icon] || <AlertTriangle size={20} />}
                                    </div>
                                    <h3 className={styles.cardTitle}>{problem.title}</h3>
                                </div>

                                <motion.div
                                    className={styles.cardContent}
                                    initial={false}
                                    animate={{
                                        height: hoveredCard === index ? 'auto' : 0,
                                        opacity: hoveredCard === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className={styles.cardBody}>
                                        <p className={styles.cardDesc}>{problem.description}</p>
                                        <span className={styles.cardBadge}>{problem.dataBadge}</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}
