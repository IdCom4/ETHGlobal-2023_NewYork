import { AlertModes, MISSING_DATA_REQUEST_ERROR } from '@/types/constants'

export const useAuthEndpoint = () => {
  const _alert = useAlertStore()
  const _session = useSessionStore()
  const _request = useRequest()
  const _path = '/auth'

  return {
    register: async (
      name: string,
      lastName: string,
      phone: string,
      email: string,
      password: string,
      professionalData?: { skillIds?: string[]; workAddress?: IStrictAddress },
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Votre compte a bien été créé !' }
    ): Promise<IRequestResult<IRequestResponse>> => {
      // do verifications here
      if (
        !name ||
        !lastName ||
        !phone ||
        !email ||
        !password ||
        (professionalData && (!professionalData.skillIds || !professionalData.workAddress))
      ) {
        _alert.handleRequestResult(alert, MISSING_DATA_REQUEST_ERROR)
        return { data: null, error: MISSING_DATA_REQUEST_ERROR }
      }

      // create stripe account token
      const stripeResponse = await usePayment().createAccountToken(
        { name, lastName, phone, email, address: professionalData?.workAddress },
        { mode: 'on-error' }
      )

      const accountToken = stripeResponse.data

      if (!accountToken || stripeResponse.error) return { data: null, error: stripeResponse.error }

      // if everything is good, do the request
      return await _request.post<IRequestResponse>(_path + '/register', {
        body: { name, lastName, phone, email, password, accountToken, professionalData },
        alert: alert
      })
    },

    login: async (email: string, password: string, alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<IUser>> => {
      if (!email || !password) {
        _alert.handleRequestResult(alert, MISSING_DATA_REQUEST_ERROR)
        return { data: null, error: MISSING_DATA_REQUEST_ERROR }
      }

      const { data, error } = await _request.post<IAuthResponse>(_path + '/login', { body: { email, password }, alert: alert })
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
    },
    updatePassword: async (
      currentPassword: string,
      newPassword: string,
      newPasswordConfirmation: string,
      alert: IAlertControl = { mode: AlertModes.ON_ERROR }
    ): Promise<IRequestResult<IRequestResponse>> => {
      return await _request.patch<IRequestResponse>(_path + `/change-password/`, {
        body: { currentPassword, newPassword, confirmation: newPasswordConfirmation },
        alert
      })
    },

    forgotPassword: async (email: string, alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<IRequestResponse>> => {
      if (!email) {
        _alert.handleRequestResult(alert, MISSING_DATA_REQUEST_ERROR)
        return { data: null, error: MISSING_DATA_REQUEST_ERROR }
      }

      return await _request.get<IRequestResponse>(_path + `/password-recovery/${email}`, { alert })
    },

    passwordRecovery: async (
      token: string,
      newPassword: string,
      confirmation: string,
      alert: IAlertControl = { mode: AlertModes.ON_ERROR }
    ): Promise<IRequestResult<IRequestResponse>> => {
      if (!token) {
        _alert.handleRequestResult(alert, MISSING_DATA_REQUEST_ERROR)
        return { data: null, error: MISSING_DATA_REQUEST_ERROR }
      }

      const { data, error } = await _request.patch<IRequestResponse>(_path + `/password-recovery/${token}`, {
        body: {
          newPassword,
          confirmation
        },
        alert: alert
      })

      // set session data
      if (!data || error) return { data: null, error }

      return { data, error }
    },

    validateEmail: async (token: string, alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<IRequestResponse>> => {
      if (!token) {
        _alert.handleRequestResult(alert, MISSING_DATA_REQUEST_ERROR)
        return { data: null, error: MISSING_DATA_REQUEST_ERROR }
      }

      const { data, error } = await _request.get<IRequestResponse>(_path + `/validate-email/${token}`, {
        alert: alert
      })

      // set session data
      if (!data || error) return { data: null, error }

      return { data, error }
    },
    sendUpdateEmailRequest: async (
      currentEmail: string,
      newEmail: string,
      password: string,
      alert: IAlertControl = { mode: AlertModes.ON_ERROR }
    ): Promise<IRequestResult<IRequestResponse>> => {
      return await _request.patch<IRequestResponse>(_path + `/update-email/`, {
        body: { currentEmail, newEmail, password },
        alert
      })
    },
    updateEmail: async (
      token: string,
      alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Votre email a bien été mis à jour' }
    ): Promise<IRequestResult<IRequestResponse>> => {
      return await _request.patch<IRequestResponse>(_path + `/update-email/${token}`, { alert })
    }
  }
}
