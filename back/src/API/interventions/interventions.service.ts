import { Intervention } from '@/schemas/intervention'
import { InterventionRepository } from '@/repositories'
import { Injectable } from '@nestjs/common'
import { InterventionNotFoundException } from '@/common/exceptions/schemas'

@Injectable()
export class InterventionsService {
  constructor(private readonly interventionRepository: InterventionRepository) {}

  /**
   * Get all intervention
   *
   * @remarks
   * If no intervention is found, an empty array is returned.
   *
   * @returns {Intervention[]} Found intervention
   */
  public async getAll(): Promise<Intervention[]> {
    return await this.interventionRepository.findAll().getOr([])
  }

  /**
   * Get an intervention by id
   *
   * @param id The id of the intervention
   * @returns {Intervention} Found intervention
   * @throws {InterventionNotFoundException} If no intervention is found
   */
  public async getById(id: string): Promise<Intervention> {
    return await this.interventionRepository.findById(id).getOrThrow(new InterventionNotFoundException())
  }
}
