export {}

declare global {
  interface IMissionProfessionalNotifications {
    newMissionReceived: INotificationTypes
    newQuoteRequired: INotificationTypes
    missionValidatedByClient: INotificationTypes
    professionalDeniedByClient: INotificationTypes
    missionCanceledByClient: INotificationTypes
  }

  interface ILiteProfessionalProfile {
    businessName: string
    businessPicture?: IPublicFile
    businessPresentation?: string
    workAddress?: IStrictAddress
    averageHourlyRate?: number
    averageAvailability?: string
    maxTravelDistance?: number
    skillIds: string[]
    history: IProfessionalHistory
    curriculum?: IPublicFile
    insurance?: IPublicFile
    company?: ICompany
    nbrFinishedMissions: number
    clientReviews: IReview[]
    isFavoriteOf: number
    completionScore: number
  }

  interface IProfessionalProfile extends ILiteProfessionalProfile {
    businessPhone: string
    businessEmail: string
    notificationPreferences: IMissionProfessionalNotifications
    company?: ICompany
    billingAddress?: IStrictAddress
    missionsId: string[]
    isFavoriteOf: string[]
    professionalPaymentData: IProfessionalPaymentData
    vmcCertified: boolean
    ecologicalCharter: boolean
    skillIds?: string[]
  }
}
