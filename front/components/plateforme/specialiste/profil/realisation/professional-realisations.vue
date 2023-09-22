<template>
  <section class="realisations">
    <h3 class="realisations__title">realisations</h3>

    <!-- ADD NEW REALISATION -->
    <div class="realisations__addButton">
      <h5 class="realisations__addButton--text" @click="openCreateNewRealisation = true"><fa icon="fa-solid fa-pencil" />Ajouter une réalisation</h5>
    </div>
    <vmc-modal title="Création d'une réalisation" :is-open="openCreateNewRealisation" max-width="800px" @close="openCreateNewRealisation = false">
      <realisation-input @added="closeAndRefreshRealisations" @updated="closeAndRefreshRealisations" @cancel="openCreateNewRealisation = false" />
    </vmc-modal>

    <!-- REALISATIONS LIST -->
    <div v-if="realisations.length > 0" class="realisations__list">
      <professional-realisation
        v-for="realisation in realisations"
        :key="`realisation-section-${realisation.id}`"
        class="realisation"
        :realisation="realisation"
        @updated="refreshRealisations"
        @deleted="refreshRealisations"
      />
    </div>
    <div v-else class="realisations__noList">
      <h4 class="realisations__noList--text">Aucune réalisation à afficher</h4>
    </div>
  </section>
</template>

<script setup lang="ts">
const realisations = ref<IRealisation[]>([])
const openCreateNewRealisation = ref<boolean>(false)

function refreshRealisations() {
  realisations.value = useSessionStore().user?.professionalProfile?.history.realisations || []
}

function closeAndRefreshRealisations() {
  openCreateNewRealisation.value = false
  refreshRealisations()
}

refreshRealisations()
</script>

<style scoped lang="scss">
.realisations {
  border: solid 1px $color-grey;
  padding: 20px;
  max-width: 900px;

  &__addButton {
    padding-top: 20px;
    cursor: pointer;
    h4 {
      font-size: $font-size-2;
    }
  }

  &__noList {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10vb;
    &--text {
      font-family: $main-font;
    }
  }

  .realisations__list {
    // margin: 20px 0;
    .realisation:not(:last-child) {
      border-bottom: 1px solid $color-light-grey;
    }
  }
}

@media (min-width: 900px) and (max-width: 1220px) {
  .realisations {
    padding: 0 20px 20px;
  }
}

@media (max-width: 900px) {
  .realisations {
    border: none;
  }
}
</style>
