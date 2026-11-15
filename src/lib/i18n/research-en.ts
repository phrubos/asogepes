/**
 * English overlays for the research data (ticket 028). Numbers stay in lib/data.ts and lib/seasons.ts;
 * these objects carry only the English strings, in the same shape (arrays by index). Terms follow
 * docs/forditas/szojegyzek.md.
 */
import { locations } from '@/lib/data'
import {
  szentkiralySeasons,
  szentkiralyTomato,
  lakitelekSeasons,
  szentkiralyGrowth,
  lakitelekSoilLife,
  szentkiralyOnionSoilLife,
  lakitelekRye2026,
  RESEARCH_SITES,
} from '@/lib/seasons'
import {
  MEASURED_PROPERTIES,
  POINTS_2026,
  MICROBIOMETER_EXAMPLE,
  MICROBIOMETER_ROUNDS,
  BULK_DENSITY_STEPS,
  BULK_DENSITY_EXAMPLE,
} from '@/lib/methodology'
import { overlay, type Overlay } from './overlay'

const WATERMARK = { lines: ['software: Pix4D', 'photo: DJI Mavic 3 Thermal'] }

// ── lib/data.ts: locations ──────────────────────────────────────────────────

const LAKITELEK_PARCELS_EN = [
  { treatment: 'Deep spading machine', shortName: 'deep sp', description: 'Loosens deepest and is one of the most lasting methods.' },
  { treatment: 'Subsoiling + spading machine', shortName: 'sub+sp', description: 'Less even and less lasting.' },
  { treatment: 'Spading machine', shortName: 'sp', description: 'Even and lasting, but the loosened layer is not deep enough here.' },
  { treatment: 'Subsoiling + ploughing + combination cultivator', shortName: 'sub+pl+cc', description: 'Even and lasting; the soil re-compacts at a steady rate.' },
  { treatment: 'Ploughing + combination cultivator', shortName: 'pl+cc', description: 'Even and deep enough, but not lasting.' },
  { treatment: 'Subsoiling + ploughing + spading machine', shortName: 'sub+pl+sp', description: 'Even, deep enough and lasting.' },
  { treatment: 'Ploughing + spading machine', shortName: 'pl+sp', description: 'Even, deep enough and lasting.' },
]

const MONTHS_EN = [{ month: 'March' }, { month: 'April' }, { month: 'May' }, { month: 'June' }]

