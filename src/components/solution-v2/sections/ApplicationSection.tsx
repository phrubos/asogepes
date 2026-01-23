'use client'

import ApplicationGuidePage from '../pages/ApplicationGuidePage'
import styles from './sections.module.css'

export default function ApplicationSection() {
    return (
        <div id="application-guide" className={styles.scrollSection}>
            <ApplicationGuidePage />
        </div>
    )
}
