'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { locations } from '@/lib/data'
import styles from './KecskemétPhotosPage.module.css'

const data = locations.kecskemet

export default function KecskemétPhotosPage() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.headerBadge}>
                    <MapPin size={12} />
                    <span>Kecskemét-Borbás</span>
                </div>
                <h3 className={styles.headerTitle}>Fotók</h3>
            </motion.div>

            {/* Content */}
            {data.highlight && (
                <motion.div
                    className={styles.highlight}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className={styles.highlightImage}>
                        <div className={styles.imagePlaceholder}>
                            <span>Összehasonlító fotó</span>
                            <span className={styles.placeholderSub}>Növekedési különbség</span>
                        </div>
                    </div>
                    {/* Description */}
                    <motion.div
                        className={styles.highlightContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className={styles.highlightTitle}>{data.highlight.title}</h4>
                        <p className={styles.highlightText}>{data.highlight.text}</p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
