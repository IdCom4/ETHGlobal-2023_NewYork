import { Inject, Injectable } from '@nestjs/common'
import { ProfessionalUser } from '@Schemas/user'
import { ProfessionalProfileUpdater } from '@Common/data-updaters/professionnal-profile.updater'
import { Issue } from '@/schemas/issue'
import { StrictAddress } from '@/schemas/common/pojos'
import { ProfessionalRepository } from '@/repositories'
import { IMapAPI } from '@/common/external-service-providers-api'
import { Fields } from './requests/update-professional-profile/pojos.dto'

@Injectable()
export class ProfessionalsService {
  constructor(
    @Inject('MapAPI') private readonly mapAPI: IMapAPI,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly professionalProfileUpdater: ProfessionalProfileUpdater
  ) {}

  /**
   * Update the professional profile of the user.
   *
   * @param user The user to update
   * @param fieldsToUpdate The fields to update
   * @param fields The field values to update
   * @return The updated user
   */
  public async updateProfile(user: ProfessionalUser, fieldsToUpdate: (keyof Fields)[], fields: Fields): Promise<ProfessionalUser> {
    await this.professionalProfileUpdater.update(user, fieldsToUpdate, fields)

    await this.professionalRepository.updateAsIs(user)

    return user
  }

  /**
   * Fetch more relevant professionals for a mission
   * The professionals are sorted by score (the higher the better)
   *
   * @param issues The issues of the mission
   * @param idealPickupAddress The ideal pickup address of the mission
   * @param maxDistance The max distance between the professional and the pickup address
   * @param limit The max number of professionals to return
   * @returns {ProfessionalUser[]} The found professionals
   */
  public async fetchMostRelevantProfessionalsForMission(
    issues: Issue[],
    idealPickupAddress: StrictAddress,
    maxDistance: number,
    limit = 20
  ): Promise<ProfessionalUser[]> {
    // fetch professionals with required skills
    // create an array of skills for each issue
    const skillIdsPerIssue: Array<string[]> = issues.map((issue) => issue.skillIds.removeDuplicates())

    // create a query that will select professionals that have at least one skill of each issue
    const query: { $and: Array<Record<string, object>> } = { $and: [] }
    skillIdsPerIssue.forEach((skillIds) => query.$and.push({ '_professionalProfile._skillIds': { $in: skillIds } }))

    const professionalsWithRelevantSkills = await this.professionalRepository.findManyMissionReadyProfessionalsBy(query).getOr([])

    // filter those in the right radius
    const closeEnoughProfessionals: ProfessionalUser[] = []

    for (const pro of professionalsWithRelevantSkills) {
      if (pro.professionalProfile.workAddress) {
        const distance = await this.mapAPI.getDistanceBetweenStrictAddresses(pro.professionalProfile.workAddress, idealPickupAddress)

        const professionalMaxTravelDistance = pro.professionalProfile.maxTravelDistance ?? 0
        if (distance - professionalMaxTravelDistance <= maxDistance) closeEnoughProfessionals.push(pro)
      }
    }

    // sort them by score
    const professionalsSortedByScore = closeEnoughProfessionals.sort(
      (pro1, pro2) => pro2.professionalProfile.getEffectiveScore() - pro1.professionalProfile.getEffectiveScore()
    )

    // keep only the bests {{ limit }} or less
    if (professionalsSortedByScore.length > limit) professionalsSortedByScore.length = limit

    return professionalsSortedByScore
  }
}
