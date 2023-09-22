<template>
  <section>
    <div v-show="!isAddingNewCard" class="add-payment-button" @click="isAddingNewCard = true">
      <h4>Ajouter un moyen de paiement</h4>
      <p>+</p>
    </div>
    <card-payment-interface
      v-if="props.isPayment"
      v-show="isAddingNewCard"
      :amount="props.paymentAmount"
      @submit-function-loaded="onSubmitFunctionLoaded"
    />
    <card-adding-interface v-else v-show="isAddingNewCard" @cancel="hideEditInterface" @card-added="onCardAdded" />
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  },
  isPayment: {
    type: Boolean,
    default: false
  },
  paymentAmount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['cardAdded', 'submitFunctionLoaded', 'isAdding'])

const isAddingNewCard = ref<boolean>(props.isEditing)

watch(isAddingNewCard, () => {
  emit('isAdding', isAddingNewCard.value)
})

function hideEditInterface() {
  isAddingNewCard.value = false
}

function onCardAdded(cardAdded: ICreditCard) {
  emit('cardAdded', cardAdded)
  hideEditInterface()
}

function onSubmitFunctionLoaded(submitFunction: TPaymentSubmitFunction) {
  emit('submitFunctionLoaded', submitFunction)
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
}

.add-payment-button {
  border: 2.85px solid #dcdcdc;
  margin: 12px 0px;
  padding: 6px;
  user-select: none;
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
