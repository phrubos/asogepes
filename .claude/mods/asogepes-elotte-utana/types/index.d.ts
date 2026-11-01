export type Metrics = {
  png: string
  left: number
  right: number
  width: number
  height: number
  above: number | null
  below: number | null
  margin: string
  padding: string
}

export type Snap = { page: string | null; results: Record<string, Metrics | null> }

export type Entry = {
  id: number
  file: string
  selector: string
  before: Snap | null
  after: Snap | null
  isPending: boolean
}

declare module 'claude-code' {
  interface PluginState {
    'asogepes-elotte-utana': {
      isOn: Shaped<boolean>
      entries: Shaped<Entry[]>
    }
  }
}
