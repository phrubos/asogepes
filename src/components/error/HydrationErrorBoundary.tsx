'use client'

import React from 'react'

interface HydrationErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class HydrationErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  HydrationErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): HydrationErrorBoundaryState {
    // Check if it's a hydration mismatch error
    if (error.message.includes('Hydration failed') || 
        error.message.includes('data-jetski-tab-id') ||
        error.message.includes('server rendered HTML')) {
      return { hasError: true, error }
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log hydration errors in development
    if (process.env.NODE_ENV === 'development' && 
        (error.message.includes('Hydration failed') || 
         error.message.includes('data-jetski-tab-id'))) {
      console.warn('Hydration mismatch detected (likely from browser extension):', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      // For hydration errors, just render the children normally
      // The browser extension attributes will be handled by the client
      return this.props.children
    }

    return this.props.children
  }
}
