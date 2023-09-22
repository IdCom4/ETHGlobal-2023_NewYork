import { IProfessionalExperience, ProfessionalExperience, ProfessionalExperienceBlueprint } from './professional-experience'
import { IRealisation, Realisation, RealisationBlueprint } from './realisation'
import { IStudy, Study, StudyBlueprint } from './study'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { NotFoundException } from '@nestjs/common/exceptions'
import '@/extensions'

export class ProfessionalHistory {
  @prop({ type: Array<Study>, required: true })
  @Type(() => Study)
  @Expose({ name: 'studies' })
  protected readonly _studies!: Array<Study>

  @prop({ type: Array<ProfessionalExperience>, required: true })
  @Type(() => ProfessionalExperience)
  @Expose({ name: 'professionalExperiences' })
  protected readonly _professionalExperiences!: Array<ProfessionalExperience>

  @prop({ type: Array<Realisation>, required: true })
  @Type(() => Realisation)
  @Expose({ name: 'realisations' })
  protected readonly _realisations!: Array<Realisation>

  constructor() {
    this._studies = []
    this._professionalExperiences = []
    this._realisations = []
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get studies(): readonly Study[] { return this._studies }
  get professionalExperiences(): readonly ProfessionalExperience[] { return this._professionalExperiences }
  get realisations(): readonly Realisation[] { return this._realisations }
  /* eslint-enable prettier/prettier */

  /* >==== STUDIES ====> */
  public addStudy(data: Omit<IStudy, 'id'>): Study {
    const nextAvailableId = this.getNextAvailableNumericId(this._studies.map((study) => study.id))
    const newStudy = Study.fromData({ ...data, id: nextAvailableId })
    this._studies.push(newStudy)

    return newStudy
  }

  public addStudies(studiesData: Omit<IStudy, 'id'>[]): Study[] {
    const newStudies: Study[] = []
    studiesData.forEach((studyData) => newStudies.push(this.addStudy(studyData)))

    return newStudies
  }

  public updateStudy(studyData: IStudy): void {
    const study = this._studies.find((study) => study.id === studyData.id)
    if (!study) throw new NotFoundException('No study found with id ' + studyData.id)
    study.update(studyData)
  }

  public removeStudy(studyId: number): Study | undefined {
    return this._studies.removeInPlace((study) => study.id === studyId)[0]
  }

  public removeStudies(studiesId: number[]): void {
    studiesId.forEach((id) => this.removeStudy(id))
  }
  /* <==== STUDIES ====< */

  /* >==== PROFESSIONAL EXPERIENCES ====> */
  public addProfessionalExperience(data: Omit<IProfessionalExperience, 'id'>): ProfessionalExperience {
    const nextAvailableId = this.getNextAvailableNumericId(this._professionalExperiences.map((exp) => exp.id))
    const newProfessionalExperience = ProfessionalExperience.fromData({ ...data, id: nextAvailableId })
    this._professionalExperiences.push(newProfessionalExperience)

    return newProfessionalExperience
  }

  public addProfessionalExperiences(professionalExperiencesData: Omit<IProfessionalExperience, 'id'>[]): ProfessionalExperience[] {
    const newProfessionalExperiences: ProfessionalExperience[] = []
    professionalExperiencesData.forEach((data) => newProfessionalExperiences.push(this.addProfessionalExperience(data)))

    return newProfessionalExperiences
  }

  public updateProfessionalExperience(data: IProfessionalExperience): void {
    const professionalExperience = this._professionalExperiences.find((exp) => exp.id === data.id)
    if (!professionalExperience) throw new NotFoundException('No professionalExperience found with id ' + data.id)
    professionalExperience.update(data)
  }

  public removeProfessionalExperience(id: number): ProfessionalExperience | undefined {
    return this._professionalExperiences.removeInPlace((professionalExperience) => professionalExperience.id == id)[0]
  }

  public removeProfessionalExperiences(ids: number[]): void {
    ids.forEach((id) => this.removeProfessionalExperience(id))
  }
  /* <==== PROFESSIONAL EXPERIENCES ====< */

  /* >==== REALISATIONS ====> */
  public addRealisation(data: Omit<IRealisation, 'id'>): Realisation {
    const nextAvailableId = this.getNextAvailableNumericId(this._realisations.map((realisation) => realisation.id))
    const newRealisation = Realisation.fromData({ ...data, id: nextAvailableId })
    this._realisations.push(newRealisation)
    return newRealisation
  }

  public addRealisations(realisationsData: Omit<IRealisation, 'id'>[]): Realisation[] {
    const newRealisation: Realisation[] = []
    realisationsData.forEach((data) => newRealisation.push(this.addRealisation(data)))

    return newRealisation
  }

  public updateRealisation(data: IRealisation): void {
    const realisation = this._realisations.find((realisation) => realisation.id === data.id)
    if (!realisation) throw new NotFoundException('No realisation found with id ' + data.id)
    realisation.update(data)
  }

  public removeRealisation(id: number): Realisation | undefined {
    return this._realisations.removeInPlace((realisation) => realisation.id == id)[0]
  }

  public removeRealisations(ids: number[]): void {
    ids.forEach((id) => this.removeRealisation(id))
  }
  /* <==== REALISATIONS ====< */

  private getNextAvailableNumericId(ids: Array<number>): number {
    if (!ids.length) return 0

    const maxId = ids.max()

    return maxId != null ? maxId + 1 : 0
  }
}

export abstract class ProfessionalHistoryBlueprint extends ProfessionalHistory {
  protected readonly _studies!: Array<StudyBlueprint>
  protected readonly _professionalExperiences!: Array<ProfessionalExperienceBlueprint>
  protected readonly _realisations!: Array<RealisationBlueprint>
}
