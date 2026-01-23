'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import TechHeroSection from './sections/TechHeroSection'
import OperationSection from './sections/OperationSection'
import ModelsSection from './sections/ModelsSection'
import ApplicationSection from './sections/ApplicationSection'

export default function TechnologyScrollLayout() {
    const sections: ScrollSection[] = useMemo(() => [
        {
            id: 'hero',
            label: 'Bevezető',
            component: <TechHeroSection />,
        },
        {
            id: 'operation',
            label: 'Működési elv',
            component: <OperationSection />,
        },
        {
            id: 'models',
            label: 'Modellek',
            component: <ModelsSection />,
            subsections: [
                { id: 'model-38sx', label: '38SX' },
                { id: 'model-38wx', label: '38WX' },
                { id: 'model-40sx', label: '40SX' },
            ],
        },
        {
            id: 'application',
            label: 'Alkalmazás',
            component: <ApplicationSection />,
            subsections: [
                { id: 'application-guide', label: 'Útmutató' },
            ],
        },
    ], [])

    return <ScrollLayout sections={sections} resetEventName="reset-technology-scroll" />
}
