import { ServiceOptionRepository } from '@/repositories/service-option.repository'
import { ServiceOption } from '@/schemas/center-service/service-option/service-option.schema'
import { PricesByVehicleType } from '@/schemas/center-service/pojos'
import { Injectable } from '@nestjs/common'
import { ServiceOptionNotFoundException } from '@Common/exceptions/schemas/center-service'

@Injectable()
export class ServiceOptionsService {
  constructor(private readonly serviceOptionRepository: ServiceOptionRepository) {}

  /**
   * Retrieves all service options.
   *
   * @returns {ServiceOption[]} Found centers services
   * @throws {ServiceOptionNotFoundException} if no service options were found
   */
  public async getAllServiceOptions(): Promise<ServiceOption[]> {
    return await this.serviceOptionRepository.findAll().getOrThrow(new ServiceOptionNotFoundException())
  }

  /**
   * Retrieves a service option from his id.
   *
   * @param {string} serviceOptionId The service option id
   * @returns {ServiceOption} Found service option
   * @throws {ServiceOptionNotFoundException} if no service option is found
   */
  public async getServiceOptionById(serviceOptionId: string): Promise<ServiceOption> {
    return this.serviceOptionRepository.findById(serviceOptionId).getOrThrow(new ServiceOptionNotFoundException())
  }

  /**
   * Create a new center service.
   * The last parameter is optional, but if it is not provided,
   * the center service will be created with default values.
   * This can be useful when creating a center service from a form, for example.
   *
   * @param {string} title The center service title
   * @param {PricesByVehicleType} extraPrices The extra prices of the service option
   * @returns {ServiceOption} The created service option
   */
  public async createServiceOption(title: string, extraPrices?: PricesByVehicleType): Promise<ServiceOption> {
    const newServiceOption = ServiceOption.of(title, extraPrices)

    return await this.serviceOptionRepository.create(newServiceOption)
  }

  /**
   * Update a service option.
   *
   * @param {string} serviceOptionId The service option id
   * @param {string} title The service option title
   * @param {PricesByVehicleType} pricesByVehicleType The prices by vehicle type
   * @returns {boolean} A boolean value indicating whether the service option was updated
   */
  public async updateServiceOption(serviceOptionId: string, title: string, pricesByVehicleType: PricesByVehicleType): Promise<boolean> {
    const serviceOption = await this.getServiceOptionById(serviceOptionId)
    serviceOption.update(title, pricesByVehicleType)

    return await this.serviceOptionRepository.updateAsIs(serviceOption)
  }

  /**
   * Delete a service option.
   *
   * @param {string} serviceOptionId The service option id
   * @returns {boolean} A boolean value indicating whether the service option was deleted
   */
  public async deleteServiceOption(serviceOptionId: string): Promise<boolean> {
    return await this.serviceOptionRepository.delete(serviceOptionId)
  }
}
