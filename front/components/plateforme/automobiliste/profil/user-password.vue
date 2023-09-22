<template>
  <section class="password">
    <h3>Mot de passe</h3>
    <Password :user="props.user" />
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object as () => IUser,
    required: true
  }
})
</script>

<style lang="scss" scoped>
h3 {
  margin-top: $spacing-3;
}

@media (min-width: 900px) {
  h3 {
    margin-top: $spacing-3;
    margin-bottom: $spacing-4;
  }

  .password {
    border: 1px solid black;
    padding: 0 20px 20px;
  }
}
</style>
