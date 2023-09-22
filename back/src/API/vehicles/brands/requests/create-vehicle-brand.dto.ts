import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'

export class CreateVehicleBrandRequest {
  @ApiProperty({ example: 'Peugeot', description: 'Nom de la marque', required: true })
  @IsNotEmpty({ message: 'Le nom de la marque est requis' })
  name: string

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR, description: 'Type de véhicule', required: true })
  @IsNotEmpty({ message: 'Le type de véhicule est requis' })
  @IsEnum(VehicleType, { message: 'Le type de véhicule est invalide' })
  vehicleType: VehicleType
}
