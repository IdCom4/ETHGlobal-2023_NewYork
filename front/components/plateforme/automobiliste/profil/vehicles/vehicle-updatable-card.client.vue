<template>
  <div class="vehicles__informations">
    <div class="vehicles__informations--title">
      <h4>{{ localVehicle.brand }} | {{ localVehicle.model }}</h4>
      <button @click="isModalOpen = true"><fa :icon="['fas', 'pen-to-square']" title="Modifiez votre véhicule" /></button>
    </div>
    <p>{{ localVehicle.year }}</p>
    <p>{{ localVehicle.plate }}</p>
    <p>{{ localVehicle.mileage }} km</p>

    <vmc-modal :is-open="isModalOpen" title="Modifier un véhicule" max-width="500px" @close="isModalOpen = false">
      <vehicle-input v-model="localVehicle" @updated="closeModalAndEmitUpdated" @deleted="closeModalAndEmitDeleted" @cancel="isModalOpen = false" />
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['updated', 'deleted'])
const props = defineProps({ vehicle: { type: Object as () => IOwnerVehicle, required: true } })

const localVehicle = ref<IOwnerVehicle>(useUtils().objects.clone<IOwnerVehicle>(props.vehicle))
const isModalOpen = ref<boolean>(false)

function closeModalAndEmitUpdated() {
  isModalOpen.value = false
  emit('updated', localVehicle)
}
function closeModalAndEmitDeleted() {
  isModalOpen.value = false
  emit('deleted')
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-main {
  width: 100%;
  color: $color-dark-blue !important;
}
.vmc-input {
  width: 100%;
}

.vehicles__informations {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
  &--title {
    display: flex;
    justify-content: space-between;
  }
}

.confirmationButton {
  margin: 5px 10px;
}
</style>
