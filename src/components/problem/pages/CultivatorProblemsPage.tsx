'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprout, Webhook, RefreshCwOff, SquareKanban } from 'lucide-react'
import Image from 'next/image'

import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from '../ProblemNew.module.css'

const cultivatorProblems = [
    {
        title: 'Csekély mértékű átkeverés',
        description: 'A nehézkultivátor jól lazít, de nem tudja bedolgozni a szármaradványokat és sok esetben rögösít. A majdani árvakelés és a gyomnövények magjai a felszín közelében maradnak, ahogy a herbicidek szermaradékai is.',
        icon: 'refresh-cw-off',
    },
    {
        title: 'A tarló zöldülése csak részleges',
        description: 'A gyomnövények csírázása a tarlóhántás után lassú és részleges.',
        icon: 'sprout',
    },
    {
        title: 'Egyenletlen lazítás',
        description: 'A lazítás képe egyenletlen, főként a kapák nyomában laza csak megfelelő mértékben.',
        icon: 'square-kanban',
    },
    {
        title: 'Ültetés előtt elmunkálás szükséges',
        description: 'Ültetésre csak kombinátoros művelés után alkalmas.',
        icon: 'webhook',
    },
]

export default function CultivatorProblemsPage() {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const iconMap: Record<string, React.ReactNode> = {
        'refresh-cw-off': <RefreshCwOff size={24} />,
        sprout: <Sprout size={24} />,
        'square-kanban': <SquareKanban size={24} />,
        webhook: <Webhook size={24} />,
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.cultivatorPageWrapper}
        >
            <div className={styles.cultivatorGrid}>
                {/* Left Side: Visual & Intro */}
                <div className={styles.cultivatorVisualSide}>
                    {/* stacked layout: the section title sits over the picture it introduces */}
                    <span className={`${styles.pillBadge} ${styles.cultivatorImageHeading}`}>Kiemelhető problémák</span>
                    <motion.div variants={itemVariants} className={styles.cultivatorImageWrapper}>
                        <motion.div
                            className={styles.cultivatorImageContainer}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setIsLightboxOpen(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Image
                                src="/images/premium_cultivator_courtyard.jpg"
                                alt="Nehézkultivátor"
                                fill
                                className={styles.cultivatorImage}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />

                        </motion.div>
                    </motion.div>


                </div>

                {/* Right Side: Problems Grid */}
                <div className={styles.cultivatorProblemsSide}>
                    <motion.div variants={itemVariants} className={styles.cultivatorProblemsHeading}>
                        <span className={styles.pillBadge}>Kiemelhető problémák</span>
                    </motion.div>

                    <div className={styles.cultivatorProblemsGrid}>
                        {cultivatorProblems.map((problem, index) => (
                            <motion.div key={index} variants={itemVariants} style={{ height: '100%' }}>
                                <div className={styles.problemCard}>
                                    <div
                                        className={styles.problemCardContent}
                                    >
                                        <motion.div
                                            className={styles.problemIcon}
                                        >
                                            {iconMap[problem.icon]}
                                        </motion.div>
                                        <h3 className={styles.problemCardTitle}>{problem.title}</h3>
                                        <p className={styles.problemCardDesc}>{problem.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <ImageLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                src="/images/premium_cultivator_courtyard.jpg"
                alt="Nehézkultivátor"
            />
        </motion.div>
    )
}
