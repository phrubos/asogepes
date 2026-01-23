'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import ProblemHeroSection from '@/components/problem/sections/ProblemHeroSection'
import CompactionSection from '@/components/problem/sections/CompactionSection'
import CultivatorSection from '@/components/problem/sections/CultivatorSection'
import PloughingSection from '@/components/problem/sections/PloughingSection'

export default function ProblemScrollLayout() {
    const sections: ScrollSection[] = useMemo(() => [
        {
            id: 'hero',
            label: 'Bevezető',
            component: <ProblemHeroSection />,
        },
        {
            id: 'compaction',
            label: 'Öntözés és\nTömörödés',
            component: <CompactionSection />,
        },
        {
            id: 'cultivator',
            label: 'Kultivátor\nkorlátai',
            component: <CultivatorSection />,
            subsections: [
                { id: 'cultivator-problems', label: 'Problémák' },
                { id: 'cultivator-comparison', label: 'Kultivátorozott vs. ásógépezett talaj' },
            ],
        },
        {
            id: 'ploughing',
            label: 'Szántás\nkorlátai',
            component: <PloughingSection />,
            subsections: [
                { id: 'ploughing-effects', label: 'Hatások' },
                { id: 'ploughing-structure', label: 'Szántott vs. ásógépezett talaj' },
            ],
        },
    ], [])

    return <ScrollLayout sections={sections} resetEventName="reset-problem-scroll" />
}
