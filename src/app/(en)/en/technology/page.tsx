import TechnologyScrollLayout from '@/components/solution-v2/TechnologyScrollLayout'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'

export const metadata = pageMetadata('technology', 'en', PAGE_TEXT.technology.en)

export default function EnglishTechnologyPage() {
  return (
    <TechnologyScrollLayout />
  )
}
