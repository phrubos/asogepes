'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import PageEnd from '@/components/shared/PageEnd/PageEnd'
import { RESEARCH_SITES, RESEARCH_YEARS } from '@/lib/seasons'
import TechHeroSection from './sections/TechHeroSection'
import OperationSection from './sections/OperationSection'
import ModelsSection from './sections/ModelsSection'
import ApplicationSection from './sections/ApplicationSection'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual, pagePath } from '@/lib/i18n/config'

const TEXT = bilingual(
    {
        intro: 'Bevezető',
        operation: 'Működési elv',
        models: 'Modellek',
        application: 'Alkalmazás',
        guide: 'Útmutató',
        nextKicker: 'Tovább: Kutatás',
        nextTitle: 'Mit mértünk a táblákon?',
        nextText: `${RESEARCH_SITES.length} helyszín, ${RESEARCH_YEARS.length} tenyészidő: a talaj szerkezete, hőmérséklete és a növények fejlődése ásógépes és hagyományos művelés után.`,
    },
    {
        intro: 'Introduction',
        operation: 'Operating principle',
        models: 'Models',
        application: 'Application',
        guide: 'Guide',
        nextKicker: 'Next: Research',
        nextTitle: 'What did we measure in the fields?',
        nextText: `${RESEARCH_SITES.length} sites, ${RESEARCH_YEARS.length} growing seasons: soil structure, soil temperature and crop growth after spading-machine and conventional tillage.`,
    },
)

export default function TechnologyScrollLayout() {
    const locale = useLocale()
    const t = TEXT[locale]
    const sections: ScrollSection[] = useMemo(() => [
        {
            id: 'hero',
            label: t.intro,
            component: <TechHeroSection />,
        },
        {
            id: 'operation',
            label: t.operation,
            component: <OperationSection />,
        },
        {
            id: 'models',
            label: t.models,
            component: <ModelsSection />,
            subsections: [
                { id: 'model-38sx', label: '38SX' },
                { id: 'model-38wx', label: '38WX' },
                { id: 'model-40sx', label: '40SX' },
            ],
        },
        {
            id: 'application',
            label: t.application,
            component: <ApplicationSection />,
            subsections: [
                { id: 'application-guide', label: t.guide },
            ],
        },
    ], [t])

    return (
        <ScrollLayout
            sections={sections}
            resetEventName="reset-technology-scroll"
            end={
                <PageEnd
                    next={{
                        href: pagePath('research', locale),
                        kicker: t.nextKicker,
                        title: t.nextTitle,
                        text: t.nextText,
                    }}
                />
            }
        />
    )
}
