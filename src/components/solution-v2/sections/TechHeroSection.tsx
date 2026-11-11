'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HubFolder from '../HubFolder'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import HeroTopicList, { type HeroTopic } from '@/components/shared/HeroTopicList/HeroTopicList'
import styles from '../pages/HeroPage.module.css'

// Phones and tablets get a plain list of the same three destinations instead of the animated folder
const TOPICS: HeroTopic[] = [
    { id: 'operation', lead: '1', title: 'Működési elv', desc: 'Hogyan működik az ásógép?' },
    { id: 'models', lead: '2', title: 'Modellek', desc: '38SX, 38WX, 40SX' },
    { id: 'application', lead: '3', title: 'Útmutató', desc: 'Melyik módszert válasszam?' },
]

export default function TechHeroSection() {
    const { scrollToSection } = useScrollNav()
    const isDesktop = useMediaQuery('(min-width: 1025px)')

    const navigateToSection = (sectionId: string) => {
        scrollToSection(sectionId)
    }

    return (
        <div id="tech-intro" className={styles.heroPage}>
            <div className={styles.content}>
                {/* Left Column - Text */}
                <div className={styles.textColumn}>
                    <div className="hero-rise">
                        <PageBadge label="A TECHNOLÓGIA" />
                        <h1 className={styles.title}>
                            Lazítás és forgatás,<br />
                            optimális arányban
                        </h1>
                        <p className={styles.subTitle}>
                            Az Imants ásógép technológia <em>megőrzi a talaj természetes rétegződését</em>,
                            miközben megszünteti a tömörödést. Ismerd meg a gép működését.
                        </p>
                    </div>
                </div>

                {/* Right Column - Hub Folder (desktop only; mounted after the viewport is known) */}
                {isDesktop && (
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
                )}

                <HeroTopicList topics={TOPICS} onSelect={navigateToSection} label="Témák" />
            </div>
        </div>
    )
}
