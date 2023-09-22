<template>
  <section class="quote-item-add" @click="emit('trigger')">
    <button class="btn_call-to-action">+</button>
    <p class="largest">Ajouter une ligne</p>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits(['trigger'])
</script>

<style lang="scss" scoped>
.quote-item-add {
  display: flex;
  flex-direction: row;
  gap: 10px;
  cursor: pointer;

  > p {
    align-self: center;
  }

  > button {
    font-style: normal;
    font-size: 18px;
  }
}
</style>
