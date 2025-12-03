import SolutionLayout from '@/components/solution-v2/SolutionLayout'
import MachineBlueprint from '@/components/solution-v2/MachineBlueprint'
import BenefitsGrid from '@/components/solution-v2/BenefitsGrid'
import ModelComparison from '@/components/solution-v2/ModelComparison'
import styles from '@/components/solution-v2/SolutionNew.module.css'

export const metadata = {
  title: 'A Megoldás | Ásógépes Technológia',
  description: 'Ismerje meg az Imants ásógépek működését. Dupla rotoros technológia, amely megőrzi a talaj szerkezetét.',
}

export default function MegoldasPage() {
  return (
    <SolutionLayout>
      <div className={styles.blueprintGrid}>
        <MachineBlueprint />
        <BenefitsGrid />
      </div>
      <ModelComparison />
    </SolutionLayout>
  )
}
