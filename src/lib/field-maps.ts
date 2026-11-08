// Map data for the "Helyszín adatok" field maps (ticket 006): a simple projection, a stylised border of
// Hungary, the two rivers, towns for orientation and the research fields. Coordinates are [lon, lat].
import { lakitelekSeasons } from './seasons'

export type LonLat = [number, number]

/** Equirectangular projection: 1 map unit = 1/100 degree of latitude ≈ 1.113 km; x is corrected with cos(47°). */
const K = 100
const COS = Math.cos((47 * Math.PI) / 180)
export const project = ([lon, lat]: LonLat): [number, number] => [(lon - 16) * COS * K, (48.65 - lat) * K]
/** Map units per metre */
export const UNITS_PER_METRE = 1 / 1113.2

// Simplified border (≈ 50 points), rivers as polylines: a locator map, not a survey
export const HU_BORDER: LonLat[] = [[16.11,46.87],[16.37,46.84],[16.52,46.50],[16.88,46.38],[17.18,46.20],[17.33,45.99],[17.63,45.93],[18.12,45.79],[18.45,45.75],[18.82,45.91],[19.29,45.99],[19.70,46.17],[20.10,46.17],[20.26,46.11],[20.76,46.27],[21.18,46.40],[21.30,46.62],[21.50,46.87],[21.68,47.05],[21.99,47.39],[22.13,47.62],[22.43,47.75],[22.68,47.79],[22.89,47.95],[22.60,48.10],[22.27,48.40],[21.73,48.35],[21.43,48.56],[20.95,48.52],[20.48,48.53],[20.25,48.28],[20.05,48.17],[19.75,48.20],[19.47,48.08],[19.03,48.07],[18.82,47.83],[18.40,47.75],[17.85,47.75],[17.48,47.87],[17.16,48.01],[17.09,47.71],[16.72,47.60],[16.43,47.69],[16.66,47.45],[16.45,47.40],[16.48,47.15],[16.43,47.00]]
export const DUNA: LonLat[] = [[17.16,48.01],[17.6,47.86],[18.0,47.75],[18.5,47.76],[18.88,47.82],[19.06,47.66],[19.05,47.45],[18.96,47.2],[18.93,46.9],[18.88,46.5],[18.86,45.93]]
export const TISZA: LonLat[] = [[22.3,48.15],[21.9,48.24],[21.45,48.14],[21.05,47.85],[20.65,47.6],[20.42,47.35],[20.25,47.12],[20.12,47.0],[20.07,46.93],[20.08,46.82],[20.16,46.55],[20.15,46.25],[20.1,46.17]]

export const TOWNS = {
  budapest: [19.04, 47.5] as LonLat,
  kecskemet: [19.69, 46.906] as LonLat,
  szeged: [20.148, 46.253] as LonLat,
  cegled: [19.8, 47.175] as LonLat,
  szolnok: [20.2, 47.175] as LonLat,
  nagykoros: [19.778, 47.034] as LonLat,
  tiszakecske: [20.095, 46.936] as LonLat,
}

/** Research fields, from the researchers' Google My Maps (2026-11-08). Two points = the ends of one long side. */
export const SITE_POINTS = {
  /** North-west corner of the 7-parcel field */
  lakitelek: [20.00579, 46.91406] as LonLat,
  szentkiralyOnion: [[19.84286, 46.92441], [19.84765, 46.92592]] as LonLat[],
  szentkiralyTomato: [[19.86722, 46.93885], [19.87077, 46.93607]] as LonLat[],
  kecskemetBorbas: [[19.82227, 46.93469], [19.81573, 46.93433]] as LonLat[],
}

const mid = (pts: LonLat[]): LonLat => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]
/** One dot per site on the regional map */
export const SITE_DOTS = {
  lakitelek: SITE_POINTS.lakitelek,
  szentkiraly: mid([...SITE_POINTS.szentkiralyOnion, ...SITE_POINTS.szentkiralyTomato]),
  kecskemetBorbas: mid(SITE_POINTS.kecskemetBorbas),
}

/** A field of parallel strips (parcels), drawn from one corner along its long axis */
export interface StripField {
  /** Corner the strips start from */
  start: LonLat
  /** Long axis, degrees clockwise from east */
  angleDeg: number
  /** Strip length and width in metres (estimates where not surveyed) */
  length: number
  stripWidth: number
  strips: { label: string; spade: boolean }[]
}

