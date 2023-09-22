<template>
  <vmc-modal
    :is-open="isModalPresentationOpen"
    max-width="600px"
    title="Modification de informations de votre entreprise"
    @close="closeModalInformation"
  >
    <div class="modal">
      <div class="relative">
        <vmc-input v-model="presentation" type="textarea" modal-style :error="errorMessage" error-grow />
        <div class="countError">
          <div v-if="presentationLength < 10" class="char-counter">{{ presentationLength }}/10</div>
          <div v-else-if="presentationLength > 1000" class="char-counter">-{{ presentationLength - 1000 }}</div>
          <div v-else class="char-counter--noerror">{{ presentationLength }}/1000</div>
        </div>
      </div>

      <div class="modal__button">
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

const user = ref<IProfessionalUser>(useSessionStore().user as IProfessionalUser)
const isModalPresentationOpen = ref<boolean>(props.openModal)
const isLoading = ref(false)
const errorMessage = ref('')
const presentation = ref<string>(user.value.professionalProfile.businessPresentation || "L'entreprise n'as pas encore de présentation")
const presentationLength = ref(presentation.value.length)
/* <=========== Variable declarations */

/* <=========== modal function */
const openModalPresentation = () => {
  isModalPresentationOpen.value = true
}

const closeModalInformation = () => {
  isModalPresentationOpen.value = !isModalPresentationOpen.value
  emitEvent('close')
}
/* >=========== modal function */

/* >=========== update professional user */
const updateProfessionalProfileField = async () => {
  if (isLoading.value) return

  const updateProfileRequest: IUpdateProfessionalProfileRequest = { businessPresentation: presentation.value }

  const fieldsToUpdate = Object.keys(updateProfileRequest) as (keyof IUpdateProfessionalProfileRequest)[]

  isLoading.value = true
  const response = await useAPI().professionals.updateProfile(fieldsToUpdate, updateProfileRequest)
  isLoading.value = false

  if (response.error) return

  user.value = useSessionStore().user as IProfessionalUser
  emitEvent('updated')
  closeModalInformation()
}

/* <=========== update professional user */

watch(
  () => props.openModal,
  () => {
    props.openModal ? openModalPresentation() : closeModalInformation
  }
)

watch(presentation, (newPresentation) => {
  presentationLength.value = newPresentation.length

  if (newPresentation.length < 10 || newPresentation.length > 1000) {
    errorMessage.value = 'La présentation doit comporter entre 10 et 1000 caractères'
  } else {
    errorMessage.value = ''
  }
})
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  &__button {
    display: flex;
    flex-direction: row;
    gap: $spacing-3;
    justify-content: center;
  }
}

.relative {
  position: relative;
}

.countError {
  position: absolute;
  color: #f80077;
  font-size: 10px;
  right: 0px;
  bottom: 15px;
  font-family: $main-font;
}

.char-counter--noerror {
  color: black;
}
</style>
