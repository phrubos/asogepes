'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import PageEnd from '@/components/shared/PageEnd/PageEnd'
import { RESEARCH_SITES, RESEARCH_YEARS } from '@/lib/seasons'
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

    return (
        <ScrollLayout
            sections={sections}
            resetEventName="reset-technology-scroll"
            end={
                <PageEnd
                    next={{
                        href: '/kutatas',
                        kicker: 'Tovább: Kutatás',
                        title: 'Mit mértünk a táblákon?',
                        text: `${RESEARCH_SITES.length} helyszín, ${RESEARCH_YEARS.length} tenyészidő: a talaj szerkezete, hőmérséklete és a növények fejlődése ásógépes és hagyományos művelés után.`,
                    }}
                />
            }
        />
    )
}
