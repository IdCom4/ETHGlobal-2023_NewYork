export {}

declare global {
  interface IIssue {
    _id: string
    label: string
    skillIds: string[]
  }
}
