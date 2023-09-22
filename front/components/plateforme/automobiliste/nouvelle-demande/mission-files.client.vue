<template>
  <centered-section>
    <h4 class="title">
      Ajouter des photos ou vidéos
    </h4>

    <vmc-file-upload :error="formError" :allowed-files="allowedFiles" multiple @update="selectFiles" />
  </centered-section>
</template>

<script setup lang="ts">
import { FileTypes, ImageFileTypes, VideoFileTypes } from '@/types/constants'


const emit = defineEmits(['update:modelValue', 'input'])
const props = defineProps({
  modelValue: { type: Array<TBase64File>, default: () => [] },
  formError: { type: String, default: '' }
})

const selectedFiles = ref<TBase64File[]>(props.modelValue)
const allowedFiles = ref<FileTypes[]>([ ...ImageFileTypes, ...VideoFileTypes])

function selectFiles(files: TBase64File[]) {
  selectedFiles.value = files

  emit('update:modelValue', selectedFiles.value)
  emit('input', selectedFiles.value)
}

watch(() => props.modelValue, () => selectedFiles.value = props.modelValue)
</script>

<style lang="scss" scoped>
.title {
  font-weight: 600;
  margin-bottom: 0.625rem;
}
.drop-area {
  border: 1px solid black;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
.drop-area-highlight {
  border-color: #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
}
.add-media {
  font-family: 'nunito';
  font-weight: bold;
  margin: 0.625rem;
}
.images-wrapper {
  display: flex;
}
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.625rem;
}
.image-preview {
  max-width: 19rem;
  max-height: 12rem;
}
</style>
