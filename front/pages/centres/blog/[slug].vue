<template>
  <div>
    <img :src="IMAGE" :alt="ALT" class="top-img" />
    <main class="bloc-page">
      <h2 class="theme --var-bottom">{{ useEncodeHtml(THEME) }}</h2>
      <div class="intro" v-html="INTRO" />
      <duration :duration="DURATION" :level="LEVEL" />
      <button class="btn_call-to-action">
        <NuxtLink :to="`${BASE_URL_BOXES}/${CURRENT_BOX_URL}`"> NOS {{ CURRENT_BOX_TITLE }} </NuxtLink>
      </button>
      <article-blog :post-slug="postSlug" :articles="ARTICLES" :box-name="CURRENT_BOX_TITLE" :box-url="boxUrl" />
    </main>
    <center-mobile-navbar />
  </div>
</template>

<script setup>
import { TOPICS } from '@/constants/centres/articles'
import { BASE_URL_BOXES } from '@/constants/constants'

const route = useRoute()
const postSlug = route.params.slug

let boxUrl, IMAGE, ALT, THEME, CURRENT_BOX_URL, CURRENT_BOX_TITLE, INTRO, ARTICLES, DURATION, LEVEL

const getTopics = (topics, currentBoxUrl, currentBoxTitle) => {
  topics.forEach((topic) => {
    if (postSlug.includes(useNormalize(topic.topic))) {
      CURRENT_BOX_URL = currentBoxUrl
      CURRENT_BOX_TITLE = currentBoxTitle

      boxUrl = `${BASE_URL_BOXES}/${CURRENT_BOX_URL}`
      IMAGE = topic.image
      ALT = topic.alt
      THEME = topic.topic
      INTRO = topic.intro
      ARTICLES = topic.articles
      DURATION = topic.duration
      LEVEL = topic.level
    }
  })
}

postSlug.includes('box-mecanique') && getTopics(TOPICS.MECANIC, 'box-mecanique', 'box de mécanique')
postSlug.includes('box-lavage') && getTopics(TOPICS.WASHING, 'box-lavage', 'box de lavage')
postSlug.includes('box-detailing') && getTopics(TOPICS.DETAILING, 'box-detailing', 'box de detailing')
</script>

<style lang="scss">
.top-img {
  width: 100%;
  height: 60vh;
  object-fit: cover;
}
.bloc-page {
  display: flex;
  flex-direction: column;
  max-width: 1220px;
  margin: auto;
  gap: 40px;
  padding: 37px 20px;
  .theme {
    white-space: normal;
    text-align: left;
    font-size: 28px;
    font-style: normal;
  }
  .intro {
    max-width: 750px;
    p {
      margin: 10px 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
  button {
    a {
      color: #000;
    }
  }
}
</style>
