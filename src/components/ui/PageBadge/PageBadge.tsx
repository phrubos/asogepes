'use client'

import styles from './PageBadge.module.css'

interface PageBadgeProps {
  number?: string;
  label: string;
}

export default function PageBadge({ number, label }: PageBadgeProps) {
  return (
    <div className={styles.badge}>
      {number && (
        <>
          <span className={styles.number}>{number}</span>
          <span className={styles.divider} />
        </>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  )
}
