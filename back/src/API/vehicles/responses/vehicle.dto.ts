import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GuestVehicleResponse {
  @ApiProperty({ type: String, example: '64b793a211feb4d567223423', required: true })
  @Expose()
  _id: string

  @ApiProperty({ type: String, example: '64a42bfe9612999c64c7ff59', required: true })
  @Expose()
  ownerId: string

  @ApiProperty({ type: String, example: '208', required: true })
  @Expose()
  model: string

  @ApiProperty({ type: String, example: 'Peugeot', required: true })
  @Expose()
  brand: string

  @ApiProperty({ type: Number, example: 2015, required: true })
  @Expose()
  year: number

  @ApiProperty({ type: String, example: 'AA-123-AA', required: true })
  @Expose()
  plate: string

  @ApiProperty({ type: Number, example: 100000, required: true })
  @Expose()
  mileage: number

  constructor(vehicle: Vehicle, brandName?: string) {
    this._id = vehicle._id.toString()
    this.ownerId = vehicle.ownerId
    this.model = vehicle.model
    this.brand = brandName || 'Marque inconnue'
    this.year = vehicle.year
    this.plate = vehicle.plate
    this.mileage = vehicle.mileage
  }
}

export class OwnerVehicleResponse extends GuestVehicleResponse {
  @ApiProperty({ type: [String], example: ['64a42bfe9612999c64c7ff59'], required: true })
  @Expose()
  invoiceIds: string[]

  constructor(vehicle: Vehicle, brandName: string) {
    super(vehicle, brandName)
    this.invoiceIds = vehicle.invoiceIds
  }
}

export class AdminVehicleResponse extends OwnerVehicleResponse {
  @Expose()
  deletedAt?: Date

  constructor(vehicle: Vehicle, brandName: string) {
    super(vehicle, brandName)
    this.deletedAt = vehicle.deletedAt
  }
}
