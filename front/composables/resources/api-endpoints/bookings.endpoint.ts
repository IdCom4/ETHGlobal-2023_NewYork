import { AlertModes, NOT_LOGGED_IN_REQUEST_ERROR } from '@/types/constants'
import { PaymentProviderStatuses } from '@/types/external_APIs/payment-provider.enum'

export const useBookingsEndpoint = () => {
  const _path = '/bookings'
  const _session = useSessionStore()
  const _request = useRequest()
  const dateUtils = useUtils().dates

  return {
    getCenterBoxAvailabilityByMonth: async (
      boxCategory: TBoxCategory,
      date: Date,
      centerId: string,
      excludePast: boolean,
      alert: IAlertControl = { mode: AlertModes.NONE }
    ): Promise<IRequestResult<TBoxCategoryMonthAvailabilityMap>> => {
      return _request.get<TBoxCategoryMonthAvailabilityMap>(`${_path}/availability/category/month`, {
        query: {
          'center-id': centerId,
          date: dateUtils.getStrFromDate(date, 'dd-MM-yyyy'),
          'box-category': boxCategory,
          'exclude-past': excludePast
        },
        alert
      })
    },
    getCenterBoxAvailabilityByMonthAndCategoryAndFormula: async (
      boxCategory: TBoxCategory,
      date: Date,
      centerId: string,
      formulaLabel: string,
      alert: IAlertControl = { mode: AlertModes.NONE }
    ): Promise<IRequestResult<TBoxCategoryMonthAvailabilityMap>> => {
      return _request.get<TBoxCategoryMonthAvailabilityMap>(`${_path}/availability/center/category/month/formula`, {
        query: {
          'center-id': centerId,
          date: dateUtils.getStrFromDate(date, 'dd-MM-yyyy'),
          'box-category': boxCategory,
          formula: formulaLabel
        },
        alert
      })
    },
    createNewBooking: async (
      payload: IBookBoxPayload,
      cardSubmitFunction: TPaymentSubmitFunction,
      alert: IAlertControl = { mode: AlertModes.ON_ERROR }
    ): Promise<IRequestResult<IBookingResponse>> => {
      if (!_session.isLoggedIn) {
        useAlertStore().handleRequestResult(alert, NOT_LOGGED_IN_REQUEST_ERROR)
        return { data: null, error: NOT_LOGGED_IN_REQUEST_ERROR }
      }

      const response = await _request.post<IBookingResponse>(_path, {
        body: payload,
        headers: { Authorization: `Bearer ${_session.accessToken}` },
        alert
      })

      if (!response.data) return response

      if (response.data.paymentStatus === PaymentProviderStatuses.REQUIRE_AUTHENTICATION && response.data.clientSecret) {
        let error: IRequestError | null
        if (payload.creditCardId) error = (await usePayment().confirmPayment(response.data.clientSecret, payload.creditCardId)).error
        else error = (await cardSubmitFunction(response.data.clientSecret, { mode: 'all' })).error
        if (error) return { data: null, error: { status: 400, message: error.message } }
      }

      return response
    }
  }
}
