export {}

declare global {
  interface IGlobalEvent {
    type: GlobalEventTypes
    payload?: unknown
  }
}
