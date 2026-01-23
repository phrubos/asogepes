'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import ResearchHeroSection from './sections/ResearchHeroSection'
import MethodologySection from './sections/MethodologySection'
import SzentkiralyCombinedPage from './pages/SzentkiralyCombinedPage'
import KecskemetCombinedPage from './pages/KecskemetCombinedPage'
import LakitelekCombinedPage from './pages/LakitelekCombinedPage'

export default function ResearchScrollLayout() {
    const sections: ScrollSection[] = useMemo(() => [
        {
            id: 'hero',
            label: 'Bevezető',
            component: <ResearchHeroSection />,
        },
        {
            id: 'methodology',
            label: 'Módszertan',
            component: <MethodologySection />,
        },
        {
            id: 'szentkiraly',
            label: 'Szentkirály',
            component: <SzentkiralyCombinedPage />,
            subsections: [
                { id: 'szentkiraly-info', label: 'Helyszín adatok' },
                { id: 'szentkiraly-timeline', label: 'A talajszerkezet változása' },
                { id: 'szentkiraly-temp', label: 'Talajhőmérséklet' },
                { id: 'szentkiraly-photos', label: 'Fotók' },
            ],
        },
        {
            id: 'kecskemet',
            label: 'Kecskemét-\nBorbás',
            component: <KecskemetCombinedPage />,
            subsections: [
                { id: 'kecskemet-info', label: 'Helyszín adatok' },
                { id: 'kecskemet-timeline', label: 'A talajszerkezet változása' },
                { id: 'kecskemet-photos', label: 'Fotók' },
            ],
        },
        {
            id: 'lakitelek',
            label: 'Lakitelek',
            component: <LakitelekCombinedPage />,
            subsections: [
                { id: 'lakitelek-info', label: 'Helyszín adatok' },
                { id: 'lakitelek-chart', label: '7 művelési kombináció eredménye' },
                { id: 'lakitelek-photos', label: 'Fotók' },
            ],
        },
    ], [])

    return <ScrollLayout sections={sections} resetEventName="reset-research-scroll" />
}
