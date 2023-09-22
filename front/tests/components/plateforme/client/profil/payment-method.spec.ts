import { beforeEach, describe, expect, it, vi, beforeAll, afterEach } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { JohnDoe } from '@/tests/mockups/data/users.mockup'
import { creditCards, newCard } from '@/tests/mockups/data/payment/credit-cards.mockup'
import PaymentMethodVue from '@/components/plateforme/automobiliste/profil/payment-method.vue'
import { createTestingPinia } from '@pinia/testing'
import * as usePaymentExport from '@/composables/usePayment'
import creditCardVue from '@/components/global/credit-card/credit-card.vue'
import cardAddingVue from '@/components/global/credit-card/card-adding.vue'

//TODO: Add doc on Miro to describe payment method utilisation

let sessionStore: ReturnType<typeof useSessionStore>
let wrapper: VueWrapper

const submitFunctionReturnValue: { value: IRequestResult<ICreditCard> } = { value: { data: newCard, error: null } }

function usePaymentMockFactory() {
  const submitFunctionMock = vi.fn(async () => {
    return submitFunctionReturnValue.value
  })

  return {
    usePaymentMock: {
      getPaymentMethods: vi.fn(async () => ({ data: creditCards, error: null })),
      getPaymentMethod: vi.fn(async () => ({ data: creditCards[0], error: null })),
      deletePaymentMethod: vi.fn(async () => ({ data: true, error: null })),
      getDefaultPaymentMethod: vi.fn(async () => ({ data: creditCards[0], error: null })),
      updateDefaultPaymentMethod: vi.fn(async () => ({ data: true, error: null })),
      mountPaymentInput: vi.fn(async () => submitFunctionMock)
    },
    submitFunctionMock
  }
}

let spyedUsePayment: ReturnType<typeof usePaymentMockFactory>

function mountComponent() {
  wrapper = mount(PaymentMethodVue, {
    attachTo: document.body,
    shallow: true,
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            session: { user: null }
          },
          stubActions: false
        })
      ],
      components: {
        CardAdding: cardAddingVue,
        CreditCard: creditCardVue
      },
      stubs: {
        Fa: true
      }
    }
  })
}

async function clickAddPaymentButton() {
  await wrapper.find('.add-payment-button').trigger('click')
}

async function loginUser() {
  sessionStore.logIn('token', JohnDoe)
  await flushPromises()
}

describe('When I use PaymentMethod component', () => {
  beforeAll(async () => {
    setActivePinia(createPinia())
  })

  beforeEach(async () => {
    mountComponent()
    sessionStore = useSessionStore()

    spyedUsePayment = usePaymentMockFactory()
  })

  afterEach(() => {
    sessionStore.$reset()
    vi.clearAllMocks()
  })

  it('should exist', () => {
    expect(wrapper.exists()).toBe(true)
  })

  describe('When the User is logged', async () => {
    beforeEach(async () => {
      vi.spyOn(usePaymentExport, 'usePayment').mockImplementation(() => {
        return spyedUsePayment.usePaymentMock
      })
    })

    it("should fetch Stripe customer's payment method list and render fetched list of payment method", async () => {
      await loginUser()

      expect(spyedUsePayment.usePaymentMock.getPaymentMethods).toHaveBeenCalled()
      const components = await wrapper.findAllComponents(creditCardVue)
      expect(components).toHaveLength(creditCards.length)
    })

    it('should remove deleted card from the list on delete event', async () => {
      await loginUser()

      const cardToDelete = await wrapper.findComponent(creditCardVue)
      expect(cardToDelete.exists()).toBe(true)

      await cardToDelete.vm.$emit('delete', cardToDelete.props('paymentMethod').id)
      await nextTick()
      await flushPromises()
      const components = await wrapper.findAllComponents(creditCardVue)

      expect(cardToDelete.exists()).toBe(false)
      expect(components).toHaveLength(creditCards.length - 1)
    })

    it('should replace card by the new one on replace event', async () => {
      await loginUser()

      const cardToReplace = await wrapper.findComponent(creditCardVue)
      expect(cardToReplace.exists()).toBe(true)

      await cardToReplace.vm.$emit('replace', cardToReplace.props('paymentMethod').id, newCard)
      await nextTick()
      await flushPromises()
      const components = await wrapper.findAllComponents(creditCardVue)

      expect(cardToReplace.exists()).toBe(false)
      expect(components[0].props('paymentMethod')).toEqual(newCard)
      expect(components).toHaveLength(creditCards.length)
    })

    it("should get customer's default payment method and give it to cards", async () => {
      await loginUser()
      expect(spyedUsePayment.usePaymentMock.getDefaultPaymentMethod).toHaveBeenCalled()

      //verify list v-model
      const mountedCards = await wrapper.findAllComponents(creditCardVue)
      for (const card of mountedCards) {
        expect(card.props('modelValue')).toEqual(creditCards[0].id)
      }
    })

    describe('When I click on "Add payments"', () => {
      it('should display the card adding interface and hide addPayment button', async () => {
        await loginUser()
        await clickAddPaymentButton()

        expect(wrapper.findComponent(cardAddingVue).exists()).toBe(true)
        expect(wrapper.find('.add-payment-button').exists()).toBe(false)
      })

      it('should add card to the list on new card event and hide card adding interface', async () => {
        await loginUser()
        await clickAddPaymentButton()
        const cardAddingInterface = await wrapper.findComponent(cardAddingVue)
        await cardAddingInterface.vm.$emit('cardAdded', newCard)

        const components = await wrapper.findAllComponents(creditCardVue)

        expect(components).toHaveLength(creditCards.length + 1)
        expect(components[components.length - 1].props('paymentMethod')).toEqual(newCard)
        expect(cardAddingInterface.exists()).toBe(false)
      })

      it('should hide the the card adding interface on delete event', async () => {
        await clickAddPaymentButton()

        const cardAddingInterface = wrapper.findComponent(cardAddingVue)
        await cardAddingInterface.trigger('delete')
        expect(cardAddingInterface.exists()).toBe(false)
      })

      it('should hide the the card adding interface on cancel event', async () => {
        await clickAddPaymentButton()

        const cardAddingInterface = wrapper.findComponent(cardAddingVue)
        await cardAddingInterface.trigger('cancel')
        expect(cardAddingInterface.exists()).toBe(false)
      })
    })
  })
})
