import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { creditCards, newCard } from '@/tests/mockups/data/payment/credit-cards.mockup'
import CardAddingVue from '@/components/global/credit-card/card-adding.vue'
import * as usePaymentExport from '@/composables/usePayment'

const submitFunctionReturnValue: { value: IRequestResult<ICreditCard> } = { value: { data: newCard, error: null } }
let spyedUsePayment: ReturnType<typeof usePaymentMockFactory>
let wrapper: VueWrapper

function usePaymentMockFactory() {
  const submitFunctionMock = vi.fn(async () => {
    return submitFunctionReturnValue.value
  })

  return {
    usePaymentMock: {
      getPaymentMethods: vi.fn(async () => ({ data: creditCards, error: null })),
      getPaymentMethod: vi.fn(async () => ({ data: creditCards[1], error: null })),
      deletePaymentMethod: vi.fn(async () => ({ data: true, error: null })),
      getDefaultPaymentMethod: vi.fn(async () => ({ data: creditCards[1], error: null })),
      updateDefaultPaymentMethod: vi.fn(async () => ({ data: true, error: null })),
      mountPaymentInput: vi.fn(async () => submitFunctionMock)
    },
    submitFunctionMock
  }
}

function mountComponent() {
  wrapper = mount(CardAddingVue, {
    attachTo: document.body,
    global: {
      stubs: {
        Fa: true
      }
    }
  })
}

async function clickRegisterCard() {
  await wrapper.find('.payment-container .btn_call-to-action').trigger('click')
}

async function clickSuppressCard() {
  await wrapper.find('.payment-container .btn_denied').trigger('click')
}

async function clickCancelCard() {
  await wrapper.find('.payment-container .cancel-button').trigger('click')
}

describe('When using card-adding component', () => {
  beforeEach(async () => {
    spyedUsePayment = usePaymentMockFactory()
    vi.spyOn(usePaymentExport, 'usePayment').mockImplementation(() => {
      return spyedUsePayment.usePaymentMock
    })
    mountComponent()
  })

  it('should mount payment input', async () => {
    expect(spyedUsePayment.usePaymentMock.mountPaymentInput).toHaveBeenCalled()
  })

  it('should display "Annuler" on red button if there is no card data', async () => {
    expect(wrapper.find('.btn_denied').html()).toContain('Annuler')
  })

  it('should display "Supprimer" on red button if there is card data', async () => {
    await wrapper.setProps({ creditCard: creditCards[0] })
    expect(wrapper.find('.btn_denied').html()).toContain('Supprimer')
  })

  describe('When clicking "Enregistrer"', () => {
    it('should create new card and send it to parent if card is filled correctly', async () => {
      await clickRegisterCard()

      expect(spyedUsePayment.submitFunctionMock).toHaveBeenCalled()

      const cardAddedEvent: TEmits<[ICreditCard]> | undefined = wrapper.emitted('cardAdded')
      expect(cardAddedEvent).toBeDefined()
      if (!cardAddedEvent) return

      expect(cardAddedEvent).toHaveLength(1)
      expect(cardAddedEvent[0]).toEqual([newCard])
    })

    it('should create new card and delete the old one if there is card data', async () => {
      await wrapper.setProps({ creditCard: creditCards[0] })

      await clickRegisterCard()
      await flushPromises()

      expect(spyedUsePayment.submitFunctionMock).toHaveBeenCalled()

      const cardAddedEvent: TEmits<[ICreditCard]> | undefined = wrapper.emitted('cardAdded')
      expect(cardAddedEvent).toBeDefined()
      if (!cardAddedEvent) return

      expect(cardAddedEvent).toHaveLength(1)
      expect(cardAddedEvent[0]).toEqual([newCard])
    })

    it('should do nothing if there is an error', async () => {
      submitFunctionReturnValue.value = { data: null, error: { status: 500, message: 'Une erreur est survenue' } }

      await clickRegisterCard()

      expect(spyedUsePayment.submitFunctionMock).toHaveBeenCalled()

      const cardAddedEvent: TEmits<[ICreditCard]> | undefined = wrapper.emitted('cardAdded')
      expect(cardAddedEvent).toBeUndefined()
    })
  })

  describe('When clicking "Annuler / Supprimer"', () => {
    it('should send cancel event if there is no card data', async () => {
      await clickSuppressCard()

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('should send delete event if there is card data', async () => {
      await wrapper.setProps({ creditCard: creditCards[0] })

      await clickSuppressCard()
      const cardDeleteEvent: TEmits<[string]> | undefined = wrapper.emitted('delete')
      expect(cardDeleteEvent).toBeDefined()
      if (!cardDeleteEvent) return

      expect(cardDeleteEvent).toHaveLength(1)
      expect(cardDeleteEvent[0]).toEqual([creditCards[0].id])
    })
  })

  describe('When clicking top right cross icon', () => {
    it('should send cancel event', async () => {
      await clickCancelCard()

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('should send cancel event if there is card data', async () => {
      await wrapper.setProps({ creditCard: creditCards[0] })

      await clickCancelCard()

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })
  })
})
