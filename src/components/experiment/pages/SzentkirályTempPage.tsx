'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import TemperatureChart from '../TemperatureChart'
import TemperatureSeriesChart from '../TemperatureSeriesChart'
import { locations } from '@/lib/data'
import { szentkiralySeasons, findSeason } from '@/lib/seasons'
import { useSeason } from '../season/SeasonContext'
import { SeasonLabel } from '../season/SeasonOnly'
import styles from './SzentkirályTempPage.module.css'

const data = locations.szentkiraly
const site = szentkiralySeasons

export default function SzentkirályTempPage() {
    const { year } = useSeason()
    const season = findSeason(site, year) ?? site.seasons[site.seasons.length - 1]
    // One measurement day per depth (2025): the original two-depth chart; several days: the series chart
    const single = season.temperature.depths.every((d) => d.points.length === 1)

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
                <div className={styles.seasonRow}>
                    <SeasonLabel switchAt="szentkiraly-info" />
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                className={`${styles.chartContainer} ${single ? '' : styles.chartWide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                {single
                    ? <TemperatureChart key={season.year} data={data.temperatureData} />
                    : <TemperatureSeriesChart key={season.year} data={season.temperature} />}
            </motion.div>
        </div>
    )
}
