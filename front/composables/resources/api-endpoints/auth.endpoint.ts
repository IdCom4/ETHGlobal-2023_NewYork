import { AlertModes } from '@/assets/ts/enums'

export const useAuthEndpoint = () => {
  const _session = useSessionStore()
  const _request = useRequest()
  const _path = '/auth'

  return {
    register: async (
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Votre compte a bien été créé !' }
    ): Promise<IRequestResult<IRequestResponse>> => {
      // if everything is good, do the request
      return await _request.post<IRequestResponse>(_path + '/register', {
        body: {},
        alert: alert
      })
    },

    login: async (alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<object>> => {
      const { data, error } = await _request.post<IAuthResponse>(_path + '/login', { body: {}, alert: alert })
      // set session data
      if (!data || error) return { data: null, error }

      const { accessToken, user } = data
      _session.logIn(accessToken, user)

      return { data: user, error }
    },
    logout: async (alert: IAlertControl = { mode: AlertModes.NONE }) => {
      if (!_session.isLoggedIn) return

      const requestResult = await _request.patch(_path + '/logout', { alert })

      // wheither there is an error or not, logout
      _session.logOut()

      return requestResult
    }
  }
}
