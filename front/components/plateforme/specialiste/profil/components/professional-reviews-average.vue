<template>
  <section id="professional-profile-review">
    <p v-if="!props.user.professionalProfile?.clientReviews" class="rating-stars">
      <span class="stars">
        <Fa v-for="star in 5" :key="star" :icon="getStarIcon(star, averageRating)" />
      </span>
      <span class="averageRating">{{ averageRating }}</span>
      <span class="reviewCount">({{ reviewCount }} avis)</span>
    </p>
  </section>
</template>

<script lang="ts" setup>
/* <=========== Variable declarations */
const props = defineProps({
  user: {
    type: Object as () => IUser,
    default: null,
    required: true
  }
})

const averageRating = ref<number>(0)
const halfStarThreshold = ref<number>(0.49)
const reviewCount = ref<number>(0)
/* >=========== Variable declarations */

/* <=========== calcultate average rating */
const calculateAverageRating = () => {
  if (props.user.professionalProfile && props.user.professionalProfile.clientReviews) {
    const reviews = props.user.professionalProfile.clientReviews
    const totalRating = reviews.reduce((sum, review) => sum + review._rating, 0)
    averageRating.value = totalRating / reviews.length
  }
}

calculateAverageRating()
reviewCount.value = props.user.professionalProfile?.clientReviews.length || 0
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
  font-size: $font-size-2;
  color: $white;
}

.reviewCount {
  font-size: $font-size-3;
  color: $white;
}
span.stars {
  min-width: 100px;
}
</style>
