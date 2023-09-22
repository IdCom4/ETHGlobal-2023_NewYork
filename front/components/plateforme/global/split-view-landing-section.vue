<template>
  <div class="split-view-landing">
    <div ref="reverseEl" class="split-view-landing__wrapper" :class="props.reverse && 'reverse'">
      <!-- ONLY MOBILE -->
      <vmc-header
        v-if="props.vmcHeaderValue"
        :text="props.vmcHeaderValue.text"
        is-bold
        :subtext="props.vmcHeaderValue.subtext"
        class="header-mobile"
      />

      <nuxt-img class="split-view-landing__wrapper--img" :src="props.image" />
      <div class="split-view-landing__wrapper--content">
        <!-- ONLY DESKTOP -->
        <vmc-header
          v-if="props.vmcHeaderValue"
          class="header-desktop"
          :text="props.vmcHeaderValue.text"
          is-bold
          :subtext="props.vmcHeaderValue.subtext"
        />
        <slot v-if="top"></slot>

        <ul v-if="props.pointList" class="point-list">
          <li v-for="(point, index) in props.pointList" :key="index">
            <fa :icon="point.icon" />
            <span>{{ point.describe }}</span>
          </li>
        </ul>
        <div class="btn">
          <nuxt-link v-if="props.buttonLink" :to="props.buttonLink">
            <button class="btn_call-to-action">{{ props.buttonValue }}</button>
          </nuxt-link>
        </div>
        <slot v-if="!top"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type IPointList = {
  icon: string[]
  describe: string
}

const props = defineProps({
  reverse: {
    type: Boolean,
    default: false
  },
  top: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/JPEG/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+exterieur.jpeg'
  },
  pointList: {
    type: Array as () => IPointList[],
    default: () => []
  },
  buttonValue: {
    type: String,
    default: ''
  },
  buttonLink: {
    type: String,
    default: ''
  },
  vmcHeaderValue: {
    type: Object,
    default: null
  }
})
const reverseEl = ref<HTMLElement | null>(null)

const removeClassOnScreenSize = () => {
  if (props.reverse) {
    if (window.innerWidth < 750) {
      if (reverseEl.value && reverseEl.value.classList.contains('reverse')) reverseEl.value.classList.remove('reverse')
    } else {
      if (reverseEl.value && !reverseEl.value.classList.contains('reverse')) reverseEl.value.classList.add('reverse')
    }
  }
}

onMounted(() => {
  removeClassOnScreenSize()
  window.addEventListener('resize', removeClassOnScreenSize)
})
</script>

<style lang="scss" scoped>
.split-view-landing {
  padding: 70px 0;
  width: 100%;
  max-height: 80vh;
  margin: auto;
  margin-bottom: 120px;
  &__wrapper {
    display: flex;
    .header-mobile {
      display: none;
    }
    .header-desktop {
      display: block;
      padding-right: 90px;
    }
    &--img {
      width: 50vw;
      height: 80vh;
      object-fit: cover;
      box-shadow: -25px 15px 25px $shadow-landing;
    }
    &--content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 5vh;
      width: fit-content;
      max-width: 50vw;
      margin: auto;
      padding: 0 20px 0 7%;
      .point-list {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        li {
          display: flex;
          align-items: center;
          gap: 10px;
          span {
            font-size: 18px;
            font-weight: 400;
          }
        }
      }
    }
  }
  .reverse {
    flex-direction: row-reverse;
    .split-view-landing__wrapper--content {
      width: fit-content;
      margin: auto;
      padding: 0 70px 0 7%;
    }
    .split-view-landing__wrapper--img {
      box-shadow: 25px 15px 25px $shadow-landing;
    }
  }
}

@media screen and (max-width: 1130px) and (max-height: 590px) {
  .split-view-landing__wrapper--content {
    .point-list {
      gap: 10px;
      li {
        span {
          font-size: 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .split-view-landing {
    padding: 0;
    height: auto;
    max-height: none;
    margin-bottom: 0;

    &__wrapper {
      flex-direction: column;

      .header-desktop {
        display: none;
      }
      .header-mobile {
        display: block;
        padding: 0 25px;
        margin-bottom: 25px;
        margin-top: 50px;
      }

      &--img {
        width: 100%;
        height: 200px;
        min-height: 25vh;
        margin-bottom: 10px;
      }

      &--content {
        max-width: 100%;
        padding: 20px;
        margin: 0;
        .btn {
          display: flex;
          justify-content: center;
          width: 90vw;
        }
      }
    }
  }
}

@media screen and (max-height: 550px) {
  .split-view-landing__wrapper--content {
    gap: 5vh;
  }
}
</style>
