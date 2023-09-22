<template>
  <div class="singleExperience">
    <div class="singleExperience__title">
      <!-- <div class="singleExperience__title">
        <Fa icon="fa-solid fa-graduation-cap" style="margin-right: 10px;" :height="40" :width="40" />
        <h4 class="singleExperience__title--text">
          Experience
        </h4>
      </div> -->
      <h5 class="singleExperience__informations--grade">{{ experience.enterprise }}</h5>

      <Fa icon="fa-regular fa-pen-to-square" @click="changeExperience()" />
    </div>
    <div class="singleExperience__informations">
      <h6 class="singleExperience__informations--schoolName">{{ experience.role }}</h6>
      <p class="singleExperience__informations--description">{{ experience.description }}</p>
    </div>
    <div class="singleExperience__details">
      <div class="singleExperience__details--info">
        <Fa icon="fa-regular fa-calendar" />
        <p>
          {{
            experience.dateRange.end === "Aujourd'hui"
              ? useUtils().dates.formatStrDateRangeToPrintableString(
                  `${experience.dateRange.begin}`,
                  `${experience.dateRange.end}`,
                  'dd/MM/yyyy HH:mm:00',
                  true
                ) + "Aujourd'hui"
              : useUtils().dates.formatStrDateRangeToPrintableString(
                  `${experience.dateRange.begin}`,
                  `${experience.dateRange.end}`,
                  'dd/MM/yyyy HH:mm:00',
                  false
                )
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  experience: { type: Object as PropType<IStudy>, default: null }
})

const emit = defineEmits(['changedClick'])

const currentExperience = ref<IStudy>(useUtils().objects.clone(props.experience) as IStudy)

async function changeExperience() {
  emit('changedClick', currentExperience.value)
}
</script>

<style lang="scss" scoped>
.singleExperience {
  border-bottom: 1px solid $color-light-grey;
  padding-bottom: $spacing-5;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $spacing-4 0 $spacing-3 0;
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
