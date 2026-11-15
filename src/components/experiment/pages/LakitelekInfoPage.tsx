'use client'

import { locations } from '@/lib/data'
import { lakitelekSeasons } from '@/lib/seasons'
import { lakitelekMapField } from '@/lib/field-maps'
import { useSeason } from '../season/SeasonContext'
import SiteYearSwitch from '../season/SiteYearSwitch'
import { inYear } from '../season/SeasonOnly'
import FieldMapCard from '../fieldmap/FieldMapCard'
import SiteInfoLayout, { siteFacts } from '../fieldmap/SiteInfoLayout'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { useResearchData } from '@/lib/i18n/useResearchData'

const FIELDS = [lakitelekMapField]

export default function LakitelekInfoPage() {
  const { year } = useSeason()
  const locale = useLocale()
  const en = locale === 'en'
  const data = useResearchData(locations).lakitelek
  const lk = useResearchData(lakitelekSeasons)
  const seasons = lk.seasons
  const season = seasons.find((s) => s.year === year) ?? seasons[seasons.length - 1]
  const info = season.info
  const prev = seasons.filter((s) => s.year < season.year).pop()

  const lead = [
    en ? 'Seven tillage combinations side by side, under the same conditions.' : 'Hét művelési kombináció egymás mellett, azonos körülmények között.',
    info.base && (en ? `${info.base}; in ${season.year} the field is under ${info.crop.toLowerCase()}.` : `${info.base}; ${inYear(season.year)} ${info.crop.toLowerCase()} van a táblán.`),
  ].filter(Boolean).join(' ')

  return (
    <SiteInfoLayout
      badge={en ? 'Site 03' : '03. helyszín'}
      season={<SiteYearSwitch site="lakitelek" small />}
      title={data.name}
      lead={lead}
      facts={siteFacts(info, prev && { year: prev.year, crop: prev.info.crop }, locale)}
      factsKey={season.year}
      map={<FieldMapCard site="lakitelek" title={en ? 'Lakitelek · trial field' : 'Lakitelek · kísérleti tábla'} fields={FIELDS} showKey />}
    />
  )
}
