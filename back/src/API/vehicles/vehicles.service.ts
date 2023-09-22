import { VehicleRepository } from '@/repositories/vehicle/vehicle.repository'
import { VehicleNotFoundException } from '@Common/exceptions/schemas/vehicles/vehicle-not-found.exception'
import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { VehicleAlreadyExistException } from '@Common/exceptions/schemas/vehicles/vehicle-already-exist.exception'
import { VehicleBrandsService } from '@Api/vehicles/brands/vehicle-brands.service'
import { Injectable } from '@nestjs/common'
import '@/extensions'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { User } from '@/schemas/user'
import { UserRepository } from '@/repositories'

@Injectable()
export class VehiclesService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly vehicleBrandsService: VehicleBrandsService,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Get a vehicle by its id.
   *
   * @param {String} vehicleId The vehicle id.
   * @param {String} userId The user id. If provided, the vehicle will be checked to be owned by the user.
   * @return {Vehicle} The vehicle.
   *
   * @throws {VehicleNotFoundException} If the vehicle is not found.
   */
  public async getVehicleById(vehicleId: string, userId?: string): Promise<{ vehicle: Vehicle; brandName: string }> {
    const vehicle = await this.vehicleRepository.findActiveById(vehicleId).getOrThrow(new VehicleNotFoundException())
    if (userId && vehicle.ownerId !== userId) throw new VehicleNotFoundException()

    const relatedBrand = await this.vehicleBrandsService.getVehicleBrandById(vehicle.brandId)

    return { vehicle, brandName: relatedBrand.name }
  }

  /**
   * Get all vehicles of an owner.
   *
   * @param ownerId The owner id.
   * @return {Vehicle[]} The vehicle of the owner.
   */
  public async getVehiclesOfOwner(ownerId: string): Promise<{ vehicles: Array<Vehicle>; brandNames: Map<string, string> }> {
    const vehicles = await this.vehicleRepository.findManyActiveBy({ _ownerId: ownerId }).getOr([])
    const associatedBrands = await this.vehicleBrandsService.getManyVehicleBrandById(vehicles.map((vehicle) => vehicle.brandId))
    const brandsMap = associatedBrands.reduce((acc: Map<string, string>, vehicleBrand: VehicleBrand) => {
      acc.set(vehicleBrand._id.toString(), vehicleBrand.name)
      return acc
    }, new Map<string, string>())

    return { vehicles, brandNames: brandsMap }
  }

  /**
   * Create a new vehicle.
   *
   * @param {User} owner The owner of the vehicle.
   * @param {String} model The model of the vehicle.
   * @param {String} brand The brand of the vehicle.
   * @param {Number} year The year of the vehicle.
   * @param {String} plate The plate of the vehicle.
   * @param {Number} mileage The mileage of the vehicle.
   * @return {Vehicle} The created vehicle.
   */
  public async createVehicle(
    owner: User,
    model: string,
    brand: string,
    year: number,
    plate: string,
    mileage: number
  ): Promise<{ vehicle: Vehicle; brandName: string }> {
    if (await this.vehicleRepository.findBy({ _plate: plate }).getOrNull()) throw new VehicleAlreadyExistException()

    const createdVehicle = await this.vehicleRepository.create(Vehicle.of(owner._id.toString(), model, brand, year, plate, mileage))

    owner.addVehicle(createdVehicle)
    await this.userRepository.updateAsIs(owner)

    const relatedBrand = await this.vehicleBrandsService.getVehicleBrandById(createdVehicle.brandId, { deletedFallbackData: false })

    return { vehicle: createdVehicle, brandName: relatedBrand.name }
  }

  /**
   * Update a vehicle using user mechanisms.
   *
   * @param {String} updatingUserId The id of the user that is updating the vehicle.
   * @param {String} vehicleId The id of the vehicle to update.
   * @param {String} [plate] The new plate of the vehicle.
   * @param {Number} [mileage] The new mileage of the vehicle.
   * @param {String} [model] The new model of the vehicle.
   * @param {String} [brandId] The new brand id of the vehicle.
   * @param {Number} [year] The new year of the vehicle.
   * @return {Vehicle} The updated vehicle.
   *
   * @throws {VehicleNotFoundException} If the vehicle is not found.
   */
  public async userUpdateVehicle(
    updatingUserId: string,
    vehicleId: string,
    plate?: string,
    mileage?: number,
    model?: string,
    brandId?: string,
    year?: number
  ): Promise<{ vehicle: Vehicle; brandName: string }> {
    const vehicle = await this.vehicleRepository.findActiveById(vehicleId).getOrThrow(new VehicleNotFoundException())
    if (vehicle.ownerId !== updatingUserId) throw new VehicleNotFoundException()
    return await this.updateVehicle(vehicle, model, plate, mileage, brandId, year)
  }

  /**
   * Update a vehicle using admin mechanisms.
   *
   * @param {String} vehicleId The id of the vehicle to update.
   * @param {String} plate The new plate of the vehicle.
   * @param {Number} mileage The new mileage of the vehicle.
   * @param {String} model The new model of the vehicle.
   * @param {String} brandId The new brand id of the vehicle.
   * @param {Number} year The new year of the vehicle.
   * @return {Vehicle} The updated vehicle.
   *
   * @throws {VehicleNotFoundException} If the vehicle is not found.
   */
  public async adminUpdateVehicle(
    vehicleId: string,
    plate?: string,
    mileage?: number,
    model?: string,
    brandId?: string,
    year?: number
  ): Promise<{ vehicle: Vehicle; brandName: string }> {
    const vehicle = await this.vehicleRepository.findById(vehicleId).getOrThrow(new VehicleNotFoundException())
    return await this.updateVehicle(vehicle, model, plate, mileage, brandId, year)
  }

  /**
   * Softly delete a vehicle.
   * The vehicle will not be deleted from the database, but it will be marked as deleted.
   *
   * @param {string} userId The id of the user that is deleting the vehicle.
   * @param {String} vehicleId The id of the vehicle to softly delete.
   * @return {Promise<boolean>} A promise that resolves to true if the vehicle was softly deleted.
   */
  public async userSoftDeleteVehicle(userId: string, vehicleId: string): Promise<boolean> {
    const fetchedData = await this.getVehicleById(vehicleId, userId)
    return await this.softDeleteVehicle(fetchedData.vehicle)
  }

  /**
   * Softly delete a vehicle.
   * The vehicle will not be deleted from the database, but it will be marked as deleted.
   *
   * @param {String} vehicleId The id of the vehicle to softly delete.
   * @return {Promise<boolean>} A promise that resolves to true if the vehicle was softly deleted.
   */
  public async adminSoftDeleteVehicle(vehicleId: string): Promise<boolean> {
    const fetchedData = await this.getVehicleById(vehicleId)
    return await this.softDeleteVehicle(fetchedData.vehicle)
  }

  private async softDeleteVehicle(vehicle: Vehicle): Promise<boolean> {
    vehicle.softDelete()
    return await this.vehicleRepository.updateAsIs(vehicle)
  }

  /**
   * Update a vehicle.
   *
   * @param {Vehicle} vehicle The vehicle to update.
   * @param {String} model The new model of the vehicle.
   * @param {String} plate The new plate of the vehicle.
   * @param {Number} mileage The new mileage of the vehicle.
   * @param {String} brandId The new brand id of the vehicle.
   * @param {Number} year The new year of the vehicle.
   * @return {Vehicle} The updated vehicle.
   * @private
   */
  private async updateVehicle(
    vehicle: Vehicle,
    model?: string,
    plate?: string,
    mileage?: number,
    brandId?: string,
    year?: number
  ): Promise<{ vehicle: Vehicle; brandName: string }> {
    if (plate && (await this.vehicleRepository.findBy({ _id: { $ne: vehicle._id.toString() }, _plate: plate }).getOrNull()))
      throw new VehicleAlreadyExistException()

    const newBrand = brandId ? await this.vehicleBrandsService.getVehicleBrandById(brandId, { deletedFallbackData: false }) : undefined

    vehicle.update(model, plate, mileage, brandId, year)
    await this.vehicleRepository.updateAsIs(vehicle)

    const brand = newBrand || (await this.vehicleBrandsService.getVehicleBrandById(vehicle.brandId, { deletedFallbackData: true }))

    return { vehicle, brandName: brand.name }
  }
}
