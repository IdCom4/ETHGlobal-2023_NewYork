<template>
  <div
    class="file-upload-input"
    :class="{ 'drop-area-highlight': isDraggedIn }"
    @dragleave.prevent="isDraggedIn = false"
    @dragover.prevent="isDraggedIn = true"
    @drop.prevent="handleDropFile"
  >
    <div class="file-upload-input__content">
      <label for="file-input" class="file-upload-input__content--label">
        <span class="select-button">
          {{ title }}
          <fa :icon="['fas', 'upload']" />
        </span>
      </label>
      <input id="file-input" class="file-upload-input__content--input" type="file" @change="handleClickFile" />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['file-received'])

defineProps({
  title: {
    type: String,
    default: ''
  }
})

const isDraggedIn = ref<boolean>(false)

// BY CLICK
function handleClickFile(e: Event | DragEvent) {
  const fileInput = e.target as HTMLInputElement

  if (fileInput.files && fileInput.files.length > 0) {
    const fileSelected = fileInput.files[0]

    convertToBase64(fileSelected)
  }
}

// BY DRAG AND DROP
function handleDropFile(e: DragEvent) {
  isDraggedIn.value = false

  const fileDroped = e.dataTransfer?.files[0]
  if (!fileDroped) return

  convertToBase64(fileDroped)
}

// GET BASE64
async function convertToBase64(file: File) {
  const base64File = await useUtils().files.getFileAsBase64(file)

  if (!base64File) return
  emit('file-received', { content: base64File, name: file.name })
}
</script>

<style lang="scss" scoped>
.file-upload-input {
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px;
  border: solid 2px transparent;
  &__content {
    &--label {
      .select-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        font-family: 'Nunito';
        font-size: 12px;
        font-weight: 700;
      }
    }
    &--input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 0;
    }
  }
  &.drop-area-highlight {
    border: solid 2px $color-grey;
    border-style: dashed;
    .file-upload-input__content {
      & > * {
        color: $color-grey;
      }
    }
  }
}
</style>
