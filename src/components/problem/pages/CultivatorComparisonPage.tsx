'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Layers } from 'lucide-react'
import HeavyCultivatorSVG from '../visualizations/HeavyCultivatorSVG'
import SpadingMachineSVG from '../visualizations/SpadingMachineSVG'
import styles from '../ProblemNew.module.css'

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

const comparisonData = {
    cultivator: {
        title: 'Nehézkultivátor talaj',
        items: [
            'A szármaradványok elégtelen beforgatása',
            'A lazítás egyenletlen, főként a kapák nyomában történik',
            'Ültetésre közvetlenül nem alkalmas',
        ],
    },
    spade: {
        title: 'Ásógépezett talaj',
        items: [
            'A szármaradványok a felszín alá kerülnek',
            'Egyenletesen laza szelvény alakul ki',
            'A vetés és ültetés rögtön kezdődhet',
        ],
    },
}

export default function CultivatorComparisonPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`${styles.contentWrapper} ${styles.comparisonPageWrapper}`}
        >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span className={styles.pillBadge}>Talajszelvény összehasonlítás</span>
            </motion.div>

            <div className={styles.soilProfilesContainer} style={{ alignItems: 'start', marginBottom: '0' }}>
                <motion.div
                    className={styles.soilProfile}
                    whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <div className={`${styles.soilProfileHeader} ${styles.negativeHeader}`}>
                        <X size={16} strokeWidth={2.5} />
                        <span>Nehézkultivátorozott talaj</span>
                    </div>

                    <div className={styles.soilProfileVisual} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                        <HeavyCultivatorSVG />
                        <ul className={styles.comparisonList} style={{ padding: '0 0.5rem', marginTop: '0.25rem' }}>
                            {comparisonData.cultivator.items.map((item, i) => (
                                <li key={i}><X size={14} className={styles.iconNegative} strokeWidth={3} /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.soilProfile}
                    whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(107, 139, 94, 0.25)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <div className={`${styles.soilProfileHeader} ${styles.positiveHeader}`}>
                        <Check size={16} strokeWidth={2.5} />
                        <span>Ásógépezett talaj</span>
                    </div>

                    <div className={styles.soilProfileVisual} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                        <SpadingMachineSVG />
                        <ul className={styles.comparisonList} style={{ padding: '0 0.5rem', marginTop: '0.25rem' }}>
                            {comparisonData.spade.items.map((item, i) => (
                                <li key={i}><Check size={14} className={styles.iconPositive} strokeWidth={3} /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
