// Seasons (évadok) of the field experiments. One record per site and year: adding a new year
// means adding a record here, not redesigning a page. Source of the 2026 values: Drive
// "Ásógép-2026" spreadsheets (see docs/2026-11-02-tobbeves-adatok-es-design-rendszer.md);
// the 2025 values come from `locations` in data.ts.

import { locations } from './data'

/** Third of the month a measurement fell in; unknown for 2025 (only the month is recorded). */
export type MonthThird = 'eleje' | 'közepe' | 'vége'

export interface MeasureDate {
  /** Short month label, e.g. 'MÁRC.' */
  month: string
  third?: MonthThird
}

export type TreatmentRole = 'control' | 'spade'

export interface Treatment {
  id: string
  /** Name in legends and cards */
  label: string
  /** Name under a bar when there is room (two treatments) */
  short: string
  role: TreatmentRole
  /** + mélyásógép: drawn with stripes */
  deep?: boolean
  /** Small marker shown next to the value, e.g. 'n=1' */
  flag?: string
  /** Tillage steps; the ones with ásógép are emphasised */
  steps: string[]
}

export interface EvaluationCard {
  treatmentId: string
  title: string
  text: string
}

export interface TemperaturePoint {
  when: MeasureDate
  control: number
  spade: number
}

export interface SeasonInfo {
  crop: string
  soil: string
  ka: string
  irrigation: string
  period: string
  measurements: string
  /** Shared tillage of every plot before the treatments differ */
  base?: string
  /** Note under the treatments, e.g. how many plots / points */
  treatmentNote?: string
}

export interface Season {
  year: number
  info: SeasonInfo
  treatments: Treatment[]
  looseLayer: {
    title: string
    dates: MeasureDate[]
    /** cm, per treatment id, one value per date */
    values: Record<string, number[]>
    cards: EvaluationCard[]
    summary: string
  }
  /** The value that is comparable across years: loose layer at the end of the season (cm) */
  seasonEnd: { when: MeasureDate; control: number; spade: number }
  temperature: {
    title: string
    depths: { label: string; points: TemperaturePoint[] }[]
    /** Plain text; [[...]] marks the emphasised part */
    explanation: string
  }
}

export interface SiteSeasons {
  /** Vertical scale of the loose-layer chart, the same in every year */
  looseLayerMax: number
  seasons: Season[]
}

const szk = locations.szentkiraly

