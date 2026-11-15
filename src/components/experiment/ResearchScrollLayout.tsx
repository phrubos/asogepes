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
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual, pagePath } from '@/lib/i18n/config'

const TEXT = bilingual(
    {
        intro: 'Bevezető',
        summary: 'Fő eredmények',
        methodology: 'Módszertan',
        penetrometer: 'Penetrométer',
        measured: 'Mért jellemzők',
        bulk: 'Térfogattömeg mérése',
        lifeMethod: 'Talajélet mérése',
        site: 'Helyszín adatok',
        structure: 'A talajszerkezet változása',
        temp: 'Talajhőmérséklet',
        growth: 'Fejlődés (2026)',
        tomato: 'Paradicsomtábla (2026)',
        further: 'További mérések (2026)',
        photos: 'Egyéb fotók',
        seven: '7 művelési kombináció eredménye',
        life: 'Talajélet (2025–2026)',
        nextKicker: 'Tovább: Technológia',
        nextTitle: 'Melyik módszert válasszam?',
        nextText: 'Az alkalmazási útmutató a talaj állapota és a kultúra szerint ajánl gépet és művelési sort.',
    },
    {
        intro: 'Introduction',
        summary: 'Key results',
        methodology: 'Methodology',
        penetrometer: 'Penetrometer',
        measured: 'Measured properties',
        bulk: 'Measuring bulk density',
        lifeMethod: 'Measuring soil life',
        site: 'Site details',
        structure: 'Change in soil structure',
        temp: 'Soil temperature',
        growth: 'Plant growth (2026)',
        tomato: 'Tomato field (2026)',
        further: 'Further measurements (2026)',
        photos: 'More photos',
        seven: 'Results of 7 tillage combinations',
        life: 'Soil life (2025–2026)',
        nextKicker: 'Next: Technology',
        nextTitle: 'Which method should I choose?',
        nextText: 'The application guide recommends a machine and a tillage sequence for the condition of the soil and the crop.',
    },
)

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
    const locale = useLocale()
    const t = TEXT[locale]
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
            label: t.intro,
            component: <ResearchHeroSection />,
        },
        // Main results right after the hero (mobile UX review 11-09, K1): on a phone the summary used to
        // start on screen 24. The id stays 'osszegzes' so old ?section= links still land here.
        {
            id: 'osszegzes',
            label: t.summary,
            component: <SummarySection />,
        },
        {
            id: 'methodology',
            label: t.methodology,
            component: <MethodologySection />,
            subsections: [
                { id: 'methodology-penetrometer', label: t.penetrometer },
                { id: 'methodology-meresek', label: t.measured },
                { id: 'methodology-terfogattomeg', label: t.bulk },
                { id: 'methodology-talajelet', label: t.lifeMethod },
            ],
        },
        {
            id: 'szentkiraly',
            label: 'Szentkirály',
            component: <SzentkiralyCombinedPage />,
            ...site('szentkiraly', [
                { id: 'szentkiraly-info', label: t.site },
                { id: 'szentkiraly-timeline', label: t.structure, split: true },
                { id: 'szentkiraly-temp', label: t.temp, split: true },
                { id: 'szentkiraly-fejlodes', label: t.growth, years: [2026] },
                { id: 'szentkiraly-paradicsom', label: t.tomato, years: [2026] },
                { id: 'szentkiraly-meresek', label: t.further, years: [2026] },
                { id: 'szentkiraly-photos', label: t.photos, years: [2025] },
            ]),
        },
        {
            id: 'kecskemet',
            label: 'Kecskemét-\nBorbás',
            component: <KecskemetCombinedPage />,
            ...site('kecskemet', [
                { id: 'kecskemet-info', label: t.site },
                { id: 'kecskemet-timeline', label: t.structure },
                { id: 'kecskemet-photos', label: t.photos },
            ]),
        },
        {
            id: 'lakitelek',
            label: 'Lakitelek',
            component: <LakitelekCombinedPage />,
            ...site('lakitelek', [
                { id: 'lakitelek-info', label: t.site },
                { id: 'lakitelek-chart', label: t.seven, split: true },
                { id: 'lakitelek-talajelet', label: t.life },
                { id: 'lakitelek-meresek', label: t.further, years: [2026] },
                { id: 'lakitelek-photos', label: t.photos, split: true },
            ]),
        },
        ]
    }, [selected, toggle, t])

    return (
        <SeasonProvider years={SEASON_YEARS}>
            <ScrollLayout
                sections={sections}
                resetEventName="reset-research-scroll"
                end={
                    <PageEnd
                        next={{
                            href: pagePath('technology', locale, 'application-guide'),
                            kicker: t.nextKicker,
                            title: t.nextTitle,
                            text: t.nextText,
                        }}
                    />
                }
            />
        </SeasonProvider>
    )
}
