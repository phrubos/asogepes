'use client'

import { useMemo } from 'react'
import BookLayout, { BookPage } from '@/components/experiment/BookLayout/BookLayout'
import ProblemHeroPage from '@/components/problem/pages/ProblemHeroPage'

// Compaction Pages
import CompactionStatsPage from '@/components/problem/pages/CompactionStatsPage'
import CompactionInteractivePage from '@/components/problem/pages/CompactionInteractivePage'

// Cultivator Pages
import CultivatorProblemsPage from '@/components/problem/pages/CultivatorProblemsPage'
import CultivatorComparisonPage from '@/components/problem/pages/CultivatorComparisonPage'

// Ploughing Pages
import PloughingEffectsPage from '@/components/problem/pages/PloughingEffectsPage'
import PloughingStructurePage from '@/components/problem/pages/PloughingStructurePage'

import styles from './ProblemNew.module.css'

// Wrapper to ensure content fits nicely in the book page
const PageContent = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.contentWrapper} style={{ marginTop: 0, minHeight: '100%' }}>
        {children}
    </div>
)

export default function ProblemBookLayout() {
    const pages: BookPage[] = useMemo(() => [
        {
            id: 'hero',
            section: 'Bevezető',
            sectionIndex: 0,
            title: 'Probléma áttekintés',
            component: <ProblemHeroPage />,
        },

        // 01. Öntözés és Tömörödés
        {
            id: 'compaction-stats',
            section: 'Öntözés és Tömörödés',
            sectionIndex: 1,
            title: 'Tömörödés hatásai',
            component: <PageContent><CompactionStatsPage /></PageContent>,
        },
        {
            id: 'compaction-interactive',
            section: 'Öntözés és Tömörödés',
            sectionIndex: 1,
            title: 'Talajszerkezet',
            component: <PageContent><CompactionInteractivePage /></PageContent>,
        },

        // 02. Kultivátor
        {
            id: 'cultivator-problems',
            section: 'Kultivátor korlátai',
            sectionIndex: 2,
            title: 'Problémák',
            component: <PageContent><CultivatorProblemsPage /></PageContent>,
        },
        {
            id: 'cultivator-comparison',
            section: 'Kultivátor korlátai',
            sectionIndex: 2,
            title: 'Összehasonlítás',
            component: <PageContent><CultivatorComparisonPage /></PageContent>,
        },

        // 03. Szántás
        {
            id: 'ploughing-effects',
            section: 'Szántás\nkorlátai',
            sectionIndex: 3,
            title: 'Hatások',
            component: <PageContent><PloughingEffectsPage /></PageContent>,
        },
        {
            id: 'ploughing-structure',
            section: 'Szántás\nkorlátai',
            sectionIndex: 3,
            title: 'Szántott vs. ásógépezett talaj',
            component: <PageContent><PloughingStructurePage /></PageContent>,
        },
    ], [])

    return <BookLayout pages={pages} />
}