export const szentkiralySeasons: SiteSeasons = {
  looseLayerMax: 50,
  seasons: [
    {
      year: 2025,
      info: {
        crop: szk.crop,
        soil: szk.soil,
        ka: szk.ka,
        irrigation: szk.irrigation,
        period: szk.period,
        measurements: szk.measurements,
      },
      treatments: [
        { id: 'K', label: 'Kontroll', short: 'Kontroll', role: 'control', steps: szk.control.treatments },
        { id: 'A', label: 'Ásógépezett', short: 'Ásógép', role: 'spade', steps: szk.spade.treatments },
      ],
      looseLayer: {
        title: `A laza talajréteg mélységének változása ${szk.chartData.length} hónap alatt`,
        dates: [{ month: 'MÁRC.' }, { month: 'ÁPR.' }, { month: 'MÁJ.' }, { month: 'JÚN.' }],
        values: {
          K: szk.chartData.map((d) => d.control),
          A: szk.chartData.map((d) => d.spade),
        },
        cards: [
          { treatmentId: 'K', title: 'Kontroll művelés', text: szk.evaluations.control },
          { treatmentId: 'A', title: 'Ásógépes művelés', text: szk.evaluations.spade },
        ],
        summary: szk.evaluations.summary,
      },
      seasonEnd: { when: { month: 'JÚN.' }, control: 6, spade: 11 },
      temperature: {
        title: 'A talajhőmérséklet a vöröshagyma csírázásakor',
        depths: [
          { label: '1 cm', points: [{ when: { month: 'MÁRC.' }, ...szk.temperatureData.depth1cm }] },
          { label: '5 cm', points: [{ when: { month: 'MÁRC.' }, ...szk.temperatureData.depth5cm }] },
        ],
        explanation:
          'A vetés után, a csírázás időszakában a talajhőmérsékletnek nagy jelentősége van. Márciusban, a kora tavaszi felmelegedés idején, dél körüli időben mértük a csírázó hagyma talajának felszínközeli hőmérsékletét. A lazább szerkezetű, ásógépezett talaj [[+3-5°C-kal magasabb]] hőmérsékletű. Ez jelentősen felgyorsítja a növények kezdeti növekedését.',
      },
    },
    {
      year: 2026,
      info: {
        crop: 'Vöröshagyma (tavaszi)',
        soil: 'Réti csernozjom',
        ka: '28',
        irrigation: szk.irrigation,
        period: 'Március – Július',
        measurements: '4 alkalom, 10 mérési pont',
        base: '2025. ősz: kultivátor, majd ásógép az egész táblán',
        treatmentNote: 'A négy kezelés csak a 2026. februári munkában tér el.',
      },
      treatments: [
        { id: 'K', label: 'Kontroll', short: 'Kontroll', role: 'control', steps: ['Kultivátor'] },
        { id: 'A', label: 'Ásógép', short: 'Ásógép', role: 'spade', steps: ['Ásógép'] },
        { id: 'Km', label: 'Kontroll + mélyásógép', short: 'K + mély', role: 'control', deep: true, flag: 'n=1', steps: ['Kultivátor', 'Mélyásógép'] },
        { id: 'Am', label: 'Ásógép + mélyásógép', short: 'Á + mély', role: 'spade', deep: true, steps: ['Ásógép', 'Mélyásógép'] },
      ],
      looseLayer: {
        title: 'A laza talajréteg mélysége, 4 mérés, 4 kezelés',
        dates: [
          { month: 'MÁRC.', third: 'eleje' },
          { month: 'ÁPR.', third: 'közepe' },
          { month: 'MÁJ.', third: 'közepe' },
          { month: 'JÚN.', third: 'vége' },
        ],
        values: {
          K: [28.0, 37.0, 35.7, 7.0],
          A: [33.5, 39.2, 38.8, 17.6],
          Km: [45.0, 39.3, 38.3, 32.0],
          Am: [43.0, 44.3, 43.7, 26.0],
        },
        cards: [
          { treatmentId: 'K', title: 'Kontroll (februári kultivátor)', text: 'Tavasszal 28–37 cm-ig laza, június végére már 7 cm-től tömör.' },
          { treatmentId: 'A', title: 'Ásógép (február)', text: 'Június végén is 17,6 cm-ig laza: két és félszer mélyebben, mint a kontroll.' },
          { treatmentId: 'Am', title: '+ Mélyásógép', text: 'A mélyásógép tartott a legtovább: június végén 26–32 cm. A kontroll + mélyásógép egyetlen mérési pont.' },
        ],
        summary: 'Mindkét évben az ásógépes parcella maradt mélyebben laza a tenyészidő végén.',
      },
      seasonEnd: { when: { month: 'JÚN.', third: 'vége' }, control: 7, spade: 17.6 },
      temperature: {
        title: 'A talajhőmérséklet a tenyészidő során, dél körül',
        depths: [
          {
            label: '3 cm',
            points: [
              { when: { month: 'MÁRC.', third: 'eleje' }, control: 15.7, spade: 15.9 },
              { when: { month: 'ÁPR.', third: 'közepe' }, control: 16.7, spade: 18.3 },
              { when: { month: 'MÁJ.', third: 'közepe' }, control: 24.4, spade: 24.4 },
              { when: { month: 'JÚN.', third: 'vége' }, control: 32.0, spade: 28.0 },
            ],
          },
          {
            label: '10 cm',
            points: [
              { when: { month: 'MÁRC.', third: 'eleje' }, control: 10.5, spade: 10.2 },
              { when: { month: 'ÁPR.', third: 'közepe' }, control: 15.3, spade: 16.7 },
              { when: { month: 'MÁJ.', third: 'közepe' }, control: 20.8, spade: 20.9 },
              { when: { month: 'JÚN.', third: 'vége' }, control: 27.6, spade: 25.3 },
            ],
          },
        ],
        explanation:
          'Tavasszal az ásógépezett talaj melegszik gyorsabban: április közepén [[+1,6 °C]] 3 cm-en. A június végi, 30 °C-os hőségben viszont [[4 °C-kal hűvösebb]] maradt, és nedvesebb is volt (10 cm-en 30–40 V/V% a kontroll 22–28%-ával szemben).',
      },
    },
  ],
}

