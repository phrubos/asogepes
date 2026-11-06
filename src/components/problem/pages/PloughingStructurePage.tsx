'use client'

import { motion } from 'framer-motion'
import PloughingSoilComparison from '@/components/problem/PloughingSoilComparison'
import styles from '../ProblemNew.module.css'

export default function PloughingStructurePage() {
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
            className={styles.ploughPageContainer}
        >
            <motion.div variants={itemVariants} className={styles.ploughStructureContent}>
                <PloughingSoilComparison />
            </motion.div>
        </motion.div>
    )
}
