'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { locations } from '@/lib/data'
import SeasonOnly, { yearAdj } from '../season/SeasonOnly'
import styles from './SzentkirályPhotosPage.module.css'
import PhotoViewer from '@/components/shared/PhotoViewer/PhotoViewer'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { useResearchData } from '@/lib/i18n/useResearchData'


export default function SzentkirályPhotosPage() {
    const data = useResearchData(locations).szentkiraly
    const en = useLocale() === 'en'
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
                <SeasonOnly years={[2025]} missingNote={(y) => (en ? `the ${y} photos are not up yet` : `a ${yearAdj(y)} fotók még nincsenek fent`)} />
                <h3 className={styles.headerTitle}>{en ? 'More photos' : 'Egyéb fotók'}</h3>
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
