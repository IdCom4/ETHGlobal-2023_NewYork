export {}

declare global {
  type ALERT_MODE = 'all' | 'none' | 'on-success' | 'on-error'

  type AlertStatuses = 'success' | 'error'

  interface IAlertControl {
    mode: ALERT_MODE
    successMsg?: string
    errorMsg?: string
    persistant?: boolean
    durationInMs?: number
  }

  interface IAlert {
    status: AlertStatuses
    message: string
    persistant: boolean
    durationInMs: number
  }
}
