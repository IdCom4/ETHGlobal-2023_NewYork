<template>
  <div class="cv-section">
    <h3 class="cv-section__main-title">Curriculum Vitae</h3>
    <h5>Souhaitez-vous ajouter un cv ?</h5>
    <vmc-input v-model="curriculumToggle" class="toggle" type="toggle" @input="!curriculumToggle && deleteFile()" />
    <small v-if="fileCurriculum">Les utilisateurs peuvent maintenant consulter votre CV.</small>

    <file-manager
      v-show="curriculumToggle || fileCurriculum"
      upload-title="Ajouter votre CV"
      :file="fileCurriculum"
      :loading="loading"
      :file-name="fileName"
      @upload="upload"
      @delete="deleteFile"
    />
  </div>
</template>

<script setup lang="ts">
import { AlertModes } from '@/types/constants'

// INIT
const loading = ref<boolean>(false)
const fileCurriculum = ref<IPublicFile | undefined>(useSessionStore().user?.professionalProfile?.curriculum)
const curriculumToggle = ref<boolean>(!!fileCurriculum.value)
const fileName = ref<string | undefined>(undefined)

// ALREADY TOGGLE IF CURRICULUM
onMounted(() => {
  if (fileCurriculum.value) {
    curriculumToggle.value = true
    fileName.value = fileCurriculum.value?.fileURL.split('/').pop()
  }
})

// UPLOAD FILE
async function upload(fileUpload: IFileUpload) {
  loading.value = true
  const { data, error } = await useAPI().professionals.updateProfile(
    ['curriculum'],
    { curriculum: fileUpload.content },
    { mode: AlertModes.ALL, successMsg: 'CV correctement ajouté' }
  )
  loading.value = false

  if (!data || error) return

  fileCurriculum.value = data.professionalProfile.curriculum

  fileName.value = fileCurriculum.value?.fileURL.split('/').pop()

  curriculumToggle.value = true
}
// DELETE FILE
async function deleteFile() {
  if (!fileCurriculum.value) return

  loading.value = true
  const response = await useAPI().professionals.updateProfile(['curriculum'], {}, { mode: AlertModes.ALL, successMsg: 'CV correctement supprimée' })
  loading.value = false

  if (response.error) return

  fileName.value = ''
  fileCurriculum.value = undefined
}
</script>

<style lang="scss" scoped>
.cv-section {
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
  .cv-section {
    border: none;
  }
}
</style>
