export type LayoutRun = { isPassed: boolean; problems: number; at: number }

declare module 'claude-code' {
  interface PluginState {
    'asogepes-qa': {
      lastLayout: Shaped<LayoutRun | null>
      isCssDirty: Shaped<boolean>
      isChecking: Shaped<boolean>
    }
  }
}
