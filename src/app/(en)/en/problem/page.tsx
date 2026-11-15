import ProblemScrollLayout from '@/components/problem/ProblemScrollLayout'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'

export const metadata = pageMetadata('problem', 'en', PAGE_TEXT.problem.en)

export default function EnglishProblemPage() {
  return (
    <ProblemScrollLayout />
  )
}
