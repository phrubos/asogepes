'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Droplet, Weight, Layers } from 'lucide-react'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import TiltCard from '@/components/ui/TiltCard'
import { problemStatistics, compactionChallenges } from '@/lib/data'
import styles from '../ProblemNew.module.css'

// Simple SVG Tomato Plant
function TomatoPlant({ style, variant = 1 }: { style: React.CSSProperties, variant?: number }) {
    const stemColor = "rgba(107, 139, 94, 0.9)"
    const tomatoColor = "rgba(220, 80, 80, 0.95)"

    const renderVariant1 = () => (
        <>
            <path d="M50 100 Q50 80 50 60 Q55 40 50 20" stroke={stemColor} strokeWidth="3" fill="none" />
            <path d="M50 80 Q70 75 80 85" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M50 70 Q30 65 20 75" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M50 50 Q75 45 80 55" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M50 40 Q25 35 20 45" stroke={stemColor} strokeWidth="2" fill="none" />
            <circle cx="55" cy="45" r="5" fill={tomatoColor} />
            <circle cx="45" cy="65" r="4.5" fill={tomatoColor} />
            <circle cx="52" cy="25" r="4" fill={tomatoColor} />
        </>
    )

    const renderVariant2 = () => (
        <>
            <path d="M50 100 Q45 80 50 50 Q55 30 45 15" stroke={stemColor} strokeWidth="3" fill="none" />
            <path d="M50 85 Q70 80 75 90" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M48 70 Q25 60 20 70" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M52 55 Q75 45 80 50" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M48 35 Q25 25 20 30" stroke={stemColor} strokeWidth="2" fill="none" />
            <circle cx="48" cy="50" r="5" fill={tomatoColor} />
            <circle cx="55" cy="70" r="5" fill={tomatoColor} />
            <circle cx="45" cy="30" r="4" fill={tomatoColor} />
        </>
    )

    const renderVariant3 = () => (
        <>
            <path d="M50 100 Q60 80 50 60 Q40 40 50 25" stroke={stemColor} strokeWidth="3" fill="none" />
            <path d="M50 90 Q30 85 25 95" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M55 75 Q75 70 80 80" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M45 55 Q25 50 20 60" stroke={stemColor} strokeWidth="2" fill="none" />
            <path d="M52 40 Q75 35 80 45" stroke={stemColor} strokeWidth="2" fill="none" />
            <circle cx="60" cy="55" r="5" fill={tomatoColor} />
            <circle cx="40" cy="75" r="5" fill={tomatoColor} />
            <circle cx="55" cy="35" r="4.5" fill={tomatoColor} />
            <circle cx="45" cy="90" r="3.5" fill={tomatoColor} />
        </>
    )

    return (
        <svg
            viewBox="0 0 100 100"
            style={style}
            width="90"
            height="120"
            preserveAspectRatio="xMidYMax meet" // FORCE CONTENT TO BOTTOM
        >
            {variant === 1 && renderVariant1()}
            {variant === 2 && renderVariant2()}
            {variant === 3 && renderVariant3()}
        </svg>
    )
}

