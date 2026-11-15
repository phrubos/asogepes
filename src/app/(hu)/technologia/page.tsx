import TechnologyScrollLayout from '@/components/solution-v2/TechnologyScrollLayout'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'

export const metadata = pageMetadata('technology', 'hu', PAGE_TEXT.technology.hu)

export default function HungarianTechnologyPage() {
  return (
    <TechnologyScrollLayout />
  )
}
