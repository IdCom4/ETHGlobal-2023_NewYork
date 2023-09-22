<template>
  <div class="bottombar-center">
    <NuxtLink to="/" class="redirect-link item">
      <h1 data-state="dark"></h1>
    </NuxtLink>
    <a href="tel:0033161391664" class="item">
      <button class="btn_call-to-action">
        RÉSERVEZ AU
        <br />
        01 61 39 16 64
      </button>
    </a>
    <NuxtLink v-if="!isOnServicesRoutes" :to="bookLink" class="item">
      <button class="btn_call-to-action">RÉSERVEZ EN LIGNE</button>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  bookLink: {
    type: String,
    default: '/centres/reservation/WASHBOX'
  }
})

const isOnServicesRoutes = ref(useRoute().fullPath.includes('service'))

watch(
  () => useRoute().fullPath,
  () => (isOnServicesRoutes.value = useRoute().fullPath.includes('service'))
)
</script>

<style lang="scss">
.bottombar-center {
  display: none;
}

@media screen and (max-width: 700px) {
  .bottombar-center {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 59px;
    padding: 0 10px;
    background-color: $color-dark-blue;
    box-shadow: 0 -3px 30px #000000;
    z-index: 99;
    .redirect-link {
      max-width: 100px;
      min-width: 65px;
    }

    h1 {
      width: 100%;
    }

    .item {
      flex: 1 1 0;
      margin: 0 5px;
      color: #000;
      .btn_call-to-action {
        width: 100%;
        min-width: 100px;
        height: 30px;
        padding: 0;
        font-size: clamp(0.6rem, 0.7em, 2vw);
      }
    }
  }
}
</style>
