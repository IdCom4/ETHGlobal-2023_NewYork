<template>
  <div class="singleExperience">
    <div class="singleExperience__title">
      <!-- TITLE -->
      <!-- <div class="singleExperience__title">
        <fa icon="fa-solid fa-graduation-cap" style="margin-right: 10px;" :height="40" :width="40" />
        <h4 class="singleExperience__title--text">Formation</h4>
      </div> -->

      <!-- UPDATE BTN -->
    </div>

    <!-- BASE DATA -->
    <div class="singleExperience__informations">
      <div class="singleExperience__informations--title">
        <h5 class="singleExperience__informations--grade">{{ experience.enterprise }}</h5>
        <fa icon="fa-regular fa-pen-to-square" @click="isModalOpen = true" />
      </div>

      <h6 class="singleExperience__informations--schoolName">{{ experience.role }}</h6>
      <!-- <p class="singleExperience__informations--description">{{ experience.description }}</p> -->
    </div>

    <!-- DETAILED DATA -->
    <div class="singleExperience__details">
      <!-- DATE RANGE -->
      <div class="singleExperience__details--info">
        <fa icon="fa-regular fa-calendar" />
        <p>
          {{ useUtils().dates.formatDateRangeToPrintableString(experience.dateRange, 'dd/MM/yyyy HH:mm:ss') }}
        </p>
      </div>
    </div>

    <!-- UPDATE MODAL -->
    <vmc-modal :is-open="isModalOpen" title="Modification de l'expérience" max-width="800px" @close="isModalOpen = false">
      <experience-input :experience="experience" @cancel="isModalOpen = false" @deleted="update()" @updated="update()" />
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['updated', 'deleted'])
defineProps({ experience: { type: Object as PropType<IProfessionalExperience>, default: null } })

const isModalOpen = ref<boolean>(false)

function update() {
  isModalOpen.value = false
  emit('updated')
}
</script>

<style lang="scss" scoped>
.singleExperience {
  // padding-bottom: $spacing-5;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $spacing-4 $spacing-2 $spacing-3 $spacing-2;
  }

  &__informations {
    &--title {
      display: flex;
      justify-content: space-between;
    }
    &--grade {
      font-size: $font-size-3;
      font-weight: $font-weight-4;
    }

    &--schoolName {
      font-family: $main-font;
      margin: $spacing-2 0;
    }

    &--description {
      margin: $spacing-3 0;
    }
  }

  &__details {
    display: flex;
    gap: $spacing-5;

    &--info {
      display: flex;
      align-items: center;
      gap: $spacing-2;
    }
  }
}

.fa-pen-to-square {
  cursor: pointer;
}
</style>
