<template>
  <section class="center-box-possible-operations">
    <!-- header / title -->
    <vmc-header class="title --desktop" text="PRESTATIONS RÉALISABLES" />
    <h4 class="title --mobile bold">PRESTATIONS RÉALISABLES</h4>

    <!-- topics list -->
    <div v-for="(topic, i) in topics" :key="`topic-${i}`">
      <!-- dropdown toggle -->
      <button class="topic" @click="showAll[i] = !showAll[i]">
        <h6>{{ topic.topic }}</h6>
        <fa icon="fa-solid fa-chevron-down" :class="['dropdown-icon', { up: showAll[i] }]" />
      </button>

      <!-- topic content -->
      <div :class="['container', { isOpen: showAll[i] }]">
        <!-- duration -->
        <duration :duration="topic.duration" :level="topic.level" />

        <!-- description -->
        <ul class="article">
          <li v-for="(article, j) in topic.articles" :key="`question-${j}`" :title="article.title" :class="`fadeInUp-${i}`">
            <NuxtLink :to="`../blog/${props.box}_${useNormalize(topic.topic)}#${useNormalize(article.title)}`">
              <strong>{{ article.title }}</strong>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const props = defineProps({
  topics: {
    type: Array<BlogTopics>,
    default: () => []
  },
  box: {
    type: String,
    default: ''
  }
})

const showAll = ref(props.topics ? Array(props.topics.length).fill(false) : [])
</script>

<style lang="scss" scoped>
.center-box-possible-operations {
  padding: 100px clamp(20px, 25vw, 200px);

  .title.--mobile {
    display: none;
  }
  .topic {
    /* Disable the bounce animation */
    &:focus {
      animation: none;
    }

    color: $black;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 15px;
    background-color: transparent;

    h6 {
      text-align: left;
      font-family: 'Montserrat';
      font-weight: 400;
      font-style: normal;
      text-transform: initial;
      font-size: 14px;
    }

    .dropdown-icon {
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .dropdown-icon.up {
      transform: rotate(-180deg);
    }
  }
  .container {
    width: 100%;
    overflow: hidden;
    height: 0;
  }
  .isOpen {
    height: auto;
    .topic-info {
      line-height: 25px;
      margin: 15px 0 25px 0;
      font-family: 'Montserrat';
      font-size: 12px;
      font-weight: 600;
      div {
        display: flex;
        align-items: center;
      }
      .dropdown-icon {
        margin-right: 10px;
      }
    }
    .article {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
      font-family: 'Nunito';
      padding: 0 27px;

      a {
        font-size: 13px;
        font-weight: 600;
        color: #000;
        &:hover {
          font-weight: 700;
        }
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  .center-box-possible-operations {
    padding: 100px clamp(20px, 25vw, 75px);
  }
}

@media screen and (max-width: 700px) {
  .center-box-possible-operations {
    .title {
      &.--desktop {
        display: none;
      }

      &.--mobile {
        display: block;
        margin-bottom: 30px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .center-box-possible-operations {
    padding: 75px 20px;
  }
}
</style>
