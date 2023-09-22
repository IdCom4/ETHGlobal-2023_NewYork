export enum MissionStatuses {
  WAITING_FOR_QUOTE = 'WAITING_FOR_QUOTE',
  QUOTE_PENDING = 'QUOTE_PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export enum MissionProposalStatuses {
  SENT = 'SENT',
  DENIED = 'DENIED',
  ACCEPTED = 'ACCEPTED',
}

export enum MissionVMCFees {
  PERCENTAGE = 20,
}
