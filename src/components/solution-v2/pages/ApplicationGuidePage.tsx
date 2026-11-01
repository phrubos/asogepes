'use client'

import ApplicationGuide from '../ApplicationGuide'
import frameStyles from './PageFrame.module.css'

export default function ApplicationGuidePage() {
    return (
        <div className={frameStyles.frame}>
            <ApplicationGuide />
        </div>
    )
}
