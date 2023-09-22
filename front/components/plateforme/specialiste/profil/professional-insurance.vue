<template>
  <section class="insurance-section">
    <h3 class="insurance-section__main-title">assurance</h3>
    <h5>Avez-vous une assurance ?</h5>
    <vmc-input v-model="insuranceToggle" class="toggle" type="toggle" @input="!insuranceToggle && deleteFile()" />
    <small v-if="!insuranceToggle">Vous indiquez ne pas disposer d’assurance RC Pro.</small>
    <small v-else-if="!fileInsurance">Merci d'ajouter votre assurance RC Pro.</small>
    <small v-else>Vous indiquez avoir renseigné une assurance RC Pro.</small>

    <file-manager
      v-show="insuranceToggle || fileInsurance"
      upload-title="Ajouter un justificatif"
      :file="fileInsurance"
      :loading="loading"
      :file-name="fileName"
      @upload="upload"
      @delete="deleteFile"
    />
  </section>
</template>

<script setup lang="ts">
import { AlertModes } from '@/types/constants'

// INIT
const loading = ref<boolean>(false)
const fileInsurance = ref<IPublicFile | undefined>(useSessionStore().user?.professionalProfile?.insurance)
const insuranceToggle = ref<boolean>(!!fileInsurance.value)
const fileName = ref<string | undefined>(undefined)

// ALREADY TOGGLE IF INSURANCE
onMounted(() => {
  if (fileInsurance.value) {
    insuranceToggle.value = true
    fileName.value = fileInsurance.value?.fileURL.split('/').pop()
  }
})

// UPLOAD FILE
async function upload(fileUpload: IFileUpload) {
  loading.value = true
  const { data, error } = await useAPI().professionals.updateProfile(
    ['insurance'],
    { insurance: fileUpload.content },
    { mode: AlertModes.ALL, successMsg: 'Assurance RC Pro ajoutée' }
  )
  loading.value = false

  if (!data || error) return

  fileInsurance.value = data.professionalProfile.insurance

  fileName.value = fileInsurance.value?.fileURL.split('/').pop()

  insuranceToggle.value = true
}
// DELETE FILE
async function deleteFile() {
  if (!fileInsurance.value) return

  loading.value = true
  const response = await useAPI().professionals.updateProfile(['insurance'], {}, { mode: AlertModes.ALL, successMsg: 'Assurance RC Pro supprimée' })
  loading.value = false

  if (response.error) return

  fileName.value = ''
  fileInsurance.value = undefined
}
</script>

<style lang="scss" scoped>
.insurance-section {
  width: 100%;
  height: auto;
  text-align: left;
  border: solid 1px;
  padding: 0 15px 15px;
  &__main-title {
    display: flex;
    text-align: center;
    flex-direction: column;
    margin-bottom: 20px;
    &::after,
    &::before {
      margin: 15px;
    }
  }
  h5 {
    font-weight: bold;
  }
  .toggle {
    width: fit-content;
    margin-top: 15px;
  }
  small {
    cursor: default;
  }
}

@media (max-width: 900px) {
  .insurance-section {
    border: none;
  }
}
</style>
