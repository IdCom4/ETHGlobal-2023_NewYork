import { Module } from '@nestjs/common'
import { VehicleBrandsService } from '@Api/vehicles/brands/vehicle-brands.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleBrandRepository } from '@/repositories/vehicle/vehicle-brand.repository'
import { VehicleBrandsController } from '@Api/vehicles/brands/vehicle-brands.controller'

@Module({
  controllers: [VehicleBrandsController],
  imports: [TypegooseModule.forFeature([VehicleBrand])],
  providers: [VehicleBrandsService, VehicleBrandRepository],
  exports: [VehicleBrandsService, VehicleBrandRepository, TypegooseModule.forFeature([VehicleBrand])],
})
export class VehicleBrandsModule {}
