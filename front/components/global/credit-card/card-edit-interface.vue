<template>
  <section class="payment-container">
    <fa icon="fa-regular fa-circle-xmark" class="cancel-button" @click="onClickCancel" />>
    <div ref="paymentElementDOM" class="payment-element"></div>
    <div class="btn-row">
      <button class="btn_call-to-action" @click="onClickSave">Enregistrer</button>
      <button class="btn_denied" @click="onClickDelete">
        {{ creditCard ? 'Supprimer' : 'Annuler' }}
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
const emit = defineEmits(['cardAdded', 'delete', 'cancel'])
const props = defineProps({
  creditCard: {
    type: Object as PropType<ICreditCard | null>,
    default: null
  }
})

const isNewCard = computed(() => {
  return !props.creditCard
})

const paymentElementDOM = ref<HTMLElement>()

let submitFunction: TSubmitFunction

onMounted(async () => {
  mountCardElem()
})

onBeforeUnmount(() => {
  paymentElementDOM.value?.remove()
})

function onClickCancel() {
  emit('cancel')
}

async function mountCardElem() {
  if (!paymentElementDOM.value) return
  // TODO: fix this line
  submitFunction = await usePayment().mountPaymentInput(paymentElementDOM.value)
}

function onClickSave() {
  if (isNewCard.value) saveCard({ mode: 'all', successMsg: 'Carte enregistrée avec succès' })
  else replaceCard()
}

function onClickDelete() {
  if (isNewCard.value) {
    emit('cancel')
    return
  } else deleteCard({ mode: 'all', successMsg: 'Carte supprimée avec succès' })
}

async function saveCard(alert: IAlertControl) {
  if (!submitFunction) return

  const { data } = await submitFunction(alert)
  if (!data) return false
  emit('cardAdded', data)
}

async function replaceCard() {
  if (!(await saveCard({ mode: 'none' }))) return false
  await deleteCard({ mode: 'all', successMsg: 'Carte remplacée avec succès' })
}

async function deleteCard(alert?: IAlertControl) {
  if (!props.creditCard) return

  const { error } = await usePayment().deletePaymentMethod(props.creditCard.id, alert)
  if (error) return

  emit('delete', props.creditCard.id)
}
</script>

<style lang="scss" scoped>
.btn-row {
  justify-content: space-around;
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.cancel-button {
  position: relative;
  display: block;
  margin-left: auto;
  margin-bottom: 3px;
  cursor: pointer;
  z-index: 5;
}
.payment-container {
  margin: 15px 0px;
  position: relative;
  user-select: none;
}

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
</style>
