<template>
  <section class="center-box-presentation">
    <div v-html="subtitle"></div>
    <div v-for="(intro, i) in introduction" :key="`intro-${i}`" class="intro">
      <fa :icon="intro.icon" class="icon" />
      <span>{{ intro.textIntro }}</span>
    </div>
    <nuxt-link :to="buttonLink">
      <button class="btn_call-to-action">RÉSERVEZ VOTRE BOX</button>
    </nuxt-link>
  </section>
</template>

<script setup>
defineProps({
  lineIntro1: {
    type: String,
    default: ''
  },
  lineIntro2: {
    type: String,
    default: ''
  },
  icIntro1: {
    type: String,
    default: ''
  },
  icIntro2: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  introduction: {
    type: Array,
    default: () => []
  },
  buttonLink: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
.center-box-presentation {
  display: inline-flex;
  flex-wrap: wrap;
  font-family: 'Nunito';
  gap: 20px;
  margin: 0 20px;
  :first-child {
    margin: 45px 0;
    p {
      max-width: 750px;
      font: 'Nunito';
      font-weight: 400;
      font-size: clamp(0.8rem, 2vw, 1.1rem);
      margin: 0;
    }
  }
  .intro {
    display: flex;
    align-items: center;
    width: 90%;
    height: 15px;
    margin-bottom: 25px;
    .icon {
      margin-right: 13px;
    }
    span {
      text-align: left;
      font-weight: 500;
      font-size: clamp(0.8rem, 2vw, 1.1rem);
      line-height: 15px;
      color: #0c1533;
    }
  }
  button {
    margin: 10px 0 40px 0;
  }
}
</style>
