'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import ResearchHeroSection from './sections/ResearchHeroSection'
import MethodologySection from './sections/MethodologySection'
import SzentkiralyCombinedPage from './pages/SzentkiralyCombinedPage'
import KecskemetCombinedPage from './pages/KecskemetCombinedPage'
import LakitelekCombinedPage from './pages/LakitelekCombinedPage'
import { SeasonProvider } from './season/SeasonContext'
import SummarySection from './sections/SummarySection'
import PageEnd from '@/components/shared/PageEnd/PageEnd'
import { SEASON_YEARS } from '@/lib/seasons'

export default function ResearchScrollLayout() {
    const sections: ScrollSection[] = useMemo(() => [
        {
            id: 'hero',
            label: 'Bevezető',
            component: <ResearchHeroSection />,
        },
        // Main results right after the hero (mobile UX review 11-09, K1): on a phone the summary used to
        // start on screen 24. The id stays 'osszegzes' so old ?section= links still land here.
        {
            id: 'osszegzes',
            label: 'Fő eredmények',
            component: <SummarySection />,
        },
        {
            id: 'methodology',
            label: 'Módszertan',
            component: <MethodologySection />,
            subsections: [
                { id: 'methodology-penetrometer', label: 'Penetrométer' },
                { id: 'methodology-meresek', label: 'Mért jellemzők' },
                { id: 'methodology-terfogattomeg', label: 'Térfogattömeg mérése' },
                { id: 'methodology-talajelet', label: 'Talajélet mérése' },
            ],
        },
        {
            id: 'szentkiraly',
            label: 'Szentkirály',
            component: <SzentkiralyCombinedPage />,
            subsections: [
                { id: 'szentkiraly-info', label: 'Helyszín adatok' },
                { id: 'szentkiraly-timeline', label: 'A talajszerkezet változása' },
                { id: 'szentkiraly-temp', label: 'Talajhőmérséklet' },
                { id: 'szentkiraly-fejlodes', label: 'Fejlődés (2026)' },
                { id: 'szentkiraly-paradicsom', label: 'Paradicsomtábla (2026)' },
                { id: 'szentkiraly-meresek', label: 'További mérések (2026)' },
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
                { id: 'lakitelek-talajelet', label: 'Talajélet (2025–2026)' },
                { id: 'lakitelek-meresek', label: 'További mérések (2026)' },
                { id: 'lakitelek-photos', label: 'Fotók' },
            ],
        },
    ], [])

    return (
        <SeasonProvider years={SEASON_YEARS}>
            <ScrollLayout
                sections={sections}
                resetEventName="reset-research-scroll"
                end={
                    <PageEnd
                        next={{
                            href: '/technologia?section=application-guide',
                            kicker: 'Tovább: Technológia',
                            title: 'Melyik módszert válasszam?',
                            text: 'Az alkalmazási útmutató a talaj állapota és a kultúra szerint ajánl gépet és művelési sort.',
                        }}
                    />
                }
            />
        </SeasonProvider>
    )
}
