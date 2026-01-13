'use client'

import { useMemo } from 'react'
import BookLayout, { BookPage } from '@/components/experiment/BookLayout/BookLayout' // Using the shared BookLayout
import HeroPage from './pages/HeroPage'
import OperationPrinciplePage from './pages/OperationPrinciplePage'
import ModelsCombinedPage from './pages/ModelsCombinedPage'
import ApplicationGuidePage from './pages/ApplicationGuidePage'

export default function TechnologyLayout() {
    const pages: BookPage[] = useMemo(() => [
        {
            id: 'hero',
            section: 'Bevezető',
            sectionIndex: 0,
            title: 'Technológia',
            component: <HeroPage />,
        },
        {
            id: 'operation-principle',
            section: 'Működési elv',
            sectionIndex: 1,
            title: 'Hogyan működik?',
            component: <OperationPrinciplePage />,
        },
        {
            id: 'models-38sx',
            section: 'Modellek',
            sectionIndex: 2,
            title: '38SX',
            component: <ModelsCombinedPage />,
            scrollToId: 'model-38sx',
            viewGroupId: 'models-group'
        },
        {
            id: 'models-38wx',
            section: 'Modellek',
            sectionIndex: 2,
            title: '38WX',
            component: <ModelsCombinedPage />,
            scrollToId: 'model-38wx',
            viewGroupId: 'models-group'
        },
        {
            id: 'models-40sx',
            section: 'Modellek',
            sectionIndex: 2,
            title: '40SX',
            component: <ModelsCombinedPage />,
            scrollToId: 'model-40sx',
            viewGroupId: 'models-group'
        },
        {
            id: 'application-guide',
            section: 'Alkalmazás',
            sectionIndex: 3,
            title: 'Útmutató',
            component: <ApplicationGuidePage />,
        },
    ], [])

    return <BookLayout pages={pages} resetEventName="reset-technology-book" />
}
