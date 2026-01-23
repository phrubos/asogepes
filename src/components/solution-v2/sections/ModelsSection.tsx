'use client'

import ModelsCombinedPage from '../pages/ModelsCombinedPage'
import styles from './sections.module.css'

export default function ModelsSection() {
    return (
        <div className={styles.scrollSection}>
            <ModelsCombinedPage />
        </div>
    )
}
