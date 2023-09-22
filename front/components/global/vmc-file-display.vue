<template>
  <div v-for="file in filesToDisplay" :key="`file-number-${file.fileReferenceId}`" class="image-container">
    <img v-if="isImage(file)" :src="file.fileURL" class="image-preview" />
    <video v-if="isVideo(file)" :src="file.fileURL" class="image-preview" controls />
    <button style="float: right;" @click="removePictureFromArray(file)">
      <Fa icon="fa-regular fa-circle-xmark" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedFiles: { type: Array as PropType<IPublicFile[]>, default: () => [] },
  rawFiles: { type: Array as PropType<File[]>, default: () => [] }
})

const fileUtils = useUtils().files

const filesToDisplay = ref<IPublicFile[]>(props.selectedFiles)

watch(
  [() => props.selectedFiles, () => props.rawFiles],
  () => {
    filesToDisplay.value = [...props.selectedFiles, ...fileUtils.convertFileToPublicFile(props.rawFiles)]
  },
  { deep: true }
)

const emit = defineEmits(['delete'])

const removePictureFromArray = (file: IPublicFile) => {
  const index = props.selectedFiles.findIndex((f) => f.fileURL === file.fileURL)
  emit('delete', index)
}

function isImage(file: IPublicFile) {
  return ['jpeg', 'jpg', 'png', 'jfif'].includes(file.fileExtension)
}

function isVideo(file: IPublicFile) {
  return ['mp4'].includes(file.fileExtension)
}
</script>
<style lang="scss">
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.625rem;
  position: relative;
  width: fit-content;

  > button {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.image-preview {
  max-width: 19rem;
  max-height: 12rem;
}
</style>
