export {}

declare global {
  interface IAddress {
    street?: string
    city?: string
    zipCode?: string
    coordinates?: [number, number]
  }

  // eslint-disable-next-line prettier/prettier
  interface IStrictAddress implements IAddress {
    street: string
    city: string
    zipCode: string
    coordinates: [number, number]
  }

  interface ILenientAddress {
    street: string
    city: string
    zipCode: string
    coordinates?: [number, number]
  }
}
