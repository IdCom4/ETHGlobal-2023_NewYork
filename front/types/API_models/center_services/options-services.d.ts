export {}

declare global {
  interface IServiceOption {
    id: string
    title: string
    optionPrice?: IPricesVehiclesTypes
    optionCategory: CenterServiceOptionCategories
  }
}
