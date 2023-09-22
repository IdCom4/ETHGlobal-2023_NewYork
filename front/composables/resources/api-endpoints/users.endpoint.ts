import { AlertModes, NOT_LOGGED_IN_REQUEST_ERROR } from '@/types/constants'

export const useUsersEndpoint = () => {
  const _request = useRequest()
  const _session = useSessionStore()
  const _path = '/users'

  return {
    getProfile: async <T extends IUser = IUser>(alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<T>> => {
      // check if there is a token

      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      // if everything is good, do the request
      const { data, error } = await _request.get<T>(_path + '/profile/me', { alert })

      if (!data || error) {
        _session.logOut()
        return { data: null, error }
      }

      _session.user = data

      return { data, error }
    },
    updateProfile: async (
      request: IUpdateProfileRequest,
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Profil mis à jour' }
    ): Promise<IRequestResult<IUser>> => {
      // check if request is valid
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      const { data, error } = await _request.patch<IUser>(_path + '/update-account', { body: request, alert })

      if (data && !error) _session.user = data

      return { data, error }
    }
  }
}
