import ResearchScrollLayout from '@/components/experiment/ResearchScrollLayout'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'

export const metadata = pageMetadata('research', 'hu', PAGE_TEXT.research.hu)

export default function HungarianResearchPage() {
  return (
    <ResearchScrollLayout />
  )
}
