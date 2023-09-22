export {}

declare global {
  interface CenterClientNotifications {
    bookingValidated: INotificationTypes
    bookingCanceled: INotificationTypes
  }

  interface CenterClientProfile {
    cgu: boolean
    notificationPreferences: CenterClientNotifications
    bookingsId?: string[]
    customerId?: string
  }
}
