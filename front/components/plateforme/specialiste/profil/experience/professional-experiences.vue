<template>
  <section class="experiences">
    <h3 class="experiences__title">Expériences</h3>

    <!-- ADD NEW experience -->
    <div class="experiences__addButton">
      <h5 class="experiences__addButton--text" @click="isModalOpen = true"><fa icon="fa-solid fa-pencil" /> Ajouter une expérience</h5>
    </div>

    <!-- experiences LIST -->
    <div v-if="experiences.length > 0" class="experiences__list">
      <professional-experience
        v-for="experience in experiences"
        :key="experience.id"
        class="experience"
        :experience="experience"
        @deleted="refresh"
        @updated="refresh"
      />
    </div>
    <div v-else class="experiences__noList">
      <h4>Aucune formation à afficher.</h4>
    </div>
  </section>

  <!-- NEW experience MODAL -->
  <vmc-modal :is-open="isModalOpen" title="Création d'une expérience" max-width="800px" @close="isModalOpen = false">
    <experience-input @cancel="isModalOpen = false" @added="refresh" />
  </vmc-modal>
</template>

<script setup lang="ts">
const experiences = ref<IProfessionalExperience[]>(useSessionStore().getUser()?.professionalProfile?.history.professionalExperiences || [])
const isModalOpen = ref<boolean>(false)

function refresh() {
  experiences.value = useSessionStore().getUser()?.professionalProfile?.history.professionalExperiences || []
  isModalOpen.value = false
}
</script>

<style lang="scss" scoped>
.experiences {
  border: solid 1px $color-grey;
  padding: 20px;

  &__addButton {
    cursor: pointer;
    padding-top: 20px;

    h4 {
      font-size: $font-size-2;
    }
  }

  &__list {
    .experience:not(:last-child) {
      border-bottom: 1px solid $color-light-grey;
    }
  }

  &__noList {
    // margin: $spacing-2 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10vb;
    &--text {
      font-family: $main-font;
    }
  }
}

@media (min-width: 900px) and (max-width: 1220px) {
  .experiences {
    padding: 0 20px 20px;
  }
}

@media (max-width: 900px) {
  .experiences {
    border: none;
  }
}
</style>
