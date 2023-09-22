import { PricesByVehicleTypeDTO } from '@Common/request-io/request-dto/prices-by-vehicle-type.dto'
import { IsNotEmpty, Length, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateServiceOptionRequest {
  @ApiProperty({ example: 'Brosser à la brosse à dents', description: "Titre de l'option", required: true })
  @IsNotEmpty({ message: "Le titre de l'option ne peut être vide" })
  @Length(2, 50, { message: 'Le titre doit faire entre 2 et 50 caractères' })
  title: string

  @ApiProperty({ type: () => PricesByVehicleTypeDTO, description: "Prix de l'option par type de véhicule", required: true })
  @ValidateNested()
  @Type(() => PricesByVehicleTypeDTO)
  extraPrices: PricesByVehicleTypeDTO
}
