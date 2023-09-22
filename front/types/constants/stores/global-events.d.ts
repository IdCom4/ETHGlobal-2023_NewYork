export enum GlobalEventTypes {
  OPEN_LOGIN = 'open-login',
  UPDATE_NAVBAR_COLOR = 'update-navbar-color',
  MISSION_MESSAGES_SEEN = 'mission-messages-seen',
  MISSION_OPEN_DISCUSSION = 'mission-open-discussion',
  MISSION_OPEN_STATE_ACTION = 'mission-open-state-action',
  UPDATE_NAVBAR_THEME = 'update-navbar-theme',
  UPDATE_FOOTER_THEME = 'update-footer-theme',
  MY_MISSIONS = 'my-missions-select' // payload: { missionId: string, professionalId?: string, action: MyMissionEventActions }
}

declare global {
  interface IGlobalEvent {
    type: GlobalEventTypes
    payload?: unknown
  }
}
