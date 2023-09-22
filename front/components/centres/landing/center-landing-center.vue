<template>
  <div class="sec-center">
    <div class="container">
      <div class="vertical-view">
        <p>
          <fa icon="fa-solid fa-circle-arrow-down" class="icon" />
          <span>Nos photos du centre</span>
        </p>
        <p class="pagination">{{ index + 1 }} <span class="pagination--separator"></span> {{ centreImages.length }}</p>
      </div>
      <div class="content">
        <vmc-header text-color="white" bar-color="#3DFFEB" text="LE CENTRE AUTOMOBILE" />
        <p>
          Lieu d’échange autour de l’automobile, le Centre ValueMyCar Rambouillet vous propose de nombreux espaces de confort et de détente :
        </p>
        <ul>
          <li>Cuisine aménagée</li>
          <li>Douche</li>
          <li>Machine à café</li>
          <li>Espaces de repos</li>
        </ul>
        <div class="content__pictures">
          <vmc-carousel
            v-model="index"
            class="img-container"
            :contents="centreImages"
            :auto-scroll="{ type: 'slideBySlide', delayInMs: 3000, scrollSpeed: 15, restartDelay: 1500 }"
          >
            <template #slide="{ data: { content } }">
              <img :src="(content as string)" alt="" />
            </template>
          </vmc-carousel>
        </div>
      </div>
    </div>
    <div class="container-mobile">
      <vmc-header current-color="white" separator="white" text="LE CENTRE AUTOMOBILE" />

      <div class="container-mobile__pictures">
        <vmc-carousel
          v-model="index"
          class="img-container"
          :contents="centreImages"
          :auto-scroll="{ type: 'slideBySlide', delayInMs: 3000, scrollSpeed: 15, restartDelay: 1500 }"
        >
          <template #slide="{ data: { content } }">
            <img :src="(content as string)" alt="" />
          </template>
        </vmc-carousel>

        <p class="pagination">{{ index + 1 }} <span class="pagination--separator"></span> {{ centreImages.length }}</p>
      </div>
    </div>
    <nuxt-img
      class="sec-center__img"
      src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/Photo-exterieur-Mustang-1.webp"
    />
  </div>
</template>

<script setup lang="ts">
const index = ref<number>(0)

const centreImages = [
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Landings-pages_center/centre/BGZFE8065.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/ValueCenter-Rambouillet_Centre-auto-et-moto-en-libre-service-Accueil-3.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/ValueCenter-Rambouillet_Centre-auto-et-moto-en-libre-service-Couloir-3-1.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/ValueCenter-Rambouillet_Centre-auto-et-moto-en-libre-service-Accueil-4-1.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/Lamborghini-Gallardo-Exterieur-centre-1.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/ValueCenter-Rambouillet_Centre-auto-et-moto-en-libre-service-Couloir-2.webp'
]
</script>

<style lang="scss" scoped>
.sec-center {
  display: flex;
  width: 100vw;
  height: auto;
  max-height: 95vh;
  overflow: hidden;
  .container {
    display: flex;
    justify-content: space-between;
    width: 45vw;
    height: auto;
    background-color: $color-dark-blue;
    box-shadow: inset 0 40px 70px #000000c5;
    color: $color-offwhite;
    overflow: hidden;
    .vertical-view {
      width: 7%;
      height: 50%;
      margin: auto 40px auto 17%;
      padding: 0;
      text-align: center;
      border-left: #fff solid 1px;
      font-family: 'Montserrat';
      writing-mode: vertical-rl;
      text-orientation: sideways;
      direction: ltr;
      transform: rotate(180deg);
      p {
        width: 100%;
        margin: auto;
        span {
          height: auto;
          padding-top: 7px;
        }
        .icon {
          margin-right: 5px;
        }
      }
      .pagination {
        position: absolute;
        height: fit-content;
        right: 50%;
      }
    }
    .content {
      width: 75%;
      height: auto;
      margin-top: 50px;
      & > * {
        font-size: 16px;
        white-space: break-spaces;
      }
      h2 {
        color: $color-offwhite;
        margin-bottom: 50px;
        font-size: 26px;

        &::after {
          background-color: $color-neon-blue;
        }
      }
      p {
        width: 90%;
        line-height: 20px;
      }
      ul {
        font-family: 'Nunito';
        margin: 10px 0 50px 50px;
        li {
          margin: 7px 0;
          list-style: disc;
        }
      }
      &__pictures {
        width: 100%;
        height: 53%;
        overflow: auto;
        padding-right: 7px;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .img-container {
          position: relative;
          display: flex;
          flex-direction: column;
          height: auto;
          overflow-y: hidden;
          cursor: grab;
          img {
            display: inline-block;
            position: relative;
            width: 100%;
            height: 15vw;
            margin-bottom: 5px;
            object-fit: cover;
            object-position: bottom left;
            align-self: flex-end;
          }
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          color: $color-offwhite;
          margin: 10px;
          &--separator {
            display: inline-block;
            height: 1px;
            width: 35px;
            margin: 0 5px;
            background-color: #fff;
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
  .container-mobile {
    display: none;
  }
  &__img {
    width: 55vw;
    object-fit: cover;
    object-position: right;
  }
}

@media screen and (max-width: 910px) {
  .sec-center {
    .container {
      .vertical-view {
        margin: auto 40px auto 5%;
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .sec-center {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    .container {
      display: none;
    }
    .container-mobile {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      padding: 50px 0 20px 20px;
      h2 {
        color: $color-offwhite;
        margin-bottom: 50px;
        &::after {
          background-color: $color-offwhite;
        }
      }
      .content {
        color: #040404;
        margin-bottom: 100px;

        p {
          width: 90%;
          line-height: 20px;
        }
        ul {
          font-family: 'Nunito';
          margin: 10px 0 50px 50px;
          li {
            margin: 7px 0;
            list-style: disc;
          }
        }
      }
      &__pictures {
        text-align: center;
        height: fit-content;
        .img-container {
          position: relative;
          display: flex;
          flex-direction: row;
          height: 170px;
          backdrop-filter: blur(2px);
          white-space: nowrap;
          overflow: auto;
          box-shadow: 3px 3px 25px;
          -ms-overflow-style: none;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
          img {
            display: inline-block;
            position: relative;
            margin-right: 15px;
          }
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          color: $black;
          font-size: 16px;
          font-weight: 700;
          margin: 10px;
          &--separator {
            display: inline-block;
            height: 1px;
            width: 35px;
            margin: 0 5px;
            background-color: $black;
          }
        }
      }
    }
    &__img {
      width: 100vw;
      height: 100vh;
      object-fit: cover;
    }
  }
}
</style>
