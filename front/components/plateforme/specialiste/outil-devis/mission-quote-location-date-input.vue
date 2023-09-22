<template>
  <section class="location-date-section">
    <h3 class="top-bottom">modalités pratiques</h3>
    <div class="flex">
      <p>
        L’adresse et les horaires renseignés ci-dessous sont ceux proposé par le client. Si ceux-ci ne vous conviennent pas, renseignez ci-dessous
        l’adresse à laquelle vous proposez de prendre en charge le véhicule.
      </p>
      <vmc-input v-model="address" type="address" label="LIEU DE PRISE EN CHARGE DU VÉHICULE" placeholder="Adresse de prise en charge" modal-style />
    </div>
    <date-time-input v-model="date" />
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Object as PropType<IDateAndAddress>,
    default: null
  }
})

const address = ref<IStrictAddress | undefined>(props.modelValue.address)
const date = ref<Date | undefined>(props.modelValue.date)

watch([() => props.modelValue.address, () => props.modelValue.date], () => {
  address.value = props.modelValue.address
  date.value = props.modelValue.date
})

watch([address, date], () => {
  emit('update:modelValue', { date: date.value, address: address.value })
})
</script>

<style lang="scss" scoped>
.location-date-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: solid 1px $black;
  h3 {
    display: none;
  }
  .flex {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
}

.date-inputs {
  display: flex;
  gap: 10px;

  > section {
    flex-grow: 1;
    width: 100%;
  }
}

@media screen and (max-width: 1200px) {
  .location-date-section {
    h3 {
      display: flex;
    }
    .flex {
      flex-direction: column-reverse;
    }
  }
}
</style>
