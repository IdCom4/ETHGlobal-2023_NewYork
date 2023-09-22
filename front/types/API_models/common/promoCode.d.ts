export {}

declare global {
  interface IPromoCode {
    reductionPercentage: number
    from: Date
    to: Date
    isActive: boolean
    label: string
  }
}
