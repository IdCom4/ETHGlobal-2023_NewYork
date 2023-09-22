import { PublicFile, Review, StrictAddress } from '@/schemas/common/pojos'
import { Company, ProfessionalHistory, ProfessionalProfile } from '@/schemas/user'
import { Expose, Type } from 'class-transformer'

export class LiteProfessionalProfileResponse {
  /* eslint-disable prettier/prettier */
  @Expose()                                                public businessName!: string
  @Expose() @Type(() => PublicFile)                        public businessPicture?: PublicFile
  @Expose()                                                public businessPresentation?: string
  @Expose() @Type(() => StrictAddress)                     public workAddress?: StrictAddress
  @Expose()                                                public averageHourlyRate?: number
  @Expose()                                                public averageAvailability?: string
  @Expose()                                                public maxTravelDistance?: number
  @Expose()                                                public skillIds!: string[]
  @Expose() @Type(() => ProfessionalHistory)               public history!: ProfessionalHistory
  @Expose() @Type(() => PublicFile)                        public curriculum?: PublicFile
  @Expose() @Type(() => PublicFile)                        public insurance?: PublicFile
  @Expose() @Type(() => Company)                           public company?: Company
  @Expose()                                                public nbrFinishedMissions!: number
  @Expose() @Type(() => Review)                            public clientReviews!: Array<Review>
  @Expose()                                                public isFavoriteOf!: number
  @Expose()                                                public completionScore!: number
  /* eslint-enable prettier/prettier */

  constructor(profile: ProfessionalProfile) {
    this.businessName = profile.businessName
    this.businessPicture = profile.businessPicture
    this.businessPresentation = profile.businessPresentation
    this.workAddress = profile.workAddress
    this.averageHourlyRate = profile.averageHourlyRate
    this.averageAvailability = profile.averageAvailability
    this.maxTravelDistance = profile.maxTravelDistance
    this.skillIds = profile.skillIds
    this.history = profile.history
    this.curriculum = profile.curriculum
    this.insurance = profile.insurance
    this.nbrFinishedMissions = profile.nbrFinishedMissions
    this.clientReviews = profile.clientReviews
    this.isFavoriteOf = profile.isFavoriteOf.length
    this.completionScore = profile.completionScore
    this.company = profile.company
  }
}
