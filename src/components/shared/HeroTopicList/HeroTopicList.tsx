'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import styles from './HeroTopicList.module.css'

export interface HeroTopic {
    id: string
    title: string
    desc: string
    icon: LucideIcon
}

/** Phones and tablets: the hero's way into the page, a plain list of tappable sections (hidden above 1024px) */
export default function HeroTopicList({ topics, onSelect, label }: { topics: HeroTopic[]; onSelect: (id: string) => void; label: string }) {
    return (
        <nav className={`${styles.topicList} hero-rise`} style={{ animationDelay: '200ms' }} aria-label={label}>
            {topics.map(({ id, title, desc, icon: Icon }) => (
                <button key={id} type="button" className={styles.topicItem} onClick={() => onSelect(id)}>
                    <span className={styles.topicIcon}><Icon size={20} aria-hidden="true" /></span>
                    <span className={styles.topicText}>
                        <span className={styles.topicTitle}>{title}</span>
                        <span className={styles.topicDesc}>{desc}</span>
                    </span>
                    <ChevronRight size={20} className={styles.topicChevron} aria-hidden="true" />
                </button>
            ))}
        </nav>
    )
}
