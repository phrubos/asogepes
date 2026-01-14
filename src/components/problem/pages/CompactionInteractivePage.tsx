'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { ArrowLeftRight, Sprout, Droplets, Info, Play, Pause } from 'lucide-react'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import styles from '../ProblemNew.module.css'

const timelineData = [
    { day: 0, label: 'Optimális', color: '#4CAF50' },
    { day: 30, label: '30 nap', color: '#8BC34A' },
    { day: 60, label: '60 nap', color: '#FFC107' },
    { day: 90, label: '90 nap', color: '#FF9800' },
    { day: 120, label: '120 nap után', color: '#D32F2F' },
]

export default function CompactionInteractivePage() {
    const progress = useMotionValue(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [currentProgress, setCurrentProgress] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const controlsRef = useRef<any>(null)

    useEffect(() => {
        const unsubscribe = progress.on("change", (latest) => {
            setCurrentProgress(latest)
        })
        return unsubscribe
    }, [progress])

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


    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value)
        progress.set(val)
        setIsPlaying(false)
    }

    const togglePlay = () => {
        setIsPlaying(prev => !prev)
    }

    const currentPressure = Math.round(8 + (currentProgress * 3))
    const nearestIndex = Math.round(currentProgress)
    const currentData = timelineData[Math.min(nearestIndex, 4)]
    const isCompacted = currentProgress >= 3.5

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
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
            {/* 
               Grid Layout: Using the standard layout which likely gives 1fr 1fr or 60/40.
               Matched padding to Reference: 60px bottom to clear nav.
            */}
            <div className={styles.statsPageGrid} style={{ paddingBottom: '60px', alignItems: 'center' }}>

                {/* LEFT: HERO VISUALIZATION */}
                <motion.div
                    className={styles.statCard}
                    variants={itemVariants}
                    style={{
                        padding: 0,
                        // FULL WIDTH of the column (Hero Proportions)
                        // Aspect Ratio locked to Native 600x500 (6:5)
                        // No max-width constraint -> It scales with screen size, just like the reference.
                        width: '100%',
                        aspectRatio: '6/5',
                        display: 'flex',
                        position: 'relative',
                        margin: '0 auto',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)' // Premium Shadow
                    }}
                >
                    <InteractiveSoil
                        progress={progress}
                    />

                    <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: '25px',
                            left: '25px',
                            zIndex: 20,
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white', border: 'none', borderRadius: '50%',
                            width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                    </motion.button>
                </motion.div>

                {/* RIGHT: INFO & CONTROLS */}
                {/* 
                   Centered vertically against the chart.
                   Gap increased to 2rem for "Airy" feel of the reference.
                */}
                <div className={styles.challengesList} style={{ gap: '2rem', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>

                    {/* Header Info */}
                    <motion.div variants={itemVariants}>
                        <h2 style={{
                            fontSize: '2.5rem', // Hero Title Size (Reference Style)
                            textAlign: 'left',
                            margin: '0 0 12px 0',
                            fontFamily: 'var(--font-display)', // Use Serif/Display if mapped
                            color: 'var(--color-white)',
                            lineHeight: 1.1
                        }}>
                            Talajszerkezet <span style={{ color: currentData.color }}>Változása</span>
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0, maxWidth: '90%' }}>
                            A talajtömörödés közvetlen hatással van a gyökérfejlődésre és vízgazdálkodásra.
                        </p>
                    </motion.div>

                    {/* Timeline Slider Control */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '24px',
                            padding: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {timelineData.map((d, i) => (
                                <motion.span
                                    key={i}
                                    style={{
                                        color: Math.abs(currentProgress - i) < 0.5 ? d.color : 'rgba(255, 255, 255, 0.4)',
                                        cursor: 'pointer',
                                        transition: 'color 0.3s'
                                    }}
                                    onClick={() => {
                                        setIsPlaying(false)
                                        animate(progress, i, { duration: 0.5 })
                                    }}
                                >
                                    {d.label}
                                </motion.span>
                            ))}
                        </div>

                        {/* Slider Container - 32px height to match input interaction height */}
                        <div style={{ position: 'relative', marginBottom: '16px', height: '32px', display: 'flex', alignItems: 'center' }}>
                            {/* Visual Gradient Track - Centered Absolutely */}
                            <div style={{
                                position: 'absolute',
                                top: '50%', transform: 'translateY(-50%)',
                                left: 0, right: 0, height: 6, borderRadius: 3,
                                background: 'linear-gradient(90deg, #4CAF50 0%, #FFC107 50%, #D32F2F 100%)',
                                opacity: 0.8,
                                zIndex: 1,
                                width: '100%'
                            }} />

                            <input
                                type="range" min="0" max="4" step="0.01"
                                value={currentProgress}
                                onChange={handleSliderChange}
                                onMouseDown={() => setIsPlaying(false)}
                                style={{
                                    width: '100%',
                                    cursor: 'grabbing',
                                    accentColor: currentData.color,
                                    display: 'block',
                                    height: '32px',
                                    marginTop: 0,
                                    borderRadius: '3px',
                                    position: 'relative',
                                    zIndex: 5,
                                    background: 'transparent',
                                    WebkitAppearance: 'none'
                                }}
                                className={styles.customRange}
                            />
                        </div>

                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: `${currentData.color}20`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: currentData.color, border: `1px solid ${currentData.color}40`,
                                transition: 'background 0.3s, color 0.3s, border-color 0.3s'
                            }}>
                                <Info size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Talajellenállás</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: currentData.color, transition: 'color 0.3s', fontFamily: 'var(--font-display)' }}>
                                    {currentPressure} bar
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Impact Stats Cards - Styled to match "Szántás" Reference Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <motion.div variants={itemVariants} className={styles.challengeItem} style={{ flexDirection: 'column', gap: '12px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                            <div className={styles.iconBox} style={{ width: '40px', height: '40px', color: currentData.color, borderColor: `${currentData.color}40`, background: `${currentData.color}10`, transition: 'all 0.5s', marginBottom: '4px' }}>
                                <Sprout size={20} />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: 700, margin: '0 0 6px 0', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Gyökérzóna</h4>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={isCompacted ? 'bad' : 'good'}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}
                                    >
                                        {isCompacted ? 'Sekély, korlátozott' : 'Mély, kiterjedt'}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className={styles.challengeItem} style={{ flexDirection: 'column', gap: '12px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                            <div className={styles.iconBox} style={{ width: '40px', height: '40px', color: currentData.color, borderColor: `${currentData.color}40`, background: `${currentData.color}10`, transition: 'all 0.5s', marginBottom: '4px' }}>
                                <Droplets size={20} />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: 700, margin: '0 0 6px 0', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Vízgazdálkodás</h4>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={isCompacted ? 'bad' : 'good'}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}
                                    >
                                        {isCompacted ? 'Gyenge elfolyás' : 'Kiegyensúlyozott'}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 6px; background: transparent; border: none; border-radius: 3px; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: ${currentData.color}; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); margin-top: -5px; cursor: grabbing; transition: background 0.2s; position: relative; z-index: 10; }
                input[type=range]::-moz-range-thumb { height: 16px; width: 16px; border-radius: 50%; background: ${currentData.color}; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); cursor: grabbing; transition: background 0.2s; border: none; }
                input[type=range]::-moz-range-track { width: 100%; height: 6px; background: transparent; border: none; border-radius: 3px; }
            `}</style>
        </motion.div>
    )
}
