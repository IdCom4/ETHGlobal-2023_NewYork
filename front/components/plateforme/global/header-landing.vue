<template>
  <section class="header-landing-user">
    <!-- BACKGROUND -->
    <nuxt-img class="header-landing-user__bg-img" loading="lazy" :src="backgroundImage" :alt="altBackgroundImage" />

    <!-- CONTENT -->
    <div class="header-landing-user__container">
      <!-- TEXT -->
      <div class="header-landing-user__container--text-value">
        <h2>{{ title }}</h2>
        <button class="btn_call-to-action">
          <nuxt-link :to="link">
            {{ subtitle }}
          </nuxt-link>
        </button>
      </div>

      <!-- DESIGN CARD -->
      <div class="header-landing-user__container--cards-stamp">
        <div class="float-section">
          <card-stamp class="card-stamp-top" :user-pic="cardTop.pic" :title="cardTop.status" :subtitle="cardTop.subtitle" :tags="cardTop.tags" />
          <card-stamp
            class="card-stamp-bottom"
            :user-pic="cardBottom.pic"
            :title="cardBottom.status"
            :subtitle="cardBottom.subtitle"
            :describe="cardBottom.description"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: '/'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  altBackgroundImage: {
    type: String,
    default: ''
  }
})

const cardTop = {
  status: 'MECANICIEN',
  subtitle: 'Bayard Arcouet',
  pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg',
  tags: ['DETAILING', 'VIDANGE', 'MECANIQUE']
}

const cardBottom = {
  status: 'AUTOMOBILISTE',
  subtitle: 'John Doe',
  pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/1.jpg',
  description: 'Je souhaite faire réparer mon véhicule 😊👍'
}
</script>

<style lang="scss" scoped>
.header-landing-user {
  position: relative;
  max-width: 100%;
  height: 90vh;
  &__bg-img {
    width: 100%;
    height: 90vh;
    object-fit: cover;
  }

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 2000px;
    margin: auto;
    height: 50%;
    &--text-value {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 50%;
      padding-left: 100px;

      h2 {
        white-space: pre-wrap;
        margin-bottom: 25px;
        text-align: left;
        text-transform: unset;
        line-height: 35px;
        font-size: 30px;
        color: $white;
        &::after {
          display: none;
        }
      }
      button {
        max-width: 65%;
        text-transform: unset;
        text-align: left;
        font-family: 'Nunito';
        font-weight: 400;
        font-style: normal;
        a {
          color: $black;
        }
      }
    }

    &--cards-stamp {
      position: relative;
      width: 50%;
      margin-right: 50px;

      .float-section {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        & > * {
          margin-bottom: -30px;
          box-shadow: 2px 2px 10px #000000a2;
          cursor: default;
        }
        .card-stamp-top {
          margin-left: 17vw;
        }
        .card-stamp-bottom {
          position: relative;
          margin-left: 20vw;
          z-index: 90;
        }
      }
    }
  }
}

@media screen and (max-width: 840px) {
  .header-landing-user {
    &__container {
      flex-direction: column;
      justify-content: center;
      &--text-value {
        width: 100%;
        height: 50%;
        padding: 0;
        margin: 0 10%;
        h2 {
          width: 75%;
          line-height: 27px;
          font-size: 22px;
        }
      }
      &--cards-stamp {
        height: 50%;
        margin: auto;
        .float-section {
          margin: auto;
          .card-stamp-top {
            margin-left: 20px;
          }
          .card-stamp-bottom {
            margin-left: 40px;
          }
        }
      }
    }
  }
}

@media screen and (max-height: 620px) and (max-width: 839px) {
  .header-landing-user {
    &__container {
      top: 30%;
      &--cards-stamp {
        .float-section {
          top: 100%;
        }
      }
    }
  }
}
</style>
