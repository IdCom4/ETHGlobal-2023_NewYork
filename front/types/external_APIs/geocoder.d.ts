export {}

declare global {
  interface IFeatureContext {
    id: string
    text: string
  }

  type IStreetFeatureContext = IFeatureContext
  type ICityFeatureContext = IFeatureContext
  type IZipCodeFeatureContext = IFeatureContext
  type IRegionFeatureContext = IFeatureContext
  type ICountryFeatureContext = IFeatureContext

  interface IMapboxFeature {
    address?: string
    text?: string
    center: [number, number]
    context: IFeatureContext[]
    place_name: string
  }

  interface IGeocoderData {
    features: IMapboxFeature[]
  }
}
