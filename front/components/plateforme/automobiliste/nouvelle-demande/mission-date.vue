<template>
  <centered-section>
    <fieldset class="container">
      <h4>Moment idéal pour commencer la mission</h4>
      <div v-for="(choice, index) in choices" :key="`choice_${index}`" class="input-content">
        <label class="choice-label">
          <input v-model="selectedIdealStartingMoment" type="radio" class="input" :value="choice" name="date-choice" /> {{ choice }}
        </label>
      </div>
    </fieldset>
  </centered-section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input'])
const props = defineProps({
  modelValue: { type: String, default: '' },
  formError: { type: String, default: '' }
})

const choices = ['Dès que possible', 'La semaine prochaine', 'Le mois prochain']
const selectedIdealStartingMoment = ref<string>(`${props.modelValue}`)

watch(selectedIdealStartingMoment, () => handleUpdate(selectedIdealStartingMoment.value))

const handleUpdate = (value: string) => {
  emit('update:modelValue', value)
  emit('input', value)
}
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  h4 {
    font-weight: 600;
  }
}

.input-content {
  margin-top: 20px;
}

.choice-label {
  cursor: pointer;
}

.input {
  appearance: none;

  width: 16px;
  height: 16px;
  margin-right: 10px;
  border: 2px solid black;
}

input:checked {
  border: 6px solid black;
}
</style>
