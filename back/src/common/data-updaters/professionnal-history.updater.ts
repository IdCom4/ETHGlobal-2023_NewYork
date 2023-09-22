import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { ProfessionalExperience, ProfessionalUser, Realisation, Study } from '@Schemas/user'
import { ProfessionalExperienceRequest, RealisationRequest, StudyRequest } from '@Api/professionals/requests/update-professional-profile/pojos.dto'
import { BadRequestException } from '@nestjs/common'

export class ProfessionalHistoryUpdater {
  constructor(private readonly hostedFilesService: HostedFilesService) {}

  /* >=== STUDIES UPDATE ====> */
  public async updateStudies(user: ProfessionalUser, requests: StudyRequest[]): Promise<void> {
    // get current studies
    const currentStudies = user.professionalProfile.history.studies

    const studiesIds = currentStudies.map((study) => study.id)
    const requestIds = requests.filter((study) => Object.isDefined(study.id)).map((study) => study.id)

    // isolate each type of study
    const studiesToAdd = requests.filter((request) => !Object.isDefined(request.id))
    const studiesToUpdate = requests.filter((request) => Object.isDefined(request.id) && studiesIds.includes(request.id))
    const studiesToDelete = currentStudies.filter((study) => !requestIds.includes(study.id))

    // delete studies that must be
    await this.deleteStudies(user, studiesToDelete)
    // update those that must be
    await this.updateModifiedStudies(currentStudies, studiesToUpdate)
    // create new ones
    await this.addNewStudies(user, studiesToAdd)
  }

  private async deleteStudies(user: ProfessionalUser, studiesToDelete: Study[]): Promise<void> {
    // delete studies that must be
    user.professionalProfile.history.removeStudies(studiesToDelete.map((study) => study.id))
  }

  private async updateModifiedStudies(currentStudies: readonly Study[], studiesToUpdate: StudyRequest[]): Promise<void> {
    for (const modifiedStudy of studiesToUpdate) {
      // find the current version of the study
      const currentStudy = currentStudies.find((study) => study.id === modifiedStudy.id)
      if (!currentStudy) throw new BadRequestException('Une formation à mettre à jour semble ne pas exister')

      // update it
      currentStudy.update({
        ...modifiedStudy,
        dateRange: modifiedStudy.dateRange?.toFlexibleDateTimeRange(),
        schoolAddress: modifiedStudy.schoolAddress?.toLenientAddress(),
      })
    }
  }

  private async addNewStudies(user: ProfessionalUser, newStudies: StudyRequest[]): Promise<void> {
    for (const studyToAdd of newStudies)
      user.professionalProfile.history.addStudy({
        ...studyToAdd,
        dateRange: studyToAdd.dateRange?.toFlexibleDateTimeRange(),
        schoolAddress: studyToAdd.schoolAddress?.toLenientAddress(),
      })
  }

  /* <=== STUDIES UPDATE ====< */

  /* >=== PROFESSIONAL EXPERIENCES UPDATE ====> */
  public async updateProfessionalExperiences(user: ProfessionalUser, requests: ProfessionalExperienceRequest[]): Promise<void> {
    // get current professionalExperiences
    const currentExperiences = user.professionalProfile.history.professionalExperiences

    const experiencesIds = currentExperiences.map((experience) => experience.id)
    const requestIds = requests.filter((request) => Object.isDefined(request.id)).map((request) => request.id)

    // isolate each type of professionalExperience
    const experiencesToAdd = requests.filter((request) => !Object.isDefined(request.id))
    const experiencesToUpdate = requests.filter((request) => Object.isDefined(request.id) && experiencesIds.includes(request.id))
    const experiencesToDelete = currentExperiences.filter((experience) => !requestIds.includes(experience.id))

    // delete professionalExperiences that must be
    await this.deleteProfessionalExperiences(user, experiencesToDelete)
    // update those that must be
    await this.updateModifiedProfessionalExperiences(currentExperiences, experiencesToUpdate)
    // create new ones
    await this.addNewProfessionalExperiences(user, experiencesToAdd)
  }

  private async deleteProfessionalExperiences(user: ProfessionalUser, experiencesToDelete: ProfessionalExperience[]): Promise<void> {
    // delete professionalExperiences that must be
    const idsOfExperiencesToDelete = experiencesToDelete.map((professionalExperience) => professionalExperience.id)
    user.professionalProfile.history.removeProfessionalExperiences(idsOfExperiencesToDelete)
  }

  private async updateModifiedProfessionalExperiences(
    currentExperiences: readonly ProfessionalExperience[],
    experiencesToUpdate: ProfessionalExperienceRequest[]
  ): Promise<void> {
    for (const modifiedExperience of experiencesToUpdate) {
      // find the current version of the professionalExperience
      const currentProfessionalExperience = currentExperiences.find((experience) => experience.id === modifiedExperience.id)
      if (!currentProfessionalExperience) throw new BadRequestException('Une expérience à mettre à jour semble ne pas exister')

      // update it
      currentProfessionalExperience.update({
        ...modifiedExperience,
        dateRange: modifiedExperience.dateRange?.toFlexibleDateTimeRange(),
      })
    }
  }

