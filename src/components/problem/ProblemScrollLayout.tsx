'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import ProblemHeroSection from '@/components/problem/sections/ProblemHeroSection'
import CompactionSection from '@/components/problem/sections/CompactionSection'
import CultivatorSection from '@/components/problem/sections/CultivatorSection'
import PloughingSection from '@/components/problem/sections/PloughingSection'
import PageEnd from '@/components/shared/PageEnd/PageEnd'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual, pagePath } from '@/lib/i18n/config'

const TEXT = bilingual(
    {
        intro: 'Bevezető',
        compaction: 'Öntözés és\ntömörödés',
        cultivator: 'Kultivátor\nkorlátai',
        cultivatorProblems: 'Problémák',
        cultivatorComparison: 'Kultivátorozott vs. ásógépezett talaj',
        ploughing: 'Szántás\nkorlátai',
        ploughingEffects: 'Hatások',
        ploughingStructure: 'Szántott vs. ásógépezett talaj',
        nextKicker: 'Tovább: a megoldás',
        nextTitle: 'Ásógépes technológia',
        nextText: 'Hogyan lazít és forgat egyszerre az ásógép, tömörítés nélkül, és melyik modell mire való.',
    },
    {
        intro: 'Introduction',
        compaction: 'Irrigation and\ncompaction',
        cultivator: 'Limits of the\ncultivator',
        cultivatorProblems: 'Problems',
        cultivatorComparison: 'Cultivator-tilled vs. spaded soil',
        ploughing: 'Limits of\nploughing',
        ploughingEffects: 'Effects',
        ploughingStructure: 'Ploughed vs. spaded soil',
        nextKicker: 'Next: the solution',
        nextTitle: 'Spading-machine technology',
        nextText: 'How the spading machine loosens and turns the soil in one pass without compacting it, and which model suits which job.',
    },
)

export default function ProblemScrollLayout() {
    const locale = useLocale()
    const t = TEXT[locale]
    const sections: ScrollSection[] = useMemo(() => [
        {
            id: 'hero',
            label: t.intro,
            component: <ProblemHeroSection />,
        },
        {
            id: 'compaction',
            label: t.compaction,
            component: <CompactionSection />,
        },
        {
            id: 'cultivator',
            label: t.cultivator,
            component: <CultivatorSection />,
            subsections: [
                { id: 'cultivator-problems', label: t.cultivatorProblems },
                { id: 'cultivator-comparison', label: t.cultivatorComparison },
            ],
        },
        {
            id: 'ploughing',
            label: t.ploughing,
            component: <PloughingSection />,
            subsections: [
                { id: 'ploughing-effects', label: t.ploughingEffects },
                { id: 'ploughing-structure', label: t.ploughingStructure },
            ],
        },
    ], [t])

    return (
        <ScrollLayout
            sections={sections}
            resetEventName="reset-problem-scroll"
            end={
                <PageEnd
                    next={{
                        href: pagePath('technology', locale),
                        kicker: t.nextKicker,
                        title: t.nextTitle,
                        text: t.nextText,
                    }}
                />
            }
        />
    )
}
