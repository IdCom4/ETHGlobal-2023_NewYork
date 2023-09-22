<template>
  <section class="studies">
    <h3 class="studies__title">Formations</h3>

    <!-- ADD NEW STUDY -->
    <div class="studies__addButton">
      <h5 class="studies__addButton--text" @click="isModalOpen = true"><fa icon="fa-solid fa-pencil" /> Ajouter une formation</h5>
    </div>

    <!-- STUDIES LIST -->
    <div v-if="studies.length > 0" class="studies__list">
      <single-professional-study v-for="study in studies" :key="study.id" class="study" :study="study" @deleted="refresh" @updated="refresh" />
    </div>
    <div v-else class="studies__noList">
      <h4>Aucune formation à afficher.</h4>
    </div>
  </section>

  <!-- NEW STUDY MODAL -->
  <vmc-modal :is-open="isModalOpen" title="Création d'une formation" max-width="800px" @close="isModalOpen = false">
    <study-input @cancel="isModalOpen = false" @added="refresh" />
  </vmc-modal>
</template>

<script setup lang="ts">
const studies = ref<IStudy[]>(useSessionStore().getUser()?.professionalProfile?.history.studies || [])
const isModalOpen = ref<boolean>(false)

function refresh() {
  studies.value = useSessionStore().getUser()?.professionalProfile?.history.studies || []
  isModalOpen.value = false
}
</script>

<style lang="scss" scoped>
.studies {
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
    .study:not(:last-child) {
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
  .studies {
    padding: 0 20px 20px;
  }
}

@media (max-width: 900px) {
  .studies {
    border: none;
  }
}
</style>
