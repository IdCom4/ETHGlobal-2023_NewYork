<template>
  <centered-section>
    <h4 class="header">
      Disposez-vous des pièces nécessaires ?
    </h4>
    <div class="toggle-container">
      <vmc-input v-model="hasSpareParts" :error="formError" type="toggle" label="" placeholder="" @blur="handleBlur" />
    </div>
  </centered-section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input', 'validate'])
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  formError: { type: String, default: '' }
})

const hasSpareParts = ref<boolean>(props.modelValue)

watch(hasSpareParts, () => handleUpdate(hasSpareParts.value))

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
  emit('input', value)
}

const handleBlur = () => {
  emit('validate', 'hasSpareParts')
}
</script>

<style>
.header {
  font-weight: 600;
}
.toggle-container {
  width: 7.5rem;
}
</style>
