'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Layers } from 'lucide-react'
import IsometricFieldChart from './IsometricFieldChart'
import FieldChart3D from './FieldChart3D'
import styles from './LakitelekCharts.module.css'

interface ParcelData {
    num: string
    treatment: string
    shortName: string
    may: number
    jun: number
    aug: number
    rating: number
    description: string
    good: boolean
}

interface LakitelekChartsProps {
    parcels: ParcelData[]
    conclusions?: {
        summary: string
        bestResults: string[]
    }
}

export default function LakitelekCharts({ parcels, conclusions }: LakitelekChartsProps) {
    const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d')

    return (
        <div className={styles.container}>
            {/* Tabs */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === '2d' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('2d')}
                    >
                        <Box size={16} />
                        <span>2D Nézet</span>
                        {activeTab === '2d' && (
                            <motion.div className={styles.activeIndicator} layoutId="activeTab" />
                        )}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === '3d' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('3d')}
                    >
                        <Layers size={16} />
                        <span>3D Nézet</span>
                        {activeTab === '3d' && (
                            <motion.div className={styles.activeIndicator} layoutId="activeTab" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <AnimatePresence mode="wait">
                    {activeTab === '2d' ? (
                        <motion.div
                            key="2d"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%' }}
                        >
                            <IsometricFieldChart parcels={parcels} conclusions={conclusions} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="3d"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%' }}
                        >
                            <FieldChart3D parcels={parcels} conclusions={conclusions} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
