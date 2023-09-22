import { MissionStatuses } from '@/common/enums/schemas'
import { PaymentDataBlueprint } from '../common/pojos'
import { Mission } from './mission.schema'
import { MissionClientFeedbackBlueprint, MissionClientRequestBlueprint, MissionProfessionalEntryBlueprint, MissionReportBlueprint } from './pojos'

export abstract class MissionBlueprint extends Mission {
  public _status: MissionStatuses
  public _paymentData?: PaymentDataBlueprint
  public _clientRequest: MissionClientRequestBlueprint
  public _professionalEntries: MissionProfessionalEntryBlueprint[]
  public _report?: MissionReportBlueprint
  public _invoiceId?: string
  public _adminRequiredAction?: string
  public _adminNote?: string
  public _dispute?: string
  public _clientFeedback?: MissionClientFeedbackBlueprint
  public _startedAt?: Date
  public _finishedAt?: Date
  public _deliveredAt?: Date
  public _canceledAt?: Date
  public _canceledByClient: boolean
  public createdAt: Date
  public updatedAt: Date
}
