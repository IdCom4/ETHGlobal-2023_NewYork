<template>
  <centered-section>
    <h4>
      Description de votre besoin
    </h4>
    <vmc-input
      v-model="description"
      :error="formError"
      type="textarea"
      label=""
      modal-style
      placeholder="Veuillez décrire votre besoin..."
      @blur="handleBlur"
    />
  </centered-section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input', 'validate'])
const props = defineProps({
  modelValue: { type: String, default: '' },
  formError: { type: String, default: '' }
})

const description = ref<string>(`${props.modelValue}`)

watch(description, () => handleUpdate(description.value))

const handleUpdate = (value: string) => {
  emit('update:modelValue', value)
  emit('input', value)
  emit('validate', value)
}

const handleBlur = () => {
  emit('validate', 'description')
}
</script>

<style scoped lang="scss">
h4 {
  font-weight: 600;
}
</style>
