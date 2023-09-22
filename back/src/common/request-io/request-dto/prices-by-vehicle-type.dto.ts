import { PricesByVehicleType } from '@/schemas/center-service/pojos'
import { IsOptional, IsPositive } from 'class-validator'

export class PricesByVehicleTypeDTO {
  @IsOptional() @IsPositive() priceTTC2Wheels?: number
  @IsOptional() @IsPositive() priceTTC2Seats?: number
  @IsOptional() @IsPositive() priceTTC5Seats?: number
  @IsOptional() @IsPositive() priceTTC7Seats?: number

  toPricesByVehicleType(): PricesByVehicleType {
    return new PricesByVehicleType(this.priceTTC2Wheels, this.priceTTC2Seats, this.priceTTC5Seats, this.priceTTC7Seats)
  }
}
