import { CenterNotFoundException } from '@/common/exceptions/schemas/center'
import { CenterRepository } from '@/repositories'
import { Center, WeekOpeningHours } from '@/schemas/center'
import { StrictAddress } from '@/schemas/common/pojos'
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { BoxesService } from '@/API/boxes/boxes.service'
import { BoxCategories } from '@/common/enums/schemas'
import { Formula } from '@/schemas/box'
import '@/extensions'

@Injectable()
export class CentersService {
  protected readonly logger = new Logger(CentersService.name)

  constructor(private readonly boxesService: BoxesService, private readonly centerRepository: CenterRepository) {}

  /**
   * Creates a new center.
   *
   * @param name Name of the new center
   * @param location Location of the new center
   * @returns The created center
   */
  public async createCenter(name: string, location: StrictAddress): Promise<Center> {
    if (await this.centerRepository.findByName(name).getOrNull()) throw new BadRequestException('Un centre avec ce nom existe déjà')

    const center = Center.of(name, location)
    return await this.centerRepository.create(center)
  }

  /**
   * Updates a center.
   * It will only update the defined fields.
   *
   * @param centerId The center id
   * @param newName The new center name
   * @param newLocation The new center location
   * @param newOpeningHours The new center opening hours
   * @returns The updated center
   * @throws InternalServerErrorException If an unknown error occurs.
   * Often due to a database error.
   */
  public async updateCenter(centerId: string, newName?: string, newLocation?: StrictAddress, newOpeningHours?: WeekOpeningHours): Promise<Center> {
    const center = await this.centerRepository.findActiveById(centerId).getOrThrow(new CenterNotFoundException())
    const oldOpeningHours = center.openingHours

    center.update({ name: newName, location: newLocation, openingHours: newOpeningHours })
    if (!(await this.centerRepository.updateAsIs(center)))
      throw new InternalServerErrorException('Une erreur inattendue est survenue lors de la mise à jour du centre')

    // update center's boxes data if necessary
    if (newLocation) await this.boxesService.updateBoxesLocationByCenterId(centerId, newLocation)
    if (newOpeningHours) await this.boxesService.updateSyncBoxesOpeningHoursByCenterId(centerId, oldOpeningHours, newOpeningHours)

    return center
  }

  /**
   * Gets all centers.
   *
   * @param options Options to filter centers
   * @param options.activesOnly If true, on
   * @returns An array with all centers
   * @throws InternalServerErrorException If an unknown error occurs.
   * Often due to a database error.
   */
  public async getAllCenters(options: { activesOnly: boolean }): Promise<Center[]> {
    const errorIfAny = new InternalServerErrorException('Une erreur inconnue est survenue lors de la récupération des centres')

    if (options.activesOnly) return await this.centerRepository.findAllActives().getOrThrow(errorIfAny)
    else return await this.centerRepository.findAll().getOrThrow(errorIfAny)
  }

  /**
   * Gets a center by its id.
   *
   * @param centerId The center id
   * @returns The center
   * @throws CenterNotFoundException If the center does not exist.
   */
  public async getCenterById(centerId: string): Promise<Center> {
    return await this.centerRepository.findActiveById(centerId).getOrThrow(new CenterNotFoundException())
  }

  /**
   * Deletes a center.
   *
   * @param centerId The center id
   * @throws BadRequestException If the center is already deleted
   * @throws InternalServerErrorException If an unknown error occurs or if some boxes could not be deleted.
   */
  public async deleteCenter(centerId: string): Promise<void> {
    const center = await this.centerRepository.findActiveById(centerId).getOrThrow(new CenterNotFoundException())
    if (center.isSoftDeleted()) throw new BadRequestException('Ce centre est déjà supprimé')

    // delete boxes
    const centerBoxes = await this.boxesService.getBoxesByCenterId(centerId)
    const nbrOfDeletedBoxes = await this.boxesService.deleteBoxesByCenterId(centerId)
    if (nbrOfDeletedBoxes !== centerBoxes.length)
      throw new InternalServerErrorException(`${centerBoxes.length - nbrOfDeletedBoxes} boxe(s) n'ont pas pu être supprimé(s)`)

    center.softDelete()

    const successfullyUpdated = await this.centerRepository.updateAsIs(center)
    if (!successfullyUpdated) throw new InternalServerErrorException('Une erreur inconnue est survenue lors de la suppression du centre')
  }

  /**
   * Updates the formulas of a center for a specific category.
   *
   * @param centerId The center id
   * @param category The category of the formulas to update
   * @param newFormulas The new formulas
   */
  public async updateCenterFormulasByCategory(centerId: string, category: BoxCategories, newFormulas: Formula[]): Promise<void> {
    await this.boxesService.updateBoxesFormulasByCenterIdAndCategory(centerId, category, newFormulas)
  }

  /**
   * Gets the formulas of a center for each category.
   *
   * @param centerId The center id
   * @returns A map with the formulas of each category
   */
  public async getCenterFormulasByCategories(centerId: string): Promise<TBoxCategoriesFormulas> {
    // fetch center boxes
    const centerBoxes = await this.boxesService.getBoxesByCenterId(centerId)

    const formulasByCategories: Partial<TBoxCategoriesFormulas> = {}

    const allBoxCategories: BoxCategories[] = Object.keys(BoxCategories).map((categoryKey) => BoxCategories[categoryKey])

    for (const category of allBoxCategories) {
      const firstBoxOfCategory = centerBoxes.find((box) => box.category === category)
      formulasByCategories[category] = firstBoxOfCategory?.formulas || []
    }

    // init full object
    const allFormulasByAllCategories = Object.createPojoByReflection<TBoxCategoriesFormulas>(formulasByCategories)

    return allFormulasByAllCategories
  }
}

export type TBoxCategoriesFormulas = Record<BoxCategories, Formula[]>
