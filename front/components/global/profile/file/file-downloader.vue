<template>
  <div v-if="file" class="file-downloader">
    <a :href="file.fileURL" class="file-downloader__link" title="Télécharger le fichier" target="_blank">
      <span class="file-downloader__link--button">
        Télécharger le document
        <fa :icon="['far', 'circle-check']" />
      </span>
    </a>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  file: {
    type: Object as PropType<IPublicFile>,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.file-downloader {
  &__link {
    display: block;
    width: 100%;
    height: 100%;
    padding: 5px;
    background-color: $color-neon-blue;
    color: #000;
    &--button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-family: 'Nunito';
      font-size: 12px;
      font-weight: 700;
    }
  }
}
</style>
