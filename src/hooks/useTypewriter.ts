'use client'

import { useState, useEffect } from 'react'

interface UseTypewriterOptions {
    text: string
    typingSpeed?: number
    deletingSpeed?: number
    pauseBeforeDelete?: number
    pauseBeforeRestart?: number
    initialDelay?: number
}

export function useTypewriter({
    text,
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseBeforeDelete = 10000,
    pauseBeforeRestart = 500,
    initialDelay = 1000
}: UseTypewriterOptions) {
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [hasInitialDelay, setHasInitialDelay] = useState(true)

    useEffect(() => {
        // Initial delay before starting
        if (hasInitialDelay) {
            const initialTimeout = setTimeout(() => {
                setHasInitialDelay(false)
            }, initialDelay)
            return () => clearTimeout(initialTimeout)
        }

        let timeout: NodeJS.Timeout

        if (isTyping && !isDeleting) {
            if (displayText.length < text.length) {
                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length + 1))
                }, typingSpeed)
            } else {
                // Finished typing, wait before deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true)
                }, pauseBeforeDelete)
            }
        } else if (isDeleting) {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1))
                }, deletingSpeed)
            } else {
                // Finished deleting, restart typing
                timeout = setTimeout(() => {
                    setIsDeleting(false)
                    setIsTyping(true)
                }, pauseBeforeRestart)
            }
        }

        return () => clearTimeout(timeout)
    }, [displayText, isTyping, isDeleting, hasInitialDelay, text, typingSpeed, deletingSpeed, pauseBeforeDelete, pauseBeforeRestart, initialDelay])

    return displayText
}
