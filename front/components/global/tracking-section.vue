<template>
  <section class="tracking-section">
    <slot></slot>
  </section>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.tracking-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  text-align: center;
}
</style>
