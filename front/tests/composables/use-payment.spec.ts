import * as usePaymentExport from '@/composables/usePayment'
import { beforeEach, describe, expect, it, vi, beforeAll, afterEach } from 'vitest'
import { UseFetchWrapperMockBuilder } from '../mockups/functions/APIs'
import { PaymentMethod } from '@stripe/stripe-js'
import { setActivePinia, createPinia } from 'pinia'
import { paymentMethods, paymentMethod } from '@/tests/mockups/data/payment/stripe.mockup'
import { useAlertStore } from '@/stores/alertStore'
import { JohnDoe } from '@/tests/mockups/data/users.mockup'

let alertStore: ReturnType<typeof useAlertStore>
let sessionStore: ReturnType<typeof useSessionStore>

beforeAll(async () => {
  setActivePinia(createPinia())
})

beforeEach(() => {
  alertStore = useAlertStore()
  sessionStore = useSessionStore()

  // We assume user is alreay logged for these tests
  sessionStore.logIn('token', JohnDoe)
  vi.spyOn(alertStore, 'sendAlert')
  vi.spyOn(alertStore, 'handleRequestResult')
})

afterEach(() => {
  alertStore.$reset()
  vi.clearAllMocks()
})

describe('When usePayment is called', () => {
  describe('When using getPaymentMethods', () => {
    it('should return list of card converted to ICreditCard and call alertStore with a success message', async () => {
      const mock = new UseFetchWrapperMockBuilder<PaymentMethod[]>().call_setReturnData(paymentMethods).build()

      const paymentMethodsResult = await usePaymentExport.usePayment().getPaymentMethods({ mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('success')
      const convertedMockedCard = []
      for (const paymentMethod of paymentMethods) {
        convertedMockedCard.push(usePaymentExport.StripeHelper.stripePaymentMethodToCard(paymentMethod))
      }

      expect(paymentMethodsResult.data).toEqual(convertedMockedCard)
    })

    it('should return null and alert with error when call has error', async () => {
      const mock = new UseFetchWrapperMockBuilder<PaymentMethod[]>().call_setReturnError({ status: 500, message: 'une erreur est survenue' }).build()

      const paymentMethodsResult = await usePaymentExport.usePayment().getPaymentMethods({ mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('error')
      expect(paymentMethodsResult.data).toEqual(null)
    })
  })

  describe('When using getPaymentMethod', () => {
    it('should return a card converted to ICreditCard and alert with a success message', async () => {
      const mock = new UseFetchWrapperMockBuilder<PaymentMethod>().call_setReturnData(paymentMethod).build()

      const paymentMethodResult = await usePaymentExport.usePayment().getPaymentMethod('pm_1MuCzbCN7b44IDnXvjUFKoZE', { mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('success')
      expect(paymentMethodResult.data).toEqual(usePaymentExport.StripeHelper.stripePaymentMethodToCard(paymentMethod))
    })

    it('should return null and alert with error when card is not found', async () => {
      const mock = new UseFetchWrapperMockBuilder<PaymentMethod>().call_setReturnError({ status: 404, message: 'Carte non trouvée' }).build()

      const paymentMethodResult = await usePaymentExport.usePayment().getPaymentMethod('pm_1MuCzbCN7b44IDnXvjUFKoZE', { mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('error')
      expect(paymentMethodResult.data).toBe(null)
    })
  })

  describe('When using deletePaymentMethod', () => {
    it('successfully delete the card and call alertStore with a success message', async () => {
      const mock = new UseFetchWrapperMockBuilder<boolean>().call_setReturnData(true).build()

      const deleteResult = await usePaymentExport.usePayment().deletePaymentMethod('pm_1MuCzbCN7b44IDnXvjUFKoZE', { mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(deleteResult.data).toBe(true)
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('success')
    })

    it('should return null and alert with error when card is not found', async () => {
      const mock = new UseFetchWrapperMockBuilder<boolean>().call_setReturnError({ status: 404, message: 'Carte non trouvée' }).build()

      const deleteResult = await usePaymentExport.usePayment().deletePaymentMethod('pm_1MuCzbCN7b44IDnXvjUFKoZE', { mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(deleteResult.data).toBe(null)
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('error')
    })
  })

  describe('When using getDefaultPaymentMethod', () => {
    it('return a card converted to ICreditCard and call alertStore with a success message', async () => {
      const mock = new UseFetchWrapperMockBuilder<PaymentMethod>().call_setReturnData(paymentMethod).build()

      const getDefaultPaymentResult = await usePaymentExport.usePayment().getDefaultPaymentMethod({ mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('success')
      expect(getDefaultPaymentResult.data).toEqual(usePaymentExport.StripeHelper.stripePaymentMethodToCard(paymentMethod))
    })

    it('should return null and alert with error when call has error', async () => {
      const mock = new UseFetchWrapperMockBuilder<PaymentMethod>().call_setReturnError({ status: 500, message: 'une erreur est survenue' }).build()

      const getDefaultPaymentResult = await usePaymentExport.usePayment().getPaymentMethods({ mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('error')
      expect(getDefaultPaymentResult.data).toEqual(null)
    })
  })

  describe('When using updateDefaultPaymentMethod', () => {
    it('successfully update the card and call alertStore with a success message', async () => {
      const mock = new UseFetchWrapperMockBuilder<boolean>().call_setReturnData(true).build()

      const updateDefaultPaymentResult = await usePaymentExport
        .usePayment()
        .updateDefaultPaymentMethod('pm_1MuCzbCN7b44IDnXvjUFKoZE', { mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('success')
      expect(updateDefaultPaymentResult.data).toBe(true)
    })

    it('should return null and alert with error when call has error', async () => {
      const mock = new UseFetchWrapperMockBuilder<boolean>().call_setReturnError({ status: 500, message: 'une erreur est survenue' }).build()

      const updateDefaultPaymentResult = await usePaymentExport.usePayment().getPaymentMethods({ mode: 'all' })

      expect(mock.callSpy).toHaveBeenCalled()
      expect(alertStore.handleRequestResult).toHaveBeenCalled()
      expect(alertStore.sendAlert).toHaveBeenCalled()
      expect(alertStore.alert?.status).toEqual('error')
      expect(updateDefaultPaymentResult.data).toEqual(null)
    })
  })
})