// Sophisticated background animation representing water infiltration
function IrrigationBackground() {
    const surfaceY = 40; // Surface line at 40%

    // Raindrops falling to the surface - REDUCED COUNT FOR STABILITY
    const drops = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 0.4 + Math.random() * 0.4, // Faster
    })), [])

    // Plants positioned along the surface
    const plants = useMemo(() => [
        { id: 1, left: '10%', variant: 1, scale: 1.4 },
        { id: 2, left: '30%', variant: 3, scale: 1.5 },
        { id: 3, left: '50%', variant: 2, scale: 1.7 },
        { id: 4, left: '70%', variant: 1, scale: 1.5 },
        { id: 5, left: '90%', variant: 3, scale: 1.4 },
    ], [])

    // Subsurface infiltration paths - REDUCED COUNT
    const infiltrationPaths = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3, // Slower, more seeping
    })), [])

    const subsurfaceParticles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: surfaceY + 5 + Math.random() * 50,
        width: 2 + Math.random() * 3,
        height: 2 + Math.random() * 3,
        duration: 3 + Math.random() * 4,
        isGold: i % 2 === 0
    })), [surfaceY])

    const seepingDroplets = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 50
    })), [])

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
        }}>
            {/* Visual Horizon/Surface Line (Stronger) */}
            <div style={{
                position: 'absolute',
                top: `${surfaceY}%`,
                left: 0,
                right: 0,
                height: 2, // Thicker
                background: 'linear-gradient(90deg, transparent, rgba(212, 168, 75, 0.8), transparent)', // More opacity
                boxShadow: '0 0 15px rgba(212, 168, 75, 0.6)',
                zIndex: 25 // High z-index to cover smooth transitions
            }} />

            {/* Infiltration (Below Surface) - REFINED AESTHETICS */}
            {infiltrationPaths.map((path) => (
                <motion.div
                    key={`infil-${path.id}`}
                    style={{
                        position: 'absolute',
                        left: path.left,
                        top: `${surfaceY}%`,
                        width: 5, // Slightly thinner
                        height: 80,
                        // Softer blue, less intense opacity
                        background: 'linear-gradient(180deg, rgba(120, 190, 255, 0.5), transparent)',
                        filter: 'blur(5px)', // More diffuse
                        borderRadius: 8,
                        zIndex: 1,
                    }}
                    animate={{
                        y: [0, 250], // Slower descent
                        opacity: [0, 0.6, 0], // Gentle fade in and out
                        scaleY: [0.8, 1.2], // Less stretching artifact
                    }}
                    transition={{
                        duration: path.duration,
                        repeat: Infinity,
                        delay: path.delay,
                        ease: 'easeInOut', // Smoother motion
                    }}
                />
            ))}

            {/* Plants - ANCHORED CORRECTLY */}
            {plants.map((plant) => (
                <TomatoPlant
                    key={`plant-${plant.id}`}
                    variant={plant.variant}
                    style={{
                        position: 'absolute',
                        top: `${surfaceY}%`, // Anchor to the surface line exactly
                        left: plant.left,
                        opacity: 1,
                        // Y: -96% means the bottom 4% of the SVG (roots/base) is buried in the soil line
                        transform: `translate(-50%, -96%) scale(${plant.scale})`,
                        transformOrigin: 'bottom center',
                        zIndex: 10
                    }}
                />
            ))}

            {/* Falling Rain (Above Surface) */}
            {drops.map((drop) => (
                <motion.div
                    key={`rain-${drop.id}`}
                    style={{
                        position: 'absolute',
                        left: drop.left,
                        top: -20,
                        width: 3, // Thicker rain
                        height: 35, // Longer
                        background: 'linear-gradient(180deg, rgba(200, 220, 255, 0), rgba(200, 240, 255, 0.9))', // High Contrast
                        zIndex: 20, // On top
                    }}
                    animate={{
                        // Animate from top of screen to surfaceY
                        top: ['-10%', `${surfaceY}%`],
                        opacity: [0, 1, 0],
                        scaleY: [1, 0.2], // Squish hard on impact
                    }}
                    transition={{
                        duration: drop.duration,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: 'linear',
                    }}
                />
            ))}

            {/* Impact Ripples (At Surface) */}
            {drops.map((drop) => (
                <motion.div
                    key={`splash-${drop.id}`}
                    style={{
                        position: 'absolute',
                        left: drop.left,
                        top: `${surfaceY}%`,
                        width: 6,
                        height: 2,
                        borderRadius: '50%',
                        background: 'rgba(200, 200, 255, 0.3)',
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                        scale: [0, 2],
                        opacity: [0.5, 0],
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        delay: drop.delay + drop.duration * 0.9, // Sync with rain arrival roughly
                        ease: 'easeOut',
                    }}
                />
            ))}



            {/* Soil Texture Overlay (Below Surface) */}
            <div style={{
                position: 'absolute',
                top: `${surfaceY}%`,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(35, 30, 25, 0.4), transparent)',
                backdropFilter: 'blur(2px)',
                maskImage: 'linear-gradient(to bottom, black, transparent)',
                zIndex: 2
            }} />

            {/* Subsurface Seeping "Particles" - REDUCED COUNT */}
            {subsurfaceParticles.map((p) => (
                <motion.div
                    key={`soil-p-${p.id}`}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: p.width,
                        height: p.height,
                        borderRadius: '50%',
                        background: p.isGold ? 'rgba(212, 168, 75, 0.15)' : 'rgba(107, 139, 94, 0.1)',
                        zIndex: 1,
                    }}
                    animate={{
                        y: [0, 10, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            ))}

            {/* Slow Seeping Droplets in Soil */}
            {seepingDroplets.map((d) => (
                <motion.div
                    key={`seep-d-${d.id}`}
                    style={{
                        position: 'absolute',
                        left: `${d.left}%`,
                        top: `${surfaceY}%`,
                        width: 2,
                        height: 4,
                        borderRadius: '1px',
                        background: 'rgba(120, 190, 255, 0.3)',
                        zIndex: 3,
                    }}
                    animate={{
                        y: [0, 200],
                        opacity: [0, 0.8, 0],
                        x: [0, d.drift] // Drift sideways
                    }}
                    transition={{
                        duration: d.duration,
                        repeat: Infinity,
                        delay: d.delay,
                        ease: 'linear'
                    }}
                />
            ))}
        </div>
    )
}

