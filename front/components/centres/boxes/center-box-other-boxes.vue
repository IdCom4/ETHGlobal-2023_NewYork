<template>
  <section class="center-box-other-boxes">
    <h4 v-if="large">Nos autres boxes</h4>
    <h6 v-else>Nos autres boxes</h6>
    <hr v-if="!large" />
    <div v-for="(box, i) in otherBoxes" :key="`box-${i}`" :class="[large ? 'large-other-boxes' : 'small-other-boxes']">
      <NuxtLink :to="box.viewMoreLink" class="link" :title="`Découvrez nos ${box.title}`">
        <fa v-if="!large" icon="fa-solid fa-warehouse" class="icon" />
        <strong>{{ box.title }}</strong>
        <div class="img-box">
          <img v-if="large" :src="box.bannerImage" :alt="`photo ${box.title}`" />
        </div>
        <span v-if="!large">Voir plus &nbsp; +</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
defineProps({
  large: {
    type: Boolean,
    default: false
  },
  firstBoxlink: {
    type: String,
    default: ''
  },
  secondBoxlink: {
    type: String,
    default: ''
  },
  firstBoxname: {
    type: String,
    default: ''
  },
  secondBoxname: {
    type: String,
    default: ''
  },
  firstBoximg: {
    type: String,
    default: ''
  },
  secondBoximg: {
    type: String,
    default: ''
  },
  otherBoxes: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss">
.center-box-other-boxes {
  width: 90%;
  max-width: 800px;
  margin: 0 20px;
  h6 {
    font-family: 'Nunito';
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 11px;
  }
  hr {
    width: 90px;
    border: solid 1px #000;
    margin-left: 0;
    margin-bottom: 20px;
  }
  .small-other-boxes {
    .link {
      display: flex;
      align-items: center;
      margin: 17px 0;
      text-decoration: none;
      font-family: 'Nunito';
      color: #000;
      cursor: pointer;
      .icon {
        margin-right: 10px;
      }
      strong {
        width: 100%;
        font-size: 14px;
        font-weight: 700;
      }
      span {
        white-space: nowrap;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
  .large-other-boxes {
    display: flex;
    flex-direction: column;
    gap: 25px;
    text-align: center;
    .link {
      font-family: 'Montserrat';
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      color: #000;
      strong {
        display: block;
        margin: 15px auto;
      }
      .img-box {
        width: 100%;
        height: 200px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.3s;
          &:hover {
            transform: scale(1.05);
          }
        }
      }
    }
  }
}
</style>
