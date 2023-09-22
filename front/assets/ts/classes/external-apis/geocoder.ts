import { FEATURE_CONTEXT_IDS } from '@/assets/ts/enums/external-apis'

export class MapboxFeature implements IMapboxFeature {
  public address?: string
  public text?: string
  public center: [number, number]
  public context: IFeatureContext[]
  public place_name: string

  constructor(feature: IMapboxFeature) {
    this.address = feature.address
    this.text = feature.text
    this.center = feature.center
    this.context = feature.context
    this.place_name = feature.place_name
  }

  toAddress(): IAddress {
    const cityContext = this.context.find((element) => element.id.includes(FEATURE_CONTEXT_IDS.CITY))
    const zipCodeContext = this.context.find((element) => element.id.includes(FEATURE_CONTEXT_IDS.ZIPCODE))
    const street = this.address && this.text ? `${this.address} ${this.text}` : undefined

    const address: IAddress = {
      street,
      city: cityContext?.text,
      zipCode: zipCodeContext?.text,
      coordinates: [this.center[1], this.center[0]]
    }

    return address
  }

  toStrictAddress(): IStrictAddress {
    const address = this.toAddress()

    if (!address.street) throw new Error('Adresse invalide, elle ne contient pas de rue')
    if (!address.city) throw new Error('Adresse invalide, elle ne contient pas de ville')
    if (!address.zipCode) throw new Error('Adresse invalide, elle ne contient pas de code postal')
    if (!address.coordinates || address.coordinates.length != 2) throw new Error('Adresse invalide, elle ne contient pas de coordonées GPS')

    return address as IStrictAddress
  }

  isStrict(): boolean {
    try {
      this.toStrictAddress()
      return true
    } catch (e) {
      return false
    }
  }
}
