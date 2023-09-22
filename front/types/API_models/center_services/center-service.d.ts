export {}

declare global {
  interface ICenterService {
    id: string
    title: string
    subtitle: string
    optionsIds?: string[]
    prices?: TVehicleTypePrices
    serviceCategories?: string[]
    description?: ICenterDescription[]
    isActive: boolean
    picture: string
    alt?: string
    numberOfSales: number
  }
  interface IFrontOnlyCenterService extends ICenterService {
    isBestSale: boolean
  }
  interface ICenterDescription {
    title: string
    steps: string[]
  }
}
