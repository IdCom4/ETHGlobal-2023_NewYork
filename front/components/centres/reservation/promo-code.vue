<template>
  <vmc-input
    v-model="codeTextInput"
    label="CODE PROMO"
    type="text"
    :icon="currentIcon"
    :class="{ 'is-loading': isLoading }"
    :error="errorMessage"
    @icon-click="checkPromoCode"
  />
</template>

<script setup lang="ts">
const emits = defineEmits(['valid'])

const isLoading = ref<boolean>(false)
const codeTextInput = ref<string>('')
const currentIcon = ref<string>('fa-solid fa-magnifying-glass')
const errorMessage = ref<string>('')

async function checkPromoCode() {
  currentIcon.value = 'fa-solid fa-magnifying-glass'
  isLoading.value = true
  errorMessage.value = ''
  emits('valid', 0)

  const code = await useAPI().promoCode.getPromoCode(codeTextInput.value, { mode: 'none' })
  isLoading.value = false
  if (code.data) {
    currentIcon.value = 'fa-solid fa-circle-check'
    emits('valid', code.data)
  }
  if (code.error) {
    errorMessage.value = code.error.message
  }
}
</script>

<style lang="scss" scoped>
.is-loading :deep(svg) {
  animation-name: opacityLoader;
  animation-duration: 0.65s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  background-color: aliceblue;
}

@keyframes opacityLoader {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>
