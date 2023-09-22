import { AlertModes, NOT_LOGGED_IN_REQUEST_ERROR, NOT_PROFESSIONAL_REQUEST_ERROR } from '@/types/constants'

export interface IRealisationRequest extends Omit<IRealisation, 'id'> {
  id?: number
  newFiles?: string[]
}

export interface IProfessionalExperienceRequest extends Omit<IProfessionalExperience, 'id'> {
  id?: number
}

export interface IStudyRequest extends Omit<IStudy, 'id'> {
  id?: number
}

export interface IUpdateProfessionalProfileRequest {
  businessName?: string
  businessPicture?: TBase64File
  businessPresentation?: string
  averageHourlyRate?: number
  maxTravelDistance?: number
  averageAvailability?: string
  workAddress?: IStrictAddress
  company?: ICompany
  realisations?: IRealisationRequest[]
  professionalExperiences?: IProfessionalExperienceRequest[]
  studies?: IStudyRequest[]
  skillIds?: string[]
  curriculum?: string
  insurance?: string
}

export const useProfessionalsEndpoint = () => {
  const _request = useRequest()
  const _session = useSessionStore()
  const _path = '/professionals'

  return {
    /**
     *
     * @param {string[]}                          fieldsToUpdate  A list of all the properties to update
     * @param {IUpdateProfessionalProfileRequest}  fields          A request object representing the data to update
     * @param {IAlertControl}                      alert           An object that allows control over request feedback display
     * @returns an object with 2 properties: data if any, error if any
     */
    updateProfile: async (
      fieldsToUpdate: (keyof IUpdateProfessionalProfileRequest)[],
      fields: IUpdateProfessionalProfileRequest,
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Profil mis à jour' }
    ): Promise<IRequestResult<IProfessionalUser>> => {
      // check if request is valid
      let preRequestError: IRequestError | null = null
      if (!_session.isLoggedIn) preRequestError = NOT_LOGGED_IN_REQUEST_ERROR
      else if (!_session.isProfessional) preRequestError = NOT_PROFESSIONAL_REQUEST_ERROR
      else if (!fieldsToUpdate || !fieldsToUpdate.length || !fields) preRequestError = { status: 400, message: 'Aucune donnée à mettre à jour' }
      if (preRequestError) {
        useAlertStore().handleRequestResult(alert, preRequestError)
        return { data: null, error: preRequestError }
      }

      const { data, error } = await _request.patch<IProfessionalUser>(_path + '/update', {
        body: { fieldsToUpdate, fields },
        alert
      })

      if (data && !error) useSessionStore().user = data

      return { data, error }
    }
  }
}
