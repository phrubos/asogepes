'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Activity, Droplet, UnfoldHorizontal, Redo } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from '../pages/ProblemHeroPage.module.css'

const HERO_NAV_ITEMS = [
    {
        id: 'compaction',
        number: '01',
        title: 'Az öntözés okozta tömörödés',
        icon: <Droplet size={24} />,
        color: '#A0846B',
        accent: '#FDD835',
        stats: '0-20 cm',
        alertLevel: 'Magas'
    },
    {
        id: 'cultivator',
        number: '02',
        title: 'A szántóföldi nehézkultivátor korlátai',
        icon: <UnfoldHorizontal size={24} />,
        color: '#7D6B5A',
        accent: '#FB8C00',
        stats: '20-35 cm',
        alertLevel: 'Kritikus'
    },
    {
        id: 'ploughing',
        number: '03',
        title: 'A szántás korlátai',
        icon: <Redo size={24} />,
        color: '#5C4D3D',
        accent: '#E53935',
        stats: '35+ cm',
        alertLevel: 'Veszély'
    }
]

export default function ProblemHeroSection() {
    const { scrollToSection } = useScrollNav()
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const handleNavigate = (sectionId: string) => {
        scrollToSection(sectionId)
    }

    return (
        <div id="problem-intro" className={styles.heroPage}>
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
                            const positions = [
                                { bottom: '20%', left: '10%' },
                                { bottom: '12%', left: '37%' },
                                { bottom: '20%', left: '64%' }
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
                                        zIndex: 10 + index
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
