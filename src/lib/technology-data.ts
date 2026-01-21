export type ModelId = '38sx' | '38wx' | '40sx'

export interface FieldData {
    location: string
    model: string
    meta: {
        crop: string
        soil: string
        irrigation: string
        period: string
    }
    spadeTreatments: string[]
    controlTreatments: string[]
    chartData: { month: string; spade: number; control: number }[]
    highlight: string
}

export const fieldData: Record<ModelId, FieldData> = {
    '38sx': {
        location: 'Lakitelek',
        model: '38SX Nagy szériás',
        meta: {
            crop: 'Ipari paradicsom',
            soil: 'Humuszos homok (KA: 27)',
            irrigation: '450 mm',
            period: 'Május – Augusztus'
        },
        spadeTreatments: [
            'Ásógép (30 cm) önállóan',
            'Szántás + Ásógép (25 cm)'
        ],
        controlTreatments: [
            'Szántás + Kombinátor',
            'Hagyományos művelés'
        ],
        chartData: [
            { month: 'Május', spade: 22, control: 28 },
            { month: 'Augusztus', spade: 20, control: 32 }
        ],
        highlight: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
    },
    '38wx': {
        location: 'Szentkirály',
        model: '38WX Lazítókéses',
        meta: {
            crop: 'Vöröshagyma',
            soil: 'Réti csernozjom (KA: 28,5)',
            irrigation: '350 mm',
            period: 'Március – Június'
        },
        spadeTreatments: [
            'Őszi nehézkultivátor',
            'Tavaszi nehézkultivátor',
            '38WX ásógép (30 cm + 55 cm lazítókés)'
        ],
        controlTreatments: [
            'Őszi nehézkultivátor',
            'Tavaszi nehézkultivátor',
            'Kombinátor'
        ],
        chartData: [
            { month: 'Március', spade: 35, control: 8 },
            { month: 'Április', spade: 30, control: 25 },
            { month: 'Május', spade: 22, control: 23 },
            { month: 'Június', spade: 17, control: 5 }
        ],
        highlight: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.'
    },
    '40sx': {
        location: 'Kecskemét-Borbás',
        model: '40SX Mélyásógép',
        meta: {
            crop: 'Ipari paradicsom',
            soil: 'Réti csernozjom (KA: 28)',
            irrigation: '400 mm',
            period: 'Május – Június'
        },
        spadeTreatments: [
            'Őszi szántás (28 cm)',
            'Simítózás',
            'Ásóborona',
            '40SX mélyásógép (45 cm)'
        ],
        controlTreatments: [
            'Őszi szántás (28 cm)',
            'Simítózás',
            'Ásóborona'
        ],
        chartData: [
            { month: 'Május', spade: 40, control: 35 },
            { month: 'Június', spade: 37, control: 27 }
        ],
        highlight: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.'
    }
}

export interface ModelData {
    id: ModelId
    name: string
    type: string
    tag: string
    color: string
    image: string
}

export const modelData: ModelData[] = [
    { id: '38sx', name: '38SX', type: 'Nagy szériás', tag: 'Standard', color: 'brown', image: '/images/38SX_new.jpeg' },
    { id: '38wx', name: '38WX', type: 'Lazítókéses', tag: 'Hybrid', color: 'green', image: '/images/38WX_new.jpeg' },
    { id: '40sx', name: '40SX', type: 'Mélyásógép', tag: 'Deep', color: 'blue', image: '/images/40SX_new.jpeg' },
]
