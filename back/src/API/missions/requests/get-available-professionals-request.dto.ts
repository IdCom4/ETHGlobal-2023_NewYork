import { StrictAddressDTO } from '@/common/request-io/request-dto'
import { Type } from 'class-transformer'
import { IsMongoId, IsNotEmpty, Min, ValidateNested } from 'class-validator'

export class GetAvailableProfessionalsRequest {
  @IsNotEmpty({ message: "Vous devez renseigner l'adresse de prise en charge du véhicule" })
  @Type(() => StrictAddressDTO)
  @ValidateNested()
  address: StrictAddressDTO

  @IsNotEmpty({ message: 'Vous devez renseigner la distance maximum que vous être prêt à parcourir' })
  @Min(0, { message: 'La distance maximum ne peut pas être négative' })
  maxDistance: number

  @IsNotEmpty({ message: 'Vous devez renseigner au moins un problème' })
  @IsMongoId({ message: "Format d'Id invalide", each: true })
  issueIds: string[]
}
