'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Sprout, Droplets, Info } from 'lucide-react'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import styles from '../ProblemNew.module.css'

const timelineData = [
    { day: 0, label: 'Optimális', penetrometer: 8, color: '#4CAF50' },
    { day: 30, label: '30 nap', penetrometer: 11, color: '#8BC34A' },
    { day: 60, label: '60 nap', penetrometer: 14, color: '#FFC107' },
    { day: 90, label: '90 nap', penetrometer: 17, color: '#FF9800' },
    { day: 120, label: '120 nap után', penetrometer: 20, color: '#D32F2F' },
]

export default function CompactionInteractivePage() {
    const [dayIndex, setDayIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isUserInteracting, setIsUserInteracting] = useState(false)

    const isCompacted = dayIndex === 4
    const currentData = timelineData[dayIndex]

    // --- AUTOMATIKUS LOOP ---
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (!isHovered && !isUserInteracting) {
            interval = setInterval(() => {
                setDayIndex((prev) => (prev === 0 ? 4 : 0))
            }, 5000)
        }
        return () => clearInterval(interval)
    }, [isHovered, isUserInteracting])

    const handleInteractionStart = () => setIsUserInteracting(true)

    const handleToggle = () => {
        handleInteractionStart()
        setDayIndex(dayIndex === 0 ? 4 : 0)
    }

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInteractionStart()
        setDayIndex(parseInt(e.target.value))
    }

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
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <div className={styles.statsPageGrid} style={{ paddingBottom: '3rem' }}>
                {/* LEFT: VISUALIZATION */}
                <motion.div
                    className={styles.statCard}
                    variants={itemVariants}
                    style={{ padding: 0, overflow: 'hidden', minHeight: '400px' }}
                >
                    <InteractiveSoil
                        dayIndex={dayIndex}
                        isCompacted={isCompacted}
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                    />

                    {/* Floating Toggle Button on the visual */}
                    <motion.button
                        onClick={handleToggle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            zIndex: 20,
                            background: isCompacted ? 'rgba(46, 125, 50, 0.9)' : 'rgba(198, 40, 40, 0.9)',
                            color: 'white', border: 'none', borderRadius: '8px',
                            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        <ArrowLeftRight size={16} />
                        {isCompacted ? 'Javítás' : 'Rontás'}
                    </motion.button>
                </motion.div>

                {/* RIGHT: INFO & CONTROLS */}
                <div className={styles.challengesList} style={{ justifyContent: 'center', gap: 'var(--space-md)' }}>

                    {/* Header Info */}
                    <motion.div variants={itemVariants}>
                        <div style={{ textAlign: 'left', marginBottom: 'var(--space-xs)' }}>
                            <span className={styles.pillBadge}>Talajszerkezet</span>
                        </div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            textAlign: 'left',
                            margin: '0 0 var(--space-xs) 0',
                            fontFamily: 'var(--font-display)',
                            color: 'var(--color-white)'
                        }}>
                            Talajszerkezet <span style={{ color: currentData.color }}>Változása</span>
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                            A talajtömörödés közvetlen hatással van a gyökérfejlődésre és vízgazdálkodásra.
                        </p>
                    </motion.div>

                    {/* Timeline Slider Control */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '16px',
                            padding: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.65rem', fontWeight: 600 }}>
                            {timelineData.map((d, i) => (
                                <motion.span
                                    key={i}
                                    animate={{
                                        color: i === dayIndex ? d.color : 'rgba(255, 255, 255, 0.4)',
                                        scale: i === dayIndex ? 1.1 : 1,
                                        opacity: i === dayIndex ? 1 : 0.6
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => { handleInteractionStart(); setDayIndex(i); }}
                                >
                                    {d.label}
                                </motion.span>
                            ))}
                        </div>
                        <input
                            type="range" min="0" max="4" step="1"
                            value={dayIndex} onChange={handleSliderChange}
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                accentColor: currentData.color,
                                display: 'block',
                                height: '5px',
                                borderRadius: '3px'
                            }}
                        />
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: `${currentData.color}20`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: currentData.color, border: `1px solid ${currentData.color}40`
                            }}>
                                <Info size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Talajellenállás</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: currentData.color }}>{currentData.penetrometer} bar</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Impact Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <motion.div variants={itemVariants} className={styles.challengeItem} style={{ flexDirection: 'column', gap: '8px', padding: '14px' }}>
                            <div className={styles.iconBox} style={{ width: '32px', height: '32px', color: isCompacted ? '#EF5350' : '#81C784', borderColor: isCompacted ? '#EF535040' : '#81C78440', background: isCompacted ? '#EF535010' : '#81C78410' }}>
                                <Sprout size={18} />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: 700, margin: '0 0 2px 0', fontSize: '0.85rem' }}>Gyökérzóna</h4>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={isCompacted ? 'bad' : 'good'}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}
                                    >
                                        {isCompacted ? 'Sekély, korlátozott' : 'Mély, kiterjedt'}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className={styles.challengeItem} style={{ flexDirection: 'column', gap: '8px', padding: '14px' }}>
                            <div className={styles.iconBox} style={{ width: '32px', height: '32px', color: isCompacted ? '#EF5350' : '#81C784', borderColor: isCompacted ? '#EF535040' : '#81C78440', background: isCompacted ? '#EF535010' : '#81C78410' }}>
                                <Droplets size={18} />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: 700, margin: '0 0 2px 0', fontSize: '0.85rem' }}>Vízgazdálkodás</h4>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={isCompacted ? 'bad' : 'good'}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}
                                    >
                                        {isCompacted ? 'Gyenge elfolyás' : 'Kiegyensúlyozott'}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}
