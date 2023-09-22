export {}

declare global {
  type TVehicleType = 'priceTTC2Wheels' | 'priceTTC2Seats' | 'priceTTC5Seats' | 'priceTTC7Seats'
  type TVehicleTypePrices = Partial<Record<TVehicleType, number>>
}
