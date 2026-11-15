'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplet, UnfoldHorizontal, Redo } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import HeroTopicList, { type HeroTopic } from '@/components/shared/HeroTopicList/HeroTopicList'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from '../pages/ProblemHeroPage.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TEXT = bilingual(
    {
        cards: ['Az öntözés okozta tömörödés', 'A szántóföldi nehézkultivátor korlátai', 'A szántás korlátai'],
        topics: ['Az öntözés okozta tömörödés', 'A nehézkultivátor korlátai', 'A szántás korlátai'],
        badge: 'A PROBLÉMA',
        titleA: 'Miért veszítjük el',
        titleB: 'a gyökértömeget?',
        subtitle: 'Az intenzív öntözés és a nehéz gépek taposása láthatatlanul teszi tönkre a talajszerkezetet, homok és vályog talajon egyaránt.',
        subtitle2: 'Három fő ellenséggel küzdünk.',
        topicsLabel: 'A három probléma',
    },
    {
        cards: ['Irrigation-induced compaction', 'The limits of the heavy field cultivator', 'The limits of ploughing'],
        topics: ['Irrigation-induced compaction', 'The limits of the heavy cultivator', 'The limits of ploughing'],
        badge: 'THE PROBLEM',
        titleA: 'Why are we losing',
        titleB: 'root mass?',
        subtitle: 'Intensive irrigation and wheel traffic from heavy machinery quietly destroy soil structure, on sandy and loam soils alike.',
        subtitle2: 'Three main culprits are at work.',
        topicsLabel: 'The three problems',
    },
)

const HERO_NAV_ITEMS = [
    {
        id: 'compaction',
        number: '01',
        icon: <Droplet size={24} />,
        color: '#A0846B',
        accent: '#D4A84B', // gold → ochre → terracotta: rising severity in the site palette
        stats: '0-20 cm',
        alertLevel: 'Magas'
    },
    {
        id: 'cultivator',
        number: '02',
        icon: <UnfoldHorizontal size={24} />,
        color: '#7D6B5A',
        accent: '#C8873A',
        stats: '20-35 cm',
        alertLevel: 'Kritikus'
    },
    {
        id: 'ploughing',
        number: '03',
        icon: <Redo size={24} />,
        color: '#5C4D3D',
        accent: '#C45C3E',
        stats: '35+ cm',
        alertLevel: 'Veszély'
    }
]

// Phones and tablets: the same three problems as a tappable list, ordered by depth
const HERO_TOPICS: Omit<HeroTopic, 'title'>[] = [
    { id: 'compaction', lead: '1' },
    { id: 'cultivator', lead: '2' },
    { id: 'ploughing', lead: '3' },
]

export default function ProblemHeroSection() {
    const { scrollToSection } = useScrollNav()
    const t = TEXT[useLocale()]
    const topics = HERO_TOPICS.map((topic, i) => ({ ...topic, title: t.topics[i] }))
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
                        <PageBadge label={t.badge} />
                    </div>

                    <h1 className={`${styles.heroTitle} hero-rise`} style={{ animationDelay: '100ms' }}>
                        {t.titleA}<br />
                        <span className={styles.titleHighlight}>{t.titleB}</span>
                    </h1>

                    <p className={`${styles.heroSubtitle} hero-rise`} style={{ animationDelay: '200ms' }}>
                        {t.subtitle}<br />
                        {t.subtitle2}
                    </p>
                </div>

                <HeroTopicList topics={topics} onSelect={handleNavigate} label={t.topicsLabel} />

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
                                        <h2 className={styles.spadeTitle}>{t.cards[index]}</h2>
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
