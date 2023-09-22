<template>
  <div>
    <h1 hidden>{{ mainTitle }}</h1>
    <main>
      <img class="banner-image" :src="bannerImage" :alt="altBannerImage" loading="lazy" />
      <div class="content-section">
        <div class="blocPage">
          <div class="title">
            <h2>{{ titlePage }}</h2>
            <div class="network">
              <a href="https://www.facebook.com/ValueMyCar.fr" title="Suivez-nous sur Facebook">
                <fa icon="fa-brands fa-square-facebook" class="icon" />
              </a>
              <a href="https://www.youtube.com/@valuemycar2404" title="Suivez-nous sur Youtube">
                <fa icon="fa-brands fa-square-youtube" class="icon" />
              </a>
              <!-- Adding social share -->
              <!-- <a href="" title="Partagez sur les réseaux">
                <fa icon="fa-solid fa-square-share-nodes" class="icon" />
              </a> -->
            </div>
          </div>
          <center-box-presentation :introduction="introduction" :subtitle="subtitle" :button-link="'/centres/reservation/' + category" />
          <center-box-other-boxes :other-boxes="otherBoxes" />
        </div>
        <div v-for="(value, index) in corporateValues" :key="index">
          <sec-split-view
            :title="value.value"
            :picture="value.image"
            :alt="value.alt"
            :description="value.describe"
            :boxes="boxes"
            :button-link="'/centres/reservation/' + category"
            :first-section-style="true"
            button-value="RÉSERVEZ VOTRE BOX"
          />
        </div>

        <!-- tarifs -->
        <center-box-prices v-if="center" :center-id="center._id" :box-category="BoxCategories.MECABOX" />
      </div>

      <!-- carousel -->
      <center-box-carousel :carousel-pictures="carouselPictures" />

      <!-- tools -->
      <center-box-tools :tools="tools" />
      <hr class="section-separator" />

      <!-- operations -->
      <center-box-possible-operations :topics="topics" :box="url_box" />
      <hr class="section-separator" />

      <!-- client reviews -->
      <center-client-reviews :reviews="reviews" />

      <!-- other boxes -->
      <div v-for="(otherBox, index) in otherBoxes" :key="index">
        <sec-split-view
          :title="otherBox.title"
          :picture="otherBox.bannerImage"
          :description="otherBox.describe"
          :boxes="otherBox.boxes"
          :button-link="'/centres/boxes/' + otherBox.viewMoreLink"
          :view-more-link="'/centres/boxes/' + otherBox.viewMoreLink"
          :second-section-style="true"
          button-value="VOIR CE BOX"
        />
      </div>
    </main>
    <center-mobile-navbar :book-link="'/centres/reservation/' + category" />
  </div>
</template>

<script setup lang="ts">
import { TOPICS } from '@/constants/centres/articles'
import { BOXES } from '@/constants/centres/box-content'
import { BoxCategories } from '@/constants/constants'
import { GlobalEventTypes } from '@/types/constants/stores/global-events.d'

const center = ref<ICenter>()

async function getCenter() {
  const { data, error } = await useAPI().centers.getCenters()
  if (!data || error) return

  center.value = data[0]
}

onBeforeMount(getCenter)

type OTHER_BOX = {
  title: string
  viewMoreLink: string
  buttonLink: string
  bannerImage: string
  describe: string
  boxes: string[]
}

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_NAVBAR_THEME, 'dark')
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'light')
})

let url_box: string,
  // name: string,
  // meta_description: string,
  category: string,
  mainTitle: string,
  bannerImage: string,
  altBannerImage: string,
  titlePage: string,
  introduction: INTRO_LINE[],
  boxes: string[],
  subtitle: string,
  corporateValues: CorporateValues[],
  tools: string[],
  carouselPictures: string[],
  reviews: ReviewerBoxCenter[],
  topics: BlogTopics[]

const otherBoxes: OTHER_BOX[] = []