/** One field on the map: a plain outline (with a crop label under it) or a field of strips */
export interface MapField {
  id: string
  /** Label under an outlined field, e.g. "Vöröshagyma" */
  label?: string
  /** Smaller second line, e.g. "2025–2026" */
  sub?: string
  outline?: LonLat[]
  strips?: StripField
}

// metres east / north of a point, and back (local flat approximation, fine at field scale)
const M_LAT = 111_320
const mLon = (lat: number) => M_LAT * Math.cos((lat * Math.PI) / 180)
const offset = ([lon, lat]: LonLat, e: number, n: number): LonLat => [lon + e / mLon(lat), lat + n / M_LAT]

/**
 * A rectangle from two opposite corners and the direction of its long side (degrees counter-clockwise
 * from east, read off the satellite image). The surveyed corners stay exact; the image only gives the angle.
 */
export function rectFromDiagonal(a: LonLat, c: LonLat, axisDeg: number): LonLat[] {
  const e = (c[0] - a[0]) * mLon(a[1]), n = (c[1] - a[1]) * M_LAT
  const r = (axisDeg * Math.PI) / 180
  const u = [Math.cos(r), Math.sin(r)], v = [Math.sin(r), -Math.cos(r)]
  const lu = e * u[0] + n * u[1], lv = e * v[0] + n * v[1]
  return [a, offset(a, u[0] * lu, u[1] * lu), c, offset(a, v[0] * lv, v[1] * lv)]
}

/** A rectangle along the line a → b (the ends of its long axis), `width` metres wide, centred on the line */
export function rectAlong(a: LonLat, b: LonLat, width: number): LonLat[] {
  const e = (b[0] - a[0]) * mLon(a[1]), n = (b[1] - a[1]) * M_LAT
  const len = Math.hypot(e, n), pe = (-n / len) * (width / 2), pn = (e / len) * (width / 2)
  return [offset(a, pe, pn), offset(b, pe, pn), offset(b, -pe, -pn), offset(a, -pe, -pn)]
}

/** Szentkirály, onion: the two points are opposite corners (SW and E); long side ~58° (image) → ≈ 336 × 220 m */
export const szentkiralyOnionField: MapField = {
  id: 'onion',
  label: 'Vöröshagyma',
  sub: '2025–2026',
  outline: rectFromDiagonal(SITE_POINTS.szentkiralyOnion[0], SITE_POINTS.szentkiralyOnion[1], 58),
}

/**
 * Szentkirály, tomato (2026): two 1.4 ha fields side by side. The two points are taken as the ends of the
 * long axis (≈ 410 m); the width gives the 2.8 ha. To be confirmed: on the image the field runs ~31°, the
 * points give ~49°.
 */
export const szentkiralyTomatoField: MapField = {
  id: 'tomato',
  label: 'Ipari paradicsom',
  sub: '2026',
  outline: rectAlong(SITE_POINTS.szentkiralyTomato[0], SITE_POINTS.szentkiralyTomato[1], 68),
}

/** Kecskemét-Borbás: opposite corners (E and W); long side rises ~19° to the east (image) → ≈ 480 × 128 m */
export const kecskemetBorbasField: MapField = {
  id: 'borbas',
  label: 'Ipari paradicsom',
  sub: '2025',
  outline: rectFromDiagonal(SITE_POINTS.kecskemetBorbas[1], SITE_POINTS.kecskemetBorbas[0], 19.6),
}

/** Lakitelek: 7 parcels side by side, I. on the north-east edge (to be confirmed); ~260 × 12 m each (estimate) */
export const lakitelekField: StripField = {
  start: SITE_POINTS.lakitelek,
  angleDeg: 37,
  length: 260,
  stripWidth: 12,
  strips: lakitelekSeasons.seasons[lakitelekSeasons.seasons.length - 1].parcels.map((p) => ({
    label: p.num,
    spade: /ásógép/i.test(p.treatment),
  })),
}

export const lakitelekMapField: MapField = { id: 'lakitelek', strips: lakitelekField }

/** "É 46,914° · K 20,006°" */
export const coordLabel = ([lon, lat]: LonLat) =>
  `É ${lat.toFixed(3).replace('.', ',')}° · K ${lon.toFixed(3).replace('.', ',')}°`

