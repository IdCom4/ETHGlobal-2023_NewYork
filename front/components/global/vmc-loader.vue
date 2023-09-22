<template>
  <span :style="{ height: sizeCss ? sizeCss : '100%' }" class="vmc-loader"></span>
</template>
<script setup lang="ts">
defineProps({
  sizeCss: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.vmc-loader {
  height: 100%;
  aspect-ratio: 1;
  border: 3px solid #000000;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
