'use client'

import { locations } from '@/lib/data'
import { lakitelekSeasons, LAKITELEK_YEARS } from '@/lib/seasons'
import { lakitelekMapField } from '@/lib/field-maps'
import { useSeason } from '../season/SeasonContext'
import SeasonSwitch from '../season/SeasonSwitch'
import { inYear } from '../season/SeasonOnly'
import FieldMapCard from '../fieldmap/FieldMapCard'
import SiteInfoLayout, { siteFacts } from '../fieldmap/SiteInfoLayout'

const data = locations.lakitelek
const FIELDS = [lakitelekMapField]

export default function LakitelekInfoPage() {
  const { year } = useSeason()
  const seasons = lakitelekSeasons.seasons
  const season = seasons.find((s) => s.year === year) ?? seasons[seasons.length - 1]
  const info = season.info
  const prev = seasons.filter((s) => s.year < season.year).pop()

  const lead = [
    'Hét művelési kombináció egymás mellett, azonos körülmények között.',
    info.base && `${info.base}; ${inYear(season.year)} ${info.crop.toLowerCase()} a kultúra.`,
  ].filter(Boolean).join(' ')

  return (
    <SiteInfoLayout
      badge="03. helyszín"
      season={<SeasonSwitch years={LAKITELEK_YEARS} small />}
      title={data.name}
      lead={lead}
      facts={siteFacts(info, prev && { year: prev.year, crop: prev.info.crop })}
      factsKey={season.year}
      map={<FieldMapCard site="lakitelek" title="Lakitelek · kísérleti tábla" fields={FIELDS} showKey />}
    />
  )
}
