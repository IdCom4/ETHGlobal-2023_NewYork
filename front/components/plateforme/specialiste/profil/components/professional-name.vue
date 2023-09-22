<template>
  <div v-if="user" class="professional_name">
    <p class="professional_name__title">{{ user.name }}&nbsp;{{ user.lastName }}</p>

    <p class="professional_name__businessName">
      {{ user.professionalProfile?.businessName }}
    </p>
  </div>
</template>

<script setup lang="ts">
const user = ref<IProfessionalUser | null>(useSessionStore().getUser<IProfessionalUser>())

watch(
  () => useSessionStore().getUser(),
  () => (user.value = useSessionStore().getUser<IProfessionalUser>())
)
</script>

<style lang="scss" scoped>
.professional_name {
  p {
    white-space: nowrap; // Gardez le texte en une seule ligne
    overflow: hidden; // Cachez le texte qui dépasse le conteneur
    text-overflow: ellipsis; // Ajoutez des ellipses lorsque le texte est tronqué
    max-width: 100%; // Définissez une largeur maximale
    margin: 0 100px 0 0;
  }
  &__title {
    font-size: 28px;
    font-weight: $font-weight-4;
    color: $color-neon-blue;
  }

  &__businessName {
    color: $white;
    font-size: 18px;
    font-weight: $font-weight-1;
  }
}
</style>
