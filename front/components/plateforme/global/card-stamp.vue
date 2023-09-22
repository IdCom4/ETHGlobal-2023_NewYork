<template>
  <div class="card-stamp">
    <nuxt-img class="user-pic" :src="userPic" loading="lazy" alt="" />
    <div class="container-wrapper">
      <div class="main">
        <div class="title">{{ props.title }}</div>
        <div class="info-sub">
          <div class="subtitle">{{ props.subtitle }}</div>
          <div v-if="props.stars" class="stars">
            <fa :icon="['fas', 'star']" :width="10" />
            <fa :icon="['fas', 'star']" :width="10" />
            <fa :icon="['fas', 'star']" :width="10" />
            <fa :icon="['fas', 'star']" :width="10" />
            <fa :icon="['fas', 'star']" :width="10" />
          </div>
        </div>
        <ul class="tags">
          <li v-for="(tag, index) in tags" :key="index" class="tag">{{ tag }}</li>
        </ul>
      </div>
      <div class="describes">
        <p>{{ props.describe }}</p>
        <p>{{ props.describeMore }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  userPic: {
    type: String,
    default: '/'
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  stars: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Array,
    default: () => []
  },
  describe: {
    type: String,
    default: ''
  },
  describeMore: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.card-stamp {
  display: flex;
  width: 370px;
  margin-right: 25px;
  padding: 15px;
  gap: 15px;
  background-color: #fff;
  border: solid 0.5px;
  font-family: 'Nunito';
  .user-pic {
    min-width: 100px;
    height: 100px;
    object-fit: cover;
  }
  .container-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
    .main {
      display: flex;
      flex-direction: column;
      gap: 7px;
      .title {
        font-family: 'Montserrat';
        font-weight: 700;
      }
      .info-sub {
        display: flex;
        align-items: center;
        .subtitle {
          font-size: 12px;
          width: 75%;
        }
        .stars {
          widows: 25%;
          white-space: nowrap;
        }
      }
      .tags {
        display: flex;
        justify-content: left;
        font-size: 0.6em;
        .tag {
          border: solid 0.5px;
          margin: 3px;
          padding: 3px 7px;
          font-family: 'Montserrat';
          font-style: italic;
          font-size: clamp(0.8em, 0.8vw, 10px);
        }
      }
    }
    .describes {
      display: flex;
      :first-child {
        width: 80%;
      }
      :nth-child(2) {
        white-space: nowrap;
      }
    }
  }
}

@media screen and (max-width: 1050px) {
  .card-stamp {
    width: 300px;
    padding: 10px;

    .user-pic {
      min-width: 65px;
      height: 65px;
      width: 65px;
      overflow: hidden;
    }

    .container-wrapper {
      padding: 0;
    }
  }
}

@media screen and (max-width: 359px) {
  .card-stamp {
    width: 240px;
    .container-wrapper {
      .main {
        .tags {
          .tag {
            // border: solid 0.5px;
            margin: 2px;
            padding: 3px 5px;
            font-size: 5.5px;
          }
        }
      }
    }
  }
}
</style>
