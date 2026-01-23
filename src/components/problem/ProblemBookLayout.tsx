'use client'

import { useMemo } from 'react'
import BookLayout, { BookPage } from '@/components/experiment/BookLayout/BookLayout'
import ProblemHeroPage from '@/components/problem/pages/ProblemHeroPage'

// Compaction Pages
import CompactionCombinedPage from '@/components/problem/pages/CompactionCombinedPage'

// Cultivator Pages

import CultivatorCombinedPage from '@/components/problem/pages/CultivatorCombinedPage'

// Ploughing Pages

import PloughingCombinedPage from '@/components/problem/pages/PloughingCombinedPage'

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

        // 01. Öntözés és Tömörödés - COMBINED VIEW
        {
            id: 'compaction-stats',
            section: 'Öntözés és Tömörödés',
            sectionIndex: 1,
            title: 'Tömörödés hatásai',
            component: <PageContent><CompactionCombinedPage /></PageContent>,
            viewGroupId: 'compaction-group',
            scrollToId: 'compaction-stats'
        },


        // 02. Kultivátor - COMBINED VIEW
        {
            id: 'cultivator-problems',
            section: 'Kultivátor korlátai',
            sectionIndex: 2,
            title: 'Problémák',
            component: <PageContent><CultivatorCombinedPage /></PageContent>,
            viewGroupId: 'cultivator-group',
            scrollToId: 'cultivator-problems'
        },
        {
            id: 'cultivator-comparison',
            section: 'Kultivátor korlátai',
            sectionIndex: 2,
            title: 'Kultivátorozott vs. ásógépezett talaj',
            component: <PageContent><CultivatorCombinedPage /></PageContent>,
            viewGroupId: 'cultivator-group',
            scrollToId: 'cultivator-comparison'
        },

        // 03. Szántás - COMBINED VIEW
        {
            id: 'ploughing-effects',
            section: 'Szántás\nkorlátai',
            sectionIndex: 3,
            title: 'Hatások',
            component: <PageContent><PloughingCombinedPage /></PageContent>,
            viewGroupId: 'ploughing-group',
            scrollToId: 'ploughing-effects'
        },
        {
            id: 'ploughing-structure',
            section: 'Szántás\nkorlátai',
            sectionIndex: 3,
            title: 'Szántott vs. ásógépezett talaj',
            component: <PageContent><PloughingCombinedPage /></PageContent>,
            viewGroupId: 'ploughing-group',
            scrollToId: 'ploughing-structure'
        },
    ], [])

    return <BookLayout pages={pages} resetEventName="reset-problem-book" />
}
