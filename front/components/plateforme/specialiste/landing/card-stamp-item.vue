<template>
  <div class="card-stamp-item">
    <div class="card-stamp-item__text">
      <span>{{ title }}</span>
      <span>{{ text }}</span>
    </div>
    <div class="card-stamp-item__skeletons-wrapper">
      <img :src="img" alt="image véhicule" />
      <div class="card-stamp-item__skeletons-wrapper--skeletons">
        <div class="skeleton-text top"></div>
        <div class="skeleton-text center"></div>
        <div class="skeleton-text bottom"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
  img: { type: String, default: '' }
})
</script>

<style scoped lang="scss">
.card-stamp-item {
  &__text {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    :first-child {
      font-family: 'Montserrat';
      font-weight: 700;
    }
  }
  &__skeletons-wrapper {
    display: flex;
    gap: 10px;
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
    }
    &--skeletons {
      width: 100%;
      .skeleton-text {
        height: 12px;
        background-color: #dadada;
        margin-bottom: 7px;
        &.top {
          width: 60%;
        }
        &.center {
          width: 90%;
        }
        &.bottom {
          width: 75%;
        }
      }
    }
  }
}
</style>
