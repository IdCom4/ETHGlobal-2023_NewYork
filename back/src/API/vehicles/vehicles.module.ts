import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { VehiclesController } from '@Api/vehicles/vehicles.controller'
import { VehiclesService } from '@Api/vehicles/vehicles.service'
import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { VehicleBrandsModule } from '@Api/vehicles/brands/vehicle-brands.module'
import { VehicleRepository } from '@/repositories/vehicle/vehicle.repository'
import { UsersModule } from '../users/users.module'

@Module({
  controllers: [VehiclesController],
  imports: [TypegooseModule.forFeature([Vehicle]), VehicleBrandsModule, UsersModule],
  providers: [VehiclesService, VehicleRepository],
  exports: [VehiclesService, VehicleRepository, TypegooseModule.forFeature([Vehicle])],
})
export class VehiclesModule {}
