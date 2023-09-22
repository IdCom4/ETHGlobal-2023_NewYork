<template>
  <div class="singleReview">
    <div class="information">
      <div class="information__details">
        <div class="information__details--name">{{ props.review._userName }}</div>
        <div class="information__details--date">{{ shortDate }}</div>
      </div>
      <div class="information__review"><professional-reviews-stars :reviews="[props.review]" color-black /></div>
    </div>
    <div class="commentary">{{ props.review._message }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  review: {
    type: Object as PropType<IReview>,
    required: true
  }
})

const startFormatted = useUtils().dates.getDateFromStr(props.review._date, 'dd/MM/yyyy HH:mm')
const shortDate = startFormatted?.toLocaleString('default', { month: 'short', year: 'numeric' }) || 'Date invalide'
</script>

<style lang="scss" scoped>
.singleReview {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  font-family: $main-font;

  .information {
    color: $black;
    display: flex;
    justify-content: space-between;
    &__details {
      &--name {
        font-weight: $font-weight-4;
        font-size: $font-size-3;
      }
      &--date {
        font-weight: $font-weight-1;
        font-size: $font-size-1;
      }
    }
  }

  .commentary {
    font-weight: $font-weight-1;
    font-size: $font-size-2;
  }
}
</style>
