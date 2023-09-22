<template>
  <div>
    <article v-for="(article, i) in articles" :id="useNormalize(article.title)" :key="`article-${i}`" class="article">
      <h4 class="article__title">
        <strong>{{ article.title }}</strong>
      </h4>
      <div class="article__body">
        <div class="article__body--content">
          <!-- Attention: The `v-html` directive may pose security risks such as XSS attacks. 
            Be sure to filter and validate all user data before displaying it with this directive. -->
          <div class="article__body--text" :class="{ hidden: showAll[i] }" v-html="useEncodeHtml(article.content)" />
          <img v-show="showAll[i]" :src="article.image" :alt="article.alt" class="article__img" />
        </div>
        <button v-show="showAll[i]" class="btn_call-to-action btn_booked">
          <NuxtLink :to="boxUrl"> RÉSERVEZ NOS {{ boxName }} </NuxtLink>
        </button>
      </div>
      <div class="view-more-btn">
        <button :title="showAll[i] ? 'Voir moins' : 'Voir plus'" class="btn_functional" @click="showAll[i] = !showAll[i]">
          {{ showAll[i] ? 'Voir moins' : 'Voir plus' }}
        </button>
      </div>
    </article>
  </div>
</template>

<script setup>
const props = defineProps({
  postSlug: {
    type: String,
    default: '/'
  },
  articles: {
    type: Array,
    default: () => []
  },
  boxName: {
    type: String,
    default: ''
  },
  boxUrl: {
    type: String,
    default: ''
  }
})

const showAll = ref(props.articles ? Array(props.articles.length).fill(false) : [])

onMounted(() => {
  const route = useRoute()
  if (route.hash) {
    const articleId = route.hash.substring(1) // remove the #
    const index = props.articles.findIndex((article) => useNormalize(article.title) === articleId)
    if (index >= 0) {
      showAll.value[index] = true
    }
  }
})
</script>

<style lang="scss">
.article {
  margin: 50px 0;
  &__title {
    width: 75%;
    text-decoration: underline;
    text-transform: initial;
    font-size: 28px;
  }
  &__img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    margin: 10px 0;
  }
  &__body {
    &--content {
      max-width: 600px;
      margin: auto;
      line-height: 14px;
      p,
      ol,
      ul,
      li {
        margin: 500px auto;
        font-size: 16px;
        font-weight: 500;
      }
    }
    &--text {
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 5.3em;
      p {
        margin: 50px 0;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        a {
          text-decoration: underline;
          font-style: italic;
        }
      }
      ul {
        list-style-type: square;
      }
      ol {
        list-style-type: decimal;
      }
      ol,
      ul {
        width: 75%;
        margin: 15px 0;
        font-size: 12px;
        li {
          margin: 12px 0 12px 27px;
          font-family: 'Nunito';
          font-weight: 300;
        }
      }
    }
    img {
      height: 300px;
    }
    button {
      margin: 35px 18%;
      a {
        color: #000;
      }
    }
  }
  .view-more-btn {
    width: 100%;
    text-align: right;
    button {
      margin-right: 18%;
    }
  }
  .hidden {
    max-height: none;
  }
}

@media screen and (max-width: 700px) {
  .article {
    &__body {
      .btn_booked {
        display: none;
      }
    }
  }
}
</style>
