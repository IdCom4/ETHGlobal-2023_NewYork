<template>
  <div class="file-manager">
    <div class="file-manager__content">
      <eth-loader v-if="loading" class="file-manager__content--loader" :size="35" />

      <file-upload-input v-else :title="uploadTitle" @file-received="fileReceived" />
    </div>

    <file-downloader v-if="!loading && file" :file="file" />

    <!-- DELETE UPLOADED DOCUMENT -->
    <div class="file-manager__file-message">
      <p :class="{ 'file-manager__file-message--error': fileError, 'file-manager__file-message--name': fileNameUpdate }">
        <small>{{ fileError ? fileError : fileNameUpdate }}</small>
        <fa v-if="file" :icon="['far', 'circle-xmark']" :width="12" class="delete-icon" title="Supprimer votre assurance" @click="emit('delete')" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @param {string} uploadTitle props
 * @param {IPublicFile || null} file props
 * @param {string || null} fileName props
 * @param {boolean} loading props
 *
 * @param {function} upload emit
 * @param {function} delete emit
 */

const emit = defineEmits(['upload', 'delete'])

const props = defineProps({
  uploadTitle: {
    type: String,
    default: 'Télécharger un fichier'
  },
  loading: {
    type: Boolean,
    default: false
  },
  file: {
    type: Object as PropType<IPublicFile>,
    default: null
  },
  fileName: {
    type: String,
    default: ''
  }
})

const fileError = ref<string>('')
const fileNameUpdate = ref<string>(props.fileName)

watch(
  () => props.fileName,
  () => {
    props.fileName ? (fileNameUpdate.value = props.fileName) : (fileNameUpdate.value = '')
  }
)

// UPLOAD FILE
async function fileUpload(fileUpload: IFileUpload) {
  emit('upload', fileUpload)
}

// CHECK FILE FORMAT
function isCorrectFile(fileToCheck: IFileUpload): boolean {
  const allowedFormats = ['pdf', 'jpeg', 'jpg', 'png']
  const fileFormat = fileToCheck.name
    .split('.')
    .pop()
    ?.toLowerCase()

  let hasError = false

  if (!fileFormat || !allowedFormats.includes(fileFormat)) {
    hasError = true
    fileError.value = "Le format de fichier n'est pas autorisé(PDF, JPEG, JPG ou PNG)."
    fileNameUpdate.value = ''
  } else {
    hasError = false
    fileUpload(fileToCheck)
    fileError.value = ''
  }

  if (hasError) return false

  return true
}

// GET FILE FROM EMIT
function fileReceived(fileToUpload: IFileUpload) {
  if (!isCorrectFile(fileToUpload)) return
}
</script>

<style lang="scss" scoped>
.file-manager {
  &__content {
    display: inline-block;
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    max-height: 0;
    padding: 0;
    margin-top: 0;
    border: 1px solid #ccc;
    text-align: center;
    cursor: pointer;
    animation: expand 0.7s ease-in-out both;
    transition: 0.3s;
    &--loader {
      width: 55px;
    }
    &:hover {
      background-color: $color-light-grey;
    }
  }
  &__file-message {
    display: flex;
    align-items: center;
    margin-top: 5px;
    font-size: 10px;
    font-style: italic;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    & > * {
      small {
        cursor: default;
      }
    }
    &--error {
      color: $color-error;
    }
    &--name {
      display: flex;
      align-items: center;
      max-width: 99%;
      small {
        max-width: 100%;
        overflow: hidden;
        margin-right: 5px;
      }
      .delete-icon {
        margin-left: 5px;
        cursor: pointer;
        color: $color-grey;
      }
    }
  }
}

@keyframes expand {
  0% {
    max-height: 0;
    margin-top: 0;
    padding: 0;
  }
  15% {
    margin-top: 20px;
  }
  50% {
    padding: 10px;
  }
  100% {
    max-height: 500px;
    margin-top: 20px;
    padding: 10px;
  }
}
</style>
