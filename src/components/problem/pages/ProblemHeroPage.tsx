'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Shovel, Tractor, ChevronRight, Activity } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import styles from './ProblemHeroPage.module.css'
import { useBookNav } from '@/components/experiment/BookLayout/BookLayout'

const HERO_NAV_ITEMS = [
    {
        id: 'compaction-stats',
        number: '01',
        title: 'Az öntözés okozta tömörödés',
        icon: <Layers size={24} />,
        color: '#A0846B',
        accent: '#FDD835', // Yellow (Warning)
        stats: '0-20 cm', // Keeping data but not rendering
        alertLevel: 'Magas'
    },
    {
        id: 'cultivator-problems',
        number: '02',
        title: 'A szántóföldi nehézkultivátor korlátai',
        icon: <Shovel size={24} />,
        color: '#7D6B5A',
        accent: '#FB8C00', // Orange (Critical)
        stats: '20-35 cm',
        alertLevel: 'Kritikus'
    },
    {
        id: 'ploughing-effects',
        number: '03',
        title: 'A szántás korlátai',
        icon: <Tractor size={24} />,
        color: '#5C4D3D',
        accent: '#E53935', // Red (Danger)
        stats: '35+ cm',
        alertLevel: 'Veszély'
    }
]

export default function ProblemHeroPage() {
    const { goToPage, pages } = useBookNav()
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const handleNavigate = (sectionId: string) => {
        // Find the page with the matching ID
        const pageIndex = pages.findIndex(p => p.id === sectionId)
        if (pageIndex !== -1) {
            goToPage(pageIndex)
        }
    }

    return (
        <div className={styles.heroPage}>
            <div className={styles.content}>
                {/* Left Column: Heading & Intro */}
                <div className={styles.heroLeft}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge label="A PROBLÉMA" />
                    </motion.div>

                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        Miért veszítjük el<br />
                        <span className={styles.titleHighlight}>a gyökértömeget?</span>
                    </motion.h1>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Az intenzív öntözés és a nehéz gépek taposása láthatatlanul teszi tönkre a talajszerkezetet, homok és vályog talajon egyaránt.<br />
                        Három fő ellenséggel küzdünk.
                    </motion.p>
                </div>

                <div className={styles.heroRight}>
                    {/* Imants / Soil Blades Container */}
                    <div className={styles.imantsContainer}>
                        {/* The Soil Horizon Layer */}
                        <div className={styles.soilHorizon} />



                        {HERO_NAV_ITEMS.map((item, index) => {
                            // Position logic for the 3 blades "in the soil"
                            const positions = [
                                { bottom: '20%', left: '10%' }, // Left Blade
                                { bottom: '12%', left: '37%' }, // Center Blade (slightly lower/forward)
                                { bottom: '20%', left: '64%' }  // Right Blade
                            ]
                            const pos = positions[index] || { bottom: '15%', left: '50%' }

                            return (
                                <motion.div
                                    key={item.id}
                                    className={styles.spadeCardWrapper}
                                    style={{
                                        left: pos.left,
                                        bottom: pos.bottom,
                                        '--card-accent': item.accent,
                                        zIndex: 10 + index // Natural layering
                                    } as React.CSSProperties}
                                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.4 + (index * 0.15), type: 'spring', stiffness: 120, damping: 12 }}
                                >
                                    <div
                                        className={`${styles.spadeCard} ${hoveredId === item.id ? styles.spadeCardActive : ''}`}
                                        onClick={() => handleNavigate(item.id)}
                                        onMouseEnter={() => setHoveredId(item.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        <span className={styles.spadeNumber}>{item.number}</span>
                                        <div className={styles.spadeIcon}>{item.icon}</div>
                                        <h3 className={styles.spadeTitle}>{item.title}</h3>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
