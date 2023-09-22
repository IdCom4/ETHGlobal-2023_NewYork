import { AdminComment, LenientAddress, PublicFile, Review, StrictAddress } from '@/schemas/common/pojos'
import { Company, ProfessionalHistory, MissionProfessionalNotificationPreferences, ProfessionalPaymentData } from './'
import { Expose, Type } from 'class-transformer'
import { UserGroups } from '@/common/enums/groups/user.groups'
import { prop } from '@typegoose/typegoose'

export class ProfessionalProfile {
  @prop({ type: String, required: true })
  @Expose({ name: 'businessName' })
  protected _businessName!: string

  @prop({ type: PublicFile, _id: false })
  @Type(() => PublicFile)
  @Expose({ name: 'businessPicture' })
  protected _businessPicture?: PublicFile

  @prop({ type: String })
  @Expose({ name: 'businessPresentation' })
  protected _businessPresentation?: string

  @prop({ type: Object as unknown as MissionProfessionalNotificationPreferences })
  @Type(() => MissionProfessionalNotificationPreferences)
  @Expose({ name: 'notificationPreferences', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _notificationPreferences!: MissionProfessionalNotificationPreferences

  @prop({ type: Object as unknown as Company, _id: false })
  @Type(() => Company)
  @Expose({ name: 'company' })
  protected _company?: Company

  @prop({ type: StrictAddress, _id: false })
  @Type(() => StrictAddress)
  @Expose({ name: 'workAddress' })
  protected _workAddress?: StrictAddress

  @prop({ type: LenientAddress, _id: false })
  @Type(() => LenientAddress)
  @Expose({ name: 'billingAddress', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _billingAddress?: LenientAddress

  @prop({ type: Number })
  @Expose({ name: 'averageHourlyRate' })
  protected _averageHourlyRate?: number

  @prop({ type: String })
  @Expose({ name: 'averageAvailability' })
  protected _averageAvailability?: string

  @prop({ type: Number })
  @Expose({ name: 'maxTravelDistance' })
  protected _maxTravelDistance?: number

  @prop({ required: true })
  @Expose({ name: 'skillIds' })
  protected _skillIds!: string[]

  @prop({ type: Object as unknown as ProfessionalHistory, _id: false })
  @Type(() => ProfessionalHistory)
  @Expose({ name: 'history' })
  protected _history!: ProfessionalHistory

  @prop({ type: PublicFile, _id: false })
  @Type(() => PublicFile)
  @Expose({ name: 'curriculum' })
  protected _curriculum?: PublicFile

  @prop({ type: PublicFile, _id: false })
  @Type(() => PublicFile)
  @Expose({ name: 'insurance' })
  protected _insurance?: PublicFile

  @prop()
  @Expose({ name: 'missionsId', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _missionsId!: Array<string>

  @prop({ type: Number })
  @Expose({ name: 'nbrFinishedMissions' })
  protected _nbrFinishedMissions!: number

  @prop({ _id: false })
  @Type(() => Review)
  @Expose({ name: 'clientReviews' })
  protected _clientReviews!: Array<Review>

  @prop()
  @Expose({ name: 'isFavoriteOf' })
  protected _isFavoriteOf!: Array<string>

  @prop({ type: Object as unknown as ProfessionalPaymentData, _id: false })
  @Type(() => ProfessionalPaymentData)
  @Expose({ name: 'professionalPaymentData', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _professionalPaymentData!: ProfessionalPaymentData

  @prop({ type: Number })
  @Expose({ name: 'completionScore' })
  protected _completionScore!: number

  @prop({ type: Number })
  @Expose({ name: 'bonusScore', groups: [UserGroups.ADMIN_REQUEST] })
  protected _bonusScore!: number

  @prop({ type: Boolean })
  @Expose({ name: 'vmcCertified' })
  protected _vmcCertified!: boolean

  @prop({ type: Boolean })
  @Expose({ name: 'ecologicalCharter' })
  protected _ecologicalCharter!: boolean

  @prop({ type: Boolean })
  @Expose({ name: 'shadowBanned', groups: [UserGroups.ADMIN_REQUEST] })
  protected _shadowBanned!: boolean

  @prop({ type: Array<AdminComment>, _id: false })
  @Expose({ name: 'adminNote', groups: [UserGroups.ADMIN_REQUEST] })
  protected _adminNotes!: AdminComment[]

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(businessName: string, skillIds: string[], workAddress: StrictAddress): ProfessionalProfile {
    const profile = new ProfessionalProfile()

    profile._businessName = businessName
    profile._notificationPreferences = new MissionProfessionalNotificationPreferences()

    profile._skillIds = skillIds
    profile._workAddress = workAddress
    profile._nbrFinishedMissions = 0
    profile._history = new ProfessionalHistory()
    profile._missionsId = []
    profile._clientReviews = []
    profile._isFavoriteOf = []
    profile._professionalPaymentData = new ProfessionalPaymentData()
    profile._completionScore = 0
    profile._bonusScore = 0
    profile._vmcCertified = false
    profile._ecologicalCharter = true
    profile._shadowBanned = false

    profile._adminNotes = []

    return profile
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get businessName():               string                                         { return this._businessName             }
  public set businessName(businessName:    string)                                        { this._businessName = businessName     }

  public get businessPicture():            PublicFile | undefined                         { return this._businessPicture          }
  public set businessPicture(businessPicture: PublicFile | undefined)                     { this._businessPicture = businessPicture }

  public get businessPresentation():       string | undefined                             { return this._businessPresentation     }
  public set businessPresentation(businessPresentation: string | undefined)               { this._businessPresentation = businessPresentation }

  public get notificationPreferences():    MissionProfessionalNotificationPreferences     { return this._notificationPreferences  }
  public set notificationPreferences(notificationPreferences: MissionProfessionalNotificationPreferences) { this._notificationPreferences = notificationPreferences }

  public get company():                    Company | undefined                            { return this._company                  }
  public set company(company:              Company | undefined)                           { this._company = company               }

  public get workAddress():                StrictAddress | undefined                      { return this._workAddress              }
  public set workAddress(workAddress:      StrictAddress | undefined)                     { this._workAddress = workAddress       }

  public get billingAddress():             LenientAddress | undefined                     { return this._billingAddress           }
  public set billingAddress(billingAddress: LenientAddress | undefined)                   { this._billingAddress = billingAddress }

  public get averageHourlyRate():          number | undefined                             { return this._averageHourlyRate        }
  public set averageHourlyRate(averageHourlyRate: number | undefined)                     { this._averageHourlyRate = averageHourlyRate }

  public get averageAvailability():        string | undefined                             { return this._averageAvailability      }
  public set averageAvailability(averageAvailability: string | undefined)                 { this._averageAvailability = averageAvailability }

  public get maxTravelDistance():          number | undefined                             { return this._maxTravelDistance        }
  public set maxTravelDistance(maxTravelDistance: number | undefined)                     { this._maxTravelDistance = maxTravelDistance }

  public get skillIds():                   string[]                                       { return this._skillIds                 }
  public set skillIds(skillIds:            string[])                                      { this._skillIds = skillIds             }

  public get history():                    ProfessionalHistory                            { return this._history                  }
  public set history(history:              ProfessionalHistory)                           { this._history = history               }

  public get curriculum():                 PublicFile | undefined                         { return this._curriculum               }
  public set curriculum(curriculum:        PublicFile | undefined)                        { this._curriculum = curriculum         }

  public get insurance():                  PublicFile | undefined                         { return this._insurance                }
  public set insurance(insurance:          PublicFile | undefined)                        { this._insurance = insurance           }

  public get missionsId():                 string[]                                       { return this._missionsId               }
  public set missionsId(missionsId:        string[])                                      { this._missionsId = missionsId         }

  public get nbrFinishedMissions():        number                                         { return this._nbrFinishedMissions      }
  public set nbrFinishedMissions(nbrFinishedMissions: number)                             { this._nbrFinishedMissions = nbrFinishedMissions }

  public get clientReviews():              Review[]                                       { return this._clientReviews            }

  public get isFavoriteOf():               string[]                                       { return this._isFavoriteOf             }
  public set isFavoriteOf(isFavoriteOf:    string[])                                      { this._isFavoriteOf = isFavoriteOf     }

  public get professionalPaymentData():    ProfessionalPaymentData                        { return this._professionalPaymentData  }
  public set professionalPaymentData(professionalPaymentData: ProfessionalPaymentData)    { this._professionalPaymentData = professionalPaymentData }

  public get completionScore():            number                                         { return this._completionScore          }
  public set completionScore(completionScore: number)                                     { this._completionScore = completionScore }

  public get bonusScore():                 number                                         { return this._bonusScore               }
  public set bonusScore(bonusScore:        number)                                        { this._bonusScore = bonusScore         }

  public get vmcCertified():               boolean                                        { return this._vmcCertified             }
  public set vmcCertified(vmcCertified:    boolean)                                       { this._vmcCertified = vmcCertified     }

  public get ecologicalCharter():          boolean                                        { return this._ecologicalCharter        }
  public set ecologicalCharter(ecologicalCharter: boolean)                                { this._ecologicalCharter = ecologicalCharter }

  public get shadowBanned():               boolean                                        { return this._shadowBanned             }
  public set shadowBanned(shadowBanned:    boolean)                                       { this._shadowBanned = shadowBanned     }

  public updateBusinessName(name: string):                      void { this._businessName = name                  }
  public updateBusinessPresentation(presentation?: string):     void { this._businessPresentation = presentation  }
  public updateBusinessPicture(picture?: PublicFile):           void { this._businessPicture = picture            }
  public updateAverageHourlyRate(rate?: number):                void { this._averageHourlyRate = rate             }
  public updateAverageAvailability(availability?: string):      void { this._averageAvailability = availability   }
  public updateMaxTravelDistance(distance?: number):            void { this._maxTravelDistance = distance         }
  public updateWorkAddress(workAddress?: StrictAddress):        void { this._workAddress = workAddress            }
  public updateBillingAddress(billingAddress?: LenientAddress): void { this._billingAddress = billingAddress      }
  public updateCompany(company?: Company):                      void { this._company = company                    }
  public updateInsurance(insurance?: PublicFile):               void { this._insurance = insurance                }
  public updateCurriculum(curriculum?: PublicFile):             void { this._curriculum = curriculum              }
  public updateSkillIds(skillIds: string[]):                    void { this._skillIds = skillIds                  }
  /* eslint-enable prettier/prettier */

  @Expose({ name: 'hasCompany' })
  public hasCompany(): boolean {
    return !!this._company
  }

  public getEffectiveScore(): number {
    return this._completionScore + this._bonusScore
  }

  public getAverageUserRatings(): number {
    return this._clientReviews.reduce((accumulator, currentReview) => accumulator + currentReview.rating, 0) / this._clientReviews.length
  }

  public incrementFinishedMissions(): void {
    this._nbrFinishedMissions++
  }

  public addClientReview(review: Review): void {
    this._clientReviews.push(review)
  }

  public addAdminNote(note: AdminComment): void {
    this._adminNotes.push(note)
  }

  // TODO in a long time: rework this function and make the computation dynamic
  public updateCompletionScore(): number {
    // const score = scoreService.getScore()

    /* eslint-disable prettier/prettier */
    const businessPresentationScore: number = this._businessPresentation ? 10 : 0
    const proExperienceScore: number = this._history.professionalExperiences.length
    const businessNameScore: number = this._businessName ? 10 : 0
    const realisationScore: number = this._history.realisations.length >= 3 ? this._history.realisations.length : 0
    const workAddressScore: number = this._workAddress ? 10 : 0
    const insuranceScore: number = this._insurance ? 10 : 0
    const companyScore: number = this.hasCompany() ? 10 : 0
    const pictureScore: number = this._businessPicture ? 10 : 0
    const ratingScore: number = this.getUserRatingsScore()
    const studyScore: number = this._history.studies.length
    const cvScore: number = this._curriculum ? 10 : 0
    /* eslint-enable prettier/prettier */

    const rawHistoryScore = studyScore * 1 + realisationScore * 2 + proExperienceScore * 1
    const finalHistoryScore = rawHistoryScore <= 10 ? rawHistoryScore : 10

    const totalScore =
      businessPresentationScore * 3 +
      businessNameScore * 3 +
      workAddressScore * 3 +
      insuranceScore * 3 +
      companyScore * 3 +
      pictureScore * 3 +
      ratingScore * 1 +
      cvScore * 1 +
      finalHistoryScore

    const maxTotal = 210
    const totalScorePercentageOfMax = (totalScore * 100) / maxTotal

    this._completionScore = Math.round(totalScorePercentageOfMax)

    return totalScorePercentageOfMax
  }

  private getUserRatingsScore(): number {
    const rating = this.getAverageUserRatings()

    switch (true) {
      case rating > 4.5:
        return 10
      case rating > 4:
        return 7
      case rating > 3.5:
        return 3
      default:
        return 0
    }
  }
}

export abstract class ProfessionalProfileBlueprint extends ProfessionalProfile {
  public _businessName!: string
  public _businessPicture?: PublicFile
  public _businessPresentation?: string
  public _notificationPreferences!: MissionProfessionalNotificationPreferences
  public _company?: Company
  public _workAddress?: StrictAddress
  public _billingAddress?: LenientAddress
  public _averageHourlyRate?: number
  public _averageAvailability?: string
  public _maxTravelDistance?: number
  public _skillIds!: string[]
  public _history!: ProfessionalHistory
  public _curriculum?: PublicFile
  public _insurance?: PublicFile
  public _missionsId!: Array<string>
  public _nbrFinishedMissions!: number
  public _clientReviews!: Array<Review>
  public _isFavoriteOf!: Array<string>
  public _professionalPaymentData!: ProfessionalPaymentData
  public _completionScore!: number
  public _bonusScore!: number
  public _vmcCertified!: boolean
  public _ecologicalCharter!: boolean
  public _shadowBanned!: boolean
  public _adminNotes: AdminComment[]
}
