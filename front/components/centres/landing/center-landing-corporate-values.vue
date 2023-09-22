<template>
  <section class="sec-values">
    <div v-for="(value, i) in corporateValues" :key="`value-${i}`" class="value">
      <h5>{{ value.value }}</h5>
      <hr />
      <img class="imgValues" :src="value.image" :alt="`valeur d'entreprise ${value.value}`" />
      <p class="left">{{ value.describe }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  // value: {
  //   type: String,
  //   default: ''
  // },
  imgUrl: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  firstPara: {
    type: String,
    default: ''
  },
  secondPara: {
    type: String,
    default: ''
  },
  corporateValues: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss">
.value {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-bottom: 50px;
  // animation: appear 1s;
  .imgValues {
    width: 100%;
    height: 130px;
    object-fit: cover;
  }
  h5 {
    font-size: 15px;
  }
  hr {
    border: solid 1px #000;
    margin-left: 0;
    width: 31px;
  }
  .left {
    text-align: left;
  }
}

// @keyframes appear {
//   from {
//     transform: translate(-360px);
//   }
//   to {
//     transform: translate(0);
//   }
// }
</style>
