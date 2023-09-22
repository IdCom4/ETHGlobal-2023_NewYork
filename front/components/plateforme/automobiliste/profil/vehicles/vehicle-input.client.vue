<template>
  <div v-if="vehicleToUpdate" class="vehicle-input">
    <autocomplete-input
      v-if="brandIdsOptions.length"
      v-model="vehicleToUpdate.brandId"
      label="Marque"
      placeholder="Marque"
      :options="brandIdsOptions"
      class="data-input"
      :error="formValidator.getErrorsOf('brandId')[0]"
      @input="formValidator.validateOne('brandId')"
    />
    <vmc-input
      v-model="vehicleToUpdate.model"
      type="text"
      label="Modèle"
      placeholder="Modèle"
      modal-style
      class="data-input"
      :error="formValidator.getErrorsOf('model')[0]"
      @input="formValidator.validateOne('model')"
    />
    <vmc-input
      v-model="vehicleToUpdate.year"
      type="number"
      label="Année"
      placeholder="Année"
      modal-style
      class="data-input"
      :error="formValidator.getErrorsOf('year')[0]"
      @input="formValidator.validateOne('year')"
    />
    <vmc-input
      v-model="vehicleToUpdate.mileage"
      type="number"
      label="Kilométrage"
      placeholder="Kilométrage"
      modal-style
      class="data-input"
      :error="formValidator.getErrorsOf('mileage')[0]"
      @input="formValidator.validateOne('mileage')"
    />
    <vmc-input
      v-model="vehicleToUpdate.plate"
      type="text"
      label="Numéro d'immatriculation"
      placeholder="AB-123-CD"
      modal-style
      class="data-input"
      :error="formValidator.getErrorsOf('plate')[0]"
      @input="formValidator.validateOne('plate')"
    />

    <div class="actions-btn">
      <button v-if="isCreatingNewVehicle" class="btn-modal btn btn_denied" @click="emit('cancel')">Annuler</button>
      <button v-else class="btn-modal btn btn_denied" @click="isModalOpen = true">Supprimer</button>
      <button class="btn-modal btn btn_call-to-action" @click="sendRequest">Enregistrer</button>
    </div>

    <vmc-modal :is-open="isModalOpen" title="Voulez-vous vraiment supprimer cette voiture ?" confirmation-style @close="isModalOpen = false">
      <div class="delete-confirmation-modal">
        <div class="actions-btn">
          <button class="confirmationButton btn_denied" @click="isModalOpen = false">Non</button>
          <button class="confirmationButton btn-modal btn btn_call-to-action" @click="deleteVehicle">Oui</button>
        </div>
      </div>
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
import { VehicleRequestBuilder } from '@/types/composables/useAPI'
import { FormValidator } from '@/composables/useValidator'

const emit = defineEmits(['update:modelValue', 'updated', 'created', 'deleted', 'cancel'])
const props = defineProps({ modelValue: { type: Object as PropType<IOwnerVehicle>, default: null } })

const brandIdsOptions = ref<IInputSelectOptions<string>[]>([])
const isCreatingNewVehicle = ref<boolean>(!props.modelValue)
const vehicleToUpdate = ref<INewVehicleRequest | IUpdateVehicleRequest | null>(null)
const isModalOpen = ref<boolean>(false)
const formValidator = ref<FormValidator<INewVehicleRequest>>(
  useValidator().createFormValidator<INewVehicleRequest>({
    brandId: {
      getter: () => vehicleToUpdate.value?.brandId,
      validate: (brandId?: string) => (brandId ? [] : ['Vous devez renseigner la marque du véhicule'])
    },
    model: {
      getter: () => vehicleToUpdate.value?.model,
      validate: (model?: string) =>
        model ? (model.length <= 50 ? [] : ['Le modèle ne doit pas dépasser 50 caractères']) : ['Vous devez préciser le modèle de véhicule']
    },
    year: {
      getter: () => vehicleToUpdate.value?.year,
      validate: (year?: number) =>
        year
          ? year <= new Date().getFullYear()
            ? []
            : ["L'année ne peut pas être supérieur à l'année courante"]
          : ["Vous devez renseigner l'année de mise en circulation du véhicule"]
    },
    mileage: {
      getter: () => vehicleToUpdate.value?.mileage,
      validate: (mileage?: number) => {
        return mileage !== null && mileage !== undefined
          ? mileage >= 0
            ? []
            : ['Le kilométrage ne peut pas être négatif']
          : ['Vous devez renseigner le kilométrage du véhicule']
      }
    },
    plate: {
      getter: () => vehicleToUpdate.value?.plate,
      validate: (plate?: string) => (plate ? [] : ["Vous devez renseigner la plaque d'immatriculation"])
    }
  })
)

async function setupRequiredData() {
  const brands = await initVehicleBrandsOptions()
  setupVehicleToUpdate(brands)
}

setupRequiredData()

// send a create or update vehicle request to the server
async function sendRequest() {
  if (!vehicleToUpdate.value || !formValidator.value.validateForm()) return

  const vehicleRequestBuilder = new VehicleRequestBuilder(vehicleToUpdate.value)

  let response: IRequestResult<IOwnerVehicle>

  if (isCreatingNewVehicle) {
    response = await useAPI().vehicles.addVehicle(vehicleRequestBuilder.toNewVehicleRequest())
  } else {
    response = await useAPI().vehicles.updateVehicle(vehicleRequestBuilder.toUpdateVehicleRequest())
  }

  const { data, error } = response
  if (!data || error) return

  emit('update:modelValue', data)

  if (isCreatingNewVehicle) emit('created', data)
  else emit('updated', data)
}

// delete the vehicle
async function deleteVehicle() {
  if (isCreatingNewVehicle) return

  const { error } = await useAPI().vehicles.deleteVehicle(props.modelValue._id)
  if (error) return

  emit('update:modelValue', null)
  emit('deleted')
}

// init vehicle to update object
function setupVehicleToUpdate(vehicleBrands: IVehicleBrand[]): void {
  vehicleToUpdate.value = props.modelValue
    ? useUtils().objects.clone<IUpdateVehicleRequest>({
        model: props.modelValue.model,
        year: props.modelValue.year,
        mileage: props.modelValue.mileage,
        plate: props.modelValue.plate,
        brandId: vehicleBrands.find((brand) => brand.name === props.modelValue.brand)?._id || ''
      })
    : {
        brandId: '',
        model: '',
        year: 0,
        mileage: 0,
        plate: ''
      }
}

// setup brands options for autocomplete
async function initVehicleBrandsOptions(): Promise<IVehicleBrand[]> {
  const brands = await fetchVehicleBrands()
  brandIdsOptions.value = convertVehicleBrandsToSelectOptions(brands)

  return brands
}

function convertVehicleBrandsToSelectOptions(brands: IVehicleBrand[]): IInputSelectOptions<string>[] {
  return brands.map((brand) => ({ value: brand._id, display: brand.name }))
}

async function fetchVehicleBrands(): Promise<IVehicleBrand[]> {
  const { data, error } = await useAPI().vehicles.getAllBrands()

  return !data || error ? [] : data
}
</script>

<style lang="scss" style>
.vehicle-input {
  width: 100%;

  .data-input + .data-input {
    margin-top: 20px;
  }
}

.vehicle-input .actions-btn,
.delete-confirmation-modal .actions-btn {
  margin-top: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
