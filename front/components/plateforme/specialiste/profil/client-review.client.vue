<template>
  <section v-if="clientReview" class="client-review">
    <div class="review-header-mobile">
      <div class="review-header">
        <p class="name">
          {{ clientReview.userName }}
        </p>
        <div class="stars">
          <fa
            v-for="n in 5"
            :key="`reviewStar-${n}`"
            :class="{ full: n <= clientReview.rating }"
            :icon="`fa-${n <= clientReview.rating ? 'solid' : 'regular'} fa-star`"
          />
        </div>
      </div>
      <p class="date">{{ reviewDate }}</p>
    </div>
    <p id="review-message">{{ clientReview.message }}</p>
  </section>
</template>

<script lang="ts" setup>
import { MONTHS } from '@/types/constants/time.d'

const props = defineProps({ clientReview: { type: Object as PropType<IReview>, default: null } })
const clientReview = reactive<IReview>(props.clientReview)

const month = MONTHS[parseInt(clientReview.date.split('/')[1]) - 1].SHORT
const year = clientReview.date.slice(6, 10)

const reviewDate = computed(() => month + ' ' + year)
</script>

<style lang="scss" scoped>
.client-review {
  margin-bottom: 35px;
  .review-header {
    display: flex;
    justify-content: space-between;
    .name {
      font-size: 14px;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .stars {
      display: flex;
      justify-content: space-between;
      width: 60px;
      font-size: 10px;
    }
  }
  .date {
    font-size: 10px;
    margin-bottom: 16px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
  }
}
@media screen and (max-width: 400px) {
  .review-header-mobile {
    display: flex;
    justify-content: space-between;
    .review-header {
      .name {
        margin-right: 10px;
        margin-bottom: 16px;
      }
    }
  }
}
</style>
