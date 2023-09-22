<template>
  <div id="center-mobile-navbar">
    <div class="navbar-center-bottom">
      <NuxtLink to="/" data-state="dark" class="redirect-link item">
        ValueMyCar
      </NuxtLink>
      <a href="tel:0033161391664" class="item">
        <button class="btn_call-to-action">
          <span>
            RÉSERVEZ AU
          </span>
          <span>
            01 61 39 16 64
          </span>
        </button>
      </a>
      <NuxtLink :to="bookLink" class="item">
        <button class="btn_call-to-action">RÉSERVEZ EN LIGNE</button>
      </NuxtLink>
    </div>
    <div class="viewport"></div>
  </div>
</template>

<script setup>
defineProps({
  bookLink: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
.navbar-center-bottom {
  display: none;
}

@media screen and (max-width: 700px) {
  .navbar-center-bottom {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: 0;
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
    .item {
      flex: 1 1 0;
      margin: 0 5px;
      .btn_call-to-action {
        width: 100%;
        min-width: 100px;
        font-size: clamp(0.5rem, 0.7em, 2vw);
        padding: 0;
        height: 30px;
        span {
          display: block;
        }
      }
    }
  }
  .viewport {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 58px;
  }
}
</style>
