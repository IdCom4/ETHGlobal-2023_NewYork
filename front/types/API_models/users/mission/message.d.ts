export {}

declare global {
  interface IMessage {
    index: number
    content: string
    senderId: string
    receiverId: string
    sentAt: Date = new Date()
    bySystem: boolean = false
  }
}