const LOCATIONS_EN: Overlay<typeof locations> = {
  szentkiraly: {
    crop: 'Onion (spring-sown)',
    soil: 'Meadow chernozem',
    irrigation: '350 mm (150 days), hose-reel irrigator',
    period: 'March – June',
    measurements: '4 rounds',
    measurementLabel: 'Penetrometer measurements',
    spade: { treatments: ['Autumn heavy cultivator', 'Spring heavy cultivator', '38WX spading machine (30 cm + 55 cm subsoiling)'] },
    control: { treatments: ['Autumn heavy cultivator', 'Spring heavy cultivator', 'Combination cultivator'] },
    chartData: MONTHS_EN,
    evaluations: {
      control: 'The structure is uneven: between the cultivator tines the loose layer is shallow, and by the 4th month the soil was compacted from 6 cm down.',
      spade: 'The loose soil structure stayed stable for 3 months; in the 4th month the soil still had a good structure down to 11 cm.',
      summary: 'Over the growing season, irrigation compacts the soil strongly.',
    },
    highlight: {
      title: 'A visible difference',
      text: 'At the June field visit it was plain to see: far fewer weeds had grown on the spaded plot than on the conventionally tilled area.',
    },
    photos: [
      {
        alt: 'Szentkirály, thermal image, 7 March',
        title: 'Drone thermal map of the trial plot',
        credit: 'Szentkirály, 7 March 2025',
        rightLabel: 'Thermal map',
        description:
          'We took a drone thermal map of the treated field on the day of spading. On the left of the image the letter [[T]] marks the tractor doing the spading; the arrow shows its direction of travel.\n\nThe image was taken on [[7 March]], around midday, in sunshine, at an air temperature of [[18 °C]].\n\nTypical thermal reference points (mean temperature of a circular area of about [[100 m²]], °C):\n\nA – Control surface, combination-cultivated, undisturbed for weeks.\nB – Freshly spaded, raw surface. Its temperature is low and its surface is moist.\nC – D – Surfaces spaded about 30 and 60 minutes earlier. The surface of the loose soil clearly reaches a temperature close to the control very quickly.\nE – The strip on the right of the image has just been sown with onion seed. The soil surface disturbed by the seed drill is cooler again.',
        watermark: WATERMARK,
      },
      {
        alt: 'Szentkirály, onion',
        title: 'The onion crop in June',
        credit: 'Szentkirály, June 2025',
        description:
          'The image shows a well-developed onion crop. Left of the wheel track is the spaded surface, right of it the control, cultivator-tilled and combination-cultivated. The weed control effect of spading is clearly much stronger: when the pre-emergence herbicide was activated, the weeds germinating from seed were at just the right stage.',
      },
    ],
  },
  kecskemet: {
    crop: 'Processing tomato',
    soil: 'Meadow chernozem',
    irrigation: '400 mm (120 days), linear-move system',
    period: 'May – June',
    measurements: '2 rounds',
    measurementLabel: 'Penetrometer measurements',
    spade: { treatments: ['Autumn ploughing (28 cm)', 'Levelling', 'Rotary spike harrow', '40SX deep spading machine (45 cm)'] },
    control: { treatments: ['Autumn ploughing (28 cm)', 'Levelling', 'Rotary spike harrow'] },
    chartData: [{ month: 'May' }, { month: 'June' }],
    evaluations: {
      control: 'The rotary spike harrow works well, but in both months the depth of optimally loose soil stayed behind what the spading machine achieved.',
      spade: 'After 2 months the optimally loose soil structure still reached deeper than 30 cm.',
      summary: 'Over the growing season, irrigation compacts the soil strongly.',
    },
    highlight: {
      title: 'A striking difference in growth',
      text: 'The June photo shows it clearly: the rows on the left of the image grew on the control, the middle rows and those to their right on the spaded plot. Leaf mass and shoot length are on average 20% greater on the spaded area.',
    },
    photos: [
      {
        alt: 'Kecskemét, comparison',
        title: 'Orthophoto and thermal map after planting',
        credit: 'Kecskemét-Borbás, 16 May 2025',
        description:
          'The upper, 11-metre-wide strip in the image was spaded; the control below it only went through the rotary spike harrow. The drone image clearly shows that the looser, spaded surface had already dried, because it warmed up faster, while the lower, control strip was still moist and cooler.',
        leftLabel: 'Orthophoto',
        rightLabel: 'Thermal map',
        overlays: {
          points: [{ label: 'Control (rotary spike harrow)' }, { label: 'Spaded (Imants 40SX)' }],
        },
        watermark: WATERMARK,
      },
      {
        alt: 'Kecskemét, comparison 2',
        title: 'Orthophoto and TGI (leaf cover) index',
        credit: 'Kecskemét-Borbás, 19 June 2025',
        description:
          'The upper, 11-metre-wide strip in the image was spaded; the control below it only went through the rotary spike harrow. Both plots carried 9 rows of processing tomato. Even by eye the upper field has more leaf cover than the lower one. According to the GIS software, leaf cover is 35.9% on the control and 41.5% on the spaded field: the plants on the spaded surface grew faster.',
        leftLabel: 'Orthophoto',
        rightLabel: 'TGI index',
        overlays: {
          points: [
            { label: 'Spaded (9 rows)', value: 'leaf cover: 41.5%' },
            { label: 'Control (9 rows)', value: 'leaf cover: 35.9%' },
          ],
        },
        watermark: WATERMARK,
      },
      {
        alt: 'Kecskemét, tomato crop',
        title: 'Leaf mass',
        credit: 'Kecskemét-Borbás, 19 June 2025',
        description:
          'The rows on the left of the image grew on the control, the middle rows and those to their right on the spaded plot. Leaf mass and shoot length are on average 15% greater on the spaded area.',
        overlays: {
          arrows: [{ label: 'Control' }, { label: 'Spaded', subLabel: '+15%\nleaf mass' }],
        },
      },
    ],
  },
  lakitelek: {
    crop: 'Processing tomato',
    soil: 'Humic sandy soil',
    irrigation: '450 mm (120 days), linear-move system',
    period: 'May – August',
    measurements: '3 rounds',
    measurementLabel: 'Penetrometer measurements',
    treatmentCount: '7 different combinations',
    parcels: LAKITELEK_PARCELS_EN,
    conclusions: {
      summary:
        'On this soil only the deep spading machine can be recommended on its own. Of the combinations, the ploughed plots spaded at normal depth proved the most lasting.',
    },
    photos: [
      {
        alt: 'Lakitelek, comparison',
        title: 'Orthophoto and thermal map after seedbed preparation',
        credit: 'Lakitelek, 2 May 2025',
        description: 'The photo was taken right after the tillage combinations were finished.',
        leftLabel: 'Orthophoto',
        rightLabel: 'Thermal map',
        leftDescription:
          'The photo was taken right after the tillage steps were finished.\n\nThe spaded surfaces are clearly homogeneous; their surface is cloddy and evenly ridged, and in the aerial photo they look distinctly structured. The surface that was not spaded is heterogeneous and structureless: the sandy surface is wind-blown and smooth, the sand grains on the surface have been moved by the wind.',
        rightDescription:
          'The photo was taken right after the tillage steps were finished.\n\nThe thermal map clearly shows that the temperature of the spaded surface is homogeneous and even, and lower than that of the surface that was not spaded, because this surface is moister. The temperature of the surface that was not spaded is heterogeneous: the surface is dry in several places, and these patches warm up faster.',
        overlays: {
          points: [
            undefined, undefined, undefined, undefined,
            { label: 'Spaded surface' },
            { label: 'Spaded surface' },
            { label: 'Spaded surface' },
            { label: 'Combination-cultivated surface' },
          ],
        },
        watermark: WATERMARK,
      },
    ],
  },
}

