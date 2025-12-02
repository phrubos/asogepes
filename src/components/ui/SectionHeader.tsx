import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  number: string
  title: string
  light?: boolean
}

export default function SectionHeader({ number, title, light = false }: SectionHeaderProps) {
  return (
    <div className={`${styles.sectionHeader} ${light ? styles.light : ''}`}>
      <span className={styles.sectionNumber}>{number}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  )
}
