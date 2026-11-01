import styles from './StaticChallenge.module.css'

/** A problem shown in place (icon, title, text) — phones and tablets use it instead of a card that opens */
export default function StaticChallenge({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className={styles.item}>
            <div className={styles.icon} aria-hidden="true">{icon}</div>
            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                {children}
            </div>
        </div>
    )
}
