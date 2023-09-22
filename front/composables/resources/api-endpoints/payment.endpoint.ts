import { AlertModes, NOT_LOGGED_IN_REQUEST_ERROR } from '@/types/constants'

export const usePaymentEndpoint = () => {
  const _request = useRequest()
  const _session = useSessionStore()
  const isForCenterAccount = useRoute().path.includes('centres')
  const _path = `/payments/${isForCenterAccount ? 'CENTER' : 'PLATEFORME'}`

  return {
    getPaymentMethods: async (alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<ICreditCard[]>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.get<ICreditCard[]>(_path + '/card-list', { alert })
    },
    getPaymentMethod: async (paymentMethodId: string, alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<ICreditCard>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.get<ICreditCard>(_path + `/card/${paymentMethodId}`, {
        alert: alert,
        headers: { authorization: `Bearer ${_session.accessToken}` }
      })
    },
    createSetup: async (alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<string>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.post<string>(_path + '/create-credit-card-setup', {
        alert: alert,
        headers: { authorization: `Bearer ${_session.accessToken}` }
      })
    },
    detachPaymentMethod: async (
      paymentMethodId: string,
      alert: IAlertControl = { mode: AlertModes.ALL }
    ): Promise<IRequestResult<IRequestResponse>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.delete<IRequestResponse>(`${_path}/card/${paymentMethodId}`, {
        alert: alert,
        headers: { authorization: `Bearer ${_session.accessToken}` }
      })
    },
    getDefaultPaymentMethod: async (alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<ICreditCard>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.get<ICreditCard>(`${_path}/default-card`, {
        alert: alert,
        headers: { authorization: `Bearer ${_session.accessToken}` }
      })
    },
    updateAccount: async (
      birthday: string,
      iban: string,
      identityDocumentRecto?: string,
      identityDocumentVerso?: string,
      alert: IAlertControl = { mode: AlertModes.ALL }
    ) => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      // create or update account token
      const dateOfBirthDate = useUtils().dates.getDateFromStr(birthday)
      const { data: accountToken } = await usePayment().createAccountToken(
        {
          dateOfBirth: {
            day: dateOfBirthDate.getDate(),
            month: dateOfBirthDate.getMonth(),
            year: dateOfBirthDate.getFullYear()
          }
        },
        { mode: 'on-error' }
      )

      // send request
      return await _request.put<IRequestResponse>(`${_path}/account`, {
        alert: alert,
        body: { iban, accountToken, identityDocumentRecto, identityDocumentVerso, birthday },
        headers: { authorization: `Bearer ${_session.accessToken}` }
      })
    },
    updateDefaultPaymentMethod: async (
      paymentMethodId: string,
      alert: IAlertControl = { mode: AlertModes.ALL }
    ): Promise<IRequestResult<IRequestResponse>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      return await _request.put<IRequestResponse>(`${_path}/default-card/${paymentMethodId}`, {
        alert: alert,
        headers: { authorization: `Bearer ${_session.accessToken}` }
      })
    }
  }
}
