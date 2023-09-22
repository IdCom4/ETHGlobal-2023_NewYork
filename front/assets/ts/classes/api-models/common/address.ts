export class Address implements IAddress {
  street?: string
  city?: string
  zipCode?: string
  coordinates?: [number, number]

  constructor(address: IAddress) {
    this.street = address.street
    this.city = address.city
    this.zipCode = address.zipCode
    this.coordinates = address.coordinates
  }

  toString(): string {
    return `${this.street}, ${this.zipCode} ${this.city}`
  }
}
