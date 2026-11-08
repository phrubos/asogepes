// What is measured, where and how (Kutatás › Módszertan).
// Source: Drive "Ásógép-2026" spreadsheets, re-read 2026-11-02:
// HalasiErnő-Vöröshagyma-MK-2026, VD-paradicsom-2026, Lakitelek ásógépes kísérlet 1-7-2026,
// MikrobioMeter-2025-2026. The 2025 entries come from `data.ts`.

import { lakitelekSoil2026, lakitelekSoilLife } from './seasons'

export interface MeasuredProperty {
  name: string
  /** What the number tells, in one line */
  what: string
  unit: string
  /** Where on / in the soil */
  how: string
  years: number[]
}

/** Recorded at every measuring point (GPS, WGS 84) on every measuring day; plus the field-level samples */
export const MEASURED_PROPERTIES: MeasuredProperty[] = [
  {
    name: 'Tömörödöttség',
    what: 'Milyen mélyen marad laza a talaj (20 bar alatt)',
    unit: 'cm',
    how: 'penetrométer, pontonként 3 szúrás átlaga',
    years: [2025, 2026],
  },
  {
    name: 'Talajhőmérséklet',
    what: 'Mennyire melegszik fel a talaj',
    unit: '°C',
    how: 'két mélységben (hagyma: 3 és 10 cm, a többi tábla: 10 és 20 cm)',
    years: [2025, 2026],
  },
  {
    name: 'Víztelítettség',
    what: 'Mennyi vizet tart a talaj',
    unit: 'V/V%',
    how: 'két mélységben, pontonként',
    years: [2026],
  },
  {
    name: 'Oldott sótartalom',
    what: 'A talajoldat sótartalma',
    unit: 'g/l',
    how: 'két mélységben, pontonként',
    years: [2026],
  },
  {
    name: 'Térfogattömeg',
    what: 'Mennyire tömör a talaj; kisebb = lazább',
    unit: 'g/cm³',
    how: 'hengeres minta 10–15 cm-ről, a pontok átlaga',
    years: [2026],
  },
  {
    name: 'Humusz',
    what: 'A talaj szervesanyag-tartalma',
    unit: 'm/m%',
    how: 'izzítási veszteségből, átlagmintából',
    years: [2026],
  },
  {
    name: 'Fejlődés',
    what: 'Hogyan fejlődik a növény',
    unit: 'cm, db, mm',
    how: 'levél, fej, hajtás és gyökér mérése',
    years: [2026],
  },
  {
    name: 'Talajélet',
    what: 'Mennyi élő mikroba van a talajban',
    unit: 'µgC/g',
    how: 'MicroBIOMETER, 3 párhuzamos minta',
    years: [2025, 2026],
  },
]

/** 2026 fields: measuring points and measuring days (spreadsheet rows) */
export const POINTS_2026 = [
  { field: 'Szentkirály, hagymatábla', points: '10 pont', days: 4, span: 'március – június' },
  { field: 'Szentkirály, paradicsomtábla', points: '6 pont', days: 3, span: 'április – július' },
  { field: 'Lakitelek', points: '7 parcella × 5 pont', days: 3, span: 'április – július' },
]

/** MicroBIOMETER: one worked example, from the spreadsheet's summary row */
const exampleIndex = lakitelekSoilLife.samples.findIndex((s) => s.iso === '2026-04-10')
const exampleValues = lakitelekSoilLife.parcels.map((p) => p.values[exampleIndex])
export const MICROBIOMETER_EXAMPLE = {
  place: 'Lakitelek',
  when: '2026 április',
  parcels: exampleValues.length,
  /** µgC/g, the 7 parcels' mean */
  carbon: exampleValues.reduce((a, b) => a + b, 0) / exampleValues.length,
  /** % of the living carbon from fungi / bacteria ("Összátlag" row, F % / B %) */
  fungi: 44.2,
  bacteria: 55.8,
}

/** Sampling rounds of the soil-life test */
export const MICROBIOMETER_ROUNDS = [
  { when: '2025 május', where: 'Lakitelek' },
  { when: '2025 szeptember', where: 'Lakitelek' },
  { when: '2026 április', where: 'Lakitelek, Szentkirály (2 tábla)' },
  { when: '2026 július–augusztus', where: 'Lakitelek, Szentkirály (2 tábla)' },
]

/** Bulk density: the sampling steps, photographed at Lakitelek on 2026-04-06 (Drive "Képek-Univ-Lakitelek") */
export interface BulkDensityStep {
  title: string
  text: string
  /** File stem under BULK_DENSITY_IMAGE_DIR; `-wide` (3:2) and `-square` (1:1) exist. The lab step has none. */
  image?: string
  alt: string
}

export const BULK_DENSITY_IMAGE_DIR = '/images/kutatás_pics/Lakitelek/terfogattomeg'

export const BULK_DENSITY_STEPS: BulkDensityStep[] = [
  {
    title: 'Gödör',
    text: '10–15 cm mélyre ásunk, ahol a talaj tömörödni kezd.',
    image: 'terfogattomeg-1-asas',
    alt: 'Kis gödör a gabonatáblában, az aljára állított acélhenger',
  },
  {
    title: 'Henger',
    text: 'A 100 cm³-es, két végén nyitott acélhengert függőlegesen a gödör aljába nyomjuk, amíg a pereme egy szintbe kerül a talajjal.',
    image: 'terfogattomeg-2-beveres',
    alt: 'A henger a gödör aljába nyomva, csak a pereme látszik',
  },
  {
    title: 'Kiemelés',
    text: 'Körülássuk, és a földdel együtt egyben emeljük ki. A kilógó földet a peremnél levágjuk, így pontosan 100 cm³ marad benne.',
    image: 'terfogattomeg-3-kiemeles',
    alt: 'A henger mellől kiásott föld, a henger kiemelés előtt',
  },
  {
    title: 'Lezárás',
    text: 'Mindkét végére kupak kerül, rá a mérési pont jele, és mehet a laborba.',
    image: 'terfogattomeg-4-lezaras',
    alt: 'A két végén lezárt henger a gödör szélén, a gödör alján a helye',
  },
  {
    title: 'Labor',
    text: '105 °C-on kiszárítjuk és lemérjük. A száraz tömeg osztva 100 cm³-rel: ez a térfogattömeg.',
    alt: 'Szárítás és mérés a laborban',
  },
]

/** The worked example: Lakitelek, the sampling day of the photos (ÁPR. eleje), mean of the parcels */
const bdApril = lakitelekSoil2026.bulkDensity.parcels.map((p) => p.values[0])
const bdMean = Math.round((bdApril.reduce((a, b) => a + b, 0) / bdApril.length) * 100) / 100
export const BULK_DENSITY_EXAMPLE = {
  place: 'Lakitelek',
  when: '2026 április eleje',
  parcels: bdApril.length,
  /** g/cm³, rounded to 2 decimals */
  value: bdMean,
  /** grams of dry soil in the 100 cm³ cylinder */
  grams: Math.round(bdMean * 100),
  photoDate: '2026. április 6.',
}
