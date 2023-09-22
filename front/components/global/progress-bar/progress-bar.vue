<template>
  <div class="progressBar">
    <div class="progressBar__completion" :style="{ width: percentCompletion + '%' }">
      <span class="progressBar__completion--text">État du profil {{ percentCompletion }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0
  }
})

const percentCompletion = ref<number>(0)

/* <=========== calculates and updates the percent completion */
const calculatePercentCompletion = () => {
  percentCompletion.value = Math.floor(props.value)
}

watchEffect(() => {
  calculatePercentCompletion()
})
/* >=========== calculates and updates the percent completion */
</script>

<style lang="scss" scoped>
.progressBar {
  width: 100%;
  height: 20px;
  background-color: $white;
  text-align: center;
  position: relative;
  border: $color-neon-blue 1px solid;

  &__completion {
    height: 100%;
    background-color: $color-neon-blue;
    transition: width 0.3s ease-in-out;
    align-self: end;
    order: 1;
    font-family: $main-font;
    padding: $spacing-1;

    &--text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: $font-weight-4;
      font-size: $font-size-2;
    }
  }
}

@media (min-width: 950px) {
  .progressBar {
    border: transparent;
  }
}
</style>
