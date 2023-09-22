import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { creditCards, newCard } from '@/tests/mockups/data/payment/credit-cards.mockup'
import * as usePaymentExport from '@/composables/usePayment'
import creditCardVue from '@/components/global/credit-card/credit-card.vue'

const submitFunctionReturnValue: { value: IRequestResult<ICreditCard> } = { value: { data: newCard, error: null } }
let spyedUsePayment: ReturnType<typeof usePaymentMockFactory>
let wrapper: VueWrapper
const creditCardProp = creditCards[0]

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
  wrapper = mount(creditCardVue, {
    attachTo: document.body,
    props: { paymentMethod: creditCardProp },
    global: {
      stubs: {
        Fa: true,
        CardAdding: true,
        VmcLoader: true
      }
    }
  })
}

async function clickEditCard() {
  await wrapper.find('.card-container .edit-icon').trigger('click')
}

async function clickCard() {
  await wrapper.find(`input`).trigger('click')
}

describe('When using credit-card component', () => {
  beforeEach(async () => {
    spyedUsePayment = usePaymentMockFactory()
    vi.spyOn(usePaymentExport, 'usePayment').mockImplementation(() => {
      return spyedUsePayment.usePaymentMock
    })
    mountComponent()
  })

  it('should display correct card info', async () => {
    const creditCardHtml = wrapper.html()

    expect(creditCardHtml).toContain(creditCardProp.brand)
    expect(creditCardHtml).toContain(creditCardProp.last4)
    expect(creditCardHtml).toContain(`${creditCardProp.expMonth} / ${creditCardProp.expYear.toString().slice(2)}`)
  })

  describe('When clicking edit icon', () => {
    it('should switch to card-adding component', async () => {
      await clickEditCard()

      expect(wrapper.html()).toContain('</card-adding-stub>')
    })

    it('should go back to credit-card after cancel event from card-adding', async () => {
      await clickEditCard()
      expect(wrapper.html()).toContain('</card-adding-stub>')
      const cardAdding = wrapper.findComponent('card-adding-stub')
      await cardAdding.trigger('cancel')

      expect(cardAdding.exists()).toBe(false)
    })

    it('should emit delete with the old card id', async () => {
      await clickEditCard()
      expect(wrapper.html()).toContain('</card-adding-stub>')
      const cardAdding = wrapper.findComponent('card-adding-stub')
      await cardAdding.trigger('delete')

      const emittedDeleteEvent: TEmits<[string]> | undefined = wrapper.emitted('delete')
      expect(emittedDeleteEvent).toBeDefined()
      if (!emittedDeleteEvent) return

      expect(emittedDeleteEvent).toHaveLength(1)
      expect(emittedDeleteEvent[0]).toEqual([creditCards[0].id])
    })

    it('should emit replace with the new card', async () => {
      await clickEditCard()
      expect(wrapper.html()).toContain('</card-adding-stub>')
      const cardAdding = wrapper.findComponent('card-adding-stub')

      //normally, card-added event send card data but I don't know how to test it here
      await cardAdding.trigger('card-added')
      await flushPromises()

      const emittedReplaceEvent: TEmits<[ICreditCard, string]> | undefined = wrapper.emitted('replace')
      if (!emittedReplaceEvent) return

      expect(emittedReplaceEvent).toHaveLength(1)
      expect(emittedReplaceEvent[0][0]).toEqual(creditCardProp.id)
    })
  })

  describe('When clicking the credit-card', () => {
    it('update default payment method to the card clicked', async () => {
      await clickCard()

      const emittedModelValue: TEmits<[string]> | undefined = wrapper.emitted('update:modelValue')
      if (!emittedModelValue) return

      expect(emittedModelValue).toHaveLength(1)
      expect(emittedModelValue[0]).toEqual([creditCardProp.id])
    })

    it('do nothing if the clicked card is the default card', async () => {
      await wrapper.setProps({
        modelValue: creditCardProp.id
      })

      await clickCard()

      const emittedModelValue: TEmits<[string]> | undefined = wrapper.emitted('update:modelValue')
      expect(emittedModelValue).toBeUndefined()
    })
  })
})
