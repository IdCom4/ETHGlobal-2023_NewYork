<template>
  <section>
    <div class="modal">
      <div>
        <!-- MAIN REALISATION DATA -->
        <vmc-input
          v-model="realisation.title"
          error-grow
          :error="formValidator.getErrorsOf('title')[0]"
          type="text"
          modal-style
          label="Titre"
          @update:model-value="formValidator.validateOne('title')"
        />
        <vmc-input
          v-model="realisation.description"
          error-grow
          :error="formValidator.getErrorsOf('description')[0]"
          type="text"
          modal-style
          label="Description"
          @update:model-value="formValidator.validateOne('description')"
        />

        <!-- FILES INPUT -->
        <div class="file-upload">
          <file-upload-input @file-received="addNewFile" />
        </div>

        <!-- ALREADY PRESENT FILES DISPLAY -->
        <div class="container">
          <div v-for="(publicFile, index) in realisation.files" :key="`realisation-file_${publicFile.fileReferenceId}`" class="image-container">
            <img :src="publicFile.fileURL" alt="Prévisualisation de l'image" class="image-preview" />
            <button style="float: right;" @click="removeFile(realisation.files, index)">
              <fa icon="fa-regular fa-circle-xmark" />
            </button>
          </div>

          <!-- NEW FILES DISPLAY -->
          <div v-for="(base64File, index) in realisation.newFiles" :key="`realisation--new-file_${index}`" class="image-container">
            <img :src="base64File" alt="Prévisualisation de l'image" class="image-preview" />
            <button style="float: right;" @click="removeFile(realisation.newFiles, index)">
              <fa icon="fa-regular fa-circle-xmark" />
            </button>
          </div>
        </div>
      </div>

      <div class="btn-container">
        <button v-if="isNewRealisation" class="custom-btn-denied" @click="cancelCreation">Annuler</button>
        <button v-else class="custom-btn-denied" :class="loading && !anyError ? '--load' : ''" @click="deleteRealisation">Supprimer</button>

        <button class="btn_call-to-action" :class="loading && !anyError ? '--load' : ''" @click="saveRealisation">Enregistrer</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IRealisationRequest } from '@/composables/resources/api-endpoints/professionals.endpoint'
import { FormValidator } from '@/composables/useValidator'

const emit = defineEmits(['added', 'updated', 'deleted', 'cancel'])
const props = defineProps({ realisationToUpdate: { type: Object as PropType<IRealisation | null>, default: null } })

const realisation = ref<IRealisationRequest>({ ...(props.realisationToUpdate || { title: '', description: '' }), newFiles: [] })
const isNewRealisation = ref<boolean>(realisation.value.id === null || realisation.value.id === undefined)
const loading = ref<boolean>(false)
const anyError = computed(() => formValidator.value.hasAnyErrors())

const formValidator = ref<FormValidator<{ title: string; description: string }>>(
  new FormValidator({
    title: {
      validate: (title?: string) => {
        const errors: string[] = []

        if (!title) errors.push('Le titre ne peut pas être vide')
        else if (title.length > 50) errors.push('Le titre ne peut pas dépasser 50 caractères')

        return errors
      },
      getter: () => realisation.value.title
    },
    description: {
      validate: (description?: string) => {
        const errors: string[] = []

        if (!description) errors.push('Le titre ne peut pas être vide')
        else if (description.length > 1000) errors.push('La description ne peut pas dépasser 1000 caractères')

        return errors
      },
      getter: () => realisation.value.description
    }
  })
)

function addNewFile(file: IFileUpload) {
  realisation.value.newFiles?.push(file.content)
}

function removeFile(filesArray: Array<unknown> | undefined, fileToRemoveIndex: number) {
  if (!filesArray) return
  filesArray.splice(fileToRemoveIndex, 1)
}

function validateFields(): boolean {
  formValidator.value.validateForm()

  return !anyError.value
}

function getUpToDateRealisations(): IRealisation[] {
  return useSessionStore().user?.professionalProfile?.history.realisations || []
}

async function deleteRealisation() {
  if (isNewRealisation.value) return

  // get current realisations
  const currentRealisations = getUpToDateRealisations()

  // find the one to delete
  const realisationToRemoveIndex = currentRealisations.findIndex((currentReal) => currentReal.id === realisation.value.id)
  if (!realisationToRemoveIndex && realisationToRemoveIndex !== 0) return

  // remove it
  currentRealisations.splice(realisationToRemoveIndex, 1)

  // send the result to the server
  loading.value = true
  await useAPI().professionals.updateProfile(['realisations'], { realisations: currentRealisations })
  loading.value = false

  emit('deleted')
}

function cancelCreation() {
  emit('cancel')
}

async function saveRealisation() {
  if (!validateFields()) return

  // get current realisations
  const currentRealisations = getUpToDateRealisations() as IRealisationRequest[]

  loading.value = true
  await useAPI().professionals.updateProfile(['realisations'], { realisations: currentRealisations.concat([realisation.value]) })
  loading.value = false

  if (!isNewRealisation) {
    // get updated realisations
    const lastUpToDateRealisations = getUpToDateRealisations()

    // emit the newly updated one
    const updatedRealisation = lastUpToDateRealisations.find((real) => real.id === realisation.value.id)
    emit('added', updatedRealisation)
  } else {
    emit('updated')
  }
}
</script>

<style scoped lang="scss">
.btn-container {
  display: flex;
  justify-content: center;
}
.custom-btn-denied {
  @extend .btn_denied;
  margin: 0px 30px;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}
.image-preview {
  max-width: 280px;
  max-height: 150px;
}
.drop-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
.drop-area-highlight {
  border-color: #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
}

.drop-area p {
  font-size: 16px;
  margin-bottom: 10px;
}

.drop-area:hover {
  border-color: #aaa;
}

.drop-area.drag-over {
  border-color: #ff0000;
}

.modal {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.file-upload {
  position: relative;
  border: 1px solid $black;
  padding: 5px;
}
</style>
