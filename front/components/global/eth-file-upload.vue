<template>
  <section class="vmc-file-upload">
    <section
      class="drop-area"
      :class="{ 'drop-area-highlight': isDraggedIn }"
      @click="openFileInput"
      @dragleave.prevent="isDraggedIn = false"
      @dragover.prevent="isDraggedIn = true"
      @drop.prevent="handleDrop"
    >
      <input ref="fileInput" :multiple="multiple" :accept="allowedFiles.join(', ')" style="display: none;" type="file" @change="emitFiles()" />
      <h5 class="add-media">{{ props.title }}</h5>
      <fa icon="fa-solid fa-folder-open" />
    </section>
    <p v-if="selectedFiles.length" class="selected-files">{{ selectedFiles.length }} fichier(s) chargé(s)</p>
    <p v-if="error" class="--error">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { AlertStatuses, FileTypes } from '@/assets/ts/enums';

const emit = defineEmits(['update'])
const props = defineProps({
  error: { type: String, default: '' },
  title: { type: String, default: 'Ajoutez un fichier' },
  multiple: { type: Boolean, default: false },
  allowedFiles: { type: Array<FileTypes>, default: [FileTypes.PNG, FileTypes.JPEG] },
})

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const isDraggedIn = ref<boolean>(false)

function handleDrop(event: DragEvent) {
  isDraggedIn.value = false

  if (!event.dataTransfer?.files) return

  emitFiles()
}

async function emitFiles() {
  const files = Array.from(fileInput.value?.files || [])
  const base64Files: TBase64File[] = []

  selectedFiles.value.length = 0

  for (const file of files) {
    const base64File = await useUtils().files.getFileAsBase64(file)
    if (base64File) {
      base64Files.push(base64File)
      selectedFiles.value.push(file)
    }
    else useAlertStore().sendAlert(AlertStatuses.ERROR, "Un ou plusieurs fichiers n'ont pas pu être traités")
  }


  emit('update', base64Files)
}

function openFileInput() {
  if (fileInput.value) fileInput.value.click()
}
</script>

<style lang="scss" scoped>
.vmc-file-upload {
  .drop-area {
    border: 1px solid black;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    .drop-area-highlight {
      border-color: #ff0000;
      background-color: rgba(255, 0, 0, 0.1);
    }
    .add-media {
      font-weight: bold;
      margin: 0.625rem;
    }
  }

  .selected-files {
    margin-top: $spacing-1;
  }

  .--error {
    width: 100%;
    margin-top: $spacing-1;
    color: $color-error;
  }
}
</style>
