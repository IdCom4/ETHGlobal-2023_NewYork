import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'

export class UpdateVehicleBrandRequest {
  @ApiProperty({ example: 'Peugeot', description: 'Nom de la marque', required: true })
  @IsOptional()
  name?: string

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR, description: 'Type de véhicule', required: true })
  @IsOptional()
  vehicleType?: VehicleType
}
