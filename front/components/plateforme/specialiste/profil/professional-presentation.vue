<template>
  <div class="presentation">
    <h2>Présentation</h2>
    <div class="presentation__wrapper">
      <p class="presentation__text">
        {{ presentation }}
      </p>
      <fa :width="17" class="button" icon="fa-solid fa-edit" @click="isModalOpen = true" />
      <modal-edit-presentation :open-modal="isModalOpen" @close="isModalOpen = false" @updated="presentation = getCurrentPresentation()" />
    </div>
  </div>
</template>

<script setup lang="ts">
const isModalOpen = ref<boolean>(false)
const presentation = ref<string>(getCurrentPresentation())

function getCurrentPresentation(): string {
  return useSessionStore().user?.professionalProfile?.businessPresentation || "L'entreprise n'as pas encore de présentation"
}
</script>

<style lang="scss" scoped>
.presentation {
  max-width: 1220px;
  margin: auto;
  width: 100%;
  padding: 0 20px;
  &__text {
    line-height: 16px;
    padding-top: $spacing-2;
    width: 100%;
  }
  &__edit {
    width: 17px;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.button {
  cursor: pointer;
  width: 17px;
  align-self: flex-end;
}
@media (min-width: 900px) {
  .presentation {
    // padding: 0;

    &__text {
      width: 75%;
    }
  }
}
</style>
