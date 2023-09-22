import { MissionStatuses } from '@/assets/ts/enums'

export interface IMissionStatusMetaData {
  translation: string
  icon: string
}

export const MissionStatusesMetaData: Record<MissionStatuses, IMissionStatusMetaData> = {
  /* eslint-disable prettier/prettier */
  WAITING_FOR_QUOTE:  { translation: 'En attente de devis',       icon: 'fa-solid fa-car'             },
  QUOTE_PENDING:      { translation: 'Devis reçu',                icon: 'fa-solid fa-car'             },
  IN_PROGRESS:        { translation: 'En cours',                  icon: 'fa-solid fa-gears'           },
  FINISHED:           { translation: 'En attente de validation',  icon: 'fa-solid fa-clipboard-check' },
  DELIVERED:          { translation: 'Terminée',                  icon: 'fa-solid fa-circle-check'    },
  CANCELED:           { translation: '',                          icon: ''                            },                        
  /* eslint-enable prettier/prettier */
}

/* export const missionStatusDisplayData: Record<MissionStatuses, IMissionCategoryParameter> = {
  WAITING_FOR_QUOTE: {
    icon: 'fa-solid fa-car',
    buttonText: {
      messageButton: 'Nouveau message',
      missionButton: EMissionButtonText.VIEW_MISSION
    },
    categoryTitle: 'Demandes de devis',
    status: MissionStatuses.WAITING_FOR_QUOTE
  },
  CANCELED: {
    icon: '',
    buttonText: {
      messageButton: '',
      missionButton: '' as EMissionButtonText
    },
    categoryTitle: '',
    status: MissionStatuses.CANCELED
  },
  FINISHED: {
    icon: 'fa-solid fa-clipboard-check',
    buttonText: {
      messageButton: 'Messages',
      missionButton: EMissionButtonText.VALIDATE_MISSION
    },
    categoryTitle: 'Missions à valider',
    status: MissionStatuses.FINISHED
  },
  DELIVERED: {
    icon: 'fa-solid fa-circle-check',
    buttonText: {
      messageButton: 'Messages',
      missionButton: EMissionButtonText.VIEW_INVOICE
    },
    categoryTitle: 'Missions terminées',
    status: MissionStatuses.DELIVERED
  },
  IN_PROGRESS: {
    icon: 'fa-solid fa-gears',
    buttonText: {
      messageButton: 'Nouveau message',
      missionButton: EMissionButtonText.VIEW_QUOTE
    },
    categoryTitle: 'Mission en cours',
    status: MissionStatuses.IN_PROGRESS
  },
  QUOTE_PENDING: {
    icon: 'fa-solid fa-car',
    buttonText: {
      messageButton: 'Nouveau message',
      missionButton: EMissionButtonText.VIEW_QUOTE
    },
    categoryTitle: 'Demandes de devis',
    status: MissionStatuses.QUOTE_PENDING
  }
} */
