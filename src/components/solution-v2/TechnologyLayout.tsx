'use client'

import { useMemo } from 'react'
import BookLayout, { BookPage } from '@/components/experiment/BookLayout/BookLayout' // Using the shared BookLayout
import HeroPage from './pages/HeroPage'
import OperationPrinciplePage from './pages/OperationPrinciplePage'
import ModelPage from './pages/ModelPage'
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
            title: '38SX Széria',
            component: <ModelPage modelId="38sx" />,
        },
        {
            id: 'models-38wx',
            section: 'Modellek',
            sectionIndex: 2,
            title: '38WX Széria',
            component: <ModelPage modelId="38wx" />,
        },
        {
            id: 'models-40sx',
            section: 'Modellek',
            sectionIndex: 2,
            title: '40SX Széria',
            component: <ModelPage modelId="40sx" />,
        },
        {
            id: 'application-guide',
            section: 'Alkalmazás',
            sectionIndex: 3,
            title: 'Útmutató',
            component: <ApplicationGuidePage />,
        },
    ], [])

    return <BookLayout pages={pages} />
}
