'use client'

import { motion } from 'framer-motion'
import PloughingSoilComparison from '@/components/problem/PloughingSoilComparison'
import styles from '../ProblemNew.module.css'

export default function PloughingStructurePage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.ploughPageContainer}
        >
            <motion.div variants={itemVariants} className={styles.ploughStructureContent}>
                <PloughingSoilComparison />
            </motion.div>
        </motion.div>
    )
}
