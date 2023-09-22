<template>
  <centered-section>
    <h4>
      Adresse de prise en charge souhaitée
    </h4>
    <vmc-input
      v-model="selectedAddress"
      :error="formError"
      type="address"
      label=""
      modal-style
      placeholder="Adresse de prise en charge souhaitée"
      @blur="handleBlur"
    />
  </centered-section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input', 'validate'])

const props = defineProps({
  modelValue: { type: Object as PropType<IStrictAddress>, default: null },
  formError: { type: String, default: '' }
})

const selectedAddress = ref<IStrictAddress | null>(props.modelValue ? useUtils().objects.clone<IStrictAddress>(props.modelValue) : null)

watch(selectedAddress, () => handleUpdate(selectedAddress.value))

const handleUpdate = (value: IStrictAddress | null) => {
  emit('update:modelValue', value)
  emit('input', value)
}

const handleBlur = () => {
  emit('validate', 'address')
}
</script>

<style scoped lang="scss">
h4 {
  font-weight: 600;
}
</style>
