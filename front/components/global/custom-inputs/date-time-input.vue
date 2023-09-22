<template>
  <section class="date-inputs">
    <vmc-input v-model="startDate" type="date" label="Date" :error="errors.startDate" modal-style @update:model-value="hasDateError" />
    <vmc-input v-model="startTime" type="time" label="Heure" :error="errors.startTime" step="900" modal-style />
  </section>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  }
})

const dateUtils = useUtils().dates

const errors = ref({
  startDate: '',
  startTime: ''
})

const startDate = ref<string>('')
const startTime = ref<string>('')
const startDateAndTime = computed<Date | null>({
  get() {
    if (!startDate.value || !startTime.value) return null
    return dateUtils.getDateFromStr(`${startDate.value} ${startTime.value}`, 'dd/MM/yyyy HH:mm')
  },
  set(newValue) {
    if (!newValue) return
    startDate.value = dateUtils.getStrFromDate(newValue, 'dd/MM/yyyy')
    startTime.value = dateUtils.getStrFromDate(newValue, 'HH:mm')
  }
})

watch(
  () => props.modelValue,
  () => {
    startDateAndTime.value = props.modelValue
  },
  { immediate: true }
)

watch(startDateAndTime, () => {
  emit('update:modelValue', startDateAndTime.value)
})

function hasDateError() {
  const date = dateUtils.getDateFromStr(startDate.value, 'dd/MM/yyyy')

  if (date && dateUtils.isDateTheSameDayOrBefore(date, new Date()))
    errors.value.startDate = "Veuillez choisir une date supérieure à celle d'aujourd'hui"
  else errors.value.startDate = ''
}
</script>
<style lang="scss" scoped>
.date-inputs {
  display: flex;
  gap: 10px;

  > section {
    flex-grow: 1;
    width: 100%;
  }
}
</style>
