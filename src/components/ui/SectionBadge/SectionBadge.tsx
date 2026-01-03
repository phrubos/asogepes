'use client'

import styles from './SectionBadge.module.css'

interface SectionBadgeProps {
  roman: string;
  label?: string;
}

export default function SectionBadge({ roman, label }: SectionBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={styles.roman}>{roman}.</span>
      {label && (
        <>
          <span className={styles.divider} />
          <span className={styles.label}>{label}</span>
        </>
      )}
    </div>
  )
}
