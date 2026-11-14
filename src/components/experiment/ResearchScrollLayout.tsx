'use client'

import { useMemo } from 'react'
import { ScrollLayout, ScrollSection } from '@/components/shared/ScrollLayout'
import ResearchHeroSection from './sections/ResearchHeroSection'
import MethodologySection from './sections/MethodologySection'
import SzentkiralyCombinedPage from './pages/SzentkiralyCombinedPage'
import KecskemetCombinedPage from './pages/KecskemetCombinedPage'
import LakitelekCombinedPage from './pages/LakitelekCombinedPage'
import { SeasonProvider } from './season/SeasonContext'
import { YearFilterProvider, useYearFilter, type SiteId } from './season/YearFilter'
import SummarySection from './sections/SummarySection'
import PageEnd from '@/components/shared/PageEnd/PageEnd'
import { SEASON_YEARS } from '@/lib/seasons'

/** The years measured at each site (ticket 015: the 25 / 26 chips beside the site in the rail) */
const SITE_YEARS: Record<SiteId, number[]> = { szentkiraly: [2025, 2026], kecskemet: [2025], lakitelek: [2025, 2026] }

export default function ResearchScrollLayout() {
    return (
        <YearFilterProvider all={SITE_YEARS}>
            <ResearchSections />
        </YearFilterProvider>
    )
}

/** Subsections carry the years they have; a site's rail entry lists only those of its chosen years */
type Sub = {
    id: string
    label: string
    years?: number[]
    /** shown once per chosen year (must match the SiteBlocks blocks without `once`) */
    split?: boolean
}

function ResearchSections() {
    const { selected, toggle } = useYearFilter()
    const sections: ScrollSection[] = useMemo(() => {
        const site = (id: SiteId, subs: Sub[]) => ({
            years: SITE_YEARS[id],
            chosenYears: selected[id],
            onToggleYear: (y: number) => toggle(id, y),
            subsections: subs
                .filter((s) => !s.years || s.years.some((y) => selected[id].includes(y)))
                .map((s) => {
                    const { id: sid, label } = s
                    const parts = s.split ? (s.years ?? SITE_YEARS[id]).filter((y) => selected[id].includes(y)).sort() : []
                    return parts.length > 1 ? { id: sid, label, parts: parts.map((y) => ({ id: `${sid}-${y}`, label: String(y) })) } : { id: sid, label }
                }),
        })
        return [
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
            ...site('szentkiraly', [
                { id: 'szentkiraly-info', label: 'Helyszín adatok' },
                { id: 'szentkiraly-timeline', label: 'A talajszerkezet változása', split: true },
                { id: 'szentkiraly-temp', label: 'Talajhőmérséklet', split: true },
                { id: 'szentkiraly-fejlodes', label: 'Fejlődés (2026)', years: [2026] },
                { id: 'szentkiraly-paradicsom', label: 'Paradicsomtábla (2026)', years: [2026] },
                { id: 'szentkiraly-meresek', label: 'További mérések (2026)', years: [2026] },
                { id: 'szentkiraly-photos', label: 'Egyéb fotók', years: [2025] },
            ]),
        },
        {
            id: 'kecskemet',
            label: 'Kecskemét-\nBorbás',
            component: <KecskemetCombinedPage />,
            ...site('kecskemet', [
                { id: 'kecskemet-info', label: 'Helyszín adatok' },
                { id: 'kecskemet-timeline', label: 'A talajszerkezet változása' },
                { id: 'kecskemet-photos', label: 'Egyéb fotók' },
            ]),
        },
        {
            id: 'lakitelek',
            label: 'Lakitelek',
            component: <LakitelekCombinedPage />,
            ...site('lakitelek', [
                { id: 'lakitelek-info', label: 'Helyszín adatok' },
                { id: 'lakitelek-chart', label: '7 művelési kombináció eredménye', split: true },
                { id: 'lakitelek-talajelet', label: 'Talajélet (2025–2026)' },
                { id: 'lakitelek-meresek', label: 'További mérések (2026)', years: [2026] },
                { id: 'lakitelek-photos', label: 'Egyéb fotók', split: true },
            ]),
        },
        ]
    }, [selected, toggle])

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
