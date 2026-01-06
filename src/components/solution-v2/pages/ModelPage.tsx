'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ModelSection from '../ModelSection'
import FieldDataModal from '../FieldDataModal'
import styles from './ModelsPage.module.css' // We can reuse the header styles if needed, or inline them. 
// Actually, let's look at ModelsPage.module.css to see if we can reuse or if we should create ModelPage.module.css
// The design in ModelsPage had a header "IMANTS DUPLAROTOROS...". 
// Ideally each page should just have the content. ModelSection already has a "header" inside it?
// Let's check ModelSection.tsx.
// ModelSection has `sectionHeader` with `titleRow`, `modelName`, etc.
// So the wrapper page mainly needs to handle the Modal state and the layout container.

type ModelId = '38sx' | '38wx' | '40sx'

interface ModelPageProps {
    modelId: ModelId
}

export default function ModelPage({ modelId }: ModelPageProps) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div style={{ padding: '0 var(--space-xl) var(--space-4xl)', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <ModelSection
                    modelId={modelId}
                    onOpenModal={() => setModalOpen(true)}
                />
            </motion.div>

            <FieldDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                modelId={modelId}
            />
        </div>
    )
}
