export {}

declare global {
  interface INotificationTypes {
    email: boolean
    sms: boolean
  }

  interface INotification {
    title: string
    message: string
    link?: string
    createdAt: string
    seenAt?: string
  }
}
