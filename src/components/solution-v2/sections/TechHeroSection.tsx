'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HubFolder from '../HubFolder'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import HeroTopicList, { type HeroTopic } from '@/components/shared/HeroTopicList/HeroTopicList'
import styles from '../pages/HeroPage.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TEXT = bilingual(
    {
        topics: [
            { title: 'Működési elv', desc: 'Hogyan működik az ásógép?' },
            { title: 'Modellek', desc: '38SX, 38WX, 40SX' },
            { title: 'Útmutató', desc: 'Melyik módszert válasszam?' },
        ],
        badge: 'A TECHNOLÓGIA',
        titleA: 'Lazítás és forgatás,',
        titleB: 'optimális arányban',
        subA: 'Az Imants ásógép technológia',
        subEm: 'megőrzi a talaj természetes rétegződését',
        subB: ', miközben megszünteti a tömörödést. Ismerd meg a gép működését.',
        topicsLabel: 'Témák',
    },
    {
        topics: [
            { title: 'Operating principle', desc: 'How does the spading machine work?' },
            { title: 'Models', desc: '38SX, 38WX, 40SX' },
            { title: 'Guide', desc: 'Which method should I choose?' },
        ],
        badge: 'THE TECHNOLOGY',
        titleA: 'Loosening and inversion,',
        titleB: 'in the right balance',
        subA: 'Imants spading-machine technology',
        subEm: 'preserves the natural layering of the soil',
        subB: ' while breaking up compaction. See how the machine works.',
        topicsLabel: 'Topics',
    },
)

// Phones and tablets get a plain list of the same three destinations instead of the animated folder
const TOPICS: Omit<HeroTopic, 'title' | 'desc'>[] = [
    { id: 'operation', lead: '1' },
    { id: 'models', lead: '2' },
    { id: 'application', lead: '3' },
]

export default function TechHeroSection() {
    const { scrollToSection } = useScrollNav()
    const t = TEXT[useLocale()]
    const topics = TOPICS.map((topic, i) => ({ ...topic, ...t.topics[i] }))
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
                        <PageBadge label={t.badge} />
                        <h1 className={styles.title}>
                            {t.titleA}<br />
                            {t.titleB}
                        </h1>
                        <p className={styles.subTitle}>
                            {t.subA} <em>{t.subEm}</em>{t.subB}
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

                <HeroTopicList topics={topics} onSelect={navigateToSection} label={t.topicsLabel} />
            </div>
        </div>
    )
}
