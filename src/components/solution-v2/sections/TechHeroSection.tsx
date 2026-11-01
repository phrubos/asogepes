'use client'

import { motion } from 'framer-motion'
import { Settings, Folder, HelpCircle, ChevronRight } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import HubFolder from '../HubFolder'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from '../pages/HeroPage.module.css'

// Phones and tablets get a plain list of the same three destinations instead of the animated folder
const TOPICS = [
    { id: 'operation', title: 'Működési elv', desc: 'Hogyan működik az ásógép?', icon: Settings },
    { id: 'models', title: 'Modellek', desc: '38SX, 38WX, 40SX', icon: Folder },
    { id: 'application', title: 'Útmutató', desc: 'Melyik módszert válasszam?', icon: HelpCircle },
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
                            miközben megszünteti a tömörödést. Ismerje meg a gép működését.
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

                <nav className={`${styles.topicList} hero-rise`} style={{ animationDelay: '200ms' }} aria-label="Témák">
                    {TOPICS.map(({ id, title, desc, icon: Icon }) => (
                        <button key={id} type="button" className={styles.topicItem} onClick={() => navigateToSection(id)}>
                            <span className={styles.topicIcon}><Icon size={20} aria-hidden="true" /></span>
                            <span className={styles.topicText}>
                                <span className={styles.topicTitle}>{title}</span>
                                <span className={styles.topicDesc}>{desc}</span>
                            </span>
                            <ChevronRight size={20} className={styles.topicChevron} aria-hidden="true" />
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
