import { BookPage } from './BookLayout'
import {
    HeroPage,
    MethodologyPage,
} from './pages'
import SzentkiralyCombinedPage from './pages/SzentkiralyCombinedPage'
import KecskemetCombinedPage from './pages/KecskemetCombinedPage'
import LakitelekCombinedPage from './pages/LakitelekCombinedPage'

export const researchPages: BookPage[] = [
    // Hero page
    {
        id: 'hero',
        section: 'Bevezető',
        sectionIndex: 0,
        title: 'Kutatás áttekintés',
        component: <HeroPage />,
    },
    // Methodology page
    {
        id: 'methodology',
        section: 'Módszertan',
        sectionIndex: 1,
        title: 'Penetrométeres mérés',
        component: <MethodologyPage />,
    },
    // Szentkirály pages
    {
        id: 'szentkiraly-info',
        section: 'Szentkirály',
        sectionIndex: 2,
        title: 'Helyszín adatok',
        component: <SzentkiralyCombinedPage />,
        viewGroupId: 'szentkiraly-group',
        scrollToId: 'szentkiraly-info'
    },
    {
        id: 'szentkiraly-timeline',
        section: 'Szentkirály',
        sectionIndex: 2,
        title: 'A talajszerkezet változása',
        component: <SzentkiralyCombinedPage />,
        viewGroupId: 'szentkiraly-group',
        scrollToId: 'szentkiraly-timeline'
    },
    {
        id: 'szentkiraly-temp',
        section: 'Szentkirály',
        sectionIndex: 2,
        title: 'Talajhőmérséklet',
        component: <SzentkiralyCombinedPage />,
        viewGroupId: 'szentkiraly-group',
        scrollToId: 'szentkiraly-temp'
    },
    {
        id: 'szentkiraly-photos',
        section: 'Szentkirály',
        sectionIndex: 2,
        title: 'Fotók',
        component: <SzentkiralyCombinedPage />,
        viewGroupId: 'szentkiraly-group',
        scrollToId: 'szentkiraly-photos'
    },
    // Kecskemét-Borbás pages
    {
        id: 'kecskemet-info',
        section: 'KECSKEMÉT-BORBÁS',
        sectionIndex: 3,
        title: 'Helyszín adatok',
        component: <KecskemetCombinedPage />,
        viewGroupId: 'kecskemet-group',
        scrollToId: 'kecskemet-info'
    },
    {
        id: 'kecskemet-timeline',
        section: 'KECSKEMÉT-BORBÁS',
        sectionIndex: 3,
        title: 'A talajszerkezet változása',
        component: <KecskemetCombinedPage />,
        viewGroupId: 'kecskemet-group',
        scrollToId: 'kecskemet-timeline'
    },
    {
        id: 'kecskemet-photos',
        section: 'KECSKEMÉT-BORBÁS',
        sectionIndex: 3,
        title: 'Fotók',
        component: <KecskemetCombinedPage />,
        viewGroupId: 'kecskemet-group',
        scrollToId: 'kecskemet-photos'
    },
    // Lakitelek pages
    {
        id: 'lakitelek-info',
        section: 'Lakitelek',
        sectionIndex: 4,
        title: 'Helyszín adatok',
        component: <LakitelekCombinedPage />,
        viewGroupId: 'lakitelek-group',
        scrollToId: 'lakitelek-info'
    },
    {
        id: 'lakitelek-chart',
        section: 'Lakitelek',
        sectionIndex: 4,
        title: '7 művelési kombináció eredménye',
        component: <LakitelekCombinedPage />,
        viewGroupId: 'lakitelek-group',
        scrollToId: 'lakitelek-chart'
    },
    {
        id: 'lakitelek-photos',
        section: 'Lakitelek',
        sectionIndex: 4,
        title: 'Fotók',
        component: <LakitelekCombinedPage />,
        viewGroupId: 'lakitelek-group',
        scrollToId: 'lakitelek-photos'
    },
]