// ── lib/seasons.ts ─────────────────────────────────────────────────────────

const SZENTKIRALY_EN: Overlay<typeof szentkiralySeasons> = {
  seasons: [
    {
      info: {
        crop: 'Onion (spring-sown)',
        soil: 'Meadow chernozem',
        irrigation: '350 mm (150 days), hose-reel irrigator',
        period: 'March – June',
        measurements: '4 rounds',
      },
      treatments: [
        { label: 'Control', short: 'Control', steps: LOCATIONS_EN.szentkiraly?.control?.treatments },
        { label: 'Spaded', short: 'Spading m.', steps: LOCATIONS_EN.szentkiraly?.spade?.treatments },
      ],
      looseLayer: {
        title: `Change in the depth of the loose soil layer over ${szentkiralySeasons.seasons[0].looseLayer.dates.length} months`,
        cards: [
          { title: 'Control tillage', text: LOCATIONS_EN.szentkiraly?.evaluations?.control },
          { title: 'Spading-machine tillage', text: LOCATIONS_EN.szentkiraly?.evaluations?.spade },
        ],
        summary: LOCATIONS_EN.szentkiraly?.evaluations?.summary,
      },
      temperature: {
        title: 'Soil temperature while the onion germinates',
        explanation:
          'Soil temperature matters a great deal after sowing, while the seeds are germinating. In March, during the early spring warming, we measured the near-surface temperature of the soil under the germinating onion around midday. The looser, spaded soil was [[3–5 °C warmer]]. This markedly speeds up the early growth of the plants.',
      },
    },
    {
      info: {
        crop: 'Onion (spring-sown)',
        soil: 'Meadow chernozem',
        irrigation: '350 mm (150 days), hose-reel irrigator',
        period: 'March – July',
        measurements: '4 rounds, 10 measuring points',
        base: 'Autumn 2025: cultivator, then spading machine over the whole field',
        treatmentNote: 'The four treatments differ only in the February 2026 tillage.',
      },
      treatments: [
        { label: 'Control', short: 'Control', steps: ['Cultivator'] },
        { label: 'Spading machine', short: 'Spading m.', steps: ['Spading machine'] },
        { label: 'Control + deep spading machine', short: 'C + deep', flag: '1 measurement', steps: ['Cultivator', 'Deep spading machine'] },
        { label: 'Spading machine + deep spading machine', short: 'S + deep', steps: ['Spading machine', 'Deep spading machine'] },
      ],
      looseLayer: {
        title: 'Depth of the loose soil layer, 4 measurements, 4 treatments',
        cards: [
          { title: 'Control (February cultivator)', text: 'Loose to 28–37 cm in spring; by June compacted from 7 cm down.' },
          { title: 'Spading machine (February)', text: 'Still loose to 17.6 cm in June: two and a half times deeper than the control.' },
          { title: '+ Deep spading machine', text: 'The deep spading machine lasted longest: 26–32 cm in June. Control + deep spading machine has only one measuring point.' },
        ],
        summary: 'In both years the spaded plot stayed loose to a greater depth at the end of the growing season.',
      },
      temperature: {
        title: 'Soil temperature over the growing season, around midday',
        explanation:
          'In spring the spaded soil warms up faster: [[+1.6 °C]] at 3 cm in April. In the 30 °C heat of June, however, it stayed [[4 °C cooler]], and it was moister too (30–40% v/v at 10 cm, against 22–28% on the control).',
      },
    },
  ],
}

