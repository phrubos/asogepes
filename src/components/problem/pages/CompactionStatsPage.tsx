
import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { Droplet, Weight, Layers, Plus, Minus, Play, Pause, Info, Sprout, Droplets } from 'lucide-react'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

import InteractiveSoil from '@/components/problem/InteractiveSoil'
import { problemStatistics } from '@/lib/data'
import { useResponsiveParticleCount, useReducedMotion } from '@/hooks/useMediaQuery'
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
    const prefersReducedMotion = useReducedMotion()

    // Performance-optimized particle counts
    const dropCount = useResponsiveParticleCount(25) // 25 desktop → 8 mobile
    const infiltrationCount = useResponsiveParticleCount(15) // 15 desktop → 5 mobile
    const particleCount = useResponsiveParticleCount(20) // 20 desktop → 6 mobile
    const seepingCount = useResponsiveParticleCount(8) // 8 desktop → 3 mobile

    // Raindrops falling to the surface - RESPONSIVE COUNT
    const drops = useMemo(() => Array.from({ length: dropCount }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}% `,
        delay: Math.random() * 2,
        duration: prefersReducedMotion ? 0.2 : 0.4 + Math.random() * 0.4,
    })), [dropCount, prefersReducedMotion])

    // Plants positioned along the surface
    const plants = useMemo(() => [
        { id: 1, left: '10%', variant: 1, scale: 1.4 },
        { id: 2, left: '30%', variant: 3, scale: 1.5 },
        { id: 3, left: '50%', variant: 2, scale: 1.7 },
        { id: 4, left: '70%', variant: 1, scale: 1.5 },
        { id: 5, left: '90%', variant: 3, scale: 1.4 },
    ], [])

    // Subsurface infiltration paths - RESPONSIVE COUNT
    const infiltrationPaths = useMemo(() => Array.from({ length: infiltrationCount }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}% `,
        delay: Math.random() * 4,
        duration: prefersReducedMotion ? 2 : 3 + Math.random() * 3,
    })), [infiltrationCount, prefersReducedMotion])

    const subsurfaceParticles = useMemo(() => Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: surfaceY + 5 + Math.random() * 50,
        width: 2 + Math.random() * 3,
        height: 2 + Math.random() * 3,
        duration: prefersReducedMotion ? 2 : 3 + Math.random() * 4,
        isGold: i % 2 === 0
    })), [surfaceY, particleCount, prefersReducedMotion])

    const seepingDroplets = useMemo(() => Array.from({ length: seepingCount }).map((_, i) => ({
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
                top: `${surfaceY}% `,
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
                    key={`infil - ${path.id} `}
                    style={{
                        position: 'absolute',
                        left: path.left,
                        top: `${surfaceY}% `,
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
                    key={`plant - ${plant.id} `}
                    variant={plant.variant}
                    style={{
                        position: 'absolute',
                        top: `${surfaceY}% `, // Anchor to the surface line exactly
                        left: plant.left,
                        opacity: 1,
                        // Y: -96% means the bottom 4% of the SVG (roots/base) is buried in the soil line
                        transform: `translate(-50 %, -96 %) scale(${plant.scale})`,
                        transformOrigin: 'bottom center',
                        zIndex: 10
                    }}
                />
            ))}

            {/* Falling Rain (Above Surface) */}
            {drops.map((drop) => (
                <motion.div
                    key={`rain - ${drop.id} `}
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
                        top: ['-10%', `${surfaceY}% `],
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
                    key={`splash - ${drop.id} `}
                    style={{
                        position: 'absolute',
                        left: drop.left,
                        top: `${surfaceY}% `,
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
                top: `${surfaceY}% `,
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
                    key={`soil - p - ${p.id} `}
                    style={{
                        position: 'absolute',
                        left: `${p.left}% `,
                        top: `${p.top}% `,
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
                    key={`seep - d - ${d.id} `}
                    style={{
                        position: 'absolute',
                        left: `${d.left}% `,
                        top: `${surfaceY}% `,
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

interface CollapsibleChallengeCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    isAnyOpen: boolean;
}

function CollapsibleChallengeCard({
    icon,
    title,
    children,
    isOpen,
    onHoverStart,
    onHoverEnd,
    isAnyOpen
}: CollapsibleChallengeCardProps) {
    // If ANY card is open, but NOT this one -> Blue/Fade it
    const isInactive = isAnyOpen && !isOpen;

    return (
        <div
            className={styles.challengeItem}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%', // FORCE HEIGHT to fill the parent wrapper
                flex: 1,
                zIndex: isOpen ? 50 : 1,
                overflow: 'visible',
                background: 'transparent', // Override CSS class background
                border: 'none', // Override CSS class border
                boxShadow: 'none', // Override CSS class shadow
                padding: 0 // Override CSS class padding
            }}
        >
            <motion.div
                onMouseEnter={onHoverStart}
                onMouseLeave={onHoverEnd}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: isOpen ? 'auto' : '100%',
                    minHeight: '100%',

                    // Active Enhancement
                    zIndex: isOpen ? 50 : (isInactive ? 1 : 10),

                    // Blur / Fade Inactive
                    filter: isInactive ? 'blur(4px) grayscale(60%)' : 'none',
                    opacity: isInactive ? 0.4 : 1,

                    // Visuals
                    borderRadius: '16px',
                    border: isOpen ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isOpen ? '#1c1917' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    boxShadow: isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : undefined,
                    backdropFilter: 'blur(10px)',

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            >
                <div
                    className={styles.iconBox}
                    style={{
                        background: isOpen ? 'var(--color-gold)' : 'rgba(212, 168, 75, 0.1)',
                        color: isOpen ? 'var(--color-earth-900)' : 'var(--color-gold)',
                        transform: isOpen ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        zIndex: 25,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px'
                    }}
                >
                    {icon}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 'calc(36px + 1.5rem)' }}>
                    {/* Header Row */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 20,
                            minHeight: '36px', // Align with icon height + margins roughly
                            width: '100%',
                            flexShrink: 0,
                            paddingTop: '0.75rem',
                            paddingRight: '0.75rem'
                        }}
                    >
                        <h3 style={{
                            fontSize: '0.95rem',
                            margin: '0',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            color: isOpen ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            transition: 'color 0.3s ease',
                            lineHeight: '36px' // Vertically center with icon
                        }}>
                            {title}
                        </h3>
                    </div>

                    {/* Content - Collapsible */}
                    <AnimatePresence mode="wait">
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    marginTop: '12px',
                                    paddingTop: '12px'
                                }}
                            >
                                <div style={{
                                    padding: '0 1rem 1rem 0',
                                }}>
                                    {children}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

const timelineData = [
    { day: 0, label: 'Optimális', color: '#4CAF50' },
    { day: 30, label: '30 nap', color: '#8BC34A' },
    { day: 60, label: '60 nap', color: '#FFC107' },
    { day: 90, label: '90 nap', color: '#FF9800' },
    { day: 120, label: '120 nap után', color: '#D32F2F' },
]

function CompactionStatsDisplay({ progress, expandedCardId }: { progress: any, expandedCardId: number | null }) {
    const [currentProgress, setCurrentProgress] = useState(0)

    useEffect(() => {
        const unsubscribe = progress.on("change", (latest: number) => {
            setCurrentProgress(latest)
        })
        return unsubscribe
    }, [progress])

    const nearestIndex = Math.round(currentProgress)
    const currentData = timelineData[Math.min(nearestIndex, 4)]

    // Animation variants for internal items
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <>
            {/* Visual Separator + Badge */}
            <div style={{
                marginTop: '1.5rem',
                marginBottom: '1rem',
                position: 'relative',
                transition: 'all 0.4s',
                filter: expandedCardId ? 'blur(4px) grayscale(60%)' : 'none',
                opacity: expandedCardId ? 0.4 : 1,
            }}>
                {/* Decorative Line with Gradient */}
                <div style={{
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${currentData.color}40, transparent)`,
                    position: 'relative',
                    marginBottom: '0.75rem'
                }}>
                    {/* Glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: '-2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '5px',
                        background: `radial-gradient(ellipse, ${currentData.color}30, transparent)`,
                        filter: 'blur(4px)',
                        transition: 'all 0.3s'
                    }} />
                </div>

                {/* Badge */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '0.75rem'
                }}>
                    <span style={{
                        fontSize: '0.7rem',
                        color: currentData.color,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        padding: '4px 12px',
                        background: `${currentData.color}15`,
                        border: `1px solid ${currentData.color}40`,
                        borderRadius: '20px',
                        display: 'inline-block',
                        transition: 'all 0.3s'
                    }}>
                        Szimulált állapot
                    </span>
                </div>
            </div>

            {/* Additional Info Cards (Soil Resistance, Roots, Water) - Below Challenges */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
                // Apply blur to this entire block if ANY challenge card is open
                transition: 'all 0.4s',
                filter: expandedCardId ? 'blur(4px) grayscale(60%)' : 'none',
                opacity: expandedCardId ? 0.4 : 1,
                pointerEvents: expandedCardId ? 'none' : 'auto'
            }}>

                {/* Soil Resistance Card */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}
                >
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: `${currentData.color}1a`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: currentData.color,
                        border: `1px solid ${currentData.color}33`,
                        transition: 'all 0.3s'
                    }}>
                        <Info size={18} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>TALAJELLENÁLLÁS</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: currentData.color, transition: 'color 0.3s', fontFamily: 'var(--font-display)' }}>
                            {Math.round(currentProgress * 5)} bar
                        </div>
                    </div>
                </motion.div>

                {/* Root Zone Card */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}
                >
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: `${currentData.color}1a`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: currentData.color,
                        transition: 'all 0.3s'
                    }}>
                        <Sprout size={18} />
                    </div>
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, margin: '0 0 4px 0', fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>Gyökérzóna</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                            {currentProgress > 2 ? 'Sekély, korlátozott' : 'Mély, kiterjedt'}
                        </p>
                    </div>
                </motion.div>

                {/* Water Management Card */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}
                >
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: `${currentData.color}1a`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: currentData.color,
                        transition: 'all 0.3s'
                    }}>
                        <Droplets size={18} />
                    </div>
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, margin: '0 0 4px 0', fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>Vízgazdálkodás</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                            {currentProgress > 2 ? 'Gyenge vízáteresztés' : 'Kiegyensúlyozott'}
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default function CompactionStatsPage() {
    const [expandedCardId, setExpandedCardId] = useState<number | null>(null) // Track single open card

    // Interactive Soil Logic
    const progress = useMotionValue(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const controlsRef = useRef<any>(null)

    useEffect(() => {
        if (!isPlaying) {
            if (controlsRef.current) controlsRef.current.stop();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const totalDuration = 20;

        const startLoop = () => {
            const current = progress.get();
            const remainingFac = (4 - current) / 4;
            const duration = remainingFac > 0.001 ? remainingFac * totalDuration : 0;

            if (duration <= 0.1 && current >= 3.99) {
                timeoutRef.current = setTimeout(() => {
                    progress.set(0);
                    startLoop();
                }, 5000);
            } else {
                controlsRef.current = animate(progress, 4, {
                    duration: duration,
                    ease: "linear",
                    onComplete: () => {
                        timeoutRef.current = setTimeout(() => {
                            progress.set(0);
                            startLoop();
                        }, 5000);
                    }
                });
            }
        };

        startLoop();

        return () => {
            if (controlsRef.current) controlsRef.current.stop();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(prev => !prev)
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

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.compactionPageWrapper}
        >
            <div className={styles.statsPageGrid}>
                {/* Main Stat Card - Now Interactive */}
                <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.3 }}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start', // Anchored to top to prevent jumping
                        justifyContent: 'center',
                        height: '100%'
                    }}
                >
                    {/* Container to fill the column while keeping aspect ratio */}
                    <div style={{
                        width: '100%',
                        position: 'relative',
                        aspectRatio: '3/2', // Balanced ratio: Shows down to ~35cm without being too tall
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}>
                        <InteractiveSoil
                            progress={progress}
                            onProgressChange={(val) => {
                                progress.set(val)
                                setIsPlaying(false) // Stop auto-loop on manual interaction
                            }}
                            onInteractionStart={() => setIsPlaying(false)}
                        />

                        <motion.button
                            onClick={togglePlay}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                left: '15px',
                                zIndex: 20,
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white', border: 'none', borderRadius: '50%',
                                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                        >
                            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                        </motion.button>
                    </div>
                </motion.div >

                {/* Right Column Wrapper - Flex Column for Challenges + Info */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, justifyContent: 'space-between' }}>
                    <div className={styles.challengesList} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ textAlign: 'left', marginBottom: 'var(--space-xs)' }}>
                            <span className={styles.pillBadge}>Talajállapot és kockázatok</span>
                        </div>

                        {/* Challenge 1 */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                flex: 1,
                                position: 'relative',
                                zIndex: expandedCardId === 1 ? 50 : 1,
                                minHeight: '64px' // Compact height
                            }}
                        >
                            <CollapsibleChallengeCard
                                icon={<Droplet size={24} />}
                                title="Gyakori öntözés hatása"
                                isOpen={expandedCardId === 1}
                                onHoverStart={() => setExpandedCardId(1)}
                                onHoverEnd={() => setExpandedCardId(null)}
                                isAnyOpen={expandedCardId !== null}
                            >
                                <div className={styles.itemContent}>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 4 }}>Intenzív öntözéses kertészeti kultúrákban 4-7 naponként 20-40 mm víz kijuttatása történik, ami fokozatosan tömöríti a talajt.</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold)', marginTop: '0.75rem' }}>350-450 mm/szezon</p>
                                </div>
                            </CollapsibleChallengeCard>
                        </motion.div>

                        {/* Challenge 2 */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                flex: 1,
                                position: 'relative',
                                zIndex: expandedCardId === 2 ? 50 : 1,
                                minHeight: '64px'
                            }}
                        >
                            <CollapsibleChallengeCard
                                icon={<Layers size={24} />}
                                title="Szerkezetromlás üteme"
                                isOpen={expandedCardId === 2}
                                onHoverStart={() => setExpandedCardId(2)}
                                onHoverEnd={() => setExpandedCardId(null)}
                                isAnyOpen={expandedCardId !== null}
                            >
                                <div className={styles.itemContent}>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 4 }}>Tárcsázott vagy kombinátorozott talajon már 30 nap alatt 20-50%-os szerkezetromlás mérhető intenzív öntözés mellett.</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold)', marginTop: '0.75rem' }}>30 nap után kritikus</p>
                                </div>
                            </CollapsibleChallengeCard>
                        </motion.div>

                        {/* Challenge 3 */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                flex: 1,
                                position: 'relative',
                                zIndex: expandedCardId === 3 ? 50 : 1,
                                minHeight: '64px'
                            }}
                        >
                            <CollapsibleChallengeCard
                                icon={<span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace' }}>O₂</span>}
                                title="Oxigénhiány"
                                isOpen={expandedCardId === 3}
                                onHoverStart={() => setExpandedCardId(3)}
                                onHoverEnd={() => setExpandedCardId(null)}
                                isAnyOpen={expandedCardId !== null}
                            >
                                <div className={styles.itemContent}>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 4 }}>A tömörödés kiszorítja a pórusokból a levegőt, ami gyökérfulladáshoz, gyökértömeg veszteséghez vezet és romlik a talajélet.</p>
                                </div>
                            </CollapsibleChallengeCard>
                        </motion.div>
                    </div>

                    <CompactionStatsDisplay progress={progress} expandedCardId={expandedCardId} />
                </div>
            </div>
        </motion.div >
    )
}

