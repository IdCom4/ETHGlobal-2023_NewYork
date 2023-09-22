import { BoxCategories } from '@/common/enums/schemas'
import { BoxNotFoundException } from '@/common/exceptions/schemas/box/box-not-found.exception'
import { CenterNotFoundException } from '@/common/exceptions/schemas/center'
import { BoxRepository, CenterRepository } from '@/repositories'
import { Box, Formula } from '@/schemas/box'
import { WeekOpeningHours } from '@/schemas/center'
import { StrictAddress } from '@/schemas/common/pojos'
import { Injectable } from '@nestjs/common/decorators'
import { InternalServerErrorException } from '@nestjs/common/exceptions'

@Injectable()
export class BoxesService {
  constructor(private readonly boxRepository: BoxRepository, private readonly centersRepository: CenterRepository) {}

  /* >==== GETTERS ====> */
  /**
   * Retrieves all boxes based on the specified options.
   *
   * @param options An object containing the query options
   * @param options.activesOnly A boolean value indicating whether to fetch only active boxes
   * @returns {Box[]} Found boxes
   * @throws {BoxNotFoundException} if no boxes are found
   */
  public async getAllBoxes(options: { activesOnly: boolean }): Promise<Box[]> {
    const dataWrapper = options.activesOnly ? this.boxRepository.findAllActives() : this.boxRepository.findAll()

    const boxes = await dataWrapper.getOrThrow(new BoxNotFoundException())
    return boxes
  }

  /**
   * Retrieves a box from his id.
   *
   * @param {string} id The box id
   * @returns {Box} Found box
   * @throws {BoxNotFoundException} if no box is found
   */
  public async getBoxById(id: string): Promise<Box> {
    return this.boxRepository.findById(id).getOrThrow(new BoxNotFoundException())
  }

  /**
   * Retrieves all active boxes for a center.
   *
   * @param {string} centerId The center id
   * @returns {Box[]} Found boxes
   * @throws {BoxNotFoundException} if no boxes are found
   */
  public async getBoxesByCenterId(centerId: string): Promise<Box[]> {
    return this.boxRepository.findAllActivesByCenterId(centerId).getOrThrow(new CenterNotFoundException())
  }

  /**
   * Retrieves all active boxes for a center in a category.
   *
   * @param {string} centerId The center id
   * @param {BoxCategories} category The box category to filter
   * @returns {Box[]} Found boxes
   * @throws {BoxNotFoundException} if no boxes are found
   */
  public async getBoxesByCenterIdAndCategory(centerId: string, category: BoxCategories): Promise<Box[]> {
    return this.boxRepository.findAllActivesByCenterIdAndCategory(centerId, category).getOrThrow(new BoxNotFoundException())
  }

  /* >==== CREATION ====> */
  /**
   * Create a new box with his basic data.
   * Boxes are linked to a center, so you need to provide an existing center id.
   *
   * @param {string} name The box name
   * @param {string} description The box description
   * @param {string} centerId The associated center id
   * @param {BoxCategories} category The box category
   * @param {string} isAvailable indicate if the new box is available
   * @returns {Box} Created box
   * @throws {CenterNotFoundException} if no center is found
   */
  public async createBox(name: string, description: string, centerId: string, category: BoxCategories, isAvailable: boolean): Promise<Box> {
    const center = await this.centersRepository.findById(centerId).getOrThrow(new CenterNotFoundException())

    const formulas = (await this.getBoxesByCenterId(centerId)).find((box) => box.category === category)?.formulas || []

    const newBox = Box.of({ name, description, center, category, isAvailable, formulas })

    return this.boxRepository.create(newBox)
  }

  /* >==== UPDATE ====> */
  /**
   * Update a box.
   * Specify changing information.
   * Each information not specified won't change.
   *
   * @param {string} boxId The box id
   * @param {string} [name] The new name of the box (optional)
   * @param {string} [description] The new description of the box (optional)
   * @param {BoxCategories} [category] The box category (optional)
   * @param {boolean} [isAvailable] Indicate if the box is available (optional)
   * @returns {boolean} indicating whether the update was successful
   * @throws {BoxNotFoundException} if no box is found
   */
  public async updateBox(boxId: string, name?: string, description?: string, category?: BoxCategories, isAvailable?: boolean): Promise<boolean> {
    const box = await this.boxRepository.findActiveById(boxId).getOrThrow(new BoxNotFoundException())

    box.update({ name, description, category, isAvailable })

    return this.boxRepository.updateAsIs(box)
  }

