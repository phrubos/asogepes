import ProblemLayout from '@/components/problem/ProblemLayout'
import CompactionView from '@/components/problem/CompactionView'
import PloughingView from '@/components/problem/PloughingView'

export const metadata = {
  title: 'A Probléma | Ásógépes Technológia',
  description: 'Miért nem elég a hagyományos szántás? Ismerje meg a talajtömörödés és a forgatásos művelés hátrányait.',
}

export default function ProblemaPage() {
  return (
    <ProblemLayout 
      compactionContent={<CompactionView />}
      ploughingContent={<PloughingView />}
    />
  )
}
