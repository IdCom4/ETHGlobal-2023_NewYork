<template>
  <centered-section>
    <h4>Problème(s) rencontré(s)</h4>
    <autocomplete-input v-if="options.length" v-model="selectedIssues" :options="options" :error="error" />
  </centered-section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input', 'validate'])
const props = defineProps({
  modelValue: { type: Array<IIssue>, default: [] },
  error: { type: String, default: '' }
})

const selectedIssues = ref<IIssue[]>(props.modelValue)
const options = ref<IInputSelectOptions<IIssue>[]>([])

async function fetchIssues() {
  const { data: issues, error } = await useAPI().issues.getIssues()
  if (!issues || error) return

  options.value = issues.map((issue) => ({ value: issue, display: issue.label }))
}

function emitUpdatedSelectedIssues() {
  emit('update:modelValue', selectedIssues.value)
  emit('input', selectedIssues.value)
  emit('validate', selectedIssues.value)
}

fetchIssues()

// on local selected issues change, emit them
watch(selectedIssues, emitUpdatedSelectedIssues)

// on model value change, update local selected issues
watch(() => props.modelValue, () => (selectedIssues.value = props.modelValue))
</script>

<style scoped lang="scss">
h4 {
  font-weight: 600;
}
</style>
