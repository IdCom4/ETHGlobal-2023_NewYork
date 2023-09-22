import { CenterServiceRepository } from '@/repositories/center-service.repository'
import { CenterService } from '@Schemas/center-service/center-service'
import { CenterServiceNotFoundException } from '@Common/exceptions/schemas/center-service'
import { Injectable } from '@nestjs/common'
import { BoxCategories } from '@Common/enums/schemas/box.schema.enum'
import { PricesByVehicleType } from '@/schemas/center-service/pojos'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { User } from '@Schemas/user'

@Injectable()
export class CenterServicesService {
  constructor(private readonly centerServicesRepository: CenterServiceRepository, private readonly hostedFilesService: HostedFilesService) {}

  /**
   * Retrieves all centers services based on the specified options.
   *
   * @param options An object containing the query options
   * @param options.activesOnly A boolean value indicating whether to fetch only active centers services
   * @returns {CenterService[]} Found centers services
   * @throws {CenterServiceNotFoundException} if no boxes are found
   */
  public async getAllCenters(options: { activeOnly: boolean }): Promise<CenterService[]> {
    const error = new CenterServiceNotFoundException('Une erreur inconnue est survenue lors de la récupération des services')

    return options.activeOnly
      ? await this.centerServicesRepository.findMany({ _isActive: true }).getOrThrow(error)
      : await this.centerServicesRepository.findAll().getOrThrow(error)
  }

  /**
   * Retrieves a center service from his id.
   *
   * @param {string} centerServiceId The center service id
   * @returns {CenterService} Found center service
   * @throws {CenterServiceNotFoundException} if no center service is found
   */
  public async getCenterServiceById(centerServiceId: string): Promise<CenterService> {
    return this.centerServicesRepository
      .findBy({
        _id: centerServiceId,
        _isActive: true,
      })
      .getOrThrow(new CenterServiceNotFoundException())
  }

  /**
   * Create a new center service.
   * Some parameters are optional, but if they are not provided,
   * the center service will be created with default values.
   * This can be useful when creating a center service from a form, for example.
   *
   * @param {User} uploader The user who uploaded the center service, will be used to fill the picture's uploader owner requirement.
   * @param {string} title The center service title
   * @param {string} subtitle The center service subtitle
   * @param {string} description The center service description
   * @param {boolean} isActive A boolean value indicating whether the center service is active
   * @param {TBase64File} picture The center service picture
   * @param {number} [numberOfSales] The number of sales of the center service
   * @param {string[]} [optionIds] The ids of the options of the center service
   * @param {BoxCategories[]} [categories] The categories of the center service
   * @param {PricesByVehicleType} [prices] The prices of the center service
   * @returns {Box} Found box
   * @throws {BoxNotFoundException} if no box is found
   */
  public async createCenterService(
    uploader: User,
    title: string,
    subtitle: string,
    description: string,
    isActive: boolean,
    picture: TBase64File,
    numberOfSales?: number,
    optionIds?: string[],
    categories?: BoxCategories[],
    prices?: PricesByVehicleType
  ): Promise<CenterService> {
    const hostedFile = await this.hostedFilesService.upload(
      {
        content: picture,
        name: `center-services-${title.slugify()}`,
      },
      uploader._id.toString(),
      false
    )

    const newCenterService = CenterService.of(
      title,
      subtitle,
      description,
      isActive,
      hostedFile.toPublicFile(),
      numberOfSales,
      optionIds,
      categories,
      prices
    )

    return this.centerServicesRepository.create(newCenterService)
  }

  /**
   * Update a center service.
   *
   * @param {User} uploader The user who uploaded the center service, will be used to fill the picture's uploader owner requirement.
   * @param {string} centerServiceId The center service id
   * @param {string} title The center service title
   * @param {string} subtitle The center service subtitle
   * @param {string} description The center service description
   * @param {boolean} isActive A boolean value indicating whether the center service is active
   * @param {TBase64File} [newPicture] The new center service picture
   * @param {number} [numberOfSales] The number of sales of the center service
   * @param {string[]} [optionIds] The ids of the options of the center service
   * @param {BoxCategories[]} [categories] The categories of the center service
   * @param {PricesByVehicleType} [prices] The prices of the center service
   * @returns {boolean} A boolean value indicating whether the center service has been updated
   */
  public async updateCenterService(
    uploader: User,
    centerServiceId: string,
    title: string,
    subtitle: string,
    description: string,
    isActive: boolean,
    newPicture?: TBase64File,
    numberOfSales?: number,
    optionIds?: string[],
    categories?: BoxCategories[],
    prices?: PricesByVehicleType
  ): Promise<boolean> {
    const centerService = await this.centerServicesRepository.findById(centerServiceId).getOrThrow(new CenterServiceNotFoundException())

    if (newPicture) {
      const picture = (
        await this.hostedFilesService.replaceFile(
          centerService.picture.fileReferenceId,
          {
            content: newPicture,
            name: `center-services-${title.slugify()}`,
          },
          uploader._id.toString(),
          false
        )
      ).toPublicFile()
      centerService.update({
        title,
        subtitle,
        description,
        isActive,
        picture,
        numberOfSales,
        optionIds,
        categories,
        prices,
      })
    } else
      centerService.update({
        title,
        subtitle,
        description,
        isActive,
        numberOfSales,
        optionIds,
        categories,
        prices,
      })

    return await this.centerServicesRepository.updateAsIs(centerService)
  }

  /**
   * Delete a center service.
   * @param centerServiceId The center service id
   */
  public async deleteCenterService(centerServiceId: string): Promise<void> {
    const centerService = await this.centerServicesRepository.findById(centerServiceId).getOrThrow(new CenterServiceNotFoundException())

    centerService.softDelete()

    await this.centerServicesRepository.updateAsIs(centerService)
  }

  /**
   * Deactivate a center service.
   * The center service won't be deleted and can be reactivated later.
   *
   * @param centerServiceId The center service id
   */
  async deactivateCenterService(centerServiceId: string): Promise<void> {
    const centerService = await this.centerServicesRepository.findById(centerServiceId).getOrThrow(new CenterServiceNotFoundException())

    centerService.deactivate()

    await this.centerServicesRepository.updateAsIs(centerService)
  }
}
