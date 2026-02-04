'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { locations } from '@/lib/data'
import styles from './KecskemétPhotosPage.module.css'
import PhotoViewer from '@/components/shared/PhotoViewer/PhotoViewer'

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
            </motion.div>

            {/* Content */}
            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <PhotoViewer items={data.photos || []} />
            </motion.div>
        </div>
    )
}
