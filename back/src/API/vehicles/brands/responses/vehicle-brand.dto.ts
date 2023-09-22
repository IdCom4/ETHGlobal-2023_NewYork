import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'
import { ApiProperty } from '@nestjs/swagger'

export class VehicleBrandResponse {
  @ApiProperty({ type: String, example: '64a42bfe9612999c64c7ff59', required: true })
  _id: string

  @ApiProperty({ type: String, example: 'Peugeot', required: true })
  name: string

  @ApiProperty({ type: String, example: 'CAR', required: true })
  vehicleType: VehicleType
  constructor(vehicleBrand: VehicleBrand) {
    this._id = vehicleBrand._id.toString()
    this.name = vehicleBrand.name
    this.vehicleType = vehicleBrand.vehicleType
  }
}