export const SEASON_YEARS: number[] = Array.from(
  new Set(szentkiralySeasons.seasons.map((s) => s.year)),
).sort((a, b) => a - b)

export function findSeason(site: SiteSeasons, year: number): Season | undefined {
  return site.seasons.find((s) => s.year === year)
}

export function formatCm(v: number): string {
  return String(v).replace('.', ',')
}

// ---------------------------------------------------------------------------
// Szentkirály, ipari paradicsom: a second field at Szentkirály, measured from 2026.

export interface KeyFact {
  label: string
  when: MeasureDate
  control: string
  spade: string
  unit: string
  /** Small note under the row, e.g. the starting values */
  note?: string
}

export interface TomatoSeason {
  year: number
  treatments: Treatment[]
  dates: MeasureDate[]
  values: Record<string, number[]>
  cards: EvaluationCard[]
  summary: string
  facts: KeyFact[]
  /** One line under the title: tillage, field size, points */
  about: string
}

export const szentkiralyTomato: { looseLayerMax: number; seasons: TomatoSeason[] } = {
  looseLayerMax: 50,
  seasons: [
    {
      year: 2026,
      about: 'Művelés 2026 áprilisában · két 1,4 ha-os tábla · 6 mérési pont',
      treatments: [
        { id: 'K', label: 'Kontroll (kombinátor)', short: 'Kombinátor', role: 'control', steps: ['Kombinátor'] },
        { id: 'A', label: 'Ásógép', short: 'Ásógép', role: 'spade', steps: ['Ásógép'] },
      ],
      dates: [
        { month: 'ÁPR.', third: 'közepe' },
        { month: 'JÚN.', third: 'eleje' },
        { month: 'JÚL.', third: 'vége' },
      ],
      values: {
        K: [37.8, 22.7, 33.0],
        A: [33.4, 36.7, 35.2],
      },
      cards: [
        { treatmentId: 'K', title: 'Kombinátor (április)', text: 'Áprilisban 37,8 cm-ig laza, június elejére 22,7 cm-re tömörödött.' },
        { treatmentId: 'A', title: 'Ásógép (április)', text: 'Június elején is 36,7 cm-ig laza: 14 cm-rel mélyebben, mint a kombinátoros parcella.' },
      ],
      summary: 'Áprilisban még a kombinátoros parcella volt lazább; júniusra megfordult, és július végén is az ásógépes maradt lazább.',
      facts: [
        { label: 'Hajtáshossz', when: { month: 'JÚL.', third: 'eleje' }, control: '65', spade: '90', unit: 'cm' },
        { label: 'Térfogattömeg', when: { month: 'JÚL.', third: 'vége' }, control: '1,53', spade: '1,41', unit: 'g/cm³', note: 'kisebb = lazább talaj' },
        { label: 'Humusz', when: { month: 'AUG.', third: 'közepe' }, control: '1,70', spade: '1,89', unit: 'm/m%', note: 'áprilisban 1,62 és 1,63' },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Lakitelek: the same 7 parcels every year, the crop changes (2025 ipari paradicsom, 2026 rozs).

export interface ParcelSeason {
  num: string
  /** Name as in the 3D chart (no depths) */
  treatment: string
  shortName: string
  /** The tillage with depths, shown in the results list */
  detail?: string
  /** cm, one value per measurement date */
  values: number[]
  /** 2025 only: the researchers' rating and comment */
  rating?: number
  description?: string
  good?: boolean
}

export interface FieldSeason {
  year: number
  info: SeasonInfo
  title: string
  dates: MeasureDate[]
  /** Caveat per date, e.g. 'tarló' (measured on stubble) */
  dateFlags?: (string | undefined)[]
  /** Label of each date in the 3D chart */
  chartLabels: string[]
  parcels: ParcelSeason[]
  /** Parcels marked with a star (2025 rating); empty when there is no rating */
  bestResults: string[]
  summary: string
  /** Explains a caveat flag */
  flagNote?: string
}

const lk = locations.lakitelek

export const lakitelekSeasons: { seasons: FieldSeason[] } = {
  seasons: [
    {
      year: 2025,
      info: {
        crop: lk.crop,
        soil: lk.soil,
        ka: lk.ka,
        irrigation: lk.irrigation,
        period: lk.period,
        measurements: lk.measurements,
      },
      title: 'A laza talajréteg mélységének változása 4 hónap alatt',
      dates: [{ month: 'MÁJ.' }, { month: 'JÚN.' }, { month: 'AUG.' }],
      chartLabels: ['Május', 'Június', 'Augusztus'],
      parcels: lk.parcels.map((p) => ({
        num: p.num,
        treatment: p.treatment,
        shortName: p.shortName,
        values: [p.may, p.jun, p.aug],
        rating: p.rating,
        description: p.description,
        good: p.good,
      })),
      bestResults: lk.conclusions.bestResults,
      summary: lk.conclusions.summary,
    },
    {
      year: 2026,
      info: {
        crop: 'Rozs',
        soil: lk.soil,
        ka: lk.ka,
        irrigation: 'kb. 120 mm csapadék + kb. 60 mm öntözés',
        period: 'Április – Július',
        measurements: '3 alkalom, parcellánként 5 pont',
        base: 'Művelés 2025 októberében, ugyanazon a 7 parcellán, mint 2025-ben',
      },
      title: 'A laza talajréteg mélysége, 3 mérés',
      dates: [
        { month: 'ÁPR.', third: 'eleje' },
        { month: 'MÁJ.', third: 'közepe' },
        { month: 'JÚL.', third: 'vége' },
      ],
      dateFlags: [undefined, undefined, 'tarló'],
      chartLabels: ['Ápr. eleje', 'Máj. közepe', 'Júl. vége'],
      parcels: [
        { num: 'I.', treatment: 'Mélyásógép', shortName: 'mély.ág', detail: 'mélyásógép 45 cm', values: [41.0, 22.7, 7.6] },
        { num: 'II.', treatment: 'Lazítás + Ásógép', shortName: 'laz+ág', detail: 'lazítás 50 + ásógép 30 cm', values: [27.6, 20.6, 8.1] },
        { num: 'III.', treatment: 'Ásógép', shortName: 'ág', detail: 'ásógép 30 cm', values: [23.0, 19.6, 10.4] },
        { num: 'IV.', treatment: 'Lazítás + Szántás + Kombinátor', shortName: 'laz+sz+komb', detail: 'lazítás 50 + szántás 30 + kombinátor 8 cm', values: [32.8, 21.3, 9.1] },
        { num: 'V.', treatment: 'Szántás + Kombinátor', shortName: 'sz+komb', detail: 'szántás 30 + kombinátor 8 cm', values: [34.0, 22.7, 8.9] },
        { num: 'VI.', treatment: 'Lazítás + Szántás + Ásógép', shortName: 'laz+sz+ág', detail: 'lazítás 50 + szántás 30 + ásógép 25 cm', values: [35.0, 22.9, 7.6] },
        { num: 'VII.', treatment: 'Szántás + Ásógép', shortName: 'sz+ág', detail: 'szántás 30 + ásógép 25 cm', values: [32.4, 20.9, 7.1] },
      ],
      bestResults: [],
      summary: 'A mélyásógép (I.) indult a legmélyebbről: áprilisban 41 cm. Májusra minden parcella 20–23 cm-re tömörödött, a július végi, tarlón mért értékek 7–10 cm között vannak.',
      flagNote: 'Július végén a rozs betakarítása után, tarlón mértünk; ez nem azonos a 2025-ös, tenyészidő végi méréssel.',
    },
  ],
}

export const LAKITELEK_YEARS = lakitelekSeasons.seasons.map((s) => s.year)

/* ── Szentkirály onion: growth (phenology), 2026 only ── */

export type Range = [number, number]

export interface GrowthMeasure {
  /** leaf length, cm (min–max as given in the source) */
  leafLength: Range
  /** leaf count (min–max) */
  leafCount: Range
  /** bulb diameter, mm */
  bulb: number
}

export interface GrowthSeason {
  year: number
  dates: { id: string; date: MeasureDate; control: GrowthMeasure; spade: GrowthMeasure }[]
  /** The bulb size both plots reached, a month apart */
  catchUp: { mm: number; spadeDate: MeasureDate; controlDate: MeasureDate }
  summary: string
  rangeNote: string
}

/** Source: Drive "Ásógép-2026", onion phenology on 06.26 and 07.22 */
export const szentkiralyGrowth: { seasons: GrowthSeason[] } = {
  seasons: [
    {
      year: 2026,
      dates: [
        {
          id: 'jun',
          date: { month: 'JÚN.', third: 'vége' },
          control: { leafLength: [23, 36], leafCount: [5, 7], bulb: 25 },
          spade: { leafLength: [38, 65], leafCount: [8, 9], bulb: 55 },
        },
        {
          id: 'jul',
          date: { month: 'JÚL.', third: 'vége' },
          control: { leafLength: [50, 50], leafCount: [6, 8], bulb: 55 },
          spade: { leafLength: [60, 70], leafCount: [12, 12], bulb: 85 },
        },
      ],
      catchUp: { mm: 55, spadeDate: { month: 'JÚN.', third: 'vége' }, controlDate: { month: 'JÚL.', third: 'vége' } },
      summary: 'Az ásógépes hagymán június végén 55 mm-es fejet mértünk, a kontroll ezt július végére érte el.',
      rangeNote: 'Halvány levél = a mért tartomány felső vége (a forrás tartományokat ad, pl. levélhossz 23–36 cm).',
    },
  ],
}

/* ── Lakitelek soil life (MicroBIOMETER), one timeline across seasons ── */

export interface SoilLifeSample {
  /** ISO date, places the sample on the time axis */
  iso: string
  date: MeasureDate
  flag?: string
}

export interface SoilLifeSite {
  unit: string
  samples: SoilLifeSample[]
  /** Growing season bands under the timeline */
  seasons: { year: number; crop: string }[]
  parcels: { num: string; name: string; role: 'deep' | 'spade' | 'other'; values: number[] }[]
  /** One sentence under the title: what is measured and which way is better */
  lead: string
  note: string
}

/** Source: Drive "Ásógép-2026", MicroBIOMETER, 3 samples per parcel and date (averages) */
export const lakitelekSoilLife: SoilLifeSite = {
  unit: 'µgC/g',
  samples: [
    { iso: '2025-05-07', date: { month: 'MÁJ.', third: 'eleje' } },
    { iso: '2025-09-18', date: { month: 'SZEPT.', third: 'közepe' } },
    { iso: '2026-04-10', date: { month: 'ÁPR.', third: 'eleje' } },
    { iso: '2026-07-21', date: { month: 'JÚL.', third: 'vége' }, flag: 'tarló' },
  ],
  seasons: [
    { year: 2025, crop: 'ipari paradicsom' },
    { year: 2026, crop: 'rozs' },
  ],
  parcels: [
    { num: 'I.', name: 'Mélyásógép', role: 'deep', values: [282.67, 342, 298.67, 230] },
    { num: 'II.', name: 'Lazítás + ásógép', role: 'spade', values: [237.67, 299.67, 401.67, 309] },
    { num: 'III.', name: 'Ásógép', role: 'spade', values: [430.33, 411.67, 423.67, 315.33] },
    { num: 'IV.', name: 'Lazítás + szántás + kombinátor', role: 'other', values: [353.67, 505, 374, 260.67] },
    { num: 'V.', name: 'Szántás + kombinátor', role: 'other', values: [443, 466.33, 590, 251.67] },
    { num: 'VI.', name: 'Lazítás + szántás + ásógép', role: 'spade', values: [486.33, 518, 381, 250.5] },
    { num: 'VII.', name: 'Szántás + ásógép', role: 'spade', values: [462.33, 488.67, 507, 278] },
  ],
  lead: 'Az élő mikrobák mennyisége a talajban (élő mikrobiális szén), 4 mérés 2025 májusától 2026 júliusáig. Több = élénkebb talajélet.',
  note: 'Kísérő adat, nem bizonyíték: a művelés hatását a talajszerkezet mutatja.',
}

/* ── 2026 soil measurements beside the main ones ("További mérések") ── */

/** Szentkirály onion. Source: Drive "HalasiErnő-Vöröshagyma-MK-2026": bulk density (averages), humus, water at 10 cm (range of the points) */
export const szentkiralyOnionSoil = {
  bulkDensity: {
    dates: [
      { month: 'MÁRC.', third: 'eleje' },
      { month: 'MÁJ.', third: 'közepe' },
      { month: 'JÚN.', third: 'vége' },
    ] as MeasureDate[],
    control: [1.26, 1.32, 1.46],
    spade: [1.27, 1.33, 1.35],
  },
  /** V/V%, 10 cm, JÚN. vége: lowest and highest point */
  water: {
    date: { month: 'JÚN.', third: 'vége' } as MeasureDate,
    control: [22.0, 28.3] as Range,
    spade: [30.6, 40.1] as Range,
  },
  /** m/m% */
  humus: {
    dates: [
      { month: 'ÁPR.', third: 'közepe' },
      { month: 'JÚL.', third: 'vége' },
    ] as MeasureDate[],
    control: [2.61, 2.59],
    spade: [2.77, 2.59],
  },
}

/** Lakitelek rye, 7 parcels. Source: Drive "Lakitelek ásógépes kísérlet 1-7-2026" */
export const lakitelekSoil2026 = {
  /** g/cm³ per parcel, ÁPR. eleje → JÚL. vége (stubble) */
  bulkDensity: {
    dates: [
      { month: 'ÁPR.', third: 'eleje' },
      { month: 'JÚL.', third: 'vége' },
    ] as MeasureDate[],
    parcels: [
      { num: 'I.', role: 'deep', values: [1.44, 1.43] },
      { num: 'II.', role: 'spade', values: [1.46, 1.46] },
      { num: 'III.', role: 'spade', values: [1.43, 1.41] },
      { num: 'IV.', role: 'other', values: [1.5, 1.43] },
      { num: 'V.', role: 'other', values: [1.39, 1.46] },
      { num: 'VI.', role: 'spade', values: [1.39, 1.45] },
      { num: 'VII.', role: 'spade', values: [1.43, 1.44] },
    ] as { num: string; role: 'deep' | 'spade' | 'other'; values: number[] }[],
  },
  /** V/V%, 10 cm, the 7 parcel averages at each date */
  water: {
    dates: [
      { month: 'ÁPR.', third: 'eleje' },
      { month: 'MÁJ.', third: 'közepe' },
      { month: 'JÚL.', third: 'vége' },
    ] as MeasureDate[],
    parcels: [
      [6.6, 15.62, 9.54],
      [6.12, 15.8, 8.58],
      [7.78, 17.4, 9.12],
      [7.12, 16.8, 9.76],
      [9.04, 17.98, 10.0],
      [8.7, 16.92, 9.76],
      [10.62, 17.5, 12.14],
    ],
  },
  /** cm per parcel I–VII, MÁJ. közepe */
  rye: {
    date: { month: 'MÁJ.', third: 'közepe' } as MeasureDate,
    shoot: [110, 115, 110, 110, 120, 125, 125],
    root: [8, 7, 6, 10, 6, 12, 8],
  },
}

// ---------------------------------------------------------------------------
// The research sites and the seasons measured at each (hero map, home figures)
const onionYears = szentkiralySeasons.seasons.map((s) => s.year)
const tomatoYears = szentkiralyTomato.seasons.map((s) => s.year)
const span = (ys: number[]) => (ys.length > 1 ? `${Math.min(...ys)}–${Math.max(...ys)}` : String(ys[0]))

export const RESEARCH_SITES = [
  {
    id: 'szentkiraly',
    n: 1,
    name: 'Szentkirály',
    years: Array.from(new Set([...onionYears, ...tomatoYears])),
    tip: `hagyma ${span(onionYears)}, paradicsom ${span(tomatoYears)}`,
    fields: 2,
  },
  {
    id: 'kecskemet',
    n: 2,
    name: 'Kecskemét-Borbás',
    years: [2025],
    tip: `${locations.kecskemet.crop.toLowerCase()}, 2025`,
    fields: 1,
  },
  {
    id: 'lakitelek',
    n: 3,
    name: 'Lakitelek',
    years: LAKITELEK_YEARS,
    tip: `7 parcella, ${lakitelekSeasons.seasons.map((s) => `${s.year} ${s.info.crop.toLowerCase()}`).join(', ')}`,
    fields: 1,
  },
]
export const RESEARCH_YEARS = Array.from(new Set(RESEARCH_SITES.flatMap((s) => s.years))).sort((a, b) => a - b)

/** Fields (kísérleti táblák) across all sites */
export const RESEARCH_FIELDS = RESEARCH_SITES.reduce((n, s) => n + s.fields, 0)
