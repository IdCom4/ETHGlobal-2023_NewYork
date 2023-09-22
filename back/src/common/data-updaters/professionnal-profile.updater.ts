import {
  CompanyRequest,
  Fields,
  ProfessionalExperienceRequest,
  RealisationRequest,
  StudyRequest,
} from '@/API/professionals/requests/update-professional-profile/pojos.dto'
import { ProfessionalUser } from '@Schemas/user'
import { Company } from '@Schemas/user/pojos/professionalProfile/company'
import { PublicFile, StrictAddress } from '@Schemas/common/pojos'
import { StrictAddressDTO } from '@Common/request-io/request-dto/address.dto'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import '@/extensions'
import { ProfessionalHistoryUpdater } from '@Common/data-updaters/professionnal-history.updater'
import { HostedFileReference } from '@/schemas/hostedFileReference'

/**
 * Represents an updater for the professional profile of a user.
 * This class contains all the logic to update the professional profile of a user.
 */
@Injectable()
export class ProfessionalProfileUpdater {
  private readonly professionalHistoryUpdater: ProfessionalHistoryUpdater

  constructor(private readonly hostedFilesService: HostedFilesService) {
    this.professionalHistoryUpdater = new ProfessionalHistoryUpdater(this.hostedFilesService)
  }

  /**
   * Updates the professional profile of a user.
   * @param {ProfessionalUser} user The user to update.
   * @param {(keyof Fields)[]} fieldsToUpdate The fields to update.
   * @param {Fields} fields The values of fields to update.
   * @throws {ForbiddenException} If the user is not a professional.
   */
  public async update(user: ProfessionalUser, fieldsToUpdate: (keyof Fields)[], fields: Fields): Promise<void> {
    if (!user.professionalProfile) throw new ForbiddenException('Vous devez être un spécialiste pour mettre à jour ces informations')

    // apply changes
    for (const fieldToUpdate of fieldsToUpdate) {
      try {
        await this[`update${fieldToUpdate.capitalize()}`](user, fields[fieldToUpdate])
      } catch (e) {}
    }

    // update profile score accordingly
    user.professionalProfile.updateCompletionScore()
  }

  private updateBusinessName(user: ProfessionalUser, businessName: string | undefined): void {
    user.professionalProfile.updateBusinessName(businessName || user.getFullName())
  }

  private async updateBusinessPicture(user: ProfessionalUser, businessPicture: TBase64File): Promise<void> {
    const businessPictureFileReference = await this.hostedFilesService.replaceFile(
      user.professionalProfile.businessPicture?.fileReferenceId || null,
      { content: businessPicture, name: `businessPicture-${user._id.toString()}` },
      user._id.toString(),
      false
    )
    user.professionalProfile.updateBusinessPicture(PublicFile.fromHostedFileReference(businessPictureFileReference))
  }

  private updateBusinessPresentation(user: ProfessionalUser, businessPresentation: string | undefined): void {
    user.professionalProfile.updateBusinessPresentation(businessPresentation)
  }

  private updateAverageHourlyRate(user: ProfessionalUser, averageHourlyRate: number | undefined): void {
    user.professionalProfile.updateAverageHourlyRate(averageHourlyRate)
  }

  private updateMaxTravelDistance(user: ProfessionalUser, maxTravelDistance: number | undefined): void {
    user.professionalProfile.updateMaxTravelDistance(maxTravelDistance)
  }

  private updateAverageAvailability(user: ProfessionalUser, averageAvailability: string | undefined): void {
    user.professionalProfile.updateAverageAvailability(averageAvailability)
  }

  private updateWorkAddress(user: ProfessionalUser, workAddress: StrictAddressDTO | undefined): void {
    user.professionalProfile.updateWorkAddress(workAddress ? StrictAddress.fromRequest(workAddress) : undefined)
  }

  private updateCompany(user: ProfessionalUser, companyRequest: CompanyRequest | undefined): void {
    user.professionalProfile.updateCompany(companyRequest ? Company.fromRequest(companyRequest) : undefined)
  }

  private async updateStudies(user: ProfessionalUser, requests: StudyRequest[]): Promise<void> {
    await this.professionalHistoryUpdater.updateStudies(user, requests)
  }

  private async updateRealisations(user: ProfessionalUser, requests: RealisationRequest[]): Promise<void> {
    await this.professionalHistoryUpdater.updateRealisations(user, requests)
  }

  private async updateProfessionalExperiences(user: ProfessionalUser, requests: ProfessionalExperienceRequest[]): Promise<void> {
    await this.professionalHistoryUpdater.updateProfessionalExperiences(user, requests)
  }

  private updateSkillIds(user: ProfessionalUser, skillIds: string[] | undefined): void {
    user.professionalProfile.updateSkillIds(skillIds || [])
  }

  private async updateCurriculum(user: ProfessionalUser, curriculum?: TBase64File): Promise<void> {
    let newCVFileReference: HostedFileReference | undefined = undefined

    if (curriculum) {
      newCVFileReference = await this.hostedFilesService.replaceFile(
        user.professionalProfile.curriculum?.fileReferenceId || null,
        { content: curriculum, name: `curriculum-${user._id.toString()}` },
        user._id.toString(),
        false
      )
    } else if (user.professionalProfile.curriculum) await this.hostedFilesService.delete(user.professionalProfile.curriculum.fileReferenceId)

    user.professionalProfile.updateCurriculum(newCVFileReference?.toPublicFile())
  }

  private async updateInsurance(user: ProfessionalUser, insurance?: TBase64File): Promise<void> {
    let newInsuranceFileReference: HostedFileReference | undefined = undefined

    if (insurance) {
      newInsuranceFileReference = await this.hostedFilesService.replaceFile(
        user.professionalProfile.insurance?.fileReferenceId || null,
        { content: insurance, name: `insurance-${user._id.toString()}` },
        user._id.toString(),
        false
      )
    } else if (user.professionalProfile.insurance) await this.hostedFilesService.delete(user.professionalProfile.insurance.fileReferenceId)

    user.professionalProfile.updateInsurance(newInsuranceFileReference?.toPublicFile())
  }

  // TODO in a long time: create a score per request which includes this criteria
  getLastLoginScore(lastLogin?: Date): number {
    if (!lastLogin) return 0

    const currentDate = Date.now()

    const timeDiffInMilliseconds = currentDate - lastLogin.getTime()
    const millisecondsToDaysDivider = 1000 * 3600 * 24

    const daysSinceLastLogin = timeDiffInMilliseconds / millisecondsToDaysDivider

    switch (true) {
      case daysSinceLastLogin < 2:
        return 10
      case daysSinceLastLogin < 7:
        return 8
      case daysSinceLastLogin < 30:
        return 6
      case daysSinceLastLogin < 90:
        return 4
      case daysSinceLastLogin < 180:
        return 2
      default:
        return 0
    }
  }
}
