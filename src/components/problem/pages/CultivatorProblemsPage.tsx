'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Sprout, Grid3X3, Shovel } from 'lucide-react'

import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from '../ProblemNew.module.css'

const cultivatorProblems = [
    {
        title: 'Csekély mértékű átkeverés',
        description: 'A nehézkultivátor jól lazít, de nem tudja bedolgozni a szármaradványokat és sok esetben rögösít. Az árvakelés és a gyomnövények magjai a felszín közelében maradnak, ahogy a herbicidek szermaradékai is.',
        icon: 'layers',
    },
    {
        title: 'A tarló zöldülése csak részleges',
        description: 'A gyomnövények csírázása a tarlóhántás után lassú és részleges.',
        icon: 'sprout',
    },
    {
        title: 'Egyenletlen lazítás',
        description: 'A lazítás képe egyenletlen, főként a kapák nyomában laza csak megfelelő mértékben.',
        icon: 'grid',
    },
    {
        title: 'Ültetés előtt elmarkolás szükséges',
        description: 'Ültetésre csak kombinátoros művelés után alkalmas.',
        icon: 'shovel',
    },
]

export default function CultivatorProblemsPage() {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const iconMap: Record<string, React.ReactNode> = {
        layers: <Layers size={24} />,
        sprout: <Sprout size={24} />,
        grid: <Grid3X3 size={24} />,
        shovel: <Shovel size={24} />,
    }

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
            className={styles.cultivatorPageWrapper}
        >
            <div className={styles.cultivatorGrid}>
                {/* Left Side: Visual & Intro */}
                <div className={styles.cultivatorVisualSide}>
                    <motion.div variants={itemVariants} className={styles.cultivatorImageWrapper}>
                        <motion.div
                            className={styles.cultivatorImageContainer}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setIsLightboxOpen(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src="/images/premium_cultivator_courtyard.png"
                                alt="Nehézkultivátor"
                                className={styles.cultivatorImage}
                                loading="lazy"
                            />

                        </motion.div>
                    </motion.div>


                </div>

                {/* Right Side: Problems Grid */}
                <div className={styles.cultivatorProblemsSide}>
                    <motion.div variants={itemVariants}>
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
                                        <h4 className={styles.problemCardTitle}>{problem.title}</h4>
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
                src="/images/premium_cultivator_courtyard.png"
                alt="Nehézkultivátor"
            />
        </motion.div>
    )
}