const TOMATO_EN: Overlay<typeof szentkiralyTomato> = {
  seasons: [
    {
      about: 'Tilled in April 2026 · two 1.4 ha fields · 6 measuring points',
      treatments: [
        { label: 'Control (combination cultivator)', short: 'Comb. cult.', steps: ['Combination cultivator'] },
        { label: 'Spading machine', short: 'Spading m.', steps: ['Spading machine'] },
      ],
      cards: [
        { title: 'Combination cultivator (April)', text: 'Loose to 37.8 cm in April; compacted to 22.7 cm by June.' },
        { title: 'Spading machine (April)', text: 'Still loose to 36.7 cm in June: 14 cm deeper than the combination-cultivated plot.' },
      ],
      summary: 'In April the combination-cultivated plot was still the looser one; by June this had reversed, and in July the spaded plot was still looser.',
      facts: [
        { label: 'Shoot length' },
        { label: 'Bulk density', control: '1.53', spade: '1.41', note: 'lower = looser soil' },
        { label: 'Organic matter', control: '1.70', spade: '1.89', unit: '% m/m', note: '1.62 and 1.63 in April' },
      ],
    },
  ],
}

const LAKITELEK_EN: Overlay<typeof lakitelekSeasons> = {
  seasons: [
    {
      info: {
        crop: 'Processing tomato',
        soil: 'Humic sandy soil',
        irrigation: '450 mm (120 days), linear-move system',
        period: 'May – August',
        measurements: '3 rounds',
      },
      title: 'Change in the depth of the loose soil layer over 4 months',
      chartLabels: ['May', 'June', 'August'],
      parcels: LAKITELEK_PARCELS_EN,
      summary: LOCATIONS_EN.lakitelek?.conclusions?.summary,
    },
    {
      info: {
        crop: 'Rye',
        irrigation: 'approx. 120 mm rainfall + approx. 60 mm irrigation',
        period: 'April – July',
        measurements: '3 rounds, 5 points per plot',
        base: 'The 7 plots of 2025 were tilled again in October 2025',
        soil: 'Humic sandy soil',
      },
      title: 'Depth of the loose soil layer, 3 measurements',
      dateFlags: [undefined, undefined, 'stubble'],
      chartLabels: ['April', 'May', 'July'],
      parcels: [
        { treatment: 'Deep spading machine', shortName: 'deep sp', detail: 'deep spading machine 45 cm' },
        { treatment: 'Subsoiling + spading machine', shortName: 'sub+sp', detail: 'subsoiling 50 + spading machine 30 cm' },
        { treatment: 'Spading machine', shortName: 'sp', detail: 'spading machine 30 cm' },
        { treatment: 'Subsoiling + ploughing + combination cultivator', shortName: 'sub+pl+cc', detail: 'subsoiling 50 + ploughing 30 + combination cultivator 8 cm' },
        { treatment: 'Ploughing + combination cultivator', shortName: 'pl+cc', detail: 'ploughing 30 + combination cultivator 8 cm' },
        { treatment: 'Subsoiling + ploughing + spading machine', shortName: 'sub+pl+sp', detail: 'subsoiling 50 + ploughing 30 + spading machine 25 cm' },
        { treatment: 'Ploughing + spading machine', shortName: 'pl+sp', detail: 'ploughing 30 + spading machine 25 cm' },
      ],
      summary:
        'The deep spading machine (I) started deepest: 41 cm in April. By May every plot had compacted to 20–23 cm; the July values, measured on stubble, lie between 7 and 10 cm.',
      flagNote: 'In July we measured on stubble, after the rye harvest; this is not the same as the end-of-season measurement of 2025.',
    },
  ],
}

const GROWTH_EN: Overlay<typeof szentkiralyGrowth> = {
  seasons: [
    {
      dates: [{ photoDate: '26 June 2026' }, { photoDate: '22 July 2026' }],
      summary: 'On the spaded onion we measured a 55 mm bulb at the end of June; the control reached this by the end of July.',
    },
  ],
}