  /**
   * Update box opening hours.
   *
   * @param {string | Box} box The box or the id of the box to update
   * @param {WeekOpeningHours} openingHours Opening hours of the box
   * @returns {Box} Updated box
   * @throws {BoxNotFoundException} if no center is found
   */
  public async updateBoxOpeningHours(box: string | Box, openingHours: WeekOpeningHours): Promise<Box> {
    // check if given box is a box id or a box instance
    const boxToUpdate = box instanceof Box ? box : await this.boxRepository.findActiveById(box).getOrThrow(new BoxNotFoundException())

    boxToUpdate.updateOpeningHours(openingHours)

    await this.boxRepository.updateAsIs(boxToUpdate)

    return boxToUpdate
  }

  /**
   * Update the location of a center's boxes.
   *
   * @param {string} centerId The center id of boxes
   * @param {StrictAddress} newLocation New location of boxes
   */
  public async updateBoxesLocationByCenterId(centerId: string, newLocation: StrictAddress): Promise<void> {
    await this.boxRepository.updateMany({ filter: { _centerId: centerId }, update: { $set: { _location: newLocation } } })
  }

  /**
   * Update formulas of a center's boxes in a provided category.
   *
   * @param {string} centerId The center id of boxes
   * @param {BoxCategories} category New location of boxes
   * @param {Formula[]} newFormulas New location of boxes
   */
  public async updateBoxesFormulasByCenterIdAndCategory(centerId: string, category: BoxCategories, newFormulas: Formula[]): Promise<void> {
    await this.boxRepository.updateMany({ filter: { _centerId: centerId, _category: category }, update: { $set: { _formulas: newFormulas } } })
  }

  /**
   * Update opening hours of all synchronized boxes in a center.
   * @remarks Synchronized boxes are defined by equal opening hours.
   *
   * @param {string} centerId The center id of boxes
   * @param {WeekOpeningHours} previousCenterOpeningHours New location of boxes
   * @param {WeekOpeningHours} newCenterOpeningHours New location of boxes
   */
  public async updateSyncBoxesOpeningHoursByCenterId(
    centerId: string,
    previousCenterOpeningHours: WeekOpeningHours,
    newCenterOpeningHours: WeekOpeningHours
  ): Promise<void> {
    await this.boxRepository.updateMany({
      filter: { _centerId: centerId, _openingHours: previousCenterOpeningHours },
      update: { $set: { _openingHours: newCenterOpeningHours } },
    })
  }

  /**
   * Delete a box.
   *
   * @param {string} id The box id
   */
  public async deleteBoxById(id: string): Promise<void> {
    const successfullyDeleted = await this.boxRepository.delete(id)

    // if box wasn't deleted, check the reason
    if (!successfullyDeleted) {
      const doesBoxExist = !!(await this.getBoxById(id))

      if (doesBoxExist) throw new InternalServerErrorException('Une erreur inconnue est survenue lors de la suppression du box')
      else throw new BoxNotFoundException()
    }
  }

  /**
   * Delete all boxes for a center.
   *
   * @param {string} centerId The center id
   * @returns {number} The number of deleted boxes
   */
  public async deleteBoxesByCenterId(centerId: string): Promise<number> {
    return this.boxRepository.deleteMany({ filter: { _centerId: centerId } })
  }

  /**
   * Delete multiple boxes.
   *
   * @param {string[]} ids An array of boxes to delete
   * @returns {string[]} The id of boxes not deleted
   */
  public async deleteManyBoxesById(ids: string[]): Promise<string[]> {
    const notDeletedBoxesIds = await this.boxRepository.deleteList(ids)

    return notDeletedBoxesIds
  }
}
