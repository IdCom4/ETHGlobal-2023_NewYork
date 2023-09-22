<template>
  <div class="singleStudy">
    <div class="singleStudy__title">
      <!-- TITLE -->
      <div class="singleStudy__title">
        <fa icon="fa-solid fa-graduation-cap" style="margin-right: 10px;" :height="40" :width="40" />
        <h4 class="singleStudy__title--text">Formation</h4>
      </div>

      <!-- UPDATE BTN -->
      <fa icon="fa-regular fa-pen-to-square" @click="isModalOpen = true" />
    </div>

    <!-- BASE DATA -->
    <div class="singleStudy__informations">
      <h5 class="singleStudy__informations--grade">{{ study.grade }}</h5>
      <h6 class="singleStudy__informations--schoolName">{{ study.schoolName }}</h6>
      <p class="singleStudy__informations--description">{{ study.description }}</p>
    </div>

    <!-- DETAILED DATA -->
    <div class="singleStudy__details">
      <!-- ADDRESS -->
      <div v-if="study.schoolAddress" class="singleStudy__details--info">
        <fa icon="fa-solid fa-location-dot" />
        <p>{{ study.schoolAddress.city }}, {{ study.schoolAddress.zipCode }}</p>
      </div>

      <!-- DATE RANGE -->
      <div class="singleStudy__details--info">
        <fa icon="fa-regular fa-calendar" />
        <p>
          {{ useUtils().dates.formatDateRangeToPrintableString(study.dateRange, 'dd/MM/yyyy HH:mm:ss') }}
        </p>
      </div>
    </div>

    <!-- UPDATE MODAL -->
    <vmc-modal :is-open="isModalOpen" title="Modification de la formation" max-width="800px" @close="isModalOpen = false">
      <study-input :study="study" @cancel="isModalOpen = false" @deleted="update()" @updated="update()" />
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['updated', 'deleted'])
defineProps({ study: { type: Object as PropType<IStudy>, default: null } })

const isModalOpen = ref<boolean>(false)

// function deleteStudy() {
//   isModalOpen.value = false
//   emit('updated')
// }

function update() {
  isModalOpen.value = false
  emit('updated')
}
</script>

<style lang="scss" scoped>
.singleStudy {
  // padding-bottom: $spacing-5;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $spacing-4 $spacing-2 $spacing-3 $spacing-2;
  }

  &__informations {
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
