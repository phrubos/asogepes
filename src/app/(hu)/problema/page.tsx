import ProblemScrollLayout from '@/components/problem/ProblemScrollLayout'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'

export const metadata = pageMetadata('problem', 'hu', PAGE_TEXT.problem.hu)

export default function HungarianProblemPage() {
  return (
    <ProblemScrollLayout />
  )
}
