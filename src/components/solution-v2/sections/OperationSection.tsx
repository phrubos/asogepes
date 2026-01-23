'use client'

import OperationPrinciplePage from '../pages/OperationPrinciplePage'
import styles from './sections.module.css'

export default function OperationSection() {
    return (
        <div id="operation-principle" className={styles.scrollSection}>
            <OperationPrinciplePage />
        </div>
    )
}
