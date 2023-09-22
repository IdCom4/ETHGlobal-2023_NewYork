<template>
  <vmc-input v-model="selectedCard" label="METHODE DE PAIEMENT" type="select" :select-options="userCardsSelectOptions" />
</template>

<script setup lang="ts">
import { SelectOptionStates } from '@/types/constants'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<ICreditCard>,
    default: null
  }
})

const selectedCard = ref<ICreditCard>(props.modelValue)
const userCardsSelectOptions = ref<IInputSelectOptions<ICreditCard | null>[]>([])

setupCardsOptions()

watch(selectedCard, () => {
  emits('update:modelValue', selectedCard.value)
})

async function setupCardsOptions() {
  const cards = await fetchCreditCards()

  // create options from cards
  userCardsSelectOptions.value = cardsToSelectOptions(cards)

  // add an empty option to add a card
  userCardsSelectOptions.value.push({ value: null, display: 'Ajouter une carte' })

  const defaultCard: ICreditCard | null = await fetchDefaultCard()

  // setup default selected card if there is one stored
  if (defaultCard) {
    const relatedSelectOption = userCardsSelectOptions.value.find((option) => option.value && option.value.id === defaultCard.id)
    if (relatedSelectOption) relatedSelectOption.state = SelectOptionStates.SELECTED
  }
  // else select the first one by default
  else userCardsSelectOptions.value[0].state = SelectOptionStates.SELECTED
}

async function fetchCreditCards(): Promise<ICreditCard[]> {
  const fetchedCards = (await usePayment().getPaymentMethods()).data
  return fetchedCards || []
}

async function fetchDefaultCard(): Promise<ICreditCard | null> {
  const defaultCard = (await usePayment().getDefaultPaymentMethod()).data

  return defaultCard
}

function cardsToSelectOptions(cards: ICreditCard[]): IInputSelectOptions<ICreditCard>[] {
  return cards.map((card) => ({
    value: card,
    display: `****${card.last4} - ${card.brand.toUpperCase()}`
  }))
}
</script>

<style lang="scss" scoped></style>
