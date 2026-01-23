'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HubFolder from '../HubFolder'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from '../pages/HeroPage.module.css'

export default function TechHeroSection() {
    const { scrollToSection } = useScrollNav()

    const navigateToSection = (sectionId: string) => {
        scrollToSection(sectionId)
    }

    return (
        <div id="tech-intro" className={styles.heroPage}>
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
                        onScrollToOperation={() => navigateToSection('operation')}
                        onScrollToModel={(modelId) => navigateToSection(`model-${modelId}`)}
                        onScrollToGuide={() => navigateToSection('application')}
                    />
                </motion.div>
            </div>
        </div>
    )
}
