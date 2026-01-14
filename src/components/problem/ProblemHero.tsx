'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, AlertTriangle, XCircle, ChevronRight, Activity, AlertOctagon } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import styles from './ProblemNew.module.css'

interface ProblemHeroProps {
    onNavigate: (sectionId: string) => void
}

const HERO_NAV_ITEMS = [
    {
        id: 'compaction',
        number: '01',
        title: 'Az öntözés okozta tömörödés',
        icon: <Layers size={24} />,
        color: '#A0846B',
        accent: '#C9A227', // Gold
        stats: '0-20 cm',
        alertLevel: 'Magas'
    },
    {
        id: 'cultivator',
        number: '02',
        title: 'A szántóföldi nehézkultivátor korlátai',
        icon: <AlertTriangle size={24} />,
        color: '#7D6B5A',
        accent: '#C9A227', // Gold
        stats: '20-35 cm',
        alertLevel: 'Kritikus'
    },
    {
        id: 'ploughing',
        number: '03',
        title: 'A szántás korlátai',
        icon: <XCircle size={24} />,
        color: '#5C4D3D',
        accent: '#E57373', // Red for high danger
        stats: '35+ cm',
        alertLevel: 'Veszély'
    }
]

export default function ProblemHero({ onNavigate }: ProblemHeroProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <div className={styles.heroWrapper}>
            <div className={styles.heroContainer}>
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
                        <em>… teszi tönkre a talajszerkezetet, homok és vályog talajon egyaránt.</em><br />
                        Három fő ellenséggel küzdünk.
                    </motion.p>
                </div>

                {/* Right Column: "Soil Threat Monitor" Visualization */}
                <div className={styles.heroRight}>
                    <div className={styles.flowStepsWrapper}>
                        {/* The connecting flow line */}
                        <div className={styles.flowLine} />

                        <div className={styles.flowStepsContainer}>
                            {HERO_NAV_ITEMS.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className={styles.stepCardWrapper}
                                    initial={{ opacity: 0, y: 30, x: -10 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.15), type: 'spring', stiffness: 80 }}
                                >
                                    <div
                                        className={`${styles.stepCard} ${hoveredId === item.id ? styles.stepCardActive : ''}`}
                                        onClick={() => onNavigate(item.id)}
                                        onMouseEnter={() => setHoveredId(item.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        style={{ '--card-accent': item.accent } as React.CSSProperties}
                                    >
                                        {/* Un-skewed content container */}
                                        <div className={styles.stepContent}>
                                            <div className={styles.stepHeader}>
                                                <span className={styles.stepNumber}>{item.number}</span>
                                                <div className={styles.stepIcon}>{item.icon}</div>
                                            </div>

                                            <h3 className={styles.stepTitle}>{item.title}</h3>

                                            <div className={styles.stepMeta}>
                                                <span className={styles.metaBadge}>{item.stats}</span>
                                                <ChevronRight size={16} className={styles.arrowIcon} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
