<template>
  <section :class="{ 'section-style-1': firstSectionStyle, 'section-style-2': secondSectionStyle, 'section-style-3': thirdSectionStyle }">
    <div class="side content">
      <div class="container">
        <h2 :class="{ '--var-bottom': secondSectionStyle }">{{ title }}</h2>
        <div class="middle-content">
          <div class="description" v-html="description"></div>
          <p class="boxes">
            N°Boxes <span v-for="(box, index) in boxes" :key="index">{{ box }}</span>
          </p>
        </div>
        <nuxt-link :to="viewMoreLink" class="view-more">
          <fa icon="fa-solid fa-circle-arrow-right" class="icon" />
          <p>En savoir plus</p>
        </nuxt-link>
        <div class="display-btn">
          <nuxt-link :to="buttonLink">
            <button class="btn_call-to-action">{{ buttonValue }}</button>
          </nuxt-link>
        </div>
        <slot></slot>
      </div>
    </div>
    <div class="side picture"><img :src="picture" :alt="alt" /></div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  picture: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  boxes: {
    type: Array,
    default: () => []
  },
  viewMoreLink: {
    type: String,
    default: ''
  },
  buttonLink: {
    type: String,
    default: ''
  },
  buttonValue: {
    type: String,
    default: ''
  },
  firstSectionStyle: {
    type: Boolean,
    default: false
  },
  secondSectionStyle: {
    type: Boolean,
    default: false
  },
  thirdSectionStyle: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
section {
  display: flex;
  min-height: 80vh;
  max-height: 92vh;
  overflow: hidden;
  background-color: $color-dark-blue;
  box-shadow: inset -70px 50px 100px 70px #00000083;
  .side {
    width: 50%;
  }
  &.section-style-1 {
    .content {
      margin: auto;
      padding: 25px 0;
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        margin: 20px 10px;
        h2 {
          justify-content: flex-start;
          text-align: left;
          white-space: break-spaces;
          width: 100%;
          color: $color-offwhite;
          &::after {
            display: none;
          }
        }
        .middle-content {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: 80%;
          margin: 100px 70px;
          border-left: solid $color-neon-blue 0.5px;
          .description,
          .boxes {
            font-family: 'Nunito';
            color: $color-offwhite;
            font-size: clamp(0.7rem, 1.7vw, 1.3rem);
            align-items: center;
            margin-left: 30px;
            & > * {
              line-height: 22px;
              height: auto;
            }
          }
          .description {
            margin-bottom: 40px;
          }
          .boxes {
            display: flex;
            justify-content: space-between;
            width: 30%;
            min-width: 110px;
            font-weight: 500;
            span {
              font-family: 'Montserrat';
              font-style: italic;
              font-weight: 800;
              color: $color-offwhite;
              margin: auto;
            }
          }
        }
        .view-more {
          display: none;
        }
        .display-btn {
          width: 100%;
          text-align: center;
          button {
            margin: auto;
          }
        }
      }
    }
  }

  &.section-style-2 {
    display: flex;
    flex-direction: row;
    .content {
      margin: auto;
      padding: 25px 0;
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        margin: auto 5% auto 13%;
        h2 {
          justify-content: flex-start;
          text-align: left;
          margin: 0;
          margin-bottom: 14%;
          white-space: wrap;
          color: $color-offwhite;
          &::after {
            background-color: $color-neon-blue;
          }
        }
        .middle-content {
          display: flex;
          justify-content: space-between;
          flex-direction: column-reverse;
          width: 80%;
          margin: 25px 0;
          gap: 15px;

          .description,
          .boxes {
            font-family: 'Nunito';
            color: $color-offwhite;
            font-size: clamp(0.7rem, 1.7vw, 1.3rem);
            margin-bottom: 10%;
          }
          .boxes {
            display: flex;
            justify-content: space-between;
            width: 30%;
            min-width: 150px;
            font-weight: 500;
            span {
              font-family: 'Montserrat';
              font-style: italic;
              font-weight: 800;
              color: $color-offwhite;
            }
          }
          .description {
            & > * {
              margin-bottom: 5px;
            }
          }
        }
        .view-more {
          display: flex;
          margin-bottom: 50px;
          .fa {
            color: #fff;
            margin-right: 7px;
          }
          p {
            font-size: 19px;
            font-weight: bold;
            text-decoration: underline;
            color: $color-offwhite;
          }
        }
        .display-btn {
          width: 100%;
          button {
            margin: auto;
          }
        }
      }
    }
  }

  .picture {
    height: auto;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}

@media screen and (max-width: 770px) {
  section {
    flex-direction: column-reverse !important;
    max-height: none;
    box-shadow: inset 0px 60vh 60px 0 rgba(0, 0, 0, 0.578);
    .side {
      width: 100%;
    }
    &.section-style-1,
    &.section-style-2 {
      .content {
        height: auto;
        width: 80%;
        margin: auto;
        .container {
          padding: 25px 0;
          width: 80vw;
          margin: auto;
          h2 {
            font-size: 17px;
            margin-bottom: 15px;
          }
          .middle-content {
            margin: 25px 0;
            width: 83%;
            gap: 20px;
            .boxes {
              width: 20%;
            }
            .description {
              margin-bottom: 16px;
              .largest {
                width: calc(100% - 50px);
              }
            }
          }

          .view-more {
            margin-bottom: 0;
            p {
              font-size: 14px;
            }
          }
          .display-btn {
            width: auto;
            margin: 20px auto;
          }
        }
      }

      &.section-style-2 {
        .display-btn {
          display: none;
        }
      }
      .picture {
        height: auto;
        min-height: 35vh;
        width: 100%;
        img {
          height: 50vh;
        }
      }
    }
  }
}
</style>
