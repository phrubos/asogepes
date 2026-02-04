import React from 'react'
import styles from './PhotoViewer.module.css'

interface FormattedTextProps {
    text: string
    className?: string
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
    if (!text) return null

    // 1. Detect Structured Definitions (e.g., "A": Value, "B": Value)
    // Matches: "Key": or Key: patterns at start of sentences or distinct phrases
    const definitionRegex = /(?:^|\s)["']?([A-Z](?:-[A-Z])?)["']?:\s/

    if (definitionRegex.test(text)) {
        // Split by the pattern to create list items
        // We use a slightly complex split to capture the key
        const parts = text.split(/["']?([A-Z](?:-[A-Z])?)["']?:\s/)

        // parts[0] is the intro text
        // parts[1] is Key1 ("A"), parts[2] is Value1
        // parts[3] is Key2 ("B"), parts[4] is Value2...

        const intro = parts[0]
        const definitions = []

        for (let i = 1; i < parts.length; i += 2) {
            definitions.push({
                key: parts[i],
                value: parts[i + 1]
            })
        }

        return (
            <div className={className}>
                {intro.trim() && (
                    <p className={styles.introText}>
                        <FormatInline text={intro} />
                    </p>
                )}
                <ul className={styles.definitionList}>
                    {definitions.map((def, idx) => (
                        <li key={idx} className={styles.definitionItem}>
                            <span className={styles.definitionKey}>{def.key}</span>
                            <span className={styles.definitionValue}>
                                <FormatInline text={def.value} />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    // Fallback for standard text
    return (
        <p className={className}>
            <FormatInline text={text} />
        </p>
    )
}

// Helper for inline formatting (numbers, percentages, and explicit [[text]])
const FormatInline = ({ text }: { text: string }) => {
    if (!text) return null

    // Regex for inline highlights:
    // 1. Explicit highlights: [[text]]
    // 2. Percentages (e.g., "54%", "12,5%")
    // 3. Roman numerals with extensions (e.g., "II.", "III.-es", "V.-ös")
    // 4. Quantities with units (e.g., "11 m", "9 sor", "4 kezelés")
    // 5. Standalone measurement values (fallback for strict matches)

    // Normalize quotes to standard "
    const encodedText = text.replace(/[""]/g, '"')

    // Updated regex to include \[\[(.*?)\]\] as the first capturing group
    const regex = /(?:(\[\[.*?\]\])|(\d+(?:[.,]\d+)?%)|\b([IVXLCDM]+\.)|\b(\d+(?:[.,]\d+)?\s+(?:méter|m|cm|mm|km|sor|kezelés|db|alkalom|°C))\b)/g

    const parts = encodedText.split(regex)

    return (
        <>
            {parts.map((part, index) => {
                if (!part) return null

                // Check for explicit [[text]] pattern
                if (part.startsWith('[[') && part.endsWith(']]')) {
                    const content = part.slice(2, -2); // Remove [[ and ]]
                    return (
                        <span key={index} className={styles.highlightBadge}>
                            {content}
                        </span>
                    )
                }

                // Existing checks for auto-highlighting
                if (
                    /^\d+(?:[.,]\d+)?%$/.test(part) ||
                    /^[IVXLCDM]+\..*$/.test(part) ||
                    /^\d+.*$/.test(part)
                ) {
                    return (
                        <span key={index} className={styles.highlightBadge}>
                            {part}
                        </span>
                    )
                }

                return part
            })}
        </>
    )
}
