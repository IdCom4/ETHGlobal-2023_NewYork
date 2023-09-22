export enum MissionStatuses {
  WAITING_FOR_QUOTE = 'WAITING_FOR_QUOTE',
  QUOTE_PENDING = 'QUOTE_PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export enum MissionProposalStatuses {
  SENT = 'SENT',
  DENIED = 'DENIED',
  ACCEPTED = 'ACCEPTED'
}

export enum MyMissionEventActions {
  DELETE = 'delete',
  SELECT = 'select',
  OPEN_RECAP = 'open-recap',
  OPEN_PROGRESS = 'open-progress',
  OPEN_DISCUSSION = 'open-discussion',
  OPEN_QUOTE = 'open-quote',
  OPEN_VALIDATE = 'open-validate',
  OPEN_INVOICE = 'open-invoice',
  UPDATE_QUOTE = 'update-quote'
}

// TODO: rework GlobalEvent system to include typing
export type TMyMissionsEventPayload = { missionId: string; professionalId?: string; action: MyMissionEventActions }
