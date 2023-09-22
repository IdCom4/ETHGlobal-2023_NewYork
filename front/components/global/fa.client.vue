<template>
  <font-awesome-icon
    class="fa --icon"
    :style="{ '--fa-width': `${width}px`, '--fa-height': `${height}px` }"
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

<style>
.fa {
  width: var(--fa-width);
  height: var(--fa-height);
}
</style>
