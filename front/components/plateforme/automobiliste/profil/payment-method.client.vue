<template>
  <section class="payment-methods">
    <h3>
      Mes Moyens de paiements
    </h3>
    <ul>
      <li v-for="card in userPaymentMethods" :key="`card-index-${card.id}-${groupSeed}`">
        <credit-card
          v-model="selectedCardId"
          :group-name="`card-group-${groupSeed}`"
          :payment-method="card"
          @delete="removeCardFromArray"
          @replace="onReplace"
        ></credit-card>
      </li>
    </ul>
    <card-adding
      class="add-payment"
      :is-payment="props.isPayment"
      :payment-amount="props.paymentAmount"
      @submit-function-loaded="onSubmitFunctionLoaded"
      @card-added="onCardAdded"
      @is-adding="onIsAddingEvent"
    ></card-adding>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

//TODO : Create  doc on miro to explain Stripe workflow

const userPaymentMethods = ref<ICreditCard[]>([])
const selectedCardId = ref<string>('')
const isAddingNewCard = ref<boolean>(false)
const sessionStore = useSessionStore()
const { user } = storeToRefs(sessionStore)
const groupSeed = Math.random()

const props = defineProps({
  isPayment: {
    type: Boolean,
    default: false
  },
  paymentAmount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['submitFunctionLoaded', 'cardSelect', 'isAdding'])

watch(
  user,
  async () => {
    if (!user.value) return
    // TODO: Add a loader before displaying the card list
    const { data: defaultPaymentId } = await usePayment().getDefaultPaymentMethod()
    selectedCardId.value = defaultPaymentId?.id || ''

    getUserPaymentMethods()
  },
  { immediate: true }
)

watch(selectedCardId, () => {
  emit('cardSelect', selectedCardId.value)
})

function addCardAtIndex(creditCard: ICreditCard, index: number) {
  userPaymentMethods.value.splice(index, 0, creditCard)
}

async function getUserPaymentMethods() {
  const payMethods = (await usePayment().getPaymentMethods()).data

  if (!payMethods) return

  userPaymentMethods.value.length = 0

  for (const payMethodIndex in payMethods) {
    addCardAtIndex(payMethods[payMethodIndex], Number(payMethodIndex))
  }
}

function onSubmitFunctionLoaded(submitFunction: TPaymentSubmitFunction) {
  emit('submitFunctionLoaded', submitFunction)
}

function onIsAddingEvent(newState: boolean) {
  emit('isAdding', newState)
}

function onReplace(oldCardId: string, newCard: ICreditCard) {
  const index = removeCardFromArray(oldCardId)
  addCardAtIndex(newCard, index)
}

function onCardAdded(card: ICreditCard) {
  isAddingNewCard.value = false
  addCardAtIndex(card, userPaymentMethods.value.length)
}

function removeCardFromArray(id: string) {
  const elemIndex = userPaymentMethods.value.findIndex((elem) => elem.id === id)
  userPaymentMethods.value.splice(elemIndex, 1)
  return elemIndex
}
</script>

<style lang="scss" scoped>
.add-payment-button {
  border: 2.85px solid #dcdcdc;
  margin: 12px 0px;
  padding: 6px;

  &:hover {
    cursor: pointer;
  }

  > p {
    font-size: 25px;
    text-align: center;
    margin: 10px 0;
    font-weight: 700;
  }
}
.payment-methods {
  padding: 0;
}

h3 {
  margin-top: $spacing-3;
}

@media (min-width: 900px) {
  h3 {
    margin-top: $spacing-3;
    margin-bottom: $spacing-4;
  }

  .payment-methods {
    border: 1px solid black;
    padding: 0 20px 20px;
  }
}
</style>
