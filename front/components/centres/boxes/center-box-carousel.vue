<template>
  <div ref="carouselElement" class="carousel" :style="`--carousel-width: ${carouselWidth}px`">
    <div class="carousel__images" :style="`--offset-index: ${currentImageIndex}; --image-quantity: ${slidesCount}`">
      <img
        v-for="(picture, i) in carouselPictures"
        :key="i"
        :class="{ activeImg: i === currentImageIndex, inactiveImg: i !== currentImageIndex }"
        :src="picture"
        loading="lazy"
        :alt="`image caroussel ${i + 1}`"
      />
    </div>
    <div class="carousel__pagination">
      <button
        v-for="(n, i) in carouselPictures.length"
        :key="`btn-${i}`"
        :class="{ activeBtn: i === currentImageIndex }"
        class="btn-page"
        @click="goToImage(i)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  carouselPictures: {
    type: Array as () => string[],
    default: () => [],
    required: true
  }
})

const carouselElement = ref<HTMLElement>()
const carouselWidth = ref<number>(carouselElement.value?.offsetWidth || 0)
const currentImageIndex = ref(0)
let carouselInterval: NodeJS.Timeout | null

/* CAROUSEL IMAGE QUANTITY */
const slidesCount = computed(() => {
  return props.carouselPictures.length
})

/* CAROUSEL STATE CONTROL */
const startCarousel = () => {
  carouselInterval = setInterval(nextImage, 5000)
}
const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

/* CAROUSEL CURRENT IMAGE CONTROL */
const nextImage = () => {
  currentImageIndex.value = currentImageIndex.value === slidesCount.value - 1 ? 0 : currentImageIndex.value + 1
}
const goToImage = (index: number) => {
  currentImageIndex.value = index
  stopCarousel()
}

/* GET CAROUSEL WIDTH + RESPONSIVE UPDATE */
watch(carouselElement, () => {
  if (carouselElement.value) new ResizeObserver(() => (carouselWidth.value = carouselElement.value?.offsetWidth ?? 0)).observe(carouselElement.value)
})

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style lang="scss">
.carousel {
  position: relative;
  overflow: hidden;
  height: 80vh;

  &__images {
    width: calc(100% * var(--image-quantity));
    display: flex;
    position: relative;
    transform: translateX(calc(var(--carousel-width) * var(--offset-index) * -1));
    transition: ease-in-out 0.5s;

    img {
      width: calc(100% / var(--image-quantity));
      height: 80vh;
      object-fit: cover;
    }
  }

  &__pagination {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    .btn-page {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      background-color: #fff;
      border-radius: 10px;
      &.activeBtn {
        background-color: $color-neon-blue;
      }
    }
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-100%);
  }
}
</style>
