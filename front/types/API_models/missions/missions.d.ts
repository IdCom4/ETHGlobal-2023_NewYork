//front only

import { EMissionButtonText, MissionStatuses } from './mission.enum.d'

export {}
declare global {
  /* >==== MAIN MISSION INTERFACES ====> */

  interface IMission {
    _id: string
    status: MissionStatuses
    clientRequest: IMissionClientRequest
    professionalEntries: IMissionProfessionalEntry[]
    report?: IMissionReport
    invoiceId?: string
    createdAt: string
    startedAt?: string
    finishedAt?: string
    deliveredAt?: string
    canceledAt?: string
    canceledByClient?: boolean
    dispute?: string
  }

  interface IProfessionalMission extends IMission {
    professionalEntries: [IOwnMissionProfessionalEntry]
  }

  interface IAdminMission extends IMission {
    paymentData?: IPaymentData
  }

  interface IPopulatedMission extends IMission {
    clientRequest: IPopulatedMissionClientRequest
  }

  interface IPopulatedProfessionalMission extends IProfessionalMission {
    clientRequest: IPopulatedMissionClientRequest
  }

  /* >==== OTHER MISSION RELATED TYPES AND INTERFACES ====> */

  interface IMissionCategoryParameter {
    icon: string
    buttonText: IMissionButtonText
    categoryTitle: string
    status: MissionStatuses
  }

  interface IMissionButtonText {
    messageButton: string
    missionButton: EMissionButtonText
  }

  type TMissionsByStatus = Record<MissionStatuses, IPopulatedMission[]>
  type TMissionsCardInfoListByStatus<T extends ILiteUser = ILiteUser> = Record<MissionStatuses, Record<string, IMissionCardInfo<T>[]>>

  interface IMissionCardInfo<T extends ILiteUser = ILiteUser> {
    user: T
    missionId: string
    startDate: string
    pickupAddress: IStrictAddress
    issues: IIssue[]
    specialInfo: string
    userId: string
    vehicle?: IGuestVehicle
    hasUnseenMessage?: boolean
  }

  interface IMissionPraticalities {
    idealAdress: IStrictAddress
    pickupAddress: IStrictAddress
    idealStartingMoment: string
    startDate: string
  }
  interface ICardInfoInjector<T extends ILiteUser = ILiteUser> {
    selectedCard: Ref<IMissionCardInfo | undefined>
    updateSelectedCard: (request: IMissionCardInfo<T>) => void
  }

  interface IMissionReport {
    vehicleMileage: number
    interventionIds: string[]
    otherInterventions: string[]
  }
}
