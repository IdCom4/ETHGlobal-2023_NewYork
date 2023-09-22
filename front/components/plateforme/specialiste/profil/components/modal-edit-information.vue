<template>
  <vmc-modal
    :is-open="isModalInformationOpen"
    max-width="600px"
    title="Modification de informations de votre entreprise"
    @close="closeModalInformation"
  >
    <div class="modal">
      <vmc-input
        v-model="commercialName"
        type="text"
        label="Nom commercial"
        modal-style
        placeholder="Nom commercial"
        icon="fa-regular fa-floppy-disk"
      />

      <vmc-input v-model="averageAvailability" type="text" label="Disponibilité" modal-style icon="fa-regular fa-floppy-disk" />
      <vmc-input v-model="billingAddress" type="address" label="Adresse professionnelle" modal-style icon="fa-regular fa-floppy-disk" />
      <div class="modal-option">
        <vmc-input v-model="price" type="number" label="Tarif indicatif" modal-style placeholder="50" icon="fa-regular fa-floppy-disk" />
        <vmc-input v-model="selectedOption" type="select" label="Mobilité" modal-style :select-options="options" icon="fa-regular fa-floppy-disk" />
      </div>

      <div class="modalPassword__button">
        <button class="button btn-modal btn btn_call-to-action" @click="updateProfessionalProfileField()">Modifier</button>
        <button class="button btn_denied" @click="closeModalInformation()">Annuler</button>
      </div>
    </div>
  </vmc-modal>
</template>

<script setup lang="ts">
import { IUpdateProfessionalProfileRequest } from '@/composables/resources/api-endpoints/professionals.endpoint'

/* >=========== Variable declarations */
const emitEvent = defineEmits(['updated', 'close'])

const props = defineProps({
  openModal: {
    type: Boolean,
    required: true,
    default: false
  }
})

const updatedUser = ref<IProfessionalUser>(useSessionStore().user as IProfessionalUser)
const isModalInformationOpen = ref<boolean>(false)
const isLoading = ref(false)

const options = ref([
  { value: 5, display: '5' },
  { value: 10, display: '10' },
  { value: 20, display: '20' },
  { value: 50, display: '50' },
  { value: 100, display: '100' },
  { value: 200, display: '200' }
])

const commercialName = ref<string>(updatedUser.value?.professionalProfile?.businessName || '')
const price = ref<number>(updatedUser.value?.professionalProfile?.averageHourlyRate || 0)

const selectedOption = ref<IInputSelectOptions>({
  value: updatedUser.value?.professionalProfile?.maxTravelDistance || '5',
  display: '5'
})

const averageAvailability = ref<string>(updatedUser.value?.professionalProfile?.averageAvailability || '')
const billingAddress = ref<IStrictAddress | undefined>(updatedUser.value?.professionalProfile?.workAddress)
/* <=========== Variable declarations */

/* <=========== modal function */
const openModalInformation = () => {
  isModalInformationOpen.value = true
}

const closeModalInformation = () => {
  isModalInformationOpen.value = false
  emitEvent('close', false)
}
/* >=========== modal function */

/* >=========== update professional user */
const updateProfessionalProfileField = async () => {
  // if (error) return
  if (isLoading.value) return

  const updateProfileRequest: Partial<IUpdateProfessionalProfileRequest> = {
    businessName: commercialName.value,
    averageAvailability: averageAvailability.value,
    workAddress: billingAddress.value,
    averageHourlyRate: price.value,
    maxTravelDistance: parseFloat(selectedOption.value.toString())
  }

  isLoading.value = true
  const response = await useAPI().professionals.updateProfile(
    Object.keys(updateProfileRequest) as (keyof IUpdateProfessionalProfileRequest)[],
    updateProfileRequest
  )
  isLoading.value = false

  if (response.data) {
    emitEvent('updated')
    closeModalInformation()
  }
}

/* <=========== update professional user */

watch(
  () => props.openModal,
  () => {
    props.openModal ? openModalInformation() : closeModalInformation
  }
)
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  &-option {
    display: flex;
    flex-direction: column;
    gap: $spacing-3;
  }
}

@media (min-width: 950px) {
  .modal-option {
    flex-direction: row;
    width: 100%;
  }

  .vmc-input {
    width: 100%;
  }
}
</style>
