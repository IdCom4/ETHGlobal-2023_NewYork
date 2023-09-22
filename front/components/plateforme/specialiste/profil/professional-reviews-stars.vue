<template>
  <section v-if="reviews.length" id="professional-profile-review">
    <p class="rating-stars">
      <span class="stars">
        <fa v-for="star in 5" :key="star" :icon="getStarIcon(star, averageRating)" :class="props.colorBlack ? 'black' : ''" />
      </span>
      <span v-if="reviewCount !== 1" class="averageRating">{{ averageRating }}</span>
      <span v-if="reviewCount !== 1" class="reviewCount">({{ reviewCount }} avis)</span>
    </p>
  </section>
</template>

<script lang="ts" setup>
/* <=========== Variable declarations */
const props = defineProps({
  reviews: {
    type: Array<IReview>,
    default: () => [],
    required: true
  },
  colorBlack: {
    type: Boolean,
    default: false
  }
})

const averageRating = ref(0)
const reviewCount = ref(0)
const halfStarThreshold = ref(0.49)

const calculateAverageRating = () => {
  const totalRating = props.reviews.reduce((sum, review) => sum + review._rating, 0)
  averageRating.value = totalRating / props.reviews.length
  reviewCount.value = props.reviews.length
}

watchEffect(() => {
  calculateAverageRating()
})
/* >=========== calcultate average rating */

/* <=========== display number of stars */
const getStarIcon = (star: number, averageRating: number) => {
  if (star <= Math.floor(averageRating)) {
    return ['fas', 'star'] // Étoile remplie
  } else if (star <= Math.ceil(averageRating - halfStarThreshold.value)) {
    return ['fas', 'star-half-stroke'] // Étoile à moitié remplie
  } else {
    return ['far', 'star'] // Étoile vide
  }
}
/* >=========== display number of stars */
</script>

<style lang="scss" scoped>
section {
  padding: 0 20px;
}
.fa {
  color: $color-neon-blue;
}
.rating-stars {
  display: flex;
  gap: $spacing-1;
  align-items: center;
}
.averageRating {
  white-space: nowrap;
  font-size: $font-size-2;
  color: $white;
}

.reviewCount {
  white-space: nowrap;
  font-size: $font-size-3;
  color: $white;
}
span.stars {
  min-width: 100px;
}

.black {
  color: $black;
}
</style>
