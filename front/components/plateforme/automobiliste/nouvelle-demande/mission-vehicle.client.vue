<template>
  <centered-section>
    <h4>
      Véhicule à prendre en charge
    </h4>
    <vmc-input
      v-if="vehiclesSelectOptions.length"
      v-model="selectedVehicle"
      :select-options="vehiclesSelectOptions"
      :error="formError"
      placeholder="Véhicule à prendre en charge"
      type="select"
      label=""
      modal-style
      not-modal
      required
      @blur="handleBlur"
    />

    <button v-if="isLoggedIn" class="add-btn btn_call-to-action" type="button" @click="openVehicleInput = true">Ajouter un véhicule</button>
    <button v-else class="add-btn btn_call-to-action" type="button" @click="openLoginModal">Ajouter un véhicule</button>

    <vmc-modal :is-open="openVehicleInput" title="Modifier un véhicule" max-width="500px" @close="openVehicleInput = false">
      <vehicle-input @created="closeModalAndSelectNewVehicle" @cancel="openVehicleInput = false" />
    </vmc-modal>
  </centered-section>
</template>

<script setup lang="ts">
import { GlobalEventTypes, SelectOptionStates } from '@/types/constants'

const emit = defineEmits(['update:modelValue', 'input', 'validate'])
const props = defineProps({
  modelValue: { type: Object as PropType<IOwnerVehicle>, default: null },
  formError: { type: String, default: '' }
})

const isLoggedIn = ref<boolean>(useSessionStore().isLoggedIn)
const openVehicleInput = ref<boolean>(false)
const selectedVehicle = ref<IOwnerVehicle | null>(props.modelValue ? useUtils().objects.clone<IOwnerVehicle>(props.modelValue) : null)
const vehiclesSelectOptions: Ref<IInputSelectOptions<IOwnerVehicle>[]> = ref([])

watch(
  () => useSessionStore().isLoggedIn,
  () => (isLoggedIn.value = useSessionStore().isLoggedIn)
)

watch(isLoggedIn, fetchVehiclesAndSetupOptions)

fetchVehiclesAndSetupOptions()

// fetch vehicles and create selectable options out of them
async function fetchVehiclesAndSetupOptions() {
  const { data: vehicles, error } = await useAPI().vehicles.getMyVehicles()
  if (!vehicles || error) return

  // map vehicles to selectable options
  vehiclesSelectOptions.value = vehicles.map((vehicle) => ({
    display: `${vehicle.brand as string} ${vehicle.model as string} - ${vehicle.plate as string}`,
    value: vehicle,
    state: selectedVehicle.value && selectedVehicle.value._id === vehicle._id ? SelectOptionStates.SELECTED : SelectOptionStates.AVAILABLE
  }))
}

async function closeModalAndSelectNewVehicle(newVehicle: IOwnerVehicle) {
  openVehicleInput.value = false

  await fetchVehiclesAndSetupOptions()

  selectedVehicle.value = newVehicle
}

function handleUpdate(value: IOwnerVehicle | null) {
  emit('update:modelValue', value)
  emit('input', value)
}

function handleBlur() {
  emit('validate')
}

function openLoginModal() {
  useGlobalEvents().emitEvent(GlobalEventTypes.OPEN_LOGIN)
}

watch(selectedVehicle, () => handleUpdate(selectedVehicle.value))
</script>

<style lang="scss" scoped>
h4 {
  font-weight: 600;
}
.add-btn {
  margin-top: 10px;
}
</style>
