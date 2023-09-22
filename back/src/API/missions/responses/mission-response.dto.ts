import { UserGroups } from '@/common/enums'
import { MissionStatuses } from '@/common/enums/schemas'
import { PaymentData } from '@/schemas/common/pojos'
import { Mission, MissionReport } from '@/schemas/mission'
import { Expose, Type } from 'class-transformer'
import { MissionClientRequestResponse, MissionProfessionalEntryResponse, OwnMissionProfessionalEntryResponse } from './pojos'
import { ProfessionalUser, User } from '@/schemas/user'
import { Vehicle } from '@/schemas/vehicle'
import { ProfessionalNotFoundException } from '@/common/exceptions/schemas/user'
import { MissionNotFoundException } from '@/common/exceptions/schemas/mission'

export abstract class AbstractMissionResponse {
  /* eslint-disable prettier/prettier */
  @Expose()                                               public _id: string
  @Expose()                                               public status: MissionStatuses
  @Expose() @Type(() => MissionClientRequestResponse)     public clientRequest: MissionClientRequestResponse
  @Expose() @Type(() => MissionProfessionalEntryResponse) public professionalEntries: MissionProfessionalEntryResponse[]
  @Expose() @Type(() => MissionReport)                    public report?: MissionReport
  @Expose()                                               public invoiceId?: string
  @Expose()                                               public createdAt: Date
  @Expose()                                               public startedAt?: Date
  @Expose()                                               public finishedAt?: Date
  @Expose()                                               public deliveredAt?: Date
  @Expose()                                               public canceledAt?: Date
  @Expose()                                               public canceledByClient?: boolean
  @Expose()                                               public dispute?: string
  /* eslint-enable prettier/prettier */

  constructor(mission: Mission, client: User, vehicleData: { vehicle: Vehicle; brandName: string }) {
    this._id = mission._id.toString()
    this.status = mission.status

    this.invoiceId = mission.invoiceId

    this.clientRequest = new MissionClientRequestResponse(client, vehicleData, mission.clientRequest)

    this.report = mission.report

    this.createdAt = mission.getCreatedAt()
    this.startedAt = mission.startedAt
    this.finishedAt = mission.finishedAt
    this.deliveredAt = mission.deliveredAt
    this.canceledAt = mission.canceledAt
    this.canceledByClient = mission.canceledByClient
  }
}

export class ClientMissionResponse extends AbstractMissionResponse {
  constructor(loggedClient: User, mission: Mission, selectedProfessionals: ProfessionalUser[], vehicleData: { vehicle: Vehicle; brandName: string }) {
    super(mission, loggedClient, vehicleData)

    this.professionalEntries = mission.professionalEntries.map((entry) => {
      const relatedProfessional = selectedProfessionals.find((user) => user._id.toString() === entry.professionalId)
      if (!relatedProfessional) throw new ProfessionalNotFoundException()

      return new MissionProfessionalEntryResponse(relatedProfessional, entry)
    })

    this.dispute = mission.dispute
  }
}

export class ProfessionalMissionResponse extends AbstractMissionResponse {
  constructor(loggedProfessional: ProfessionalUser, mission: Mission, client: User, vehicleData: { vehicle: Vehicle; brandName: string }) {
    super(mission, client, vehicleData)

    const professionalOwnId = loggedProfessional._id.toString()
    const professionalOwnEntry = mission.professionalEntries.find((entry) => entry.professionalId === professionalOwnId)
    if (!professionalOwnEntry) throw new MissionNotFoundException()

    this.professionalEntries = [new OwnMissionProfessionalEntryResponse(loggedProfessional, professionalOwnEntry)]
  }
}

export class AdminMissionResponse extends AbstractMissionResponse {
  /* eslint-disable prettier/prettier */
  @Expose({ groups: [UserGroups.ADMIN_REQUEST] }) @Type(() => PaymentData) public paymentData?: PaymentData
  /* eslint-enable prettier/prettier */

  constructor(mission: Mission, client: User, selectedProfessionals: ProfessionalUser[], vehicleData: { vehicle: Vehicle; brandName: string }) {
    super(mission, client, vehicleData)

    this.paymentData = mission.paymentData
    this.professionalEntries = mission.professionalEntries.map((entry) => {
      const relatedProfessional = selectedProfessionals.find((user) => user._id.toString() === entry.professionalId)
      if (!relatedProfessional) throw new ProfessionalNotFoundException()

      return new MissionProfessionalEntryResponse(relatedProfessional, entry)
    })

    this.dispute = mission.dispute
  }
}
