<template>
  <section class="quote-modality">
    <h4>Modalités Pratiques</h4>
    <p v-if="date && time">{{ date }} - {{ time }}</p>
    <p v-if="addressString">{{ addressString }}</p>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  startDate: {
    type: Object as PropType<Date | null>,
    default: null,
    required: false
  },
  address: {
    type: Object as PropType<IStrictAddress | null>,
    default: null,
    required: false
  }
})

const dateUtils = useUtils().dates
const addressUtils = useUtils().address

const startDate = toRef(props, 'startDate')
const address = toRef(props, 'address')

const date = computed(() => {
  if (!startDate.value) return
  return dateUtils.getStrFromDate(startDate.value, 'dd/MM/yyyy')
})

const time = computed(() => {
  if (!startDate.value) return
  return dateUtils.getStrFromDate(startDate.value, 'HH:mm')
})

const addressString = computed<string>(() => (address.value ? addressUtils.addressToString(address.value) : ''))
</script>
<style lang="scss" scoped>
.quote-modality {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
