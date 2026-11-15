import ResearchScrollLayout from '@/components/experiment/ResearchScrollLayout'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'

export const metadata = pageMetadata('research', 'en', PAGE_TEXT.research.en)

export default function EnglishResearchPage() {
  return (
    <ResearchScrollLayout />
  )
}
