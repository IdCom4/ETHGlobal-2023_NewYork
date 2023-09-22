export const MOTEUR_REVISION = 'Moteur/Révision'
export const SECURITE = 'Sécurité'
export const EMBRAYAGE_TRANSMISSION = 'Embrayage/Transmission'
export const AUTRES = 'Autres'

export const BOX = {
  CATEGORIES: {
    MECABOX: { enum: 'MECABOX', translation: 'Box Mécanique' },
    WASHBOX: { enum: 'WASHBOX', translation: 'Box Lavage' },
    DETAILINGBOX: { enum: 'DETAILINGBOX', translation: 'Box Detailing' }
  }
}

export const MISSION_STATUS = {
  WAITING_FOR_QUOTE: 'WAITING_FOR_QUOTE',
  QUOTE_PENDING: 'QUOTE_PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED'
}

export const MISSION_STATUS_TRANSLATION = {
  WAITING_FOR_QUOTE: 'En attente de devis',
  QUOTE_PENDING: 'Devis reçu',
  IN_PROGRESS: 'En cours',
  FINISHED: 'En attente de validation',
  DELIVERED: 'Terminée',
  CANCELED: 'Annulée'
}

export const BOOKING = {
  STATUS: {
    CANCELED: { enum: 'CANCELED', translation: 'Annulée' },
    ACTIVE: { enum: 'ACTIVE', translation: 'A venir' },
    OVER: { enum: 'OVER', translation: 'Terminée' }
  }
}

export const AUTH = {
  STEPS: {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    EMAIL_SENT: 'EMAIL_SENT',
    CLOSE: 'CLOSE'
  }
}

export const DOCUMENT_STATUS = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  FAILED: 'FAILED'
}

export const NOTIFICATION = {
  CATEGORIES: {
    MISSION: 'MISSION_CATEGORY',
    BOOKING: 'BOOKING_CATEGORY',
    MESSAGE: 'MESSAGE_CATEGORY',
    RENT: 'RENT_CATEGORY'
  }
}

export const NAVBAR = {
  TYPE: {
    MAIN: 'main',
    MOBILE: 'mobile'
  }
}

export const LOCATION = {
  PLACE_TYPE: {
    ADDRESS: 'address', // street scope
    PLACE: 'place', // city scope
    ANY: 'any' // both scope
  },
  PRESET_COORDS: {
    PARIS_CENTER: '48.85658,2.35183',
    VALUE_CENTER: '48.6260342,1.8176574'
  }
}

export const DAYS = [
  { FULL: 'Lundi', SHORT: 'Lun' },
  { FULL: 'Mardi', SHORT: 'Mar' },
  { FULL: 'Mercredi', SHORT: 'Mer' },
  { FULL: 'Jeudi', SHORT: 'Jeu' },
  { FULL: 'Vendredi', SHORT: 'Ven' },
  { FULL: 'Samedi', SHORT: 'Sam' },
  { FULL: 'Dimanche', SHORT: 'Dim' }
]

// prettier-ignore
export const HOURS = [
  ...[...Array(24).keys()]
    .slice(6, 23)
    .map((hour) => [
      `${`0${hour}`.slice(-2)}:00`,
      `${`0${hour}`.slice(-2)}:15`,
      `${`0${hour}`.slice(-2)}:30`,
      `${`0${hour}`.slice(-2)}:45`
    ])
    .flat(),
  '23:00'
]

export const PRODUCT_AVAILABILITY = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
}

export const PRODUCT_AVAILABILITY_TRANSLATION = {
  AVAILABLE: 'Disponible',
  UNAVAILABLE: 'Indisponible',
  OUT_OF_STOCK: 'En rupture de stock'
}

export const PRODUCT_STATE = {
  NEW: 'NEW',
  BESTSELLER: 'BESTSELLER'
}

export const PRODUCT_STATE_TRANSLATION = {
  NEW: 'Nouveauté',
  BESTSELLER: 'Top vente'
}

export const PRESTATION_CATEGORY = {
  CLEANING_FORMULAS: 'CLEANING_FORMULAS',
  OPTIONAL_CLEANING: 'OPTIONAL_CLEANING',
  ESTHETICAL_FORMULAS: 'ESTHETICAL_FORMULAS',
  MISSION_DEVIS: 'MISSION_DEVIS'
}

export const PRESTATION_CATEGORY_TRANSLATION = {
  CLEANING_FORMULAS: 'Formules de nettoyage',
  OPTIONAL_CLEANING: 'Options de lavage',
  ESTHETICAL_FORMULAS: 'Formules esthétiques',
  MISSION_DEVIS: 'Missions sur devis'
}