const SOIL_LIFE_EN: Overlay<typeof lakitelekSoilLife> = {
  samples: [undefined, undefined, undefined, { flag: 'stubble' }],
  seasons: [{ crop: 'processing tomato' }, { crop: 'rye' }],
  parcels: [
    { name: 'Deep spading machine' },
    { name: 'Subsoiling + spading machine' },
    { name: 'Spading machine' },
    { name: 'Subsoiling + ploughing + combination cultivator' },
    { name: 'Ploughing + combination cultivator' },
    { name: 'Subsoiling + ploughing + spading machine' },
    { name: 'Ploughing + spading machine' },
  ],
  lead: 'The amount of living microbes in the soil (microbial biomass carbon), 4 measurements from May 2025 to July 2026. More = livelier soil life.',
  note: 'Supporting data, not proof: the effect of tillage is shown by the soil structure.',
}

const ONION_SOIL_LIFE_EN: Overlay<typeof szentkiralyOnionSoilLife> = {
  fields: [{ name: 'spading machine, forest side' }, { name: 'spading machine, track side' }, { name: 'control, 0.3 ha' }],
}

const RYE_EN: Overlay<typeof lakitelekRye2026> = {
  photoDate: '19 May 2026',
  parcels: [
    { short: 'deep sp', treatment: 'Deep spading machine', detail: 'deep spading machine 45 cm',
      above: 'Medium-dense bunch; the ears have emerged.', below: 'The root system spreads sideways, with many long roots.' },
    { short: 'sub+sp', treatment: 'Subsoiling + spading machine', detail: 'subsoiling 50 + spading machine 30 cm',
      above: 'Even, medium bunch.', below: 'Dense, round root ball; the sand clings well to the roots.' },
    { short: 'sp', treatment: 'Spading machine', detail: 'spading machine 30 cm',
      above: 'Slimmer, sparser bunch with fewer stems.', below: 'The root system stays compact, in a smaller ball.',
      note: 'In May the loose layer was shallowest here (19.6 cm); in July, on stubble, we measured the deepest value here (10.4 cm).' },
    { short: 'sub+pl+cc', treatment: 'Subsoiling + ploughing + combination cultivator', detail: 'subsoiling 50 + ploughing 30 + combination cultivator 8 cm',
      above: 'Wide bunch.', below: 'Bushy root system with many fine roots.' },
    { short: 'pl+cc', treatment: 'Ploughing + combination cultivator', detail: 'ploughing 30 + combination cultivator 8 cm',
      above: 'Medium bunch, tall shoots.', below: 'Medium-sized root ball.' },
    { short: 'sub+pl+sp', treatment: 'Subsoiling + ploughing + spading machine', detail: 'subsoiling 50 + ploughing 30 + spading machine 25 cm',
      above: 'The densest bunch, with many stems.', below: 'The largest and deepest-reaching root ball of the seven.' },
    { short: 'pl+sp', treatment: 'Ploughing + spading machine', detail: 'ploughing 30 + spading machine 25 cm',
      above: 'Many stems, tall shoots.', below: 'Dense root system, in two clumps.' },
  ],
}

const onionYears = szentkiralySeasons.seasons.map((s) => s.year)
const tomatoYears = szentkiralyTomato.seasons.map((s) => s.year)
const span = (ys: number[]) => (ys.length > 1 ? `${Math.min(...ys)}–${Math.max(...ys)}` : String(ys[0]))
const SITES_EN: Overlay<typeof RESEARCH_SITES> = [
  { tip: `onion ${span(onionYears)}, tomato ${span(tomatoYears)}` },
  { tip: 'processing tomato, 2025' },
  { tip: `7 plots, ${lakitelekSeasons.seasons.map((s, i) => `${s.year} ${(LAKITELEK_EN.seasons?.[i]?.info?.crop ?? s.info.crop).toLowerCase()}`).join(', ')}` },
]

// ── lib/methodology.ts ──────────────────────────────────────────────────────

const MEASURED_EN: Overlay<typeof MEASURED_PROPERTIES> = [
  { name: 'Compaction', what: 'How deep the soil stays loose (below 20 bar)', how: 'penetrometer, mean of 3 insertions per point' },
  { name: 'Soil temperature', what: 'How much the soil warms up', how: 'at two depths (onion: 3 and 10 cm, the other fields: 10 and 20 cm)' },
  { name: 'Water content', what: 'How much water the soil holds', unit: '% v/v', how: 'at two depths, per point' },
  { name: 'Dissolved salts', what: 'Salt content of the soil solution', how: 'at two depths, per point' },
  { name: 'Bulk density', what: 'How compact the soil is; lower = looser', how: 'core sample from 10–15 cm, mean of the points' },
  { name: 'Organic matter', what: 'Organic matter content of the soil', unit: '% m/m', how: 'loss on ignition, composite sample' },
  { name: 'Growth', what: 'How the crop develops', unit: 'cm, pcs, mm', how: 'leaf, bulb, shoot and root measurements' },
  { name: 'Soil life', what: 'How much living microbial biomass the soil holds', how: 'MicroBIOMETER, 3 replicate samples' },
]

