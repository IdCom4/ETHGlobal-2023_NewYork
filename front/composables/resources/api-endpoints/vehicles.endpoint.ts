import { AlertModes, NOT_LOGGED_IN_REQUEST_ERROR } from '@/types/constants'

export const useVehiclesEndpoint = () => {
  const _request = useRequest()
  const _session = useSessionStore()
  const _path = '/vehicles'

  return {
    getMyVehicles: async (alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<IOwnerVehicle[]>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.get<IOwnerVehicle[]>(_path, { alert: alert })
    },
    getAllBrands: async (alert?: IAlertControl): Promise<IRequestResult<IVehicleBrand[]>> => {
      return await _request.get<IVehicleBrand[]>('/vehicle-brands/all', { alert: alert })
    },
    addVehicle: async (
      request: INewVehicleRequest,
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Nouveau véhicule créé !' }
    ): Promise<IRequestResult<IOwnerVehicle>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      let preRequestError: IRequestError | null = null
      if (!request.brandId) preRequestError = { status: 400, message: 'Véhicule invalide, la marque est obligatoire' }
      if (!request.model) preRequestError = { status: 400, message: 'Véhicule invalide, le modèle est obligatoire' }
      if (!request.plate) preRequestError = { status: 400, message: "Véhicule invalide, la plaque d'immatriculation est obligatoire" }
      if (!request.year) preRequestError = { status: 400, message: "Véhicule invalide, l'année est obligatoire" }
      if (!request.mileage) preRequestError = { status: 400, message: 'Véhicule invalide, le kilométrage est obligatoire' }

      if (preRequestError) {
        useAlertStore().handleRequestResult(alert, preRequestError)
        return { data: null, error: preRequestError }
      }

      return await _request.post<IOwnerVehicle>(_path, { body: request, alert })
    },
    updateVehicle: async (
      request: IUpdateVehicleRequest,
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Véhicule mis à jour avec succès !' }
    ): Promise<IRequestResult<IOwnerVehicle>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.patch<IOwnerVehicle>(`${_path}/${request._id}`, { alert })
    },
    deleteVehicle: async (
      vehicleId: string,
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Véhicule supprimé avec succès !' }
    ): Promise<IRequestResult<IRequestResponse>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.delete(`${_path}/${vehicleId}`, { alert })
    }
  }
}
