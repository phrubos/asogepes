'use client'

import { motion } from 'framer-motion'
import ModelSection from '../ModelSection'
import styles from './ModelsCombinedPage.module.css'

const models = ['38sx', '38wx', '40sx'] as const

export default function ModelsCombinedPage() {
    return (
        <div className={styles.models}>
            {models.map((modelId) => (
                <div key={modelId} id={`model-${modelId}`} className={styles.model}>
                    <motion.div
                        className="mobile-static"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.2 }}
                    >
                        <ModelSection modelId={modelId} />
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
