'use client'

import { motion } from 'framer-motion'
import ModelSection from '../ModelSection'

const models = ['38sx', '38wx', '40sx'] as const

export default function ModelsCombinedPage() {
    return (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {models.map((modelId, index) => (
                <div
                    key={modelId}
                    id={`model-${modelId}`}
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        padding: 'var(--space-1xl) var(--space-xl) var(--space-xl)',
                        // Add separator border except for last item
                        borderBottom: index < models.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}
                >
                    <motion.div
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
