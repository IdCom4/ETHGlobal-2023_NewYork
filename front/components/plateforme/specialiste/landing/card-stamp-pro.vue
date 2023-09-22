<template>
  <div class="card-stamp-pro">
    <div class="card-stamp-pro__main content">
      <slot></slot>
    </div>
    <div v-if="nav" class="card-stamp-pro__fake-nav content">
      <fa class="icon" :icon="['fas', 'bolt']" />
      <hr />
      <fa class="icon" :icon="['far', 'comment-dots']" />
      <hr />
      <fa class="icon" :icon="['far', 'clipboard']" />
      <hr />
      <fa class="icon" :icon="['fas', 'bars']" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  nav: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.card-stamp-pro {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  max-width: 300px;
  min-width: 200px;
  .content {
    width: fit-content;
    text-align: center;
    border: solid 0.5px;
    background-color: #fff;
    box-shadow: 2px 2px 10px #000000a2;
  }
  &__main {
    padding: 30px;
  }
  &__fake-nav {
    display: flex;
    align-items: center;
    margin-top: -15px;
    .icon {
      padding: 5px;
      margin: 5px;
    }
    hr {
      border: none;
      border-left: 0.5px solid #000;
      height: 15px;
      width: 1px;
    }
  }
}
</style>
