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
                        <PageBadge number="02" label="A PROBLÉMA" />
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
                    <div className={styles.monitorFrame}>
                        {/* Background Grid & Decorative Elements */}
                        <div className={styles.monitorGrid} />
                        <div className={styles.monitorScanline} />
                        <div className={styles.monitorHeader}>
                            <div className={styles.monitorStatus}>
                                <Activity size={14} className={styles.pulseIcon} />
                                <span>TALAJ DIAGNOSZTIKA</span>
                            </div>
                            <div className={styles.monitorId}>SYS-2025-V2</div>
                        </div>

                        <div className={styles.monitorContent}>
                            {HERO_NAV_ITEMS.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    className={`${styles.threatCard} ${hoveredId === item.id ? styles.threatCardActive : ''}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    onClick={() => onNavigate(item.id)}
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Card Content */}
                                    <div className={styles.threatCardInner}>
                                        <div className={styles.threatIconBox}>
                                            {item.icon}
                                        </div>

                                        <div className={styles.threatInfo}>
                                            <div className={styles.threatMeta}>
                                                <span className={styles.threatNumber}>{item.number}</span>
                                                <span className={styles.threatDepth}>{item.stats}</span>
                                            </div>
                                            <h3 className={styles.threatTitle}>{item.title}</h3>
                                        </div>

                                        <div className={styles.threatAction}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>

                                    {/* Hover visual effects */}
                                    {hoveredId === item.id && (
                                        <motion.div
                                            className={styles.threatScanEffect}
                                            layoutId="scanEffect"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}

                                    {/* Alert Tag on Hover */}
                                    <div className={`${styles.alertTag} ${hoveredId === item.id ? styles.alertTagVisible : ''}`}>
                                        <AlertOctagon size={12} />
                                        {item.alertLevel}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
