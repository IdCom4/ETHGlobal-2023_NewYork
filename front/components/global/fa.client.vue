<template>
  <font-awesome-icon
    class="fa --icon"
    :style="{ '--fa-width': (width && `${width}px`) || 'normal', '--fa-height': (height && `${height}px`) || 'normal' }"
    :icon="icon"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: [Array, String],
    default: 'fa-solid fa-check'
  },
  width: {
    type: Number,
    default: 17
  },
  height: {
    type: Number,
    default: 17
  }
})
</script>

<style></style>
