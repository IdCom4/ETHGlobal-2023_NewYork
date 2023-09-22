<template>
  <div class="title" :style="{ color: props.textColor }">
    <div class="container">
      <h2 :class="{ center: center }" :style="{ color: props.textColor }">{{ text }}</h2>
      <div class="horizontal-separator" :class="{ center: center }">
        <div v-if="triple" :style="{ backgroundColor: props.barColor }" class="thin"></div>
        <div :style="{ backgroundColor: props.barColor }" class="bold"></div>
        <div :style="{ backgroundColor: props.barColor }" class="thin"></div>
      </div>
      <p>{{ subtext }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: { type: String, default: '' },
  subtext: { type: String, default: '' },
  triple: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
  textColor: { type: String, default: 'black' },
  barColor: { type: String, default: 'black' },
  titleColor: { type: String, default: 'black' }
})
</script>

<style lang="scss" scoped>
.title {
  display: inline-block;
  .container {
    display: inline-block;
    h2 {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 800;
      font-size: 28px;
      line-height: 34px;
      text-align: left;
      color: #000;
      justify-content: flex-start;
      white-space: pre-wrap;
      &.center {
        text-align: center;
      }
    }
    h2::after {
      display: none;
    }
    p {
      font-family: 'Nunito';
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 27px;
    }
  }

  .horizontal-separator {
    width: 75%;
    margin: 20px 0 20px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    &.center {
      margin: 20px auto;
    }
    .bold {
      height: 3px;
      width: 33%;
      background-color: black;
      &.blue {
        background-color: $color-neon-blue;
      }
      &.white {
        background-color: $color-offwhite;
      }
    }
    .thin {
      height: 1px;
      width: 66%;
      background-color: black;
      &.blue {
        background-color: $color-neon-blue;
      }
      &.white {
        background-color: $color-offwhite;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .title {
    .container {
      h2 {
        font-size: 20px;
      }
      p {
        font-size: 12px;
        line-height: 16px;
      }
    }
  }
}
</style>
