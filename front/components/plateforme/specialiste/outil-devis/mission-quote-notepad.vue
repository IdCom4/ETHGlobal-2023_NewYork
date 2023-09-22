<template>
  <section>
    <h4>Bloc Note</h4>
    <vmc-input
      v-model="privateNote"
      type="textarea"
      placeholder="Cette section est privée et vous permet de prendre des notes concernant ce devis. Elle ne sera pas partagé avec le client et restera accessible jusqu’à la finalisation de la mission."
      @blur="emit('blur', privateNote)"
    />
  </section>
</template>
<script lang="ts" setup>
const emit = defineEmits(['update:modelValue', 'blur'])

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const privateNote = ref<string>(props.modelValue)

watch(
  () => props.modelValue,
  () => {
    privateNote.value = props.modelValue
  }
)

watch(privateNote, () => {
  emit('update:modelValue', privateNote.value)
})
</script>
<style lang="scss" scoped>
section {
  padding: 0;
  margin-top: 25px;
}
</style>