const getCurrentBoxTopics = (
  currentBox: BOX_CONTENT,
  currentTopics: BlogTopics[],
  firstAffiliateBox: BOX_CONTENT,
  secondAffiliateBox: BOX_CONTENT
) => {
  /* CURRENT TOPICS */
  topics = currentTopics

  /* CURRENT BOX */
  url_box = currentBox.url_box
  // name = currentBox.name
  // meta_description = currentBox.meta_description
  category = currentBox.category
  mainTitle = currentBox.mainTitle
  bannerImage = currentBox.bannerImage
  altBannerImage = currentBox.altBannerImage
  titlePage = currentBox.titlePage
  boxes = currentBox.boxes
  subtitle = currentBox.subtitle
  introduction = currentBox.introduction
  corporateValues = currentBox.corporateValues
  tools = currentBox.tools
  carouselPictures = currentBox.carouselPictures
  reviews = currentBox.reviews

  /* META DESCRIPTION */
  // definePageMeta({
  //   description: meta_description
  // })
  // useHead({
  //   meta: [{ name: 'description', content: meta_description }]
  // })
  // useSeoMeta({
  //   description: meta_description
  // })

  /* OTHERS BOXES */
  const firstOtherBox = {
    title: firstAffiliateBox.titlePage,
    viewMoreLink: firstAffiliateBox.url_box,
    buttonLink: firstAffiliateBox.url_box,
    bannerImage: firstAffiliateBox.bannerImage,
    boxes: firstAffiliateBox.boxes,
    describe: firstAffiliateBox.subtitle
  }
  const secondOtherBox = {
    title: secondAffiliateBox.titlePage,
    viewMoreLink: secondAffiliateBox.url_box,
    buttonLink: secondAffiliateBox.url_box,
    bannerImage: secondAffiliateBox.bannerImage,
    boxes: secondAffiliateBox.boxes,
    describe: secondAffiliateBox.subtitle
  }
  otherBoxes.push(firstOtherBox, secondOtherBox)
}

/* LOAD BOX DATA */
getCurrentBoxTopics(BOXES.MECANIC_BOX, TOPICS.MECANIC, BOXES.WASHING_BOX, BOXES.DETAILING_BOX)
</script>

<style lang="scss">
.banner-image {
  width: 100%;
  height: 80vh;
  object-fit: cover;
}

.section-separator {
  margin: 0px 20px;
  display: none;

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 25%;
    transform: translate(0, -75%);
    border: solid 1px black;
  }
}

.content-section {
  display: flex;
  flex-direction: column;

  .blocPage {
    padding: 100px clamp(20px, 25vw, 200px);
    .title {
      display: flex;
      padding: 0 20px;
      h2 {
        width: 100%;
        font-size: 16px;
      }
      .network {
        display: flex;
        justify-content: space-between;
        width: clamp(100px, 15%, 20px);
        margin-left: 30px;
        a {
          color: #000;
        }
      }
    }
  }
  .mapboxgl-map {
    width: 100%;
    height: 300px;
  }
  .centre {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: #0c1533;
    line-height: 14px;
  }
  .hr {
    display: flex;
    &--black {
      border: solid 1px #000;
      margin-left: 0;
      width: 70px;
    }
    &--grey {
      border: solid 1px #dcdcdc;
      width: 100%;
    }
  }
  .middle-hr {
    border: solid 1px #000;
    width: 25%;
  }
}

@media screen and (max-width: 1000px) {
  .content-section {
    .blocPage {
      padding: 100px clamp(20px, 25vw, 75px);
    }
  }

  .banner-image {
    height: 150px;
  }
}

@media screen and (max-width: 700px) {
  .section-separator {
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .content-section {
    .blocPage {
      padding: 75px 20px;
    }
  }
}

@media screen and (max-width: 400px) {
  .content-section {
    .blocPage {
      .content-section {
        .network {
          display: none;
        }
      }
    }
  }
}
</style>
