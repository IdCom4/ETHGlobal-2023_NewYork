<template>
  <section class="payment-container">
    <div ref="paymentElementDOM" class="payment-element"></div>
  </section>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitFunctionLoaded'])

const props = defineProps({
  amount: {
    type: Number,
    default: 0
  }
})

const paymentElementDOM = ref<HTMLElement>()

onMounted(async () => {
  mountCardElem()
})

onBeforeUnmount(() => {
  paymentElementDOM.value?.remove()
})

async function mountCardElem() {
  if (!paymentElementDOM.value) return
  emit('submitFunctionLoaded', await usePayment().mountPaymentInput(paymentElementDOM.value, props.amount))
}
</script>

<style lang="scss" scoped>
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
</style>
