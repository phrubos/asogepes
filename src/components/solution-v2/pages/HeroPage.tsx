'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HubFolder from '../HubFolder'
import styles from './HeroPage.module.css'
import { useBookNav } from '@/components/experiment/BookLayout/BookLayout'

export default function HeroPage() {
    const { goToPage, pages } = useBookNav()

    const navigateToPage = (pageIdPrefix: string) => {
        const pageIndex = pages.findIndex(p => p.id.startsWith(pageIdPrefix))
        if (pageIndex !== -1) {
            goToPage(pageIndex)
        }
    }

    return (
        <div className={styles.heroPage}>
            <div className={styles.content}>
                {/* Left Column - Text */}
                <div className={styles.textColumn}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <PageBadge label="A TECHNOLÓGIA" />
                        <h1 className={styles.title}>
                            Lazítás és forgatás,<br />
                            optimális arányban
                        </h1>
                        <p className={styles.subTitle}>
                            Az Imants ásógép technológia <em>megőrzi a talaj természetes rétegződését</em>,
                            miközben megszünteti a tömörödést. Ismerje meg a gép működését.
                        </p>
                    </motion.div>
                </div>

                {/* Right Column - Hub Folder */}
                <motion.div
                    className={styles.visualColumn}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <HubFolder
                        onScrollToOperation={() => navigateToPage('operation-principle')}
                        onScrollToModel={(modelId) => navigateToPage(`models-${modelId}`)}
                        onScrollToGuide={() => navigateToPage('application-guide')}
                    />
                </motion.div>
            </div>
        </div>
    )
}
