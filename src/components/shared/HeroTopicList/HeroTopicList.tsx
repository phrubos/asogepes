'use client'

import { ArrowDown } from 'lucide-react'
import styles from './HeroTopicList.module.css'

export interface HeroTopic {
    id: string
    title: string
    desc?: string
    /** Short gold figure before the title (the row number); rows without it span the full width */
    lead?: string
}

/** Phones and tablets: the hero's way into the page, a contents list of the sections below (hidden above 1024px) */
export default function HeroTopicList({ topics, onSelect, label }: { topics: HeroTopic[]; onSelect: (id: string) => void; label: string }) {
    const hasLead = topics.some(t => t.lead)
    return (
        <nav className={`${styles.topicList} hero-rise`} style={{ animationDelay: '200ms' }} aria-label={label}>
            {topics.map(({ id, title, desc, lead }) => (
                <button key={id} type="button" className={`${styles.topicItem} ${hasLead ? styles.withLead : ''}`} onClick={() => onSelect(id)}>
                    {hasLead && <span className={styles.topicLead}>{lead}</span>}
                    <span className={styles.topicText}>
                        <span className={styles.topicTitle}>{title}</span>
                        {desc && <span className={styles.topicDesc}>{desc}</span>}
                    </span>
                    <ArrowDown size={18} className={styles.topicArrow} aria-hidden="true" />
                </button>
            ))}
        </nav>
    )
}
