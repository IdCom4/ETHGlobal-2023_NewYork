import { VehicleBrandRepository } from '@/repositories/vehicle/vehicle-brand.repository'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { Injectable } from '@nestjs/common'
import { VehicleBrandAlreadyExistException } from '@Common/exceptions/schemas/vehicles/brand/vehicle-brand-already-exist.exception'
import { VehicleBrandNotFoundException } from '@Common/exceptions/schemas/vehicles/brand/vehicle-brand-not-found.exception'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'

@Injectable()
export class VehicleBrandsService {
  constructor(private readonly vehicleBrandRepository: VehicleBrandRepository) {}

  /**
   * Create a new vehicle brand.
   *
   * @param {String} name The name of the brand.
   * @param {VehicleType} vehicleType The type of the brand.
   * @return {VehicleBrand} The created vehicle brand.
   *
   * @throws {VehicleBrandAlreadyExistException} If the brand already exists.
   */
  public async createVehicleBrand(name: string, vehicleType: VehicleType): Promise<VehicleBrand> {
    if (await this.vehicleBrandRepository.findBy({ _name: name }).getOrNull()) throw new VehicleBrandAlreadyExistException()

    const brand = VehicleBrand.of(name, vehicleType)
    return await this.vehicleBrandRepository.create(brand)
  }

  /**
   * Get all vehicle brands.
   *
   * @return {VehicleBrand[]} The vehicle brands.
   */
  public async getVehicleBrands(): Promise<VehicleBrand[]> {
    return await this.vehicleBrandRepository.findAll().getOr([])
  }

  /**
   * Get a vehicle brand by its id.
   *
   * @param {String} id The id of the vehicle brand.
   * @return {VehicleBrand} The vehicle brand.
   *
   * @throws {VehicleBrandNotFoundException} If the vehicle brand is not found and options.deletedFallbackData is set to false.
   */
  public async getVehicleBrandById(id: string, options: { deletedFallbackData: boolean } = { deletedFallbackData: true }): Promise<VehicleBrand> {
    const dataWrapper = this.vehicleBrandRepository.findById(id)

    if (options.deletedFallbackData) return await dataWrapper.getOr(VehicleBrand.of('DELETED', VehicleType.NONE))
    else return await dataWrapper.getOrThrow(new VehicleBrandNotFoundException())
  }

  /**
   * Get many vehicle brands by their ids.
   *
   * @param {String[]} ids The ids of the vehicle brands.
   * @return {VehicleBrand[]} The vehicle brands.
   */
  public async getManyVehicleBrandById(ids: string[]): Promise<VehicleBrand[]> {
    return await this.vehicleBrandRepository.findList(ids).getOr([])
  }

  /**
   * Update a vehicle brand.
   *
   * @param {String} id The id of the vehicle brand.
   * @param {String} [name] The new name of the vehicle brand (optional).
   * @param {VehicleType} [vehicleType] The new type of the vehicle brand (optional).
   * @return {VehicleBrand} The updated vehicle brand.
   *
   * @throws {VehicleBrandNotFoundException} If the vehicle brand is not found.
   */
  public async updateVehicleBrand(id: string, name?: string, vehicleType?: VehicleType): Promise<VehicleBrand> {
    const brand = await this.getVehicleBrandById(id)

    brand.update(name, vehicleType)
    await this.vehicleBrandRepository.updateAsIs(brand)

    return brand
  }

  /**
   * Delete a vehicle brand.
   * @param {String} id The id of the vehicle brand.
   * @return {Boolean} True if the vehicle brand has been deleted.
   *
   * @throws {VehicleBrandNotFoundException} If the vehicle brand is not found.
   */
  public async deleteVehicleBrand(id: string): Promise<boolean> {
    if (!(await this.vehicleBrandRepository.findById(id).getOrNull())) throw new VehicleBrandNotFoundException()

    return await this.vehicleBrandRepository.delete(id)
  }
}
