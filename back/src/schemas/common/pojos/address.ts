import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'
import { LenientAddressDTO, StrictAddressDTO } from '@Common/request-io/request-dto/address.dto'

export abstract class Address {
  @prop({ type: String })
  @Expose({ name: 'street' })
  protected _street!: string

  @prop({ type: String })
  @Expose({ name: 'city' })
  protected _city!: string

  @prop({ type: String })
  @Expose({ name: 'zipCode' })
  protected _zipCode!: string

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get street():  string  { return this._street   }
  public get city():    string  { return this._city     }
  public get zipCode(): string  { return this._zipCode  }
  /* eslint-enable prettier/prettier */
}

export class StrictAddress extends Address {
  @prop()
  @Expose({ name: 'coordinates' })
  protected _coordinates!: [number, number]

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  static of(street: string, city: string, zipCode: string, coordinates: [number, number]): StrictAddress {
    const address = new StrictAddress()
    address._street = street
    address._city = city
    address._zipCode = zipCode
    address._coordinates = coordinates

    return address
  }

  static fromRequest(strictAddressDTO: StrictAddressDTO): StrictAddress {
    return StrictAddress.of(strictAddressDTO.street, strictAddressDTO.city, strictAddressDTO.zipCode, strictAddressDTO.coordinates)
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get coordinates():  [number, number]  { return this._coordinates   }
  /* eslint-enable prettier/prettier */
}

export class LenientAddress extends Address {
  @prop()
  @Expose({ name: 'coordinates' })
  protected _coordinates?: [number, number]

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  static of(street: string, city: string, zipCode: string, coordinates?: [number, number]): LenientAddress {
    const address = new LenientAddress()
    address._street = street
    address._city = city
    address._zipCode = zipCode
    address._coordinates = coordinates

    return address
  }

  static fromRequest(lenientAddressDTO: LenientAddressDTO): LenientAddress {
    return LenientAddress.of(lenientAddressDTO.street, lenientAddressDTO.city, lenientAddressDTO.zipCode, lenientAddressDTO.coordinates)
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get coordinates():  [number, number] | undefined  { return this._coordinates   }
  /* eslint-enable prettier/prettier */
}

export abstract class AddressBlueprint extends Address {
  _street: string
  _city: string
  _zipCode: string
}

export abstract class StrictAddressBlueprint extends StrictAddress {
  _street: string
  _city: string
  _zipCode: string
  _coordinates: [number, number]
}

export abstract class LenientAddressBlueprint extends LenientAddress {
  _street: string
  _city: string
  _zipCode: string
  _coordinates?: [number, number]
}