const POINTS_EN: Overlay<typeof POINTS_2026> = [
  { field: 'Szentkirály, onion field', points: '10 points', span: 'March – June' },
  { field: 'Szentkirály, tomato field', points: '6 points', span: 'April – July' },
  { field: 'Lakitelek', points: '7 plots × 5 points', span: 'April – July' },
]

const ROUNDS_EN: Overlay<typeof MICROBIOMETER_ROUNDS> = [
  { when: 'May 2025' },
  { when: 'September 2025' },
  { when: 'April 2026', where: 'Lakitelek, Szentkirály (2 fields)' },
  { when: 'July–August 2026', where: 'Lakitelek, Szentkirály (2 fields)' },
]

const STEPS_EN: Overlay<typeof BULK_DENSITY_STEPS> = [
  { title: 'Pit', text: 'We dig down 10–15 cm, to where the soil starts to compact.', alt: 'Small pit in the cereal field, with the steel cylinder stood on its floor' },
  {
    title: 'Cylinder',
    text: 'The 100 cm³ steel cylinder, open at both ends, is pressed vertically into the floor of the pit until its rim is level with the soil.',
    alt: 'The cylinder pressed into the floor of the pit, only its rim showing',
  },
  {
    title: 'Lifting',
    text: 'We dig around it and lift it out in one piece with the soil. The soil sticking out is cut off at the rim, so exactly 100 cm³ stays inside.',
    alt: 'Soil dug out beside the cylinder, before it is lifted',
  },
  { title: 'Sealing', text: 'Both ends get a cap, marked with the measuring point, and it goes to the lab.', alt: 'The cylinder capped at both ends on the edge of the pit, its place at the bottom of the pit' },
  { title: 'Lab', text: 'It is dried at 105 °C and weighed. The dry mass divided by 100 cm³ is the bulk density.', alt: 'Drying and weighing in the lab' },
]

// ── lookup ─────────────────────────────────────────────────────────────────

/** Hungarian object -> its English version (built once) */
export const RESEARCH_EN = new Map<unknown, unknown>([
  [locations, overlay(locations, LOCATIONS_EN)],
  [szentkiralySeasons, overlay(szentkiralySeasons, SZENTKIRALY_EN)],
  [szentkiralyTomato, overlay(szentkiralyTomato, TOMATO_EN)],
  [lakitelekSeasons, overlay(lakitelekSeasons, LAKITELEK_EN)],
  [szentkiralyGrowth, overlay(szentkiralyGrowth, GROWTH_EN)],
  [lakitelekSoilLife, overlay(lakitelekSoilLife, SOIL_LIFE_EN)],
  [szentkiralyOnionSoilLife, overlay(szentkiralyOnionSoilLife, ONION_SOIL_LIFE_EN)],
  [lakitelekRye2026, overlay(lakitelekRye2026, RYE_EN)],
  [RESEARCH_SITES, overlay(RESEARCH_SITES, SITES_EN)],
  [MEASURED_PROPERTIES, overlay(MEASURED_PROPERTIES, MEASURED_EN)],
  [POINTS_2026, overlay(POINTS_2026, POINTS_EN)],
  [MICROBIOMETER_EXAMPLE, overlay(MICROBIOMETER_EXAMPLE, { when: 'April 2026' })],
  [MICROBIOMETER_ROUNDS, overlay(MICROBIOMETER_ROUNDS, ROUNDS_EN)],
  [BULK_DENSITY_STEPS, overlay(BULK_DENSITY_STEPS, STEPS_EN)],
  [BULK_DENSITY_EXAMPLE, overlay(BULK_DENSITY_EXAMPLE, { when: 'early April 2026', photoDate: '6 April 2026' })],
])

/** Register more overlays (methodology etc.) from their own modules */
export function registerEn<T>(base: T, over: Overlay<T>) {
  RESEARCH_EN.set(base, overlay(base, over))
}
