export {}

declare global {
  interface MissionClientNotifications {
    newQuoteReceived: INotificationTypes
    missionFinished: INotificationTypes
    newMissionProposal: INotificationTypes
    missionCanceledByProfessional: INotificationTypes
  }

  interface MissionClientProfile {
    cgu: boolean
    notificationPreferences: MissionClientNotifications
    missionsId?: string[]
    customerId?: string
    favoriteProfessionalsId?: string[]
  }
}
