'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import TemperatureChart from '../TemperatureChart'
import { locations } from '@/lib/data'
import styles from './SzentkirályTempPage.module.css'

const data = locations.szentkiraly

export default function SzentkirályTempPage() {
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
                    <span>Szentkirály</span>
                </div>
                <h3 className={styles.headerTitle}>Talajhőmérséklet</h3>
            </motion.div>

            {/* Content */}
            {data.temperatureData && (
                <motion.div
                    className={styles.chartContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <TemperatureChart data={data.temperatureData} />
                </motion.div>
            )}
        </div>
    )
}
