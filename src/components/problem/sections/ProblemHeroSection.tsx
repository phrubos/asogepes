'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplet, UnfoldHorizontal, Redo } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import HeroTopicList, { type HeroTopic } from '@/components/shared/HeroTopicList/HeroTopicList'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from '../pages/ProblemHeroPage.module.css'

const HERO_NAV_ITEMS = [
    {
        id: 'compaction',
        number: '01',
        title: 'Az öntözés okozta tömörödés',
        icon: <Droplet size={24} />,
        color: '#A0846B',
        accent: '#D4A84B', // gold → ochre → terracotta: rising severity in the site palette
        stats: '0-20 cm',
        alertLevel: 'Magas'
    },
    {
        id: 'cultivator',
        number: '02',
        title: 'A szántóföldi nehézkultivátor korlátai',
        icon: <UnfoldHorizontal size={24} />,
        color: '#7D6B5A',
        accent: '#C8873A',
        stats: '20-35 cm',
        alertLevel: 'Kritikus'
    },
    {
        id: 'ploughing',
        number: '03',
        title: 'A szántás korlátai',
        icon: <Redo size={24} />,
        color: '#5C4D3D',
        accent: '#C45C3E',
        stats: '35+ cm',
        alertLevel: 'Veszély'
    }
]

// Phones and tablets: the same three problems as a tappable list, ordered by depth
const HERO_TOPICS: HeroTopic[] = [
    { id: 'compaction', lead: '1', title: 'Az öntözés okozta tömörödés' },
    { id: 'cultivator', lead: '2', title: 'A nehézkultivátor korlátai' },
    { id: 'ploughing', lead: '3', title: 'A szántás korlátai' },
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
                    <div className="hero-rise">
                        <PageBadge label="A PROBLÉMA" />
                    </div>

                    <h1 className={`${styles.heroTitle} hero-rise`} style={{ animationDelay: '100ms' }}>
                        Miért veszítjük el<br />
                        <span className={styles.titleHighlight}>a gyökértömeget?</span>
                    </h1>

                    <p className={`${styles.heroSubtitle} hero-rise`} style={{ animationDelay: '200ms' }}>
                        Az intenzív öntözés és a nehéz gépek taposása láthatatlanul teszi tönkre a talajszerkezetet, homok és vályog talajon egyaránt.<br />
                        Három fő ellenséggel küzdünk.
                    </p>
                </div>

                <HeroTopicList topics={HERO_TOPICS} onSelect={handleNavigate} label="A három probléma" />

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
                                    // settle into the soil: a short drop, no bounce, a 60ms step between the three depths
                                    initial={{ opacity: 0, y: -16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div
                                        className={`${styles.spadeCard} ${hoveredId === item.id ? styles.spadeCardActive : ''}`}
                                        onClick={() => handleNavigate(item.id)}
                                        onMouseEnter={() => setHoveredId(item.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key !== 'Enter' && e.key !== ' ') return
                                            e.preventDefault()
                                            handleNavigate(item.id)
                                        }}
                                        onFocus={() => setHoveredId(item.id)}
                                        onBlur={() => setHoveredId(null)}
                                    >
                                        <span className={styles.spadeNumber}>{item.number}</span>
                                        <div className={styles.spadeIcon}>{item.icon}</div>
                                        <h2 className={styles.spadeTitle}>{item.title}</h2>
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