export default function CompactionStatsPage() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const iconMap: Record<string, JSX.Element> = {
        droplet: <Droplet size={24} />,
        weight: <Weight size={24} />,
        layers: <Layers size={24} />,
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    }

    const iconVariants = {
        idle: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.1,
            rotate: -10,
            transition: { type: 'spring', stiffness: 400, damping: 10 }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.contentWrapper}
        >
            <div className={styles.statsPageGrid}>
                <motion.div
                    className={styles.statCard}
                    variants={itemVariants}
                    whileHover={{
                        boxShadow: '0 30px 60px -15px rgba(0,0,0,0.5)',
                        borderColor: 'rgba(212, 168, 75, 0.3)'
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <IrrigationBackground />

                    <motion.div
                        className={styles.gradientBar}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 6,
                            transformOrigin: 'left',
                            borderRadius: '6px 6px 0 0',
                            zIndex: 10,
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        zIndex: 5,
                        padding: 'var(--space-xl) var(--space-2xl) var(--space-2xl) var(--space-2xl)'
                    }}>
                        <div className={styles.mainStat} style={{ marginBottom: 0 }}>
                            <AnimatedNumber
                                value={problemStatistics.irrigation.min}
                                duration={1500}
                                className={styles.statValue}
                            />
                            <span className={styles.statSeparator}>-</span>
                            <AnimatedNumber
                                value={problemStatistics.irrigation.max}
                                duration={1500}
                                delay={200}
                                className={styles.statValue}
                            />
                            <motion.span
                                className={styles.statUnit}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                {problemStatistics.irrigation.unit}
                            </motion.span>
                        </div>
                        <motion.div
                            className={styles.statDescription}
                            style={{
                                position: 'relative',
                                zIndex: 5,
                                marginTop: '0.5rem',
                                maxWidth: '80%'
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: 4, fontSize: '1.2rem', letterSpacing: '0.02em' }}>
                                {problemStatistics.irrigation.label}
                            </strong>
                            Ennyi öntözővizet kell a talajfelszínnek elnyelnie és mélyebbre szivárogtatnia egy öntözési szezonban, bármely átlagos kertészeti kultúrában.
                        </motion.div>
                    </div>
                </motion.div>

                <div className={styles.challengesList}>
                    <div style={{ textAlign: 'left', marginBottom: 'var(--space-xs)' }}>
                        <span className={styles.pillBadge}>Talajállapot és kockázatok</span>
                    </div>

                    {/* Challenge 1 */}
                    <motion.div variants={itemVariants} style={{ flex: 1 }}>
                        <TiltCard
                            tiltAmount={5}
                            glowColor="rgba(212, 168, 75, 0.15)"
                            className={styles.challengeItem}
                        >
                            <div className={styles.iconBox} style={{ background: 'rgba(212, 168, 75, 0.1)', color: 'var(--color-gold)' }}>
                                <Droplet size={24} />
                            </div>
                            <div className={styles.itemContent}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Gyakori öntözés hatása</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Intenzív öntözéses kertészeti kultúrákban 4-7 naponként 20-40 mm víz kijuttatása történik, ami fokozatosan tömöríti a talajt.</p>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold)', marginTop: '0.75rem' }}>350-450 mm/szezon</p>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Challenge 2 */}
                    <motion.div variants={itemVariants} style={{ flex: 1 }}>
                        <TiltCard
                            tiltAmount={5}
                            glowColor="rgba(212, 168, 75, 0.15)"
                            className={styles.challengeItem}
                        >
                            <div className={styles.iconBox} style={{ background: 'rgba(212, 168, 75, 0.1)', color: 'var(--color-gold)' }}>
                                <Layers size={24} />
                            </div>
                            <div className={styles.itemContent}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Szerkezetromlás üteme</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Tárcsázott vagy kombinátorozott talajon már 30 nap alatt 20-50%-os szerkezetromlás mérhető intenzív öntözés mellett.</p>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold)', marginTop: '0.75rem' }}>30 nap után kritikus</p>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Challenge 3 - New */}
                    <motion.div variants={itemVariants} style={{ flex: 1 }}>
                        <TiltCard
                            tiltAmount={5}
                            glowColor="rgba(212, 168, 75, 0.15)"
                            className={styles.challengeItem}
                        >
                            <div className={styles.iconBox} style={{ background: 'rgba(212, 168, 75, 0.1)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace' }}>O₂</span>
                            </div>
                            <div className={styles.itemContent}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Oxigénhiány</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>A tömörödés kiszorítja a pórusokból a levegőt, ami gyökérfulladáshoz, gyökértömeg veszteséghez vezet és romlik a talajélet.</p>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
