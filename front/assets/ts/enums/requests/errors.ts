export const DEFAULT_REQUEST_ERROR_MESSAGE = 'Une erreur est survenue, veuillez réessayer plus tard.'
export const DEFAULT_REQUEST_ERROR: IRequestError = { status: 500, message: DEFAULT_REQUEST_ERROR_MESSAGE }
export const NOT_LOGGED_IN_REQUEST_ERROR: IRequestError = { status: 401, message: "Vous n'êtes pas connecté" }
export const NOT_PROFESSIONAL_REQUEST_ERROR: IRequestError = { status: 403, message: "Vous n'êtes pas un spécialiste" }
export const MISSING_DATA_REQUEST_ERROR: IRequestError = { status: 400, message: 'Il manque des informations' }
export const INVALID_DATA_REQUEST_ERROR: IRequestError = { status: 400, message: 'Certaines informations sont invalides' }