  private async addNewProfessionalExperiences(user: ProfessionalUser, experiencesToAdd: ProfessionalExperienceRequest[]): Promise<void> {
    for (const newExperience of experiencesToAdd) {
      user.professionalProfile.history.addProfessionalExperience({
        ...newExperience,
        dateRange: newExperience.dateRange?.toFlexibleDateTimeRange(),
      })
    }
  }

  /* <=== PROFESSIONAL EXPERIENCES UPDATE ====< */

  /* >=== REALISATIONS UPDATE ====> */
  public async updateRealisations(user: ProfessionalUser, requests: RealisationRequest[]): Promise<void> {
    // get current realisations
    const currentRealisations = user.professionalProfile.history.realisations

    const realisationsIds = currentRealisations.map((realisation) => realisation.id)
    const requestIds = requests.filter((realisation) => Object.isDefined(realisation.id)).map((realisation) => realisation.id)

    // isolate each type of realisation
    const realisationsToAdd = requests.filter((request) => !Object.isDefined(request.id))
    const realisationsToUpdate = requests.filter((request) => Object.isDefined(request.id) && realisationsIds.includes(request.id))
    const realisationsToDelete = currentRealisations.filter((realisation) => !requestIds.includes(realisation.id))

    // delete realisations that must be
    await this.deleteRealisations(user, realisationsToDelete)
    // update those that must be
    await this.updateModifiedRealisations(user, currentRealisations, realisationsToUpdate)
    // create new ones
    await this.addNewRealisations(user, realisationsToAdd)
  }

  private async deleteRealisations(user: ProfessionalUser, realisationsToDelete: Realisation[]): Promise<void> {
    // delete realisations that must be
    user.professionalProfile.history.removeRealisations(realisationsToDelete.map((realisation) => realisation.id))
    // delete their files
    for (const realisation of realisationsToDelete) {
      for (const file of realisation.files) await this.hostedFilesService.delete(file.fileReferenceId)
    }
  }

  private async updateModifiedRealisations(
    user: ProfessionalUser,
    currentRealisations: readonly Realisation[],
    realisationsToUpdate: RealisationRequest[]
  ): Promise<void> {
    for (const modifiedRealisation of realisationsToUpdate) {
      // find the current version of the realisation
      const currentRealisation = currentRealisations.find((realisation) => realisation.id === modifiedRealisation.id)
      if (!currentRealisation) throw new BadRequestException('Une réalisation à mettre à jour semble ne pas exister')

      // update it
      currentRealisation.update({
        ...modifiedRealisation,
        files: modifiedRealisation.files.map((fileDTO) => fileDTO.toPublicFile()),
      })

      // delete the files that must be deleted
      const idsOfFilesToKeep = modifiedRealisation.files.map((file) => file.fileReferenceId)
      const filesToDelete = currentRealisation.files.filter((file) => !idsOfFilesToKeep.includes(file.fileReferenceId))

      currentRealisation.removeFiles(filesToDelete.map((file) => file.fileReferenceId))
      filesToDelete.forEach((fileToDelete) => this.hostedFilesService.delete(fileToDelete.fileReferenceId))

      // upload the new ones if any
      if (modifiedRealisation.newFiles) {
        const filePayloads: TFile[] = modifiedRealisation.newFiles.map((file, index) => ({
          content: file,
          name: `realisation-${currentRealisation.id}_${index}`,
        }))

        const newFiles = await this.hostedFilesService.uploadMany(filePayloads, user._id.toString(), false)
        // and add them to the current ones
        currentRealisation.addFiles(newFiles.map((file) => file.toPublicFile()))
      }
    }
  }

  private async addNewRealisations(user: ProfessionalUser, newRealisations: RealisationRequest[]): Promise<void> {
    for (const realisationToAdd of newRealisations) {
      const newRealisation = user.professionalProfile.history.addRealisation({
        ...realisationToAdd,
        files: realisationToAdd.files.map((fileDTO) => fileDTO.toPublicFile()),
      })

      // upload new files if any
      if (realisationToAdd.newFiles) {
        const filePayloads: TFile[] = realisationToAdd.newFiles.map((file, index) => ({
          content: file,
          name: `realisation-${newRealisation.id}_${index}`,
        }))

        const newFiles = await this.hostedFilesService.uploadMany(filePayloads, user._id.toString(), false)

        newRealisation.addFiles(newFiles.map((file) => file.toPublicFile()))
      }
    }
  }

  /* <=== REALISATIONS UPDATE ====< */
}
