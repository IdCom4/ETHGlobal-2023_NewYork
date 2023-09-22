import { LenientAddress, StrictAddress } from '@/schemas/common/pojos'
import { ArrayMaxSize, ArrayMinSize, IsNotEmpty, IsOptional, Length } from 'class-validator'

export abstract class AddressDTO {
  @IsNotEmpty({ message: "La rue de l'adresse est requise" })
  @Length(1, 100, { message: 'La rue doit faire entre 1 et 100 caractères' })
  street: string

  @IsNotEmpty({ message: "La ville de l'adresse est requise" })
  @Length(1, 50, { message: 'La ville doit faire entre 1 et 50 caractères' })
  city: string

  @IsNotEmpty({ message: "Le code postal de l'adresse est requise" })
  @Length(5, 5, { message: 'Le code postal doit faire exactement 5 chiffres' })
  zipCode: string
}

export class StrictAddressDTO extends AddressDTO {
  @IsNotEmpty({ message: "Les coordonnées GPS de l'adresse sont requises" })
  @ArrayMinSize(2, { message: 'Les coordonnées doivent contenir exactement 2 nombres' })
  @ArrayMaxSize(2, { message: 'Les coordonnées doivent contenir exactement 2 nombres' })
  coordinates!: [number, number]

  public toStrictAddress(): StrictAddress {
    return StrictAddress.fromRequest(this)
  }
}

export class LenientAddressDTO extends AddressDTO {
  @IsOptional()
  @ArrayMinSize(2, { message: 'Les coordonnées doivent contenir exactement 2 nombres' })
  @ArrayMaxSize(2, { message: 'Les coordonnées doivent contenir exactement 2 nombres' })
  coordinates?: [number, number]

  public toLenientAddress(): LenientAddress {
    return LenientAddress.fromRequest(this)
  }
}
